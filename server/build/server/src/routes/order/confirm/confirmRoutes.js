"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const confirmController_1 = __importDefault(require("../../../controllers/order/confirm/confirmController"));
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
class OrderRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', confirmController_1.default.list);
        // this.router.get('/images/:id', ConfirmController.Imagelist);
        this.router.get('/:id', confirmController_1.default.detail);
        // this.router.post('/', ConfirmController.create);
        this.router.post('/confirm', confirmController_1.default.confirm);
        this.router.put('/confirmPay/:id', confirmController_1.default.onProcess);
        this.router.delete('/:id', confirmController_1.default.delete);
        // this.router.delete('/image/:id', ConfirmController.deleteImage);
        // this.router.put('/:id', ConfirmController.update);
    }
}
const orderRoutes = new OrderRoutes();
exports.default = orderRoutes.router;
