import { Component } from '@angular/core';
import { Roles } from '../../../types/roles';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly role!: Roles;
}
