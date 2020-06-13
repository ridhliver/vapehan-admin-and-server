"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registerController_1 = __importDefault(require("./../../../controllers/customer/register/registerController"));
const database_1 = __importDefault(require("../../../database"));
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client/src/assets/img/customer');
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
class RegisterRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', registerController_1.default.list);
        this.router.get('/find/account/:id', registerController_1.default.find);
        this.router.get('/:id', registerController_1.default.detail);
        this.router.get('/info/all', registerController_1.default.biodata);
        this.router.get('/account/:id', registerController_1.default.findAccount);
        this.router.post('/resend/verification', registerController_1.default.resendEmail);
        this.router.post('/', registerController_1.default.create);
        this.router.post('/info', upload.single('image'), (req, res, next) => {
            const file = req.file;
            const post = req.body;
            const info = {
                id_customer: post.id,
                image: file.originalname,
                gender: post.gender,
                phone: post.phone,
                dob: post.dob,
                address: post.address,
                id_province: post.id_province,
                id_city: post.id_city,
                id_district: post.id_district,
                postal: post.postal
            };
            // console.log(info);
            database_1.default.query('INSERT INTO vh_customer_info SET ?', info);
            res.json({ message: 'Success' });
        });
        this.router.post('/login/customer', registerController_1.default.login);
        this.router.post('/forget/send/:id', registerController_1.default.sendMail);
        this.router.post('/account/address/:id', registerController_1.default.addAddress);
        this.router.post('/send/massage/contact', registerController_1.default.sendMassage);
        this.router.post('/katsuragi/r', registerController_1.default.activeallcust);
        // this.router.put('/active/:id', registerController.active);
        this.router.delete('/:id', registerController_1.default.delete);
        this.router.put('/:id', registerController_1.default.update);
        this.router.put('/phone/:id', registerController_1.default.updatePhone);
        this.router.put('/verify/:id', registerController_1.default.verify);
        this.router.put('/account/profile/:id', registerController_1.default.editProfile);
        this.router.put('/account/address/:id', registerController_1.default.editAddress);
        this.router.put('/account/info/:id', registerController_1.default.editInfo);
        this.router.put('/account/contact/:id', registerController_1.default.editContact);
        this.router.put('/account/password/:id', registerController_1.default.editPassword);
        // this.router.put('/active/:id', registerController.active)
    }
}
const registerRoutes = new RegisterRoutes();
exports.default = registerRoutes.router;
