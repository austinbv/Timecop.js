module.exports = function(grunt) {
  var path = require('path'),
  fs = require('fs');

  var CONSTANTS = {
    project_root: __dirname,
    get package_location() { return path.join(this.project_root, 'package.json'); },
    get version() { return grunt.file.readJSON(this.package_location).version; },
    get libDir() { return path.join(this.project_root, 'lib'); },
    get libFiles() {
      return ['Timecop.js', 'MockDate.js', 'TimeStackItem.js'].map(function(file){
        return path.resolve(this.libDir, file);
      }, this);
    },
    get outputFile() { return path.join(this.project_root, 'timecop.js'); }
  };

  grunt.initConfig({
    lint: {
      lib: CONSTANTS.libFiles,
      built: ['timecop.js']
    }
  });

  grunt.registerTask('default', 'Test, lint, and build Timecop.js', ['lint:lib',
                     'build',
                     'lint:built'
  ]);

  grunt.registerTask('clean', 'Remove old built timecop.js files', function() {
    fs.unlinkSync(CONSTANTS.outputFile);
  });

  grunt.registerTask('build', 'Compile and minifiy all lib files', function() {
    var template = grunt.file.read(path.join(CONSTANTS.libDir, 'BuildTemplate.js.template')),
    contents = grunt.helper('concat', CONSTANTS.libFiles, {separator: '\n\n'});

    var compiled = grunt.template.process(template, { 
      TIMECOP_VERSION: CONSTANTS.version,
      TIMECOP_LIBRARIES: contents
    });

    grunt.file.write(CONSTANTS.outputFile, compiled);
  });
};
