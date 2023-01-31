import { defineConfig } from 'vite'
import postcss from './postcss.config.cjs';
import { svelte } from '@sveltejs/vite-plugin-svelte'
import * as path from 'path'

// const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  css:{
    postcss
  },
  resolve:{
    alias:{

      // find: '@', replacement: path.resolve(__dirname,'src')
      
      // find: '/@', replacement: pathLib.resolve(__dirname,'src')
      $lib: path.resolve('./src/lib'),
      $utils: path.resolve('./src/utils'),
      $svgComponents: path.resolve('./src/svg-components'),
      $static: path.resolve('./src/static'),
      $assets: path.resolve('./src/assets'),
      $translations: path.resolve('./src/translations'),
      $components: path.resolve('./src/components'),
      $stores: path.resolve('./src/stores'),
      $routes: path.resolve('./src/routes'),


    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
})

// '@/' : path.resolve(__dirname, './src')