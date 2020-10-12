const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

const filename = ext => isDev ? `bundle.[hash].${ext}` : `bundle.${ext}`;

const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env']
      }
    }
  ];

  if (isDev) {
    loaders.push('eslint-loader');
  }

  return loaders;
};

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: ['@babel/polyfill', './index.js'],
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core'),
    }
  },
  devtool: isDev ? 'source-map' : false,
  devServer: {
    port: 3000,
    hot: isDev
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'clinic.html',
      template: 'clinic.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'works.html',
      template: 'works.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'contacts.html',
      template: 'contacts.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'direction.html',
      template: 'direction.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'price.html',
      template: 'price.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'promo.html',
      template: 'promo.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'news.html',
      template: 'news.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'doctor.html',
      template: 'doctor.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'foto.html',
      template: 'foto.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'lic.html',
      template: 'lic.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'dis.html',
      template: 'dis.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'reviews.html',
      template: 'reviews.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'nalog.html',
      template: 'nalog.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd
      }
    }),
    new CopyPlugin([
      {
        from: path.resolve(__dirname, 'src/fonts'),
        to: path.resolve(__dirname, 'dist/fonts')
      },
      {
        from: path.resolve(__dirname, 'src/img'),
        to: path.resolve(__dirname, 'dist/img')
      }
    ]),
    new MiniCssExtractPlugin({
      filename: filename('css')
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(s[ac]ss|css)$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
              reloadAll: true,
              publicPath: path.resolve(__dirname, 'dist/css'),
            }
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders()
      },
    ],
  },
};
