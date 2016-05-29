'use strict';

describe('Service: NodeItemAction', function() {

  class TestAction {
    create(node) {
      return {
        title: 'TestAction',
        icon: 'cog',
        action: function() {
          node.name = 'newName';
        }
      };
    }
  }
  class DisabledTestAction {
    create() {}
  }

  // load the service's module
  // load the service's module
  beforeEach(module('editorApp', function($provide) {
    $provide.service('TestAction', TestAction);
    $provide.service('DisabledTestAction', DisabledTestAction);
  }));

  // instantiate service
  let NodeItemActionCfg;
  let NodeItemAction;
  let $scope;
  beforeEach(inject(function($rootScope, _NodeItemActionCfg_, _NodeItemAction_) {
    $scope = $rootScope.$new();
    NodeItemActionCfg = _NodeItemActionCfg_;
    NodeItemAction = _NodeItemAction_;
    NodeItemActionCfg.nodeContextMenuActions = [];
    NodeItemActionCfg.registerNodeContextMenuAction({
      service: 'TestAction'
    });
    NodeItemActionCfg.registerNodeContextMenuAction({
      service: 'DisabledTestAction'
    });
  }));

  it('getNodeContextMenuActions should return only allowed actions',
    function() {
      let node = {
        name: 'oldName'
      };
      let actions = NodeItemAction.getNodeContextMenuActions(node);
      expect(actions.length).toBe(1);
      expect(actions[0].title).toBe('TestAction');
    });

  it('Action returned from getNodeContextMenuActions should be executable as promise',
    function(done) {
      let node = {
        name: 'oldName'
      };
      let actions = NodeItemAction.getNodeContextMenuActions(node);
      let action = actions[0];

      action.action()
        .then(() => {

          expect(node.name).toBe('newName');

          done();
        });

      $scope.$apply(); //resolve promises
    });
});
