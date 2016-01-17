'use strict';

angular.module('editorApp')
  /**
   * Current tree model
   */
  .service('TreeModel',
    class TreeModel {
      constructor(ProjectModel) {

        //node class. TODO: extract to separate service?
        let nextNodeId = 1;
        this.Node = class Node {
          /**
           * Creates Node from the provided data
           * @param  {nodeData} node - node data to copy to Node
           * @param  {String} node.type - type of the node
           */
          constructor(node) {
            angular.extend(this, node);

            this._version = 1;
            this._id = nextNodeId++;
            this._type = ProjectModel.getNodeType(node.type);
          }

          getType() {
            return this._type;
          }
        };

        this.Decorator = class Decorator {
          /**
           * Creates Decorator from the provided data
           * @param  {decoratorData} decorator - decorator data to copy to Node
           * @param  {String} decorator.type - type of the decorator
           */
          constructor(decorator) {
            angular.extend(this, decorator);

            this._type = ProjectModel.getDecoratorType(decorator.type);
          }

          getType() {
            return this._type;
          }
        };

        this.Service = class Service {
          /**
           * Creates Service from the provided data
           * @param  {serviceData} service - service data to copy to Node
           * @param  {String}  service.type - type of the service
           */
          constructor(service) {
            angular.extend(this, service);

            this._type = ProjectModel.getServiceType(service.type);
          }

          getType() {
            return this._type;
          }
        };

        //TODO: load from srv
        this.rootNode = new this.Node({
          type: 'sequence',
          decorators: [new this.Decorator({
            type: 'hasAmmo'
          }), new this.Decorator({
            type: 'isAwake'
          }), ],
          services: [new this.Service({
            type: 'checkAmmo'
          })],
          childNodes: [
            new this.Node({
              type: 'findPlayer'
            }),
            new this.Node({
              type: 'gotoPlayer'
            })
          ]
        });
      }
    });
