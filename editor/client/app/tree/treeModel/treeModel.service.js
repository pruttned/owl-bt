'use strict';

angular.module('editorApp')
  /**
   * Current tree model
   */
  .service('TreeModel',
    class TreeModel {
      constructor(ProjectModel, PropertyAccessorProvider) {

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
           * @param  {Object} type - item type descriptor
           */
          constructor(type, owningNode) {
            this._type = type;
            if (owningNode) {
              this._node = owningNode;
            }
          }
          /**
           * @return {PropertyAccessor array} property accessors
           */
          getPropertyAccessors(){
            if(!this._propertyAccessors){
              this._propertyAccessors = PropertyAccessorProvider.getPropertyAccessors(this);
            }
            return this._propertyAccessors;
          }
          getType() {
            return this._type;
          }
          /**
           * Gets all properties merged with default values
           * @return {object} object with parameter values merged with default values
           */
          getAllProperties() { //TODO: remove/replace with getPropertyAccessors (or rename)
            let properties = {};
            if (this._type.properties) {
              this._type.properties.forEach(property => {
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
          getNode() {
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
           * @param  {Object} type - item type descriptor
           */
          constructor(data, node, type) {
            super(type, node);
            angular.extend(this, data);
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
            let type = ProjectModel.getDecoratorType(decorator.type);
            super(decorator, node, type);
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
            let type = ProjectModel.getServiceType(service.type);
            super(service, node, type);
          }
        };
        let Service = this.Service;

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
           */
          constructor(node) {
            super(ProjectModel.getNodeType(node.type));
            angular.extend(this, node);

            this._version = 1;
            this._id = nextNodeId++;

            if (node.decorators) {
              this.decorators = node.decorators.map(decoratorData => new Decorator(decoratorData, this));
            }
            if (node.services) {
              this.services = node.services.map(serviceData => new Service(serviceData, this));
            }
            if (node.childNodes) {
              this.childNodes = node.childNodes.map(childNodeData => new Node(childNodeData));
            }
          }
          getId() {
            return this._id;
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
        };


        //TODO: load from srv
        this.rootNode = new this.Node({
          type: 'sequence',
          name: 'rootNode', //TODO:ak sa nastavi, tak sa musi zobrazit namiesto typu
          decorators: [{
            type: 'hasAmmo'
          }, {
            type: 'isAwake'
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
