import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideServerRendering } from '@angular/platform-server';

const serverConfig = {
  ...appConfig,
  providers: [...(appConfig.providers ?? []), provideServerRendering()],
};

export default bootstrapApplication(AppComponent, serverConfig);
