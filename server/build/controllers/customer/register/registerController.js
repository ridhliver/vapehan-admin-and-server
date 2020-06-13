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
const database_1 = __importDefault(require("../../../database"));
const md5_1 = __importDefault(require("md5"));
var nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
class RegisterController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            const password = md5_1.default(req.body.password);
            const login = yield database_1.default.query('SELECT * FROM vh_customer WHERE email = ? AND password = ? LIMIT 1', [email, password]);
            res.json(login);
        });
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield database_1.default.query('SELECT a.*, a.id as id_customer, b.nameReceive, b.gender, b.phone, DATE_FORMAT(b.dob, "%Y-%m-%d") as dob, b.address, b.id_province, b.id_city, b.id_district, b.postal, b.set, c.province, c.city, c.type, c.subdistrict_name  '+
            'FROM vh_customer a '+
            'LEFT JOIN vh_customer_info b ON a.id = b.id_customer '+
            'LEFT JOIN vh_subdistrict c ON b.id_district = c.subdistrict_id');
            res.json(customer);
        });
    }
    biodata(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const customerInfo = yield database_1.default.query('SELECT * FROM vh_customer_info');
            res.json(customerInfo);
        });
    }
    find(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const customer = yield database_1.default.query('SELECT a.*, b.id_customer, b.nameReceive, b.gender, b.phone, DATE_FORMAT(b.dob, "%Y-%m-%d") as dob, b.address, b.id_province, b.id_city, b.id_district, b.postal, b.set, c.province, c.city, c.type, c.subdistrict_name FROM vh_customer a ' +
            'LEFT JOIN vh_customer_info b ON a.id = b.id_customer LEFT JOIN vh_subdistrict c ON b.id_district = c.subdistrict_id WHERE a.accessToken = ? LIMIT 1', [id]);
            // console.log(customer);
            res.json(customer);
        });
    }
    findAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const customer = yield database_1.default.query('SELECT * FROM vh_customer_info WHERE id_customer = ?', [id]);
            res.json(customer);
        });
    }
    detail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const customer = yield database_1.default.query('SELECT * FROM vh_customer INNER JOIN vh_customer_info ON vh_customer.id = vh_customer_info.id_customer WHERE vh_customer.id = ?', [id]);
            if (customer.length > 0) {
                return res.json(customer[0]);
            }
            res.status(404).json({ text: "Customer doesn't exists " });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = req.body;
            
            if (post.social === 1) {
                const customer = {
                    firstname: post.firstname,
                    lastname: post.lastname,
                    email: post.email,
                    verification: 1,
                    password: null,
                    accessToken: post.accessToken,
                    status: 1,
                    google: post.social,
                    member: 1
                };
                
                yield database_1.default.query('INSERT INTO vh_customer set ?', customer);

                function main() {
                    return __awaiter(this, void 0, void 0, function* () {
                        
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
                                defaultLayout: 'register-customer',
                            },
                            viewPath: './views/',
                        };

                        var cclist = [
                            'sales@vapehan.com',
                            'shop@vapehan.com',
                        ];

                        cclist.toString();

                        transporter.use('compile', hbs(handlebarOptions));
                        // send mail with defined transport object
                        let info = yield transporter.sendMail({
                            from: `Vapehan Store <system@vapehan.com>`,
                            to: post.email,
                            // cc: cclist,
                            subject: 'Notifikasi akun vapehan',
                            // template: 'massage-customer',
                            html: `<table align="left" border="0" cellpadding="0" cellspacing="0" style="text-align: left;" width="100%">
                            <tr>
                                <td style="text-align: center;">
                                    <img src="https://api.vapehan.com/api/images/email/vapehan.png" alt="" style="width: 100px; height: 100px; margin-bottom: 30px;">
                                </td>
                            </tr>                            
                            <tr>
                                <td>
                                    <p style="font-size: 19px;">Pemberitauan kepada <b>${post.firstname} ${post.lastname}</b>, bahwa akun anda sudah di verifikasi otomatis oleh sistem kami dan akun anda sudah bisa digunakan di <a style="cursor: pointer; color: red;" href="https://vapehan.com">Vapehan</a>.</p>
                                    <br />
                                    <p>Terima kasih</p>
                                </td>
                            </tr> 
                        </table>`
                        });
                        console.log('Message sent: %s', info.messageId);
                        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                        // Preview only available when sending through an Ethereal account
                        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                    });
                }
                main().catch(console.error);

                res.json({ message: 'Success' });

            } else {
                
                const customer = {
                    firstname: post.firstname,
                    lastname: post.lastname,
                    email: post.email,
                    verification: false,
                    password: md5_1.default(post.password),
                    accessToken: post.accessToken,
                    status: false,
                    google: post.social,
                    member: 1
                };
                
                yield database_1.default.query('INSERT INTO vh_customer set ?', customer);
                const result = yield database_1.default.query('SELECT id FROM vh_customer WHERE id in (SELECT MAX(id) FROM vh_customer) LIMIT 1');
                const id_customer = result[0].id;
                const info = {
                    id_customer: id_customer,
                    nameReceive: post.biodata.nameReceive,
                    gender: post.biodata.gender,
                    phone: post.biodata.phone,
                    dob: post.biodata.dob,
                    address: post.biodata.address,
                    id_province: post.biodata.id_province,
                    id_city: post.biodata.id_city,
                    id_district: post.biodata.id_district,
                    postal: post.biodata.postal,
                    set: post.set
                };
                // console.log(info);
                database_1.default.query('INSERT INTO vh_customer_info SET ?', info);

                const start = function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        const phone = yield database_1.default.query('select '+
                        'case when LEFT(phone,1) = "0" then CONCAT(REPLACE(LEFT(phone,1),0,62),SUBSTRING(phone, 2, CHAR_LENGTH(phone))) '+
                        'when LEFT(phone,1) = "+" then CONCAT(REPLACE(LEFT(phone,1),"+",""),SUBSTRING(phone, 2, CHAR_LENGTH(phone))) '+
                        'when LEFT(phone,1) = "8" then CONCAT("62",phone) '+
                        'when LEFT(phone,2) = "62" then phone '+
                        'end as phone2 '+
                        'from  vh_customer_info where id_customer = ? Limit 1', [id_customer]);

                        yield database_1.default.query('UPDATE vh_customer_info '+
                        'SET reminder = ? where id_customer = ?', [phone[0].phone2, id_customer]);
                    });
                };
                
                
                function main() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const dataAkun = {
                            firstname: post.firstname,
                            lastname: post.lastname,
                            email: post.email,
                            password: md5_1.default(post.password),
                            accessToken: post.accessToken,
                        };
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
                                defaultLayout: 'register-customer',
                            },
                            viewPath: './views/',
                        };
                        transporter.use('compile', hbs(handlebarOptions));

                        var cclist = [
                            'sales@vapehan.com',
                            'shop@vapehan.com',
                        ];

                        cclist.toString();

                        // send mail with defined transport object
                        let info = yield transporter.sendMail({
                            from: '"Vapehan Store" <shop@vapehan.com>',
                            to: post.email,
                            // cc: cclist,
                            subject: 'Activation Account Vapehan',
                            // template: 'register-customer',
                            html: `<table align="center" border="0" cellpadding="0" cellspacing="0" style="padding: 0 30px;margin-top:30pxbackground-color: #fff; -webkit-box-shadow: 0px 0px 14px -4px rgba(0, 0, 0, 0.2705882353);box-shadow: 0px 0px 14px -4px rgba(0, 0, 0, 0.2705882353);width: 100%; border: thin solid #444444; border-bottom: unset;">
                            <tbody>
                                <tr>
                                    <td>
                                        <table align="left" border="0" cellpadding="0" cellspacing="0" style="text-align: left;" width="100%">
                                            <tr>
                                                <td style="text-align: center;">
                                                    <img src="https://api.vapehan.com/api/images/email/vapehan.png" alt="" style="width: 100px; height: 100px; margin-bottom: 30px;">
                                                </td>
                                            </tr>                            
                                        <tr>
                                                <td>
                                                    <p style="font-size: 19px;">Hallo <b>${dataAkun.firstname} ${dataAkun.lastname}!</b></p>
                                                    <p style="font-size: 14px;">Terima kasih telah mendaftar di Vapehan Store, Tinggal selangkah lagi kamu dapat menjadi bagian dari Vapehan Store. Cukup dengan mengklik tombol di bawah.</p>
                                                    <p style="font-size: 14px;"><a href="https://vapehan.com/pages/login/${dataAkun.accessToken}" style="display: block; padding: 13px 0; font-size: 16px; font-weight: 600; line-height: 1.38; text-align: center; color: #fff; background-color: #a48445; border-radius: 8px; text-decoration: none; margin: 15px auto; max-width: 272px;">Activate Your Account</a></p>
                
                                                    <p style="margin-top: 5px;">
                                                        <strong>Catatan:</strong>
                                                    </p>
                                                    <p>Jika email masuk dalam Spam di sarankan untuk mengklik "Laporkan bukan spam" yang muncul di bagian atas email.</p>
                                                </td>
                                            </tr> 
                                        </table>
                                                        
                                    </td>
                                </tr>
                            </tbody>            
                        </table>
                        <table class="main-bg-light text-center top-0" style="background-color: #e2e2e2; text-align: center; margin-top:0;" align="center" border="0" cellpadding="0" cellspacing="0" width="50%">
                            <tr>
                                <td style="padding: 30px;">
                                    <div>
                                        <h4 class="title" style="margin:0;text-align: center; color: #444444;
                                        font-size: 22px;
                                        font-weight: bold;
                                        margin-top: 10px;
                                        margin-bottom: 10px;
                                        padding-bottom: 0;
                                        text-transform: uppercase;
                                        display: inline-block;
                                        line-height: 1;">Follow us</h4>
                                    </div>
                                    <table border="0" cellpadding="0" cellspacing="0" class="footer-social-icon" align="center" class="text-center" style="margin-top:20px; text-align: center;margin-left:5px;
                                    margin-right:5px;">
                                        <tr>
                                            <td>
                                                <a href="https://www.facebook.com/vapehan/" target="_blank"><img src="https://api.vapehan.com/api/images/email/facebook.png" alt=""></a>
                                            </td>
                                            <td>
                                                <a target="_blank" href="https://www.youtube.com/channel/UCmczby514u9CnJcFO0s0Cxg"><img src="https://api.vapehan.com/api/images/email/youtube.png" alt=""></a>
                                            </td>
                                            <td>
                                                <a href="https://www.instagram.com/vapehan.official/" target="_blank"><img src="https://api.vapehan.com/api/images/email/instagram.png" alt=""></a>
                                            </td>
                                            <td>
                                                <a target="_blank" href="https://www.tokopedia.com/vapehan?source=universe&st=product"><img src="https://api.vapehan.com/api/images/email/tokopedia.png" alt=""></a>
                                            </td>
                                            <td>
                                                <a target="_blank" href="https://shopee.co.id/vapehan"><img src="https://api.vapehan.com/api/images/email/shopee.png" alt=""></a>
                                            </td>
                                            <td>
                                                <a target="_blank" href="https://www.bukalapak.com/u/vapehan"><img src="https://api.vapehan.com/api/images/email/bukalapak.png" alt=""></a>
                                            </td>
                                        </tr>                                    
                                    </table>
                                    <div style="border-top: 1px solid #444; margin: 20px auto 0;"></div>
                                    <table  border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px auto 0;" >
                                        
                                        <tr>
                                            <td>
                                                <p style="font-size:13px; margin:0;">2019 Copy Right by Vapehan powered by HSG</p>
                                            </td>
                                        </tr>
                                        
                                    </table>
                                </td>
                            </tr>
                        </table>`
                        });
                        console.log('Message sent: %s', info.messageId);
                        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                        // Preview only available when sending through an Ethereal account
                        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                    });
                }
                start();
                main().catch(console.error);
                res.json({ message: 'Success' });
            }
        });
    }
    sendMail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            function main() {
                return __awaiter(this, void 0, void 0, function* () {
                    const dataAkun = {
                        id: req.body.id,
                        accessToken: req.body.accessToken,
                        email: req.body.email,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname
                    };
                    // console.log(dataAkun);
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
                            defaultLayout: 'forget-password',
                        },
                        viewPath: './views/',
                    };
                    
                    transporter.use('compile', hbs(handlebarOptions));
                    // send mail with defined transport object
                    let info = yield transporter.sendMail({
                        from: '"Vapehan Store" <shop@vapehan.com>',
                        to: req.body.email,
                        subject: 'Forgot Password',
                        template: 'forget-password',
                        context: {
                            dataAkun: dataAkun
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
            res.json({ text: 'Success' });
        });
    }
    verify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const verify = {
                verification: true,
                status: true
            };
            // console.log(id);
            const customer = yield database_1.default.query('SELECT id FROM vh_customer WHERE accessToken = ?', [id]);
            yield database_1.default.query('UPDATE vh_customer set ? WHERE accessToken = ?', [verify, id]);
            if (customer == "") {
                res.status(404).json({ text: "Customer doesn't exists" });
            }
            else {
                res.json({ text: 'Success Delete' });
            }
        });
    }
    sendMassage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            function main() {
                return __awaiter(this, void 0, void 0, function* () {
                    const post = req.body;
                    const data = {
                        firstname: post.first,
                        subject: post.sub,
                        phone: post.phone,
                        email: post.email,
                        massage: post.msg
                    };
                    // console.log(dataAkun);
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
                            defaultLayout: 'massage-customer',
                        },
                        viewPath: './views/',
                    };
                    // const vapehan = 'sales@vapehan.com'
                    transporter.use('compile', hbs(handlebarOptions));
                    // send mail with defined transport object
                    let info = yield transporter.sendMail({
                        from: `${post.first} <system@vapehan.com>`,
                        to: 'shop@vapehan.com',
                        cc: 'vapehan@gmail.com',
                        subject: data.subject,
                        template: 'massage-customer',
                        context: {
                            datamsg: data
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
            res.json({ text: 'Success' });
        })
    }
    activeallcust(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            
            const customer = yield database_1.default.query('SELECT id, concat(firstname, " ", lastname) as name, email FROM vh_customer where verification = 0 and status = 0');

            // console.log(customer);
            
            for (let i = 0; i < customer.length; i++) {
                const id = {
                    id: customer[i].id
                };
                // console.log(id);
                // console.log(cart);
                yield database_1.default.query('UPDATE vh_customer SET verification = 1, status = 1 WHERE id = ?', [customer[i].id]);
                yield database_1.default.query('INSERT INTO backup SET ?', [customer[i]]);
                function main() {
                    return __awaiter(this, void 0, void 0, function* () {
                        // console.log(dataAkun);
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
                                defaultLayout: 'massage',
                            },
                            viewPath: './views/',
                        };
                        // const vapehan = 'sales@vapehan.com'
                        transporter.use('compile', hbs(handlebarOptions));
                        // send mail with defined transport object
                        let info = yield transporter.sendMail({
                            from: `Vapehan Store <system@vapehan.com>`,
                            to: customer[i].email,
                            cc: 'shop@vapehan.com',
                            subject: 'notifikasi akun',
                            // template: 'massage-customer',
                            html: `<table align="left" border="0" cellpadding="0" cellspacing="0" style="text-align: left;" width="100%">
                            <tr>
                                <td style="text-align: center;">
                                    <img src="https://api.vapehan.com/api/images/email/vapehan.png" alt="" style="width: 100px; height: 100px; margin-bottom: 30px;">
                                </td>
                            </tr>                            
                            <tr>
                                <td>
                                    <p style="font-size: 19px;">Pemberitauan kepada <b>${customer[i].name}</b>, bahwa akun anda sudah di verifikasi otomatis oleh sistem kami dan akun anda sudah bisa digunakan di <a style="cursor: pointer; color: red;" href="https://vapehan.com">Vapehan</a>.</p>
                                    <br />
                                    <p>Terima kasih</p>
                                </td>
                            </tr> 
                        </table>`
                        });
                        console.log('Message sent: %s', info.messageId);
                        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                        // Preview only available when sending through an Ethereal account
                        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                    });
                }
                main().catch(console.error);
            }

            res.json({ text: 'Success' });
        })
    }
    resendEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            function main() {
                return __awaiter(this, void 0, void 0, function* () {
                    const post = req.body;
                    const dataAkun = {
                        firstname: post.firstname,
                        lastname: post.lastname,
                        email: post.email,
                        accessToken: post.accessToken,
                    };
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
                            defaultLayout: 'register-customer',
                        },
                        viewPath: './views/',
                    };
                    transporter.use('compile', hbs(handlebarOptions));
                    // send mail with defined transport object
                    let info = yield transporter.sendMail({
                        from: '"Vapehan Store" <shop@vapehan.com>',
                        to: post.email,
                        subject: 'Activation Account',
                        template: 'register-customer',
                        context: {
                            dataAkun: dataAkun
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
            res.json({ message: 'Success' });
        })
    }
    /*
    public async active(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const status = {
            status: true
        }
        console.log(id);
        await pool.query('UPDATE vh_customer set ? WHERE id = ?', [status, id]);
    }
    */
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
            const customer = yield database_1.default.query('SELECT id FROM vh_customer WHERE id = ?', [id]);
            yield database_1.default.query('UPDATE vh_customer set ? WHERE id = ?', [req.body, id]);
            if (customer == "") {
                res.status(404).json({ text: "Customer doesn't exists" });
            }
            else {
                res.json({ message: 'The Customer was Update' });
            }
        });
    }
    editProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const customer = yield database_1.default.query('SELECT id FROM vh_customer WHERE id = ?', [id]);
            const dataA = {
                password: md5_1.default(req.body.password),
            };
            const dataB = {
                id_customer: id,
                nameReceive: req.body.nameReceive,
                gender: req.body.gender,
                phone: req.body.phone,
                dob: req.body.dob,
                address: req.body.address,
                id_province: req.body.id_province,
                id_city: req.body.id_city,
                id_district: req.body.id_district,
                postal: req.body.postal,
                set: req.body.set
            };
            // console.log(dataA, dataB);
            yield database_1.default.query('UPDATE vh_customer set ? WHERE id = ?', [dataA, id]);
            yield database_1.default.query('INSERT INTO vh_customer_info set ?', [dataB]);
            yield database_1.default.query('UPDATE vh_customer_info '+
            'SET reminder = CONCAT(REPLACE( '+
            'LEFT(?,1),0,62), '+
            'SUBSTRING(?, 2, CHAR_LENGTH(?)) '+
            ') where id_customer = ?', [req.body.phone, req.body.phone, req.body.phone, id]);
            if (customer == "") {
                res.status(404).json({ text: "Customer doesn't exists" });
            }
            else {
                res.json({ message: 'The Customer was Update' });
            }
        });
    }
    updatePhone(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const customer = yield database_1.default.query('SELECT id_customer FROM vh_customer_info WHERE id_customer = ?', [id]);
            yield database_1.default.query('UPDATE vh_customer_info SET phone = ? , reminder = CONCAT(REPLACE( '+
            'LEFT(?,1),0,62), '+
            'SUBSTRING(?, 2, CHAR_LENGTH(?)) '+
            ') WHERE id_customer = ?', [req.body.phone, req.body.phone, req.body.phone, req.body.phone, id]);
            if (customer == "") {
                res.status(404).json({ text: "Customer doesn't exists" });
            }
            else {
                res.json({ message: 'The Customer was Update' });
            }
        });
    }
    editAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = {
                nameReceive: req.body.nameReceive,
                address: req.body.address,
                id_province: req.body.id_province,
                id_city: req.body.id_city,
                id_district: req.body.id_district,
                postal: req.body.postal
            };
            const customer = yield database_1.default.query('SELECT id FROM vh_customer WHERE id = ?', [id]);
            // console.log(dataA, dataB);
            yield database_1.default.query('UPDATE vh_customer_info set ? WHERE id_customer = ?', [data, id]);
            if (customer == "") {
                res.status(404).json({ text: "Customer doesn't exists" });
            }
            else {
                res.json({ message: 'The Customer was Update' });
            }
        });
    }
    editInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const customer = yield database_1.default.query('SELECT id FROM vh_customer WHERE id = ?', [id]);
            const dataA = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
            };
            const dataB = {
                gender: req.body.gender,
                dob: req.body.dob
            };
            // console.log(dataA, dataB);
            yield database_1.default.query('UPDATE vh_customer set ? WHERE id = ?', [dataA, id]);
            yield database_1.default.query('UPDATE vh_customer_info set ? WHERE id_customer = ?', [dataB, id]);
            if (customer == "") {
                res.status(404).json({ text: "Customer doesn't exists" });
            }
            else {
                res.json({ message: 'The Customer was Update' });
            }
        });
    }
    editContact(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const customer = yield database_1.default.query('SELECT id FROM vh_customer WHERE id = ?', [id]);
            const dataA = {
                email: req.body.email,
            };
            const dataB = {
                phone: req.body.phone,
            };
            // console.log(dataA, dataB);
            yield database_1.default.query('UPDATE vh_customer set ? WHERE id = ?', [dataA, id]);
            yield database_1.default.query('UPDATE vh_customer_info set phone = ? , reminder = CONCAT(REPLACE( '+
            'LEFT(?,1),0,62), '+
            'SUBSTRING(?, 2, CHAR_LENGTH(?)) '+
            ') WHERE id_customer = ?', [dataB.phone, dataB.phone, dataB.phone, dataB.phone, id]);
            if (customer == "") {
                res.status(404).json({ text: "Customer doesn't exists" });
            }
            else {
                res.json({ message: 'The Customer was Update' });
            }
        });
    }
    editPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const customer = yield database_1.default.query('SELECT id FROM vh_customer WHERE id = ?', [id]);
            const dataA = {
                password: md5_1.default(req.body.password)
            };
            // console.log(dataA, dataB);
            yield database_1.default.query('UPDATE vh_customer set ? WHERE id = ?', [dataA, id]);
            if (customer == "") {
                res.status(404).json({ text: "Customer doesn't exists" });
            }
            else {
                res.json({ message: 'The Customer was Update' });
            }
        });
    }
    addAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const post = req.body;
            const data = {
                id_customer: id,
                address: post.biodata.address,
                id_province: post.biodata.id_province,
                id_city: post.biodata.id_city,
                id_district: post.biodata.id_district,
                postal: post.biodata.postal,
                set: false
            };
            yield database_1.default.query('INSERT INTO vh_customer_info set ?', data);
            res.json({ message: 'Success' });
        });
    }
}
const registercontroller = new RegisterController();
exports.default = registercontroller;
