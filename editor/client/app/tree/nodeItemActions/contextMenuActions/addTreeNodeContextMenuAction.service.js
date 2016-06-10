'use strict';

(function() {

  class AddTreeNodeContextMenuAction {

    constructor(_, AddTreeNodeAction, ListSelectDialog, ProjectStore, TreeNodeProvider) {
      this._ = _;
      this._AddTreeNodeAction = AddTreeNodeAction;
      this._ListSelectDialog = ListSelectDialog;
      this._ProjectStore = ProjectStore;
      this._TreeNodeProvider = TreeNodeProvider;
    }

    create(node, actionDesc) {
      let _this = this;

      if (node.$meta.desc.isComposite) {
        return {
          title: actionDesc.title,
          icon: actionDesc.icon,
          order: actionDesc.order,
          action: () => {
            let descs = _this._.values(_this._ProjectStore.getNodeDescs());
            return _this._ListSelectDialog.open(descs)
              .result.then(desc => {
                let childNode = _this._TreeNodeProvider.create({
                  type: desc.name
                });
                return _this._AddTreeNodeAction.exec({
                  node: node,
                  childNode: childNode
                });
              });
          }
        };
      }

    }
  }

  angular.module('editorApp')
    .service('AddTreeNodeContextMenuAction', AddTreeNodeContextMenuAction)
    .config(function(NodeItemActionCfgProvider) {
      NodeItemActionCfgProvider.registerNodeContextMenuAction({
        service: 'AddTreeNodeContextMenuAction',
        title: 'Add Node',
        icon: 'sitemap',
        order: 1,
      });
    });
})();
