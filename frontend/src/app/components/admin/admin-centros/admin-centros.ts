import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/header/header';

@Component({
  selector: 'app-admin-centros',
  imports: [Header, RouterLink],
  templateUrl: './admin-centros.html',
  styleUrl: './admin-centros.scss',
})
export class AdminCentros {}
