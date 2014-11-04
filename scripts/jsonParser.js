var jsonParser = (function() {
    var parser = {
        // reviver syntax: http://www.json.org/js.html
        parse: function(data) {
            var
                parseWithReviver = function(d) {
                    return JSON.parse(d, function(key, value) {
                        var type;
                        if (value && typeof value === 'object') {
                            type = value.type;
                            if (typeof type === 'string' &&
                                typeof window[type] === 'function') {
                                return new (window[type])(value);
                            }
                        }
                        return value;
                    });
                },

                isArray = Array.isArray || function(obj) {
                    return toString.call(obj) == '[object Array]';
                };

            var result = parseWithReviver(data);

            if (isArray(result)) {
                for (var i = 0, len = result.length; i < len; i++) {
                    if (typeof v === 'string') {
                        result[i] = parseWithReviver(v);
                    }
                }
            }

            return result;
        }
    };

    return {
        parse: parser.parse
    };
})();