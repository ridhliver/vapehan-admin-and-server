import { Router } from 'express';

import AddressController from '../../../controllers/shipping/address/addressController';

import pool from '../../../database';

class AddressRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }
    
    config(): void {
        this.router.get('/:id', AddressController.list);
    }



}

const addressRoutes = new AddressRoutes();
export default addressRoutes.router;