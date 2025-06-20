import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-task-form',
  standalone: false,
  templateUrl: './task-form.component.html',
})
export class TaskFormComponent implements OnInit {
  @Input() taskToEdit?: Task;
  @Output() formSubmit = new EventEmitter<void>();

  taskForm!: FormGroup;

  statusList = ['pendente', 'em andamento', 'concluída'];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: [this.taskToEdit?.title || '', Validators.required],
      responsible: [this.taskToEdit?.responsible || '', Validators.required],
      status: [this.taskToEdit?.status || 'pendente', Validators.required],
      dueDate: [this.taskToEdit?.dueDate || '', Validators.required],
    });
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      this.notification.show('Por favor, preencha todos os campos.', 'error');
      return;
    }

    const taskData: Task = {
      ...this.taskToEdit,
      ...this.taskForm.value,
    };

    this.isLoading = true;

    const request = this.taskToEdit?._id
      ? this.taskService.updateTask(taskData._id!, taskData)
      : this.taskService.createTask(taskData);

    request.subscribe({
      next: () => {
        const msg = this.taskToEdit ? 'Tarefa atualizada com sucesso!' : 'Tarefa criada com sucesso!';
        this.formSubmit.emit();
        this.taskForm.reset();
        this.notification.show(msg, 'success');
      },
      error: () => {
        this.notification.show('Erro ao criar a tarefa.', 'error');
      },
      complete: () => {
        this.isLoading = false;
        this.notification.show('Operação concluída.', 'success');
      }
    });
  }

  onCancel() {
    this.taskForm.reset();
    this.formSubmit.emit();
    this.notification.show('Operação cancelada.', 'info');
  }
}
