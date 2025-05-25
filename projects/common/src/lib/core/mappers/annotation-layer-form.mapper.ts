import { inject, Injectable } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';

import { RawFormValues } from '@clrwdoc/common/core/utils/types/form';
import { AnnotationLayer } from '@clrwdoc/common/core/models/annotation-layer';
import { AnnotationLayerFormControls } from '@clrwdoc/common/core/models/form/annotation-layer-form';

import { AnnotationsFormMapper } from './annotations-form.mapper';

/** Annotation layer form mapper. */
@Injectable({
	providedIn: 'root',
})
export class AnnotationLayerFormMapper {
	private readonly fb = inject(NonNullableFormBuilder);

	private readonly annotationsFormMapper = inject(AnnotationsFormMapper);

	/**
	 * Map form values to a model.
	 * @param values Form values.
	 */
	public formToModel(values: RawFormValues<AnnotationLayerFormControls>): AnnotationLayer {
		return {
			pageNumber: values.pageNumber,
			annotations: this.annotationsFormMapper.formToModel(values.annotations),
		};
	}

	/**
	 * Create form using a model.
	 * @param data Model.
	 */
	public modelToForm(data?: AnnotationLayer | null): FormGroup<AnnotationLayerFormControls> {
		return this.fb.group<AnnotationLayerFormControls>({
			pageNumber: this.fb.control(data?.pageNumber ?? 1, [Validators.required]),
			annotations: this.annotationsFormMapper.modelToForm(data?.annotations),
		});
	}
}
