import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-button',
  imports: [RouterModule, ButtonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
}
