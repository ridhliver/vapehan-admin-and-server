import { Router } from 'express';

import InvoiceController from '../../../controllers/order/invoice/invoicesController';

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

class DeliveryRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }
    
    config(): void {
        this.router.get('/', InvoiceController.list);
        this.router.get('/:id', InvoiceController.detail);
        this.router.get('/vouch/:id', InvoiceController.listvouch);
        this.router.get('/order/:id', InvoiceController.detailInvoice);
        this.router.post('/', InvoiceController.create);
        this.router.delete('/:id', InvoiceController.delete);
        this.router.put('/:id', InvoiceController.update);
    }



}

const deliveryRoutes = new DeliveryRoutes();
export default deliveryRoutes.router;