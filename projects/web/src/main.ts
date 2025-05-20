import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppConfig } from '@clrwdoc/common/core/services/app.config';

import { appRoutes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { WebAppConfig } from './app/features/shared/web-app.config';

bootstrapApplication(AppComponent, {
	providers: [
		importProvidersFrom(BrowserModule),
		{ provide: AppConfig, useClass: WebAppConfig },
		provideHttpClient(withInterceptors([])),
		provideRouter(appRoutes),
	],
})
	.catch(err => console.error(err));
