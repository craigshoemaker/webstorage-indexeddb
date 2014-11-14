window.indexedDB =      window.indexedDB ||
                        window.mozIndexedDB ||
                        window.webkitIndexedDB ||
                        window.msIndexedDB;

window.IDBTransaction = window.IDBTransaction ||
                        window.webkitIDBTransaction ||
                        window.msIDBTransaction;

window.IDBKeyRange =    window.IDBKeyRange ||
                        window.webkitIDBKeyRange ||
                        window.msIDBKeyRange;

(function (indexedDB, Q) {

    'use strict';

    var util = {
        log: function (msg) {
            if (typeof console !== 'undefined' && console) {
                console.log(msg);
            }
        }
    };

    var db = {

        instance: null,

        transactionTypes: {
            readonly: 'readonly',
            readwrite: 'readwrite'
        },

        setErrorHandlers: function (request, errorHandler) {
            if (typeof request !== 'undefined' && request !== null) {
                if ('onerror' in request) request.onerror = errorHandler;
                if ('onblocked' in request) request.onblocked = errorHandler;
                if ('onabort' in request) request.onabort = errorHandler;
            }
        },







        open: function (databaseModel) {

            var deferred = Q.defer();
            var request = indexedDB.open(databaseModel.name, databaseModel.version);

            db.setErrorHandlers(request, deferred.reject);

            request.onupgradeneeded = databaseModel.upgrade;

            request.onsuccess = function (e) {

                util.log(databaseModel.name + ' is open');
                
                db.instance = e.target.result;
                db.setErrorHandlers(db.instance, deferred.reject);
                deferred.resolve();
            };

            return deferred.promise;
        },







        deleteDatabase: function (databaseModel, success, fail) {

            if (db.instance !== null && 'close' in db.instance) {

                db.instance.close();

            }

            var request = indexedDB.deleteDatabase(databaseModel.name);
            var deferred = Q.defer();

            db.setErrorHandlers(request, deferred.reject);

            request.onsuccess = function (e) {

                db.instance = null;

                util.log(databaseModel.name + 'is deleted');

                deferred.resolve(e);

            };

        },







        requireOpenDB: function (objectStoreName, deferred) {
            if (db.instance === null) {
                deferred.reject('You cannot use an object store when the database is not open. Store name: ' + objectStoreName);
            }
        },







        requireObjectStoreName: function (objectStoreName, deferred) {
            if (typeof (objectStoreName) === 'undefined' ||
                !objectStoreName ||
                objectStoreName.length === 0) {
                deferred.reject('An object store name is required');
            }
        },







        getObjectStore: function (objectStoreName, mode) {

            var mode = mode || db.transactionTypes.readonly;
            var txn = db.instance.transaction(objectStoreName, mode);
            var store = txn.objectStore(objectStoreName);

            return store;
        },







        getCount: function (objectStoreName) {

            var deferred = Q.defer();

            db.requireObjectStoreName(objectStoreName, deferred);
            db.requireOpenDB(objectStoreName, deferred);

            var store = db.getObjectStore(objectStoreName);
            var request = store.count();
            var count;

            request.onsuccess = function (e) {
                count = e.target.result;
                deferred.resolve(count);
            };

            return deferred.promise;
        },







        getAll: function (objectStoreName) {

            var deferred = Q.defer();

            db.requireObjectStoreName(objectStoreName, deferred);
            db.requireOpenDB(objectStoreName, deferred);

            var store = db.getObjectStore(objectStoreName);
            var cursor = store.openCursor();
            var data = [];

            cursor.onsuccess = function (e) {

                var result = e.target.result;

                if (result && result !== null) {
                    data.push(result.value);
                    result.continue();
                } else {
                    deferred.resolve(data);
                }
            };

            return deferred.promise;

        },







        insert: function (objectStoreName, data, keyName) {

            var deferred = Q.defer();

            db.requireObjectStoreName(objectStoreName, deferred);
            db.requireOpenDB(objectStoreName, deferred);

            var store = db.getObjectStore(objectStoreName, db.transactionTypes.readwrite);
            var request;

            var date = new Date();
            data.insertDate = date;
            data.modifiedDate = date;

            if (!data[keyName]) {
                data[keyName] = Math.uuidCompact();
            }

            request = store.add(data);

            request.onsuccess = function () {
                deferred.resolve(data);
            };

            return deferred.promise;
        },







        'delete': function (objectStoreName, key) {

            var deferred = Q.defer();

            db.requireObjectStoreName(objectStoreName, deferred);
            db.requireOpenDB(objectStoreName, deferred);

            var store = db.getObjectStore(objectStoreName, db.transactionTypes.readwrite);
            var request = store.delete(key);

            request.onsuccess = deferred.resolve;

            return deferred.promise;

        },







        update: function (objectStoreName, data, key) {

            var deferred = Q.defer();

            db.requireObjectStoreName(objectStoreName, deferred);
            db.requireOpenDB(objectStoreName, deferred);

            var store = db.getObjectStore(objectStoreName, db.transactionTypes.readwrite);
            var getRequest = store.get(key);
            var updateRequest;

            getRequest.onsuccess = function (e) {

                var origData = e.target.result;

                if (origData !== undefined) {

                    data.insertDate = origData.insertDate;

                    data.modifiedDate = new Date();

                    updateRequest = store.put(data);

                    updateRequest.onsuccess = function (e) {
                        deferred.resolve(data, e);
                    };
                }
            };

            return deferred.promise;

        },







        getById: function (objectStoreName, key) {

            var deferred = Q.defer();

            db.requireObjectStoreName(objectStoreName, deferred);
            db.requireOpenDB(objectStoreName, deferred);

            var store = db.getObjectStore(objectStoreName);
            var request = store.get(key);

            request.onsuccess = deferred.resolve;

            return deferred.promise;
        },







        clear: function (objectStoreName) {

            var deferred = Q.defer();

            db.requireObjectStoreName(objectStoreName, deferred);
            db.requireOpenDB(objectStoreName, deferred);

            var store = db.getObjectStore(objectStoreName, db.transactionTypes.readwrite);
            var request = store.clear();

            request.onsuccess = deferred.resolve;

            return deferred.promise;
        }







    };

    window.app = window.app || {};
    window.app.localDatabase = db;

}(window.indexedDB, window.Q));