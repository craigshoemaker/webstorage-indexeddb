(function (window) {
    
    'use strict';

    var _storage = window.localStorage;

    var _ds = {

        storageStrategyTypes: {
            localStorage: 0,
            sessionStorage: 1
        },

        setStorageStrategy: function (strategy) {
            _storage = strategy;
        },

        exists: function (key) {
            return _storage[key] !== undefined;
        },

        get: function (key) {

            var
                returnValue = null,
                value;

            if (_ds.exists(key)) {

                value = _storage[key];

                try {

                    returnValue = JSON.parse(value);

                } catch (e) {

                    if (e.constructor.name === 'SyntaxError') {

                        returnValue = value;

                    }

                }

            }

            return returnValue;
        },

        save: function (key, value) {

            if (typeof value === 'object') {

                _storage[key] = JSON.stringify(value);

            } else {

                _storage[key] = value;

            }

        }
    };
    
    window.localDataService = _ds;

})(window);