const path = require('path')

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-storysource',
    '@storybook/preset-scss'
  ],
  framework: '@storybook/react',
  core: { builder: 'webpack5' },
  typescript: {
    reactDocgen: false
  },
  features: {
    postcss: false
  },
  webpackFinal: async config => {
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve(__dirname, '../src')
    ]
    return config
  }
}
