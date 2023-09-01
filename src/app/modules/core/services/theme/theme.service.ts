import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public isDark = false;
  static readonly darkStyleName = 'dark-theme';
  static readonly themeStorageKey = 'selectedTheme';

  constructor() {
    this.loadThemeFromLocalStorage();
  }

  private loadThemeFromLocalStorage() {
    const savedTheme = localStorage.getItem(ThemeService.themeStorageKey);
    if (savedTheme === ThemeService.darkStyleName) {
      this.isDark = true;
      document.body.classList.add(ThemeService.darkStyleName);
    }
  }

  public toggleTheme() {
    if (this.isDark) {
      document.body.classList.remove(ThemeService.darkStyleName);
      localStorage.removeItem(ThemeService.themeStorageKey);
      this.isDark = false;
    } else {
      document.body.classList.add(ThemeService.darkStyleName);
      localStorage.setItem(ThemeService.themeStorageKey, ThemeService.darkStyleName);
      this.isDark = true;
    }
  }

  setDarkTheme(isDark: boolean): void {
    if (isDark) {
      document.body.classList.add(ThemeService.darkStyleName);
    } else {
      document.body.classList.remove(ThemeService.darkStyleName);
    }
  }
}