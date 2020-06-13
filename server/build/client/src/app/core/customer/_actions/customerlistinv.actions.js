"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ListInvActionTypes;
(function (ListInvActionTypes) {
    ListInvActionTypes["ListInvOnServerCreated"] = "[Edit Invoice Component] Invoice On Server Created";
    ListInvActionTypes["ListInvCreated"] = "[Edit Invoice Component] Invoice Created";
    ListInvActionTypes["ListInvUpdated"] = "[Edit Invoice Component] Invoice Updated";
    ListInvActionTypes["sListInvParentUpdated"] = "[Invoices List Page] Invoices Parent Updated";
    ListInvActionTypes["OneListInvDeleted"] = "[Invoices List Page] One Invoice Deleted";
    ListInvActionTypes["ManysListInvDeleted"] = "[Invoices List Page] Many Selected Invoices Deleted";
    ListInvActionTypes["sListInvPageRequested"] = "[Invoices List Page] Invoices Page Requested";
    ListInvActionTypes["sListInvPageLoaded"] = "[Invoices API] Invoices Page Loaded";
    ListInvActionTypes["sListInvPageCancelled"] = "[Invoices API] Invoices Page Cancelled";
    ListInvActionTypes["sListInvPageToggleLoading"] = "[Invoices] Invoices Page Toggle Loading";
    ListInvActionTypes["sListInvActionToggleLoading"] = "[Invoices] Invoices Action Toggle Loading";
})(ListInvActionTypes = exports.ListInvActionTypes || (exports.ListInvActionTypes = {}));
class ListInvOnServerCreated {
    constructor(payload) {
        this.payload = payload;
        this.type = ListInvActionTypes.ListInvOnServerCreated;
    }
}
exports.ListInvOnServerCreated = ListInvOnServerCreated;
class ListInvCreated {
    constructor(payload) {
        this.payload = payload;
        this.type = ListInvActionTypes.ListInvCreated;
    }
}
exports.ListInvCreated = ListInvCreated;
class ListInvUpdated {
    constructor(payload) {
        this.payload = payload;
        this.type = ListInvActionTypes.ListInvUpdated;
    }
}
exports.ListInvUpdated = ListInvUpdated;
class ListInvParentUpdated {
    constructor(payload) {
        this.payload = payload;
        this.type = ListInvActionTypes.sListInvParentUpdated;
    }
}
exports.ListInvParentUpdated = ListInvParentUpdated;
class OneListInvDeleted {
    constructor(payload) {
        this.payload = payload;
        this.type = ListInvActionTypes.OneListInvDeleted;
    }
}
exports.OneListInvDeleted = OneListInvDeleted;
class ManysListInvDeleted {
    constructor(payload) {
        this.payload = payload;
        this.type = ListInvActionTypes.ManysListInvDeleted;
    }
}
exports.ManysListInvDeleted = ManysListInvDeleted;
class ListInvPageRequested {
    constructor(payload) {
        this.payload = payload;
        this.type = ListInvActionTypes.sListInvPageRequested;
    }
}
exports.ListInvPageRequested = ListInvPageRequested;
class ListInvPageLoaded {
    constructor(payload) {
        this.payload = payload;
        this.type = ListInvActionTypes.sListInvPageLoaded;
    }
}
exports.ListInvPageLoaded = ListInvPageLoaded;
class ListInvPageCancelled {
    constructor() {
        this.type = ListInvActionTypes.sListInvPageCancelled;
    }
}
exports.ListInvPageCancelled = ListInvPageCancelled;
class ListInvPageToggleLoading {
    constructor(payload) {
        this.payload = payload;
        this.type = ListInvActionTypes.sListInvPageToggleLoading;
    }
}
exports.ListInvPageToggleLoading = ListInvPageToggleLoading;
class ListInvActionToggleLoading {
    constructor(payload) {
        this.payload = payload;
        this.type = ListInvActionTypes.sListInvActionToggleLoading;
    }
}
exports.ListInvActionToggleLoading = ListInvActionToggleLoading;
