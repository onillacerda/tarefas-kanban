import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

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

  constructor(private fb: FormBuilder, private taskService: TaskService) {}

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
      return;
    }

    const taskData: Task = {
      ...this.taskToEdit,
      ...this.taskForm.value,
    };

    if (this.taskToEdit?._id) {
      this.taskService.updateTask(taskData._id!, taskData).subscribe(() => {
        this.formSubmit.emit();
        this.taskForm.reset();
      });
    } else {
      this.taskService.createTask(taskData).subscribe(() => {
        this.formSubmit.emit();
        this.taskForm.reset();
      });
    }
  }

  onCancel() {
    this.taskForm.reset();
    this.formSubmit.emit();
  }
}
