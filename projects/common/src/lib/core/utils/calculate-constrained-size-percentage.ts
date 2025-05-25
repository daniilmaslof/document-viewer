import { Size } from '@clrwdoc/common/core/models/size';
import { Position } from '@clrwdoc/common/core/models/position';

/**
 * Calculates the position and size in percentages.
 * Based on the element and container size and the position.
 *
 * @param containerSize - The size of the container (in pixels).
 * @param elementSize - The size of the element (in pixels).
 * @param cursorPosition - The cursor's position relative to the container (in pixels).
 */
export function calculateConstrainedSizePercentage(
	containerSize: Size,
	elementSize: Size,
	cursorPosition: Position,
): {
		left: number;
		top: number;
		width: number;
		height: number;
	} {
	const containerWidth = containerSize.width;
	const containerHeight = containerSize.height;

	const widthPercent = (elementSize.width / containerWidth) * 100;
	const heightPercent = (elementSize.height / containerHeight) * 100;

	let posX = (cursorPosition.left / containerWidth) * 100;
	let posY = (cursorPosition.top / containerHeight) * 100;

	// Clamp position to keep the element within container bounds
	posX = Math.max(0, Math.min(posX, 100 - widthPercent));
	posY = Math.max(0, Math.min(posY, 100 - heightPercent));

	// Center the element if it's larger than the container
	if (widthPercent > 100) {
		posX = (100 - widthPercent) / 2;
	}

	if (heightPercent > 100) {
		posY = (100 - heightPercent) / 2;
	}

	return {
		left: posX,
		top: posY,
		width: widthPercent,
		height: heightPercent,
	};
}
