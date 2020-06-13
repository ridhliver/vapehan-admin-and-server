"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const glob = require("glob");
const Jimp = require('jimp');
const brandController_1 = __importDefault(require("../../../controllers/catalog/brand/brandController"));
const database_1 = __importDefault(require("../../../database"));
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images/brands');
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
class BrandRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', brandController_1.default.list);
        this.router.get('/display/images', (req, res, next) => {
            glob('./images/brands/*.jpg', function(er, files) {
                files.map(async function (file) {
                    const image = await Jimp.read(file);
                    await image.resize(500, 500);
                    await image.quality(72);
                    const subtring = file.substr(16, 255);
                    await image.writeAsync('./images/new_brand/' + subtring );
                    
                });
                res.json(files);
            });
        });
        this.router.get('/:id', brandController_1.default.detail);
        this.router.post('/autoIns', brandController_1.default.newBrand);
        this.router.post('/', upload.single('image'), (req, res, next) => {
            const file = req.file;
            if (file == null) {
                const brand = {
                    image: 'no_brand.png',
                    name: req.body.name,
                    description: req.body.description
                };
                console.log(brand);
                database_1.default.query('INSERT INTO vh_product_brand set ?', [brand]);
                res.json({ message: 'Success' });
            }
            else {
                const brand = {
                    image: file.originalname,
                    name: req.body.name,
                    description: req.body.description
                };
                console.log(brand);
                database_1.default.query('INSERT INTO vh_product_brand set ?', [brand]);
                res.json({ message: 'Success' });
            }
        });
        
        this.router.delete('/:id', brandController_1.default.delete);
        this.router.put('/:id', upload.single('image'), (req, res, next) => {
            const file = req.file;
            const { id } = req.params;
            if (file == null) {
                const brand = {
                    name: req.body.name,
                    description: req.body.description
                };
                console.log(brand);
                database_1.default.query('UPDATE vh_product_brand set ? WHERE id = ?', [brand, id]);
                res.json({ message: 'Success' });
            }
            else {
                const brand = {
                    image: file.originalname,
                    name: req.body.name,
                    description: req.body.description
                };
                console.log(brand);
                database_1.default.query('UPDATE vh_product_brand set ? WHERE id = ?', [brand, id]);
                res.json({ message: 'Success' });
            }
        });
    }
}
const brandRoutes = new BrandRoutes();
exports.default = brandRoutes.router;
