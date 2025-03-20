export type AppTheme = 'light' | 'dark' | 'auto';

export interface AppSettings {
  theme: AppTheme;
  showHeader: boolean;
  headerPos: 'fixed' | 'static' | 'above';
  sidenavOpened: boolean;
  sidenavCollapsed: boolean;
  language: string;
}

export const defaults: AppSettings = {
  theme: 'auto',
  showHeader: true,
  headerPos: 'fixed',
  sidenavOpened: true,
  sidenavCollapsed: false,
  language: 'auto',
};
