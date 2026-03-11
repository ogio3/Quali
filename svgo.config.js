/** @type {import('svgo').Config} */
export default {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
        },
      },
    },
    'removeDimensions',
    {
      name: 'removeAttrs',
      params: { attrs: ['xmlns'] },
    },
    {
      name: 'sortAttrs',
    },
  ],
};
