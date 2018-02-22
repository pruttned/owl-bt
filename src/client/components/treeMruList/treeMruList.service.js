'use strict';

(function () {
    const itemsStorageKey = 'TreeMruList.items',
        maxItemCnt = 20; //TODO: cfg

    class TreeMruList {
        constructor(_) {
            this._ = _;
            this.maxItemCnt = maxItemCnt;
        }

        getList() {
            const itemsStorageValue = localStorage.getItem(itemsStorageKey);
            if (itemsStorageValue) {
                return JSON.parse(itemsStorageValue);
            } else {
                return [];
            }
        }

        register(treePath) {
            let items = this.getList();
            this._.remove(items, { path: treePath });
            items.unshift({
                path: treePath
            });
            if (items.length > this.maxItemCnt) {
                items.splice(-1);
            }

            localStorage.setItem(itemsStorageKey, JSON.stringify(items));
        }

        remove(treePath) {
            let items = this.getList();
            this._.remove(items, { path: treePath });
            localStorage.setItem(itemsStorageKey, JSON.stringify(items));
        }
    }

    angular.module('editorApp')
        .service('TreeMruList', TreeMruList);
})();