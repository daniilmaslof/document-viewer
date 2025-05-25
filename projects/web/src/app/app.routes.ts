import { Routes } from '@angular/router';

/** App routes. */
export const appRoutes: Routes = [
	{
		path: 'document',
		loadChildren: () =>
			import('./features/document/document.routes').then(
				r => r.documentRoutes,
			),
	},
	{
		path: '',
		redirectTo: 'document/1',
		pathMatch: 'full',
	},
];
