import { computed, inject, Injectable, Signal } from '@angular/core';
import { DocumentPage } from '@clrwdoc/common/core/models/document-page';

import { DocumentViewerPageService } from './document-viewer-page.service';
import { ZoomService } from './zoom.service';

/**
 * Stores pages with current size. Used for custom virtual scroll.
 * Calculates page sizes based on the scale and squaring factor.
 * */
@Injectable()
export class DocumentViewerScrollingStateService {

	private readonly documentViewerPageService = inject(DocumentViewerPageService);

	private readonly pages = computed(() => this.documentViewerPageService.document()?.pages);

	private readonly scale = inject(ZoomService).currentScale;

	/**
	 * Returns pages with scale and squaring factor.
	 */
	public readonly squaredPagesData: Signal<DocumentPage[]> = computed(() => {
		const pages = this.pages();
		const scale = this.scale();
		if (pages === undefined) {
			return [];
		}
		return pages.map(pageData =>
			// const scaleFactor: number = this.calculateSquaringFactor(pageData, size);
			({
				...pageData,
				width: pageData.width * scale,
				height: pageData.height * scale,
			}));
	});

	// public viewerSize = toSignal(
	// 	inject(ResizeObserverService).pipe(
	// 		debounceTime(100),
	// 		map(() => {
	// 			const { clientWidth, clientHeight } = this.documentViewerRef.nativeElement;
	// 			return { width: clientWidth, height: clientHeight };
	// 		}),
	// 		distinctUntilChanged(
	// 			(previous, current) => previous.width === current.width && previous.height === current.height,
	// 		),
	// 	),
	// 	{
	// 		initialValue: null,
	// 	},
	// );

	// private calculateSquaringFactor(
	// 	{ width, height }: DocumentPage,
	// 	{ width: containerWidth, height: containerHeight }: ContainerSize,
	// ): number {
	// 	const buffer: number = 2 * this.pageBoundOffsetPx;
	//
	// 	const squareFactorX: number = (containerWidth - buffer) / (width);
	// 	const squareFactorY: number = (containerHeight - buffer) / (height);
	//
	// 	return Math.min(squareFactorX, squareFactorY);
	// }
}
