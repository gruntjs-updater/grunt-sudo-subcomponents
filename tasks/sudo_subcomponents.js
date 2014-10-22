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
      grunt.log.ok('Command running "'+ cwd+ '/' + cmd+ ' ' +args.join(', ') +'" ... please wait');
      var spawn = require('superspawn').spawn;
      var remote = spawn(cmd, args, {cwd: cwd}, function (err, data) {
        if (err) {
          grunt.fail.fatal(err);
          done();
          return false;
        }
        grunt.log.writeln(data);
        grunt.log.ok(cmd+' '+cwd+' finished');
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
