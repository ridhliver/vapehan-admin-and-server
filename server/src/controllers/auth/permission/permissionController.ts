import { Request, Response } from 'express';

import pool from '../../../database';

class PermissionController {

    public async list(req: Request, res: Response) {
        const permission = await pool.query('SELECT * FROM vh_permissions_auth');
        return res.json(permission);
    }

    public async getRolePermission(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        // console.log(id);
        const getPermission = await pool.query('SELECT vh_permissions_auth.* FROM vh_permissions_auth JOIN vh_roles_permission ON vh_permissions_auth.id = vh_roles_permission.id_permissions JOIN vh_user_roles_admin ON vh_user_roles_admin.id = vh_roles_permission.id_roles WHERE vh_user_roles_admin.id = ?', [id]);
       // const { id_per } = getPermission.id_permissions;
        // const permission = await pool.query('SELECT * FROM vh_permissions_auth WHERE id = ?' [id_per]);
        return res.json(getPermission);
    }

    public async detail(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const permission = await pool.query('SELECT * FROM vh_permissions_auth WHERE id = ?', [id]);
        if (permission.length > 0) {
            return res.json(permission[0]);
        }
        res.status(404).json({ text: "Permission doesn't exists" });
    }

    public async create(req: Request, res: Response): Promise<void> {
        await pool.query('INSERT INTO vh_permissions_auth set ? ', [req.body]);
        res.json({ message: 'Success' });
    }

    public async delete(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const permission = await pool.query('SELECT id FROM vh_permissions_auth WHERE id = ? ', [id]);
        await pool.query('DELETE FROM vh_permissions_auth WHERE id = ?', [id]);
        if (permission == "") {
            res.status(404).json({ text: "Permission doesn't exists" });
        } else {
            res.json({ text: 'Success Delete' });
        }
    }

    public async update(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const permission = await pool.query('SELECT id FROM vh_permissions_auth WHERE id = ?', [id]);
        await pool.query('UPDATE vh_permissions_auth set ? WHERE id = ?', [req.body, id]);
        if (permission == "") {
            res.status(404).json({ text: "Permission doesn't exists" });
        } else {
            res.json({ message: 'The Permission was Update' });
        }
    }
}

const permissioncontroller = new PermissionController();
export default permissioncontroller;