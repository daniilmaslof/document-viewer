import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay, of, switchMap, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { z } from 'zod';

import { DocumentMapper } from '@clrwdoc/common/core/mappers/document.mapper';
import { documentSchemaDto } from '@clrwdoc/common/core/dtos/document.dto';
import { DocumentModel } from '@clrwdoc/common/core/models/document-model';

import { PngSizeService } from '@clrwdoc/common/core/services/png-size.service';

import { AppUrlsConfig } from './app-urls.config';

/** Mock document service. */
@Injectable()
class MockDocumentService {
	private readonly documentMapper = inject(DocumentMapper);

	private readonly pngSizeService = inject(PngSizeService);

	/**
	 * Get document.
	 * @param id ID.
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public getDocument(id: string): Observable<DocumentModel> {
		const dto = {
			name: 'test doc',
			pages: [
				{
					number: 0,
					imageUrl: 'assets/pages/0.png',
				},
				{
					number: 1,
					imageUrl: 'assets/pages/1.png',
				},
				{
					number: 2,
					imageUrl: 'assets/pages/2.png',
				},
				{
					number: 3,
					imageUrl: 'assets/pages/3.png',
				},
				{
					number: 4,
					imageUrl: 'assets/pages/4.png',
				},
				{
					number: 5,
					imageUrl: 'assets/pages/5.png',
				},
				{
					number: 6,
					imageUrl: 'assets/pages/6.png',
				},
				{
					number: 7,
					imageUrl: 'assets/pages/7.png',
				},
				{
					number: 8,
					imageUrl: 'assets/pages/8.png',
				},
				{
					number: 9,
					imageUrl: 'assets/pages/9.png',
				},
				{
					number: 10,
					imageUrl: 'assets/pages/10.png',
				},
			],
		};
		return of(this.documentMapper.fromDto(dto)).pipe(
			switchMap(document =>
				forkJoin(
					document.pages.map(page =>
						this.pngSizeService.extractPngImageSize(page.imageUrl).pipe(
							map(size => ({
								...page,
								width: size.width,
								height: size.height,
							})),
						)),
				).pipe(map(pages => ({ ...document, pages })))),
		);
	}
}

/** Document service. */
@Injectable({
	providedIn: 'root',
	useClass: MockDocumentService,
})
export class DocumentApiService {
	private readonly httpClient = inject(HttpClient);

	private readonly appUrlsConfig = inject(AppUrlsConfig);

	private readonly documentMapper = inject(DocumentMapper);

	/** Documents. */
	public readonly documents$ = this.initializeDocuments();

	private initializeDocuments(): Observable<DocumentModel[]> {
		return this.httpClient.get<unknown>(this.appUrlsConfig.document.getDocuments).pipe(
			map(response => z.array(z.unknown()).parse(response)),
			map(array => array.map(item => documentSchemaDto.parse(item))),
			map(dtos => dtos.map(dto => this.documentMapper.fromDto(dto))),

			// List of dates is not changed, so we can share it between subscribers.
			shareReplay({ refCount: false, bufferSize: 1 }),
		);
	}

	/**
	 * Get document by id.
	 * @param id Id.
	 */
	public getDocument(id: string): Observable<DocumentModel> {
		const queryParams = {
			id,
		};
		return this.httpClient
			.get<unknown>(this.appUrlsConfig.document.getDocument, {
				params: queryParams,
			})
			.pipe(
				map(response => documentSchemaDto.parse(response)),
				map(batchDto => this.documentMapper.fromDto(batchDto)),
			);
	}
}
