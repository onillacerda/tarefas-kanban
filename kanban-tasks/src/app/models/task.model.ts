export interface Task {
    _id?: string;
    title: string;
    responsible: string;
    status: 'pendente' | 'em andamento' | 'concluída';
    dueDate: string;
    createdAt?: string;
    updatedAt?: string;
  }
  