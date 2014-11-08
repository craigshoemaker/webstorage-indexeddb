(function (window) {
    
    'use strict';

    var model = {
        name: 'HomesDemoDB',
        version: 1,
        stores: {
            homes: {
                name: 'homes',
                key: { keyPath: 'clientId' },
                indexes: {
                    city: {
                        name: 'city',
                        definition: { unique: false }
                    }
                }
            }
        },

        upgrade: function (e) {

            var newVersion = e.target.result;
            var storeModel = model.stores.homes;
            var indexModel = storeModel.indexes.city;
            var homesStore;

            if (!newVersion.objectStoreNames.contains(storeModel.name)) {

                homesStore = newVersion.createObjectStore(storeModel.name,
                                                            storeModel.key);

                homesStore.createIndex(indexModel.name,
                                        indexModel.name,
                                        indexModel.definition);
            }
        }
    };

    window.app = window.app || {};
    window.app.homesDBModel = model;

}(window));