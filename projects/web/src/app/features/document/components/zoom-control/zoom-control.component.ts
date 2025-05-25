import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MatButton } from '@angular/material/button';

import { PercentPipe } from '@angular/common';

import { ZoomService } from '../../services/zoom.service';

/**
 * Shows current zoom scale and provides controls to adjust it.
 */
@Component({
	selector: 'clrwdocw-zoom-control',
	imports: [MatButton, PercentPipe],
	standalone: true,
	templateUrl: './zoom-control.component.html',
	styleUrl: './zoom-control.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZoomControlComponent {
	/** Zoom service. */
	public readonly zoomService = inject(ZoomService);
}
