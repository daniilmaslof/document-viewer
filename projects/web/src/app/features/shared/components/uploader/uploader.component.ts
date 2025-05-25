import { EventEmitter, Component, ChangeDetectionStrategy, Output, input } from '@angular/core';
import { MatButton } from '@angular/material/button';

/**
 * Component that handles file upload functionality through drag and drop or manual selection.
 */
@Component({
	selector: 'clrwdocw-uploader',
	templateUrl: './uploader.component.html',
	styleUrls: ['./uploader.component.css'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class.on-drag]': 'onDrag',
		'[class.on-wrong-drag]': 'onWrongDrag',
		'(drop)': 'onDrop($event)',
		'(dragover)': 'onDragOver($event)',
		'(dragenter)': 'onDragEnter($event)',
		'(dragleave)': 'onDragLeave($event)',
	},
	imports: [MatButton],
})
export class UploaderComponent {

	/** Accept type. */
	public acceptType = input('image/*');

	/**
	 * Counts up on all dragenter events and counts down on dragleave events.
	 */
	private dragEnterCount = 0;

	/**
	 * Shown if drag and drop is possible.
	 */
	public onDrag = false;

	/**
	 * Shown if drag and drop is not possible.
	 */
	public onWrongDrag = false;

	/**
	 * Controls whether to display the default hint.
	 */
	public isDisplayHint = false;

	/**
	 * Emits when files are dropped or selected.
	 */
	@Output()
	public readonly filesDropped = new EventEmitter<File>();

	/**
	 * Handles the drop event for files.
	 * @param event The drag event containing the dropped files.
	 */
	public onDrop(event: DragEvent): void {
		stopEvent(event);
		if (this.hasFiles(event)) {
			const files = getFiles(event);
			this.uploadedFiles(files[0]);
		}
		this.dragEnterCount = 0;
		this.showWaitingDrag();
	}

	/**
	 * Handles the dragover event.
	 * @param event The drag event to handle.
	 */
	public onDragOver(event: DragEvent): void {
		stopEvent(event);
	}

	/**
	 * Handles the dragenter event and shows whether a drop is possible.
	 * @param event The drag event to handle.
	 */
	public onDragEnter(event: DragEvent): void {
		this.dragEnterCount++;
		stopEvent(event);
		if (this.hasFiles(event)) {
			this.showOnDrag();
		} else {
			this.showOnWrongDrag();
		}
	}

	/**
	 * Handles the dragleave event and updates the drag state.
	 * @param event The drag event to handle.
	 */
	public onDragLeave(event: DragEvent): void {
		this.dragEnterCount--;
		if (this.dragEnterCount === 0) {
			this.showWaitingDrag();
		}
		stopEvent(event);
	}

	/**
	 * Clears the value in multiple input so that even when the same file is selected, onchange is called.
	 * @param inputElement Input element from which onchange is called.
	 */
	public clearValue(inputElement: HTMLInputElement): void {
		inputElement.value = '';
	}

	/**
	 * Handles file upload from manual selection.
	 * @param event Input file event.
	 */
	public onUpload(event: Event): void {
		const inputElement = event.target as HTMLInputElement;
		const { files } = inputElement;
		if (files?.[0]) {
			this.uploadedFiles(files[0]);
		}
	}

	private uploadedFiles(files: File): void {
		this.filesDropped.emit(files);
		this.isDisplayHint = false;
	}

	private hasFiles(event: DragEvent): boolean {
		const files = getFiles(event);
		const items = getDataTransferItems(event).filter(value => value.kind === 'file');
		return !![...Array.from(files), ...Array.from(items)].length;
	}

	private showOnDrag(): void {
		this.onDrag = true;
		this.onWrongDrag = false;
	}

	private showOnWrongDrag(): void {
		this.onDrag = false;
		this.onWrongDrag = true;
	}

	private showWaitingDrag(): void {
		this.onDrag = false;
		this.onWrongDrag = false;
	}
}

/**
 * Extracts files from a DragEvent.
 * @param event The drag event to extract files from.
 */
function getFiles(event: DragEvent): File[] {
	const files = event?.dataTransfer?.files ?? [];
	return Array.from(files);
}

/**
 * Extracts DataTransferItems from a DragEvent.
 * @param event The drag event to extract items from.
 */
function getDataTransferItems(event: DragEvent): DataTransferItem[] {
	const items = event?.dataTransfer?.items ?? [];
	return Array.from(items);
}

/**
 * Prevents default behavior and stops event propagation.
 * @param event The event to stop.
 */
function stopEvent(event: DragEvent): void {
	event.preventDefault();
	event.stopPropagation();
}
