'use strict';

angular.module('editorApp')
  .service('ProjectModel',
    /**
     * Current project model
     */
    class ProjectModel {
      constructor($interpolate) {
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
          },
          playSound: {
            name: 'playSound',
            icon: 'volume-up',
            isComposite: false,
            description: 'Play sound "{{soundName}}" with "{{volume}}" volume',
            properties: [{
              name: 'soundName',
              type: 'string',
              default: 'mySound.ogg'
            }, {
              name: 'volume',
              type: 'number',
              min: 10,
              max: 20,
              default: 14.5
            }, {
              name: 'repeat',
              type: 'bool',
              default: true
            }, {
              name: 'modifier',
              type: 'enum',
              default: 'modif2',
              values: ['modif1', 'modif2', 'modif3']
            }]
          }
        };
        this.serviceTypes = {
          checkAmmo: {
            name: 'checkAmmo',
            icon: 'check'
          }
        };

        this.decoratorTypes = {
          hasAmmo: {
            name: 'hasAmmo',
            icon: 'battery-full'
          },
          isAwake: {
            name: 'isAwake',
            icon: 'bell'
          }
        };

        function compileDescriptions(typeDict) {
          for (let typeName in typeDict) {
            if (typeDict.hasOwnProperty(typeName)) {
              let type = typeDict[typeName];
              if (type.description) {
                type.description = $interpolate(type.description);
              }
            }
          }
        }

        //compile all descriptions
        compileDescriptions(this.nodeTypes);
        compileDescriptions(this.serviceTypes);
        compileDescriptions(this.decoratorTypes);
      }

      getNodeTypeDesc(name) {
        let nodeType = this.nodeTypes[name];
        if (!nodeType) {
          throw new Error(`Unknown nodeType "${name}"`);
        }
        return nodeType;
      }

      getServiceTypeDesc(name) {
        let serviceType = this.serviceTypes[name];
        if (!serviceType) {
          throw new Error(`Unknown serviceType "${name}"`);
        }
        return serviceType;
      }

      getDecoratorTypeDesc(name) {
        let decoratorType = this.decoratorTypes[name];
        if (!decoratorType) {
          throw new Error(`Unknown decoratorType "${name}"`);
        }
        return decoratorType;
      }
    });
