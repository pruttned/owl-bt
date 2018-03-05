(function () {
  'use strict';

  angular.module('editorApp')
    .directive('treeItemSideList', function (_, $compile, PropertyViewModelProvider, TreeSelection, ProjectStore,
      TreeNodeProvider, TreeDecoratorItemProvider, TreeServiceItemProvider,
      AddTreeNodeItemAction) {

      let items = {};
      const itemProviders = {
        node: TreeNodeProvider,
        decorator: TreeDecoratorItemProvider,
        service: TreeServiceItemProvider,
      }

      function renderItems(scope, items, ulElm) {
        items.forEach(function (item, index) {
          let liElm = angular.element('<li/>');
          liElm.on('click', () => {
            let itemDesc = item.desc;
            console.log(itemDesc);
            let selNode = TreeSelection.selNode();

            let nodeItem = itemProviders[item.itemType].create({
              type: itemDesc.name
            });
            return AddTreeNodeItemAction.exec({
              node: selNode,
              item: nodeItem,
              itemType: item.itemType
            });
          });

          liElm.append(document.createTextNode(item.name));

          if (item.color) {
            liElm.addClass('color');
            liElm.css('border-left-color', item.color);
          }

          //addItemAsideInf(liElm, item);
          ulElm.append(liElm);
        });
      }

      function renderAllItems(scope, element) {
        return ProjectStore.ensureLoad().then(() => {
          items.services = _.values(ProjectStore.getServiceDescs()).map(d => ({
            name: d.name,
            icon: d.icon,
            desc: d,
            itemType: 'service',
            color: d.color || '#5cc690'
          }));
          items.decorators = _.values(ProjectStore.getDecoratorDescs()).map(d => ({
            name: d.name,
            icon: d.icon,
            desc: d,
            itemType: 'decorator',
            color: d.color || '#5c90c6'
          }));
          items.nodes = _.values(ProjectStore.getNodeDescs()).map(d => ({
            name: d.name,
            icon: d.icon,
            desc: d,
            itemType: 'node',
            color: d.color || (d.isComposite ? '#d08038' : '#955cc6')
          }));

          renderItems(scope, items.nodes, element.find('[data-nodes]>ul'))
          renderItems(scope, items.decorators, element.find('[data-decorators]>ul'))
          renderItems(scope, items.services, element.find('[data-services]>ul'))
        });
      }

      return {
        templateUrl: 'app/tree/treeItemSideList/treeItemSideList.html',
        restrict: 'EA',
        replace: true,
        scope: {},

        link: function (scope, element) {

          scope.$watch(() => ProjectStore.version, function () {
            renderAllItems(scope, element)
              .then(() => {

              });
          });
          scope.$watch(() => TreeSelection.selNode(), function () {
            // updateItems(scope, element);
            let selNode = TreeSelection.selNode();
            scope.hasSelectedNode = selNode;
            scope.selNodeIsComposite = selNode && selNode.$meta.desc.isComposite;
          });
        }
      };
    });
})();
