import { Component, Input, inject } from '@angular/core';
import { Menu } from '../../interfaces/menu.interface';
import { Router, RouterOutlet } from '@angular/router';
import { GeneralService } from '../../../states/general.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  @Input({ required: true }) menu: Menu[] = [];

  public router = inject(Router);
  public generalService = inject(GeneralService);

  public navigate(event: Event, menu: Menu) {
    this.generalService.pageTitle.update(() => menu.name);
    this.router.navigate([menu.path]);
    Array.from(document.querySelectorAll('a')).forEach(
      (el) => {
        el.classList.remove('active')
      }
    );
    (event.target as HTMLLIElement).classList.add('active');
  }

}
