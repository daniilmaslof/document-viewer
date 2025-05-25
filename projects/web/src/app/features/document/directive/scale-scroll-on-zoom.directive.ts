import { Directive, effect, ElementRef, inject } from '@angular/core';

import { ZoomService } from '../services/zoom.service';

/**
 * Directive that automatically adjusts scroll position when zooming
 * to keep the visible content area proportional to the new scale.
 */
@Directive({
	selector: '[clrwdocwScaleScrollOnZoom]',
	standalone: true,
})
export class ScaleScrollOnZoomDirective {
	private readonly zoomService = inject(ZoomService);

	private readonly viewport: HTMLElement = inject(ElementRef).nativeElement;

	private previousScale = this.zoomService.currentScale();

	public constructor() {
		effect(() => {
			const currentScale = this.zoomService.currentScale();

			if (this.viewport) {
				this.viewport.scrollTo({
					top: this.viewport.scrollTop * (currentScale / this.previousScale),
					left: this.viewport.scrollLeft * (currentScale / this.previousScale),
					behavior: 'auto',
				});
				this.previousScale = currentScale;
			}
		});
	}
}
