"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = __importDefault(require("../../../controllers/catalog/product/productController"));
const database_1 = __importDefault(require("../../../database"));
const multer_1 = __importDefault(require("multer"));
const productController_2 = __importDefault(require("../../../controllers/catalog/product/productController"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images/product');
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
class ProductRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', productController_1.default.list);
        this.router.get('/prodcs', productController_1.default.plist);
        this.router.get('/prodcs/disc/:id', productController_1.default.plistd);
        this.router.get('/list', productController_1.default.ListPro);
        this.router.get('/imageVariant', productController_1.default.ImageVariant);
        this.router.get('/categories/:id', productController_1.default.categories);
        this.router.get('/home/new', productController_1.default.Homenew);
        this.router.get('/home/best', productController_1.default.Homebest);
        this.router.get('/bestProd', productController_1.default.BestProd);
        this.router.get('/home/feat', productController_1.default.Homefeat);
        this.router.get('/images/:id', productController_1.default.Imagelist);
        this.router.get('/detailpro/:id', productController_1.default.detailProduct);
        this.router.get('/detailpro/slug/:id', productController_1.default.detailProductSlug);
        this.router.get('/detailpro/variantImage/:id', productController_1.default.getVariantImage);
        this.router.get('/:id', productController_1.default.detail);
        this.router.get('/search/:id', productController_1.default.search);
        this.router.get('/getLastId/product', productController_1.default.getLastIDProduct);
        this.router.post('/', mUpload, (req, res, next) => {
            const file = req.files['image'];
            const files = req.files['mImage'];
            if (files == null && file == null) {
                const post = req.body;
                const product = {
                    id: post.id,
                    barcode: post.barcode,
                    name: post.name,
                    id_category: post.id_category,
                    id_brand: post.id_brand,
                    summary: post.summary,
                    description: post.description,
                    stock: post.stock,
                    price: post.price,
                    color: post.color,
                    status: post.status,
                    kondisi: post.kondisi,
                    image: 'Shop-coming-soon1.png',
                    nic: post.nic,
                    width: post.width,
                    height: post.height,
                    depth: post.depth,
                    weight: post.weight,
                    home: post.home,
                    video: post.video,
                    slug_url: post.slug
                };
                database_1.default.query('INSERT INTO vh_product (barcode, name, id_category, id_brand, summary, description, stock, price,	color, status, kondisi, image, nic, width, height, depth, weight, home, video, slug_url) VALUES (?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, replace(?, " ", "-"))', [product.barcode, product.name, product.id_category, product.id_brand, product.summary, product.description, product.stock, product.price, product.color, product.status, product.kondisi, product.image, product.nic, product.width, product.height, product.depth, product.weight, product.home, product.video, product.slug_url]);
                res.json({ message: 'Success' });
            }
            else if (files == null) {
                let originalname = file.map(function (file) {
                    return file.originalname;
                });
                const post = req.body;
                const product = {
                    id: post.id,
                    barcode: post.barcode,
                    name: post.name,
                    id_category: post.id_category,
                    id_brand: post.id_brand,
                    summary: post.summary,
                    description: post.description,
                    stock: post.stock,
                    price: post.price,
                    color: post.color,
                    status: post.status,
                    kondisi: post.kondisi,
                    image: originalname,
                    nic: post.nic,
                    width: post.width,
                    height: post.height,
                    depth: post.depth,
                    weight: post.weight,
                    home: post.home,
                    video: post.video,
                    slug_url: post.slug
                };
                const start = function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        database_1.default.query('INSERT INTO vh_product (barcode, name, id_category, id_brand, summary, description, stock, price,	color, status, kondisi, image, nic, width, height, depth, weight, home, video, slug_url) VALUES (?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, replace(?, " ", "-"))', [product.barcode, product.name, product.id_category, product.id_brand, product.summary, product.description, product.stock, product.price, product.color, product.status, product.kondisi, product.image, product.nic, product.width, product.height, product.depth, product.weight, product.home, product.video, product.slug_url]);
                        const result = yield database_1.default.query('SELECT id FROM vh_product WHERE id in (SELECT MAX(id) FROM vh_product) LIMIT 1');
                        const imageID = result[0].id;
                        // console.log(imageID);
                        database_1.default.query('UPDATE vh_product set image = ? WHERE id = ?', [imageID + '.jpg', imageID]);
                    });
                };
                start();
                res.json({ message: 'Success' });
            }
            else {
                let filename = files.map(function (file) {
                    return file.originalname;
                });
                const post = req.body;
                const product = {
                    id: post.id,
                    barcode: post.barcode,
                    name: post.name,
                    id_category: post.id_category,
                    id_brand: post.id_brand,
                    summary: post.summary,
                    description: post.description,
                    stock: post.stock,
                    price: post.price,
                    color: post.color,
                    status: post.status,
                    kondisi: post.kondisi,
                    image: filename[0],
                    nic: post.nic,
                    width: post.width,
                    height: post.height,
                    depth: post.depth,
                    weight: post.weight,
                    home: post.home,
                    video: post.video,
                    slug_url: post.slug
                };
                const start = function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        const insert = database_1.default.query('INSERT INTO vh_product (barcode, name, id_category, id_brand, summary, description, stock, price,	color, status, kondisi, image, nic, width, height, depth, weight, home, video, slug_url) VALUES (?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, replace(?, " ", "-"))', [product.barcode, product.name, product.id_category, product.id_brand, product.summary, product.description, product.stock, product.price, product.color, product.status, product.kondisi, product.image, product.nic, product.width, product.height, product.depth, product.weight, product.home, product.video, product.slug_url]);
                        return insert;
                    });
                };
                start();
                // console.log(product.name);
                var id_prod;
                id_prod = "";
                const update = function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        const result = yield database_1.default.query('SELECT id FROM vh_product WHERE id in (SELECT MAX(id) FROM vh_product) LIMIT 1');
                        for (let i = 1; i < files.length; i++) {
                            let id_product = [result[0].id];
                            const images = {
                                id_product: id_product,
                                image: filename[i]
                            };
                            // console.log(images);
                            database_1.default.query('INSERT INTO vh_product_image SET ?', images);
                        }
                        ;
                        const imageID = result[0].id;
                        // console.log(imageID);
                        id_prod = result[0].id;
                    });
                };
                update();
                // console.log(id_prod);
                database_1.default.query('UPDATE vh_product set image = ? WHERE id = ?', [id_prod + '.jpg', id_prod]);
                res.json({ message: 'Success' });
            }
        });
        this.router.delete('/:id', productController_1.default.delete);
        this.router.delete('/image/:id', productController_1.default.deleteImage);
        this.router.put('/:id', mUpload, (req, res, next) => {
            const file = req.files['image'];
            const files = req.files['mImage'];
            if (files == null && file == null) {
                const post = req.body;
                const product = {
                    id: post.id,
                    barcode: post.barcode,
                    name: post.name,
                    id_category: post.id_category,
                    id_brand: post.id_brand,
                    summary: post.summary,
                    description: post.description,
                    stock: post.stock,
                    price: post.price,
                    color: post.color,
                    status: post.status,
                    kondisi: post.kondisi,
                    image: 'Shop-coming-soon1.png',
                    nic: post.nic,
                    width: post.width,
                    height: post.height,
                    depth: post.depth,
                    weight: post.weight,
                    home: post.home,
                    video: post.video,
                    slug_url: post.slug
                };
                // console.log(product);
                database_1.default.query('UPDATE vh_product SET barcode = ?, name = ?, id_category = ?, id_brand = ?, summary = ?, description = ?, stock = ?, price = ?,	color = ?, status = ?, kondisi = ?, image = ?, nic = ?, width = ?, height = ?, depth = ?, weight = ?, home = ?, video = ?, slug_url = replace(?, " ", "-") WHERE id = ?', [product.barcode, product.name, product.id_category, product.id_brand, product.summary, product.description, product.stock, product.price, product.color, product.status, product.kondisi, product.image, product.nic, product.width, product.height, product.depth, product.weight, product.home, product.video, product.slug_url, product.id]);
                res.json({ message: 'Success' });
            }
            else if (files == null) {
                let originalname = file.map(function (file) {
                    return file.originalname;
                });
                const post = req.body;
                const product = {
                    id: post.id,
                    barcode: post.barcode,
                    name: post.name,
                    id_category: post.id_category,
                    id_brand: post.id_brand,
                    summary: post.summary,
                    description: post.description,
                    stock: post.stock,
                    price: post.price,
                    color: post.color,
                    status: post.status,
                    kondisi: post.kondisi,
                    image: originalname,
                    nic: post.nic,
                    width: post.width,
                    height: post.height,
                    depth: post.depth,
                    weight: post.weight,
                    home: post.home,
                    video: post.video,
                    slug_url: post.slug
                };
                // console.log(product);
                const start = function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        database_1.default.query('UPDATE vh_product SET barcode = ?, name = ?, id_category = ?, id_brand = ?, summary = ?, description = ?, stock = ?, price = ?,	color = ?, status = ?, kondisi = ?, image = ?, nic = ?, width = ?, height = ?, depth = ?, weight = ?, home = ?, video = ?, slug_url = replace(?, " ", "-") WHERE id = ?', [product.barcode, product.name, product.id_category, product.id_brand, product.summary, product.description, product.stock, product.price, product.color, product.status, product.kondisi, product.image, product.nic, product.width, product.height, product.depth, product.weight, product.home, product.video, product.slug_url, product.id]);
                        const result = yield database_1.default.query('SELECT id FROM vh_product WHERE id in (SELECT MAX(id) FROM vh_product) LIMIT 1');
                        const imageID = result[0].id;
                        // console.log(imageID);
                        database_1.default.query('UPDATE vh_product set image = ? WHERE id = ?', [imageID + '.jpg', imageID]);
                    });
                };
                start();
                res.json({ message: 'Success' });
            }
            else {
                let filename = files.map(function (file) {
                    return file.originalname;
                });
                const post = req.body;
                const product = {
                    id: post.id,
                    barcode: post.barcode,
                    name: post.name,
                    id_category: post.id_category,
                    id_brand: post.id_brand,
                    summary: post.summary,
                    description: post.description,
                    stock: post.stock,
                    price: post.price,
                    color: post.color,
                    status: post.status,
                    kondisi: post.kondisi,
                    image: filename[0],
                    nic: post.nic,
                    width: post.width,
                    height: post.height,
                    depth: post.depth,
                    weight: post.weight,
                    home: post.home,
                    video: post.video,
                    slug_url: post.slug
                };
                // console.log(product);
                const start = function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        const insert = database_1.default.query('UPDATE vh_product SET barcode = ?, name = ?, id_category = ?, id_brand = ?, summary = ?, description = ?, stock = ?, price = ?,	color = ?, status = ?, kondisi = ?, image = ?, nic = ?, width = ?, height = ?, depth = ?, weight = ?, home = ?, video = ?, slug_url = replace(?, " ", "-") WHERE id = ?', [product.barcode, product.name, product.id_category, product.id_brand, product.summary, product.description, product.stock, product.price, product.color, product.status, product.kondisi, product.image, product.nic, product.width, product.height, product.depth, product.weight, product.home, product.video, product.slug_url, product.id]);
                        return insert;
                    });
                };
                start();
                // console.log(product.name);
                var id_prod;
                id_prod = "";
                const update = function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        const result = yield database_1.default.query('SELECT id FROM vh_product WHERE id in (SELECT MAX(id) FROM vh_product) LIMIT 1');
                        for (let i = 1; i < files.length; i++) {
                            let id_product = [result[0].id];
                            const images = {
                                id_product: id_product,
                                image: filename[i]
                            };
                            // console.log(images);
                            database_1.default.query('INSERT INTO vh_product_image SET ?', images);
                        }
                        ;
                        const imageID = result[0].id;
                        // console.log(imageID);
                        id_prod = result[0].id;
                    });
                };
                update();
                database_1.default.query('UPDATE vh_product set image = ? WHERE id = ?', [id_prod + '.jpg', id_prod]);
                res.json({ message: 'Success' });
            }
        });
        this.router.put('/condition/:id', productController_2.default.updateCondition);
        this.router.put('/image/:id', upload.single('image'), (req, res, next) => {
            const file = req.file;
            const { id } = req.params;
            const image = {
                image: file.originalname
            };
            database_1.default.query('UPDATE vh_product set ? WHERE id = ?', [image, id]);
            res.json({ message: 'Success' });
        });
        this.router.post('/images', upload.array('file', 5), (req, res, next) => {
            const files = req.files;
            let filename = files.map(function (file) {
                return file.originalname;
            });
            for (let i = 0; i < files.length; i++) {
                let id_product = [req.body.id];
                const images = {
                    id_product: id_product,
                    image: filename[i]
                };
                // console.log(images);
                database_1.default.query('INSERT INTO vh_product_image SET ?', images);
            }
        });
    }
}
const productRoutes = new ProductRoutes();
exports.default = productRoutes.router;
