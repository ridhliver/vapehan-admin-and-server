import { Request, Response } from 'express';

import pool from '../../../database';

class companyController {

    public async listing(req: Request, res: Response) {
        const company = await pool.query('SELECT * FROM vh_company_profile LIMIT 1');
        return res.json(company[0]);
	}
	
	
}

const companycontroller = new companyController();
export default companycontroller;