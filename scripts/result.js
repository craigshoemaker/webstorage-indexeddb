var $$result = (function () {

    var _result = {};

    _result.logRaw = function (contents) {
        $('#result').append(contents);
    };

    _result.log = function (contents) {

        if (_.isArray(contents)) {
            _.each(contents, function (e, i, l) {
                _result.log(e);
            });
        } else {
            if (_.isObject(contents)) {
                _result.logObject(contents);
            } else {
                console.log(contents.toString().replace(/(<([^>]+)>)/ig, ""));
                _result.logRaw('<li>' + contents + '</li>');
            }
        }

    };

    _result.logObject = function (obj) {

        console.dir(obj);

        var
            keys = _.keys(obj),
            i = 0,
            markup = '<p class="code">{<br />';

        _.each(obj, function (value, key, list) {
            markup += ' &nbsp;&nbsp;&nbsp;&nbsp;' + key + ': ' + '&quot;' + value + '&quot;';
            markup += (i === keys.length - 1) ? '<br/>' : ', <br />';
            i++
        });

        markup += '}</p>'

        _result.logRaw(markup);
    };

    _result.hr = function () {
        _result.logRaw('<hr />');
    };

    _result.logBold = function (contents, contents2) {
        if (contents2) {
            _result.logRaw('<br /><b>' + contents + ': </b>' + contents2);
        } else {
            _result.logRaw('<br /><b>' + contents + '</b>');
        }
    };

    // Utility functions..

    _result.existingElements = null;

    _result.resetUI = function () {

        if (_result.existingElements === null) {
            _result.existingElements = $('#result-stub');
            _result.existingElements.detach();
        }

        var markup = _result.existingElements;

        if (markup[0] !== undefined) {
            markup = markup.clone();
            markup = markup[0].outerHTML;
            markup = $(markup);
            markup = markup.removeClass('hidden').attr('id', 'result');
            markup = markup[0].outerHTML;
            $('#result-container').append(markup);
        }
    };

    _result.clear = function () {
        $('#result').remove();
        $('#elements').html('');
        _result.resetUI();
    };

    return {
        resetUI: _result.resetUI,
        clear: _result.clear,
        log: _result.log,
        hr: _result.hr,
        logRaw: _result.logRaw,
        logBold: _result.logBold
    };
})();