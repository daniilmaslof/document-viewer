import { Component, ChangeDetectionStrategy, inject, DestroyRef, signal } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { take } from 'rxjs';

import { MatButton } from '@angular/material/button';

import { IMAGE_LOADER } from '@clrwdoc/common/core/services/image-loader';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';

import { readDataUrlAsImage } from '@clrwdoc/common/core/utils/rxjs/read-data-url-as-image';

import { filterNull } from '@clrwdoc/common/core/utils/rxjs/filter-null';

import { UploaderComponent } from '../uploader/uploader.component';

/**
 * Max size of uploaded file in bytes (5MB).
 */
export const MAX_FILE_SIZE = 5000000;

/**
 * TODO (Maslov D): Добавить image cropper или валидацию по размеру изображения.
 * Dialog component for handling file uploads with size validation and preview functionality.
 */
@Component({
	selector: 'clrwdocw-uploader-dialog',
	templateUrl: './uploader-dialog.component.html',
	styleUrl: './uploader-dialog.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		UploaderComponent,
		MatButton,
		MatDialogTitle,
		MatDialogContent,
		MatDialogActions,
	],
})
export class UploaderDialogComponent {
	private readonly loader = inject(IMAGE_LOADER);

	private readonly dialogRef = inject(MatDialogRef);

	private readonly destroyRef = inject(DestroyRef);

	/**
	 * Stream for error messages.
	 */
	public readonly error = signal('');

	/**
	 * Image url.
	 */
	public readonly uploadedImageUrl = signal<string | null>(null);

	/** Image html. */
	public readonly image = toSignal(toObservable(this.uploadedImageUrl).pipe(
		filterNull(),
		readDataUrlAsImage(),
	));

	/**
	 * Close the dialog.
	 */
	public close(): void {
		this.dialogRef.close();
	}

	/**
	 * Handle file upload and validate file size.
	 * @param file The file to be uploaded.
	 */
	public uploadFile(file: File): void {
		if (file.size > MAX_FILE_SIZE) {
			this.error.set('Check the picture size. The largest single-file support is 5 MB');
			return;
		}
		this.loader(file)
			.pipe(take(1), takeUntilDestroyed(this.destroyRef))
			.subscribe(url => this.uploadedImageUrl.set(url));
	}

	/**
	 * Save and close dialog with current file.
	 */
	public saveFiles(): void {
		this.dialogRef.close(this.image());
	}
}
