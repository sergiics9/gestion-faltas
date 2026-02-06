import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  
  // Creamos el formulario tipado y no-nulo
  loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  
  onSubmit() {
    if (this.loginForm.valid) {
      // .getRawValue() es seguro porque usamos nonNullable
      const { username, password } = this.loginForm.getRawValue();
      console.log('Login:', username, password);
      
      // Redirigir a guardia-panel después del login exitoso
      this.router.navigate(['/app/guardias/panel']);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
