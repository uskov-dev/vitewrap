import path from 'node:path';
import { defineConfig } from 'vite';
import vituum from 'vituum';
import pug from '@vituum/vite-plugin-pug';
import autoprefixer from 'autoprefixer';
import svgSpriteWrapper from 'vite-svg-sprite-wrapper';

export default defineConfig({
  css: {
    devSourcemap: true,
    postcss: {
      plugins: [
        autoprefixer,
      ],
    },
  },
  plugins: [
    vituum({
      pages: {
        dir: './src/pug',
      },
    }),
    pug({
      root: './src',
    }),
    svgSpriteWrapper({
      icons: './src/svgsprite/*.svg',
      outputDir: './public',
      sprite: {
        mode: {
          symbol: {
            dest: '.',
            sprite: 'svgsprite.svg',
          },
        },
        shape: {
          transform: [
            {
              svgo: {
                plugins: [
                  {
                    name: 'preset-default',
                    params: {
                      removeUselessStrokeAndFill: false,
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
    },
  },
  build: {
    assetsInlineLimit: 0,
    modulePreload: false,
    rollupOptions: {
      input: [
        './src/pug/*.pug',
        './src/js/*.js',
      ],
      output: {
        entryFileNames: 'js/[name].js',
        assetFileNames: (assets) => {
          let ext = assets.name.split('.').pop();

          if (/png|jpe?g|svg|ico/i.test(ext)) {
            ext = 'images';
          }

          if (/ttf|woff2|woff?/i.test(ext)) {
            ext = 'fonts';
          }

          return `${ext}/[name][extname]`;
        }
      },
    },
  },
});
