module.exports = function(grunt) {

    require('time-grunt')(grunt);

    var config = require("./.screeps.json")

    var branch = grunt.option('branch') || config.branch;
    var email = grunt.option('email') || config.email;
    var password = grunt.option('password') || config.password;
    var ptr = grunt.option('ptr') ? true : config.ptr
    var private_directory = grunt.option('private_directory') || config.private_directory;

    grunt.loadNpmTasks('grunt-screeps')
    grunt.loadNpmTasks('grunt-contrib-clean')
    grunt.loadNpmTasks('grunt-contrib-copy')

    grunt.initConfig({
        screeps: {
            options: {
                email: email,
                password: password,
                branch: branch,
                ptr: ptr
            },
            dist: {
                src: ['dist/*.js']
            }
        },

        clean: {
            'dist': ['dist/*']
        },

        copy: {
            screeps: {
              files: [{
                expand: true,
                cwd: 'src/',
                src: '**',
                dest: 'dist/',
                filter: 'isFile',
                rename: function (dest, src) {
                  // Change the path name utilize underscores for folders
                  return dest + src.replace(/\//g,'_');
                }
              }],
            }
        },

        rsync: {
            options: {
                args: ["--verbose", "--checksum"],
                exclude: [".git*"],
                recursive: true
            },
            private: {
                options: {
                    src: './dist/',
                    dest: private_directory,
                }
            },
        },
    });


    grunt.registerTask('default',  ['clean', 'copy:screeps', 'screeps']);
    grunt.registerTask('private',  ['clean', 'copy:screeps', 'rsync:private']);
}