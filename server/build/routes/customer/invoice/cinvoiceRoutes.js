"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cinvoiceController_1 = __importDefault(require("../../../controllers/customer/invoice/cinvoiceController"));
class CInvoiceRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/:id', cinvoiceController_1.default.list);
        this.router.post('/', cinvoiceController_1.default.create);
        // this.router.delete('/:id', cinvoiceController.delete);
        this.router.put('/:id', cinvoiceController_1.default.update);
    }
}
const cinvoiceRoutes = new CInvoiceRoutes();
exports.default = cinvoiceRoutes.router;
