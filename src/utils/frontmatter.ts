import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';
import type { RehypePlugin, RemarkPlugin } from '@astrojs/markdown-remark';

export const readingTimeRemarkPlugin: RemarkPlugin = () => {
  return function (tree, file) {
    const textOnPage = toString(tree);
    const readingTime = Math.ceil(getReadingTime(textOnPage).minutes);

    if (typeof file?.data?.astro?.frontmatter !== 'undefined') {
      file.data.astro.frontmatter.readingTime = readingTime;
    }
  };
};

export const responsiveTablesRehypePlugin: RehypePlugin = () => {
  return function (tree) {
    if (!tree.children) return;

    for (let i = 0; i < tree.children.length; i++) {
      const child = tree.children[i];

      if (child.type === 'element' && child.tagName === 'table') {
        // A scroll container must be reachable and named so keyboard-only
        // users can scroll a wide table (WCAG 2.1.1 / 4.1.2).
        tree.children[i] = {
          type: 'element',
          tagName: 'div',
          properties: {
            style: 'overflow:auto',
            tabindex: '0',
            role: 'region',
            'aria-label': 'Table, scroll horizontally to see more',
          },
          children: [child],
        };

        i++;
      }
    }
  };
};
