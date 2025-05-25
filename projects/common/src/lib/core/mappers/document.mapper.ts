import { Injectable, inject } from '@angular/core';
import { MapperFromDto } from '@clrwdoc/common/core/mappers/mapper';
import { DocumentDto } from '@clrwdoc/common/core/dtos/document.dto';
import { DocumentPageMapper } from '@clrwdoc/common/core/mappers/document-page.mapper';
import { DocumentModel } from '@clrwdoc/common/core/models/document-model';

/** Promo mapper. */
@Injectable({
	providedIn: 'root',
})
export class DocumentMapper implements MapperFromDto<DocumentDto, DocumentModel> {
	private readonly documentPageMapper = inject(DocumentPageMapper);

	/** @inheritdoc */
	public fromDto(dto: DocumentDto): DocumentModel {
		return {
			name: dto.name,
			pages: dto.pages.map(pageDto => this.documentPageMapper.fromDto(pageDto)),
			annotationLayers:
				dto.annotationLayers === undefined ?
					dto.pages.map(page => ({
						annotations: [],
						pageNumber: page.number,
					})) :
					[],
		};
	}
}
