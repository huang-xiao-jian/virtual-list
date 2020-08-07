# vanillajs

![Build Status](https://img.shields.io/travis/coco-template/vanillajs/master.svg?style=flat)
[![Coverage Status](https://coveralls.io/repos/github/coco-template/vanillajs/badge.svg?branch=master)](https://coveralls.io/github/coco-template/vanillajs?branch=master)
![David](https://img.shields.io/david/coco-template/vanillajs.svg)
![David](https://img.shields.io/david/dev/coco-template/vanillajs.svg)
[![Greenkeeper badge](https://badges.greenkeeper.io/coco-template/vanillajs.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io//test/github/coco-template/vanillajs/badge.svg?targetFile=package.json)](https://snyk.io//test/github/coco-template/vanillajs?targetFile=package.json)

create NPM, browser compatible package with typescript.

## Usage

```shell
# browser development server
npm run dev;

# unit test with coverage
npm run test;

# production compile
npm run compile;
```

## Compile

+ tsc compiler compile without `polyfill`, which means `esnext` native, whose main purpose is type declaration
+ babel compiler output both `commonjs` and `esm` style
+ compile script automatically run before publish

## Rollup Bundler

In specific situation, it's inevitable to bundle code together into `IIFE` file, which can be included by `<script>` tag, polyfill become tricky.

you can choose transfer polyfill duty to end user, just ignore polyfill plugin, config like below:

```javascript
// packages
const resolve = require('@rollup/plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const { terser } = require('rollup-plugin-terser');

// scope
module.exports = {
  input: 'src/index.ts',
  output: {
    plugins: [
      terser({
        output: {
          comments: false,
        },
      }),
    ],
    format: 'iife',
    name: 'os',
  },
  plugins: [
    resolve({
      extensions: ['.ts', '.js'],
    }),
    babel({
      exclude: ['node_modules/**'],
      extensions: ['.ts', '.js'],
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            helpers: false,
            corejs: false,
          },
        ],
      ],
    }),
  ],
};
```

alternatively, enable `corejs` option and bundle `polyfill` code:

```javascript
babel({
  exclude: ['node_modules/**'],
  extensions: ['.ts', '.js'],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        helpers: false,
        corejs: 3,
      },
    ],
  ],
}),
/* bundle helper and polyfill code */
commonjs({
  include: [
    'node_modules/@babel/runtime-corejs3/**/*.js',
    'node_modules/core-js-pure/**/*.js',
  ],
})
```

## Contact

Email: hjj491229492@hotmail.com

## License

MIT
