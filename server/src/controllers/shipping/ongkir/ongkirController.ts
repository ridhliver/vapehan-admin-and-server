import {Request, Response } from 'express';

import pool from '../../../database';

import http from 'https';

class OngkirController {

    public async list(req: Request, res: Response) {
        const  code = req.body.code;
        const id = req.body.id_courier
        const ongkir = await pool.query('SELECT * FROM vh_ongkir WHERE dest_code = ? AND id_courier = ?', [code,id]);
        // console.log(ongkir);
        res.json(ongkir);
    }

    public async ongkir(req: Request, res: Response) {
        const { id } = req.params;
        const harga = await pool.query('SELECT * FROM vh_ongkir WHERE id = ? LIMIT 1', [id]);
        // console.log(harga);
        res.json(harga);
    }

    public async orderOngkir(req: Request, res: Response) {
        const { id } = req.params;
        const shipping = await pool.query('SELECT * FROM vh_shipping WHERE id_order = ? LIMIT 1', [id]);
        // console.log(shipping);
        res.json(shipping[0]);
    }

}

const ongkircontroller = new OngkirController();
export default ongkircontroller;