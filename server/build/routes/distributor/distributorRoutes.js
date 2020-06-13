"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const distributorController_1 = __importDefault(require("../../controllers/distributor/distributorController"));
const database_1 = __importDefault(require("../../database"));
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images/distributors');
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
class DistributorRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', distributorController_1.default.list);
        this.router.get('/list', distributorController_1.default.listDIst);
        this.router.post('/', upload.single('image'), (req, res, next) => {
            const file = req.file;
            if (file == null) {
                const distributor = {
                    image: 'no_image.png',
                    name_dist: req.body.name,
                    description: req.body.description,
                    flag_stat: req.body.flag
                };
                // console.log(distributor);
                database_1.default.query('INSERT INTO vh_distributor set ?', [distributor]);
                res.json({ message: 'Success' });
            }
            else {
                const distributor = {
                    image: file.originalname,
                    name_dist: req.body.name,
                    description: req.body.description,
                    flag_stat: req.body.flag
                };
                // console.log(distributor);
                database_1.default.query('INSERT INTO vh_distributor set ?', [distributor]);
                res.json({ message: 'Success' });
            }
        });
        this.router.delete('/:id', distributorController_1.default.delete);
        this.router.put('/:id', upload.single('image'), (req, res, next) => {
            const file = req.file;
            const { id } = req.params;
            if (file == null) {
                const distributor = {
                    name_dist: req.body.name,
                    description: req.body.description,
                    flag_stat: req.body.flag
                };
                // console.log(distributor);
                database_1.default.query('UPDATE vh_distributor set ? WHERE id = ?', [distributor, id]);
                res.json({ message: 'Success' });
            }
            else {
                const distributor = {
                    image: file.originalname,
                    name_dist: req.body.name,
                    description: req.body.description,
                    flag_stat: req.body.flag
                };
                // console.log(distributor);
                database_1.default.query('UPDATE vh_distributor set ? WHERE id = ?', [distributor, id]);
                res.json({ message: 'Success' });
            }
        });
        this.router.put('/upFlag/:id', distributorController_1.default.updateFlag);
    }
}
const distributorRoutes = new DistributorRoutes();
exports.default = distributorRoutes.router;
