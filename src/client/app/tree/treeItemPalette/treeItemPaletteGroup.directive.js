(function () {
  'use strict';

  angular.module('editorApp')
    .directive('treeItemPaletteGroup', function (_, $compile, PropertyViewModelProvider, TreeSelection, ProjectStore,
      TreeNodeProvider, TreeDecoratorItemProvider, TreeServiceItemProvider,
      AddTreeNodeItemAction) {

      const itemProviders = {
        node: TreeNodeProvider,
        decorator: TreeDecoratorItemProvider,
        service: TreeServiceItemProvider,
      }

      const itemDescProviders = {
        node: 'getNodeDescs',
        decorator: 'getDecoratorDescs',
        service: 'getServiceDescs',
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
          liElm.append(document.createTextNode(item.name))
            .addClass('tree-item-palette-item_label');
          setItemIcon(liElm, item);

          ulElm.append(liElm);
        });
      }

      function loadRenderItems(scope, element) {
        return ProjectStore.ensureLoad().then(() => {
          const getDescs = ProjectStore[itemDescProviders[scope.type]];
          let descs = _.values(getDescs.apply(ProjectStore));
          if (scope.filter) {
            descs = scope.filter({ items: descs });
          }

          const items = descs.map(d => ({
            name: d.name,
            icon: d.icon,
            desc: d,
            itemType: scope.type,
            color: d.color || scope.defaultColor
          }));

          renderItems(scope, items, element.find('ul'))
        });
      }

      return {
        template: require('./treeItemPaletteGroup.html'),
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
          title: '@',
          type: '@',
          defaultColor: '@',
          filter: '&?'
        },
        link: function (scope, element) {
          scope.showItems = true;
          
          scope.$watch(() => ProjectStore.version, function () {
            loadRenderItems(scope, element);
          });
        }
      };
    });
})();
