import adapter from '@sveltejs/adapter-node'
import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),

    // Override http methods in the Todo forms
    methodOverride: {
      allowed: ['PATCH', 'DELETE']
    }
  },
  preprocess: preprocess(),
  onwarn: (warning, defaultHandler) => {
    // 暂时想不到什么办法只combine sass中的一个selector
    // see https://github.com/sveltejs/language-tools/issues/650
    if (warning.code === 'css-unused-selector') return

    defaultHandler(warning)
  }
}

export default config
