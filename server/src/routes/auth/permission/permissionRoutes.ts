import { Router } from 'express';

import PermissionController from '../../../controllers/auth/permission/permissionController';

import pool from '../../../database';


class PermissionRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/', PermissionController.list);
        this.router.get('/getRolePermission/:id', PermissionController.getRolePermission)
        this.router.get('/:id', PermissionController.detail);
        this.router.post('/', PermissionController.create);
        this.router.delete('/:id', PermissionController.delete);
        this.router.put('/:id', PermissionController.update);
    }
}

const permissionRoutes = new PermissionRoutes();
export default permissionRoutes.router;