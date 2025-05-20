import { Injectable } from '@angular/core';
import { AppConfig } from '@clrwdoc/common/core/services/app.config';

/** Implementation of app config. */
@Injectable()
export class WebAppConfig extends AppConfig {

	/** @inheritdoc */
	public readonly apiUrl: string = import.meta.env.NG_APP_API_URL;
}
