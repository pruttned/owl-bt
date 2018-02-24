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
        ]
      };
      ProjectStore._compileProject(prj);

      expect(Object.keys(ProjectStore.nodeTypeDescs).length).toBe(3);

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
    });
  });
});
