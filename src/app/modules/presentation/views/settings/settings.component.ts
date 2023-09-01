import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/api-rest/services/auth.service';
import { UserService } from 'src/app/modules/core/services/user/user.service';
import { User } from 'src/app/modules/models/user';
import { ThemeService } from '../../../core/services/theme/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  user!: User | null;
  loading: boolean = true;
  isDarkMode: boolean = false;

  constructor(private authService: AuthService, private us: UserService, private ts: ThemeService) { }

  ngOnInit(): void {   
    const userId = this.authService.getUserId();
    if (userId) {
      this.us.getUserById(userId).subscribe(
        (userOrNull) => {
          this.user = userOrNull
          this.loading = false;
        }
      );
    }

    this.isDarkMode = this.ts.isDark
  }

  logOut(): void {
    this.authService.logout();
  }

  toggleDarkMode() {
    this.ts.toggleTheme();
    this.isDarkMode = this.ts.isDark;
  }
}
