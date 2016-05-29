'use strict';

(function() {

  class TestNodeContextMenuAction {

    constructor(ListSelectDialog) {
      this._ListSelectDialog = ListSelectDialog;
    }

    create(node, actionDesc) {
      if (node.$meta.desc.isComposite) {
        return {
          title: 'Test Action ' + actionDesc.p,
          icon: 'cog',
          action: () => {
            return this._ListSelectDialog.open([{
              name: 'some action',
              icon: 'cog'
            }, {
              name: 'another action',
              icon: 'user'
            }]).result.then(item => {
              console.log('TestNodeContextMenuAction-node-' + node.$meta.id + '-' + item.name);
            });
          }
        };
      }
    }
  }

  angular.module('editorApp')
    .service('TestNodeContextMenuAction', TestNodeContextMenuAction)
    .config(function(NodeItemActionCfgProvider) {
      NodeItemActionCfgProvider.registerNodeContextMenuAction({
        service: 'TestNodeContextMenuAction',
        p:1
      });
      NodeItemActionCfgProvider.registerNodeContextMenuAction({
        service: 'TestNodeContextMenuAction',
        p:2
      });
    });
})();
//bude kvoli moveup/move down akciam urcite treba mat v node parenta a v servisoch zasa nodu. Najlepsie to bude ale spravit tak, ze tam bude len id a v TreeStore sa bude dat getnut nodu na zaklade id
// treb aspravit to, aby view zvladal aj nody bez desc - napr. je v json chyba
