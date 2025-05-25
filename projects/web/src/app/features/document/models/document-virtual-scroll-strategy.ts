import { ListRange } from '@angular/cdk/collections';
import {
	CdkVirtualScrollViewport,
	VirtualScrollStrategy,
} from '@angular/cdk/scrolling';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { DocumentPage } from '@clrwdoc/common/core/models/document-page';

type PageDataOffset = {

	/** Page data offset. */
	readonly startOffset: number;

	/** End offset. */
	readonly endOffset: number;
};

const INDEX_CHANGE_VIEWPORT_PROPORTION = 0.5;

/** Document virtual scroll strategy.*/
export class DocumentVirtualScrollStrategy implements VirtualScrollStrategy {
	private viewport: CdkVirtualScrollViewport | null = null;

	/** Subject that emits the current first visible index in the viewport. */
	private readonly index$: Subject<number> = new Subject<number>();

	/**
	 * Observable that emits when the first visible index changes.
	 * Uses distinctUntilChanged to ensure emission only occurs when the index actually changes.
	 *  This is part of the VirtualScrollStrategy interface implementation.
	 */
	// eslint-disable-next-line rxjs/finnish
	public readonly scrolledIndexChange: Observable<number> = this.index$.pipe(
		distinctUntilChanged(),
	);

	private pagesData: DocumentPage[] = [];

	private pagesDataOffsets: PageDataOffset[] = [];

	private rangeStartIndex: number | null = null;

	private totalHeight = 0;

	private maxPageHeight = 0;

	/**
	 * Updates pages and recalculates data for virtual scroll.
	 * @param pagesData Pages.
	 * This method:
	 * 1. Calculates total scrollable height.
	 * 2. Finds the maximum page height (for buffer calculations).
	 * 3. Precomputes offset positions for each page.
	 * 4. Updates the rendered range based on new data.
	 */
	public setData(
		pagesData: DocumentPage[],
	): void {
		this.pagesData = pagesData;
		this.setTotalHeight();
		this.setMaxPageHeight();
		this.setPagesDataOffsets();
		this.updateRenderedRange();
	}

	/**
	 * Attaches this scroll strategy to a viewport.
	 * @param viewport Virtual scroll viewport.
	 */
	public attach(viewport: CdkVirtualScrollViewport): void {
		this.viewport = viewport;
		this.updateRenderedRange();
	}

	/**
	 * Detach this scroll strategy to a viewport.
	 */
	public detach(): void {
		this.index$.complete();
		this.viewport = null;
	}

	/**
	 * Detach this scroll strategy to a viewport.
	 */
	public onContentScrolled(): void {
		if (this.viewport === null) {
			return;
		}

		this.updateRenderedRange();
	}

	/** Not needed. */
	public onDataLengthChanged(): void {
		// not needed
	}

	/** Not needed. */
	public onContentRendered(): void {
		// not needed
	}

	/** Not needed. */
	public onRenderedOffsetChanged(): void {
		// not needed
	}

	/**
	 * It is not needed now, there is no logic for programmatically navigating to the page index.
	 * @param index Index.
	 * @param behavior Scroll behavior.
	 */
	public scrollToIndex(index: number, behavior?: ScrollBehavior): void {
		if (this.viewport === null) {
			return;
		}

		const offset: number = this.getOffsetForIndex(index);
		this.viewport.scrollToOffset(offset, behavior);
	}

	private setTotalHeight(): void {
		if (this.viewport === null) {
			return;
		}

		const totalHeight: number = this.pagesData.reduce(
			(accumulatorHeight: number, { height }: DocumentPage) =>
				accumulatorHeight + height,
			0,
		);
		this.totalHeight = totalHeight;
		this.viewport.setTotalContentSize(totalHeight);
	}

	private setMaxPageHeight(): void {
		this.maxPageHeight = this.pagesData.reduce(
			(accumulatedValue: number, { height }: DocumentPage) =>
				height > accumulatedValue ? height : accumulatedValue,
			0,
		);
	}

	private setPagesDataOffsets(): void {
		this.pagesDataOffsets = this.pagesData.reduce(
			(
				accumulatorHeights: PageDataOffset[],
				{ height }: DocumentPage,
				currentIndex: number,
			) => {
				if (currentIndex === 0) {
					return [{ startOffset: 0, endOffset: height }];
				}

				const previousIndex: number = currentIndex - 1;
				const previousAccumulatedValue: PageDataOffset =
          accumulatorHeights[previousIndex];

				return [
					...accumulatorHeights,
					{
						startOffset: previousAccumulatedValue.endOffset,
						endOffset: height + previousAccumulatedValue.endOffset,
					},
				];
			},
			[],
		);
	}

