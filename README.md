# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## 踩坑记录

### SMUI

根据<https://sveltematerialui.com/SVELTEKIT.md>, 执行`npx smui-theme template src/theme`报网络错误

这里是要下载github上的一个sass模板文件

话说模板不应该内置在npm包里么

解决方法: 修改hosts指定IP

```bash

FetchError: request to https://raw.githubusercontent.com/hperrin/svelte-material-ui/master/packages/site/src/theme/_smui-theme.scss failed, reason: getaddrinfo ENOENT raw.githubusercontent.com

```
