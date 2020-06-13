import { Router } from 'express';

import BrandController from '../../../controllers/catalog/brand/brandController';
import pool from '../../../database';

import multer from 'multer';

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './images/brands');
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

class BrandRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/', BrandController.list);
        this.router.get('/:id', BrandController.detail);
        this.router.post('/', upload.single('image'), (req, res, next) => {
            const file = req.file;
            if (file == null ) {
                const brand = {
                    image: 'no_brand.png',
                    name: req.body.name,
                    description: req.body.description
                }
                console.log(brand);
                pool.query('INSERT INTO vh_product_brand set ?', [brand]);
                res.json({ message: 'Success' });
            } else {
                const brand = {
                    image: file.originalname,
                    name: req.body.name,
                    description: req.body.description
                }
                console.log(brand);
                pool.query('INSERT INTO vh_product_brand set ?', [brand]);
                res.json({ message: 'Success' });
            }
            
           
        });
        this.router.delete('/:id', BrandController.delete);
        this.router.put('/:id', upload.single('image'), (req, res, next) => {
            const file = req.file;
            const { id } = req.params;
            if (file == null ) {
                const brand = {
                    name: req.body.name,
                    description: req.body.description
                }
                console.log(brand);
                pool.query('UPDATE vh_product_brand set ? WHERE id = ?', [brand, id]);
                res.json({ message: 'Success' });
            } else {
                const brand = {
                    image: file.originalname,
                    name: req.body.name,
                    description: req.body.description
                }
                console.log(brand);
                pool.query('UPDATE vh_product_brand set ? WHERE id = ?', [brand, id]);
                res.json({ message: 'Success' });
            }
            
           
        });
    }
}

const brandRoutes = new BrandRoutes();
export default brandRoutes.router;