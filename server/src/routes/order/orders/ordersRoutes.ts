import { Router } from 'express';

import OrderController from '../../../controllers/order/orders/ordersController';

import pool from '../../../database';

class OrderRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }
    
    config(): void {
        this.router.get('/', OrderController.list);
        this.router.get('/getProduct/:id', OrderController.getProductCart);
        this.router.get('/getProductTotal/:id', OrderController.getProductCartTotal);
        this.router.get('/orderHeaderA/:id', OrderController.orderHeaderA);
		this.router.get('/orderHeaderB/:id', OrderController.orderHeaderB);
		this.router.get('/detailOrder/:id', OrderController.orderDetail);
        this.router.post('/', OrderController.create);
        this.router.post('/:id', OrderController.detail);
        this.router.post('/re/send/order/:id', OrderController.resendemailOrder);
        this.router.post('/send/invoice/:id', OrderController.sendInvoice);
        this.router.delete('/:id', OrderController.delete);
        this.router.put('/:id', OrderController.update);
        this.router.put('/status/:id', OrderController.updateStatus);
        this.router.put('/status/accPay/:id', OrderController.accPayment);
    }



}

const orderRoutes = new OrderRoutes();
export default orderRoutes.router;