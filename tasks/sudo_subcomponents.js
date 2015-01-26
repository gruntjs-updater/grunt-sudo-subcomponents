/*
 * grunt-sudo-subcomponents
 * https://github.com/wirsich/grunt-sudo-subcomponents
 *
 * Copyright (c) 2014 Stephan Wirsich
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  grunt.registerMultiTask('sudo_subcomponents', 'Grunt Plugin to trigger tasks of "sudo subcomponents".', function() {
    var remote = function (cmd, args, cwd, done) {
      grunt.log.ok('Command running "'+ cwd + cmd+ ' ' +args.join(', '));
      var spawn = require('cross-spawn').spawn;
      var command = spawn(cmd, args, {cwd: cwd});

      command.stderr.on('data', function (data) {
        grunt.fail.fatal(data);
        done();
      });

      command.stdout.on('data', function (data) {
        grunt.log.writeln(data);
      });

      command.on('close', function (code) {
        var msg = cmd+' '+args.join(' ')+' finished with '+code;
        if (code > 0) {
          grunt.fail.fatal(msg);
        }
        else {
          grunt.log.ok('Command "'+cmd+'" finished');
        }
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
