'use strict';

module.exports = function(grunt) {

   /**
   * Folder structure
   */
  var dirs = {
    tmp: '.tmp',
    src: '_source',
    build: 'build',
    assets: '/assets',
    bower: '/bower_components',
    sass: '<%= dir.assets %>/_scss',
    css: '<%= dir.assets %>/css',
    js: '<%= dir.assets %>/js',
    images: '<%= dir.assets %>/img',
    fonts: '<%= dir.assets %>/fonts'
  };

  /**
   * Grunt config
   */
  grunt.initConfig({
    dir: dirs,

    /**
     * Get package info
     */
    pkg: grunt.file.readJSON('package.json'),

    /**
     * Theme banner
     * Dynamically appended to CSS/JS files
     * Inherits text from package.json
     */
    tag: {
      banner: '/*!\n' +
              ' * <%= pkg.name %>\n' +
              ' * <%= pkg.description %>\n' +
              ' * <%= pkg.url %>\n' +
              ' * @author <%= pkg.author.name %> <%= pkg.author.url %>\n' +
              ' * @version <%= pkg.version %>\n' +
              ' * Copyright <%= pkg.copyright %>. <%= pkg.license %> licensed.\n' +
              ' */\n'
    },

    /**
     * Clean up temporary assets and folders before release
     */
    clean: {
      build: {
        files: [{
          dot: true,
          src: [
            '.sass-cache',
            '<%= dir.tmp %>',
            'build'
          ]
        }]
      },
      release: {
        files: [{
          dot: true,
          src: [
            'assets',
            'partials',
            '*.hbs'
          ]
        }]
      }
    },

    /**
     * JSHint
     * Manage the options inside .jshintrc file
     */
    jshint: {
      files: ['<%= dir.src %><%= dir.js %>/**/*.js'],
      // options: {
      //   jshintrc: '.jshintrc'
      // },
      build: [
        'Gruntfile.js',
        '<%= dir.dev %><%= dir.js %>/**/*.js',
        '!<%= dir.dev %><%= dir.bower %>/**/*'
      ],
      report: [
        '<%= dir.src %><%= dir.js %>/**/*.js'
      ]
    },

    /**
     * CSSLint
     * Manage the options inside .csslintrc file
     */
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      report: {
        src: ['<%= dir.src %><%= dir.css %>/**/*.css']
      }
    },

    /**
     * CSS redundancy analyzer
     */
    // csscss: {
    //   options: {
    //     bundleExec: true,
    //     minMatch: 2,
    //     ignoreSassMixins: false,
    //     colorize: true,
    //     shorthand: false,
    //     verbose: true
    //   },
    //   report: {
    //     src: [
    //       '<%= dir.src %><%= dir.css %>/**/*.css',
    //       '<%= dir.src %><%= dir.sass %>/*.{scss,sass}'
    //     ]
    //   }
    // },

    /**
     * Concatenates JavaScript files and appends theme banner
     * Usemin import .js files
     */
    concat: {
      options: {
        stripBanners: true,
        nonull: true,
        banner: '<%= tag.banner %>'
      }
    },

    /**
     * Uglify (minify) JavaScript files
     * Compresses and minifies all JavaScript
     * Usemin import .js files
     */
    uglify: {
      options: {
        banner: '<%= tag.banner %>'
      }
    },

    /**
     * Minify CSS files
     * Compresses and minifies all CSS and appends theme banner
     * Usemin import .css files
     */
    cssmin: {
      build: {
        options: {
          report: 'gzip'
        }
      }
    },

    /**
     * Minify concated CSS files
     * Compresses and minifies CSS
     */
    csso: {
      build: {
        options: {
          banner: '<%= tag.banner %>',
          report: 'gzip'
        },
        files: [{
          expand: true,
          cwd: '<%= dir.build %><%= dir.css %>',
          src: '**/*.css',
          dest: '<%= dir.build %><%= dir.css %>'
        }]
      }
    },

    /**
     * Compresses Image files
     * Compresses all images
     */
    imagemin: {
      build: {
        options: {
          progressive: true
        },
        files: [{
          expand: true,
          cwd: '<%= dir.build %><%= dir.images %>',
          src: '**/*.{jpg,jpeg,png}',
          dest: '<%= dir.build %><%= dir.images %>'
        }]
      }
    },

    /**
     * Compresses SVG files
     * Compresses all svg
     */
    svgmin: {
      build: {
        files: [{
          expand: true,
          cwd: '<%= dir.build %><%= dir.images %>',
          src: '**/*.svg',
          dest: '<%= dir.build %><%= dir.images %>'
        }]
      }
    },

    compass: {
      build: {
        options: {
            sassDir: '<%= dir.src %><%= dir.sass %>',
            cssDir: '<%= dir.build %><%= dir.css %>',
            environment: 'development',
            outputStyle: 'compressed',
            debugInfo: false,
            imagesDir: 'images',
            require: ['breakpoint']
        }
      },
      dev: {
        options: {
            sassDir: '<%= dir.src %><%= dir.sass %>',
            cssDir: 'assets/css',
            environment: 'development',
            outputStyle: 'expanded',
            debugInfo: true,
            imagesDir: 'images',
            require: ['breakpoint']
        }
      }
    },

    watch: {
      scss: {
        files: '<%= dir.src %><%= dir.sass %>/**/*.scss',
        tasks: ['compass:dev']
      },
      reload: {
        files: ['./js/**/**/**/**/*.js', './assets/css/site.css','app/build/index.html', './*.html'],
        options: {
          livereload: true
        }
      }
    },

    /**
     * Autoprefix all CSS files
     */
    // autoprefixer: {
    //   options: {
    //     browsers: [
    //       'last 2 version',
    //       'safari 6',
    //       'ie 9',
    //       'opera 12.1',
    //       'ios 6',
    //       'android 4',
    //        '> 1%'
    //     ]
    //   },
    //   build: {
    //     src: '<%= dir.build %><%= dir.css %>/*.css'
    //   }
    // },

    /**
     * Revisioning all static assets
     */
    rev: {
      build: {
        files: {
          src: [
            '<%= dir.build %>/**/*.{js,css,gif,jpg,jpeg,png,svg,webp,eot*,ttf,woff}'
          ]
        }
      }
    },

    /**
     * Replaces references to non-optimized scripts or stylesheets
     */
    useminPrepare: {
      options: {
        // root: '<%= dir.src %>',
        dest: '<%= dir.build %>'
      },
      html: '<%= dir.src %>/default.hbs'
    },

    usemin: {
      options: {
          basedir: '<%= dir.build %>',
          dirs: ['<%= dir.build %>/**/*']
      },
      html: ['<%= dir.build %>/**/*.hbs']
    },

    /**
     * Copy all files to build/release folder
     */
    copy: {
      build: {
        files: [
          {
            expand: true,
            flatten: true,
            cwd: '<%= dir.bower %>',
            src: ['**/font*/*.{svg,eot*,ttf,woff,otf}'],
            dest: '<%= dir.build %><%= dir.fonts %>/',
            filter: 'isFile'
          },

          {
            "expand": true,
            flatten: true,
            "cwd": "<%= dir.src %><%= dir.fonts %>",
            "src": ["**"],
            "dest": "<%= dir.build %><%= dir.fonts %>/",
            filter: 'isFile'
          },
          {
            "expand": true,
            flatten: true,
            "cwd": "<%= dir.src %><%= dir.images %>",
            "src": ["**"],
            "dest": "<%= dir.build %><%= dir.images %>/",
            filter: 'isFile'
          },
          {
            expand: true,
            dot: true,
            cwd: '<%= dir.src %>',
            src: [
              // Usemin moves css and js files with concat.
              // Add other files and patterns here
              '*.{ico,png,md,hbs}',
              'partials/**/*',
              '<%= dir.images %>/**/*',
              '<%= dir.fonts %>/**/*'
            ],
            dest: '<%= dir.build %>'
          }
        ]
      },
      release: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= dir.build %>',
          src: ['**'],
          dest: ''
        }]
      },
      dev: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= dir.src %>',
          src: [
            '*.{ico,png,md,hbs}',
            'partials/**/*',
            '<%= dir.images %>/**/*',
            '<%= dir.fonts %>/**/*',
            '<%= dir.css %>/**/*'
            // '<%= dir.js %>/**/*'
          ],
          dest: ''
        },

          {
            expand: true,
            cwd: '<%= dir.src %>',
            src: ['assets/js/**/*.js'],
            dest: ''
          }
        ]
      }
    },

    /**
     * Bump version on package.json and bower.json
     */
    push: {
      options: {
        files: ['package.json', 'bower.json'],
        updateConfigs: ['pkg'],
        add: false,
        addFiles: ['.'],
        commitFiles: ['-a'],
        pushTo: 'origin'
      }
    },

    parallel: {
      dev: [{
          grunt: true,
          args: ['compass:dev']
      }]
    },

    /**
     * Auto generate Changelog based on git metadata
     */
    // changelog: {
    //   options: {
    //     github: 'unmaya/girder-ghost'
    //   }
    // },
  });


  /**
   * Dynamically load npm tasks
   */
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  /**
   * TASKS
   * =============================
   */

  /**
   * Report task
   * Run `grunt report` on the command line
   */
  grunt.registerTask('report', [
    'jshint:report',
    // 'csscss:report',
    'csslint:report'
  ]);

  /**
   * Build task
   * Run `grunt build` on the command line
   * Compile and compress everything
   */
  grunt.registerTask('build', 'Compile and compress everything', [
    'clean:build',
    'compass:build',
    'useminPrepare',
    'concat',
    'cssmin',
    'uglify',
    'rev',
    'copy:build',
    'usemin',
    'imagemin:build',
    'svgmin:build',
    // 'autoprefixer:build',
    'csso:build'
  ]);

  /**
   * Dry-run task
   * Run `grunt dryrun` on the command line
   * Build and move bundled files to root
   */
  grunt.registerTask('dryrun', 'Build and move bundled files to root', [
    'build',
    'clean:release',
    'copy:release',
    'clean:build'
  ]);

  /**
   * Release task
   * Run `grunt release` on the command line
   * Build, move files to root, bump and update changelog
   */
  grunt.registerTask(
    'release',
    'Build, move files to root, bump and update changelog',
    function(versionType) {
      grunt.task.run('push:' + (versionType || '') + ':bump-only');
      grunt.task.run([
        'dryrun',
        // 'changelog'
      ]);
    }
  );

  /**
   * Default task generates CSS and copies files from _source
   * It monitors the _source folder for scss changes until stopped.
   */
  grunt.registerTask('default', [
    'parallel:dev',
    'copy:dev',
    'watch'
  ]);
};
