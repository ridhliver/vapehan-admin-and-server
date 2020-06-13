import { Router } from 'express';

import RegisterController from '../../../controllers/customer/register/RegisterController';

import pool from '../../../database';
import multer from 'multer';

 

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../client/src/assets/img/customer');
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

let mUpload = upload.fields([{name: 'image', maxCount: 1}, {name: 'mImage', maxCount: 5}]);

class RegisterRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }
    
    config(): void {
        this.router.get('/', RegisterController.list);
        this.router.get('/find/account/:id', RegisterController.find);
        this.router.get('/:id', RegisterController.detail);
        this.router.get('/info/all', RegisterController.biodata);
        this.router.get('/account/:id', RegisterController.findAccount)
        this.router.post('/', RegisterController.create);

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
            }
            // console.log(info);
            pool.query('INSERT INTO vh_customer_info SET ?', info);
            res.json({ message: 'Success' })
            
        });

        this.router.post('/login/customer', RegisterController.login);
        this.router.post('/forget/send/:id', RegisterController.sendMail);
        this.router.post('/account/address/:id', RegisterController.addAddress)
        // this.router.put('/active/:id', RegisterController.active);
        this.router.delete('/:id', RegisterController.delete);
        this.router.put('/:id', RegisterController.update);
        this.router.put('/phone/:id', RegisterController.updatePhone);
        this.router.put('/verify/:id', RegisterController.verify);
        this.router.put('/account/address/:id', RegisterController.editAddress);
        this.router.put('/account/info/:id', RegisterController.editInfo);
        this.router.put('/account/contact/:id', RegisterController.editContact);
        this.router.put('/account/password/:id', RegisterController.editPassword);
        // this.router.put('/active/:id', RegisterController.active)
    }

}

const registerRoutes = new RegisterRoutes();
export default registerRoutes.router;