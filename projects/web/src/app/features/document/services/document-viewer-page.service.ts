import { effect, inject, Injectable } from '@angular/core';
import { DocumentApiService } from '@clrwdoc/common/core/services/document-api.service';
import { ActivatedRoute } from '@angular/router';

import { DocumentFormMapper } from '@clrwdoc/common/core/mappers/document-form.mapper';

import { toSignal } from '@angular/core/rxjs-interop';

const PAGE_ID_PARAM = 'id';

/** Document page service. */
@Injectable()
export class DocumentViewerPageService {
	private readonly documentApiService = inject(DocumentApiService);

	private readonly id = inject(ActivatedRoute).snapshot.params[PAGE_ID_PARAM];

	private readonly documentFormMapper = inject(DocumentFormMapper);

	/** Document. */
	public readonly document = toSignal(this.documentApiService.getDocument(this.id));

	/** Document form. */
	public readonly documentForm = this.documentFormMapper.modelToForm(null);

	public constructor() {
		effect(() => {
			const document = this.document();
			if (document) {
				this.documentFormMapper.setValue(this.documentForm, document);
			}
		});
	}

}
