import gulp from 'gulp';
import webpack from 'webpack';
import chalk from 'chalk';
import rimraf from 'rimraf';

import {create as createServerConfig} from './webpack.server';
import {create as createClientConfig} from './webpack.client';

const $ = require('gulp-load-plugins')();

//-----------------------
// Public Tasks

// clean build directories
gulp.task('clean:server', callBack => rimraf("./build", callBack));
gulp.task('clean:client', callBack => rimraf("./public/build", callBack));
gulp.task('clean', gulp.parallel('clean:server', 'clean:client'));

// create server builds
gulp.task('dev:server', gulp.series('clean', devServerBuild));
gulp.task('prod:server', gulp.series('clean', prodServerBuild));

// create client builds
gulp.task('prod:client', gulp.series('clean:client', prodClientBuild));
gulp.task('prod', gulp.series('clean', gulp.parallel(prodServerBuild, prodClientBuild)));

// dev process
gulp.task('dev', gulp
  .series(
    'dev:server',
    gulp.parallel(
      devServerWatch,
      devServerReload
    )
  ));

//-----------------------
// Private Server Tasks
function prodClientBuild(callBack){
  const prodClientWebpack = webpack(createClientConfig(false));
  prodClientWebpack.run((error, stats) => {
    outputWebpack("Prod:Client", error, stats);
    callBack();
  });
}


//-----------------------
// Private Server Tasks
const devServerWebpack = webpack(createServerConfig(true));

function devServerBuild(callBack){
  devServerWebpack.run((error, stats) => {
    outputWebpack("Dev:Server", error, stats);
    callBack()
  });
}

function devServerWatch(){
  devServerWebpack.watch({},(error, stats) =>{
    outputWebpack("Dev:Server", error, stats);
  });
}

function devServerReload(){
  return $.nodemon({
    script: './build/server.js',
    watch: './build',
    env:{
      'NODE_ENV': 'development',
      'USE_WEBPACK': 'true'
    }
  });
}

function prodServerBuild(callBack){
  const prodServerWebpack = webpack(createServerConfig(false));
  prodServerWebpack.run((error, stats) =>{
    outputWebpack("Prod:Server", error, stats);
    callBack();
  });
}

//-----------------------
// Helpers
function outputWebpack(label, error, stats){
  if(error) throw new Error(error);

  if(stats.hasErrors()){
    $.util.log(stats.toString({colors:true}));
  }else{
    const time = stats.endTime - stats.startTime;
    $.util.log(chalk.bgGreen(`Built ${label} in ${time} ms`))
  }
}