import { inject, Injectable } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { RawFormValues } from '@clrwdoc/common/core/utils/types/form';
import { DocumentModel } from '@clrwdoc/common/core/models/document-model';
import { DocumentFormControls } from '@clrwdoc/common/core/models/form/document-form';
import { AnnotationLayerFormMapper } from '@clrwdoc/common/core/mappers/annotation-layer-form.mapper';

/** Document form mapper. */
@Injectable({
	providedIn: 'root',
})
export class DocumentFormMapper {
	private readonly fb = inject(NonNullableFormBuilder);

	private readonly annotationLayerFormMapper = inject(AnnotationLayerFormMapper);

	/**
	 * Map form values to a model.
	 * @param values Form values.
	 */
	public formToModel(values: RawFormValues<DocumentFormControls>): DocumentModel {
		return {
			name: values.name,
			pages: values.pages,
			annotationLayers: values.annotationLayers.map(layer => this.annotationLayerFormMapper.formToModel(layer)),
		};
	}

	/**
	 * Create form using a model.
	 * @param data Model.
	 */
	public modelToForm(data: DocumentModel | null): FormGroup<DocumentFormControls> {
		return this.fb.group<DocumentFormControls>({
			name: this.fb.control(data?.name ?? '', [Validators.required]),
			pages: this.fb.control(data?.pages ?? []),
			annotationLayers: this.fb.array(
				data?.annotationLayers.map(layer => this.annotationLayerFormMapper.modelToForm(layer)) ?? [],
			),
		});
	}

	/**
	 * Set value to document form.
	 * @param form Form.
	 * @param data Data.
	 */
	public setValue(form: FormGroup<DocumentFormControls>, data: DocumentModel | null): void {
		if (data) {
			form.patchValue(data);
			for (const layer of data.annotationLayers) {
				form.controls.annotationLayers.push(this.annotationLayerFormMapper.modelToForm(layer));
			}
		}
	}
}
