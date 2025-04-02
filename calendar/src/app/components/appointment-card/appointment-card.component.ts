import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { Appointment } from '../../models/appointment';
import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-appointment-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, CdkDrag],
  template: `
    <div class="appointment-card"
         [style.borderLeftColor]="appointment.color"
         [class.expanded]="expanded"
         cdkDrag
         (cdkDragEnded)="onDragEnded($event)">
      <div class="appointment-title">{{ appointment.title }}</div>
      
      <div class="appointment-time">
        <mat-icon>access_time</mat-icon>
        {{ formatTime(appointment.startDate) }} - {{ formatTime(appointment.endDate) }}
      </div>
      
      <div *ngIf="expanded" class="appointment-description">
        {{ appointment.description }}
      </div>
      
      <div class="appointment-actions" *ngIf="expanded">
        <button mat-icon-button color="primary" (click)="editAppointment()">
          <mat-icon>edit</mat-icon>
        </button>
        <button mat-icon-button color="warn" (click)="deleteAppointment()">
          <mat-icon>delete</mat-icon>
        </button>
      </div>
      
      <button *ngIf="!expanded" mat-icon-button class="delete-button" (click)="deleteAppointment(); $event.stopPropagation()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .appointment-card {
      margin-bottom: 8px;
      border-radius: 8px;
      box-shadow: 0 2px 4px var(--shadow-color);
      padding: 12px;
      background-color: var(--card-background);
      border-left: 4px solid var(--primary-color);
      transition: transform 0.2s, box-shadow 0.2s;
      position: relative;
    }
    
    .appointment-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px var(--shadow-color);
    }
    
    .appointment-card.expanded {
      padding: 16px;
      margin-bottom: 12px;
    }
    
    .appointment-card.expanded .appointment-title {
      font-size: 1.1rem;
      margin-bottom: 12px;
    }
    
    .appointment-card.expanded .appointment-time {
      margin-bottom: 12px;
    }
    
    .appointment-card.low-priority {
      border-left-color: var(--success-color);
    }
    
    .appointment-card.medium-priority {
      border-left-color: var(--warning-color);
    }
    
    .appointment-card.high-priority {
      border-left-color: var(--error-color);
    }
    
    .appointment-title {
      font-weight: 500;
      margin: 0 0 8px 0;
      color: var(--text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 24px;
    }
    
    .appointment-time {
      font-size: 0.9rem;
      color: var(--text-light);
      display: flex;
      align-items: center;
      margin-bottom: 4px;
    }
    
    .appointment-time mat-icon {
      font-size: 16px;
      height: 16px;
      width: 16px;
      margin-right: 4px;
    }
    
    .appointment-description {
      font-size: 0.9rem;
      color: var(--text-color);
      margin-bottom: 12px;
      line-height: 1.4;
    }
    
    .appointment-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 12px;
      gap: 8px;
    }
    
    .delete-button {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 24px;
      height: 24px;
      line-height: 24px;
      padding: 0;
      min-width: auto;
    }
    
    .delete-button mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      line-height: 16px;
    }
    
    .cdk-drag-preview {
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
                  0 8px 10px 1px rgba(0, 0, 0, 0.14),
                  0 3px 14px 2px rgba(0, 0, 0, 0.12);
      z-index: 1000;
    }
    
    .cdk-drag-placeholder {
      opacity: 0.3;
    }
    
    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentCardComponent {
  @Input() appointment!: Appointment;
  @Input() expanded = false;
  @Output() edit = new EventEmitter<Appointment>();
  @Output() delete = new EventEmitter<string>();

  constructor(private appointmentService: AppointmentService) {}

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  deleteAppointment(): void {
    this.appointmentService.deleteAppointment(this.appointment.id);
    this.delete.emit(this.appointment.id);
  }
  
  editAppointment(): void {
    this.edit.emit(this.appointment);
  }

  onDragEnded(event: CdkDragEnd): void {
    if (event.source.dropContainer) {
      const newDate = event.source.dropContainer.data as Date;
      
      // Calculate time difference to preserve original duration
      const durationMs = this.appointment.endDate.getTime() - this.appointment.startDate.getTime();
      
      // Create new start date with same time
      const newStartDate = new Date(newDate);
      newStartDate.setHours(
        this.appointment.startDate.getHours(),
        this.appointment.startDate.getMinutes()
      );
      
      // Calculate new end date
      const newEndDate = new Date(newStartDate.getTime() + durationMs);
      
      this.appointmentService.updateAppointment(this.appointment.id, {
        startDate: newStartDate,
        endDate: newEndDate
      });
    }
  }
  
  getBackgroundColor(): string {
    // Create a lighter version of the color for the background
    if (!this.appointment.color) return '#e1f5fe';
    
    // Convert hex to RGB, then create a lighter version
    const hex = this.appointment.color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, 0.15)`;
  }
}
