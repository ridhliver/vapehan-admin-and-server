import { Request, Response } from 'express';

import pool from '../../../database';

class RolesController {

    public async listing(req: Request, res: Response) {
        const roles = await pool.query('SELECT vh_user_roles_admin.id, title, vh_roles_permission.id_permissions as permissions, vh_user_roles_admin.isCoreRole FROM vh_user_roles_admin JOIN vh_roles_permission ON vh_user_roles_admin.id = vh_roles_permission.id_roles');
        // const id = roles.id;
        // console.log(roles);
        return res.json(roles);
	}
	
	/*
	public async list(req: Request, res: Response) {
        const roles = await pool.query('SELECT vh_user_roles_admin.id, title, vh_roles_permission.id_permissions as permissions, vh_user_roles_admin.isCoreRole FROM vh_user_roles_admin JOIN vh_roles_permission ON vh_user_roles_admin.id = vh_roles_permission.id_roles');
        //const id = roles.id;
        // console.log(id);
		return res.json(roles);
		
		res.json(roles.map(function(result: any) {
			if (result.isCoreRole === 1) {
				result.isCoreRole = true
			} else {
				result.isCoreRole = false
			}
			let _per = [];
			_per.push(result.permissions);
			let obj = {
				id: result.id,
				title: result.title,
				isCoreRole: result.isCoreRole,
				permissions: _per
			}
			
			return obj;
		}));
    }
	*/

    public async list(req: Request, res: Response) {
        const roles = await pool.query('SELECT * FROM vh_user_roles_admin');
        const id = roles.id;
        // console.log(id);
        return res.json(roles);
    }

    public async title(req: Request, res: Response) {
        const title = await pool.query('SELECT vh_user_roles_admin.* FROM vh_user_roles_admin JOIN vh_user_admin ON vh_user_roles_admin.id = vh_user_admin.roles');
        return res.json(title);
    }

    public async getId(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const roles = await pool.query('SELECT vh_user_roles_admin.*, vh_roles_permission.id_permissions as permissions FROM vh_user_roles_admin JOIN vh_roles_permission ON vh_user_roles_admin.id = vh_roles_permission.id_roles WHERE vh_user_roles_admin.id = ?', [id]);
        /*
        res.json(roles.reduce(function(result: any, current: any) {
            let obj = {};
            obj = current.permissions;
            current.permissions|| [];
            // obj[current.title] = current.isCoreRole;
            result[current.permissions].push(obj);
            
            return result; 
           
        }));
        */
        if (roles.length > 0) {
            return res.json(roles[0]);
        }
        res.status(404).json({ text: "Roles doesn't exists" });

    }

    public async detail(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const roles = await pool.query('SELECT * FROM vh_user_roles_admin WHERE id = ?', [id]);
        if (roles.length > 0) {
            return res.json(roles[0]);
        }
        res.status(404).json({ text: "Roles doesn't exists" });
    }

    public async create(req: Request, res: Response): Promise<void> {
        const post = req.body;
        const title = post.title;
        const isCoreRole = post.isCoreRole
    
        let sql = "INSERT INTO vh_user_roles_admin (title, isCoreRole) VALUES ('"+title+"', '"+isCoreRole+"')";
        await pool.query(sql, function(err: any, result: any) {
            if (err) throw err;
            for (let i = 0; i < post.permissions.length; i++ ) {
                let id_roles = [result.insertId];
                const permissions = {
                    id_roles: id_roles,
                    id_permissions: post.permissions[i]
                }
                console.log(permissions);
                pool.query('INSERT INTO vh_roles_permission SET ?', permissions);
            }
        });

        res.json({ message: 'Success' });
    }

    public async delete(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const roles = await pool.query('SELECT id FROM vh_user_roles_admin WHERE id = ? ', [id]);
        await pool.query('DELETE vh_user_roles_admin.*, vh_roles_permission.* FROM vh_user_roles_admin JOIN vh_roles_permission ON vh_user_roles_admin.id = vh_roles_permission.id_roles WHERE vh_user_roles_admin.id = ?', [id]);
        if (roles == "") {
            res.status(404).json({ text: "Roles doesn't exists" });
        } else {
            res.json({ text: 'Success Delete' });
        }
    }

    public async update(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const roles = await pool.query('SELECT id FROM vh_user_roles_admin WHERE id = ?', [id]);
        await pool.query('UPDATE vh_user_roles_admin set ? WHERE id = ?', [req.body, id]);
        if (roles == "") {
            res.status(404).json({ text: "Roles doesn't exists" });
        } else {
            res.json({ message: 'The Roles was Update' });
        }
    }
}

const rolescontroller = new RolesController();
export default rolescontroller;