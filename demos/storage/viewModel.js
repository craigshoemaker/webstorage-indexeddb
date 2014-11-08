(function (window, localDataService) {
    
    'use strict';

    var
        $msg,
        $addressBox,
        $cityBox,
        $stateBox,
        $zipcodeBox,
        $commentsBox,
        $addHomeButton,
        $addHomeForm,
        $storageStrategyRadio,

        storageStrategyKey = 'storage-strategy',
        key = 'bb89dd99-0817-4a4f-b74b-1c440831ae25';


    $('input:radio[name=storage-strategy]').click(function () {

        var strategyValue = $(this).val();

        localDataService.setStorageStrategy(window.localStorage);

        localDataService.save(storageStrategyKey, { value: strategyValue });

        if (strategyValue == localDataService.storageStrategyTypes.sessionStorage) {

            strategy = window.sessionStorage;

        } else {

            strategy = window.localStorage;

        }

        localDataService.setStorageStrategy(strategy);

        vm.fillFormWithSavedHomeInfo();

    });

    var vm = {

        showSavedMessage: function () {

            $msg.text('Saved');

            $msg.fadeIn(function () {
                setTimeout(function () {
                    $msg.fadeOut();
                }, 1500);
            });
        },

        createHome: function () {
            return {
                address: $addressBox.val(),
                city: $cityBox.val(),
                state: $stateBox.val(),
                zipcode: $zipcodeBox.val(),
                comments: $commentsBox.val()
            };
        },

        save: function () {
            var home = vm.createHome();
            localDataService.save(key, home);
            vm.showSavedMessage();
        },

        fillFormWithSavedHomeInfo: function () {

            var home = localDataService.get(key);

            if (home !== null) {
                $addressBox.val(home.address);
                $cityBox.val(home.city);
                $stateBox.val(home.state);
                $zipcodeBox.val(home.zipcode);
                $commentsBox.val(home.comments);
            } else {
                $addHomeForm.get(0).reset();
            }
        },

        scheduleAutoSave: function () {
            var tenSeconds = 10000;

            var interval = setInterval(function () {

                vm.save();

            }, tenSeconds);
        },

        init: function () {

            $msg = $('#msg');

            $addressBox = $('#address-box');
            $cityBox = $('#city-box');
            $stateBox = $('#state-box');
            $zipcodeBox = $('#zipcode-box');
            $commentsBox = $('#comments-box');
            $addHomeButton = $('#add-home-button');
            $addHomeForm = $('#add-home-form');
            $storageStrategyRadio = $('input:radio[name=storage-strategy]');


            localDataService.setStorageStrategy(window.localStorage);

            if (localDataService.exists(storageStrategyKey)) {
                var strat = localDataService.get(storageStrategyKey);

                if (strat.value == localDataService.storageStrategyTypes.sessionStorage) {
                    strategy = window.sessionStorage;
                } else {
                    strategy = window.localStorage;
                }

                localDataService.setStorageStrategy(strategy);

                $storageStrategyRadio.filter(
                    '[value=' + strat.value + ']').prop('checked', true);
            }

            vm.fillFormWithSavedHomeInfo();

            vm.scheduleAutoSave();
        }
    };

    $(function () {

        //window.localStorage.clear();
        //window.sessionStorage.clear();

        vm.init();

    });
})(window, window.localDataService);