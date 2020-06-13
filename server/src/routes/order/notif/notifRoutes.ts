import { Router } from 'express';

import NotifController from '../../../controllers/order/notif/notifController';

import pool from '../../../database';

class NotifRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }
    
    config(): void {
        this.router.get('/', NotifController.orderlist);
        this.router.get('/confirm', NotifController.confirmlist);
       
    }



}

const notifRoutes = new NotifRoutes();
export default notifRoutes.router;