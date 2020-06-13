"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const deliveriesController_1 = __importDefault(require("../../../controllers/order/delivery/deliveriesController"));
class DeliveryRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', deliveriesController_1.default.list);
        this.router.get('/:id', deliveriesController_1.default.detail);
        this.router.get('/order/:id', deliveriesController_1.default.shipping);
        this.router.post('/', deliveriesController_1.default.create);
        this.router.delete('/:id', deliveriesController_1.default.delete);
        this.router.put('/:id', deliveriesController_1.default.update);
        this.router.put('/done/:id', deliveriesController_1.default.Done);
    }
}
const deliveryRoutes = new DeliveryRoutes();
exports.default = deliveryRoutes.router;
