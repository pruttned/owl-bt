'use strict';

angular.module('editorApp')
  .service('ContextMenu',
    /**
     * Service based context menu for usage in d3 tree
     */
    class ContextMenu {
      constructor($q, $document) {
        this._$q = $q;
        this.$document = $document;
      }

      /**
       * Displays  the context menu
       * @param  {angular scope} scope - current scope
       * @param  {MouseEvent} event - event parameters from the contextmenu event
       * @param  {item array} items - items to be displayed
       * @param  {String} item.title - title of the item
       * @param  {String} item.icon - (optional) icon of the item (fontawsome icon name without 'fa-')
       * @param  {function} item.action - click action of the item
       * @return promise
       */
      show(scope, event, items) {
        event.preventDefault();
        event.stopPropagation();

        this.hide();

        if (items && items.length > 0) {
          var deferred = this._$q.defer();

          if (!this.menuElm) {
            this._initContextMenu();
          }

          this.ulElm.empty();

          for (let i = 0; i < items.length; i++) {
            var item = items[i];
            let liElm = angular.element('<li></li>');
            if (item.icon) {
              liElm.addClass('with-icon');
              let iconElm = angular.element('<span class="fa fa-fw icon"></span>');
              iconElm.addClass('fa-' + item.icon);
              liElm.append(iconElm);
            }
            liElm.append(document.createTextNode(item.title));
            liElm.on('click', this._createItemClickHandler(scope, deferred, item));
            this.ulElm.append(liElm);
          }

          this.menuElm.css('left', event.clientX + 'px');
          this.menuElm.css('top', event.clientY + 'px');
          this.menuElm.css('display', 'block');

          return deferred.promise;
        } else {
          return this._$q.when();
        }
      }
      hide() {
        if (this.menuElm) {
          this.menuElm.css('display', 'none');
        }
      }
      _initContextMenu() {
        let body = this.$document.find('body');
        this.menuElm = angular.element('<div id="serviceContextMenu" class="context-menu"><ul></ul></div>');
        this.ulElm = this.menuElm.find('ul');
        body.append(this.menuElm);

        let _this = this;
        body.on('click', function() {
          _this.hide();
        });

        this.menuElm.on('contextmenu', () => false);
      }
      _createItemClickHandler(scope, deferred, item) {
        let _this = this;
        return function() {
          if (item.action) {
            _this._$q.when(scope.$apply(item.action))
              .then((res) => deferred.resolve(res));
          } else {
            deferred.resolve();
          }
        };
      }
    });
