import { filter, map, Observable, OperatorFunction } from 'rxjs';

/**
 * Filter null.
 */
export function filterNull<T>(): OperatorFunction<T, NonNullable<T>> {
	return (source$): Observable<NonNullable<T>> =>
		source$.pipe(
			filter(val => val != null),
			map(val => val as NonNullable<T>),
		);
}
