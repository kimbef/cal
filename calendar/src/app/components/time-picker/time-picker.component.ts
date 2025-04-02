import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-time-picker',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatDialogModule],
  template: `
    <div class="time-picker-container">
      <mat-form-field appearance="outline">
        <input matInput
               [value]="selectedTime"
               (click)="openTimeDialog()"
               readonly
               [placeholder]="label">
        <mat-icon matSuffix (click)="openTimeDialog()">schedule</mat-icon>
      </mat-form-field>
    </div>
  `,
  styles: [`
    .time-picker-container {
      position: relative;
      width: 100%;
    }

    mat-form-field {
      width: 100%;
    }

    :host ::ng-deep {
      .mat-mdc-form-field {
        --mdc-filled-text-field-container-color: var(--input-background);
        --mdc-filled-text-field-focus-active-indicator-color: var(--primary-color);
        --mdc-filled-text-field-hover-active-indicator-color: var(--primary-color);
        --mdc-filled-text-field-label-text-color: var(--text-light);
        --mdc-filled-text-field-input-text-color: var(--text-color);
        --mdc-filled-text-field-outline-color: var(--border-color);
        --mdc-filled-text-field-hover-outline-color: var(--primary-color);
        --mdc-filled-text-field-focus-outline-color: var(--primary-color);
      }

      .mat-mdc-text-field-wrapper {
        background-color: var(--input-background);
      }

      .mat-mdc-form-field-focus-overlay {
        background-color: var(--input-background);
      }

      .mat-mdc-text-field-wrapper .mat-mdc-form-field-flex {
        background-color: var(--input-background);
      }

      .mat-mdc-form-field-subscript-wrapper {
        background-color: transparent;
      }

      .mat-mdc-form-field-error {
        color: var(--error-color);
      }
    }
  `]
})
export class TimePickerComponent {
  @Input() label: string = 'Time';
  @Input() placeholder: string = 'Select time';
  @Input() selectedTime: string = '';
  @Output() timeSelected = new EventEmitter<string>();

  timeSlots: string[] = [];

  constructor(private dialog: MatDialog) {
    this.generateTimeSlots();
  }

  private generateTimeSlots(): void {
    // Generate time slots for the full 24-hour range in 30-minute increments
    for (let hour = 0; hour < 24; hour++) {
      const hourStr = hour.toString().padStart(2, '0');
      this.timeSlots.push(`${hourStr}:00`);
      this.timeSlots.push(`${hourStr}:30`);
    }
  }

  openTimeDialog(): void {
    const dialogRef = this.dialog.open(TimePickerDialogComponent, {
      width: '300px',
      data: {
        timeSlots: this.timeSlots,
        selectedTime: this.selectedTime
      },
      panelClass: 'time-picker-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedTime = result;
        this.timeSelected.emit(result);
      }
    });
  }
}

@Component({
  selector: 'app-time-picker-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <div class="time-picker-dialog">
      <div class="time-slots">
        <div class="time-slot" 
             *ngFor="let time of data.timeSlots" 
             (click)="selectTime(time)"
             [class.selected]="time === data.selectedTime">
          {{ time }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .time-picker-dialog {
      max-height: 400px;
      overflow-y: auto;
      padding: 8px;
    }

    .time-slots {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 4px;
    }

    .time-slot {
      padding: 8px;
      cursor: pointer;
      color: var(--text-color);
      transition: background-color 0.2s;
      font-size: 14px;
      text-align: center;
      border-radius: 4px;
    }

    .time-slot:hover {
      background-color: var(--hover-bg);
    }

    .time-slot.selected {
      background-color: var(--primary-light);
      color: var(--primary-color);
      font-weight: 500;
    }

    /* Style for midnight (00:00) */
    .time-slot:first-child {
      font-weight: 500;
    }

    /* Style for noon (12:00) */
    .time-slot:nth-child(25) {
      font-weight: 500;
    }

    :host ::ng-deep .mat-mdc-dialog-container {
      --mdc-dialog-container-color: var(--card-background);
      --mdc-dialog-supporting-text-color: var(--text-color);
    }
  `]
})
export class TimePickerDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TimePickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { timeSlots: string[], selectedTime: string }
  ) {}

  selectTime(time: string): void {
    this.dialogRef.close(time);
  }
} 