'use strict';

(function () {
    const itemsStorageKey = 'TreeMruList.items',
        maxItemCnt = 20; //TODO: cfg

    class TreeMruList {
        constructor(_) {
            this._ = _;
            this.maxItemCnt = maxItemCnt;

            const itemsStorageValue = localStorage.getItem(itemsStorageKey);
            if (itemsStorageValue) {
                this._items = JSON.parse(itemsStorageValue);
            } else {
                this._items = [];
            }

        }
        getList() {
            return this._items;
        }

        register(treePath) {
            this._.remove(this._items, { path: treePath });
            this._items.unshift({
                path: treePath
            });
            if (this._items.length > maxItemCnt) {
                this._items.splice(-1);
            }

            localStorage.setItem(itemsStorageKey, JSON.stringify(this._items));
        }
    }

    angular.module('editorApp')
        .service('TreeMruList', TreeMruList);
})();