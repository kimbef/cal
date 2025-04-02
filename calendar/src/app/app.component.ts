import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService, Theme } from './services/theme.service';
import { CalendarGridComponent } from './components/calendar-grid/calendar-grid.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    CalendarGridComponent
  ],
  providers: [ThemeService],
  templateUrl: './app.component.html',
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }
    
    .app-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 16px;
      height: 64px;
      background-color: var(--primary-color);
      color: white;
      box-shadow: 0 2px 4px var(--shadow-color);
      z-index: 10;
    }
    
    h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
    }
    
    .header-actions {
      display: flex;
      align-items: center;
    }
    
    .main-content {
      flex: 1;
      overflow: auto;
      padding: 16px;
      background-color: var(--background-color);
    }
    
    @media (max-width: 600px) {
      .app-header {
        height: 56px;
        padding: 0 8px;
      }
      
      h1 {
        font-size: 1.2rem;
      }
      
      .main-content {
        padding: 8px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'calendar-app';
  isDarkTheme = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.theme$.subscribe((theme: Theme) => {
      this.isDarkTheme = theme === 'dark';
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
