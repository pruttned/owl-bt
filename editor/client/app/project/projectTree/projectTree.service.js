'use strict';

angular.module('editorApp')
  .service('ProjectTree', function () {
    this.getProjectItems = function(folderPath) {

      //TODO: implement

      function getNameFromPath(path) {
        return path.substr(path.lastIndexOf('/') + 1);
      }

      let fs = [
        'prj1Path',
        'prj1Path/tree1.owltree',
        'prj1Path/tree2.owltree',
        `prj1Path/subFolder`,
        `prj1Path/subFolder/tree3.owltree`,
        `prj1Path/subFolder/tree4.owltree`,
        `prj1Path/subFolder/subSubFolder`,
        `prj1Path/subFolder/tree5.owltree`,
        `prj1Path/anotherSubFolder`,
        `prj1Path/anotherSubFolder/tree6.owltree`,
        `prj2Path`,
        `prj2Path/tree1.owltree`,
        `prj2Path/tree2.owltree`
      ];

      let paths = fs.filter(path => path.startsWith(folderPath) && path.indexOf('/', folderPath.length + 1) === -1 && path !== folderPath);
      return paths.map(function(path) { return {path: path, name: getNameFromPath(path), isFolder: path.indexOf('.') === -1};});
    };
  });
