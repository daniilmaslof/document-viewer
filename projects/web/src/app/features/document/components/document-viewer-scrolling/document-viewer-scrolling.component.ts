import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	TrackByFunction,
	AfterViewInit, DestroyRef,
} from '@angular/core';

import {
	ScrollingModule,
	VIRTUAL_SCROLL_STRATEGY,
} from '@angular/cdk/scrolling';

import { ReactiveFormsModule } from '@angular/forms';

import { DocumentPage } from '@clrwdoc/common/core/models/document-page';

import {
	asapScheduler,
	observeOn,
} from 'rxjs';

import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { DocumentVirtualScrollStrategy } from '../../models/document-virtual-scroll-strategy';
import { DocumentViewerScrollingStateService } from '../../services/document-viewer-scrolling-state.service';
import { DocumentPageComponent } from '../document-page/document-page.component';
import { DocumentViewerPageService } from '../../services/document-viewer-page.service';
import { AnnotationLayerComponent } from '../annotation-layer/annotation-layer.component';

import { ScaleScrollOnZoomDirective } from '../../directive/scale-scroll-on-zoom.directive';

/** The component contains a DocumentVirtualScrollStrategy for viewing pages. */
@Component({
	selector: 'clrwdocw-document-viewer-scrolling',
	imports: [
		ScrollingModule,
		DocumentPageComponent,
		ReactiveFormsModule,
		AnnotationLayerComponent,
		ScaleScrollOnZoomDirective,
	],
	templateUrl: './document-viewer-scrolling.component.html',
	styleUrl: './document-viewer-scrolling.component.css',
	standalone: true,
	providers: [
		DocumentViewerScrollingStateService,
		{
			provide: VIRTUAL_SCROLL_STRATEGY,
			useClass: DocumentVirtualScrollStrategy,
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentViewerScrollingComponent implements AfterViewInit {
	private readonly documentViewerScrollingStateService = inject(DocumentViewerScrollingStateService);

	private readonly destroyRef = inject(DestroyRef);

	private readonly documentViewerPageService = inject(DocumentViewerPageService);

	private readonly virtualScrollStrategy = inject(VIRTUAL_SCROLL_STRATEGY) as DocumentVirtualScrollStrategy;

	/** Pages with scaling and squaring. */
	public readonly pages = this.documentViewerScrollingStateService.squaredPagesData;

	private readonly pages$ = toObservable(this.documentViewerScrollingStateService.squaredPagesData);

	/** Document form. */
	public readonly documentForm = this.documentViewerPageService.documentForm;

	/**  It is necessary to add horizontal scrolling if a large element appears in the viewport to avoid shifting the view. */
	public readonly maxWidthOfScrollingContainer = computed(() => {
		const pages = this.pages();
		return Math.max(...pages.map(value => value.width ?? 0));
	});

	/**
	 * Мы хотим отправить данным после this._scrollStrategy.attach(this) и _measureViewportSize.
	 * This._scrollStrategy.attach(this) Находится в Promise.resolve().
	 * Поэтому выносим в микротаску(asapScheduler).
	 * Https://github.com/angular/components/blob/a7150d42cf0d423fe89679e2366a32830bf4aaf3/src/cdk/scrolling/virtual-scroll-viewport.ts#L221C7-L221C25.
	 */
	public ngAfterViewInit(): void {
		this.pages$.pipe(observeOn(asapScheduler)).pipe(
			takeUntilDestroyed(this.destroyRef),
		)
			.subscribe(() => {
				this.virtualScrollStrategy.setData(this.pages());
			});
	}

	/**
	 * Track by.
	 * @param index Index.
	 * @param item Item.
	 */
	public readonly trackByFunction: TrackByFunction<DocumentPage> = (index: number, item: DocumentPage) =>
		`${item.number}`;

}
