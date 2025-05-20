import { Routes } from '@angular/router';

/** App routes. */
export const appRoutes: Routes = [
	{
		path: '',
		loadChildren: () =>
			import('./features/dashboard/dashboard.routes').then(
				r => r.dashboardRoutes,
			),
	},
];
