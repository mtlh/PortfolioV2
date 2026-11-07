/**
 * Raw SVG sources for every skill icon used on the site.
 *
 * A single <SvgSprite /> renders each of these once as a <symbol>, and
 * <InlineSvg /> emits a tiny <use> reference at each usage site. Keeping the
 * registry here means repeated icons (e.g. Tailwind across several projects)
 * are serialised into the page exactly once, so the inlined markup stays close
 * to the compressed weight of the SVG files it replaces.
 */
import androidstudio from '~/assets/skills/icons/androidstudio-original.svg?raw';
import astroDark from '~/assets/skills/icons/astro-dark.svg?raw';
import astroLight from '~/assets/skills/icons/astro-light.svg?raw';
import bootstrap from '~/assets/skills/icons/bootstrap-original.svg?raw';
import canva from '~/assets/skills/icons/canva-original.svg?raw';
import csharp from '~/assets/skills/icons/csharp-original.svg?raw';
import cockroachdb from '~/assets/skills/icons/cockroachdb-plain.svg?raw';
import convex from '~/assets/skills/icons/convex-colour.svg?raw';
import css3 from '~/assets/skills/icons/css3-original.svg?raw';
import django from '~/assets/skills/icons/django-plain.svg?raw';
import dotnet from '~/assets/skills/icons/dotnetcore-original.svg?raw';
import electron from '~/assets/skills/icons/electron-colour.svg?raw';
import filezilla from '~/assets/skills/icons/filezilla-plain.svg?raw';
import firebase from '~/assets/skills/icons/firebase-plain.svg?raw';
import git from '~/assets/skills/icons/git-original.svg?raw';
import go from '~/assets/skills/icons/go-plain.svg?raw';
import gradle from '~/assets/skills/icons/gradle-original.svg?raw';
import html5 from '~/assets/skills/icons/html5-original.svg?raw';
import java from '~/assets/skills/icons/java-original.svg?raw';
import javascript from '~/assets/skills/icons/javascript-plain.svg?raw';
import kotlin from '~/assets/skills/icons/kotlin-original.svg?raw';
import markdown from '~/assets/skills/icons/markdown-plain.svg?raw';
import materialui from '~/assets/skills/icons/materialui-original.svg?raw';
import mysql from '~/assets/skills/icons/mysql-original.svg?raw';
import nextjs from '~/assets/skills/icons/nextjs-original.svg?raw';
import nodejs from '~/assets/skills/icons/nodejs-original.svg?raw';
import npm from '~/assets/skills/icons/npm-original-wordmark.svg?raw';
import nuget from '~/assets/skills/icons/nuget-original.svg?raw';
import php from '~/assets/skills/icons/php-plain.svg?raw';
import phpstorm from '~/assets/skills/icons/phpstorm-plain.svg?raw';
import preact from '~/assets/skills/icons/preact-plain.svg?raw';
import prismaDark from '~/assets/skills/icons/prisma-dark.svg?raw';
import prismaLight from '~/assets/skills/icons/prisma-light.svg?raw';
import python from '~/assets/skills/icons/python-original.svg?raw';
import react from '~/assets/skills/icons/react-original.svg?raw';
import sass from '~/assets/skills/icons/sass-original.svg?raw';
import scala from '~/assets/skills/icons/scala-original.svg?raw';
import sqlite from '~/assets/skills/icons/sqlite-original.svg?raw';
import supabase from '~/assets/skills/icons/supabase-plain.svg?raw';
import tailwind from '~/assets/skills/icons/tailwindcss-original.svg?raw';
import typescript from '~/assets/skills/icons/typescript-original.svg?raw';
import vite from '~/assets/skills/icons/vite-plain.svg?raw';
import vscode from '~/assets/skills/icons/vscode-original.svg?raw';
import visualstudio from '~/assets/skills/icons/visualstudio-plain.svg?raw';
import webpack from '~/assets/skills/icons/webpack-original.svg?raw';

const parseIcon = (raw: string) => {
  const source = raw
    .replace(/<\?xml[\s\S]*?\?>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();
  const root = source.match(/<svg\b[^>]*>/i)?.[0] ?? '';
  const attribute = (name: string) => root.match(new RegExp(`\\s${name}="([^"]*)"`, 'i'))?.[1];

  let viewBox = attribute('viewBox');
  const width = attribute('width');
  const height = attribute('height');
  if (!viewBox && width && height && /^\d+(\.\d+)?$/.test(width) && /^\d+(\.\d+)?$/.test(height)) {
    viewBox = `0 0 ${width} ${height}`;
  }

  return {
    body: source.slice(root.length),
    // Only root-level presentation attributes matter inside a <symbol>;
    // sizing, ids and namespace declarations are handled by the sprite.
    rootAttributes: ['class', 'style', 'fill', 'fill-rule', 'clip-rule', 'opacity', 'preserveAspectRatio']
      .map((name) => {
        const value = attribute(name);
        return value === undefined ? '' : ` ${name}="${value}"`;
      })
      .join(''),
    viewBox: viewBox ?? '0 0 128 128',
  };
};

export const svgIcons = {
  androidstudio: parseIcon(androidstudio),
  'astro-dark': parseIcon(astroDark),
  'astro-light': parseIcon(astroLight),
  bootstrap: parseIcon(bootstrap),
  canva: parseIcon(canva),
  csharp: parseIcon(csharp),
  cockroachdb: parseIcon(cockroachdb),
  convex: parseIcon(convex),
  css3: parseIcon(css3),
  django: parseIcon(django),
  dotnet: parseIcon(dotnet),
  electron: parseIcon(electron),
  filezilla: parseIcon(filezilla),
  firebase: parseIcon(firebase),
  git: parseIcon(git),
  go: parseIcon(go),
  gradle: parseIcon(gradle),
  html5: parseIcon(html5),
  java: parseIcon(java),
  javascript: parseIcon(javascript),
  kotlin: parseIcon(kotlin),
  markdown: parseIcon(markdown),
  materialui: parseIcon(materialui),
  mysql: parseIcon(mysql),
  nextjs: parseIcon(nextjs),
  nodejs: parseIcon(nodejs),
  npm: parseIcon(npm),
  nuget: parseIcon(nuget),
  php: parseIcon(php),
  phpstorm: parseIcon(phpstorm),
  preact: parseIcon(preact),
  'prisma-dark': parseIcon(prismaDark),
  'prisma-light': parseIcon(prismaLight),
  python: parseIcon(python),
  react: parseIcon(react),
  sass: parseIcon(sass),
  scala: parseIcon(scala),
  sqlite: parseIcon(sqlite),
  supabase: parseIcon(supabase),
  tailwind: parseIcon(tailwind),
  typescript: parseIcon(typescript),
  vite: parseIcon(vite),
  visualstudio: parseIcon(visualstudio),
  vscode: parseIcon(vscode),
  webpack: parseIcon(webpack),
};

export type IconName = keyof typeof svgIcons;
