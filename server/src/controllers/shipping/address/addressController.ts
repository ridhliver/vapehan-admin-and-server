import {Request, Response } from 'express';

import pool from '../../../database';

import http from 'https';

class AddressController {

    public async list(req: Request, res: Response) {
        const { id } = req.params;
        const address = await pool.query('SELECT * FROM vh_address WHERE district = ?', [id]);
        // console.log(address);
        res.json(address);
    }

}

const addresscontroller = new AddressController();
export default addresscontroller;