import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Appointment } from '../models/appointment';
import { BehaviorSubject, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationPermission: NotificationPermission | null = null;
  private upcomingNotifications = new BehaviorSubject<Appointment[]>([]);
  upcomingNotifications$ = this.upcomingNotifications.asObservable();
  
  private checkInterval = 60000; // Check every minute
  
  constructor(private snackBar: MatSnackBar) {
    // Request notification permission
    this.requestPermission();
    
    // Start checking for upcoming events
    this.startNotificationCheck();
  }
  
  private requestPermission(): void {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        this.notificationPermission = permission;
      });
    }
  }
  
  private startNotificationCheck(): void {
    timer(0, this.checkInterval).subscribe(() => {
      this.checkUpcomingAppointments();
    });
  }
  
  addAppointmentReminders(appointments: Appointment[]): void {
    this.upcomingNotifications.next(appointments);
  }
  
  private checkUpcomingAppointments(): void {
    const now = new Date();
    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60000);
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60000);
    
    this.upcomingNotifications.value.forEach(appointment => {
      const startTime = new Date(appointment.startDate);
      
      // Check if the appointment is within the next 30 minutes
      if (startTime > now && startTime <= thirtyMinutesFromNow) {
        const minutesUntil = Math.floor((startTime.getTime() - now.getTime()) / 60000);
        
        // Send notification 30 minutes before
        if (minutesUntil >= 29 && minutesUntil <= 30) {
          this.showNotification(
            `${appointment.title} in 30 minutes`,
            `Your appointment starts at ${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          );
        }
        
        // Send notification 5 minutes before
        if (startTime <= fiveMinutesFromNow && minutesUntil >= 4 && minutesUntil <= 5) {
          this.showNotification(
            `${appointment.title} starting soon`,
            `Your appointment starts in ${minutesUntil} minutes`
          );
        }
      }
    });
  }
  
  private showNotification(title: string, body: string): void {
    // Show browser notification if permission granted
    if (this.notificationPermission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: '/assets/calendar-icon.png'
      });
      
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
    
    // Always show in-app notification
    this.snackBar.open(title, 'Dismiss', {
      duration: 5000,
      verticalPosition: 'top'
    });
  }
} 