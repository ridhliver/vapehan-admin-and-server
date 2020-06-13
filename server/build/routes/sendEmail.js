"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path = require('path');
var fs = require('fs');
var http = require('http');
class SendEmailRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', (req, res) => {
            fs.open('./views/test.html', 'w+', function (err, file) {
                if (err)
                    throw err;
                // kontent yang akan kita tulis ke file
                let idOrder = "9HMQKOW3";
                // tulis konten ke file
                fs.writeFile(file, idOrder, (err) => {
                    if (err)
                        throw err;
                    console.log('Saved!');
                });
                // baca file
                fs.readFile(file, (err, data) => {
                    if (err)
                        throw err;
                    // kirim respon
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(data);
                    res.end();
                });
            });
        });
    }
}
const sendemailRoutes = new SendEmailRoutes();
exports.default = sendemailRoutes.router;
