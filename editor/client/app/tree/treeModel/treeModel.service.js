'use strict';

angular.module('editorApp')
  /**
   * Current tree model
   */
  .service('TreeModel',
    class TreeModel {
      constructor(ProjectModel, PropertyAccessorProvider, UndoRedoManager, ListSelectDialog) {

        this.version = 1;

        let treeModel = this;

        // let nextNodeItemId = 1; //unique id amongst all node items (nodes/services/decorators)
        // function getNextItemId(){
        //   if(nextNodeItemId===Number.MAX_SAFE_INTEGER){
        //
        //   }
        //   nextNodeItemId++;
        // }
        //

        class NodeItem {
          /**
           * @param  {Node} owningNode - set only if the NodeItem is subitem of a node (not a node itself)
           * @param  {Object} typeDesc - item type descriptor
           */
          constructor(typeDesc, owningNode) {
              this._typeDesc = typeDesc;
              if (owningNode) {
                this._node = owningNode;
              }
            }
            /**
             * @return {PropertyAccessor array} property accessors
             */
          propertyAccessors() {
            if (!this._propertyAccessors) {
              this._propertyAccessors = PropertyAccessorProvider.createPropertyAccessors(this);
            }
            return this._propertyAccessors;
          }
          typeDesc() {
              return this._typeDesc;
            }
            /**
             * Gets all properties merged with default values
             * @return {object} object with parameter values merged with default values
             */
          getAllProperties() { //TODO: remove/replace with getPropertyAccessors (or rename)
            let properties = {};
            if (this._typeDesc.properties) {
              this._typeDesc.properties.forEach(property => {
                properties[property.name] = property.default;
              });
            }
            if (this.properties) {
              for (let propertyName in this.properties) {
                if (this.properties.hasOwnProperty(propertyName)) {
                  properties[propertyName] = this.properties[propertyName];
                }
              }
            }
            return properties;
          }

          /**
           * Get owning Node of this item (for Node it returns the same object)
           * @return {Node} owning node
           */
          node() {
            if (this._node) {
              return this._node;
            }
            return this;
          }
        }

        class NodeSubItem extends NodeItem {
          /**
           * Creates NodeSubItem from the provided data
           * @param  {Object} data - data to copy to NodeSubItem
           * @param  {Node} node - node that contains this sub item
           * @param  {Object} typeDesc - item type descriptor
           */
          constructor(data, node, typeDesc) {
            super(typeDesc, node);
            angular.extend(this, data);
          }

          /**
           * Get array in node that contains this node item.
           * Must be implemented in inherited node sub item
           * @return {nodeItem array}
           */
          getContainerInNode() {
              return this.getDestContainerInNode(this.node());
            }
            /**
             * Get array in node that should contain this node item.
             * Must be implemented in inherited node sub item
             * @param  {Node} node - destination node
             * @return {nodeItem array}
             */
          getDestContainerInNode( /*node*/ ) {
            throw 'Implement getDestContainerInNode(node) in inherited NodeSubItem';
          }

          getContextMenuActions() {
            let container = this.getContainerInNode();
            let indexInNode = container.indexOf(this);
            let actions = [];
            let node = this.node();
            let nodeSubItem = this;
            if (indexInNode > 0) {
              actions.push({
                title: 'Move Up',
                icon: 'arrow-up',
                action: function() {
                  node.moveSubItemUp(nodeSubItem);
                }
              });
            }
            if (indexInNode < container.length - 1) {
              actions.push({
                title: 'Move Down',
                icon: 'arrow-down',
                action: function() {
                  node.moveSubItemDown(nodeSubItem);
                }
              });
            }
            actions.push({
              title: 'Remove',
              icon: 'remove',
              action: function() {
                node.removeSubItem(nodeSubItem);
              }
            });

            return actions;
          }
        }

        this.Decorator = class Decorator extends NodeSubItem {
          /**
           * Creates Decorator from the provided data
           * @param  {decoratorData} decorator - decorator data to copy to decorator
           * @param  {String} decorator.type - type of the decorator
           * @param  {Node} node - node that contains this decorator
           */
          constructor(decorator, node) {
            super(decorator, node, ProjectModel.getDecoratorTypeDesc(decorator.type));
          }

          /**
           * Get array in node that should contain this node item.
           * @param  {Node} node - destination node
           * @return {nodeItem array}
           */
          getDestContainerInNode(node) {
            return node.decorators;
          }
        };
        let Decorator = this.Decorator;

        this.Service = class Service extends NodeSubItem {
          /**
           * Creates Service from the provided data
           * @param  {serviceData} service - service data to copy to service
           * @param  {String}  service.type - type of the service
           * @param  {Node} node - node that contains this service
           */
          constructor(service, node) {
            super(service, node, ProjectModel.getServiceTypeDesc(service.type));
          }

          /**
           * Get array in node that should contain this node item.
           * @param  {Node} node - destination node
           * @return {nodeItem array}
           */
          getDestContainerInNode(node) {
            return node.services;
          }
        };
        let Service = this.Service;


        //add commands for node
        let addServiceCommands = _.values(ProjectModel.serviceTypes);
        let addDecoratorCommands = _.values(ProjectModel.decoratorTypes);
        let addNodeCommands = _.values(ProjectModel.nodeTypes);
        // let addServiceCommands = _.values(ProjectModel.serviceTypes).map(desc => ({
        //   name: desc.name,
        //   icon: desc.icon,
        //   desc: desc
        // }));
        // let addDecoratorCommands = _.values(ProjectModel.decoratorTypes).map(desc => ({
        //   name: desc.name,
        //   icon: desc.icon,
        //   desc: desc
        // }));
        // let addNodeCommands = _.values(ProjectModel.nodeTypes).map(desc => ({
        //   name: desc.name,
        //   icon: desc.icon,
        //   desc: desc
        // }));

        //node class. TODO: extract to separate service?
        let nextNodeId = 1; //unique id amongst all node items (nodes/services/decorators)
        this.Node = class Node extends NodeItem {
          /**
           * Creates Node tree from the provided plain subtree data
           * @param  {nodeData} node - node data to copy to Node
           * @param  {String} node.type - type of the node
           * @param  {nodeData arrray} node.childNodes - (optional) child nodes
           * @param  {serviceData arrray} node.services - (optional) services
           * @param  {decoratorData array} node.decorators - (optional) decorators
           * @param  {Node} parentNode - (optional) parent node
           */
          constructor(node, parentNode) {
            super(ProjectModel.getNodeTypeDesc(node.type));
            angular.extend(this, node);

            this._version = 1;
            this._id = nextNodeId++;
            this._parentNode = parentNode;

            if (node.decorators) {
              this.decorators = node.decorators.map(decoratorData => new Decorator(decoratorData, this));
            } else {
              this.decorators = [];
            }
            if (node.services) {
              this.services = node.services.map(serviceData => new Service(serviceData, this));
            } else {
              this.services = [];
            }
            if (this._typeDesc.isComposite) {
              if (node.childNodes) {
                let _this = this;
                this.childNodes = node.childNodes.map(childNodeData => new Node(childNodeData, _this));
              } else {
                this.childNodes = [];
              }
            }
          }
          id() {
            return this._id;
          }
          parentNode() {
            return this._parentNode;
          }
          findFirstNode(predicate) {
            if (predicate(this)) {
              return this;
            }
            if (this.childNodes) {
              for (var i = 0; i < this.childNodes.length; i++) {
                let foundNode = this.findFirstNode(this.childNodes[i]);
                if (foundNode) {
                  return foundNode;
                }
              }
            }
          }
          getIndexOfDecorator(decorator) {
            if (this.decorators) {
              return _.indexOf(this.decorators, decorator);
            }
            return -1;
          }
          getIndexOfService(service) {
            if (this.services) {
              return _.indexOf(this.services, service);
            }
            return -1;
          }
          notifyChange(keepNodeVersion) {
            if (!keepNodeVersion) {
              if (this._version === Number.MAX_SAFE_INTEGER) {
                this._version = 1;
              } else {
                this._version++;
              }
            }
            treeModel.notifyChange();
          }

          /**
           * get actions for context menu
           * @return {action array}
           * @return {String} action.title - title of the item
           * @return {String} action.icon- (optional) icon of the item (fontawsome icon name without 'fa-')
           * @return {function(nodeItem)} action.action - click action of the item
           */
          getContextMenuActions() {
            let _this = this;
            let actions = [{
              title: 'Add Service',
              icon: 'clock-o',
              action: function() {
                ListSelectDialog.open(addServiceCommands)
                  .result.then(function(addCommandItem) {
                    _this.addSubItem(new Service({
                      type: addCommandItem.name
                    }, _this));
                  });
              }
            }, {
              title: 'Add Decorator',
              icon: 'filter',
              action: function() {
                ListSelectDialog.open(addDecoratorCommands)
                  .result.then(function(addCommandItem) {
                    _this.addSubItem(new Decorator({
                      type: addCommandItem.name
                    }, _this));
                  });
              }
            }];

            if (this.typeDesc().isComposite) {
              actions.push({
                title: 'Add Node',
                icon: 'sitemap',
                action: function() {
                  ListSelectDialog.open(addNodeCommands)
                    .result.then(function(addCommandItem) {
                      _this.addNode(new Node({
                        type: addCommandItem.name
                      }, _this));
                    });
                }
              });
            }
            if (this._parentNode) {
              actions.push({
                title: 'Remove',
                icon: 'remove',
                action: function() {
                  _this._parentNode.removeNode(_this);
                }
              });
            }

            return actions;
          }

          moveSubItemUp(nodeSubItem, skipUndoHistory) {
            let container = nodeSubItem.getContainerInNode();
            let itemIndex = container.indexOf(nodeSubItem);
            if (itemIndex > 0) {
              container[itemIndex] = container[itemIndex - 1];
              container[itemIndex - 1] = nodeSubItem;

              if (!skipUndoHistory) {
                let _this = this;
                UndoRedoManager.add({
                  undo: function undo() {
                    _this.moveSubItemDown(nodeSubItem, true);
                  },
                  redo: function redo() {
                    _this.moveSubItemUp(nodeSubItem, true);
                  }
                });
              }

              this.notifyChange();
            }
          }
          moveSubItemDown(nodeSubItem, skipUndoHistory) {
            let container = nodeSubItem.getContainerInNode();
            let itemIndex = container.indexOf(nodeSubItem);
            if (itemIndex < container.length - 1) {
              container[itemIndex] = container[itemIndex + 1];
              container[itemIndex + 1] = nodeSubItem;

              if (!skipUndoHistory) {
                let _this = this;
                UndoRedoManager.add({
                  undo: function undo() {
                    _this.moveSubItemUp(nodeSubItem, true);
                  },
                  redo: function redo() {
                    _this.moveSubItemDown(nodeSubItem, true);
                  }
                });
              }

              this.notifyChange();
            }
          }

          addSubItemAt(nodeSubItem, index, skipUndoHistory) {
            let container = nodeSubItem.getDestContainerInNode(this);
            container.splice(index, 0, nodeSubItem);
            nodeSubItem._node = this;

            if (!skipUndoHistory) {
              let _this = this;
              UndoRedoManager.add({
                undo: function undo() {
                  _this.removeSubItem(nodeSubItem, true);
                },
                redo: function redo() {
                  _this.addSubItemAt(nodeSubItem, index, true);
                }
              });
            }

            this.notifyChange();
          }

          addSubItem(nodeSubItem, skipUndoHistory) {
            let container = nodeSubItem.getDestContainerInNode(this);
            this.addSubItemAt(nodeSubItem, container.length, skipUndoHistory);
          }

          removeSubItem(nodeSubItem, skipUndoHistory) {
            let container = nodeSubItem.getContainerInNode();
            let itemIndex = container.indexOf(nodeSubItem);
            if (itemIndex >= 0) {
              container.splice(itemIndex, 1);
              nodeSubItem._node = null;

              if (!skipUndoHistory) {
                let _this = this;
                UndoRedoManager.add({
                  undo: function undo() {
                    _this.addSubItemAt(nodeSubItem, itemIndex, true);
                  },
                  redo: function redo() {
                    _this.removeSubItem(nodeSubItem, true);
                  }
                });
              }

              this.notifyChange();
            }
          }

          containsSubItem(nodeSubItem) {
            let container = nodeSubItem.getDestContainerInNode(this);
            return container.indexOf(nodeSubItem) >= 0;
          }

          addNodeAt(node, index, skipUndoHistory) {
            if (!this._typeDesc.isComposite) {
              throw 'Not a composite node';
            }
            this.childNodes.splice(index, 0, node);
            node._parentNode = this;

            if (!skipUndoHistory) {
              let _this = this;
              UndoRedoManager.add({
                undo: function undo() {
                  _this.removeNode(node, true);
                },
                redo: function redo() {
                  _this.addNodeAt(node, index, true);
                }
              });
            }

            this.notifyChange();
          }

          addNode(node, skipUndoHistory) {
            if (!this._typeDesc.isComposite) {
              throw 'Not a composite node';
            }
            this.addNodeAt(node, this.childNodes.length, skipUndoHistory);
          }

          removeNode(node, skipUndoHistory) {
            if (!this._typeDesc.isComposite) {
              throw 'Not a composite node';
            }

            let index = this.childNodes.indexOf(node);
            if (index >= 0) {
              this.childNodes.splice(index, 1);
              node._parentNode = null;

              if (!skipUndoHistory) {
                let _this = this;
                UndoRedoManager.add({
                  undo: function undo() {
                    _this.addNodeAt(node, index, true);
                  },
                  redo: function redo() {
                    _this.removeNode(node, true);
                  }
                });
              }

              this.notifyChange();
            }
          }
        };


        //TODO: load from srv
        this.rootNode = new this.Node({
          type: 'sequence',
          name: 'rootNode', //TODO:ak sa nastavi, tak sa musi zobrazit namiesto typu
          decorators: [{
            type: 'hasAmmo'
          }, {
            type: 'isAwake'
          }, {
            type: 'negate'
          }, {
            type: 'forceSuccess'
          }],
          services: [{
            type: 'checkAmmo'
          }],
          childNodes: [{
            type: 'findPlayer'
          }, {
            type: 'gotoPlayer'
          }, {
            type: 'playSound',
            properties: {
              soundName: 'myOtherSound.ogg',
              modifier: 'modif3'
            }
          }]
        });
      }

      notifyChange() {
        if (this.version === Number.MAX_SAFE_INTEGER) {
          this.version = 1;
        } else {
          this.version++;
        }
      }



    });
