'use strict';

(function () {

    class PropertyValidator {
        constructor(_) {
            this._ = _;
        }

        isValid(value, propertyDesc, customTypeDesc) {
            if (this._.isNil(value)) {
                return true;
            }
            if (customTypeDesc) {
                if (customTypeDesc.pattern) {
                    return this._patternIsValid(value, customTypeDesc.pattern);
                }
            } else {
                if (propertyDesc.type === 'number') {
                    return this._minMaxIsValid(value, propertyDesc);
                }
            }

            return true;
        }

        _patternIsValid(value, pattern) {
            var regex = new RegExp(`^${pattern}$`);
            return regex.test(value);
        }

        _minMaxIsValid(value, propertyDesc) {
            if (!_.isNil(propertyDesc.min) && value < propertyDesc.min) {
                return false;
            }
            if (!_.isNil(propertyDesc.max) && value > propertyDesc.max) {
                return false;
            }
            return true;
        }
    }

    angular.module('editorApp')
        .service('PropertyValidator', PropertyValidator);
})();
