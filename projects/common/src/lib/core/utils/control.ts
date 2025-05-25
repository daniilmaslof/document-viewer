import {
	ChangeDetectorRef,
	computed,
	Directive,
	ExistingProvider,
	inject, Provider,
	ProviderToken,
	signal, Type,
	WritableSignal,
} from '@angular/core';
import { ControlValueAccessor, FormControlStatus, NgControl, NgModel } from '@angular/forms';
import {
	delay,
	distinctUntilChanged,
	EMPTY,
	filter,
	map,
	merge,
	startWith,
	Subject,
	switchMap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Взял Taiga ControlValueAccessor Не хотел NDA нарушать.

/** Empty function used as a default callback for control events. */
// eslint-disable-next-line no-empty-function
export const EMPTY_FUNCTION: (...args: unknown[]) => void = () => {};

/**
 * Taiga control.
 */
@Directive()
export abstract class Control<T> implements ControlValueAccessor {
	/** Subject for triggering control refresh. */
	private readonly refresh$ = new Subject<void>();

	/** Signal for handling pseudo-invalid state. */
	private readonly pseudoInvalid = signal<boolean | null>(null);

	/** Internal signal for storing control value. */
	private readonly internal: WritableSignal<null | T> = signal(null);

	/** Reference to the NgControl instance for form control functionality. */
	protected readonly control = inject(NgControl, { self: true });

	/** Reference to the ChangeDetectorRef for managing view updates. */
	protected readonly cdr = inject(ChangeDetectorRef);

	/** Computed signal that returns the current control value. */
	public readonly value = computed(() => this.internal() ?? null);

	/** Signal indicating if the control is in read-only mode. */
	public readonly readOnly = signal(false);

	/** Signal indicating if the control has been touched by user interaction. */
	public readonly touched = signal(false);

	/** Signal for tracking the current form control validation status. */
	public readonly status = signal<FormControlStatus | undefined>(undefined);

	/** Computed signal indicating if the control is in disabled state. */
	public readonly disabled = computed(() => this.status() === 'DISABLED');

	/** Computed signal indicating if the control can accept user interactions. */
	public readonly interactive = computed(() => !this.disabled() && !this.readOnly());

	/**
	 * Computed signal for control's invalid state.
	 * Takes into account pseudo-invalid state, interactivity, and touched status.
	 */
	public readonly invalid = computed(() =>
		this.pseudoInvalid() !== null ?
			!!this.pseudoInvalid() && this.interactive() :
			this.interactive() && this.touched() && this.status() === 'INVALID');

	/**
	 * Computed signal for control's current mode.
	 * Can be 'readonly', 'invalid', or 'valid'.
	 */
	public readonly mode = computed(() =>
		// eslint-disable-next-line no-nested-ternary
		this.readOnly() ? 'readonly' : this.invalid() ? 'invalid' : 'valid');

	/** Callback function executed when the control is touched. */
	public onTouched = EMPTY_FUNCTION;

	/** Callback function executed when the control value changes. */
	public onChange: (value: T) => void = EMPTY_FUNCTION;

	protected constructor() {
		this.control.valueAccessor = this;
		this.refresh$
			.pipe(
				delay(0),
				startWith(null),
				map(() => this.control.control),
				filter(Boolean),
				distinctUntilChanged(),
				switchMap(c =>
					merge(
						c.valueChanges,
						c.statusChanges,
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						(c as any).events || EMPTY,
					).pipe(startWith(null))),
				takeUntilDestroyed(),
			)
			.subscribe(() => this.update());
	}

	/**
	 * Registers a callback function that is called when the control's value changes.
	 * Part of the ControlValueAccessor interface.
	 * @param onChange Function to be called when the value changes.
	 */
	public registerOnChange(onChange: (value: unknown) => void): void {
		this.refresh$.next();

		this.onChange = (value: T) => {
			if (value === this.internal()) {
				return;
			}

			onChange(this.toControlValue(value));
			this.internal.set(value);
			this.update();
		};
	}

	/**
	 * Registers a callback function that is called when the control is touched.
	 * Part of the ControlValueAccessor interface.
	 * @param onTouched Function to be called when the control is touched.
	 */
	public registerOnTouched(onTouched: () => void): void {
		this.onTouched = () => {
			onTouched();
			this.update();
		};
	}

	/**
	 * Sets the disabled state of the control.
	 * Part of the ControlValueAccessor interface.
	 */
	public setDisabledState(): void {
		this.update();
	}

	/**
	 * Writes a new value to the control.
	 * Part of the ControlValueAccessor interface.
	 * @param value The new value to write to the control.
	 */
	public writeValue(value: T | null): void {
		// TODO: https://github.com/angular/angular/issues/14988
		const safe = this.control instanceof NgModel ? this.control.model : value;

		this.internal.set(this.fromControlValue(safe));
		this.update();
	}

	/**
	 * Converts a control value from the external format to the internal format.
	 * @param value Value to convert.
	 */
	private fromControlValue(value: unknown): T {
		return (value as T);
	}

	private toControlValue(value: T): unknown {
		return value;
	}

	private update(): void {
		this.status.set(this.control.control?.status);
		this.touched.set(!!this.control.control?.touched);
		this.cdr.markForCheck();
	}
}

/**
 * Creates an ExistingProvider that maps one token to another.
 * Used for dependency injection token mapping.
 * @param provide Token to provide.
 * @param useExisting Existing token to use.
 */
export function tuiProvide<T>(
	provide: ProviderToken<T>,
	useExisting: ProviderToken<T>,
): ExistingProvider {
	return { provide, useExisting };
}

/**
 * Creates a provider configuration for a Control type.
 * Helper function to set up dependency injection for controls.
 * @param control Control type to provide.
 */
export function tuiAsControl<T>(control: Type<Control<T>>): Provider {
	return tuiProvide(Control, control);
}
