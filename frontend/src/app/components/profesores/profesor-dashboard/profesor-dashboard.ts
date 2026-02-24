import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/header/header';

@Component({
  selector: 'app-profesor-dashboard',
  imports: [Header, RouterLink],
  templateUrl: './profesor-dashboard.html',
  styleUrl: './profesor-dashboard.scss',
})
export class ProfesorDashboard {}
