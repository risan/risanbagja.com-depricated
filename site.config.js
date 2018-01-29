const path = require('path');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = {
  // Site config
  isProduction: IS_PRODUCTION,
  url: IS_PRODUCTION ? 'https://risanbagja.com' : 'http://localhost:8000',
  title: 'Risan Bagja Pradana',
  siteDescription: 'Tutorials, coding practice, and software craftmanship',
  defaultMetaDescription:
    'Risan Bagja Pradana is an experienced Javascript and PHP developer',

  socialLinks: {
    Github: 'https://github.com/risan',
    Stackoverflow: 'https://stackoverflow.com/users/5138222',
    Medium: 'https://medium.com/risan',
    Twitter: 'https://twitter.com/risanbagja',
    Email: 'mailto:risanbagja@gmail.com'
  },

  // Facebook Open Graph
  openGraph: {
    locale: 'en_US',
    siteName: 'Risan Bagja Pradana',
    defaultImage: {
      url:
        'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1200&q=80',
      width: 1200,
      height: 800
    }
  },

  // Twitter Card
  twitterCard: {
    type: 'summary_large_image',
    site: '@risanbagja',
    creator: '@risanbagja',
    imageUrl:
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1200&q=80'
  },

  // Where things are
  sourcePath: path.resolve(__dirname, 'src'),
  destinationPath: path.resolve(__dirname, 'public'),
  layoutsDir: 'layouts',
  defaultLayout: 'default',
  copyableFiles: [
    '.ico',
    '.png',
    '.html',
    'robot.txt',
    'manifest.json',
    'service-worker.js'
  ],

  // Posts settings
  posts: {
    sourceDir: 'posts',
    destinationDir: 'blog',
    defaultLayout: 'post',
    pagination: {
      perPage: 4,
      path: 'page:num.html'
    },
    defaultFeaturedImageSmall:
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&q=80'
  },

  // Markdown settings
  minifyOutput: IS_PRODUCTION,
  lazyloadImage: {
    initialSrc:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEWHhaI9LJ4VAAAACklEQVR4nGNiAAAABgADNjd8qAAAAABJRU5ErkJggg=='
  },

  // Assets settings
  assets: {
    sourceDir: 'assets',
    destinationDir: 'assets',
    manifest: 'manifest.json',
    entries: {
      'register-service-worker': 'js/register-service-worker.js',
      'posts-index': 'scss/posts-index.scss',
      'posts-archive': 'scss/posts-archive.scss',
      post: 'scss/post.scss'
    }
  },

  // Critical assets
  criticalAssets: {
    sourceDir: 'assets',
    destinationDir: 'layouts/includes', // Relative to sourcePath
    entries: {
      'home-critical': 'scss/home-critical.scss',
      'offline-critical': 'scss/offline-critical.scss',
      'posts-index-critical': 'scss/posts-index-critical.scss',
      'posts-archive-critical': 'scss/posts-archive-critical.scss',
      'post-critical': 'scss/post-critical.scss'
    }
  },

  // Third party services
  services: {
    googleSearchConsole: {
      siteVerificationId: 'mGMbTcE90HxLepCGg3_rBrUWvC6OPuXyTkxpGhTfr6o'
    },
    googleAnalytics: {
      trackingId: 'UA-27136969-11'
    }
  }
};
