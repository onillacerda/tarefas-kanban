import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-kanban-board',
  standalone: false,
  templateUrl: './kanban-board.component.html',
})
export class KanbanBoardComponent implements OnInit {
  tasks: Task[] = [];

  showEditModal: boolean = false;
  editTaskData: Task = this.resetEditTask();
  
  taskIdToDelete: string | null = null;
  showDeleteModal = false;

  draggedTask!: Task;

  constructor(
    private taskService: TaskService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  // 🆕 Formulário para nova task
  newTask: Partial<Task> = {
    title: '',
    responsible: '',
    dueDate: '',
    status: 'pendente'
  };

  // ➕ Criar tarefa
  createTask() {
    if (!this.newTask.title || !this.newTask.responsible || !this.newTask.dueDate) {
      this.notification.show('Preencha todos os campos obrigatórios!', 'error');
      return;
    }

    const taskToCreate: Task = {
      title: this.newTask.title,
      responsible: this.newTask.responsible,
      dueDate: this.newTask.dueDate!,
      status: 'pendente'
    };

    this.taskService.createTask(taskToCreate).subscribe({
      next: () => {
        this.loadTasks();
        this.newTask = { title: '', responsible: '', dueDate: '', status: 'pendente' };
        this.notification.show('Tarefa criada com sucesso!', 'success');
      },
      error: () => {
        this.notification.show('Erro ao criar tarefa.', 'error');
      },
    });
  }

  // 🔄 Carregar tarefas
  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
      },
      error: () => {
        this.notification.show('Erro ao carregar tarefas.', 'error');
      },
    });
  }

  // 🔍 Filtrar por status
  getTasksByStatus(status: Task['status']): Task[] {
    return this.tasks.filter((task) => task.status === status);
  }

  // 🔄 Mudar status da tarefa
  moveTask(task: Task, newStatus: Task['status']) {
    if (task.status === newStatus) return;
    const updatedTask = { ...task, status: newStatus };
    this.taskService.updateTask(task._id!, updatedTask).subscribe({
      next: () => {
        this.loadTasks();
        this.notification.show(`Movido para "${newStatus}"`, 'info');
      },
      error: () => {
        this.notification.show('Erro ao mover tarefa.', 'error');
      },
    });
  }

  // Abrir o modal de confirmação
  openDeleteModal(id: string) {
    this.taskIdToDelete = id;
    this.showDeleteModal = true;
  }

  // Cancelar
  cancelDelete() {
    this.taskIdToDelete = null;
    this.showDeleteModal = false;
  }

  // Confirmar exclusão
  confirmDelete() {
    if (!this.taskIdToDelete) return;
    this.taskService.deleteTask(this.taskIdToDelete).subscribe({
      next: () => {
        this.loadTasks();
        this.notification.show('Tarefa excluída com sucesso!', 'success');
        this.showDeleteModal = false;
        this.taskIdToDelete = null;
      },
      error: () => {
        this.notification.show('Erro ao excluir tarefa.', 'error');
        this.showDeleteModal = false;
        this.taskIdToDelete = null;
      },
    });
  }

  // 🗑️ Deletar tarefa (Código Antigo)
  deleteTask(id: string) {
    if (confirm('Deseja realmente excluir esta tarefa?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.loadTasks();
          this.notification.show('Tarefa excluída com sucesso!', 'success');
        },
        error: () => {
          this.notification.show('Erro ao excluir tarefa.', 'error');
        },
      });
    }
  }

  // ✏️ Abrir modal de edição
  openEditModal(task: Task) {
    this.editTaskData = { ...task };
    this.showEditModal = true;
  }

  // ❌ Fechar modal
  closeEditModal() {
    this.showEditModal = false;
    this.editTaskData = this.resetEditTask();
  }

  // 💾 Salvar edição
  saveEdit() {
    if (!this.editTaskData._id) return;

    this.taskService.updateTask(this.editTaskData._id, this.editTaskData).subscribe({
      next: () => {
        this.loadTasks();
        this.closeEditModal();
        this.notification.show('Tarefa atualizada com sucesso!', 'success');
      },
      error: () => {
        this.notification.show('Erro ao atualizar tarefa.', 'error');
      },
    });
  }

  // 🔄 Resetar dados do form/modal
  resetEditTask(): Task {
    return {
      title: '',
      responsible: '',
      status: 'pendente',
      dueDate: '',
    };
  }

//  dragged - Arrastar e Soltar

onDragStart(event: DragEvent, task: Task) {
  this.draggedTask = task;
  event.dataTransfer?.setData('text/plain', task._id!);
}

onDragOver(event: DragEvent) {
  event.preventDefault();
}

onDrop(event: DragEvent, newStatus: Task['status']) {
  event.preventDefault();

  if (this.draggedTask && this.draggedTask.status !== newStatus) {
    const updatedTask = { ...this.draggedTask, status: newStatus };
    this.taskService.updateTask(updatedTask._id!, updatedTask).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (err) => {
        console.error('Erro ao mover tarefa:', err);
      },
    });
  }
}

}
