const path = require('path');
const glob = require('glob');
const chalk = require('chalk');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const autoprefixer = require('autoprefixer');
const Dotenv = require('dotenv-webpack');

const isDebug = process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging';
const mode = `${isDebug ? 'development' : 'production'}`;

// Note if this prefix changes, you need to update the Github CI action!
const prefix = 'fnd'

const entryPrefix = `${prefix}.entry.`;
const entryArray = glob.sync(`./**/${entryPrefix}*.{js,jsx}`, {
  ignore: './node_modules/**',
});
const entryList = entryArray.reduce((entry, item) => {
  const name = item
    .split(entryPrefix)[1]
    .replace('.jsx', '')
    .replace('.js', '');
  return {
    ...entry,
    [name]: item,
  };
}, {});

// IF it is an empty object, bail early
if(Object.keys(entryList).length === 0 && entryList.constructor === Object){
  console.error(chalk.bold.red(`\n
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n
  You HAVE NO FILES with the prefix of ${prefix}.entry.\n  Please rename a file in modules from ${prefix}.example. --> ${prefix}.entry.\n
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`));
  process.exit(1);
}

module.exports = {
  mode,

  entry: entryList,

  devServer: {
    proxy: {
      '/api/*': {
        target: 'http://localhost:8000',
        secure: 'false'
      }
    }
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: "babel-loader"
        },
        exclude: /node_modules/
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        // If Module contains .hashed.scss or .hashed.css in the Name.
        test(modulePath) {
          if (
              modulePath.includes('.hashed.scss') ||
              modulePath.includes('.hashed.css')
          ) {
            return true;
          }
          return false;
        },

        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDebug,
              modules: true,
              localIdentName: '[local]_[hash:base64:4]',
            },
          },

          {
            loader: 'postcss-loader',
            options: {
              sourceMap: isDebug,
              plugins: () => [autoprefixer],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDebug,
            },
          },
        ],
      },

      {
        // Other .scss .css Modules.
        test(modulePath) {
          if (
              (modulePath.includes('.scss') || modulePath.includes('.css')) &&
              (!modulePath.includes('.hashed.scss') &&
                  !modulePath.includes('.hashed.css'))
          ) {
            return true;
          }
          return false;
        },

        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDebug,
              modules: false,
            },
          },

          {
            loader: 'postcss-loader',
            options: {
              sourceMap: isDebug,
              plugins: () => [autoprefixer],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDebug,
            },
          },
        ],
      },
      {
        test: /\.(jpg|jpeg|gif|png|svg|woff|woff2)$/,
        // File loader
        // https://github.com/webpack-contrib/file-loader
        loader: 'file-loader',
        options: {
          emitFile: false,
          name: `assets/${prefix}.[name][hash].[ext]`,
        },
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: `stylesheets/${prefix}.[name].bundle.css?ver=[hash]`,
    }),
  ],

  optimization: {
    minimizer: [
      ...(isDebug ? [] : [
        // Minimize all JavaScript output of chunks
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true, // set to true if you want JS source maps
        }),
      ]),

      ...(isDebug ? [] : [
        // Minimize all Css output of chunks
        // https://github.com/NMFR/optimize-css-assets-webpack-plugin
        new OptimizeCSSAssetsPlugin({}),
      ]),
    ],
  },

  devtool: isDebug ? 'inline-source-map' : false,

  // Don't attempt to continue if there are any errors.
  // https://webpack.js.org/configuration/other-options/#bail
  bail: !isDebug,

  // Cache the generated webpack modules and chunks to improve build speed
  // https://webpack.js.org/configuration/other-options/#cache
  cache: isDebug,

  // Precise control of what bundle information gets displayed
  // https://webpack.js.org/configuration/stats/
  stats: 'normal',

  resolve: {
    extensions: ['.js', '.jsx', '.json', '.scss'],
    alias: {
      globalStyles: path.resolve(__dirname, 'scss'),
      '@Shared': path.resolve(__dirname, 'src/shared'),
      '@Constants': path.resolve(__dirname, 'src/constants.js'),
      '@Helpers': path.resolve(__dirname, 'src/helpers'),
    },
  },
  output: {
    chunkFilename: `js/${prefix}.[name].bundle.js?ver=[chunkhash]`, // this ?ver flag is needed for cloudflare cache bust.
    filename: `js/${prefix}.[name].bundle.js?ver=[hash]`,
    path: path.resolve(__dirname, './public/'),
    publicPath: '/',
  },

  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  // https://webpack.github.io/docs/configuration.html#node
  // https://github.com/webpack/node-libs-browser/tree/master/mock
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
