'use strict';

describe('Service: ProjectStore', () => {

  // load the service's module
  beforeEach(module('editorApp'));

  // instantiate service
  let ProjectStore;
  beforeEach(inject(_ProjectStore_ => {
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
            icon: "car",
            properties: [
              {
                "name": "baseProp1",
                "default": "x",
                "type": "string"
              },
              {
                "name": "baseProp2",
                "default": "y",
                "type": "string"
              }
            ]
          },
          {
            name: 'base-node3',
            isAbstract: true,
            icon: 'plane',
            properties: [
               {
                 "name": "baseProp3",
                 "default": "z",
                 "type": "string"
               },
               {
                 "name": "baseProp4",
                 "default": "w",
                 "type": "string"
               }
             ]

          },
          {
            name: 'node4',
            base: ['base-node2', 'base-node3'],
            properties: [
              {
                "name": "baseProp3",
                "default": "xy",
                "type": "string"
              },
              {
                "name": "baseProp4",
                "default": "zw",
                "type": "string"
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
      expect(node1.properties.length).toBe(3);
      expect(node1.properties[0].name).toBe('Prop1');
      expect(node1.properties[0].default).toBe('xx');
      expect(node1.properties[0].type).toBe('string');
      expect(node1.properties[1].name).toBe('Speed');
      expect(node1.properties[1].default).toBe(-1);
      expect(node1.properties[1].type).toBe('number');
      expect(node1.properties[2].name).toBe('TargetBlackboardKey');
      expect(node1.properties[2].default).toBe('yy');
      expect(node1.properties[2].type).toBe('string');

      const node2 = ProjectStore.nodeTypeDescs['node2'];
      expect(node2.name).toBe('node2');
      expect(node2.icon).toBe('icon2');
      expect(node2.isComposite).toBe(true);
      expect(node2.properties.length).toBe(2);
      expect(node2.properties[0].name).toBe('Prop1');
      expect(node2.properties[0].default).toBe('xx');
      expect(node2.properties[0].type).toBe('string');
      expect(node2.properties[1].name).toBe('Speed');
      expect(node2.properties[1].default).toBe(22);
      expect(node2.properties[1].type).toBe('number');

      const node3 = ProjectStore.nodeTypeDescs['node3'];
      expect(node3.name).toBe('node3');
      expect(node3.icon).toBe('icon3');
      expect(node3.isComposite).toBeFalsy();
      expect(node3.properties).toBeUndefined();

      const node4 = ProjectStore.nodeTypeDescs['node4'];
      expect(node4.name).toBe('node4');
      expect(node4.icon).toBe('plane');
      expect(node4.isAbstract).toBeUndefined();
      expect(node4.properties).toBeDefined();
      expect(node4.properties.length).toBe(4);
      expect(node4.properties[0].name).toBe('baseProp1');
      expect(node4.properties[0].default).toBe('x');
      expect(node4.properties[1].name).toBe('baseProp2');
      expect(node4.properties[1].default).toBe('y');
      expect(node4.properties[2].name).toBe('baseProp3');
      expect(node4.properties[2].default).toBe('xy');
      expect(node4.properties[3].name).toBe('baseProp4');
      expect(node4.properties[3].default).toBe('zw');
    });
  });
});
