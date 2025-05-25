import { z } from 'zod';

/** Page dto. */
export const pageSchemaDto = z.object({

	/** Number. */
	number: z.number(),

	/** Image url. */
	imageUrl: z.string(),
}).readonly();

/** Page DTO. */
export type PageDto = z.infer<typeof pageSchemaDto>;
