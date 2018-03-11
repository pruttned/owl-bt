'use strict';

(function () {
  class PasteTreeNodeItemAction {
    constructor(ActionExecutor, TreeStore, TreeNode, TreeNodeProvider, TreeDecoratorItemProvider, TreeServiceItemProvider, Clipboard,
      AddTreeNodeItemAction) {
      this._ActionExecutor = ActionExecutor;
      this._TreeStore = TreeStore;
      this._TreeNode = TreeNode;
      this._Clipboard = Clipboard;
      this._AddTreeNodeItemAction = AddTreeNodeItemAction;

      this._itemProviders = {
        node: TreeNodeProvider,
        decorator: TreeDecoratorItemProvider,
        service: TreeServiceItemProvider,
      }
    }
    /**
     * @param  {object} params
     * @param  {node} params.node - node to which should be the node item from clipboard pasted
     * @param  {int} params.index - (optional) target index. NodeItem is added to the end if not provided
     */
    exec(params) {
      let treeClipboardItem = this._Clipboard.get('tree');
      if (treeClipboardItem && treeClipboardItem.item && treeClipboardItem.itemType) {

        let item = this._itemProviders[treeClipboardItem.itemType].create(treeClipboardItem.item);
        this._AddTreeNodeItemAction.exec({
          node: params.node,
          item: item,
          index : params.index,
          itemType: treeClipboardItem.itemType,
        })
      }
    }
  }

  angular.module('editorApp')
    .service('PasteTreeNodeItemAction', PasteTreeNodeItemAction);
})();
