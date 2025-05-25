import { computed, Injectable, signal } from '@angular/core';

/** Default scale value (1 = 100%). */
const DEFAULT_SCALE = 1;

/** Minimum allowed scale value. */
const MIN_SCALE = 0.7;

/** Maximum allowed scale value. */
const MAX_SCALE = 2;

/**
 * A service that manages zoom scale state with reactive signals.
 * Provides functionality to zoom in, zoom out, set specific scale, and reset to default.
 */
@Injectable()
export class ZoomService {

	/** Internal signal holding the current scale value. */
	private readonly scale = signal(DEFAULT_SCALE);

	/**
	 * Computed signal representing the current scale value.
	 * @returns {number} Current zoom scale (1 = 100%).
	 */
	public readonly currentScale = computed(() => this.scale());

	/**
	 * Computed signal indicating if zoom in is possible.
	 * @returns {boolean} True if current scale is less than max scale.
	 */
	public readonly canZoomIn = computed(() => this.scale() < MAX_SCALE);

	/**
	 * Computed signal indicating if zoom out is possible.
	 */
	public readonly canZoomOut = computed(() => this.scale() > MIN_SCALE);

	/**
	 * Increases the current zoom scale by the specified step.
	 * @param step The amount to increase the scale by.
	 */
	public zoomIn(step = 0.1): void {
		if (this.canZoomIn()) {
			this.scale.update(current => Math.min(current + step, MAX_SCALE));
		}
	}

	/**
	 * Decreases the current zoom scale by the specified step.
	 * @param step - The amount to decrease the scale by.
	 */
	public zoomOut(step = 0.1): void {
		if (this.canZoomOut()) {
			this.scale.update(current => Math.max(current - step, MIN_SCALE));
		}
	}
}
