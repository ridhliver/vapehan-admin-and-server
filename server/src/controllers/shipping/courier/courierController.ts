import {Request, Response } from 'express';

import pool from '../../../database';

import http from 'https';

class CourierController {

    public async list(req: Request, res: Response) {
        const courier = await pool.query('SELECT * FROM vh_courier');
        res.json(courier);
    }

}

const couriercontroller = new CourierController();
export default couriercontroller;