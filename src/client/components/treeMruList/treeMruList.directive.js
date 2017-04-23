(function () {

    //TODO: extract
    function getPathLastSegment(path) {
        let index = path.lastIndexOf('/');
        if (index < 0) {
            index = path.lastIndexOf('\\');
        }
        if (index < 0) {
            return path;
        }
        return path.substr(index + 1);
    }

    function treeMruList() {
        return {
            templateUrl: 'components/treeMruList/treeMruList.html',
            restrict: 'EA',
            replace: true,
            scope: {},
            // bindToController: {
            //     items: '='
            // },
            controller: function ($httpParamSerializer, TreeMruList) {
                this.items = TreeMruList.getList().map(item => ({
                    url: '/tree?' + $httpParamSerializer({ path: item.path }),
                    path: item.path,
                    name: getPathLastSegment(item.path)
                }));
            },
            controllerAs: 'treeMruList'
        };
    }

    angular.module('editorApp')
        .directive('treeMruList', treeMruList);
})();

