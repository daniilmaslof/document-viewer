import { Injectable, inject } from '@angular/core';

import { AppConfig } from './app.config';

/**
 * Urls used within the application.
 * Stringified for convenience, since most of the Angular's HTTP tools work with strings.
 */
@Injectable({ providedIn: 'root' })
export class AppUrlsConfig {

	private readonly appConfigService = inject(AppConfig);

	/**
	 * Checks whether the url is application-scoped.
	 * @param url Url to check.
	 */
	public isApplicationUrl(url: string): boolean {
		return url.startsWith(this.appConfigService.apiUrl);
	}

	private toApi(...args: readonly string[]): string {
		const path = args.join('/');
		return new URL(path, this.appConfigService.apiUrl).toString();
	}
}
