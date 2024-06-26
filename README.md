<!-- <h1 align="center"> -->
<!--     <div align="center"> -->
<!--         <a href="https://fish-lsp.dev"> -->
<!--             <image src="/public/favicon-centered-bluee.svg" alt="fish-lsp" style="position: flex; text-align: center;" height="23rem"> fish-lsp -->
<!--         </a> -->
<!--         <div align="center"> -->
<!--             <img src="https://img.shields.io/github/actions/workflow/status/ndonfris/fish-lsp/eslint.yml?branch=master&labelColor=%23181939" alt="GitHub Actions Workflow Status"> -->
<!--             <img src="https://img.shields.io/github/license/ndonfris/fish-lsp?&labelColor=%23181939&color=b88af3" alt="License"> -->
<!--             <img src="https://img.shields.io/github/created-at/ndonfris/fish-lsp?logo=%234e6cfa&label=created&labelColor=%23181939&color=%236198f5" alt="Github Created At"> -->
<!--         </div> -->
<!--     </div> -->
<!-- </h1> -->
<!---->
<!-- ![demo.gif](https://github.com/ndonfris/fish-lsp.dev/blob/ndonfris-patch-1/new_output.gif?raw=true) -->
<!---->
<!---->
# fish-lsp.dev

- Website source code for [fish-lsp](https://github.com/ndonfris/fish-lsp) repo.
- Built using _astro_, _tailwind_, and _pnpm_.
- Used __astro basic template__ for initial build

___

Here is some other local dependencies:

- `./build-output-screenshot.fish` -- requires freeze as dependency
  - can accept any of the three arguments: `'svg' 'png' 'jpeg'`
  - default will build a __png__ file.
- consider placing large files here _(probably already stored)_:
  - `help_output.{svg,png,jpeg}`
  - `man fish-lsp` - __fish-lsp.1__
  - `demo.gif`
  - `project_banner.png`
  - `favicon.svg`
- __future plans:__
  - include browser demo derision for testing the lsp using [monaco](https://www.npmjs.com/package/monaco-languageclient)
  - add _gif_ to the website
  - create github _actions_ for main repo
  - include more info & configuration's here
- Contributions here will be included in the main repo's list.

## Astro Starter Kit Basics

```sh
npm create astro@latest -- --template basics
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Card.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
