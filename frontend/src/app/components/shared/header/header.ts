import { Navbar } from './../navbar/navbar';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [Navbar],
  template: `
    <header>
      <app-navbar></app-navbar>
    </header>
  `,
  styleUrl: './header.scss',
})
export class Header {}
