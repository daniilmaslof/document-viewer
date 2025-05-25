import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AppError } from '@clrwdoc/common/core/models/app-error';

/** Represents the metadata of a PNG image. */
type PngSize = {

	/** Width of the PNG image in pixels. */
	width: number;

	/** Height of the PNG image in pixels. */
	height: number;
};

/**
 * TODO (Maslov D): Удалить после добавления размеров страницы на бекенд.
 * Service for extracting width and height from metadata in PNG images.
 */
@Injectable({
	providedIn: 'root',
})
export class PngSizeService {
	private readonly httpClient = inject(HttpClient);

	/**
	 * Extracts metadata from a PNG image URL by reading only 32 bytes.
	 * @param url The URL of the PNG image.
	 * @returns An observable that emits the PNG metadata or throws an error.
	 */
	public extractPngImageSize(url: string): Observable<PngSize> {
		return this.httpClient
			.get(url, {
				headers: {
					// eslint-disable-next-line @typescript-eslint/naming-convention
					Range: 'bytes=0-32',
				},
				responseType: 'arraybuffer',
				observe: 'response',
			})
			.pipe(
				map(response => {
					if (!response.ok && response.status !== 206) {
						throw new AppError(`HTTP error! Status: ${response.status}`);
					}
					if (response.body === null) {
						throw new AppError('Not a valid PNG file');
					}
					const view = new DataView(response.body);
					const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

					const isValidPNG = pngSignature.every((byte, index) => view.getUint8(index) === byte);

					if (!isValidPNG) {
						throw new AppError('Not a valid PNG file');
					}
					const chunkType = String.fromCharCode(
						view.getUint8(12),
						view.getUint8(13),
						view.getUint8(14),
						view.getUint8(15),
					);

					if (chunkType !== 'IHDR') {
						throw new AppError('Not a valid PNG file. Take a png with meta information.');
					}

					const width = view.getUint32(16, false);
					const height = view.getUint32(20, false);

					return { width, height };
				}),
			);
	}
}
