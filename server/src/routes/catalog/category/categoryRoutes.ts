import { Router } from 'express';

import CategoryController from '../../../controllers/catalog/category/categoryController';

import pool from '../../../database';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './images/categories');
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

class CategoryRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/', CategoryController.list);
        this.router.get('/cat', CategoryController.catlist);
        this.router.get('/catchild', CategoryController.catchild);
        this.router.get('/categories', CategoryController.categorylist);
        this.router.get('/listing', CategoryController.listing);
        this.router.get('/:id', CategoryController.detail);
        this.router.get('/name/:id', CategoryController.detailName);
        this.router.post('/',  upload.single('image'), (req, res, next) => {
            const file = req.file;
            if (file == null) {
                const post = req.body;
            const category = {
                name: post.name,
                id_parent: post.id_parent,
                description: post.description,
                image: 'no_banner.jpg',
                slug_url: post.slug
            }
            // console.log(category);
            pool.query('INSERT INTO vh_product_category (name, id_parent, description, image, slug_url, type, megaMenu) VALUES (?, ?, ?, ?, replace(?, " ", "-"))', [category.name, category. id_parent, category.description, category.image, category.slug_url, 'link', 0]);
            res.json({ message: 'Success' });
            } else {
            const post = req.body;
            const category = {
                name: post.name,
                id_parent: post.id_parent,
                description: post.description,
                image: file.originalname,
                slug_url: post.slug
            }
            // console.log(category);
            pool.query('INSERT INTO vh_product_category (name, id_parent, description, image, slug_url, type, megaMenu) VALUES (?, ?, ?, ?, replace(?, " ", "-"))', [category.name, category. id_parent, category.description, category.image, category.slug_url, 'link', 0]);
            res.json({ message: 'Success' });
            }
        });
        this.router.delete('/:id', CategoryController.delete);
        this.router.put('/:id',upload.single('image'), (req, res, next) => {
            const file = req.file;
            const { id } = req.params;
            const post = req.body;
            if (file == null) {
                const category = {
                    name: post.name,
                    id_parent: post.id_parent,
                    description: post.description,
                    slug_url: post.slug
                }
                pool.query('UPDATE vh_product_category SET name = ?, id_parent = ?, description = ?, slug_url = replace(?, " ", "-") WHERE id = ?', [category.name, category.id_parent, category.description, category.slug_url, id]);
                res.json({ message: 'Success' });
            } else { 
            const category = {
                name: post.name,
                id_parent: post.id_parent,
                description: post.description,
                image: file.originalname,
                slug_url: post.slug
            }
            pool.query('UPDATE vh_product_category SET name = ?, id_parent = ?, description = ?, image = ?, slug_url = replace(?, " ", "-") WHERE id = ?', [category.name, category.id_parent, category.description, category.image, category.slug_url, id]);
            res.json({ message: 'Success' });
            }
        });
    }
}

const categoryRoutes = new CategoryRoutes();
export default categoryRoutes.router;
