import { Router } from 'express';

import DiscountController from '../../../controllers/catalog/discount/discountController';

import pool from '../../../database';

class DiscountRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/', DiscountController.list);
        this.router.get('/generateNo', DiscountController.generate)
        this.router.post('/',  DiscountController.create);
        this.router.post('/addDisc', DiscountController.addDisc);
        this.router.delete('/:id', DiscountController.delete);
        this.router.delete('/dropProd/disc/:id', DiscountController.dropProduct);
        this.router.put('/:id', DiscountController.update);
        this.router.put('/upStat/:id', DiscountController.updateStat);
    }
}

const discountRoutes = new DiscountRoutes();
export default discountRoutes.router;
