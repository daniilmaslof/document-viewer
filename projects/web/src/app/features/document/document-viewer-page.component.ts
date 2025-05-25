import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MatToolbar } from '@angular/material/toolbar';

import { MatButton } from '@angular/material/button';

import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { DocumentViewerPageService } from './services/document-viewer-page.service';
import { DocumentViewerScrollingComponent } from './components/document-viewer-scrolling/document-viewer-scrolling.component';
import { ZoomService } from './services/zoom.service';
import { ZoomControlComponent } from './components/zoom-control/zoom-control.component';

/** Document viewer page. */
@Component({
	selector: 'clrwdocw-document',
	templateUrl: './document-viewer-page.component.html',
	styleUrls: ['./document-viewer-page.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [DocumentViewerScrollingComponent, MatToolbar, ZoomControlComponent, MatButton, MatProgressSpinner],
	providers: [DocumentViewerPageService, ZoomService],
	standalone: true,
})
export class DocumentViewerPageComponent {
	/** Set --scale-factor variable. */
	public readonly scale = inject(ZoomService).currentScale;

	private readonly documentViewerPageService = inject(DocumentViewerPageService);

	/** Document. */
	public readonly document = this.documentViewerPageService.document;

	/** Submit. */
	public submit(): void {
		// eslint-disable-next-line no-console
		console.log(this.documentViewerPageService.documentForm)
		console.log(this.documentViewerPageService.documentForm.value);
	}
}
