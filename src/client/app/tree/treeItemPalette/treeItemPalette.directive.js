(function () {
  'use strict';

  angular.module('editorApp')
    .directive('treeItemPalette', function (_, $compile, PropertyViewModelProvider, TreeSelection, ProjectStore,
      TreeNodeProvider, TreeDecoratorItemProvider, TreeServiceItemProvider,
      AddTreeNodeItemAction) {

      let items = {};
      const itemProviders = {
        node: TreeNodeProvider,
        decorator: TreeDecoratorItemProvider,
        service: TreeServiceItemProvider,
      }

      function addItemIcon(liElm, item) {
        if (item.icon) {
          let iconElm = angular.element('<span class="fa fa-fw tree-item-palette-item_icon"></span>');
          iconElm.addClass('fa-' + item.icon);
          liElm.append(iconElm);
        }
      }
      function setItemIcon(liElm, item) {
        liElm.css('border-left-color', item.color);
      }
      
      function renderItems(scope, items, ulElm) {
        ulElm.empty();
        items.forEach(function (item, index) {
          let liElm = angular.element('<li class="tree-item-palette-item"/>');
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

          addItemIcon(liElm, item);
          liElm.append(document.createTextNode(item.name));
          setItemIcon(liElm, item);

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
        templateUrl: 'app/tree/treeItemPalette/treeItemPalette.html',
        restrict: 'E',
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
