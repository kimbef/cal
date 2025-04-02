import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private currentTheme: Theme = 'light';
  private themeSubject = new BehaviorSubject<Theme>(this.currentTheme);
  
  // Observable for components to subscribe to
  public theme$ = this.themeSubject.asObservable();
  
  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    
    // Initialize theme from local storage if available
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      this.currentTheme = savedTheme;
      this.themeSubject.next(this.currentTheme);
    }
    
    // Detect system preference if no saved theme
    if (!savedTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme = prefersDark ? 'dark' : 'light';
      this.themeSubject.next(this.currentTheme);
    }
    
    // Apply theme on service initialization
    this.applyTheme(this.currentTheme);
  }
  
  setTheme(theme: Theme): void {
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    this.themeSubject.next(theme);
    this.applyTheme(theme);
  }
  
  toggleTheme(): void {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
  
  getCurrentTheme(): Theme {
    return this.currentTheme;
  }
  
  private applyTheme(theme: Theme): void {
    const body = document.body;
    
    if (theme === 'dark') {
      this.renderer.addClass(body, 'dark-theme');
      this.renderer.removeClass(body, 'light-theme');
    } else {
      this.renderer.addClass(body, 'light-theme');
      this.renderer.removeClass(body, 'dark-theme');
    }
  }
} 