import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models/appointment';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-calendar-grid',
  standalone: true,
  imports: [
    CommonModule,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    MatIconModule,
    MatButtonModule,
    AppointmentFormComponent,
    DragDropModule
  ],
  templateUrl: './calendar-grid.component.html',
  styles: [`
    .calendar-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      background-color: var(--card-background);
      border-radius: 8px;
      box-shadow: 0 2px 8px var(--shadow-color);
      overflow: hidden;
      position: relative;
    }

    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background-color: var(--card-background);
      border-bottom: 1px solid var(--border-color);
    }

    .month-nav {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .month-display {
      font-size: 1.3rem;
      font-weight: 500;
      color: var(--primary-color);
      text-align: center;
      min-width: 180px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .today-button {
      font-size: 0.9rem;
      padding: 0 16px;
      height: 36px;
    }

    .weekday-headers {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      background-color: var(--card-background);
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      z-index: 2;
    }

    .weekday {
      padding: 10px;
      text-align: center;
      font-weight: 500;
      font-size: 0.9rem;
      color: var(--text-light);
    }

    .weekday:nth-child(1), .weekday:nth-child(7) {
      color: var(--accent-color);
    }

    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      grid-auto-rows: minmax(100px, 1fr);
      flex: 1;
      overflow-y: auto;
      transition: all 0.3s ease;
    }

    .calendar-grid.day-view-active {
      grid-template-columns: 1fr;
      margin-left: -70%;
      width: 70%;
    }

    .day-cell {
      border-right: 1px solid var(--border-color);
      border-bottom: 1px solid var(--border-color);
      padding: 10px;
      position: relative;
      background-color: var(--card-background);
      overflow: hidden;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .day-cell:nth-child(7n) {
      border-right: none;
    }

    .day-cell:hover {
      background-color: var(--hover-bg);
    }

    .day-cell.weekend {
      background-color: var(--background-color);
    }

    .day-cell.today {
      background-color: var(--primary-light);
    }

    .day-cell.other-month {
      opacity: 0.6;
    }

    .day-cell.selected-day {
      border: 2px solid var(--primary-color);
    }

    .date-number {
      position: absolute;
      top: 5px;
      right: 5px;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .date-number.today {
      background-color: var(--primary-color);
      color: white;
    }

    .appointments-container {
      margin-top: 28px;
      overflow-y: auto;
      max-height: calc(100% - 35px);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .appointment-stack {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 4px;
    }

    .appointment-count {
      position: absolute;
      top: 5px;
      left: 5px;
      background-color: var(--primary-color);
      color: white;
      padding: 2px 6px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .appointment-preview {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 8px;
      background-color: var(--background-color);
      border-radius: 4px;
      font-size: 0.8rem;
      color: var(--text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: grab;
      user-select: none;
      transition: all 0.2s ease;
    }

    .appointment-preview:hover {
      background-color: var(--hover-bg);
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .appointment-preview:active {
      cursor: grabbing;
      transform: translateY(0);
    }

    .appointment-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .appointment-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .day-view {
      position: absolute;
      right: 0;
      top: 0;
      width: 70%;
      height: 100%;
      background-color: var(--card-background);
      border-left: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      z-index: 3;
    }

    .day-view-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid var(--border-color);
    }

    .day-view-title h2 {
      margin: 0;
      font-size: 1.4rem;
      font-weight: 500;
      color: var(--primary-color);
    }

    .day-view-content {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }

    .day-appointments {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--text-light);
      text-align: center;
    }

    .empty-state p {
      margin-bottom: 16px;
      font-size: 1.1rem;
    }

    @media (max-width: 900px) {
      .calendar-grid.day-view-active {
        margin-left: -100%;
        width: 100%;
      }
      
      .day-view {
        width: 100%;
      }
    }

    @media (max-width: 768px) {
      .month-display {
        font-size: 1.1rem;
        min-width: 150px;
      }
      
      .weekday {
        padding: 8px 4px;
        font-size: 0.8rem;
      }
      
      .calendar-header {
        padding: 12px 8px;
      }
      
      .day-cell {
        padding: 8px 4px;
      }

      .appointment-preview {
        padding: 2px 4px;
        font-size: 0.7rem;
      }
    }

    @media (max-width: 480px) {
      .calendar-header {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
        padding: 8px;
      }
      
      .month-nav {
        justify-content: center;
      }
      
      .today-button {
        align-self: center;
      }
      
      .date-number {
        width: 24px;
        height: 24px;
        font-size: 0.8rem;
      }
    }

    .cdk-drag-preview {
      box-sizing: border-box;
      border-radius: 4px;
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
                0 8px 10px 1px rgba(0, 0, 0, 0.14),
                0 3px 14px 2px rgba(0, 0, 0, 0.12);
    }

    .cdk-drag-placeholder {
      opacity: 0;
    }

    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .day-cell.cdk-drop-list-dragging {
      background-color: var(--hover-bg);
    }

    .appointment-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background-color: var(--background-color);
      border-radius: 8px;
      margin-bottom: 8px;
      transition: background-color 0.2s;
    }

    .appointment-item:hover {
      background-color: var(--hover-bg);
    }

    .appointment-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .appointment-info {
      flex: 1;
    }

    .appointment-title {
      font-weight: 500;
      color: var(--text-color);
      margin-bottom: 4px;
    }

    .appointment-time {
      font-size: 0.9rem;
      color: var(--text-light);
    }

    .day-view-content {
      padding: 16px;
      overflow-y: auto;
    }

    .day-appointments {
      margin-bottom: 16px;
    }

    .empty-state {
      text-align: center;
      padding: 32px;
      color: var(--text-light);
    }

    .empty-state p {
      margin-bottom: 16px;
      font-size: 1.1rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarGridComponent implements OnInit {
  dates: Date[] = [];
  appointments: { [key: string]: Appointment[] } = {};
  weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  currentMonth: string = '';
  currentViewDate: Date = new Date(); // Tracks the current month being viewed
  
  // Day view properties
  isDayViewActive = false;
  selectedDay: Date | null = null;
  selectedDayAppointments: Appointment[] = [];
  showAppointmentForm = false;
  selectedDateForForm: Date | null = null;
  appointmentToEdit: Appointment | null = null;

  constructor(
    private appointmentService: AppointmentService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initializeDates();
    this.loadAppointments();
  }

  private initializeDates(): void {
    this.dates = [];
    // Set current month display
    this.currentMonth = this.formatMonth(this.currentViewDate);
    
    // Get first day of month and calculate the start of calendar (previous month days)
    const firstDayOfMonth = new Date(this.currentViewDate.getFullYear(), this.currentViewDate.getMonth(), 1);
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from previous Sunday
    
    // Get last day of month and calculate the end of calendar (next month days)
    const lastDayOfMonth = new Date(this.currentViewDate.getFullYear(), this.currentViewDate.getMonth() + 1, 0);
    const endDate = new Date(lastDayOfMonth);
    const daysToAdd = 6 - endDate.getDay();
    endDate.setDate(endDate.getDate() + daysToAdd); // End on next Saturday

    // Generate all dates for the calendar (typically 42 days - 6 weeks)
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      this.dates.push(new Date(d));
      this.appointments[d.toISOString()] = [];
    }
  }

  private formatMonth(date: Date): string {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  navigateMonth(direction: number): void {
    // Create new date based on current view date
    const newDate = new Date(this.currentViewDate);
    newDate.setMonth(newDate.getMonth() + direction);
    this.currentViewDate = newDate;
    
    // Reinitialize the calendar with the new month
    this.initializeDates();
    this.loadAppointments();
    this.cdr.markForCheck();
  }

  goToday(): void {
    const today = new Date();
    this.currentViewDate = new Date(today);
    this.initializeDates();
    this.loadAppointments();
    
    // Open day view for today
    this.openDayView(today);
    this.cdr.markForCheck();
  }

  private loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe((appointments: Appointment[]) => {
      // Reset appointments for all dates
      this.dates.forEach(date => {
        this.appointments[date.toISOString()] = [];
      });
      
      // Filter appointments for each date
      appointments.forEach((appointment: Appointment) => {
        const appDate = new Date(appointment.startDate);
        const matchingDate = this.dates.find(date => this.isSameDay(date, appDate));
        if (matchingDate) {
          const dateKey = matchingDate.toISOString();
          if (!this.appointments[dateKey]) {
            this.appointments[dateKey] = [];
          }
          this.appointments[dateKey].push(appointment);
        }
      });
      
      // Update selected day appointments if day view is active
      if (this.isDayViewActive && this.selectedDay) {
        this.updateSelectedDayAppointments();
      }
      
      this.cdr.markForCheck();
    });
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return this.isSameDay(date, today);
  }

  isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  }

  isSameMonth(date: Date, referenceDate: Date = this.currentViewDate): boolean {
    return date.getMonth() === referenceDate.getMonth() && 
           date.getFullYear() === referenceDate.getFullYear();
  }
  
  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }
  
  // Day view functions
  openDayView(date: Date): void {
    this.selectedDay = new Date(date);
    this.isDayViewActive = true;
    this.updateSelectedDayAppointments();
    this.cdr.markForCheck();
  }
  
  closeDayView(): void {
    this.isDayViewActive = false;
    this.selectedDay = null;
    this.selectedDayAppointments = [];
    this.cdr.markForCheck();
  }
  
  isSelectedDay(date: Date): boolean {
    return this.selectedDay ? this.isSameDay(date, this.selectedDay) : false;
  }
  
  private updateSelectedDayAppointments(): void {
    if (!this.selectedDay) return;
    
    const selectedDate = this.dates.find(date => this.isSameDay(date, this.selectedDay!));
    if (selectedDate) {
      const dateKey = selectedDate.toISOString();
      this.selectedDayAppointments = this.appointments[dateKey] || [];
    } else {
      this.selectedDayAppointments = [];
    }
  }

  openAppointmentForm(date?: Date): void {
    this.selectedDateForForm = date || null;
    this.showAppointmentForm = true;
    this.cdr.markForCheck();
  }

  openAppointmentFormForDay(): void {
    if (this.selectedDay) {
      this.selectedDateForForm = this.selectedDay;
      this.showAppointmentForm = true;
      this.cdr.markForCheck();
    }
  }

  closeAppointmentForm(): void {
    this.showAppointmentForm = false;
    this.selectedDateForForm = null;
    this.appointmentToEdit = null;
    this.cdr.markForCheck();
  }

  editAppointment(appointment: Appointment): void {
    this.selectedDateForForm = appointment.startDate;
    this.appointmentToEdit = appointment;
    this.showAppointmentForm = true;
  }

  onAppointmentCreated(updatedAppointment: Appointment): void {
    if (this.appointmentToEdit) {
      // Update existing appointment
      this.appointmentService.updateAppointment({
        ...updatedAppointment,
        id: this.appointmentToEdit.id
      });
    } else {
      // Create new appointment
      this.appointmentService.addAppointment(updatedAppointment);
    }
    this.closeAppointmentForm();
    this.loadAppointments();
  }

  onAppointmentDrop(event: CdkDragDrop<Date>) {
    if (event.previousContainer === event.container) {
      return;
    }

    const appointment = event.item.data as Appointment;
    const newDate = event.container.data as Date;
    
    // Keep the same time but update the date
    const updatedStartDate = new Date(newDate);
    updatedStartDate.setHours(
      appointment.startDate.getHours(),
      appointment.startDate.getMinutes()
    );

    const updatedEndDate = new Date(newDate);
    updatedEndDate.setHours(
      appointment.endDate.getHours(),
      appointment.endDate.getMinutes()
    );
    
    // Create new appointment with updated dates
    const updatedAppointment: Appointment = {
      ...appointment,
      startDate: updatedStartDate,
      endDate: updatedEndDate
    };

    // Update the appointment
    this.appointmentService.updateAppointment(updatedAppointment).subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  getAppointmentsForDate(date: Date): Appointment[] {
    return this.appointments[date.toISOString()] || [];
  }
}
