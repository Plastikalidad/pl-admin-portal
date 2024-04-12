import { Component, Input, inject } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import { Router, RouterModule } from '@angular/router';
import { GeneralService } from '../../../states/general.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ThemeSwitcherComponent, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  router = inject(Router);
  generalService = inject(GeneralService);
  authenticateService = inject(AuthService)
  @Input() user: User | undefined = undefined;


  public navigate(name: string) {
    this.generalService.pageTitle.update(() => name[0].toLocaleUpperCase() + name.slice(1, name.length));
    this.router.navigate([`/${name}`]);
  }

  public logout() {
    this.authenticateService.logout();
  }
}
