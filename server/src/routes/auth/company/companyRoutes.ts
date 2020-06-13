import { Router } from 'express';

import CompanyController from '../../../controllers/auth/company/companyController';

import pool from '../../../database';


class CompanyRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/', CompanyController.listing);
    }
}

const companyRoutes = new CompanyRoutes();
export default companyRoutes.router;