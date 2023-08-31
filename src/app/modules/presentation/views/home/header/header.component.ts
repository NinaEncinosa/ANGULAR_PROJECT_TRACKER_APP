import { Component } from '@angular/core';
import { AuthService } from 'src/app/modules/api-rest/services/auth.service';
import { UserService } from 'src/app/modules/core/services/user/user.service';
import { User } from 'src/app/modules/models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  user!: User | null;
  loading: boolean = true;

  constructor(private authService: AuthService, private us: UserService) { }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.us.getUserById(userId).subscribe(
        (userOrNull) => {
          this.user = userOrNull;
          this.loading = false;
        }
      );
    }
  }
}
