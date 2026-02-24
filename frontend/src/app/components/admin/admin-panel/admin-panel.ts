import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/header/header';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-panel',
  imports: [Header, RouterLink],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.scss',
})
export class AdminPanel {
  auth = inject(AuthService);
}
