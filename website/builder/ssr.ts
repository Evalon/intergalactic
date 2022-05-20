/* eslint-disable no-console */
import esbuild from 'esbuild';
import fs from 'fs/promises';
import { websiteEsbuildConfig } from './esbuild.config';
import { buildNavigation } from './navigation';
import {
  resolve as resolvePath,
  relative as resolveRelativePath,
  dirname as resolveDirname,
} from 'path';
import { buildArticle, serializeArticle } from './build-article/build-article';

const fsExists = async (path: string) => {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
};

const ensureDir = async (path: string) => {
  const parts = path.split('/');
  for (let i = 1; i <= parts.length; i++) {
    const subPath = resolvePath(parts.slice(0, i).join('/'));
    if (!(await fsExists(subPath))) {
      await fs.mkdir(subPath);
    }
  }
};

const newEntryPoints = ['./src/app-ssr.jsx', './src/main-hydrate.jsx'];
const entryPoints = Array.isArray(websiteEsbuildConfig.entryPoints)
  ? [...websiteEsbuildConfig.entryPoints, ...newEntryPoints]
  : newEntryPoints;
const outputDir = resolvePath('dist');
const publicDir = resolvePath('src/public');
const specialRoutes = ['', 'contacts/contact-info'];

await fs.rm(outputDir, { force: true, recursive: true });
await ensureDir(outputDir);
for (const file of await fs.readdir(publicDir)) {
  await fs.copyFile(resolvePath(publicDir, file), resolvePath(outputDir, file));
}
const buildResults = await esbuild.build({
  ...websiteEsbuildConfig,
  entryPoints,
  outdir: outputDir,
  metafile: true,
});

const outputAssetsBySrcPath = {};
const outputs = buildResults.metafile.outputs;
for (const outputPath in outputs) {
  for (const inputPath in outputs[outputPath].inputs) {
    const sameExtension = inputPath.split('.').pop() === outputPath.split('.').pop();
    if (sameExtension) {
      outputAssetsBySrcPath[resolvePath(inputPath)] = resolvePath(outputPath);
    }
  }
}

const docsDir = resolvePath('docs');
const distDir = resolvePath('dist');

const { navigationTree } = await buildNavigation(docsDir);
globalThis.__ssr = true;

// eslint-disable-next-line import/extensions
await import('../dist/app-ssr.js');

const nodesList = [];
const traverse = (navigationNode) => {
  nodesList.push(navigationNode);
  const children = navigationNode.children ?? [];
  children.forEach(traverse);
};
navigationTree.forEach(traverse);

const allRoutes = [...nodesList.map(({ route }) => route), ...specialRoutes];
for (const route of allRoutes) {
  const directoryPath = resolvePath(distDir, route);
  await ensureDir(directoryPath);
}

const htmlBase = await fs.readFile('src/public/index.html', 'utf-8');
const generateCodeEntry = (navigationNode, pageData) => {
  if (!pageData) return '';

  const serializedArticle = serializeArticle(pageData);
  const articleImagesPaths: string[] = [];
  const { route } = navigationNode;

  if (Object.keys(pageData.imagesUrls).length > 0) {
    const dirname = resolvePath('docs', resolveDirname(navigationNode.filePath));
    for (const variableName in pageData.imagesUrls) {
      const importPath = pageData.imagesUrls[variableName];
      const inputFilePath = resolvePath(dirname, importPath);
      const outputFilePath = outputAssetsBySrcPath[inputFilePath];

      if (!outputFilePath) {
        throw new Error(
          `Unable to find corresponding output chunk for ${importPath} from ${navigationNode.filePath}`,
        );
      }

      const outputRelativePath = '/' + resolveRelativePath(outputDir, outputFilePath);
      articleImagesPaths.push(`${variableName}="${outputRelativePath}";`);
    }
  }
  const articleImagesPathsSerialized = articleImagesPaths.join('\n');
  const preloadedPageData = `(function (){ ${articleImagesPathsSerialized}; return ${serializedArticle} })()`;

  return `
    __ssr_preloaded_page_route="${route}";
    __ssr_preloaded_page_data=${preloadedPageData};
  `;
};
const renderPage = async (route, navigationNode?) => {
  let codeEntry = '';

  globalThis.__ssr_route = route;

  if (navigationNode) {
    const articlePath = resolvePath(docsDir, navigationNode.filePath);
    const articleData = await buildArticle(docsDir, articlePath, navigationNode.filePath);
    globalThis.__ssr_page_data = articleData;

    codeEntry = generateCodeEntry(navigationNode, articleData);
  }

  const contents = globalThis.renderApp();

  const html = htmlBase
    .replace('<!--%ssr-entry%-->', contents)
    .replace('/*--%ssr-js-entry%--*/', codeEntry)
    .replace('/main-render.js', process.env.PUBLIC_PATH + 'main-hydrate.js')
    .replace('/main.css', process.env.PUBLIC_PATH + 'main.css')
    .replace('/main-render.css', process.env.PUBLIC_PATH + 'main-render.css')
    .replace('/social.png', process.env.PUBLIC_PATH + 'social.png');

  return html;
};

let nodesProgress = 1;
await Promise.all(
  nodesList.map(async (navigationNode) => {
    const filePath = resolvePath(distDir, navigationNode.route, 'index.html');
    const html = await renderPage(navigationNode.route, navigationNode);
    await fs.writeFile(filePath, html);

    console.info(`SSR common routes: ${nodesProgress++}/${nodesList.length}`);
  }),
);
let specialRoutesProgress = 1;
await Promise.all(
  specialRoutes.map(async (route) => {
    const filePath = resolvePath(distDir, route, 'index.html');
    const html = await renderPage(route);
    await fs.writeFile(filePath, html);

    console.info(`SSR special routes: ${specialRoutesProgress++}/${specialRoutes.length}`);
  }),
);
console.info(`SSR: Done`);