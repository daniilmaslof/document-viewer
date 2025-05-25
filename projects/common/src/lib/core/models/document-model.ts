import { DocumentPage } from '@clrwdoc/common/core/models/document-page';
import { AnnotationLayer } from '@clrwdoc/common/core/models/annotation-layer';

/** Document. */
export type DocumentModel = {

	/** Name. */
	readonly name: string;

	/** Pages. */
	readonly pages: DocumentPage[];

	/** Annotations layers. */
	readonly annotationLayers: AnnotationLayer[];
};
