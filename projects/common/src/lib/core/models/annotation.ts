/** Annotation. */
export type Annotation = {

	/** Top position of the annotation in percent. */
	readonly top: number;

	/** Left position of the annotation in percent. */
	readonly left: number;

	/** Width of the annotation in percent. */
	readonly width: number;

	/** Height of the annotation in percent. */
	readonly height: number;

	/** Text or url content of the annotation. */
	readonly content: string;

	/** Annotation type. */
	readonly type: 'image' | 'text';
};
