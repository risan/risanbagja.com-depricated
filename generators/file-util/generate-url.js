const { URL } = require('url');

const generateUrl = (path, baseUrl) => {
  const { pathname, origin } = baseUrl;
  const preceedingPath = pathname === '/' ? '' : pathname;
  const endingPath = path === 'index.html' ? '' : path;

  return new URL(`${preceedingPath}/${endingPath}`, origin);
};

module.exports = generateUrl;
