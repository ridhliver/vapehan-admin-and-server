"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConfirmModel {
    clear() {
        this.id = undefined;
        this.transaction_id = '';
        this.total_amount = 0;
        this.first_name = '';
        this.last_name = '';
        this.payment = 0;
        this.virtual_account = 0;
        this.note = '';
    }
}
exports.ConfirmModel = ConfirmModel;
