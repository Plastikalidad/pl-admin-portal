import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService, User } from '@auth0/auth0-angular';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { MenuComponent } from './shared/components/menu/menu.component';
import { UserService } from './states/user.service';
import { MenuItems } from './shared/constants/menu.constants';
import { GeneralService } from './states/general.service';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent, MenuComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'pl-admin';

  public menu = MenuItems;

  public authService = inject(AuthService);
  public userService = inject(UserService);
  public generalService = inject(GeneralService);

  public ngOnInit(): void {
    this.authService.user$.subscribe((d: User | null | undefined) => {
      if (!d) {
        this.authService.loginWithRedirect();
        return;
      }
      this.userService.user.set(d)
    });

  }

}
