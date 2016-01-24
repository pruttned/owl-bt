'use strict';

angular.module('editorApp')
  /**
   * Current tree model
   */
  .service('TreeModel',
    class TreeModel {
      constructor(ProjectModel) {

        // let nextNodeItemId = 1; //unique id amongst all node items (nodes/services/decorators)
        // function getNextItemId(){
        //   if(nextNodeItemId===Number.MAX_SAFE_INTEGER){
        //
        //   }
        //   nextNodeItemId++;
        // }
        //

        class NodeSubItem {
          /**
           * Creates NodeSubItem from the provided data
           * @param  {Object} data - data to copy to NodeSubItem
           * @param  {Node} node - node that contains this sub item
           * @param  {Object} type - item type descriptor
           */
          constructor(data, node, type) {
            angular.extend(this, data);

            this._node = node;
            this._type = type;
          }
          getType() {
            return this._type;
          }
          getNode() {
            return this._node;
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
        this.Node = class Node {
          /**
           * Creates Node tree from the provided plain subtree data
           * @param  {nodeData} node - node data to copy to Node
           * @param  {String} node.type - type of the node
           * @param  {nodeData arrray} node.childNodes - (optional) child nodes
           * @param  {serviceData arrray} node.services - (optional) services
           * @param  {decoratorData array} node.decorators - (optional) decorators
           */
          constructor(node) {
            angular.extend(this, node);

            this._version = 1;
            this._id = nextNodeId++;
            this._type = ProjectModel.getNodeType(node.type);

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
          getType() {
            return this._type;
          }
          findFirstNode(predicate){
            if(predicate(this)){
              return this;
            }
            if(this.childNodes){
              for (var i = 0; i < this.childNodes.length; i++) {
                let foundNode = this.findFirstNode(this.childNodes[i]);
                if(foundNode){
                  return foundNode;
                }
              }
            }
          }
          getIndexOfDecorator(decorator) {
            if(this.decorators){
              return _.indexOf(this.decorators, decorator);
            }
            return -1;
          }
          getIndexOfService(service) {
            if(this.services){
              return _.indexOf(this.services, service);
            }
            return -1;
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
          }]
        });
      }
    });
