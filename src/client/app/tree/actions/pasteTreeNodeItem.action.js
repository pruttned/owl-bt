'use strict';

(function () {
  class PasteTreeNodeItemAction {
    constructor(ActionExecutor, TreeStore, TreeNode, TreeNodeProvider, TreeDecoratorItemProvider, TreeServiceItemProvider, Clipboard,
      AddTreeNodeAction, AddTreeNodeSubItemAction) {
      this._ActionExecutor = ActionExecutor;
      this._TreeStore = TreeStore;
      this._TreeNode = TreeNode;
      this._Clipboard = Clipboard;
      this._AddTreeNodeAction = AddTreeNodeAction;
      this._AddTreeNodeSubItemAction = AddTreeNodeSubItemAction;

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

        let nodeItem = this._itemProviders[treeClipboardItem.itemType].create(treeClipboardItem.item);

        if (treeClipboardItem.itemType === 'node') {
          this._AddTreeNodeAction.exec({
            node: params.node,
            childNode: nodeItem,
            index : params.index
          })
        } else {
          this._AddTreeNodeSubItemAction.exec({
            node: params.node,
            subItemType: treeClipboardItem.itemType,
            subItem: nodeItem,
            index : params.index
          });
        }
      }
    }
  }

  angular.module('editorApp')
    .service('PasteTreeNodeItemAction', PasteTreeNodeItemAction);
})();
