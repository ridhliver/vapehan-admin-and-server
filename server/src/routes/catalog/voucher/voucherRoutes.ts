import { Router } from 'express';

import VoucherController from '../../../controllers/catalog/voucher/voucherController';

import pool from '../../../database';

class VoucherRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/', VoucherController.list);
        this.router.get('/getActive', VoucherController.getVochActive);
        this.router.get('/:id', VoucherController.detail);
        this.router.get('/find', VoucherController.find);
        this.router.post('/',  VoucherController.create);
        this.router.delete('/:id', VoucherController.delete);
        this.router.put('/:id', VoucherController.update);
        this.router.put('/upStat/:id', VoucherController.updateStat);
    }
}

const voucherRoutes = new VoucherRoutes();
export default voucherRoutes.router;
