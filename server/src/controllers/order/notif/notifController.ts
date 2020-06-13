import {Request, Response } from 'express';

import pool from '../../../database';

class NotifController {

    public async orderlist(req: Request, res: Response) {
        const notif = await pool.query('SELECT COUNT(id_order) as notif FROM vh_order WHERE status = 0');
        res.json(notif[0]);
    }

    public async confirmlist(req: Request, res: Response) {
        const notif = await pool.query('SELECT COUNT(transaction_id) as notif FROM vh_confirm_order WHERE status = 0');
        res.json(notif[0]);
    }

}

const notifcontroller = new NotifController();
export default notifcontroller;