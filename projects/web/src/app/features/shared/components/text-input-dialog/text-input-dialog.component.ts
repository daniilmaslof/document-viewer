import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
	MatDialogRef,
	MatDialogContent,
	MatDialogTitle, MatDialogActions, MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

/** Text input Dialog data. */
export type TextInputDialogData = {

	/** Title dialog. */
	readonly title: string;

	/** Label input. */
	readonly label: string;
};

/**
 * Dialog component for creating and editing text annotations.
 */
@Component({
	selector: 'clrwdocw-text-input-dialog',
	standalone: true,
	imports: [MatDialogContent, MatLabel, MatDialogTitle, MatFormField, FormsModule, MatDialogActions, MatButton, MatInput],
	templateUrl: './text-input-dialog.component.html',
	styleUrl: './text-input-dialog.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInputDialogComponent {
	private readonly dialogRef = inject(MatDialogRef<TextInputDialogComponent>);

	/** Data. */
	public readonly data = inject<TextInputDialogData>(MAT_DIALOG_DATA);

	/** Signal holding the current annotation text value. */
	public readonly annotationText = signal('');

	/** Handles dialog cancellation. */
	public onCancel(): void {
		this.dialogRef.close();
	}

	/** Saves the annotation text and closes the dialog. */
	public onSave(): void {
		this.dialogRef.close(this.annotationText());
	}
}
