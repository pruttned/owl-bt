'use strict';

angular.module('editorApp')
  .service('ProjectModel',
    /**
     * Current project model
     */
    class ProjectModel {
      constructor() {
        //TODO: load from srv
        this.nodeTypes = {
          sequence: {
            name: 'sequence',
            icon: 'arrow-right',
            isComposite: true
          },
          selector: {
            name: 'selector',
            icon: 'question',
            isComposite: true
          },
          findPlayer: {
            name: 'findPlayer',
            icon: 'search',
            isComposite: false
          },
          gotoPlayer: {
            name: 'gotoPlayer',
            icon: 'step-forward',
            isComposite: false
          }
        };

        this.serviceTypes = {
          checkAmmo : {
            name : 'checkAmmo',
            icon : 'check'
          }
        };

        this.decoratorTypes = {
          hasAmmo:{
            name : 'hasAmmo',
            icon : 'battery-full'
          },
          isAwake :{
            name : 'isAwake',
            icon : 'bell'
          }
        };
      }

      getNodeType(name){
        let nodeType = this.nodeTypes[name];
        if(!nodeType){
          throw new Error(`Unknown nodeType "${name}"`);
        }
        return nodeType;
      }

      getServiceType(name){
        let serviceType = this.serviceTypes[name];
        if(!serviceType){
          throw new Error(`Unknown serviceType "${name}"`);
        }
        return serviceType;
      }

      getDecoratorType(name){
        let decoratorType = this.decoratorTypes[name];
        if(!decoratorType){
          throw new Error(`Unknown decoratorType "${name}"`);
        }
        return decoratorType;
      }
    });
