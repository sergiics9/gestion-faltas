import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  // Nueva forma de inyectar dependencias en Angular moderno
  // private fb = inject(FormBuilder);
  // // Creamos el formulario tipado y no-nulo
  // loginForm = this.fb.nonNullable.group({
  //   username: ['', Validators.required],
  //   password: ['', Validators.required],
  // });
  // onSubmit() {
  //   if (this.loginForm.valid) {
  //     // .getRawValue() es seguro porque usamos nonNullable
  //     const { username, password } = this.loginForm.getRawValue();
  //     console.log('Login:', username, password);
  //   } else {
  //     this.loginForm.markAllAsTouched();
  //   }
  // }
}
