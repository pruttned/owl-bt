'use strict';

describe('Service: ProjectStore', () => {

  // load the service's module
  beforeEach(() => angular.mock.module('editorApp'));

  // instantiate service
  let ProjectStore;
  beforeEach(() => inject(_ProjectStore_ => {
    ProjectStore = _ProjectStore_;
  }));

  describe('_compileProject', () => {
    it('should compile project with inheritance', () => {
      const prj = {
        nodes: [
          {
            name: 'node1',
            icon: 'icon1',
            base: 'base-node1',
            isComposite: true,
            properties: [
              {
                name: 'TargetBlackboardKey',
                default: 'yy',
                type: 'string'
              },
              {
                name: 'Speed',
                default: -1.0,
                type: 'number'
              }
            ]
          },
          {
            name: 'base-node1',
            icon: 'base-icon1',
            isComposite: true,
            isAbstract: true,
            properties: [
              {
                name: 'Prop1',
                default: 'xx',
                type: 'string'
              },
              {
                name: 'Speed',
                default: 22,
                type: 'number'
              }
            ]
          },
          {
            name: 'node2',
            icon: 'icon2',
            base: 'base-node1'
          },
          {
            name: 'node3',
            icon: 'icon3'
          },
          {
            name: 'base-node2',
            isAbstract: true,
            isComposite: false,
            icon: 'car',
            properties: [
              {
                'name': 'baseProp1',
                'default': 'x',
                'type': 'string'
              },
              {
                'name': 'baseProp2',
                'default': 'y',
                'type': 'string'
              }
            ]
          },
          {
            name: 'base-node3',
            isAbstract: true,
            icon: 'plane',
            properties: [
              {
                'name': 'baseProp2',
                'default': 2,
                'type': 'number'
              },
              {
                'name': 'baseProp3',
                'default': 'z',
                'type': 'string'
              },
              {
                'name': 'baseProp4',
                'default': 'w',
                'type': 'string'
              }
            ]

          },
          {
            name: 'node4',
            base: ['base-node2', 'base-node3'],
            properties: [
              {
                'name': 'baseProp3',
                'default': 'xy',
              },
              {
                'name': 'baseProp4',
                'default': 'zw',
                'type': 'string'
              }
            ]
          }
        ]
      };
      ProjectStore._compileProject(prj);

      expect(Object.keys(ProjectStore.nodeTypeDescs).length).toBe(4);

      const node1 = ProjectStore.nodeTypeDescs['node1'];
      expect(node1.name).toBe('node1');
      expect(node1.icon).toBe('icon1');
      expect(node1.isComposite).toBe(true);
      expect(node1.properties).toEqual([
        {
          'name': 'Prop1',
          'default': 'xx',
          'type': 'string'
        },
        {
          'name': 'Speed',
          'default': -1,
          'type': 'number'
        },
        {
          'name': 'TargetBlackboardKey',
          'default': 'yy',
          'type': 'string'
        },
      ]);

      const node2 = ProjectStore.nodeTypeDescs['node2'];
      expect(node2.name).toBe('node2');
      expect(node2.icon).toBe('icon2')
      expect(node2.properties).toEqual([
        {
          'name': 'Prop1',
          'default': 'xx',
          'type': 'string'
        },
        {
          'name': 'Speed',
          'default': 22,
          'type': 'number'
        }
      ]);

      const node3 = ProjectStore.nodeTypeDescs['node3'];
      expect(node3.name).toBe('node3');
      expect(node3.icon).toBe('icon3');
      expect(node3.isComposite).toBeFalsy();
      expect(node3.properties).toBeUndefined();

      const node4 = ProjectStore.nodeTypeDescs['node4'];
      expect(node4.name).toBe('node4');
      expect(node4.icon).toBe('plane');
      expect(node4.isAbstract).toBeUndefined();
      expect(node4.properties).toEqual([
        {
          'name': 'baseProp1',
          'default': 'x',
          'type': 'string'
        },
        {
          'name': 'baseProp2',
          'default': 2,
          'type': 'number'
        },
        {
          'name': 'baseProp3',
          'default': 'xy',
          'type': 'string'
        },
        {
          'name': 'baseProp4',
          'default': 'zw',
          'type': 'string'
        }
      ]);
    });
  });
});
