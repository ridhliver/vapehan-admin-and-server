"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = __importDefault(require("../../../controllers/catalog/category/categoryController"));
const database_1 = __importDefault(require("../../../database"));
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images/categories');
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
class CategoryRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', categoryController_1.default.list);
        this.router.get('/cat', categoryController_1.default.catlist);
        this.router.get('/catchild', categoryController_1.default.catchild);
        this.router.get('/categories', categoryController_1.default.categorylist);
	this.router.get('/category/:id', categoryController_1.default.category);
        this.router.get('/listing', categoryController_1.default.listing);
        this.router.get('/:id', categoryController_1.default.detail);
        this.router.get('/name/:id', categoryController_1.default.detailName);
        this.router.post('/', upload.single('image'), (req, res, next) => {
            const file = req.file;
            if (file == null) {
                const post = req.body;
                const category = {
                    name: post.name,
                    id_parent: post.id_parent,
                    description: post.description,
                    image: 'no_banner.jpg',
                    slug_url: post.slug
                };
                // console.log(category);
                database_1.default.query('INSERT INTO vh_product_category (name, id_parent, description, image, slug_url, type, megaMenu) VALUES (?, ?, ?, ?, replace(?, " ", "-"), ?, ?)', [category.name, category.id_parent, category.description, category.image, category.slug_url, 'link', 0]);
                res.json({ message: 'Success' });
            } else {
                const post = req.body;
                const category = {
                    name: post.name,
                    id_parent: post.id_parent,
                    description: post.description,
                    image: file.originalname,
                    slug_url: post.slug
                };
                // console.log(category);
                database_1.default.query('INSERT INTO vh_product_category (name, id_parent, description, image, slug_url, type, megaMenu) VALUES (?, ?, ?, ?, replace(?, " ", "-"), ?, ?)', [category.name, category.id_parent, category.description, category.image, category.slug_url, 'link', 0]);
                res.json({ message: 'Success' });
            }
        });
        this.router.delete('/:id', categoryController_1.default.delete);
        this.router.put('/:id', upload.single('image'), (req, res, next) => {
            const file = req.file;
            const { id } = req.params;
            const post = req.body;
            if (file == null) {
                const category = {
                    name: post.name,
                    id_parent: post.id_parent,
                    description: post.description,
                    slug_url: post.slug
                };
                database_1.default.query('UPDATE vh_product_category SET name = ?, id_parent = ?, description = ?, slug_url = replace(?, " ", "-") WHERE id = ?', [category.name, category.id_parent, category.description, category.slug_url, id]);
                res.json({ message: 'Success' });
            }
            else {
                const category = {
                    name: post.name,
                    id_parent: post.id_parent,
                    description: post.description,
                    image: file.originalname,
                    slug_url: post.slug
                };
                database_1.default.query('UPDATE vh_product_category SET name = ?, id_parent = ?, description = ?, image = ?, slug_url = replace(?, " ", "-") WHERE id = ?', [category.name, category.id_parent, category.description, category.image, category.slug_url, id]);
                res.json({ message: 'Success' });
            }
        });
    }
}
const categoryRoutes = new CategoryRoutes();
exports.default = categoryRoutes.router;
