// this is a grunt plugin that provides a development node server which
// reloads code on changes.

var Path = require('path');
var http = require('http');

var watchProject = function(module, dir) {
  return (function(m) { 
    var a = require(m);
    return function(req,res,next) {
      if(req.originalUrl == '/reload') {
        Object.keys(require.cache).filter(function(k) {
          return k.indexOf(Path.resolve(dir)) != -1;
        }).map( function(mod) {
          console.log("reloading " + mod);
          delete require.cache[Path.resolve(mod)];
        });
        a = require(module);
      }
      a(req,res,next);
    };
  }(module));
};

module.exports = function(grunt) {
  grunt.registerTask('node-reload-server', 'Reload nodejs server', function() {
    var port = grunt.config.get('connect.options.port');
    var done = this.async();
    http.get('http://localhost:' + port + "/reload", function(res) {
      done();
    });
  });

  return {
    "nodeServer": watchProject
  };
}