import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePickerModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactoComponent {
  datetime24h: Date = new Date(); // Valor inicial si quieres
  showOtroInput = false;

  onTipoProyectoChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.showOtroInput = target.value === 'otro';
  }

  onSubmit(event: Event) {
    event.preventDefault();
    // Here you would typically handle the form submission
    // For now, we'll just log the form data
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    console.log(Object.fromEntries(formData));
  }
}
