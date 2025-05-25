import { inject, Injectable } from '@angular/core';
import { FormArray, FormControl, NonNullableFormBuilder } from '@angular/forms';
import { Annotation } from '@clrwdoc/common/core/models/annotation';

/** Annotation form mapper. */
@Injectable({
	providedIn: 'root',
})
export class AnnotationsFormMapper {
	private readonly fb = inject(NonNullableFormBuilder);

	/**
	 * Map form values to a model.
	 * @param values Form.
	 */
	public formToModel(values: Annotation[]): Annotation[] {
		return values.map(value => ({
			width: value.width,
			height: value.height,
			content: value.content,
			top: value.top,
			left: value.left,
			type: value.type,
		}));
	}

	/**
	 * Create form using a model.
	 * @param data Model.
	 */
	public modelToForm(data?: Annotation[] | null): FormArray<FormControl<Annotation>> {
		return this.fb.array(data?.map(field => this.createAnnotationForm(field)) ?? []);
	}

	/**
	 * Create annotation form.
	 * @param field Annotation.
	 */
	public createAnnotationForm(field: Annotation | null): FormControl<Annotation> {
		return this.fb.control<Annotation>({
			width: field?.width ?? 0,
			height: field?.height ?? 0,
			content: field?.content ?? '',
			top: field?.top ?? 0,
			type: field?.type ?? 'text',
			left: field?.left ?? 0,
		});
	}
}
