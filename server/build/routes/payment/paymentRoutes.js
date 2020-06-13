"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = __importDefault(require("../../controllers/payment/paymentController"));
const database_1 = __importDefault(require("../../database"));

class PaymentRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/get/order/payment/:id', paymentController_1.default.getPayment);
        this.router.post('/res/gopay', paymentController_1.default.resgopay);
        this.router.post('/res/mandiriVA', paymentController_1.default.resmandiriVA);
        this.router.post('/res/bca', paymentController_1.default.resbca);
        this.router.post('/res/alfaVA', paymentController_1.default.resalfaVA);
        this.router.post('/res/permataVA', paymentController_1.default.respermataVA);
        this.router.post('/res/bniVA', paymentController_1.default.resbniVA);
        this.router.post('/res/akulaku', paymentController_1.default.resakulaku);
    }
}
const paymentRoutes = new PaymentRoutes();
exports.default = paymentRoutes.router;
