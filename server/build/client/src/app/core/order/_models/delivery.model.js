"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DeliveryModel {
    clear() {
        this.id_order = '';
        this.id_product = undefined;
        this.prodName = '';
        this.image = null;
        this.quantity = 0;
        this.weight = 0;
        this.price = 0;
        this.total = 0;
    }
}
exports.DeliveryModel = DeliveryModel;
