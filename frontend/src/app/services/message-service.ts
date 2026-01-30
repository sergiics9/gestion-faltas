import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  show(
    message: string,
    title: MessageTitle,
    icon: SweetAlertIcon = 'info',
    options?: SweetAlertOptions,
  ): void {
    Swal.fire({
      icon,
      title,
      text: message,
      confirmButtonColor: '#33C3F0',
      timer: 2500,
      timerProgressBar: true,
      ...options,
    });
  }

  success(message: string, title: MessageTitle.SUCCESS): void {
    this.show(message, title, 'success');
  }

  error(message: string, title: MessageTitle.ERROR): void {
    this.show(message, title, 'error', { timer: undefined });
  }

  warning(message: string, title: MessageTitle.WARNING): void {
    this.show(message, title, 'warning');
  }

  info(message: string, title: MessageTitle.INFO): void {
    this.show(message, title, 'info');
  }
}

export enum MessageTitle {
  SUCCESS = '¡Éxito!',
  ERROR = '¡Ups!',
  WARNING = 'Atención',
  INFO = 'Información',
}
