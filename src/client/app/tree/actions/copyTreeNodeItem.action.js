'use strict';

(function () {
  class CopyTreeNodeItemAction {
    constructor(ActionExecutor, TreeStore, TreeNodeDtoConverter, TreeSelection, Clipboard) {
      this._ActionExecutor = ActionExecutor;
      this._TreeStore = TreeStore;
      this._TreeNodeDtoConverter = TreeNodeDtoConverter;
      this._TreeSelection = TreeSelection;
      this._Clipboard = Clipboard;
    }
    /**
     * @param  {object} params
     * @param  {node|service|decorator} params.nodeItem - node item that should be copyied
     * @param  {string} params.nodeItemType - type of the node item
   */
    exec(params) {
      let _this = this;

      this._ActionExecutor.exec({
        exec: () => {
          const dto = params.nodeItemType === 'node' ? _this._TreeNodeDtoConverter.convert(params.nodeItem) : _this._TreeNodeDtoConverter.convertSubItem(params.nodeItem)
          _this._Clipboard.set('tree', {
            item: dto,
            itemType: params.nodeItemType
          });
        }
      });
    }
  }

  angular.module('editorApp')
    .service('CopyTreeNodeItemAction', CopyTreeNodeItemAction);
})();