import { Size } from '@clrwdoc/common/core/models/size';
import { Position } from '@clrwdoc/common/core/models/position';

/**
 * Calculates the position and size of an element relative to a container,
 * expressed as percentages.
 *
 * @param containerSize - The size of the container (in pixels).
 * @param elementSize - The size of the element (in pixels).
 * @param position - The top-left position of the element within the container (in pixels).
 * @returns An object containing:
 *  - `left`: Horizontal position in percentage
 *  - `top`: Vertical position in percentage
 *  - `widthPercent`: Element width as a percentage of the container width
 *  - `heightPercent`: Element height as a percentage of the container height.
 */
export function calculateElementPercentPosition(
	containerSize: Size,
	elementSize: Size,
	position: Position,
): {
		left: number;
		top: number;
		width: number;
		height: number;
	} {
	const widthPercent = (elementSize.width / containerSize.width) * 100;
	const heightPercent = (elementSize.height / containerSize.height) * 100;

	const left = (position.left / containerSize.width) * 100;
	const top = (position.top / containerSize.height) * 100;

	return {
		left,
		top,
		width: widthPercent,
		height: heightPercent,
	};
}
