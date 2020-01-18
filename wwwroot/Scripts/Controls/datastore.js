/*
 * Wrapper for ejDataManager
 * popup from grid which allows for add/edit
 */
class DataStore {
    constructor(args) {
        this.getUrl = args.getUrl;

        if (args.insertUrl) {
            this.insertUrl = args.insertUrl;
        }
        if (args.updateUrl) {
            this.updateUrl = args.updateUrl;
        }
        if (args.deleteUrl) {
            this.deleteUrl = args.deleteUrl;
        }

        if (args.onBind) {
            this.onBind = args.onBind;
        }

        if (args.afterSave) {
            this.afterSave = args.afterSave;
        }

        var tParams = [];

        if (args.params) { // todo allow multiple params
            if (Array.isArray(args.params)) {
                tParams = args.params; //{ name: args.params.name, value: args.params.value };
            }
            else {
                tParams = [{ name: args.params.name, value: args.params.value }];
            }
        }

        this.params = tParams; 

        this.data = [];

        // set up datamanager for insert/update
        this.dataManager = ej.DataManager({
            dataSource: this.data, // todo get this to work properly
            adaptor: new ej.WebMethodAdaptor(), //ej.remoteSaveAdaptor
            updateUrl: this.updateUrl,
            insertUrl: this.insertUrl,
            removeUrl: this.deleteUrl,
            url: this.getUrl,
            offline: false
        });

        if (this.getUrl) {
            this.fetch();
        }
    }

    fetch() {
        var query = ej.Query();
        this.params.forEach(function (element) {
            query.addParams( element.name, element.value);
        });

        //if (this.params) {
        //    query.addParams(this.params.name, this.params.value);
        //}

        this.dataManager.executeQuery(query)
            .done(e => {
                this.data = JSON.parse(e.result);
                if (this.onBind) {
                    this.onBind(this.data);
                }
            })
            .fail(() => {
                tostMessage(0, "Could not load page data.");
            });
    }

    // todo: need to customize the DataManager json, which seems to be in a hardcoded format
    // by SyncFusion. Currently sent as:
    // { ... keyColumn: key, value: record (this is received as a dto in WebMethod) ...}
    update(key, record) {
        this.dataManager.update(key, record)
            .done(args => { this.succeed(args, 1) })
            .fail(args => { this.fail(args) });
    }

    insert(record) {
        this.dataManager.insert(record)
            .done(args => { this.succeed(args, 1) })
            .fail(args => { this.fail(args) });
    }

    delete(fieldname, id) {
        this.dataManager.remove(fieldname, id)
            .done(args => { this.succeed(args, 2) })
            .fail(args => { this.fail(args) });
    }

    succeed(args, toast) {
        var result = JSON.parse(args.record);

        // make sure the result actually succeeded
        if (result.StatusCode && result.StatusCode !== 200) {
            this.fail(result.Message);
        }
        else {
            //this.dataManager.dataSource.json = record;

            tostMessage(toast, '');
            if (this.afterSave) {
                this.afterSave();
            }

            // refresh the data after successful save
            this.fetch();
        }
    }

    fail(args) {
        var message = args;
        if (args.error && args.error.responseJSON) {
            if (args.error.responseJSON.d) {
                var result = JSON.parse(args.error.responseJSON.d);
                message = result.Message;
            }
            else if (args.error.responseJSON.Message) {
                message = args.error.responseJSON.Message;
            }
        }

        tostMessage(0, message);
    }
}