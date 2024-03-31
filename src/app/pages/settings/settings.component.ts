import { Component, inject } from '@angular/core';
import { DiscountOverviewComponent } from './discount-overview/discount-overview.component';
import { CapColorOverviewComponent } from './cap-color-overview/cap-color-overview.component';
import { SizeOverviewComponent } from './size-overview/size-overview.component';


@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [DiscountOverviewComponent, CapColorOverviewComponent, SizeOverviewComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

}
