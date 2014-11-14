/// <reference path="db.js"/>

(function (window, Modernizr, localDatabase, homesDBModel) {

    'use strict';

    var vm = {

        homes: ko.observableArray(),
        address: ko.observable(''),
        city: ko.observable(''),
        state: ko.observable(''),
        zip: ko.observable(''),
        comments: ko.observable(''),
        clientId: ko.observable(''),
        buttonLabel: ko.observable('Add'),







        errorHandler: function (error) {
            console.log(error);
            alert('Error');
            debugger;
        },







        init: function () {

            localDatabase.open(homesDBModel).then(function (e) {
                var store = homesDBModel.stores.homes;
                localDatabase.getAll(store.name).then(function (e) {
                    vm.homes(e);
                }, vm.errorHandler);
            });

        },







        getHome: function () {
            return {
                address: vm.address(),
                city: vm.city(),
                state: vm.state(),
                zip: vm.zip(),
                comments: vm.comments(),
                clientId: vm.clientId()
            };
        },







        save: function () {

            var storeName = homesDBModel.stores.homes.name;
            var keyName = homesDBModel.stores.homes.key.keyPath;
            var currentHome = vm.getHome();
            var keyValue = currentHome.clientId;

            if (vm.clientId().length > 0) {

                var index = vm.homes().map(function (home) {
                    return home.clientId;
                }).indexOf(currentHome.clientId);

                localDatabase.update(storeName, currentHome, currentHome.clientId).then(function (home, e) {
                    vm.homes.replace(vm.homes()[index], home);
                    vm.clear();
                }, vm.errorHandler);

            } else {
                localDatabase.insert(storeName, currentHome, keyName).then(function (e) {
                    vm.homes.push(currentHome);
                    vm.clear();
                }, vm.errorHandler);
            }
        },







        clear: function () {
            vm.address('');
            vm.city('');
            vm.state('');
            vm.zip('');
            vm.comments('');
            vm.clientId('');

            vm.buttonLabel('Add');
        },







        'delete': function (obj, e) {

            var key = e.currentTarget.getAttribute('data-id');
            var storeName = homesDBModel.stores.homes.name;

            localDatabase.delete(storeName, key).then(function (e) {
                vm.homes.remove(obj);
                vm.clear();
            }, vm.errorHandler);
        },







        select: function (obj, e) {

            var key = e.currentTarget.getAttribute('data-id');
            var store = homesDBModel.stores.homes;

            localDatabase.getById(store.name, key).then(function (e) {

                var home = e.target.result;

                if (home !== null) {

                    vm.address(home.address);
                    vm.city(home.city);
                    vm.state(home.state);
                    vm.zip(home.zip);
                    vm.comments(home.comments);

                    vm.clientId(home.clientId);

                    vm.buttonLabel('Update');
                }
            }, vm.errorHandler);
        }

    };







    $(function () {

        if (!Modernizr.indexeddb) {

            $('#unsupported').fadeIn();

        } else {

            ko.applyBindings(vm);

            vm.init();

        }

    });







    window.app = window.app || {};
    window.app.viewModel = vm;

}(window, window.Modernizr, window.app.localDatabase, window.app.homesDBModel));