const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const { createConfig } = require('@openedx/frontend-build');

module.exports = createConfig('eslint', {
  rules: {
    'jsx-a11y/label-has-associated-control': [
      2,
      {
        controlComponents: ['Input'],
      },
    ],
    'template-curly-spacing': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'no-restricted-exports': 'off',
    'no-spaced-func': 'off',
    // There is no reason to disallow this syntax anymore; we don't use regenerator-runtime in new browsers
    'no-restricted-syntax': 'off',
    'no-use-before-define': 'off',
    'implicit-arrow-linebreak': 'off',
    'arrow-body-style': 'off',
    'object-curly-newline': 'off',
    'react/jsx-wrap-multilines': 'off',
    'react/prop-types': 'off',
    'react/jsx-fragments': 'off',
    'react/function-component-definition': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/indent': 'off',
  },
  settings: {
    // Import URLs should be resolved using aliases
    'import/resolver': {
      webpack: {
        config: path.resolve(__dirname, 'webpack.dev.config.js'),
      },
    },
  },
  overrides: [
    {
      files: ['plugins/**/*.test.jsx'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
});
