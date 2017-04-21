//TODO: replace with sys clipboard

'use strict';

(function () {
    const itemsStorageKey = 'Clipboard.items';

    class Clipboard {
        constructor() {
            this._items = {};
        }

        set(key, value) {
            let items = this._getItems();
            items[key] = value;
            localStorage.setItem(itemsStorageKey, JSON.stringify(items));
        }

        get(key) {
            let items = this._getItems();
            return items[key];
        }

        _getItems() {
            let itemsStr = localStorage.getItem(itemsStorageKey);
            if (!itemsStr) {
                return {};
            }
            try {
                return JSON.parse(itemsStr);
            }
            catch (e) {
                console.error(e);
                return {};
            }
        }
    }

    angular.module('editorApp')
        .service('Clipboard', Clipboard);
})();