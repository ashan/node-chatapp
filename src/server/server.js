import "source-map-support/register";

import express from 'express';
import http from 'http';
import socketIo from 'socket.io';
import chalk from 'chalk';

// ---------
// Setup
const app = express(),
  server = new http.Server(app),
  io = socketIo(server),
  isDevelopment = process.env.NODE_ENV !== 'production';

// ---------
// Client Webpack
// if we are running a dev instance make sure the client config
// is run with webpack (as dev build is different from prod for css etc.)
if (process.env.USE_WEBPACK === 'true') {
  var webpackMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    webpack = require('webpack'),
    clientConfig = require('../../webpack.client');

    const devClientCompiler = webpack(clientConfig);
    app.use(webpackMiddleware(devClientCompiler,{
      publicPath: '/build',
      stats:{
        colors: true,
        chunks: false,
        assets: false,
        timings: false,
        modules: false,
        hash: false,
        version:false
      }
    }));

  app.use(webpackHotMiddleware(devClientCompiler));
  console.log(chalk.bgRed('Using WebPack Dev Middleware! THIS IS FOR DEV ONLY!'));
}

// ---------
// Configure Express
app.set('view engine', 'jade');
app.use(express.static('public')); // serve public files

const useExternalStyles = !isDevelopment;
app.get('/', (req, res) => {
  res.render('index', {
    useExternalStyles
  });
});


// ---------
// Socket
io.on('connection', socket => {
  console.log(`got connectoin from ${socket.request.connection.remoteAddress}`);
});

// ---------
// Startup
const port = process.env.PORT || 3000;
function startServer() {
  server.listen(port, () => {
    console.log(`Started http server on ${port}`);
  });
}

startServer();