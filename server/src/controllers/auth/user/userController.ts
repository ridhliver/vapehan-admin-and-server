import { Request, Response } from 'express';

import pool from '../../../database';

import md5 from 'md5';

class UserController {

    public async list(req: Request, res: Response) {
        const user = await pool.query('SELECT vh_user_admin.*, vh_user_roles_admin.title as title FROM vh_user_admin, vh_user_roles_admin WHERE vh_user_roles_admin.id = vh_user_admin.roles');
        return res.json(user);
        /*
         res.json(user.map(function(result: any,current: any) {
            let obj = 
                {
                    id: result.id,
                    username: result.username,
                    password: '',
                    email: result.email,
                    roles: [result.roles],
                    fullname: result.fullname,
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                    pic: result.pic,
                    occupation: result.occupation,
                    companyName: result.companyName,
                    phone: result.phone,
                    address: result.address,
                    status: result.status,
                    title: result.title
                }
            
            return obj;
        }));
        */
    }

    public async detail(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const user = await pool.query('SELECT * FROM vh_user_admin WHERE id = ?', [id]);
        if (user.length > 0) {
            return res.json(user[0]);
        }
        res.status(404).json({ text: "User doesn't exists" });
    }

    public async create(req: Request, res: Response): Promise<void> {
        const post = req.body;
        const user = {
            username: post.username,
            password: md5(post.password),
            email: post.email,
            roles: '3',
            fullname: post.fullname,
            accessToken: post.accessToken,
            refreshToken: post.refreshToken,
            pic: 'default.jpg',
            occupation: post.occupation,
            companyName: post.companyName,
            phone: post.phone,
            address: '',
            status: 0
        }
        await pool.query('INSERT INTO vh_user_admin set ? ', [user]);
        res.json({ message: 'Success' });
    }

    public async delete(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const user = await pool.query('SELECT id FROM vh_user_admin WHERE id = ? ', [id]);
        await pool.query('DELETE FROM vh_user_admin WHERE id = ?', [id]);
        if (user == "") {
            res.status(404).json({ text: "User doesn't exists" });
        } else {
            res.json({ text: 'Success Delete' });
        }
    }

    public async update(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const post = req.body;
        const _user = {
            username: post.username,
            password: md5(post.password),
            email: post.email,
            roles: post.roles,
            fullname: post.fullname,
            accessToken: post.accessToken,
            refreshToken: post.refreshToken,
            occupation: post.occupation,
            companyName: post.companyName,
            phone: post.phone,
            address: post.address.addressLine
        }
        const user = await pool.query('SELECT id FROM vh_user_admin WHERE id = ?', [id]);
        await pool.query('UPDATE vh_user_admin set ? WHERE id = ?', [_user, id]);
        if (user == "") {
            res.status(404).json({ text: "User doesn't exists" });
        } else {
            res.json({ message: 'The User was Update' });
        }
    }

    public async password(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const post = req.body;
        const _user = {
            username: post.username,
            password: md5(post.password),
            email: post.email,
            fullname: post.fullname,
            accessToken: post.accessToken,
            refreshToken: post.refreshToken,
            occupation: post.occupation,
            companyName: post.companyName,
            phone: post.phone,
        }
        const user = await pool.query('SELECT id FROM vh_user_admin WHERE id = ?', [id]);
        await pool.query('UPDATE vh_user_admin set ? WHERE id = ?', [_user, id]);
        if (user == "") {
            res.status(404).json({ text: "User doesn't exists" });
        } else {
            res.json({ message: 'The User was Update' });
        }
    }

    public async status(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const post = req.body;
        const _user = {
            username: post.username,
            password: md5(post.password),
            email: post.email,
            fullname: post.fullname,
            accessToken: post.accessToken,
            refreshToken: post.refreshToken,
            occupation: post.occupation,
            companyName: post.companyName,
            phone: post.phone,
            status: post.status
        }
        const user = await pool.query('SELECT id FROM vh_user_admin WHERE id = ?', [id]);
        await pool.query('UPDATE vh_user_admin set ? WHERE id = ?', [_user, id]);
        if (user == "") {
            res.status(404).json({ text: "User doesn't exists" });
        } else {
            res.json({ message: 'The User was Update' });
        }
    }
}

const usercontroller = new UserController();
export default usercontroller;