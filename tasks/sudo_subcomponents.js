/*
 * grunt-sudo-subcomponents
 * https://github.com/wirsich/grunt-sudo-subcomponents
 *
 * Copyright (c) 2014 Stephan Wirsich
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  grunt.registerMultiTask('sudo_subcomponents', 'The best Grunt plugin ever.', function() {
    var remote = function (cmd, args, cwd, done) {
      var spawn = require('superspawn').spawn;
      var remote = spawn('grunt', [cmd], {cwd: cwd}, function (err, data) {
        if (err) {
          console.error(err);
          done();
        }
        grunt.log.ok(cmd+' '+cwd+' finished ('+data+')');
        done();
      });
    };

    var terminate = this.async();
    var options = this.options({
      components: grunt.config('pkg.project.components'),
      cmd: 'noop',
      args: []
    });
    var j = 1;
    var done = function () {
      j--;
      if (j === 0) {
        terminate();
      }
    };
    var components = options.components;
    for (var c in components) {
      j++;
      remote(options.cmd, options.args, components[c], done);
    }
    done();
  });
};
