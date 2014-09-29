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
      var spawn  = require('child_process').spawn,
          remote = spawn(cmd, args, {cwd: cwd});

      remote.stdout.on('data', function (data) {
        grunt.log.write(""+data);
      });
      remote.stderr.on('data', function (data) {
        console.error(""+data);
      });
      remote.on('close', function (code) {
        if (code !== 0) {
          grunt.fail.fatal(code);
        }
        grunt.log.ok(cmd+' '+args.join(', ')+' '+cwd+' finished ('+code+')');
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
