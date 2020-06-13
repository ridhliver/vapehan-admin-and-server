import { Router } from 'express';

import RolesController from '../../../controllers/auth/roles/rolesController';

import pool from '../../../database';


class RolesRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/', RolesController.list);
        this.router.get('/permission', RolesController.listing);
        this.router.get('/title', RolesController.title);
        this.router.get('/getId/:id', RolesController.getId);
        this.router.get('/:id', RolesController.detail);
        this.router.post('/', RolesController.create);
        this.router.delete('/:id', RolesController.delete);
        this.router.put('/:id', RolesController.update);
    }
}

const rolesRoutes = new RolesRoutes();
export default rolesRoutes.router;