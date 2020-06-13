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
const glob = require("glob");
const productController_1 = __importDefault(require("../../../controllers/catalog/product/productController"));
const database_1 = __importDefault(require("../../../database"));
const multer_1 = __importDefault(require("multer"));
const Jimp = require('jimp');
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
    // console.log(file);
    if (file.mimetype === 'image/jpeg' /*|| file.mimetype === 'image/png'*/) {
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
let mUpload = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'mImage', maxCount: 10 }]);
class ProductRoutes {
    constructor() {
        this.router = express_1.Router();
        this.app = express_1();
        this.config();
    }
    config() {
        this.router.get('/', productController_1.default.list);
        this.router.get('/display/images', (req, res, next) => {
            glob('./images/product/*.jpg', function(er, files) {
                files.map(async function (file) {
                    const image = await Jimp.read(file);
                    await image.resize(500, 500);
                    await image.quality(72);
                    const subtring = file.substr(17, 255);
                    await image.writeAsync('./images/new/' + subtring );
                    
                });
                res.json(files);
            });
        });
        this.router.get('/prodcs', productController_1.default.plist);
        this.router.get('/prodcs/disc/:id', productController_1.default.plistd);
        this.router.get('/list', productController_1.default.ListPro);
        this.router.get('/imageVariant', productController_1.default.ImageVariant);
        this.router.get('/categories/:id', productController_1.default.categories);
        this.router.get('/setcover/:id', productController_1.default.setCover);
        this.router.get('/home/new', productController_1.default.Homenew);
        this.router.get('/home/best', productController_1.default.Homebest);
        this.router.get('/bestProd', productController_1.default.BestProd);
        this.router.get('/home/feat', productController_1.default.Homefeat);
        this.router.get('/generatebarcode', productController_1.default.generateBarode);
        this.router.get('/images/:id', productController_1.default.Imagelist);
        this.router.get('/detailpro/:id', productController_1.default.detailProduct);
        this.router.get('/detailpro/slug/:id', productController_1.default.detailProductSlug);
        this.router.get('/detailpro/variantImage/:id', productController_1.default.getVariantImage);
        this.router.get('/:id', productController_1.default.detail);
        this.router.get('/search/:id', productController_1.default.search);
		this.router.get('/getLastId/product', productController_1.default.getLastIDProduct);
        this.router.post('/delImageDB/:id', productController_1.default.delImageDB);
        this.router.post('/get/detail/product', productController_1.default.detailprod);
        this.router.post('/', mUpload, (req, res, next) => {
            const file = req.files['image'];
            const files = req.files['mImage'];
            if (files == null && file == null) {
                // console.log('1');
                const post = req.body;
                let summary = "";
                let description = "";
                if (post.summary || post.summary != "null") {
                    summary = post.summary;
                }
                if (post.description || post.description != "null") {
                    description = post.description;
                }
                const product = {
                    id: post.id,
                    barcode: post.barcode,
                    name: post.name,
                    id_category: post.id_category,
                    id_brand: post.id_brand,
                    summary: summary,
                    description: description,
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
                    slug_url: post.slug,
		    setup: post.setup
                };
                
                database_1.default.query('INSERT INTO vh_product (id, barcode, name, id_category, id_brand, summary, description, stock, price,	color, status, kondisi, image, nic, width, height, depth, weight, home, video, slug_url, setup) VALUES (?, ?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, trim(?), ?)', [product.id, product.barcode, product.name, product.id_category, product.id_brand, product.summary, product.description, product.stock, product.price, product.color, product.status, product.kondisi, product.image, product.nic, product.width, product.height, product.depth, product.weight, product.home, product.video, product.slug_url, product.setup]);
                res.json({ message: 'Success' });
            }
            else if (files == null) {
                // console.log('2');
                let originalname = file.map(function (file) {
                    return file.originalname;
                });
                const post = req.body;
                let summary = "";
                let description = "";
                if (post.summary || post.summary != "null") {
                    summary = post.summary;
                }
                if (post.description || post.description != "null") {
                    description = post.description;
                }
                const product = {
                    id: post.id,
                    barcode: post.barcode,
                    name: post.name,
                    id_category: post.id_category,
                    id_brand: post.id_brand,
                    summary: summary,
                    description: description,
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
                    slug_url: post.slug,
		    setup: post.setup
                };
                const start = function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        database_1.default.query('INSERT INTO vh_product (id, barcode, name, id_category, id_brand, summary, description, stock, price,	color, status, kondisi, image, nic, width, height, depth, weight, home, video, slug_url, setup) VALUES (?, ?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, trim(?), ?)', [product.id, product.barcode, product.name, product.id_category, product.id_brand, product.summary, product.description, product.stock, product.price, product.color, product.status, product.kondisi, product.image, product.nic, product.width, product.height, product.depth, product.weight, product.home, product.video, product.slug_url, product.setup]);
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
                // console.log('3');
                // console.log(file);
                let filename = files.map(function (file) {
                    return file.filename;
                });
                const post = req.body;
                let summary = "";
                let description = "";
                if (post.summary || post.summary != "null") {
                    summary = post.summary;
                }
                if (post.description || post.description != "null") {
                    description = post.description;
                }
                const product = {
                    id: post.id,
                    barcode: post.barcode,
                    name: post.name,
                    id_category: post.id_category,
                    id_brand: post.id_brand,
                    summary: summary,
                    description: description,
                    stock: post.stock,
                    price: post.price,
                    color: post.color,
                    status: post.status,
                    kondisi: post.kondisi,
                    image: file[0].originalname,
                    nic: post.nic,
                    width: post.width,
                    height: post.height,
                    depth: post.depth,
                    weight: post.weight,
                    home: post.home,
                    video: post.video,
                    slug_url: post.slug,
		    setup: post.setup
                };
                
                const start = function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        const insert = database_1.default.query('INSERT INTO vh_product (id, barcode, name, id_category, id_brand, summary, description, stock, price,	color, status, kondisi, image, nic, width, height, depth, weight, home, video, slug_url, setup) VALUES (?, ?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, trim(?), ?)', [product.id, product.barcode, product.name, product.id_category, product.id_brand, product.summary, product.description, product.stock, product.price, product.color, product.status, product.kondisi, product.image, product.nic, product.width, product.height, product.depth, product.weight, product.home, product.video, product.slug_url, product.setup]);
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
                        for (let i = 0; i < files.length; i++) {
                            let id_product = [post.id];
                            let barcode = [post.barcode]
                            const images = {
                                barcode: barcode,
                                id_product: id_product,
                                image: filename[i]
                            };
                            // console.log(images);
                            database_1.default.query('INSERT INTO vh_product_image SET ?', images);
                        };
						database_1.default.query('delete from vh_product_image where image in (select image from vh_product_cover where barcode is null ) and id_product in (select id_product from vh_product_cover where barcode is null )');
						
						database_1.default.query('update vh_product_cover set barcode = ? where id_product = ?', [post.barcode, post.id]);
					   
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
		this.router.post('/setcoverdb/:id', productController_1.default.setCoverDB);
        this.router.post('/setcover/:id', upload.single('image'), (req, res, next) => {
            // console.log(req.body);
            const { id } = req.params;
            const file = req.file;

            if (file) {

                const data = {
                    id_product : id,
                    image: file.originalname
                }
                // console.log(data);
                database_1.default.query('INSERT INTO vh_product_cover SET ? ', [data]);
                res.json({message : 'success'});
            } else {
                res.json({message : 'failed'});
            }
		});
        this.router.delete('/:id', productController_1.default.delete);
        this.router.delete('/image/:id', productController_1.default.deleteImage);
		this.router.delete('/setcover/:id', productController_1.default.delCover);
		this.router.put('/setcoverdb/:id', productController_1.default.setUPCoverDB);
        this.router.put('/setcover/:id', upload.single('image'), (req, res, next) => {
            // console.log(req.body);
            const { id } = req.params;
            const file = req.file;
            if (file) {
                
                const data = {
                    id_product : id,
                    image: file.originalname
                }
                // console.log(data);
                database_1.default.query('UPDATE vh_product_cover SET ? WHERE id_product = ?', [data, id]);
                res.json({message : 'success'});
            } else {
                res.json({message : 'failed'});
            }
        });
        this.router.put('/:id', mUpload, (req, res, next) => {
            const { id } = req.params;
            const file = req.files['image'];
            const files = req.files['mImage'];
            if (files == null && file == null) {
                const post = req.body;
                const product = {
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
                database_1.default.query('UPDATE vh_product SET ? WHERE id = ?', [product, id]);
                res.json({ message: 'Success' });
            }
            else if (files == null) {
                let originalname = file.map(function (file) {
                    return file.originalname;
                });
                const post = req.body;
                const product = {
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
                        database_1.default.query('UPDATE vh_product SET ? WHERE id = ?', [product, id]);
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
                    image: file[0].originalname,
                    nic: post.nic,
                    width: post.width,
                    height: post.height,
                    depth: post.depth,
                    weight: post.weight,
                    home: post.home,
                    video: post.video,
                    slug_url: post.slug
                };
                // console.log(filename);
                // console.log(product);
                const start = function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        const insert = database_1.default.query('UPDATE vh_product SET ? WHERE id = ?', [product, id]);
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
                       // const imagescheck = yield database_1.default.query('SELECT id_product FROM vh_product_image WHERE id_product = ?', result[0].id);
                        //if (!imagescheck) {
                            for (let i = 0; i < files.length; i++) {
                                let id_product = [post.id];
                                const images = {
                                    id_product: id_product,
                                    image: filename[i]
                                };
                                // console.log(images);
                                database_1.default.query('INSERT INTO vh_product_image SET ?', images);
                            };
							database_1.default.query('delete from vh_product_image where image in (select image from vh_product_cover where barcode is null ) and id_product in (select id_product from vh_product_cover where barcode is null )');
							
							database_1.default.query('update vh_product_cover set barcode = ? where id_product = ?', [post.barcode, post.id]);
							
							database_1.default.query('call updateCover()');
                        /*} else {
                            for (let i = 1; i < files.length; i++) {
                                let id_product = [result[0].id];
                                const images = {
                                    id_product: id_product,
                                    image: filename[i]
                                };
                                // console.log(images);
                                database_1.default.query('UPDATE vh_product_image SET ? WHERE id_product = ?', [images, result[0].id]);
                            }
                            ;
                        }
                        */
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
        this.router.put('/discount/:id', productController_2.default.updateDiscount);
        this.router.put('/upstat/:id', productController_2.default.updateStatus);
        this.router.put('/uphome/:id', productController_2.default.updateHome);
        this.router.put('/image/:id', upload.single('image'), (req, res, next) => {
            const file = req.file;
            console.log(file);
            const { id } = req.params;
            const resize = async function() {
                const image = await Jimp.read(file.path);
                await image.resize(500, 500);
                await image.quality(72);
                await image.writeAsync(file.path);
            }
            resize();
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

            files.map(async function (file) {
                const image = await Jimp.read(file.path);
                await image.resize(500, 500);
                await image.quality(72);
                await image.writeAsync(file.path);
            })

            for (let i = 0; i < files.length; i++) {
                let id_product = [req.body.id];
                let barcode = [req.body.barcode];
                const images = {
                    id_product: id_product,
                    barcode: barcode,
                    image: filename[i],
                    imgvar: req.body.imgvar[i]
                };
                // console.log(images);
                const check = database_1.default.query('SELECT barcode FROM vh_product_image WHERE image = ? limit 1', [filename[i]]);

                if (check.length > 0) {
                    database_1.default.query('UPDATE vh_product_image SET ? WHERE image = ?', [images, filename[i]]); 
                } else {
                    database_1.default.query('INSERT INTO vh_product_image SET ?', images);
                }
            }

            res.json({ text:'Success' });
        });
	this.router.put('/update/chart', productController_2.default.updateProdCart);
    }
}
const productRoutes = new ProductRoutes();
exports.default = productRoutes.router;
