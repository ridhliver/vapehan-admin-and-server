import { Router } from 'express';

import CourierController from '../../../controllers/shipping/courier/courierController';

import pool from '../../../database';

class CourierRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }
    
    config(): void {
        this.router.get('/', CourierController.list);
    }



}

const courierRoutes = new CourierRoutes();
export default courierRoutes.router;