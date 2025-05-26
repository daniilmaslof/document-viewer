import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DestroyRef,
	ElementRef,
	inject,
	input,
	signal,
	viewChild,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AnnotationLayerFormControls } from '@clrwdoc/common/core/models/form/annotation-layer-form';

import { AnnotationsFormMapper } from '@clrwdoc/common/core/mappers/annotations-form.mapper';

import { MatMenu, MatMenuContent, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

import { MatDialog } from '@angular/material/dialog';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { calculateConstrainedSizePercentage } from '@clrwdoc/common/core/utils/calculate-constrained-size-percentage';

import { Annotation } from '@clrwdoc/common/core/models/annotation';

import { AnnotationComponent } from '../annotation/annotation.component';
import {
	TextInputDialogComponent,
	TextInputDialogData,
} from '../../../shared/components/text-input-dialog/text-input-dialog.component';
import { UploaderDialogComponent } from '../../../shared/components/uploader-dialog/uploader-dialog.component';

/**
 * Component representing an annotation layer for a document page.
 * Restricting movement within an annotation.(cdkDragBoundary).
 * Clicking on the layer opens a menu for selecting the annotation creation.
 */
@Component({
	selector: 'clrwdocw-annotation-layer',
	imports: [AnnotationComponent, ReactiveFormsModule, MatMenu, MatMenuContent, MatMenuItem, MatMenuTrigger],
	standalone: true,
	templateUrl: './annotation-layer.component.html',
	styleUrl: './annotation-layer.component.css',
	host: {
		'[class.annotation-layer]': 'true',
		'(click)': 'onAnnotationLayerClick($event)',
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnotationLayerComponent {
	/** Annotation layer form. */
	public readonly annotationLayerForm = input.required<FormGroup<AnnotationLayerFormControls>>();

	/** Container element. */
	public readonly containerElement: HTMLElement = inject(ElementRef).nativeElement;

	/** Menu position. */
	public readonly menuPosition = signal({ x: 0, y: 0 });

	private readonly menuTrigger = viewChild(MatMenuTrigger);

	private readonly cdr = inject(ChangeDetectorRef);

	private readonly destroyRef = inject(DestroyRef);

	private readonly dialog = inject(MatDialog);

	private readonly annotationsFormMapper = inject(AnnotationsFormMapper);

	/**
	 * Remove annotation.
	 * @param index Index.
	 */
	public onRemoveAnnotation(index: number): void {
		this.annotationLayerForm().controls.annotations.removeAt(index);
	}

	/**
	 * Clicking on the annotation layer opens a menu for creating an annotation.
	 * @param event Pointer event.
	 */
	public onAnnotationLayerClick(event: PointerEvent): void {
		const rect = this.containerElement.getBoundingClientRect();
		const relativeX = event.clientX - rect.left;
		const relativeY = event.clientY - rect.top;
		this.menuPosition.set({ x: relativeX, y: relativeY });
		this.menuTrigger()?.openMenu();
	}

	/** Open dialog for create text annotation. */
	public openTextAnnotationDialog(): void {
		this.dialog
			.open<TextInputDialogComponent, TextInputDialogData, string>(TextInputDialogComponent, {
				data: { title: 'Create Annotation', label: 'Annotation Text' },
			})
			.afterClosed()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe(text => {
				if (text) {

					// TODO Maslov D Реализовать нормальный расчёт размеров текстовой аннотации (скрытй элемент).
					const elementSize = { width: text.length * 14, height: text.length * 14 };
					const containerSize = {
						width: this.containerElement.offsetWidth,
						height: this.containerElement.offsetHeight,
					};
					const percentSize = calculateConstrainedSizePercentage(containerSize, elementSize, {
						top: this.menuPosition().y,
						left: this.menuPosition().x,
					});
					this.createAnnotationControl({
						content: text,
						type: 'text',
						...percentSize,
					});
					this.cdr.markForCheck();
				}
			});
	}

	/** Open dialog for create image annotation. */
	public openUploadImageDialog(): void {
		this.dialog
			.open<UploaderDialogComponent, undefined, HTMLImageElement>(UploaderDialogComponent, {
				width: '400px',
				height: '400px',
			})
			.afterClosed()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe(image => {
				if (image === undefined) {
					return;
				}
				const elementSize = { width: image.naturalWidth, height: image.naturalHeight };
				const containerSize = { width: this.containerElement.offsetWidth, height: this.containerElement.offsetHeight };
				const percentSize = calculateConstrainedSizePercentage(containerSize, elementSize, {
					top: this.menuPosition().y,
					left: this.menuPosition().x,
				});
				this.createAnnotationControl({
					content: image.src,
					type: 'image',
					...percentSize,
				});
				this.cdr.markForCheck();
			});
	}

	private createAnnotationControl(annotation: Annotation): void {
		this.annotationLayerForm().controls.annotations.push(
			this.annotationsFormMapper.createAnnotationForm(annotation),
		);
	}
}
