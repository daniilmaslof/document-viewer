import { AbstractControl, FormControl } from '@angular/forms';

/**
 * Utility type for defining form control structures.
 * Preserves existing form controls while converting other properties to FormControl instances.
 */
export type ControlsOf<T> = {
	[key in keyof T]: T[key] extends AbstractControl
		? T[key]
		: FormControl<T[key]>
};

/**
 * Type utility for extracting values from form control structures.
 */
export type FormValues<T> = {
	[key in keyof T]: T[key] extends AbstractControl
		? T[key]['value']
		: never
};

/**
 * Type utility for extracting raw values from form control structures.
 */
export type RawFormValues<T> = {
	[key in keyof T]: T[key] extends AbstractControl
		? ReturnType<T[key]['getRawValue']>
		: never
};
