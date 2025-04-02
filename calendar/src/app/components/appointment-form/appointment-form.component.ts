import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Appointment } from '../../models/appointment';
import { TimePickerComponent } from '../time-picker/time-picker.component';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    TimePickerComponent
  ],
  template: `
    <div class="appointment-form-overlay" (click)="closeForm()">
      <div class="appointment-form-container" (click)="$event.stopPropagation()">
        <div class="form-header">
          <h2>{{ appointmentToEdit ? 'Edit Appointment' : (preSelectedDate ? 'Add Appointment for ' + (preSelectedDate | date:'MMMM d, y') : 'Create New Appointment') }}</h2>
          <button mat-icon-button (click)="closeForm()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        
        <form [formGroup]="appointmentForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline">
            <input matInput formControlName="title" placeholder="Title">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <textarea matInput formControlName="description" rows="3" placeholder="Description"></textarea>
          </mat-form-field>

          <div class="date-time-container">
            <mat-form-field appearance="outline">
              <input matInput [matDatepicker]="startPicker" formControlName="startDate" placeholder="Start Date">
              <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
              <mat-datepicker #startPicker></mat-datepicker>
            </mat-form-field>

            <app-time-picker
              [selectedTime]="appointmentForm.get('startTime')?.value"
              (timeSelected)="onStartTimeSelected($event)">
            </app-time-picker>

            <mat-form-field appearance="outline">
              <input matInput [matDatepicker]="endPicker" formControlName="endDate" placeholder="End Date">
              <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
              <mat-datepicker #endPicker></mat-datepicker>
            </mat-form-field>

            <app-time-picker
              [selectedTime]="appointmentForm.get('endTime')?.value"
              (timeSelected)="onEndTimeSelected($event)">
            </app-time-picker>
          </div>

          <div class="form-actions">
            <button mat-button type="button" (click)="closeForm()">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="!appointmentForm.valid">
              {{ appointmentToEdit ? 'Save Changes' : (preSelectedDate ? 'Add Appointment' : 'Create Appointment') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .appointment-form-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .appointment-form-container {
      background-color: white;
      border-radius: 8px;
      padding: 24px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .form-header h2 {
      margin: 0;
      color: #333;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .date-time-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 24px;
    }

    mat-form-field {
      width: 100%;
    }

    /* Input field styles */
    :host ::ng-deep {
      .mat-mdc-form-field {
        --mdc-filled-text-field-container-color: transparent;
        --mdc-filled-text-field-focus-active-indicator-color: transparent;
        --mdc-filled-text-field-hover-active-indicator-color: transparent;
        --mdc-filled-text-field-label-text-color: #666;
        --mdc-filled-text-field-input-text-color: #333;
      }

      .mat-mdc-text-field-wrapper {
        background-color: #f5f5f5;
        padding: 0 !important;
      }

      .mat-mdc-form-field-flex {
        padding: 8px 12px !important;
        background-color: #f5f5f5;
        border-radius: 4px;
      }

      .mat-mdc-text-field-wrapper input.mat-mdc-input-element,
      .mat-mdc-text-field-wrapper textarea.mat-mdc-input-element {
        color: #333 !important;
      }

      .mdc-text-field--filled:not(.mdc-text-field--disabled) {
        background-color: #f5f5f5;
      }

      .mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple::before {
        border-bottom-color: transparent;
      }

      .mdc-text-field--filled:not(.mdc-text-field--disabled):hover .mdc-line-ripple::before {
        border-bottom-color: transparent;
      }

      .mat-mdc-form-field-infix {
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }

      .mdc-text-field--no-label:not(.mdc-text-field--outlined):not(.mdc-text-field--textarea) .mat-mdc-form-field-infix {
        padding-top: 0;
        padding-bottom: 0;
      }

      .mat-mdc-form-field-subscript-wrapper {
        display: none !important;
      }

      .mat-mdc-form-field-label {
        display: none !important;
      }

      .mat-mdc-form-field-outline {
        display: none !important;
      }

      input.mat-mdc-input-element,
      textarea.mat-mdc-input-element {
        color: #333 !important;
      }

      ::placeholder {
        color: #666 !important;
        opacity: 1 !important;
      }
    }

    @media (max-width: 600px) {
      .date-time-container {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AppointmentFormComponent {
  @Input() preSelectedDate: Date | null = null;
  @Input() appointmentToEdit: Appointment | null = null;
  @Output() appointmentCreated = new EventEmitter<Appointment>();
  @Output() close = new EventEmitter<void>();

  appointmentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.appointmentForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      startDate: [null, Validators.required],
      startTime: ['', Validators.required],
      endDate: [null, Validators.required],
      endTime: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.preSelectedDate) {
      this.appointmentForm.patchValue({
        startDate: this.preSelectedDate,
        endDate: this.preSelectedDate
      });
    }

    if (this.appointmentToEdit) {
      const startTime = this.appointmentToEdit.startDate.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });
      const endTime = this.appointmentToEdit.endDate.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });

      this.appointmentForm.patchValue({
        title: this.appointmentToEdit.title,
        description: this.appointmentToEdit.description,
        startDate: this.appointmentToEdit.startDate,
        endDate: this.appointmentToEdit.endDate,
        startTime,
        endTime
      });
    }
  }

  onStartTimeSelected(time: string): void {
    this.appointmentForm.patchValue({ startTime: time });
  }

  onEndTimeSelected(time: string): void {
    this.appointmentForm.patchValue({ endTime: time });
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const formValue = this.appointmentForm.value;
      const startDate = new Date(formValue.startDate);
      const [startHours, startMinutes] = formValue.startTime.split(':');
      startDate.setHours(parseInt(startHours), parseInt(startMinutes));

      const endDate = new Date(formValue.endDate);
      const [endHours, endMinutes] = formValue.endTime.split(':');
      endDate.setHours(parseInt(endHours), parseInt(endMinutes));

      const appointment: Appointment = {
        id: this.appointmentToEdit?.id || crypto.randomUUID(),
        title: formValue.title,
        description: formValue.description,
        startDate,
        endDate,
        color: this.appointmentToEdit?.color
      };

      this.appointmentCreated.emit(appointment);
      this.closeForm();
    }
  }

  closeForm(): void {
    this.close.emit();
  }
}
