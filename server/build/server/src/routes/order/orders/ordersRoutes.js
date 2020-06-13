"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ordersController_1 = __importDefault(require("../../../controllers/order/orders/ordersController"));
class OrderRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', ordersController_1.default.list);
        this.router.get('/getProduct/:id', ordersController_1.default.getProductCart);
        this.router.get('/getProductTotal/:id', ordersController_1.default.getProductCartTotal);
        this.router.get('/orderHeaderA/:id', ordersController_1.default.orderHeaderA);
        this.router.get('/orderHeaderB/:id', ordersController_1.default.orderHeaderB);
        this.router.get('/detailOrder/:id', ordersController_1.default.orderDetail);
        this.router.post('/', ordersController_1.default.create);
        this.router.post('/:id', ordersController_1.default.detail);
        this.router.post('/re/send/order/:id', ordersController_1.default.resendemailOrder);
        this.router.post('/send/invoice/:id', ordersController_1.default.sendInvoice);
        this.router.delete('/:id', ordersController_1.default.delete);
        this.router.put('/:id', ordersController_1.default.update);
        this.router.put('/status/:id', ordersController_1.default.updateStatus);
        this.router.put('/status/accPay/:id', ordersController_1.default.accPayment);
    }
}
const orderRoutes = new OrderRoutes();
exports.default = orderRoutes.router;
