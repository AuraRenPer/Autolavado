import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  android: {
    webContentsDebuggingEnabled: true,
    allowMixedContent: true,
  },
  appId: 'io.ionic.starter',
  appName: 'ConsultasMedicas',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    cleartext: true // Permite conexiones inseguras durante el desarrollo
  }
};
export default config;