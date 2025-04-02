import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import { CalendarGridComponent } from '../calendar-grid/calendar-grid.component';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    AppointmentFormComponent,
    CalendarGridComponent
  ],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.scss'
})
export class CalendarViewComponent {
  onAppointmentAdded(): void {
    // This method will be called when a new appointment is added
    // We can use this to refresh the calendar grid if needed
  }
}
