import { Router } from 'express';

import cinvoiceController from '../../../controllers/customer/invoice/cinvoiceController';

import pool from '../../../database';

class CInvoiceRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }
    
    config(): void {
        this.router.get('/:id', cinvoiceController.list);
        this.router.post('/', cinvoiceController.create);
       // this.router.delete('/:id', cinvoiceController.delete);
        this.router.put('/:id', cinvoiceController.update);
    }

}

const cinvoiceRoutes = new CInvoiceRoutes();
export default cinvoiceRoutes.router;