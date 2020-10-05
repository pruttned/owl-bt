(function () {
  'use strict';

  const separationX = 50;
  const separationY = 70;
  const baseWidth = 150; //should be somewhere between min and max width
  const baseHeight = 40;
  const linkStartHeight = 10;
  const marginX = 50;
  const marginY = 50;
  //init tree size must be enough for a node so the node's width won't be smaller due to wrapping
  const minTreeWidth = 500;
  const minTreeHeight = 500;
  const minZoom = 0.1;
  const maxZoom = 2;
  const dragDistancePreventDefault = 10;
  const focusMoveDuration = 300;
  const scrollToNodeTopOffset = 100;

  let hasPanned;

  function selectItem(TreeSelection, item) {
    if (item) {
      TreeSelection.select(item.viewNode ? item.viewNode.nodeItem : item.nodeItem, item.nodeItem);
    } else {
      TreeSelection.select();
    }
  }

  function showContextMenu(CommandContextMenu, d3, TreeSelection, scope, viewNodeItem) {
    scope.$apply(function () {
      selectItem(TreeSelection, viewNodeItem);
      CommandContextMenu.show(scope, d3.event);
    });
  }

  function bindMouseEvents(CommandContextMenu, d3, TreeSelection, scope, nodeItemElm, viewNodeItem) {
    nodeItemElm
      .data([viewNodeItem])
      .on('click', item => {
        d3.event.stopPropagation();
        if (!hasPanned) {
          scope.$apply(function () {
            selectItem(TreeSelection, item);
          });
        }
      })
      .on('contextmenu', item => {
        d3.event.preventDefault();
        d3.event.stopPropagation();
        if (!hasPanned) {
          showContextMenu(CommandContextMenu, d3, TreeSelection, scope, item);
        }
      });
  }

  function bindTreeElmMouseEvents(CommandContextMenu, d3, TreeSelection, scope, treeElm) {
    treeElm
      .on('click', () => {
        if (!hasPanned) {
          scope.$apply(function () {
            selectItem(TreeSelection, null);
          });
        }
      })
      .on('contextmenu', () => {
        d3.event.preventDefault();
        d3.event.stopPropagation();
        if (!hasPanned) {
          CommandContextMenu.hide();
          scope.$apply(function () {
            selectItem(TreeSelection, null);
          });
        }
      });
  }

  function getNodeItemNamePrefix(nodeItem) {
    if (nodeItem.inverseCheckCondition) {
      return '[not] ';
    }
    return '';
  }

  function addNodeItemElm(CommandContextMenu, d3, TreeNodeItem, TreeSelection, scope, viewNodeItem, nodeElm, cssClass, index) {
    let desc = viewNodeItem.desc;
    let nodeItemElm = nodeElm.append('div');

    let propertiesAreValid = TreeNodeItem.propertiesAreValid(viewNodeItem.nodeItem);

    nodeItemElm
      .attr('class', 'item ' + cssClass + (desc.isInvalid || !propertiesAreValid ? ' invalid' : ''))
      .attr('data-index', index)
      .append('span')
      .attr('class', `icon fa fa-${desc.icon}`);
    let itemContentElm = nodeItemElm.append('div')
      .attr('class', 'content');

    const defaultName = getNodeItemNamePrefix(viewNodeItem.nodeItem) + desc.name;
    const nameElm = itemContentElm
      .append('div')
      .attr('class', 'name');
    if (viewNodeItem.nodeItem.label && viewNodeItem.nodeItem.label.length) {
      nameElm.append('span')
        .attr('class', 'name-sub')
        .text(`(${defaultName})`);
      nameElm.append('span')
        .text(viewNodeItem.nodeItem.label);
    } else {
      nameElm.text(defaultName);
    }

    if (viewNodeItem.nodeItem.comment) {
      itemContentElm.classed('content-with-comment', true);

      itemContentElm  
        .append('span')
        .attr('class', 'comment-icon fa fa-info-circle');
      itemContentElm.append('div')
        .attr('class', 'comment-content')
        .text(viewNodeItem.nodeItem.comment);
    }

    if (desc.description) {
      itemContentElm
        .append('div')
        .attr('class', 'desc')
        .text(TreeNodeItem.getDescription(viewNodeItem.nodeItem));
    }
    if (TreeSelection.isSelected(viewNodeItem.nodeItem)) {
      nodeItemElm.classed('selected', true);
    }

    if (desc.color) {
      if (typeof (index) === 'undefined') { // not a item inside node
        itemContentElm.style('background', desc.color);
      }
      itemContentElm.style('border-left-color', desc.color);
    }

    bindMouseEvents(CommandContextMenu, d3, TreeSelection, scope, nodeItemElm, viewNodeItem);
  }

  function getNodeKey(viewNode) {
    return `${viewNode.id}_${viewNode.version}`;
  }

  function refreshNodes(CommandContextMenu, TreeNodeItem, d3, TreeSelection, scope, rootViewNode, nodeElmsData) {
    //add new nodes
    nodeElmsData
      .enter()
      .append('div')
      .attr('class', viewNode => (viewNode.desc.isComposite ? 'composite' : 'action') + ' node')
      .attr('data-node-id', viewNode => viewNode.id)
      .attr('data-node-key', viewNode => getNodeKey(viewNode))
      .each(function (viewNode) {
        let nodeElm = d3.select(this);

        addNodeItemElm(CommandContextMenu, d3, TreeNodeItem, TreeSelection, scope, viewNode, nodeElm, 'node-desc');

        if (viewNode.decorators) {
          viewNode.decorators.forEach(function (viewNodeItem, index) {
            addNodeItemElm(CommandContextMenu, d3, TreeNodeItem, TreeSelection, scope, viewNodeItem, nodeElm, 'decorator', index);
          });
        }
        if (viewNode.services) {
          viewNode.services.forEach(function (viewNodeItem, index) {
            addNodeItemElm(CommandContextMenu, d3, TreeNodeItem, TreeSelection, scope, viewNodeItem, nodeElm, 'service', index);
          });
        }

        if (viewNode.viewNodeItem === scope.selectedNode) {
          nodeElm.classed('selected', true);
        }
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

  function refreshLinks(d3, svgElm, viewNodes, nodeElms, treeLayout) {
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

  function refreshTree(CommandContextMenu, TreeViewModelProvider, TreeNodeItem, d3, TreeSelection, scope, rootNode, treeElm, treeContentElm, svgElm) {
    //TODO: reuse tree view model between refreshes in case of perf problems
    let rootViewNode = TreeViewModelProvider.create(rootNode); //because D3 (and also this method) enhances nodes with its fields and parent field creates circular reference
    let viewNodes = TreeViewModelProvider.getAllNodes(rootViewNode);

    let nodeElms = treeContentElm.selectAll('.node');

    //http://stackoverflow.com/questions/30890212/data-join-with-custom-key-does-not-work-as-expected
    let nodeElmsData = nodeElms.data(viewNodes, function (viewNode) {
      return Array.isArray(this) ? getNodeKey(viewNode) : d3.select(this).attr('data-node-key');
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
    refreshNodes(CommandContextMenu, TreeNodeItem, d3, TreeSelection, scope, rootViewNode, nodeElmsData);

    //update node width and height from content
    nodeElmsData
      .each(function (viewNode) { //width and height from content
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

    //set node positions
    let offsetX = -treeBounds.minX;
    let offsetY = -treeBounds.minY;
    nodeElmsData
      .each(function (viewNode) {
        viewNode.x += offsetX - viewNode.width * 0.5;
        viewNode.y = yPosPerLevel[viewNode.depth] + offsetY;
      })
      .attr('style', viewNode => `left:${viewNode.x}px;top:${viewNode.y}px;`);

    refreshLinks(d3, svgElm, viewNodes, nodeElms, treeLayout);

    // update tree dimensions
    treeContentElm
      .style('width', `${treeBounds.maxX - treeBounds.minX}px`)
      .style('height', `${treeBounds.maxY - treeBounds.minY}px`);
    svgElm
      .attr('width', treeBounds.maxX - treeBounds.minX)
      .attr('height', treeBounds.maxY - treeBounds.minY);
  }

  function createZoomHandler(d3, treeContentElm) {
    let zoom;
    let handleZoom = function () {
      let translate = zoom.translate();
      treeContentElm.style('transform', `translate(${translate[0]}px,${translate[1]}px) scale(${zoom.scale()})`);
    };
    let zoomStart = {};
    zoom = d3.behavior.zoom()
      .scaleExtent([minZoom, maxZoom])
      .on('zoom', handleZoom)
      .on('zoomstart', () => {
        if (d3.event.sourceEvent) {
          zoomStart = {
            x: d3.event.sourceEvent.clientX,
            y: d3.event.sourceEvent.clientY
          };
        }
      })
      .on('zoomend', () => {
        if (d3.event.sourceEvent) {
          let distance = Math.sqrt(Math.pow(d3.event.sourceEvent.clientX - zoomStart.x, 2) + Math.pow(d3.event.sourceEvent.clientY - zoomStart.y, 2));
          if (distance >= dragDistancePreventDefault) {
            hasPanned = true;
          }
        }
      });

    //  .on('dblclick.zoom', null);
    return {
      zoom: zoom,
      handleZoom: handleZoom
    };
  }

  function getNodeSelector(node) {
    return `.node[data-node-id="${node.$meta.id}"]`;
  }

  function onSelectionChanged(TreeNode, TreeSelection, treeContentElm) {
    //deselect
    treeContentElm.selectAll('.item.selected').classed('selected', false);
    //select
    if (TreeSelection.hasSelected()) {
      let nodeElm = treeContentElm.select(getNodeSelector(TreeSelection.selNode()));
      if (TreeSelection.selItemType() === 'node') {
        nodeElm.selectAll('.item.node-desc').classed('selected', true); //selectAll instead of select -  https://github.com/mbostock/d3/issues/1443
      } else {
        let itemClass = 'decorator';
        let subItemIndex = TreeNode.indexOfDecorator(TreeSelection.selNode(), TreeSelection.selItem());
        if (subItemIndex === -1) {
          itemClass = 'service';
          subItemIndex = TreeNode.indexOfService(TreeSelection.selNode(), TreeSelection.selItem());
        }
        if (subItemIndex > -1) {
          nodeElm.selectAll(`.item.${itemClass}[data-index="${subItemIndex}"]`).classed('selected', true); //selectAll instead of select -  https://github.com/mbostock/d3/issues/1443
        }
      }
    }
  }

  function scrollToNode(d3, zoomHandler, treeElmRaw, node, duration) {
    if (node) {
      let nodeElmRaw = treeElmRaw.querySelector(getNodeSelector(node));
      if (nodeElmRaw) {
        let scale = zoomHandler.zoom.scale();
        let destTranslate = [scale * (-nodeElmRaw.offsetLeft - nodeElmRaw.offsetWidth * 0.5) + treeElmRaw.offsetWidth * 0.5,
        scale * (-nodeElmRaw.offsetTop) + scrollToNodeTopOffset
        ];
        if (duration) {
          d3.transition().duration(duration).tween('scrollToNode', function () {
            let iTranslate = d3.interpolate(zoomHandler.zoom.translate(), destTranslate);
            return function (t) {
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

  function treeView(TreeStore, TreeSelection, TreeViewModelProvider, TreeNodeItem, TreeNode, d3, CommandContextMenu, TreeFocus) {
    return {
      template: require('./treeView.html'),
      restrict: 'EA',
      replace: true,
      scope: {},
      link: function (scope, element) {
        // note: don't use replaceWith because of jquery problems with svg
        // note: don't use foreignObject because of webkit scale bugs
        // note: d3 node building instead of angular template is used to get the real width and height before exiting the link function and also for perf reasons

        let treeElmRaw = element[0];
        let treeElm = d3.select(element[0]);
        let treeContentElm = d3.select(element[0].querySelector('.tree-content'));
        let svgElm = treeContentElm.append('svg');

        let zoomHandler = createZoomHandler(d3, treeContentElm);

        TreeFocus.subscribe(scope, function (node) {
          scrollToNode(d3, zoomHandler, treeElmRaw, node, focusMoveDuration);
        });

        bindTreeElmMouseEvents(CommandContextMenu, d3, TreeSelection, scope, treeElm);

        TreeStore.ensureLoad()
          .then(() => {
            let rootNode = TreeStore.rootNode;

            let firstRender = true;
            scope.$watch(() => TreeStore.version,
              function () {
                refreshTree(CommandContextMenu, TreeViewModelProvider, TreeNodeItem, d3, TreeSelection, scope, rootNode, treeElm, treeContentElm, svgElm);

                if (firstRender) {
                  treeElm
                    .on('mousedown', () => { //must be called before call(zoomHandler.zoom) because of stopImmediatePropagation
                      hasPanned = false;

                      if (d3.event.button !== 2) {
                        d3.event.stopImmediatePropagation();
                      }
                    })
                    .call(zoomHandler.zoom)
                    .on('dblclick.zoom', null);

                  scrollToNode(d3, zoomHandler, treeElmRaw, rootNode);

                  firstRender = false;
                }
              });

            scope.$watch(() => TreeSelection.selItem(), function () {
              onSelectionChanged(TreeNode, TreeSelection, treeContentElm);
            });
          });
      }
    };
  }

  angular.module('editorApp')
    .directive('treeView', treeView);

})();