	private updateRenderedRange(): void {
		if (this.viewport === null || this.pagesData.length === 0) {
			return;
		}
		const scrollOffset: number = this.rangeStartIndex === null ?
			this.viewport.measureScrollOffset() :
			this.getOffsetForIndex(this.rangeStartIndex);
		const currentRange: ListRange = this.rangeStartIndex === null ?
			this.viewport.getRenderedRange() :
			{ start: this.rangeStartIndex, end: this.rangeStartIndex };

		const { start: rangeStart, end: rangeEnd }: ListRange = currentRange;
		let viewportSize = this.viewport.getViewportSize();
		if (viewportSize === 0) {
			viewportSize = this.viewport.elementRef.nativeElement.clientHeight;
		}
		const dataLength: number = this.viewport.getDataLength();

		const buffer: number = Math.max(2 * viewportSize, 2 * this.maxPageHeight);

		const newRange: ListRange = { start: rangeStart, end: rangeEnd };

		const firstVisibleIndex: number = this.getIndexForOffset(
			scrollOffset,
			'end',
		);

		const currentIndex: number = this.getIndexForOffset(
			scrollOffset + viewportSize * INDEX_CHANGE_VIEWPORT_PROPORTION,
			'end',
		);

		const startBufferOffset: number =
      scrollOffset - this.getOffsetForIndex(rangeStart);
		const endBufferOffset: number =
      this.getOffsetForIndex(rangeEnd) - (scrollOffset + viewportSize);

		const rangeStartIsFirst: boolean = rangeEnd === 0;
		const rangeEndIsLast: boolean = rangeEnd === dataLength;

		const update: VoidFunction = () => {
			this.viewport?.setRenderedRange(newRange);
			const renderedContentOffset: number = this.getOffsetForIndex(
				newRange.start,
			);
			this.viewport?.setRenderedContentOffset(renderedContentOffset);
			this.rangeStartIndex = null;
			this.index$.next(currentIndex);
		};

		if (startBufferOffset < buffer && !rangeStartIsFirst) {
			const expandStartIndex: number = this.getIndexForOffset(
				buffer - startBufferOffset,
				'end',
			);

			const possibleStartIndex: number = rangeStart - expandStartIndex;
			const possibleEndIndex: number =
        firstVisibleIndex +
        this.getIndexForOffset(viewportSize + buffer, 'end');

			newRange.start = Math.max(0, possibleStartIndex);
			newRange.end = Math.min(dataLength, possibleEndIndex);
			update();
			return;
		}

		if (endBufferOffset < buffer && !rangeEndIsLast) {
			const expandEndIndex: number = this.getIndexForOffset(
				buffer - endBufferOffset,
				'end',
			);

			if (expandEndIndex === 0) {
				update();
				return;
			}

			const possibleStartIndex: number =
        firstVisibleIndex - this.getIndexForOffset(buffer, 'end');
			const possibleEndIndex: number = rangeEnd + expandEndIndex;
			newRange.start = Math.max(0, possibleStartIndex);
			newRange.end = Math.min(dataLength, possibleEndIndex);

			update();
			return;
		}

		update();
	}

	private getOffsetForIndex(
		index: number,
		mode: 'start' | 'end' = 'start',
	): number {
		if (this.pagesDataOffsets === null) {
			return -1;
		}

		return mode === 'start' ?
			this.pagesDataOffsets[index]?.startOffset :
			this.pagesDataOffsets[index]?.endOffset;
	}

	private getIndexForOffset(
		offset: number,
		mode: 'start' | 'end' = 'start',
	): number {
		if (this.pagesDataOffsets === null || this.totalHeight === 0) {
			return -1;
		}

		const possibleIndex: number = this.pagesDataOffsets.findIndex(
			({ startOffset, endOffset }: PageDataOffset) =>
				mode === 'start' ?
					Math.trunc(startOffset) >= offset :
					Math.trunc(endOffset) > offset,
		);

		if (possibleIndex < 0 && this.totalHeight <= offset * 2) {
			return this.pagesDataOffsets.length;
		}

		return Math.max(possibleIndex, 0);
	}
}
