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
            template: require('./treeMruList.html'),
            restrict: 'EA',
            replace: true,
            scope: {},
            // bindToController: {
            //     items: '='
            // },
            controller: function ($httpParamSerializer, TreeMruList) {
                let _this = this;
                function refreshItems() {
                    _this.items = TreeMruList.getList().map(item => ({
                        url: '/tree?' + $httpParamSerializer({ path: item.path }),
                        path: item.path,
                        name: getPathLastSegment(item.path)
                    }));
                }

                this.removeItem = (e, item) => {
                    e.preventDefault();
                    TreeMruList.remove(item.path);
                    refreshItems();
                };

                refreshItems();
            },
            controllerAs: 'treeMruList'
        };
    }

    angular.module('editorApp')
        .directive('treeMruList', treeMruList);
})();

