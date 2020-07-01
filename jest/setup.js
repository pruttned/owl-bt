const jQuery = require('jquery');
Object.defineProperty(window, 'jQuery', { value: jQuery });
Object.defineProperty(window, '$', { value: jQuery });
require('../src/client/index');
require('angular-mocks');