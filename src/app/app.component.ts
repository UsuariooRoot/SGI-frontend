import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PreloaderService } from '@core/bootstrap/preloader.service';
import { SettingsService } from '@core/bootstrap/settings.service';

@Component({
  selector: 'app-root',
  template: `<router-outlet />`,
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit, AfterViewInit {
  private readonly preloader = inject(PreloaderService);
  private readonly settings = inject(SettingsService);

  ngOnInit() {
    this.settings.setTheme();
  }

  ngAfterViewInit() {
    this.preloader.hide();
  }
}
