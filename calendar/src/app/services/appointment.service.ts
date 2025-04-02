import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Appointment } from '../models/appointment';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private appointments: Appointment[] = [];
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);
  
  private notificationService = inject(NotificationService);

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      try {
        this.appointments = JSON.parse(savedAppointments).map((appointment: any) => ({
          ...appointment,
          startDate: new Date(appointment.startDate),
          endDate: new Date(appointment.endDate)
        }));
        this.appointmentsSubject.next([...this.appointments]);
        
        // Add all appointments for notification checks
        this.updateNotifications(this.appointments);
      } catch (e) {
        console.error('Error loading appointments from localStorage:', e);
        this.appointments = [];
        this.appointmentsSubject.next([]);
      }
    }
  }

  getAppointments(): Observable<Appointment[]> {
    return this.appointmentsSubject.asObservable();
  }

  addAppointment(appointment: Omit<Appointment, 'id'>): Observable<void> {
    const newAppointment = {
      ...appointment,
      id: crypto.randomUUID()
    } as Appointment;
    
    this.appointments.push(newAppointment);
    this.appointmentsSubject.next([...this.appointments]);
    this.saveToLocalStorage();
    this.updateNotifications(this.appointments);
    
    return new Observable(subscriber => {
      subscriber.next();
      subscriber.complete();
    });
  }

  updateAppointment(updatedAppointment: Appointment): Observable<void> {
    const index = this.appointments.findIndex(a => a.id === updatedAppointment.id);
    if (index !== -1) {
      this.appointments[index] = updatedAppointment;
      this.appointmentsSubject.next([...this.appointments]);
      this.saveToLocalStorage();
      this.updateNotifications(this.appointments);
    }
    return new Observable(subscriber => {
      subscriber.next();
      subscriber.complete();
    });
  }

  deleteAppointment(appointmentOrId: Appointment | string): Observable<void> {
    const id = typeof appointmentOrId === 'string' ? appointmentOrId : appointmentOrId.id;
    this.appointments = this.appointments.filter(a => a.id !== id);
    this.appointmentsSubject.next([...this.appointments]);
    this.saveToLocalStorage();
    this.updateNotifications(this.appointments);
    return new Observable(subscriber => {
      subscriber.next();
      subscriber.complete();
    });
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('appointments', JSON.stringify(this.appointments));
  }
  
  private updateNotifications(appointments: Appointment[]): void {
    this.notificationService.addAppointmentReminders(appointments);
  }

  getAppointmentsByDate(date: Date): Observable<Appointment[]> {
    return new Observable(subscriber => {
      this.getAppointments().subscribe(appointments => {
        const filteredAppointments = appointments.filter(app => {
          const appDate = new Date(app.startDate);
          return appDate.toDateString() === date.toDateString();
        });
        subscriber.next(filteredAppointments);
      });
    });
  }
}
