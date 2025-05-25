import { Injectable } from '@angular/core';

import { PageDto } from '@clrwdoc/common/core/dtos/page.dto';
import { DocumentPage } from '@clrwdoc/common/core/models/document-page';
import { MapperFromDto } from '@clrwdoc/common/core/mappers/mapper';

/** Page mapper. */
@Injectable({
	providedIn: 'root',
})
export class DocumentPageMapper implements MapperFromDto<PageDto, DocumentPage> {

	/** @inheritdoc */
	public fromDto(dto: PageDto): DocumentPage {
		return {
			number: dto.number,
			imageUrl: dto.imageUrl,
			width: 0,
			height: 0,
		};
	}
}
