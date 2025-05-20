import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Placeholder dashboard. */
@Component({
	selector: 'clrwdocw-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [],
	standalone: true,
})
export class DashboardComponent {}
