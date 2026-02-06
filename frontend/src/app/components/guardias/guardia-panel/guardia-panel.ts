import { Component } from '@angular/core';
import { Header } from '../../shared/header/header';
import { GuardiaHorario } from '../guardia-horario/guardia-horario';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-guardia-panel',
  imports: [Header, GuardiaHorario, Footer],
  templateUrl: './guardia-panel.html',
  styleUrl: './guardia-panel.scss',
})
export class GuardiaPanel {}
