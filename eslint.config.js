/* eslint-disable @typescript-eslint/naming-convention */
import { resolve } from 'node:path';

import { fixupPluginRules, includeIgnoreFile } from '@eslint/compat';
import { default as saritasaEslintConfig } from '@saritasa/eslint-config-saritasa';
import { config as tsEslintConfig } from 'typescript-eslint';
import { configs as angularEslintConfigs, processInlineTemplates } from 'angular-eslint';
import rxjs from 'eslint-plugin-rxjs';

export default tsEslintConfig(

	// We have to use explicit global ignore. Otherwise, ESLint will check all *.js files.
	// Those files are always matched unless you explicitly exclude them using global ignores.
	// https://eslint.org/docs/latest/use/configure/configuration-files#specifying-files-and-ignores
	includeIgnoreFile(resolve(import.meta.dirname, '.gitignore')),
	{
		files: ['**/*.ts', 'eslint.config.js'],
		languageOptions: {
			parserOptions: {
				projectService: {
					allowDefaultProject: ['eslint.config.js'],
				},
				tsconfigRootDir: import.meta.dirname,
			},
		},
		plugins: {
			rxjs: fixupPluginRules(rxjs),
		},
		extends: [
			...saritasaEslintConfig,
			...angularEslintConfigs.tsRecommended,
		],
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					vars: 'all',
					args: 'after-used',
					ignoreRestSiblings: false,
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
			'no-tabs': 'off',
			'no-void': 'error',
			'no-restricted-imports': [
				'error',
				{
					patterns: [
						{
							group: ['@clrwdoc/*', '!@clrwdoc/common'],
							// eslint-disable-next-line max-len
							message: 'You can not import from one application to another directly, please move the reusable/shared entities into common library. https://wiki.saritasa.rocks/frontend/frameworks/angular/project-structure#relationships-between-applications',
						},
					],
				},
			],
			'@typescript-eslint/prefer-nullish-coalescing': [
				'error',
				{
					allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: true,
				},
			],
			'rxjs/finnish': [
				'error',
				{
					functions: false,
					methods: false,
					names: {
						'^(canActivate|canActivateChild|canDeactivate|canMatch|intercept|resolve|validate|.*Subject)$': false,
					},
					parameters: true,
					properties: true,
					strict: true,
					types: {
						'^EventEmitter$': false,
					},
					variables: true,
				},
			],
			'rxjs/no-ignored-replay-buffer': 'error',
			'rxjs/no-internal': 'error',
			'rxjs/no-nested-subscribe': 'error',
			'rxjs/no-unbound-methods': 'error',
			'rxjs/throw-error': 'error',
			'rxjs/no-async-subscribe': 'error',
			'rxjs/no-create': 'error',
			'rxjs/no-ignored-observable': 'error',
			'rxjs/no-implicit-any-catch': 'error',
			'rxjs/no-index': 'error',
			'rxjs/no-sharereplay': [
				'error',
				{
					allowConfig: true,
				},
			],
			'rxjs/no-subclass': 'error',
			'rxjs/no-unsafe-takeuntil': [
				'error',
				{
					alias: ['takeUntilDestroyed'],
				},
			],
			'jsdoc/tag-lines': 'off',
			'@stylistic/indent': ['error', 'tab'],
		},
	},
	{
		files: ['projects/**/*.html'],
		ignores: ['projects/*/src/index.html'],
		extends: [...angularEslintConfigs.templateRecommended],
		rules: {
			'@angular-eslint/template/alt-text': 'error',
			'@angular-eslint/template/conditional-complexity': [
				'error',
				{
					maxComplexity: 1,
				},
			],
			'@angular-eslint/template/no-duplicate-attributes': 'error',
			'@angular-eslint/template/no-inline-styles': [
				'error',
				{
					allowNgStyle: true,
					allowBindToStyle: true,
				},
			],
			'@angular-eslint/template/no-interpolation-in-attributes': 'error',
			'@angular-eslint/template/no-positive-tabindex': 'error',
			'@angular-eslint/template/use-track-by-function': 'error',
		},
	},
	{
		files: ['**/*.component.ts', '**/*.directive.ts'],
		processor: processInlineTemplates,
		rules: {
			'@angular-eslint/no-host-metadata-property': [
				'error',
				{
					allowStatic: true,
				},
			],
		},
	},
	{
		files: ['**/*.dto.ts', '**/*.mapper.ts', '**/*-api.service.ts'],
		rules: {
			'no-restricted-syntax': [
				'error',
				{
					selector: 'TSPropertySignature[readonly=undefined]',
					message: 'Missing \'readonly\' modifier for the DTO property.',
				},
				{
					selector: 'TSPropertySignature TSTypeAnnotation[typeAnnotation.type=\'TSArrayType\']',
					message: 'Missing \'readonly\' type modifier for array.',
				},
			],
			'@typescript-eslint/naming-convention': 'off',
		},
	},
	{
		files: ['**/*.spec.ts'],
		rules: {
			'max-lines-per-function': 'off',
			'@typescript-eslint/naming-convention': 'off',
			'@angular-eslint/use-component-selector': 'off',
			'jsdoc/require-jsdoc': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
		},
	},
	{
		files: ['projects/common/**/*.ts'],
		rules: {
			'@angular-eslint/directive-selector': [
				'error',
				{
					type: 'attribute',
					prefix: 'clrwdocc',
					style: 'camelCase',
				},
			],
			'@angular-eslint/component-selector': [
				'error',
				{
					type: 'element',
					prefix: 'clrwdocc',
					style: 'kebab-case',
				},
			],
		},
	},
	{
		files: ['projects/web/**/*.ts'],
		rules: {
			'@angular-eslint/directive-selector': [
				'error',
				{
					type: 'attribute',
					prefix: 'clrwdocw',
					style: 'camelCase',
				},
			],
			'@angular-eslint/component-selector': [
				'error',
				{
					type: 'element',
					prefix: 'clrwdocw',
					style: 'kebab-case',
				},
			],
			'@angular-eslint/no-lifecycle-call': ['error'],
			'@angular-eslint/prefer-on-push-component-change-detection': ['error'],
			'@angular-eslint/prefer-output-readonly': ['error'],
		},
	},
);
