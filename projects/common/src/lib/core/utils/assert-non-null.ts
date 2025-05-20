import { AppError } from '../models/app-error';

/**
 * Type-assertion for non-nullable types.
 * @param value Value to assert.
 */
export function assertNonNull<T>(value: T): asserts value is NonNullable<T> {
	if (value == null) {
		throw new AppError('Unexpected null.');
	}
}
