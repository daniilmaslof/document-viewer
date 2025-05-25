import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DocumentPage } from '@clrwdoc/common/core/models/document-page';
import { AnnotationLayerFormControls } from '@clrwdoc/common/core/models/form/annotation-layer-form';

/** Document form controls type. */
export type DocumentFormControls = {

	/** Document name. */
	readonly name: FormControl<string>;

	/** Document pages. */
	readonly pages: FormControl<DocumentPage[]>;

	/** Document annotation layers. */
	readonly annotationLayers: FormArray<FormGroup<AnnotationLayerFormControls>>;
};
