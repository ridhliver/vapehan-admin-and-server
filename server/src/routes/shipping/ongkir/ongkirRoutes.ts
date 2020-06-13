import { Router } from 'express';

import OngkirController from '../../../controllers/shipping/ongkir/ongkirController';

import pool from '../../../database';

class OngkirRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }
    
    config(): void {
        this.router.post('/', OngkirController.list);
        this.router.get('/:id', OngkirController.ongkir);
        this.router.get('/order/:id', OngkirController.orderOngkir);
    }



}

const ongkirRoutes = new OngkirRoutes();
export default ongkirRoutes.router;