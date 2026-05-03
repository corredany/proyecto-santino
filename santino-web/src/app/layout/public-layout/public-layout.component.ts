import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from '../../components/shared/menu/menu.component';
import { FooterComponent } from '../../components/shared/footer/footer/footer.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, MenuComponent, FooterComponent],
  template: `
    <app-menu />
    <main>
      <router-outlet />
    </main>
    <app-footer />
  `,
})
export class PublicLayoutComponent {}
