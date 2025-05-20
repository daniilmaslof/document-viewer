import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Root component. */
@Component({
	selector: 'clrwdocw-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterOutlet],
	standalone: true,
})
export class AppComponent {}
