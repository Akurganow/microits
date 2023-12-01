/* eslint-disable unicorn/prefer-module */
module.exports = {
	parser: '@typescript-eslint/parser',
	plugins: [
		'@typescript-eslint',
		'react',
		'react-hooks',
		'formatjs',
	],
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react-hooks/recommended',
		'plugin:unicorn/recommended',
	],
	root: true,
	env: {
		node: true,
		es6: true,
		browser: true,
		jest: true,
	},
	rules: {
		'no-tabs': [0],
		'block-spacing': [2, 'always'],
		'object-curly-spacing': [2, 'always'],
		'semi': [2, 'never'],
		'quotes': ['error', 'single'],
		'indent': [2, 'tab'],
		'react/jsx-indent': [2, 'tab', { indentLogicalExpressions: true }],
		'react/jsx-indent-props': [0],
		'react/display-name': [0, 0],
		'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],
		'react/react-in-jsx-scope': [0],
		'unicorn/no-keyword-prefix': [0],
		'unicorn/no-null': [0],
		'unicorn/filename-case': [0],
		'unicorn/prevent-abbreviations': [0],
		'unicorn/consistent-function-scoping': [0],
		'unicorn/no-array-reduce': [0],
		'unicorn/prefer-export-from': [0],
		'unicorn/prefer-dom-node-append': [0],
		'unicorn/prefer-dom-node-remove': [0],
	},
	'settings': {
		'react': {
			'createClass': 'createReactClass',
			'pragma': 'React',
			'fragment': 'Fragment',
			'version': 'detect',
		},
	}
}