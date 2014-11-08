require([
    "jquery",
    "knockout-3.0.0",
    "bootstrap",
    "underscore",
    "jsonParser",
    "layoutMaster",
    "jquery.mockjson",
    "result",
    "modernizr-2.6.2",
    "rainbow-custom.min"], 
    function ($, ko) {
        
        window.ko = ko;

        $(function () {

            if ($('#result-stub')[0] !== undefined) {
                $('article').append('' +
                    '<div class="row">' +
                    '    <div class="col-sm-7">' +
                    '        <ul class="nav nav-tabs" id="steps"></ul>' +
                    '        <div id="elements"></div>' +
                    '        <div id="tab-content-container" class="tab-content"></div>' +
                    '        <button class="btn-lg pull-right" id="run-button">Run <i class="icon-play"></i></button>' +
                    '        <div id="clear-button-container" class="pull-right"><a href="#" id="clear-button">Clear</a></div>' +
                    '    </div>' +
                    '    <div id="result-container" class="col-sm-5">' +
                    '        <h5 class="muted">Result</h5>' +
                    '    </div>' +
                    '</div>');
            }

            util.resetUI();

            var
                blocks = $('script[data-step]'),
                steps = $('#steps'),
                step = 1,
                className = '',
                label = '',
                tabContentContainer = $('#tab-content-container'),
                aliasContainer = $('#aliasContainer'),
                titleElement = $('meta[name="title"]'),
                title = titleElement.attr('content'),
                nolink = titleElement.attr('data-nolink'),
                urlHash = titleElement.attr('data-urlhash'),
                elements = $('#elements'),
                aliasList = $('meta[name="alias"]').attr('content'),
                listingOnlyMessage = '<h4 class="text-info"><i class="fa fa-info-circle"></i> This code listing is for explanation purposes only and does not produce a value.</h4>',

                changeStep = function (step) {
                    var code, container, lines;

                    if (!step) {
                        _commands.currentStep++;
                    } else {
                        _commands.currentStep = step;
                    }

                    code = $('script[data-step="' + _commands.currentStep + '"]').text();
                    code = code.split('//---')[1];
                    lines = code.split('\n');

                    for (var i = 0; i < lines.length; i++) {
                        lines[i] = lines[i].replace(/                /, '');
                    }

                    code = lines.join('\n') + '\n';

                    Rainbow.color(code, 'javascript', function (result) {
                        container = $('code#code-step' + _commands.currentStep).html(result);
                    });
                };

            _.each(blocks, function (element, index, list) {
                className = step === 1 ? 'active' : '';
                label = element.getAttribute('data-label');

                var isListingOnly = element.getAttribute('data-listingonly');
                var title = element.getAttribute('title');

                title = title ? title : '';

                if (isListingOnly) {
                    label = '<span class="info" title="' + title + '">' + label + ' <i class="fa fa-info-circle"></i></span>';
                } else {
                    label = '<span title="' + title + '">' + label + '</span>';
                }

                steps.append('<li class="' +
                    className + '"><a href="#step' +
                    step + '" data-toggle="tab" data-step="' +
                    step + '">' + label + '</li>');

                tabContentContainer.append('' +
                    '<div class="tab-pane ' +
                    className + '" id="step' +
                    step + '"><pre>' +
                    '<code id="code-step' +
                    step + '" data-language="javascript"></code></pre></div>');

                step++;
            });

            var runCurrentStep = function () {
                util.clear();
                var scriptBlock = $('script[data-step=' + _commands.currentStep + ']');
                if (scriptBlock.attr('data-listingonly')) {
                    util.logRaw(listingOnlyMessage);
                } else {
                    _commands['step' + _commands.currentStep]();
                }
            };

            if (typeof (_commands) !== "undefined") {

                changeStep();

                if (_commands.executeOnLoad) {
                    runCurrentStep();
                }

                if (_commands.hideCommandButtons) {
                    $('#run-button, #clear-button-container').hide();
                }
            }

            $('#run-button').click(function () {
                runCurrentStep();
            });

            $('#clear-button').click(function (e) {
                e.preventDefault();
                util.clear();
                return false;
            });

            $('#steps a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
            })

            $('#steps a[data-step]').click(function () {
                var step = parseInt(this.getAttribute('data-step'), 10);
                changeStep(step);
                util.clear();
                elements.html('');
            });

            $('article').fadeIn();

            if (typeof demoLoad == 'function') {
                demoLoad();
            }
        });
    });