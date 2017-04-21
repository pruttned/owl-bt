'use strict';

(function() {

  class ArrayHelper {
    
    canMoveLeft(array, item) {
      let itemIndex = array.indexOf(item);
      if (itemIndex > 0) {
        return true;
      }
      return false;
    }

    canMoveRight(array, item) {
      let itemIndex = array.indexOf(item);
      if (itemIndex >= 0 && itemIndex < array.length - 1) {
        return true;
      }
      return false;
    }

    /**
     * moves item in array to left and returns whether the movement was successful
     * @param  {Object[]} array
     * @param  {Object} item  - item in array to be moved
     * @return {bool}        whether the movement was successful
     */
    moveLeft(array, item) {
      let itemIndex = array.indexOf(item);
      if (itemIndex > 0) {
        array[itemIndex] = array[itemIndex - 1];
        array[itemIndex - 1] = item;

        return true;
      }
      return false;
    }

    /**
     * moves item in array to right and returns whether the movement was successful
     * @param  {Object[]} array
     * @param  {Object} item  - item in array to be moved
     * @return {bool}        whether the movement was successful
     */
    moveRight(array, item) {
      let itemIndex = array.indexOf(item);
      if (itemIndex >= 0 && itemIndex < array.length - 1) {
        array[itemIndex] = array[itemIndex + 1];
        array[itemIndex + 1] = item;

        return true;
      }
      return false;
    }

    /**
     * removes item ftom the array and returns whether the item was found and removed
     * @param  {Object[]} array
     * @param  {Object} item  - item in array to be removed
     * @return {bool}   whether the item was found and removed
     */
    remove(array, item) {
      let itemIndex = array.indexOf(item);
      if (itemIndex >= 0) {
        array.splice(itemIndex, 1);
        return true;
      }
      return false;
    }

    /**
     * returns whether the array contains specified item
     * @param  {Object[]} array
     * @param  {Object} item
     * @return {bool}
     */
    contains(array, item) {
      return array.indexOf(item) >= 0;
    }
  }

  angular.module('editorApp')
    .service('ArrayHelper', ArrayHelper);
})();
