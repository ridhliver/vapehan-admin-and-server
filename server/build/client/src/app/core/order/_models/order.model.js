"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OrderModel {
    clear() {
        this.id_order = '';
        this.id_customer = 0;
        this.id_ongkir = 0;
        this.total = 0;
        this.payment = 0;
        this.status = 0;
    }
}
exports.OrderModel = OrderModel;
