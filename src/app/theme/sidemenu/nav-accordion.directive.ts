import { Directive, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { NavAccordionItemDirective } from './nav-accordion-item.directive';
import { MenuService } from '@core/bootstrap/menu.service';

@Directive({
  selector: '[navAccordion]',
  exportAs: 'navAccordion',
})
export class NavAccordionDirective {
  private readonly router = inject(Router);
  private readonly menu = inject(MenuService);

  private navItems: NavAccordionItemDirective[] = [];

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.checkOpenedItems());

    // Fix opening status for async menu data
    this.menu.change().subscribe(() => {
      setTimeout(() => this.checkOpenedItems());
    });
  }

  addItem(item: NavAccordionItemDirective) {
    this.navItems.push(item);
  }

  removeItem(item: NavAccordionItemDirective) {
    const index = this.navItems.indexOf(item);
    if (index !== -1) {
      this.navItems.splice(index, 1);
    }
  }

  closeOtherItems(openedItem: NavAccordionItemDirective) {
    this.navItems.forEach(item => {
      if (item !== openedItem) {
        item.expanded = false;
      }
    });
  }

  checkOpenedItems() {
    this.navItems.forEach(item => {
      if (item.route && this.router.url.split('/').includes(item.route)) {
        item.expanded = true;
        this.closeOtherItems(item);
      }
    });
  }
}
