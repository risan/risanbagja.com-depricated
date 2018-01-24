const path = require('path');
const generateUrl = require('./../file-util/generate-url');

const getPaginationUrl = ({ pageNumber, paginationPath, baseUrl }) => {
  const name =
    pageNumber === 1 ? '' : paginationPath.replace(':num', pageNumber);

  return generateUrl(name, baseUrl);
};

const getPaginationFilename = (pageNumber, paginationPath) => {
  if (pageNumber === 1) {
    return 'index.html';
  }

  const filename = paginationPath.replace(':num', pageNumber);

  return path.extname(filename) ? filename : path.join(filename, 'index.html');
};

const nextPageUrl = ({ pageNumber, totalPages, paginationPath, baseUrl }) =>
  pageNumber === totalPages
    ? null
    : getPaginationUrl({ pageNumber: pageNumber + 1, paginationPath, baseUrl });

const previousPageUrl = ({ pageNumber, paginationPath, baseUrl }) =>
  pageNumber === 1
    ? null
    : getPaginationUrl({ pageNumber: pageNumber - 1, paginationPath, baseUrl });

const sortPostsByDateDesc = posts => posts.sort((a, b) => b.date - a.date);

const groupPostsByPage = ({ posts, perPage, paginationPath, baseUrl }) => {
  const sortedPosts = sortPostsByDateDesc(posts);

  const totalPages = Math.ceil(sortedPosts.length / perPage);
  const pages = [];

  for (let i = 0; i < totalPages; i += 1) {
    const startIdx = i * perPage;
    const pageNumber = i + 1;

    pages[i] = {
      posts: sortedPosts.slice(startIdx, startIdx + perPage),
      pagination: {
        number: pageNumber,
        totalPages,
        currentUrl: getPaginationUrl({ pageNumber, paginationPath, baseUrl }),
        nextUrl: nextPageUrl({
          pageNumber,
          totalPages,
          paginationPath,
          baseUrl
        }),
        previousUrl: previousPageUrl({ pageNumber, paginationPath, baseUrl })
      }
    };
  }

  return pages;
};

const createPostsIndex = (posts, config) =>
  new Promise(async (resolve, reject) => {
    const source = config.getPostsIndexSourcePath();
    const manifest = config.getAssetsManifest();

    const pages = groupPostsByPage({
      posts,
      perPage: config.getPostsPerPage(),
      paginationPath: config.getPostsPaginationPath(),
      baseUrl: config.getPostsBaseUrl()
    });

    try {
      const results = await Promise.all(
        pages.map(({ posts: pagePosts, pagination }) => {
          const filename = getPaginationFilename(
            pagination.number,
            config.getPostsPaginationPath()
          );
          const destination = path.join(
            config.getPostsDestinationPath(),
            filename
          );

          return config.getMarkdownProcessor().process({
            source,
            destination,
            url: pagination.currentUrl,
            viewData: {
              config: config.getData(),
              posts: pagePosts,
              pagination,
              manifest
            }
          });
        })
      );

      resolve(results);
    } catch (err) {
      reject(err);
    }
  });

module.exports = createPostsIndex;
