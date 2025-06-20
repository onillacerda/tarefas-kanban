import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private counter = 0; // controle único dos IDs para cada notificação

  /**
   * Exibe uma notificação
   * @param message Texto da notificação
   * @param type Tipo: 'success' | 'error' | 'info' | 'warning'
   */
  show(message: string, type: NotificationType = 'info') {
    const id = this.counter++;
    const newNotification: Notification = { id, type, message };
    const current = this.notificationsSubject.getValue();
    this.notificationsSubject.next([...current, newNotification]);

    // Remove automaticamente após 3 segundos
    setTimeout(() => this.dismiss(id), 3000);
  }

  /**
   * Remove uma notificação específica
   * @param id ID da notificação
   */
  dismiss(id: number) {
    const current = this.notificationsSubject.getValue();
    const updated = current.filter(n => n.id !== id);
    this.notificationsSubject.next(updated);
  }

  /**
   * Limpa todas as notificações
   */
  clearAll() {
    this.notificationsSubject.next([]);
  }
}
