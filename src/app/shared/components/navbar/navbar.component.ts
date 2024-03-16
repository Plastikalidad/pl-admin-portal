import { Component, Input } from '@angular/core';
import { User } from '@auth0/auth0-angular';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ThemeSwitcherComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Input() user: User | undefined = undefined;
}
