import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users/users.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
    selector: 'app-login',
    imports: [CommonModule, FormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
  firstname = '';
  lastname = '';
  login = '';
  password = '';
  error = '';
  signupMode = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private usersService: UsersService
  ) {}

  submit() {
    if (!this.signupMode) {
      this.auth.login(this.login, this.password).subscribe((ok) => {
        if (ok) {
          this.router.navigate(['/pollution/list']);
        } else {
          this.error = 'Identifiants invalides';
        }
      });
    } else {
      // attempt signup
      const user = {
        login: this.login,
        password: this.password,
        firstname: this.firstname,
        lastname: this.lastname,
      };
      this.auth.signup(user).subscribe((created) => {
        if (created) {
          this.router.navigate(['/pollution/list']);
        } else {
          this.error = 'Impossible de créer le compte (login peut exister)';
        }
      });
    }
  }

  toggleSignup() {
    this.signupMode = !this.signupMode;
    this.error = '';
  }
}
