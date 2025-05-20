/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface ImportMeta {

	/** Env. */
	readonly env: ImportMetaEnv;
}

type ImportMetaEnv = {

	/**
	 * Built-in environment variable.
	 * @see Docs https://github.com/chihab/ngx-env#ng_app_env.
	 */
	readonly NG_APP_ENV: string;

	/** App version. */
	readonly NG_APP_VERSION: string;

	/** App commit. */
	readonly NG_APP_COMMIT: string;

	/** API url. */
	readonly NG_APP_API_URL: string;
};
