import { Router } from 'express';

import CartController from '../../../controllers/order/cart/cartController';

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

class CartRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }
    
    config(): void {
        this.router.get('/', CartController.list);
        this.router.get('/getCart/:id', CartController.getCart);
        this.router.get('/updateqtyCartinc/:id', CartController.updateqtyProductinc);
        this.router.get('/updateqtyCartdec/:id', CartController.updateqtyProductdec);
     // this.router.get('/shipping', CartController.shipping);
        this.router.get('/:id', CartController.detail);
        this.router.post('/', CartController.create);
        this.router.post('/createCart', CartController.createCart);
        this.router.delete('/:id', CartController.delete);
        this.router.delete('/deleteCart/:id', CartController.deleteProduct);
        this.router.put('/:id', CartController.update);
    }



}

const cartRoutes = new CartRoutes();
export default cartRoutes.router;