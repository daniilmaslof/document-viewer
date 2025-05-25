import { z } from 'zod';

import { pageSchemaDto } from '@clrwdoc/common/core/dtos/page.dto';

/** Document schema DTO. */
export const documentSchemaDto = z.object({
	/** Name. */
	name: z.string(),

	/** Pages. */
	pages: z.array(pageSchemaDto),

	/** Annotation layers. */
	annotationLayers: z.array(z.unknown()).nullish(),
}).readonly();

/** Document DTO. */
export type DocumentDto = z.infer<typeof documentSchemaDto>;
