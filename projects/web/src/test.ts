// This file is required by karma.conf.cjs and loads recursively all the .spec and framework files

import { getTestBed } from '@angular/core/testing';
import {
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { defineGlobalsInjections } from '@ngneat/spectator';
import { AppConfig } from '@clrwdoc/common/core/services/app.config';
import { TestAppConfig } from '@clrwdoc/common/testing/test-app-config';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting(),
);

defineGlobalsInjections({
	providers: [{ provide: AppConfig, useClass: TestAppConfig }],
});
