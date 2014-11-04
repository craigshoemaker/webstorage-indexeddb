var localDatabase = (function () {

    var _err = {

        publisher: null,

        setErrorPublisher: function (publisherCallback) {

            _err.publisher = publisherCallback;

        },

        publishError: function (msg) {

            if (_err.publisher) {

                _err.publisher(msg);

            } else {

                console.warn(msg);

            }

        },

        defaultErrorHandler: function (e) {
            _err.publishError(e);
        },

        getFailHandler: function (fail) {
            return (fail === undefined) ? _err.defaultErrorHandler : fail;
        },

        setDefaultErrorHandler: function (request, customFailHandler) {

            customFailHandler = _err.getFailHandler(customFailHandler);

            if (typeof request !== 'undefined') {

                if ('onerror' in request) {
                    request.onerror = customFailHandler;
                }

                if ('onblocked' in request) {
                    request.onblocked = customFailHandler;
                }

                if ('onabort' in request) {
                    request.onabort = customFailHandler;
                }

            }

        }
    };

    var _db = {

        instance: null,

        transactionTypes: {
            readonly: 'readonly',
            readwrite: 'readwrite'
        },

        createUUID: function () {

            // from http://bit.ly/HkAnFi

            // http://www.ietf.org/rfc/rfc4122.txt
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";

            var uuid = s.join("");
            return uuid;

        },

        createPersistentObject: function () {
            return {
                clientId: _db.createUUID(),
                insertDate: null,
                modifiedDate: null
            };
        },

        deleteDatabase: function (databaseModel, success, fail) {

            if (_db.instance !== null && 'close' in _db.instance) {

                _db.instance.close();

            }

            var deleteRequest = indexedDB.deleteDatabase(databaseModel.name);

            _err.setDefaultErrorHandler(deleteRequest, fail);

            deleteRequest.onsuccess = function (e) {

                _db.instance = null;

                success(e);

            };

        },

        open: function (databaseModel, success, fail) {

            var openRequest = window.indexedDB.open(databaseModel.name, databaseModel.version);

            _err.setDefaultErrorHandler(openRequest, fail);

            openRequest.onupgradeneeded = databaseModel.upgrade;

            openRequest.onsuccess = function (e) {
                _db.instance = e.target.result;
                success(e);
            };

        },

        getAll: function (objectStoreName, success, fail) {

            fail = _err.getFailHandler(fail);

            if (_db.instance === null) {

                fail('You cannot read data from a store when the database is not open. Store name: ' + objectStoreName);
                return;
            }

            var transaction = _db.instance.transaction([objectStoreName], _db.transactionTypes.readonly);

            _err.setDefaultErrorHandler(transaction, fail);

            var store = transaction.objectStore(objectStoreName);

            var countRequest = store.count();

            _err.setDefaultErrorHandler(countRequest, fail);

            var data = [];

            countRequest.onsuccess = function (countEventArgs) {

                var totalCount = countEventArgs.target.result;

                cursorRequest = store.openCursor();

                _err.setDefaultErrorHandler(cursorRequest, fail);

                cursorRequest.onsuccess = function (cursorEventArgs) {

                    var result, item;

                    result = cursorEventArgs.target.result;

                    if (result !== null) {

                        item = result.value;

                        data.push(item);

                        if (data.length === totalCount) {
                            success(data);
                        } else {
                            result.continue();
                        }
                    } else {
                        success(data);
                    }

                };
            };


        },

        insert: function (objectStoreName, data, success, fail) {

            fail = _err.getFailHandler(fail);

            if (_db.instance === null) {

                fail('You cannot add data to a store when the database is not open. Store name: ' + objectStoreName);
                return;
            }

            var transaction = _db.instance.transaction([objectStoreName], _db.transactionTypes.readwrite);

            _err.setDefaultErrorHandler(transaction, fail);

            var store = transaction.objectStore(objectStoreName);

            var date = new Date();
            data.insertDate = date;
            data.modifiedDate = date;

            var insertRequest = store.add(data);

            _err.setDefaultErrorHandler(insertRequest, fail);

            insertRequest.onsuccess = success;
        },

        "delete": function (objectStoreName, key, success, fail) {

            fail = _err.getFailHandler(fail);

            if (_db.instance === null) {

                fail('You cannot delete data from a store when the database is not open. Store name: ' + objectStoreName);
                return;
            }

            var transaction = _db.instance.transaction([objectStoreName], _db.transactionTypes.readwrite);

            _err.setDefaultErrorHandler(transaction, fail);

            var store = transaction.objectStore(objectStoreName);

            var deleteRequest = store.delete(key);

            _err.setDefaultErrorHandler(deleteRequest, fail);

            deleteRequest.onsuccess = success;

        },

        update: function (objectStoreName, data, key, success, fail) {

            fail = _err.getFailHandler(fail);

            if (_db.instance === null) {

                fail('You cannot update data in a store when the database is not open. Store name: ' + objectStoreName);
                return;
            }

            var transaction = _db.instance.transaction([objectStoreName], _db.transactionTypes.readwrite);

            _err.setDefaultErrorHandler(transaction, fail);

            var store = transaction.objectStore(objectStoreName);

            var getRequest = store.get(key);

            _err.setDefaultErrorHandler(getRequest, fail);

            getRequest.onsuccess = function (e) {

                var origData = e.target.result;

                if (origData !== undefined) {

                    data.insertDate = origData.insertDate;

                    data.modifiedDate = new Date();

                    var updateRequest = store.put(data);

                    _err.setDefaultErrorHandler(updateRequest, fail);

                    updateRequest.onsuccess = function (e) {

                        success(data, e);

                    };

                }
            };

        },

        getById: function (objectStoreName, key, success, fail) {

            fail = _err.getFailHandler(fail);

            if (_db.instance === null) {

                fail('You cannot get data from a store when the database is not open. Store name: ' + objectStoreName);
                return;
            }

            var transaction = _db.instance.transaction([objectStoreName], _db.transactionTypes.readonly);

            _err.setDefaultErrorHandler(transaction, fail);

            var store = transaction.objectStore(objectStoreName);

            var getRequest = store.get(key);

            _err.setDefaultErrorHandler(getRequest, fail);

            getRequest.onsuccess = success;

        }

    };

    return {

        // error handling
        setDefaultErrorHandler: _err.setDefaultErrorHandler,
        setErrorPublisher: _err.setErrorPublisher,

        // object creation
        createUUID: _db.createUUID,
        createPersistentObject: _db.createPersistentObject,

        // data access
        deleteDatabase: _db.deleteDatabase,

        open: _db.open,
        getAll: _db.getAll,
        insert: _db.insert,
        "delete": _db.delete,
        update: _db.update,
        getById: _db.getById

    };

})();