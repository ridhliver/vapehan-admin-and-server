"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CustomerActionTypes;
(function (CustomerActionTypes) {
    CustomerActionTypes["CustomerOnServerCreated"] = "[Edit Customer Component] Customer On Server Created";
    CustomerActionTypes["CustomerCreated"] = "[Edit Customer Component] Customer Created";
    CustomerActionTypes["CustomerUpdated"] = "[Edit Customer Component] Customer Updated";
    CustomerActionTypes["CustomersParentUpdated"] = "[Customers List Page] Customers Parent Updated";
    CustomerActionTypes["OneCustomerDeleted"] = "[Customers List Page] One Customer Deleted";
    CustomerActionTypes["ManyCustomersDeleted"] = "[Customers List Page] Many Selected Customers Deleted";
    CustomerActionTypes["CustomersPageRequested"] = "[Customers List Page] Customers Page Requested";
    CustomerActionTypes["CustomersPageLoaded"] = "[Customers API] Customers Page Loaded";
    CustomerActionTypes["CustomersPageCancelled"] = "[Customers API] Customers Page Cancelled";
    CustomerActionTypes["CustomersPageToggleLoading"] = "[Customers] Customers Page Toggle Loading";
    CustomerActionTypes["CustomersActionToggleLoading"] = "[Customers] Customers Action Toggle Loading";
})(CustomerActionTypes = exports.CustomerActionTypes || (exports.CustomerActionTypes = {}));
class CustomerOnServerCreated {
    constructor(payload) {
        this.payload = payload;
        this.type = CustomerActionTypes.CustomerOnServerCreated;
    }
}
exports.CustomerOnServerCreated = CustomerOnServerCreated;
class CustomerCreated {
    constructor(payload) {
        this.payload = payload;
        this.type = CustomerActionTypes.CustomerCreated;
    }
}
exports.CustomerCreated = CustomerCreated;
class CustomerUpdated {
    constructor(payload) {
        this.payload = payload;
        this.type = CustomerActionTypes.CustomerUpdated;
    }
}
exports.CustomerUpdated = CustomerUpdated;
class CustomersParentUpdated {
    constructor(payload) {
        this.payload = payload;
        this.type = CustomerActionTypes.CustomersParentUpdated;
    }
}
exports.CustomersParentUpdated = CustomersParentUpdated;
class OneCustomerDeleted {
    constructor(payload) {
        this.payload = payload;
        this.type = CustomerActionTypes.OneCustomerDeleted;
    }
}
exports.OneCustomerDeleted = OneCustomerDeleted;
class ManyCustomersDeleted {
    constructor(payload) {
        this.payload = payload;
        this.type = CustomerActionTypes.ManyCustomersDeleted;
    }
}
exports.ManyCustomersDeleted = ManyCustomersDeleted;
class CustomersPageRequested {
    constructor(payload) {
        this.payload = payload;
        this.type = CustomerActionTypes.CustomersPageRequested;
    }
}
exports.CustomersPageRequested = CustomersPageRequested;
class CustomersPageLoaded {
    constructor(payload) {
        this.payload = payload;
        this.type = CustomerActionTypes.CustomersPageLoaded;
    }
}
exports.CustomersPageLoaded = CustomersPageLoaded;
class CustomersPageCancelled {
    constructor() {
        this.type = CustomerActionTypes.CustomersPageCancelled;
    }
}
exports.CustomersPageCancelled = CustomersPageCancelled;
class CustomersPageToggleLoading {
    constructor(payload) {
        this.payload = payload;
        this.type = CustomerActionTypes.CustomersPageToggleLoading;
    }
}
exports.CustomersPageToggleLoading = CustomersPageToggleLoading;
class CustomersActionToggleLoading {
    constructor(payload) {
        this.payload = payload;
        this.type = CustomerActionTypes.CustomersActionToggleLoading;
    }
}
exports.CustomersActionToggleLoading = CustomersActionToggleLoading;
