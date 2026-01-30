import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-messages',
  imports: [],
  templateUrl: './messages.html',
  styleUrl: './messages.scss',
})
export class ConfirmDialog {}

export function showSuccess(message: string, title: string | '¡Éxito!') {
  Swal.fire({
    icon: 'success',
    title: title,
    text: message,
    confirmButtonColor: '#33C3F0',
    timer: 2500,
    timerProgressBar: true,
  });
}
