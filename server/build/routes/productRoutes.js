"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = __importDefault(require("../controllers/productController"));
class ProductRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', productController_1.default.list);
        this.router.get('/:id', productController_1.default.detail);
        this.router.post('/', productController_1.default.create);
        this.router.delete('/:id', productController_1.default.delete);
        this.router.put('/:id', productController_1.default.update);
    }
}
const productRoutes = new ProductRoutes();
exports.default = productRoutes.router;
