'use strict';

window.owlBtMocks = window.owlBtMocks || {};

window.owlBtMocks.createProjectModelMock = function() {
  return {
    getNodeTypeDesc: type => type,
    getDecoratorTypeDesc: type => type,
    getServiceTypeDesc: type => type
  };
};
