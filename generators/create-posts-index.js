const { URL } = require('url');
const path = require('path');
const MarkdownProcessor = require('./markdown-processor');

const getPaginationUrl = ({ pageNumber, paginationPath, baseUrl }) => {
  const path = pageNumber === 1 ? '' : paginationPath.replace(':num', pageNumber);

  return (new URL(`${baseUrl.pathname}/${path}`, baseUrl.origin)).toString();
}

const getPaginationFilename = (pageNumber, paginationPath) => {
  if (pageNumber === 1) {
    return 'index.html';
  }

  const filename = paginationPath.replace(':num', pageNumber);

  return path.extname(filename) ? filename : path.join(filename, 'index.html');
};

const nextPageUrl = ({ pageNumber, totalPages, paginationPath, baseUrl }) => {
  return pageNumber === totalPages ? null :
    getPaginationUrl({ pageNumber: pageNumber + 1, paginationPath, baseUrl });
};

const previousPageUrl = ({ pageNumber, paginationPath, baseUrl }) => {
  return pageNumber === 1 ? null :
    getPaginationUrl({ pageNumber: pageNumber - 1, paginationPath, baseUrl });
};

const sortPostsByDateDesc = posts => posts.sort((a, b) => b.date - a.date);

const groupPostsByPage = ({ posts, perPage, paginationPath, baseUrl }) => {
  const sortedPosts = sortPostsByDateDesc(posts);

  const totalPages = Math.ceil(sortedPosts.length / perPage);
  const pages = [];

  for (let i = 0; i < totalPages; i++) {
    const startIdx = i * perPage;
    const pageNumber = i + 1;

    pages[i] = {
      posts: sortedPosts.slice(startIdx, startIdx + perPage),
      pagination: {
        number: pageNumber,
        totalPages,
        currentUrl: getPaginationUrl({ pageNumber, paginationPath, baseUrl }),
        nextUrl: nextPageUrl({ pageNumber, totalPages, paginationPath, baseUrl }),
        previousUrl: previousPageUrl({ pageNumber, paginationPath, baseUrl })
      }
    };
  }

  return pages;
}

const createPostsIndex = (posts, config) => new Promise((resolve, reject) => {
  const baseUrl = new URL(config.posts.destinationDir, config.url);

  const pages = groupPostsByPage({
    posts,
    perPage: config.posts.pagination.perPage,
    paginationPath: config.posts.pagination.path,
    baseUrl
  });

  const markdownProcessor = new MarkdownProcessor({
    defaultLayout: config.defaultLayout,
    layoutsPath: path.join(config.sourcePath, config.layoutsDir)
  });

  const source = path.join(config.sourcePath, config.posts.sourceDir, 'index.md');

  Promise.all(pages.map(({ posts, pagination }) => {
    const filename = getPaginationFilename(pagination.number, config.posts.pagination.path);
    const destination = path.join(config.destinationPath, config.posts.destinationDir, filename);

    return markdownProcessor.process({
      source,
      destination,
      url: pagination.currentUrl,
      viewData: {
        config,
        posts,
        pagination
      }
    });
  }))
  .then(results => resolve(results))
  .catch(err => reject(err));
});

module.exports = createPostsIndex;
