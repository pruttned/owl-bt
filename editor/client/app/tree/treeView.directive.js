'use strict';
angular.module('editorApp')
  .directive('treeView', function(d3) {

    let separationX = 50;
    let separationY = 70;
    let baseWidth = 150; //should be somewhere between min and max width
    let baseHeight = 40;
    let linkStartHeight = 10;
    let marginX = 50;
    let marginY = 50;
    //init tree size must be enough for a node so the node's width won't be smaller due to wrapping
    let minTreeWidth = 500;
    let minTreeHeight = 500;
    let minZoom = 0.1;
    let maxZoom = 2;

    function flattenTree(viewNode, outFlatViewTree) {
      outFlatViewTree = outFlatViewTree || [];
      outFlatViewTree.push(viewNode);
      if (viewNode.children) {
        for (let i = 0; i < viewNode.children.length; i++) {
          flattenTree(viewNode.children[i], outFlatViewTree);
        }
      }
      return outFlatViewTree;
    }

    function toViewTree(node) {
      let viewNode = {
        node: node,
      };
      if (node.childNodes) {
        viewNode.children = node.childNodes.map(toViewTree);
      }
      return viewNode;
    }

    function bindMouseEvents(nodeElm, viewNode, scope) {
      if (viewNode.node.decorators) {
        nodeElm.selectAll('.item.decorator')
          .data(viewNode.node.decorators)
          .on('click', function(item) {
            scope.$apply(function() {
              scope.selectedNodeItem = item;
            });
          });
      }
      if (viewNode.node.services) {
        nodeElm.selectAll('.item.service')
          .data(viewNode.node.services)
          .on('click', function(item) {
            scope.$apply(function() {
              scope.selectedNodeItem = item;
            });
          });
      }
      nodeElm.select('.item.node-desc')
        .data([viewNode.node])
        .on('click', function(item) {
          scope.$apply(function() {
            scope.selectedNodeItem = item;
          });
        });
    }

    function addNodeItemElm(scope, nodeItem, nodeElm, typeDesc, cssClass, index) {
      let itemElm = nodeElm.append('div');
      itemElm
        .attr('class', 'item ' + cssClass)
        .attr('data-index', index)
        .append('span')
        .attr('class', `icon fa fa-${typeDesc.icon}`);
      let itemContentElm = itemElm.append('div')
        .attr('class', 'content');
      itemContentElm
        .append('div')
        .attr('class', 'name')
        .text(typeDesc.name);
      if (typeDesc.description) {
        let allProperties = nodeItem.getAllProperties();
        itemContentElm
          .append('div')
          .attr('class', 'desc')
          .text(typeDesc.description(allProperties));
      }
      if (nodeItem === scope.selectedNodeItem) {
        itemElm.classed('selected', true);
      }
    }

    function refreshNodes(rootViewNode, nodeElmsData, scope) {
      //add new nodes
      nodeElmsData
        .enter()
        .append('div')
        .attr('class', viewNode => (viewNode.node.getType().isComposite ? 'composite' : 'action') + ' node')
        .attr('data-node-id', viewNode => viewNode.node.getId())
        .attr('data-node-key', viewNode => `${viewNode.node.getId()}_${viewNode.node._version}`)
        .each(function(viewNode) {
          let nodeElm = d3.select(this);
          let node = viewNode.node;
          let nodeType = node.getType();

          addNodeItemElm(scope, node, nodeElm, nodeType, 'node-desc');

          if (node.decorators) {
            node.decorators.forEach(function(decorator, index) {
              let decoratorType = decorator.getType();
              addNodeItemElm(scope, decorator, nodeElm, decoratorType, 'decorator', index);
            });
          }

          if (node.services) {
            node.services.forEach(function(service, index) {
              let serviceType = service.getType();
              addNodeItemElm(scope, service, nodeElm, serviceType, 'service', index);
            });
          }

          if (viewNode.node === scope.selectedNode) {
            nodeElm.classed('selected', true);
          }

          bindMouseEvents(nodeElm, viewNode, scope); // toto asi bude zle lebo podla mna ked sa spravi refresh, tak sa to prida do vsetkych
        });
      //remove removed nodes
      nodeElmsData
        .exit()
        .remove();
      //update mouse event bindings
    }

    function getMaxHeightPerLevel(viewNodes) {
      let maxHeightPerLevel = [];
      for (let i = 0; i < viewNodes.length; i++) {
        let viewNode = viewNodes[i];
        let isFirstOnLevel = maxHeightPerLevel.length <= viewNode.depth;
        if (isFirstOnLevel) {
          maxHeightPerLevel.push(viewNode.height);
        } else {
          let maxHightOnLevel = maxHeightPerLevel[viewNode.depth];
          if (maxHightOnLevel < viewNode.height) {
            maxHeightPerLevel[viewNode.depth] = viewNode.height;
          }
        }
      }
      return maxHeightPerLevel;
    }

    function getYPosPerLevel(viewNodes) {
      let maxHeightPerLevel = getMaxHeightPerLevel(viewNodes);
      let yPosPerLevel = [];
      let currentY = 0;
      for (let i = 0; i < maxHeightPerLevel.length; i++) {
        yPosPerLevel.push(currentY);
        currentY += maxHeightPerLevel[i] + separationY;
      }
      return yPosPerLevel;
    }

    function getTreeBounds(viewNodes, yPosPerLevel) {
      let res = {};
      for (let i = 0; i < viewNodes.length; i++) {
        let viewNode = viewNodes[i];
        let left = viewNode.x - viewNode.width * 0.5;
        let top = yPosPerLevel[viewNode.depth];
        let right = left + viewNode.width;
        let bottom = top + viewNode.height;
        if (_.isUndefined(res.minX) || left < res.minX) {
          res.minX = left;
        }
        if (_.isUndefined(res.maxX) || right > res.maxX) {
          res.maxX = right;
        }
        if (_.isUndefined(res.minY) || top < res.minY) {
          res.minY = top;
        }
        if (_.isUndefined(res.maxY) || bottom > res.maxY) {
          res.maxY = bottom;
        }
      }
      //apply margin
      res.minX = (res.minX || 0) - marginX;
      res.minY = (res.minY || 0) - marginY;
      res.maxX = (res.maxX || 0) + marginX;
      res.maxY = (res.maxY || 0) + marginY;
      return res;
    }

    function refreshLinks(svgElm, viewNodes, nodeElms, treeLayout) {
      let links = treeLayout.links(viewNodes);
      let diagonal = d3.svg.diagonal()
        .projection(viewNode => [viewNode.x, viewNode.y])
        .source(link => ({
          'x': link.source.x + link.source.width * 0.5,
          'y': (link.source.y + link.source.height + linkStartHeight)
        }))
        .target(link => ({
          'x': (link.target.x + link.target.width * 0.5),
          'y': link.target.y
        }));
      let linkElmsData = svgElm.selectAll('.link')
        .data(links);
      linkElmsData
        .enter().append('path')
        .attr('class', 'link');
      linkElmsData
        .exit()
        .remove();
      linkElmsData
        .attr('d', diagonal);

      //link starts
      let linkStartElmsData = svgElm.selectAll('.link-start')
        .data(viewNodes.filter(viewNode => viewNode.children && viewNode.children.length > 0));
      linkStartElmsData
        .enter()
        .append('line')
        .attr('class', 'link-start');
      linkStartElmsData
        .exit()
        .remove();
      linkStartElmsData
        .attr('x1', viewNode => viewNode.x + viewNode.width * 0.5)
        .attr('y1', viewNode => viewNode.y + viewNode.height)
        .attr('x2', viewNode => viewNode.x + viewNode.width * 0.5)
        .attr('y2', viewNode => viewNode.y + viewNode.height + linkStartHeight);
    }

    function refreshTree(treeElm, treeContentElm, svgElm, scope) {
      let rootViewNode = toViewTree(scope.tree.rootNode); //because D3 (and also this method) enhances nodes with its fields and parent field creates circular reference
      let viewNodes = flattenTree(rootViewNode, viewNodes);
      let nodeElms = treeContentElm.selectAll('.node');

      //http://stackoverflow.com/questions/30890212/data-join-with-custom-key-does-not-work-as-expected
      let nodeElmsData = nodeElms.data(viewNodes, function(viewNode) {
        return Array.isArray(this) ? (`${viewNode.node.getId()}_${viewNode.node._version}`) : d3.select(this).attr('data-node-key');
      });

      //init tree size must be enough for a node so the node's width won't be smaller due to text wrapping
      //but at a same time it must be big enough to contain current nodes
      if (parseInt(treeContentElm.style('width')) < minTreeWidth) {
        treeContentElm.style('width', `${minTreeWidth}px`);
      }
      if (parseInt(treeContentElm.style('height')) < minTreeHeight) {
        treeContentElm.style('height', `${minTreeHeight}px`);
      }

      //create nodes before tree layout to get real width/height in separation function
      refreshNodes(rootViewNode, nodeElmsData, scope);

      //update node width and height from content
      nodeElmsData
        .each(function(viewNode) { //width and height from content
          viewNode.width = this.offsetWidth;
          viewNode.height = this.offsetHeight;
        });

      //Compute layout
      let treeLayout = d3.layout.tree()
        .nodeSize([baseWidth, baseHeight])
        .separation((viewNode1, viewNode2) => ((viewNode1.width + viewNode2.width) + separationX) / baseWidth * 0.5);
      treeLayout.nodes(rootViewNode);

      let yPosPerLevel = getYPosPerLevel(viewNodes);
      let treeBounds = getTreeBounds(viewNodes, yPosPerLevel);
      let offsetX = -treeBounds.minX;
      let offsetY = -treeBounds.minY;

      //set node positions
      nodeElmsData
        .each(function(viewNode) {
          viewNode.x += offsetX - viewNode.width * 0.5;
          viewNode.y = yPosPerLevel[viewNode.depth] + offsetY;
        })
        .attr('style', viewNode => `left:${viewNode.x}px;top:${viewNode.y}px;`);

      refreshLinks(svgElm, viewNodes, nodeElms, treeLayout);

      // update tree dimensions
      treeContentElm
        .style('width', `${treeBounds.maxX - treeBounds.minX}px`)
        .style('height', `${treeBounds.maxY - treeBounds.minY}px`);
      svgElm
        .attr('width', treeBounds.maxX - treeBounds.minX)
        .attr('height', treeBounds.maxY - treeBounds.minY);
    }

    function createZoomHandler(treeContentElm) {
      let zoom;
      let handleZoom = function() {
        let translate = zoom.translate();
        treeContentElm.style('transform', `translate(${translate[0]}px,${translate[1]}px) scale(${zoom.scale()})`);
      };
      zoom = d3.behavior.zoom()
        .scaleExtent([minZoom, maxZoom])
        .on('zoom', handleZoom);
      return {
        zoom: zoom,
        handleZoom: handleZoom
      };
    }

    function getNodeSelector(node) {
      return `.node[data-node-id="${node.getId()}"]`;
    }

    function onSelectionChanged(treeContentElm, selectedNodeItem) {
      //deselect
      treeContentElm.selectAll('.item.selected').classed('selected', false);
      //select
      if (selectedNodeItem) {
        let node = selectedNodeItem.getNode();
        let nodeElm = treeContentElm.select(getNodeSelector(node));
        if (node === selectedNodeItem) {
          nodeElm.selectAll('.item.node-desc').classed('selected', true); //selectAll instead of select -  https://github.com/mbostock/d3/issues/1443
        } else {
          let itemClass = 'decorator';
          let subItemIndex = node.getIndexOfDecorator(selectedNodeItem);
          if (subItemIndex === -1) {
            itemClass = 'service';
            subItemIndex = node.getIndexOfService(selectedNodeItem);
          }
          if (subItemIndex > -1) {
            nodeElm.selectAll(`.item.${itemClass}[data-index="${subItemIndex}"]`).classed('selected', true); //selectAll instead of select -  https://github.com/mbostock/d3/issues/1443
          }
        }
      }
    }

    function scrollToNode(zoomHandler, treeElmRaw, node, duration) {
      if (node) {
        let nodeElmRaw = treeElmRaw.querySelector(getNodeSelector(node));
        if (nodeElmRaw) {
          let scale = zoomHandler.zoom.scale();
          let destTranslate = [scale * (-nodeElmRaw.offsetLeft - nodeElmRaw.offsetWidth * 0.5) + treeElmRaw.offsetWidth * 0.5,
            scale * (-nodeElmRaw.offsetTop + separationY * 2)
          ];
          if (duration) {
            d3.transition().duration(duration).tween('scrollToNode', function() {
              let iTranslate = d3.interpolate(zoomHandler.zoom.translate(), destTranslate);
              return function(t) {
                zoomHandler.zoom.translate(iTranslate(t));
                zoomHandler.handleZoom();
              };
            });
          } else {
            zoomHandler.zoom.translate(destTranslate);
            zoomHandler.handleZoom();
          }
        }
      }
    }

    return {
      templateUrl: 'app/tree/treeView.html',
      restrict: 'EA',
      replace: true,
      scope: {
        tree: '=',
        /**
         * {Node|Decorator|Service} - selected node item (nodeDesc/decorator/service)
         */
        selectedNodeItem: '='
      },
      // controller: function ($scope) {
      //   $scope.tmpUp=function(){
      //     console.log('child up 2 ');
      //   };
      // },
      link: function(scope, element) {
        // note: don't use replaceWith because of jquery problems with svg
        // note: don't use foreignObject because of webkit scale bugs
        // note: d3 node building instead of angular template is used to get the real width and height before exiting the link function and also for perf reasons

        let treeElmRaw = element[0];
        let treeElm = d3.select(element[0]);
        let treeContentElm = d3.select(element[0].querySelector('.tree-content'));
        let svgElm = treeContentElm.append('svg');

        let zoomHandler = createZoomHandler(treeContentElm);

        //api
        if (scope.api) {
          /**
           * Scrolls the view to a given node
           * @param  {node} node  -  node to scroll to
           * @param  {float} duration - optional scroll animation duration in milliseconds. If not defined, then the scoll is immediate
           */
          scope.api.scrollToNode = function(node, duration) {
            scrollToNode(zoomHandler, treeElmRaw, node, duration);
          };
        }

        //watch
        let firstRender = true;
        scope.$watch('tree.version', function() {
          refreshTree(treeElm, treeContentElm, svgElm, scope);
          if (firstRender) {
            treeElm.call(zoomHandler.zoom);
            scrollToNode(zoomHandler, treeElmRaw, scope.tree.rootNode);

            firstRender = false;
          }
        });
        scope.$watch('selectedNodeItem', function() {
          onSelectionChanged(treeContentElm, scope.selectedNodeItem);
        });
      }
    };
  });
