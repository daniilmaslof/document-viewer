import { importProvidersFrom, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppConfig } from '@clrwdoc/common/core/services/app.config';

import { provideAnimations } from '@angular/platform-browser/animations';

import { appRoutes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { WebAppConfig } from './app/features/shared/web-app.config';

bootstrapApplication(AppComponent, {
	providers: [
		importProvidersFrom(BrowserModule),
		{ provide: AppConfig, useClass: WebAppConfig },
		provideExperimentalZonelessChangeDetection(),
		provideHttpClient(withInterceptors([])),
		provideRouter(appRoutes, withComponentInputBinding()),
		provideAnimations(),
	],
}).catch(err => console.error(err));
