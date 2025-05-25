import { Injectable, inject } from '@angular/core';

import { AppConfig } from './app.config';

/**
 * Urls used within the application.
 * Stringified for convenience, since most of the Angular's HTTP tools work with strings.
 */
@Injectable({ providedIn: 'root' })
export class AppUrlsConfig {

	private readonly appConfigService = inject(AppConfig);

	/** Document-related routes. */
	public readonly document = {
		getDocuments: this.toApi('documents'),
		getDocument: this.toApi('documents/getDocument'),
	} as const;

	private toApi(...args: readonly string[]): string {
		const path = args.join('/');
		return new URL(path, this.appConfigService.apiUrl).toString();
	}
}
