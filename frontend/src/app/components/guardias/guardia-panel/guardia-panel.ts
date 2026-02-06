import { Component } from '@angular/core';
import { Header } from '../../shared/header/header';
import { GuardiaHorario } from '../guardia-horario/guardia-horario';

@Component({
  selector: 'app-guardia-panel',
  imports: [Header, GuardiaHorario],
  templateUrl: './guardia-panel.html',
  styleUrl: './guardia-panel.scss',
})
export class GuardiaPanel {}
