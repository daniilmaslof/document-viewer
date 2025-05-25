import { Observable, Observer, OperatorFunction, switchMap } from 'rxjs';

/**
 * Read url as image.
 */
export function readDataUrlAsImage(): OperatorFunction<string, HTMLImageElement> {
	return switchMap(
		(buffer: string) => new Observable(
			(observer: Observer<HTMLImageElement>) => {
				let image: HTMLImageElement | null = new Image();

				image.onerror = err => observer.error(err);
				image.onabort = err => observer.error(err);
				image.onload = () => {
					observer.next(image as HTMLImageElement);
					observer.complete();
				};
				image.src = buffer;

				return function clear() {
					image = null;
				};
			},
		),
	);
}
