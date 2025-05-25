import { getTestBed } from '@angular/core/testing';
import {
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { defineGlobalsInjections } from '@ngneat/spectator';
import { AppConfig } from '@clrwdoc/common/core/services/app.config';
import { TestAppConfig } from '@clrwdoc/common/testing/test-app-config';

getTestBed().initTestEnvironment(
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting(),
);

defineGlobalsInjections({
	providers: [{ provide: AppConfig, useClass: TestAppConfig }],
});
