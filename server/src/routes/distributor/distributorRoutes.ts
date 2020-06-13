import { Router } from 'express';

import DistributorController from '../../controllers/distributor/distributorController';

import pool from '../../database';
import multer from 'multer';

 

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../client/src/assets/img/customer');
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
        fileSize: 1280 * 1280 * 5
    },
    fileFilter: fileFilter
});

let mUpload = upload.fields([{name: 'image', maxCount: 1}, {name: 'mImage', maxCount: 5}]);

class DistributorRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }
    
    config(): void {
        this.router.get('/', DistributorController.list);
        this.router.post('/', upload.single('image'), (req, res, next) => {
            const file = req.file;
            if (file == null ) {
                const distributor = {
                    image: 'no_image.png',
                    name_dist: req.body.name,
                    description: req.body.description,
                    flag_stat: req.body.flag
                }
                // console.log(distributor);
                pool.query('INSERT INTO vh_distributor set ?', [distributor]);
                res.json({ message: 'Success' });
            } else {
                const distributor = {
                    image: file.originalname,
                    name_dist: req.body.name,
                    description: req.body.description,
                    flag_stat: req.body.flag
                }
                // console.log(distributor);
                pool.query('INSERT INTO vh_distributor set ?', [distributor]);
                res.json({ message: 'Success' });
            }
            
           
        });
        this.router.delete('/:id', DistributorController.delete);
        this.router.put('/:id', upload.single('image'), (req, res, next) => {
            const file = req.file;
            const { id } = req.params;
            if (file == null ) {
                const distributor = {
                    name_dist: req.body.name,
                    description: req.body.description,
                    flag_stat: req.body.flag
                }
                // console.log(distributor);
                pool.query('UPDATE vh_distributor set ? WHERE id = ?', [distributor, id]);
                res.json({ message: 'Success' });
            } else {
                const distributor = {
                    image: file.originalname,
                    name_dist: req.body.name,
                    description: req.body.description,
                    flag_stat: req.body.flag
                }
                // console.log(distributor);
                pool.query('UPDATE vh_distributor set ? WHERE id = ?', [distributor, id]);
                res.json({ message: 'Success' });
            }
        });
        this.router.put('/upFlag/:id', DistributorController.updateFlag);
    }

}

const distributorRoutes = new DistributorRoutes();
export default distributorRoutes.router;