# My Personal Website

[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/risan/website)
[![License](https://img.shields.io/github/license/risan/website.svg)](https://github.com/risan/website/blob/master/LICENSE.md)

My personal website with Javascript based static file generator.

## Requirements

The following items are required to run this website:

* [Node.js](https://nodejs.org) version 8.3 or higher

## Installation

### 1. Clone this repository

Clone this repository to your local computer:

```bash
git clone git@github.com:risan/website.git
```

### 2. Install the dependencies

Navigate to the cloned directory and install the dependencies:

```bash
# Go to the cloned directory
cd website

# Install all of the dependencies
npm install

# Or use Yarn
yarn install
```

### 3. Build the website 🎉

To build the website, run the following command:

```bash
npm run build
```

The static file will be generated on `public` directory. You can also start a watcher to watch for a file changes and automatically regenerated the static files, simply run:

```bash
npm run watch
```

## License

MIT © [Risan Bagja Pradana](https://risan.io)
