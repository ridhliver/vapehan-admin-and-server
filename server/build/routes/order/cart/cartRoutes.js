"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartController_1 = __importDefault(require("../../../controllers/order/cart/cartController"));
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client/src/assets/img/product');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const upload = multer_1.default({
    storage: storage,
    limits: {
        fileSize: 1280 * 1280 * 5
    },
    fileFilter: fileFilter
});
let mUpload = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'mImage', maxCount: 5 }]);
class CartRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', cartController_1.default.list);
        this.router.get('/getCart/:id', cartController_1.default.getCart);
        this.router.get('/updateqtyCartinc/:id', cartController_1.default.updateqtyProductinc);
        this.router.get('/updateqtyCartdec/:id', cartController_1.default.updateqtyProductdec);
        // this.router.get('/shipping', CartController.shipping);
        this.router.get('/:id', cartController_1.default.detail);
        this.router.post('/', cartController_1.default.create);
        this.router.post('/createCart', cartController_1.default.createCart);
        this.router.delete('/:id', cartController_1.default.delete);
        this.router.delete('/deleteCart/:id', cartController_1.default.deleteProduct);
        this.router.put('/:id', cartController_1.default.update);
    }
}
const cartRoutes = new CartRoutes();
exports.default = cartRoutes.router;
