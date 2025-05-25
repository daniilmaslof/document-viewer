import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, output, signal } from '@angular/core';
import { Annotation } from '@clrwdoc/common/core/models/annotation';
import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';

import { Control, tuiAsControl } from '@clrwdoc/common/core/utils/control';

import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { calculateElementPercentPosition } from '@clrwdoc/common/core/utils/calculate-size-percentage';

import { ZoomService } from '../../services/zoom.service';

/**
 * A draggable component displays the annotation and is the CVA for the annotation.
 * It depends on zoom service because virtual scroll caches components and does not recreate them.
 * Therefore, when zooming, we restore the position.
 */
@Component({
	selector: 'clrwdocw-annotation',
	imports: [CdkDrag, MatIcon, MatMiniFabButton],
	templateUrl: './annotation.component.html',
	styleUrl: './annotation.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [tuiAsControl(AnnotationComponent)],
	standalone: true,
	host: {
		'[style.width.%]': 'value().width',
		'[style.height.%]': 'value().height',
	},
})
export class AnnotationComponent extends Control<Annotation> {

	/** Container width. */
	public readonly containerWidth = input.required<number>();

	/** Container height. */
	public readonly containerHeight = input.required<number>();

	/** Remove annotation event.*/
	public readonly removeAnnotation = output();

	private readonly elementRef: HTMLElement = inject(ElementRef).nativeElement;

	private readonly zoomService = inject(ZoomService);

	/** Start annotation position(cdkDragFreeDragPosition). */
	public readonly startPoint = signal({ x: 0, y: 0 });

	/**
	 * Change annotation position.
	 * @param dragEnd Drag end event.
	 */
	public changePosition(dragEnd: CdkDragEnd): void {
		const value = this.value();
		if (value === null) {
			return;
		}
		const dragPosition = dragEnd.source.getFreeDragPosition();
		this.onChange({
			...value,
			...calculateElementPercentPosition(
				{
					width: this.containerWidth(),
					height: this.containerHeight(),
				},
				{
					width: this.elementRef.offsetWidth,
					height: this.elementRef.offsetHeight,
				},
				{ top: dragPosition.y, left: dragPosition.x },
			),
		});
	}

	/**
	 * A side effect that restores the position when zoomed.
	 * MarkForCheck is used because only ZoomControlView is an active consumer of the currentScale signal.
	 * And the startPoint does not change.
	 */
	public constructor() {
		super();
		effect(() => {
			this.startPoint.set({
				x: ((this.value()?.left ?? 0) * this.containerWidth()) / 100,
				y: ((this.value()?.top ?? 0) * this.containerHeight()) / 100,
			});
			if (this.zoomService.currentScale()) {
				this.cdr.markForCheck();
			}
		});
	}
}
