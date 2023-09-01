import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../api-rest/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError } from 'rxjs';
import { endpoint } from 'src/app/modules/api-rest/enviroments/endpoints';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {
  protected hide = true;
  protected myForm!: FormGroup;
  protected errorMessage: string = ''
  protected isLoading = false;

  constructor(private router: Router, private authService: AuthService, private fb: FormBuilder) {

  }

  ngOnInit() {
    if (this.authService.isSessionActive()) {
      this.router.navigate([endpoint.HOME]);
    }

    this.myForm = this.fb.group({
      username: new FormControl('', [Validators.required, Validators.minLength(4)]),
      password: new FormControl('', [Validators.required, Validators.minLength(4)])
    });
  }


  onSubmit() {
    if (this.myForm.valid) {
      this.isLoading = true;
      this.authService.login(this.myForm.value)
        .pipe(
          catchError((error) => {
            this.handleError(error);
            return [];
          })
        )
        .subscribe(
          success => {
            if (success) {
              this.router.navigate([endpoint.ROOT]);
            } else {
              this.myForm.setErrors({ invalidCredentials: true });
              this.handleError('');
            }

          });
    }

  }

  handleError(error: any) {
    this.isLoading = false;
    this.errorMessage = '*Incorrect username or password';
    console.error('Ocurrió un error durante el inicio de sesión ', error);
  }

}


