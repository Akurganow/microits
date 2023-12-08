module.exports = {
	parser: '@typescript-eslint/parser',
	plugins: [
		'@typescript-eslint',
		'react',
		'react-hooks',
		'formatjs',
	],
	extends: [
		'next/core-web-vitals',
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react-hooks/recommended',
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
		'react/prop-types': [0],
		'react/jsx-indent': [2, 'tab', { indentLogicalExpressions: true }],
		'react/jsx-indent-props': [0],
		'react/display-name': [0, 0],
		'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],
		'react/react-in-jsx-scope': [0],
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