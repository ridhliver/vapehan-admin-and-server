import {Request, Response } from 'express';

class IndexController {

    public index (req: Request, res: Response) {
        res.send('hai')
    }

}

export const indexController = new IndexController();