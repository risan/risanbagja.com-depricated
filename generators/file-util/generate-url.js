const { URL } = require('url');

const generateUrl = (path, baseUrl) => {
  const { pathname, origin } = baseUrl;
  let preceedingPath = pathname === '/' ? '' : pathname;
  let endingPath = path === 'index.html' ? '' : path;

  return new URL(`${preceedingPath}/${endingPath}`, origin);
};

module.exports = generateUrl;
