import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-kanban-board',
  standalone: false,
  templateUrl: './kanban-board.component.html',
})
export class KanbanBoardComponent implements OnInit {
  tasks: Task[] = [];

  // Controle do modal
  showEditModal: boolean = false;
  editTaskData: Task = this.resetEditTask();

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  newTask: Partial<Task> = {
    title: '',
    responsible: '',
    dueDate: '',
    status: 'pendente'
  };
  
  createTask() {
    if (!this.newTask.title || !this.newTask.responsible || !this.newTask.dueDate) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }
  
    // Preenchendo status default caso o usuário não selecione
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
      },
      error: (err) => console.error('Erro ao criar tarefa', err),
    });
  }
  

  // 🔄 Carregar todas as tarefas
  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
      },
      error: (err) => {
        console.error('Erro ao carregar tarefas', err);
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
      next: () => this.loadTasks(),
      error: (err) => console.error('Erro ao mover tarefa', err),
    });
  }

  // 🗑️ Deletar tarefa
  deleteTask(id: string) {
    if (confirm('Deseja realmente excluir esta tarefa?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => this.loadTasks(),
        error: (err) => console.error('Erro ao excluir tarefa', err),
      });
    }
  }

  // ✏️ Abrir modal de edição
  openEditModal(task: Task) {
    this.editTaskData = { ...task }; // Clone dos dados para o form
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
      },
      error: (err) => console.error('Erro ao salvar edição', err),
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
}
