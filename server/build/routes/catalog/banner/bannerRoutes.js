"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bannerController_1 = __importDefault(require("../../../controllers/catalog/banner/bannerController"));
const database_1 = __importDefault(require("../../../database"));
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images/banners');
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
class BannerRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', bannerController_1.default.list);
        this.router.get('/banner', bannerController_1.default.listbanner);
        this.router.get('/:id', bannerController_1.default.detail);
        this.router.post('/', upload.single('image'), (req, res, next) => {
            const file = req.file;
            if (file == null) {
                const banner = {
                    image: 'no_image.png',
                    description: req.body.description,
                    hyperlink: req.body.hyperlink,
                    status: req.body.status
                };
                // console.log(banner);
                database_1.default.query('INSERT INTO vh_banner set ?', [banner]);
                res.json({ message: 'Success' });
            }
             else {
                const banner = {
                    image: file.originalname,
                    description: req.body.description,
                    hyperlink: req.body.hyperlink,
                    status: req.body.status
                };
                // console.log(banner);
                database_1.default.query('INSERT INTO vh_banner set ?', [banner]);
                res.json({ message: 'Success' });
            }
        });
        this.router.delete('/:id', bannerController_1.default.delete);
        this.router.put('/:id', upload.single('image'), (req, res, next) => {
            const file = req.file;
            const { id } = req.params;
            if (file == null) {
                const banner = {
                    description: req.body.description,
                    hyperlink: req.body.hyperlink,
                    status: req.body.status
                };
                // console.log(banner);
                database_1.default.query('UPDATE vh_banner set ? WHERE id = ?', [banner, id]);
                res.json({ message: 'Success' });
            }
            else {
                const banner = {
                    image: file.originalname,
                    description: req.body.description,
                    hyperlink: req.body.hyperlink,
                    status: req.body.status
                };
                // console.log(banner);
                database_1.default.query('UPDATE vh_banner set ? WHERE id = ?', [banner, id]);
                res.json({ message: 'Success' });
            }
        });
        this.router.put('/upstat/:id', bannerController_1.default.updateStatus);
    }
}
const bannerRoutes = new BannerRoutes();
exports.default = bannerRoutes.router;
