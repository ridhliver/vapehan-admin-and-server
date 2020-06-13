"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../database"));
const md5_1 = __importDefault(require("md5"));
var dateFormat = require('dateformat');
var nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
class WholesaleController {
    getdataRegist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            // console.log(id);
            const store = yield database_1.default.query('SELECT a.id, a.token, a.status, a.namalengkap, a.alamat, a.kota as id_kota, concat(d.city_name," ",d.type) as kota, a.provinsi as id_provinsi, d.province as provinsi, a.hp, a.email, '+
            'b.id as id_toko, b.namatoko, b.alamat as alamattoko, b.kota as id_kotatoko, concat(e.city_name," ",e.type) as kotatoko, b.provinsi as id_provinsitoko, e.province as provinsitoko, b.kodepos, b.hp as hptoko, b.email as emailtoko, if(b.spesifikasi = 1, 1, 2) as spesifikasi, '+
            'c.id as id_sosmed, c.instagram, c.youtube, c.facebook, c.tokopedia, c.bukalapak, c.shopee, c.etc '+
            'FROM vapencom_wholesale.ws_pemiliktoko a '+
            'LEFT JOIN vapencom_wholesale.ws_toko b ON a.id = b.id_pemilik '+
            'LEFT JOIN vapencom_wholesale.ws_sosialmedia c ON a.id = c.id_pemilik '+
            'LEFT JOIN vh_city d ON a.kota = d.city_id '+
            'LEFT JOIN vh_city e ON b.kota = e.city_id '+
            'WHERE a.token = ?', [id]);

            const courier = yield database_1.default.query('SELECT a.id, a.courier, a.courier_service '+
            'FROM vapencom_wholesale.ws_pengiriman a '+
            'LEFT JOIN vapencom_wholesale.ws_pemiliktoko b ON a.id_pemilik = b.id '+
            'WHERE b.token = ?', [id]);

