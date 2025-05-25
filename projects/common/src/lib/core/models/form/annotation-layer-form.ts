import { ControlsOf } from '@clrwdoc/common/core/utils/types/form';
import { FormArray, FormControl } from '@angular/forms';
import { Annotation } from '@clrwdoc/common/core/models/annotation';

/** Annotation layer form controls. */
export type AnnotationLayerFormControls = ControlsOf<{

	/** Page number. */
	readonly pageNumber: number;

	/** Annotations. */
	readonly annotations: FormArray<FormControl<Annotation>>;
}>;
