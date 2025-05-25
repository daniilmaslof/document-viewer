import {
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { DocumentPage } from '@clrwdoc/common/core/models/document-page';

/** Page layer. */
@Component({
	selector: 'clrwdocw-document-page',
	imports: [NgOptimizedImage],
	standalone: true,
	templateUrl: './document-page.component.html',
	styleUrl: './document-page.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentPageComponent {
	/** Page. */
	public page = input.required<DocumentPage>();

	/** Src. */
	public src = computed(() => this.page().imageUrl);
}