            if (store.length > 0) {

                let toko = {
                    id: store[0].id_toko,
                    namatoko: store[0].namatoko,
                    alamat: store[0].alamattoko,
                    id_kota: store[0].id_kotatoko,
                    kota: store[0].kotatoko,
                    id_provinsi: store[0].id_provinsitoko,
                    provinsi: store[0].provinsitoko,
                    kodepos: store[0].kodepos,
                    hp: store[0].hptoko,
                    email: store[0].emailtoko,
                    spesifikasi: store[0].spesifikasi
                };

                let sosmed = {
                    id: store[0].id_sosmed,
                    instagram: store[0].instagram,
                    youtube: store[0].youtube,
                    facebook: store[0].facebook,
                    tokopedia: store[0].tokopedia,
                    bukalapak: store[0].bukalapak,
                    shopee: store[0].shopee,
                    etc: store[0].etc
                };
                
                let regist = {
                    id: store[0].id,
                    token: store[0].token,
                    namalengkap: store[0].namalengkap,
                    alamat: store[0].alamat,
                    id_kota: store[0].id_kota,
                    kota: store[0].kota,
                    id_provinsi: store[0].id_provinsi,
                    provinsi: store[0].provinsi,
                    hp: store[0].hp,
                    email: store[0].email,
                    status: store[0].status,
                    toko: toko,
                    sosmed: sosmed,
                    courier: []
                };

                for (let i = 0; i < courier.length; i++) {
                    const cr = {
                        id: courier[i].id,
                        courier: courier[i].courier,
                        courier_service: courier[i].courier_service
                    };

                    regist.courier.push(cr);
                }

                res.json(regist);
            } else {
                res.json(null);
            }

            
        });
    }
    registSelesai(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            // console.log(id);
           yield database_1.default.query('UPDATE vapencom_wholesale.ws_pemiliktoko SET status = 1 WHERE token = ?', [id]);

           function main() {
            return __awaiter(this, void 0, void 0, function* () {
                const store = yield database_1.default.query('SELECT a.id, a.token, a.status, a.namalengkap, a.alamat, a.kota as id_kota, concat(d.city_name," ",d.type) as kota, a.provinsi as id_provinsi, d.province as provinsi, a.hp, a.email, '+
                'b.id as id_toko, b.namatoko, b.alamat as alamattoko, b.kota as id_kotatoko, concat(e.city_name," ",e.type) as kotatoko, b.provinsi as id_provinsitoko, e.province as provinsitoko, b.kodepos, b.hp as hptoko, b.email as emailtoko, if(b.spesifikasi = 1, 1, 2) as spesifikasi, '+
                'c.id as id_sosmed, c.instagram, c.youtube, c.facebook, c.tokopedia, c.bukalapak, c.shopee, c.etc '+
                'FROM vapencom_wholesale.ws_pemiliktoko a '+
                'LEFT JOIN vapencom_wholesale.ws_toko b ON a.id = b.id_pemilik '+
                'LEFT JOIN vapencom_wholesale.ws_sosialmedia c ON a.id = c.id_pemilik '+
                'LEFT JOIN vh_city d ON a.kota = d.city_id '+
                'LEFT JOIN vh_city e ON b.kota = e.city_id '+
                'WHERE a.token = ?', [id]);

                const courier = yield database_1.default.query('SELECT a.id, a.courier, a.courier_service '+
                'FROM vapencom_wholesale.ws_pengiriman a '+
                'LEFT JOIN vapencom_wholesale.ws_pemiliktoko b ON a.id_pemilik = b.id '+
                'WHERE b.token = ?', [id]);

                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                    host: 'in-v3.mailjet.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: '0e4bed1f5c9aca6cd09e4048c2b1b179',
                        pass: '4e3019cd16e5172ae8f42e91b02cc05d'
                    }
                });
                const handlebarOptions = {
                    viewEngine: {
                        partialsDir: './views/',
                        layoutsDir: './views/',
                        defaultLayout: 'wholesale-detail',
                    },
                    viewPath: './views/',
                };

                transporter.use('compile', hbs(handlebarOptions));

                let toko = {
                    id: store[0].id_toko,
                    namatoko: store[0].namatoko,
                    alamat: store[0].alamattoko,
                    id_kota: store[0].id_kotatoko,
                    kota: store[0].kotatoko,
                    id_provinsi: store[0].id_provinsitoko,
                    provinsi: store[0].provinsitoko,
                    kodepos: store[0].kodepos,
                    hp: store[0].hptoko,
                    email: store[0].emailtoko,
                    spesifikasi: store[0].spesifikasi
                };

                let sosmed = {
                    id: store[0].id_sosmed,
                    instagram: store[0].instagram,
                    youtube: store[0].youtube,
                    facebook: store[0].facebook,
                    tokopedia: store[0].tokopedia,
                    bukalapak: store[0].bukalapak,
                    shopee: store[0].shopee,
                    etc: store[0].etc
                };
                
                let regist = {
                    id: store[0].id,
                    token: store[0].token,
                    namalengkap: store[0].namalengkap,
                    alamat: store[0].alamat,
                    id_kota: store[0].id_kota,
                    kota: store[0].kota,
                    id_provinsi: store[0].id_provinsi,
                    provinsi: store[0].provinsi,
                    hp: store[0].hp,
                    email: store[0].email,
                    status: store[0].status,
                    toko: toko,
                    sosmed: sosmed,
                    courier: []
                };

                for (let i = 0; i < courier.length; i++) {
                    const cr = {
                        id: courier[i].id,
                        courier: courier[i].courier,
                        courier_service: courier[i].courier_service
                    };

                    regist.courier.push(cr);
                }
               
                var cclist = [
                    'vapehan@gmail.com',
                    'shop@vapehan.com',
                ];

                cclist.toString();
                
                // send mail with defined transport object
                let info = yield transporter.sendMail({
                    from: '"Vapehan Store" <shop@vapehan.com>',
                    to: store[0].email,
                    cc: cclist,
                    subject: 'Data Pendaftaran Wholesale Vapehan',
                    template: 'wholesale-detail',
                    context: {
                        register: regist,
                        courier: regist.courier,
                        year: dateFormat(new Date(), "yyyy")
                    }
                });
                console.log('Message sent: %s', info.messageId);
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            });
        }
        main().catch(console.error);

        res.json({massage: 'Success'});
           
        });
    }
    createStore(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = req.body;
            // console.log(post);

            const store = yield database_1.default.query('SELECT id FROM vapencom_wholesale.ws_pemiliktoko WHERE token = ? LIMIT 1', [post.token]);

            const currentDate = new Date();
            const create = dateFormat(new Date(), "HH:MM:ss");

            let hp = '';

            if (post.hp.substr(0, 1) === '8') {
                hp = '+62' + post.hp;
            } else if (post.hp.substr(0, 2) === '08') {
                hp = '+62' + post.hp.substr(2,16);
            } else if (post.hp.substr(0, 2) === '62') {
                hp = '+' + post.hp;
            } else if (post.hp.substr(0, 3) === '+62') {
                hp = post.hp;
            } else {
                hp = '+62' + post.hp;
            }

            const owner = {
                token: post.token,
                namalengkap: post.namalengkap,
                alamat: post.alamat,
                kota: post.id_kota,
                provinsi: post.id_provinsi,
                hp: hp,
                email: post.email,
                status: post.status,
                date: dateFormat(currentDate, "yyyy-mm-dd"),
                time: create
            };

            if (store.length > 0) {
                yield database_1.default.query('UPDATE vapencom_wholesale.ws_pemiliktoko set ? WHERE token = ?', [owner, post.token]);
                res.json({ token: post.token });
            } else {
                yield database_1.default.query('INSERT INTO vapencom_wholesale.ws_pemiliktoko set ?', [owner]);
                res.json({ token: post.token });
            }
            
            
        });
    }
    createToko(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = req.body;
            const { id } = req.params;
            // console.log(post);

            const pemilik = yield database_1.default.query('SELECT id FROM vapencom_wholesale.ws_pemiliktoko WHERE token = ? LIMIT 1', [id]);
            // console.log(pemilik[0]);

            const toko = yield database_1.default.query('SELECT id FROM vapencom_wholesale.ws_toko WHERE id_pemilik = ? LIMIT 1', [pemilik[0].id]);

            let hp = '';

            if (post.hp.substr(0, 1) === '8') {
                hp = '+62' + post.hp;
            } else if (post.hp.substr(0, 2) === '08') {
                hp = '+62' + post.hp.substr(2,16);
            } else if (post.hp.substr(0, 2) === '62') {
                hp = '+' + post.hp;
            } else if (post.hp.substr(0, 3) === '+62') {
                hp = post.hp;
            } else {
                hp = '+62' + post.hp;
            }

            const dt_toko = {
                id_pemilik: pemilik[0].id,
                namatoko: post.namatoko,
                alamat: post.alamat,
                kota: post.id_kota,
                provinsi: post.id_provinsi,
                kodepos: post.kodepos,
                hp: hp,
                email: post.email,
                spesifikasi: post.spesifikasi
            };

            if (toko.length > 0) {
                yield database_1.default.query('UPDATE vapencom_wholesale.ws_toko set ? WHERE id_pemilik = ?', [dt_toko, pemilik[0].id]);
                res.json({ massage: 'Sucess' });
            } else {
                yield database_1.default.query('INSERT INTO vapencom_wholesale.ws_toko set ?', [dt_toko]);
                res.json({ massage: 'Sucess' });
            }
            
            
        });
    }
    createSosmed(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = req.body;
            const { id } = req.params;
            // console.log(post);

            const pemilik = yield database_1.default.query('SELECT id FROM vapencom_wholesale.ws_pemiliktoko WHERE token = ? LIMIT 1', [id]);
            // console.log(pemilik[0]);

            const sosmed = yield database_1.default.query('SELECT id FROM vapencom_wholesale.ws_sosialmedia WHERE id_pemilik = ? LIMIT 1', [pemilik[0].id]);

            const dt_sosmed = {
                id_pemilik: pemilik[0].id,
                instagram: post.instagram,
                youtube: post.youtube,
                facebook: post.facebook,
                tokopedia: post.tokopedia,
                bukalapak: post.bukalapak,
                shopee: post.shopee,
                etc: post.etc
            };

            if (sosmed.length > 0) {
                yield database_1.default.query('UPDATE vapencom_wholesale.ws_sosialmedia set ? WHERE id_pemilik = ?', [dt_sosmed, pemilik[0].id]);
                res.json({ massage: 'Sucess' });
            } else {
                yield database_1.default.query('INSERT INTO vapencom_wholesale.ws_sosialmedia set ?', [dt_sosmed]);
                res.json({ massage: 'Sucess' });
            }
            
            
        });
    }
    createCourier(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = req.body;
            const { id } = req.params;
            // console.log(post);

            const pemilik = yield database_1.default.query('SELECT id FROM vapencom_wholesale.ws_pemiliktoko WHERE token = ? LIMIT 1', [id]);
            // console.log(pemilik[0]);

            const pengiriman = yield database_1.default.query('SELECT id, courier FROM vapencom_wholesale.ws_pengiriman WHERE id_pemilik = ? LIMIT 1', [pemilik[0].id]);

            if (pengiriman.length > 0) {

                let massage = [];

                for (let i = 0; i < pengiriman.length; i++) {
                       
                    massage.push({massage: 'success'});
                    
                    if (pengiriman[i].courier === post.cor) {
                        yield database_1.default.query('UPDATE vapencom_wholesale.ws_pengiriman set courier = ? WHERE id_pemilik = ?', [post.cor, pemilik[0].id]);
                    } else {
                        yield database_1.default.query('INSERT INTO vapencom_wholesale.ws_pengiriman set id_pemilik = ?, courier = ?', [pemilik[0].id, post.cor]); 
                    }

                   
                }

                res.json(massage);

            } else {

                yield database_1.default.query('INSERT INTO vapencom_wholesale.ws_pengiriman set id_pemilik = ?, courier = ?', [pemilik[0].id, post.cor]);

                let massage = [];

                massage.push({massage: 'success'});
    
                

                res.json(massage);
            }
            
        });
    }
    delCourier(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = req.body;
            const { id } = req.params;
            // console.log(post);

            const pemilik = yield database_1.default.query('SELECT id FROM vapencom_wholesale.ws_pemiliktoko WHERE token = ? LIMIT 1', [id]);
            // console.log(pemilik[0]);

            yield database_1.default.query('DELETE FROM vapencom_wholesale.ws_pengiriman WHERE id_pemilik = ? AND courier = ?', [pemilik[0].id, post.cor]);

            res.json({massage: 'Success'});
            
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const customer = yield database_1.default.query('SELECT id FROM vh_customer WHERE id = ?', [id]);
            yield database_1.default.query('CALL DeleteCustomer(?)', [id]);
            if (customer == "") {
                res.status(404).json({ text: "Customer doesn't exists" });
            }
            else {
                res.json({ text: 'Success Delete' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            // console.log(id);
            yield database_1.default.query('UPDATE vapencom_wholesale.ws_pemiliktoko SET status = 0 WHERE token = ?', [id]);
            
            res.json({massage: 'Success'});
        });
    }
}
const wholesalecontroller = new WholesaleController();
exports.default = wholesalecontroller;
