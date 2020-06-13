import { Router } from 'express';

import ProductController from '../../../controllers/catalog/product/productController';

import pool from '../../../database';
import multer from 'multer';
import productcontroller from '../../../controllers/catalog/product/productController';
 

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './images/product');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req: any, file: any, cb: any) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1280 * 1280 * 5
    },
    fileFilter: fileFilter
});

let mUpload = upload.fields([{name: 'image', maxCount: 1}, {name: 'mImage', maxCount: 10}]);

class ProductRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }
    
    config(): void {
        this.router.get('/', ProductController.list);
        this.router.get('/prodcs', ProductController.plist);
        this.router.get('/prodcs/disc/:id', ProductController.plistd);
        this.router.get('/list', ProductController.ListPro);
        this.router.get('/imageVariant', ProductController.ImageVariant);
        this.router.get('/categories/:id', ProductController.categories);
        this.router.get('/home/new', ProductController.Homenew);
        this.router.get('/home/best', ProductController.Homebest);
        this.router.get('/bestProd', ProductController.BestProd);
		this.router.get('/home/feat', ProductController.Homefeat);
        this.router.get('/images/:id', ProductController.Imagelist);
        this.router.get('/detailpro/:id', ProductController.detailProduct);
        this.router.get('/detailpro/slug/:id', ProductController.detailProductSlug);
        this.router.get('/detailpro/variantImage/:id', ProductController.getVariantImage)
        this.router.get('/:id', ProductController.detail);
        this.router.get('/search/:id', ProductController.search);
        this.router.get('/getLastId/product', ProductController.getLastIDProduct);
        this.router.post('/', mUpload, (req, res, next) => {
            const file = req.files['image'] as Express.Multer.File[];
            const files = req.files['mImage'] as Express.Multer.File[];
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
                }
               pool.query('INSERT INTO vh_product (id, barcode, name, id_category, id_brand, summary, description, stock, price,	color, status, kondisi, image, nic, width, height, depth, weight, home, video, slug_url) VALUES (?, ?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, trim(?))', [product.id, product.barcode, product.name, product.id_category, product.id_brand, product.summary, product.description, product.stock, product.price, product.color, product.status, product.kondisi, product.image, product.nic, product.width, product.height, product.depth, product.weight, product.home, product.video, product.slug_url]);
               res.json({ message: 'Success' });
            } else if(files == null) {
                let originalname = file.map(function(file){
                    return file.originalname
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
                }

               const start = async function() {
                pool.query('INSERT INTO vh_product (id, barcode, name, id_category, id_brand, summary, description, stock, price,	color, status, kondisi, image, nic, width, height, depth, weight, home, video, slug_url) VALUES (?, ?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, replace(?, " ", "-"))', [product.id, product.barcode, product.name, product.id_category, product.id_brand, product.summary, product.description, product.stock, product.price, product.color, product.status, product.kondisi, product.image, product.nic, product.width, product.height, product.depth, product.weight, product.home, product.video, product.slug_url]);
                const result = await pool.query('SELECT id FROM vh_product WHERE id in (SELECT MAX(id) FROM vh_product) LIMIT 1');
                
                const imageID:string = result[0].id;
                // console.log(imageID);
                pool.query('UPDATE vh_product set image = ? WHERE id = ?', [imageID +'.jpg',imageID]);
                }
                start();

               res.json({ message: 'Success' });

            } else {
                let filename = files.map(function(file){
                    return file.filename
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
                }
                
                

               const start = async function() {
                
                const insert = pool.query('INSERT INTO vh_product (id, barcode, name, id_category, id_brand, summary, description, stock, price,	color, status, kondisi, image, nic, width, height, depth, weight, home, video, slug_url) VALUES (?, ?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, replace(?, " ", "-"))', [product.id, product.barcode, product.name, product.id_category, product.id_brand, product.summary, product.description, product.stock, product.price, product.color, product.status, product.kondisi, product.image, product.nic, product.width, product.height, product.depth, product.weight, product.home, product.video, product.slug_url]);
                return insert;
                }
                start();
                // console.log(product.name);
                
                var id_prod: string;
                id_prod = ""; 

                const update = async function() {
                    const result = await pool.query('SELECT id FROM vh_product WHERE id in (SELECT MAX(id) FROM vh_product) LIMIT 1');

                    for (let i = 1; i < files.length; i++ ) {
                            let id_product = [result[0].id];
                            const images = {
                                id_product: id_product,
                                image: filename[i]
                            }
                            // console.log(images);
                            pool.query('INSERT INTO vh_product_image SET ?', images);
                        };
                    
                    const imageID:string = result[0].id;
                    // console.log(imageID);
                    id_prod = result[0].id
                }
                update();
                // console.log(id_prod);
                pool.query('UPDATE vh_product set image = ? WHERE id = ?', [id_prod +'.jpg',id_prod]);
                
                res.json({ message: 'Success' });
            }
        });
        this.router.delete('/:id', ProductController.delete);
        this.router.delete('/image/:id', ProductController.deleteImage);
        this.router.put('/:id', mUpload, (req, res, next) => {
            const { id } = req.params;
            const file = req.files['image'] as Express.Multer.File[];
            const files = req.files['mImage'] as Express.Multer.File[];
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
                }
                // console.log(product);
               pool.query('UPDATE vh_product SET ? WHERE id = ?', [product, id]);
               res.json({ message: 'Success' });
            } else if(files == null) {
                let originalname = file.map(function(file){
                    return file.originalname
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
                }
                // console.log(product);
               const start = async function() {
                pool.query('UPDATE vh_product SET ? WHERE id = ?', [product, id]);
                const result = await pool.query('SELECT id FROM vh_product WHERE id in (SELECT MAX(id) FROM vh_product) LIMIT 1');
                
                const imageID:string = result[0].id;
                // console.log(imageID);
                pool.query('UPDATE vh_product set image = ? WHERE id = ?', [imageID +'.jpg',imageID]);
                }
                start();

               res.json({ message: 'Success' });

            } else {
                let filename = files.map(function(file){
                    return file.originalname
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
                    image: filename[0],
                    nic: post.nic,
                   width: post.width,
                   height: post.height,
                   depth: post.depth,
                   weight: post.weight,
                   home: post.home,
                   video: post.video,
                   slug_url: post.slug
                }
                // console.log(filename);
                // console.log(product);

               const start = async function() {
                
                const insert = pool.query('UPDATE vh_product SET ? WHERE id = ?', [product, id]);
                return insert;
                }
                start();
                // console.log(product.name);
                
                var id_prod: string;
                id_prod = ""; 

                const update = async function() {
                    const result = await pool.query('SELECT id FROM vh_product WHERE id in (SELECT MAX(id) FROM vh_product) LIMIT 1');

                    const imagescheck = await pool.query('SELECT id_product FROM vh_product_image WHERE id_product = ?', result[0].id)
                    if (!imagescheck) {
                        for (let i = 1; i < files.length; i++ ) {
                                let id_product = [result[0].id];
                                const images = {
                                    id_product: id_product,
                                    image: filename[i]
                                }
                                // console.log(images);
                                pool.query('INSERT INTO vh_product_image SET ?', images);
                        };
                    } else {
                        for (let i = 1; i < files.length; i++ ) {
                            let id_product = [result[0].id];
                            const images = {
                                id_product: id_product,
                                image: filename[i]
                            }
                            // console.log(images);
                            pool.query('UPDATE vh_product_image SET ? WHERE id_product = ?', [images, result[0].id]);
                        };
                    }
                    const imageID:string = result[0].id;
                    // console.log(imageID);
                    id_prod = result[0].id
                }
                update();
                
                pool.query('UPDATE vh_product set image = ? WHERE id = ?', [id_prod +'.jpg',id_prod]);
                
                res.json({ message: 'Success' });
            }
        });
        this.router.put('/condition/:id', productcontroller.updateCondition);
        this.router.put('/discount/:id', productcontroller.updateDiscount);
        this.router.put('/upstat/:id', productcontroller.updateStatus);
        this.router.put('/uphome/:id', productcontroller.updateHome);
        this.router.put('/image/:id', upload.single('image'), (req, res, next) => {
            const file = req.file;
            const { id } = req.params;
            const image = {
                image: file.originalname
            }
            pool.query('UPDATE vh_product set ? WHERE id = ?', [image, id]);
            res.json({ message: 'Success' });
        });
        this.router.post('/images', upload.array('file', 5), (req, res, next) => {
            const files = req.files as Express.Multer.File[];

            let filename = files.map(function(file){
                return file.originalname
            });

            for (let i = 0; i < files.length; i++ ) {
                let id_product = [req.body.id];
                const images = {
                    id_product: id_product,
                    image: filename[i]
                }
                // console.log(images);
                pool.query('INSERT INTO vh_product_image SET ?', images);
            }

        })
    }



}

const productRoutes = new ProductRoutes();
export default productRoutes.router;