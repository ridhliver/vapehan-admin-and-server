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
	    this.router.get('/getIdorder', ordersController_1.default.getIdorder);
        this.router.get('/getProduct/:id', ordersController_1.default.getProductCart);
        this.router.get('/getProductTotal/:id', ordersController_1.default.getProductCartTotal);
        this.router.get('/orderHeaderA/:id', ordersController_1.default.orderHeaderA);
        this.router.get('/orderHeaderB/:id', ordersController_1.default.orderHeaderB);
        this.router.get('/detailOrder/:id', ordersController_1.default.orderDetail);
        this.router.get('/getTotalOrder', ordersController_1.default.getTotal);
        this.router.get('/getmetrixTotalOrder', ordersController_1.default.metrictotalorder);
        this.router.get('/getTotalSuccessOrder', ordersController_1.default.getSuccessTotal);
        this.router.get('/getTotalFailOrder', ordersController_1.default.getFailTotal);
        this.router.get('/getTotalWaitingOrder', ordersController_1.default.getWaitingTotal);
        this.router.get('/TotalAmount', ordersController_1.default.TotalAmount);
        this.router.get('/TotalAmountlastmonth', ordersController_1.default.TotalAmountlastmonth);
        this.router.post('/cancel/:id', ordersController_1.default.delete);
	    this.router.post('/verifyPay', ordersController_1.default.verifyPay);
        this.router.post('/notifPay', ordersController_1.default.notifPay);
        this.router.post('/redirectGate', ordersController_1.default.redirectGate);
        this.router.post('/updateResi', ordersController_1.default.updateResi);
        this.router.post('/', ordersController_1.default.create);
        this.router.post('/manual', ordersController_1.default.createManual);
        this.router.post('/tempo', ordersController_1.default.createTempo);
        this.router.post('/get/tempo/order', ordersController_1.default.checkout);
        this.router.post('/:id', ordersController_1.default.detail);
        this.router.post('/re/send/order/:id', ordersController_1.default.resendemailOrder);
        this.router.post('/send/invoice/:id', ordersController_1.default.sendInvoice);
        this.router.post('/report/list', ordersController_1.default.report);
	    this.router.delete('/:id', ordersController_1.default.delete);
        this.router.put('/:id', ordersController_1.default.update);
        this.router.put('/status/:id', ordersController_1.default.updateStatus);
        this.router.put('/status/accPay/:id', ordersController_1.default.accPayment);
    }
}
const orderRoutes = new OrderRoutes();
exports.default = orderRoutes.router;
