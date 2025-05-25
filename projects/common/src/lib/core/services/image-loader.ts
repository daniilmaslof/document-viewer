import { InjectionToken } from '@angular/core';
import { fromEvent, map, mergeMap, Observable, Observer, OperatorFunction } from 'rxjs';

type Handler<T, G> = (item: T) => G;

/**
 * Image loader handler.
 */
export const IMAGE_LOADER: InjectionToken<Handler<Blob | File, Observable<string>>> = new InjectionToken<
	Handler<Blob | File, Observable<string>>
>('[IMAGE_LOADER]', {
	factory: () => file => {
		const fileReader = new FileReader();

		fileReader.readAsDataURL(file);

		return fromEvent(fileReader, 'load').pipe(map(() => String(fileReader.result)));
	},
});

/**
 * Convert file to base 64.
 */
export function readFileAsDataUrl(): OperatorFunction<Blob, string> {
	return mergeMap((blob: Blob) => createObservableForFileReader(blob));
}

/**
 * Create observable from reader.
 * @param blob Blob.
 */
function createObservableForFileReader(blob: Blob): Observable<string> {
	return new Observable((observer: Observer<string>) => {
		const reader = new FileReader();

		reader.onerror = err => observer.error(err);
		reader.onabort = err => observer.error(err);
		reader.onload = () => observer.next(reader.result as string);
		reader.onloadend = () => observer.complete();
		reader.readAsDataURL(blob);

		return () => reader.abort();
	});
}
