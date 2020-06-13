"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../../../controllers/auth/user/userController"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const unlinkAsync = util_1.promisify(fs_1.default.unlink);
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client/src/assets/img');
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
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});
class UserRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', userController_1.default.list);
        this.router.get('/:id', userController_1.default.detail);
        this.router.post('/', userController_1.default.create);
        /*
         (req, res, next) => {
            const file = req.file;

            const post = req.body;
            const user = {
                username: post.username,
                password: post.password,
                email: post.email,
                accessToken: post.accessToken,
                refreshToken: post.refreshToken,
                roles: post.roles,
                pic: file.originalname,
                fullname: post.fullname,
                occupation: post.occupation,
                companyName: post.companyName,
                phone: post.phone,
                address: post.address,
                status: post.status
            }
            pool.query('INSERT INTO vh_user_admin SET ?', user);
            res.json({ message: 'Success' });
        });
        */
        this.router.delete('/:id', userController_1.default.delete);
        this.router.put('/password/:id', userController_1.default.password);
        this.router.put('/upStatLog/:id', userController_1.default.upstatLog);
        this.router.put('/status/:id', userController_1.default.status);
        this.router.put('/:id', userController_1.default.update);
        /*
        (req, res, next) => {
            const file = req.file;
            const { id } = req.params;
            const post = req.body;
            const user = {
                username: post.username,
                password: post.password,
                email: post.email,
                accessToken: post.accessToken,
                refreshToken: post.refreshToken,
                roles: post.roles,
                pic: file.originalname,
                fullname: post.fullname,
                occupation: post.occupation,
                companyName: post.companyName,
                phone: post.phone,
                address: post.address,
                status: post.status
            }
            pool.query('UPDATE vh_user_admin set ? WHERE id = ?', [user, id]);
            res.json({ message: 'Success' });
        });
        */
    }
}
const userRoutes = new UserRoutes();
exports.default = userRoutes.router;
