'use strict';

/**
 * Fuzzy list used in list select dialog. Renders provided items and provides filtering and selection
 */
angular.module('editorApp')
  .directive('fuzzyList', function(_, FuzzyFilter, MatchHighlighter) {

    function addItemIcon(liElm, item) {
      if (item.icon) {
        let iconElm = angular.element('<span class="fa fa-fw icon"></span>');
        iconElm.addClass('fa-' + item.icon);
        liElm.append(iconElm);
      }
    }

    function addItemAsideInf(liElm, item) {
      if (item.asideInf) {
        let asideElm = angular.element('<span class="fuzzy-list-aside-inf"></span>');
        asideElm.append(document.createTextNode(item.asideInf));
        liElm.append(asideElm);
      }
    }

    function bindItemEvents(liElm, items, index, onAccept) {
      liElm.data('index', index);

      liElm.on('click', function(){
        let index = liElm.data('index');
        onAccept({item: items[index]});
      });
    }

    function renderAllItems(items, ulElm, onAccept) {
      ulElm.empty();

      items.forEach(function(item, index) {
        let liElm = angular.element('<li/>');

        bindItemEvents(liElm, items, index, onAccept);
        addItemIcon(liElm, item);
        let labelElm = angular.element('<span/>');
        labelElm.append(document.createTextNode(item.name));
        liElm.append(labelElm);

        if(item.color){
          liElm.addClass('color');
          liElm.css('border-left-color', item.color);
        }

        addItemAsideInf(liElm, item);
        ulElm.append(liElm);
      });
    }

    function renderFilteredItems(splittedMatches, filteredItems, ulElm, onAccept) {
      ulElm.empty();
      splittedMatches.forEach(function(splittedMatch, index) {
        let liElm = angular.element('<li/>');
        bindItemEvents(liElm, filteredItems, index, onAccept);
        addItemIcon(liElm, splittedMatch.item);

        let labelElm = angular.element('<span/>');
        liElm.append(labelElm);

        splittedMatch.matchParts.forEach(function(part) {
          if (part.isMatch) {
            let highlightElm = angular.element('<em></em>');
            highlightElm.text(part.text);
            labelElm.append(highlightElm);
          } else {
            labelElm.append(document.createTextNode(part.text));
          }
        });

        if(splittedMatch.item.color){
          liElm.addClass('color');
          liElm.css('border-left-color', splittedMatch.item.color);
        }

        addItemAsideInf(liElm, splittedMatch.item);

        ulElm.append(liElm);
      });
    }

    function handleSelectionChange(ulElm, selectedIndex, filteredItems, scrollToView) {
      if (filteredItems.length > 0) {
        ulElm.find('li').removeClass('selected');
        var selectedLi = ulElm.find('li:nth-child(' + (selectedIndex + 1) + ')');
        selectedLi.addClass('selected');

        if (scrollToView && selectedLi.length > 0) {
          var viewportTop = ulElm.scrollTop();
          var viewportHeight = ulElm.height();
          var viewportBottom = viewportTop + viewportHeight;
          var desiredTopScroll = selectedLi.offset().top - ulElm.offset().top + ulElm.scrollTop();
          if (desiredTopScroll < viewportTop) {
            ulElm.scrollTop(desiredTopScroll);
          } else {
            var itemHeight = selectedLi.outerHeight();
            var bottomDesiredScrollBottom = desiredTopScroll + itemHeight;
            if (bottomDesiredScrollBottom > viewportBottom) {
              ulElm.scrollTop(bottomDesiredScrollBottom - viewportHeight);
            }
          }
        }
      } else {
        ulElm.scrollTop(0);
      }
    }

    return {
      template: require('./fuzzyList.html'),
      restrict: 'EA',
      replace: true,
      scope: {
        items: '=',
        onAccept: '&'
      },
      // controller: function ($scope) {
      //   $scope.tmpUp=function(){
      //     console.log('child up 2 ');
      //   };
      // },
      link: function(scope, element) {

        let selectedIndex = 0;
        let filteredItems = scope.items;

        let ulElm = element.find('ul');
        let inputElm = element.find('input');

        renderAllItems(scope.items, ulElm, scope.onAccept);

        handleSelectionChange(ulElm, selectedIndex, filteredItems, false);

        //co sa stane pri ng-model na filter a on.input? co sa spusti prve?
        let filterDebounce = _.debounce(function() {
          let filter = inputElm.val();

          if (filter) {
            let matches = FuzzyFilter.filter(scope.items, filter);
            let splittedMatches = matches.map(match => {
              return {
                item: match.item,
                matchParts: MatchHighlighter.getParts(match.item.name, filter)
              };
            });

            filteredItems = matches.map(match => match.item);
            renderFilteredItems(splittedMatches, filteredItems, ulElm, scope.onAccept);

          } else {
            renderAllItems(scope.items, ulElm, scope.onAccept);
            filteredItems = scope.items;
          }

          selectedIndex = 0;
          handleSelectionChange(ulElm, selectedIndex, filteredItems, true);
          //    scope.$digest();
        }, 200);

        inputElm.on('input', filterDebounce);

        //handle selection+accept by keyboard
        element.on('keydown', function(e) {
          if (filteredItems.length > 0) {
            let key = e.which || e.keyCode;

            if (key === 38) {
              selectedIndex--;
              if (selectedIndex < 0) {
                selectedIndex = filteredItems.length - 1;
              }
              handleSelectionChange(ulElm, selectedIndex, filteredItems, true);
              e.preventDefault();
            } else if (key === 40) {
              selectedIndex++;
              if (selectedIndex > filteredItems.length - 1) {
                selectedIndex = 0;
              }
              handleSelectionChange(ulElm, selectedIndex, filteredItems, true);
              e.preventDefault();
            } else if (key === 13) {
              if (filteredItems.length > 0 && scope.onAccept) {
                scope.onAccept({item: filteredItems[selectedIndex]});
              }
              e.preventDefault();
            }
          }
        });

        //prevent focus lost from input box when scrolling using scrollbar
        ulElm.bind('mousedown', function(e) {
          e.preventDefault();
        });
        ulElm.bind('scroll', function() { //IE: http://stackoverflow.com/a/7483881
          inputElm.focus();
        });

        inputElm.focus();

        // element.bind('$destroy', function() {
        //   //   hotkeys.del(key);
        // });

        // inputElm.on('blur', function(){ // modal dlg defocuses the input  - fix: it must have autofocus att
        //   inputElm.focus();
        // });
        //executed when the rendering is done - see modalRender in http://angular-ui.github.io/bootstrap/ui-bootstrap-tpls-1.0.0.js
        // scope.$isRendered = true;
        // attrs.$observe('renderDone', function(value) {
        //         if (value === 'true') {
        //           inputElm.focus();
        //         }
        //       });

      }
    };
  });
