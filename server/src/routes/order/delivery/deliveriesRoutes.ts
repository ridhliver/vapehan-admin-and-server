import { Router } from 'express';

import DeliveryController from '../../../controllers/order/delivery/deliveriesController';

import pool from '../../../database';

class DeliveryRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }
    
    config(): void {
        this.router.get('/', DeliveryController.list);
        this.router.get('/:id', DeliveryController.detail);
        this.router.get('/order/:id', DeliveryController.shipping);
        this.router.post('/', DeliveryController.create);
        this.router.delete('/:id', DeliveryController.delete);
        this.router.put('/:id', DeliveryController.update);
        this.router.put('/done/:id', DeliveryController.Done);
    }



}

const deliveryRoutes = new DeliveryRoutes();
export default deliveryRoutes.router;