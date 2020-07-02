const jQuery = require('jquery');
Object.defineProperty(window, 'jQuery', { value: jQuery });
Object.defineProperty(window, '$', { value: jQuery });
require('../src/client/index');
require('angular-mocks');

require('../__mocks__/projectStore.service.mock.js');
require('../__mocks__/treeStore.service.mock.js');