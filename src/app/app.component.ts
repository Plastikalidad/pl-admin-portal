import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { MenuComponent } from './shared/components/menu/menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent, MenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'pl-admin';

  public authService = inject(AuthService);

  public ngOnInit(): void {
    this.authService.user$.subscribe(d => {
      console.log(d)
      if (!d) {
        this.authService.loginWithRedirect();
      }
    });

  }

}
