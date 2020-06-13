"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const discountController_1 = __importDefault(require("../../../controllers/catalog/discount/discountController"));
class DiscountRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', discountController_1.default.list);
        this.router.get('/generateNo', discountController_1.default.generate);
        this.router.post('/', discountController_1.default.create);
        this.router.post('/addDisc', discountController_1.default.addDisc);
        this.router.delete('/:id', discountController_1.default.delete);
        this.router.delete('/dropProd/disc/:id', discountController_1.default.dropProduct);
        this.router.put('/:id', discountController_1.default.update);
        this.router.put('/upStat/:id', discountController_1.default.updateStat);
    }
}
const discountRoutes = new DiscountRoutes();
exports.default = discountRoutes.router;
