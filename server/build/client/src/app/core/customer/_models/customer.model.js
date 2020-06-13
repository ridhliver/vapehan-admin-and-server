"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const biodata_model_1 = require("./biodata.model");
class CustomerModel {
    clear() {
        this.id = undefined;
        this.firstname = '';
        this.lastname = '';
        this.email = '';
        this.verification = 0;
        this.password = '';
        this.accessToken = 'access-member-' + Math.random();
        this.biodata = new biodata_model_1.Biodata();
        this.biodata.clear();
        this.status = 0;
    }
}
exports.CustomerModel = CustomerModel;
