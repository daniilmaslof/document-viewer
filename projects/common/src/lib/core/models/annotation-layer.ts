import { Annotation } from '@clrwdoc/common/core/models/annotation';

/** Annotation layer. */
export type AnnotationLayer = {

	/** Page number. */
	pageNumber: number;

	/** Collection of annotations in the layer. */
	annotations: Annotation[];
};
