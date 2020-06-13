import { Router } from 'express';
const path = require('path');
import { sendemailontroller } from '../controllers/sendEmail';
var fs = require('fs');
var http = require('http');

class SendEmailRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/', (req, res) => {
            fs.open('./views/test.html', 'w+', function (err: any, file: any) {
                if (err) throw err;
                
                // kontent yang akan kita tulis ke file
                let idOrder = "9HMQKOW3";
            
                // tulis konten ke file
                fs.writeFile(file, idOrder, (err: any) => {
                    if (err) throw err;
                    console.log('Saved!');
                }); 
            
                // baca file
                fs.readFile(file, (err: any, data: any) => {
                    if (err) throw err;

                    // kirim respon
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(data);
                    res.end();
                });
            });

        });

    }

}

const sendemailRoutes = new SendEmailRoutes();
export default sendemailRoutes.router;