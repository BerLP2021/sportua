import { defineConfig } from 'vite'
import { ViteMinifyPlugin } from 'vite-plugin-minify'
import autoprefixer from 'autoprefixer'
import postcssPresetEnv from 'postcss-preset-env'
import legacy from '@vitejs/plugin-legacy'
import checker from 'vite-plugin-checker'

export default defineConfig({
  plugins: [
    legacy(),
    ViteMinifyPlugin({
      removeComments: true,
      collapseWhitespace: true,
      minifyJS: true,
      minifyCSS: true,
    }),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/ts/**/*.ts"',
        useFlatConfig: true,
      },
    }),
  ],
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
        postcssPresetEnv({
          stage: 1,
        }),
      ],
    },
  },
  server: {
    open: true,
    port: 5173,
    hmr: true,
  },
})
