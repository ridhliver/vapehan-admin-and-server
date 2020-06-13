import { Router } from 'express';

import UserController from '../../../controllers/auth/user/userController';

import pool from '../../../database';
import multer from 'multer';
import fs from 'fs';
import { promisify } from 'util';
 
const unlinkAsync = promisify(fs.unlink);

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../client/src/assets/img');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req: any, file: any, cb: any) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

const upload = multer({
    storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

class UserRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/', UserController.list);
        this.router.get('/:id', UserController.detail);
        this.router.post('/', UserController.create);
        /*
         (req, res, next) => {
            const file = req.file;

            const post = req.body;
            const user = {
                username: post.username,
                password: post.password,
                email: post.email,
                accessToken: post.accessToken,
                refreshToken: post.refreshToken,
                roles: post.roles,
                pic: file.originalname,
                fullname: post.fullname,
                occupation: post.occupation,
                companyName: post.companyName,
                phone: post.phone,
                address: post.address,
                status: post.status
            }
            pool.query('INSERT INTO vh_user_admin SET ?', user);
            res.json({ message: 'Success' });
        });
        */
        this.router.delete('/:id', UserController.delete);
        this.router.put('/password/:id', UserController.password);
        this.router.put('/status/:id', UserController.status);
        this.router.put('/:id', UserController.update);
        /* 
        (req, res, next) => {
            const file = req.file;
            const { id } = req.params;
            const post = req.body;
            const user = {
                username: post.username,
                password: post.password,
                email: post.email,
                accessToken: post.accessToken,
                refreshToken: post.refreshToken,
                roles: post.roles,
                pic: file.originalname,
                fullname: post.fullname,
                occupation: post.occupation,
                companyName: post.companyName,
                phone: post.phone,
                address: post.address,
                status: post.status
            }
            pool.query('UPDATE vh_user_admin set ? WHERE id = ?', [user, id]);
            res.json({ message: 'Success' });
        });
        */
    }
}

const userRoutes = new UserRoutes();
export default userRoutes.router;