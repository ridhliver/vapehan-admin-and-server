import { Router } from 'express';

import ConfirmController from '../../../controllers/order/confirm/confirmController';

import pool from '../../../database';
import multer from 'multer';

 

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../client/src/assets/img/product');
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

class OrderRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }
    
    config(): void {
        this.router.get('/', ConfirmController.list);
        // this.router.get('/images/:id', ConfirmController.Imagelist);
        this.router.get('/:id', ConfirmController.detail);
        // this.router.post('/', ConfirmController.create);
        this.router.post('/confirm', ConfirmController.confirm);
        this.router.put('/confirmPay/:id', ConfirmController.onProcess);
        this.router.delete('/:id', ConfirmController.delete);
        // this.router.delete('/image/:id', ConfirmController.deleteImage);
       // this.router.put('/:id', ConfirmController.update);
    }



}

const orderRoutes = new OrderRoutes();
export default orderRoutes.router;