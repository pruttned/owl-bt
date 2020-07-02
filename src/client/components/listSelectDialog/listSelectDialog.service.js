'use strict';

angular.module('editorApp')
  .service('ListSelectDialog', function($rootScope, $uibModal) {

    /**
     * Open the item selection modal dialog
     * @param  {item array} items - array of items to be displayed and selected from
     * @param  {String} item.name - text to display for this item
     * @param  {String} item.icon - optional item icon. Use icon names from fontAwsome without 'fa-' prefix
     * @return {modalInstance} modalInstance - dialog instance returned from UI boostrap Modal open https://angular-ui.github.io/bootstrap/
     * @return {promise} modalInstance.result - Is resolved when a modal is closed and rejected when a modal is dismissed. First argument when resolved is selected item
     * @return {promise} modalInstance... - See Modal return description in https://angular-ui.github.io/bootstrap/ for other properties
     */
    this.open = function(items) {
      return $uibModal.open({
        animation: false,
        template: require('./listSelectDialog.html'),
        controller: 'ListSelectDialogCtrl',
        windowClass: 'list-select-dialog',
        // size: size,
        resolve: {
          items: function() {
            return items;
          }
        }
      });
    };
  });
