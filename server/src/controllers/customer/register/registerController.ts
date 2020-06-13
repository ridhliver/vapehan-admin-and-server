import {Request, Response } from 'express';

import pool from '../../../database';

import http from 'https';

import md5 from 'md5';

var nodemailer = require('nodemailer')


class RegisterController {

    public async login(req: Request, res: Response) {
        const email = req.body.email;
        const password = md5(req.body.password);
        const login = await pool.query('SELECT * FROM vh_customer WHERE email = ? AND password = ? LIMIT 1', [email, password]);
        res.json(login);
    }

    public async list(req: Request, res: Response) {
        const customer = await pool.query('SELECT vh_customer.*, vh_customer_info.* FROM vh_customer JOIN vh_customer_info ON vh_customer.id = vh_customer_info.id_customer');
        res.json(customer);
    }

    public async biodata(req: Request, res: Response) {
        const customerInfo = await pool.query('SELECT * FROM vh_customer_info');
        res.json(customerInfo);
    }

    public async find(req: Request, res: Response) {
        const { id } = req.params;
        const customer = await pool.query('SELECT * FROM vh_customer INNER JOIN vh_customer_info ON vh_customer.id = vh_customer_info.id_customer WHERE accessToken = ? LIMIT 1', [id]);
        res.json(customer);
    }

    public async findAccount(req: Request, res: Response) {
        const { id } = req.params;
        const customer = await pool.query('SELECT * FROM vh_customer_info WHERE id_customer = ?', [id]);
        res.json(customer);
    }
 
    public async detail(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const customer = await pool.query('SELECT * FROM vh_customer INNER JOIN vh_customer_info ON vh_customer.id = vh_customer_info.id_customer WHERE vh_customer.id = ?', [id]);
        if (customer.length > 0) {
            return res.json(customer[0]);
        }
        res.status(404).json({text: "Customer doesn't exists "});   
    }

    public async create(req: Request, res: Response): Promise<void> {
        const post = req.body;
        const customer = {
            firstname: post.firstname,
            lastname: post.lastname,
            email: post.email,
            verification: false,
            password: md5(post.password),
            accessToken: post.accessToken,
            status: false
        }
        const start = async function() {
            await pool.query('INSERT INTO vh_customer set ?', customer)
            const result = await pool.query('SELECT id FROM vh_customer WHERE id in (SELECT MAX(id) FROM vh_customer) LIMIT 1');
            const id_customer: number = result[0].id;
                const info = {
                    id_customer: id_customer,
                    gender: post.biodata.gender,
                    phone: post.biodata.phone,
                    dob: post.biodata.dob,
                    address: post.biodata.address,
                    id_province: post.biodata.id_province,
                    id_city: post.biodata.id_city,
                    id_district: post.biodata.id_district,
                    postal: post.biodata.postal,
                    set: true
                }
                // console.log(info);
                pool.query('INSERT INTO vh_customer_info SET ?', info);
        }
        start();
        async function main() {
            const dataAkun = {
                firstname: post.firstname,
                lastname: post.lastname,
                email: post.email,
                password: md5(post.password),
                accessToken: post.accessToken,
            }
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: 'in-v3.mailjet.com',
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: '0e4bed1f5c9aca6cd09e4048c2b1b179',
                    pass: 'b03e8e328002d108907a62fb7d2ea2fb'
                }
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"Vapehan Store" <shop@vapehan.com>', // sender address
                to: dataAkun.email, // list of receivers
                subject: 'Activation Account', // Subject line
                html: `<!DOCTYPE html>
                        <html lang="en">
                            <head>
                                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <link rel="icon" href="http://192.168.1.160:4000/assets/images/email-temp/favicon/1.png" type="image/x-icon">
                                <link rel="shortcut icon" href="http://192.168.1.160:4000/assets/images/email-temp/favicon/1.png" type="image/x-icon">
                                <title></title>
                                <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700,900" rel="stylesheet">
                        
                                <style type="text/css">
                                    body{
                                        text-align: center;
                                        margin: 0 auto;
                                        width: 650px;
                                        font-family: 'Open Sans', sans-serif;
                                        background-color: #e2e2e2;		      	
                                        display: block;
                                    }
                                    ul{
                                        margin:0;
                                        padding: 0;
                                    }
                                    li{
                                        display: inline-block;
                                        text-decoration: unset;
                                    }
                                    a{
                                        text-decoration: none;
                                    }
                                    p{
                                        margin: 15px 0;
                                    }
                        
                                    h5{
                                        color:#444;
                                        text-align:left;
                                        font-weight:400;
                                    }
                                    
                                    .text-center{
                                        text-align: center
                                    }
                                    .main-bg-light{
                                        background-color: #e2e2e2;
                                    }
                                    .title{
                                        color: #444444;
                                        font-size: 22px;
                                        font-weight: bold;
                                        margin-top: 10px;
                                        margin-bottom: 10px;
                                        padding-bottom: 0;
                                        text-transform: uppercase;
                                        display: inline-block;
                                        line-height: 1;
                                    }
                                    table{
                                        margin-top:30px
                                    }
                                    table.top-0{
                                        margin-top:0;
                                    }
                                    table.order-detail {
                                        border: 1px solid #ddd;
                                        border-collapse: collapse;
                                    }
                                    table.order-detail tr:nth-child(even) {
                                    border-top:1px solid #ddd;
                                    border-bottom:1px solid #ddd;
                                    }
                                    table.order-detail tr:nth-child(odd) {
                                        border-bottom:1px solid #ddd;
                                    }
                                    .pad-left-right-space{
                                        border: unset !important;
                                    }
                                    .pad-left-right-space td{
                                        padding: 5px 15px;
                                    }
                                    .pad-left-right-space td p{
                                        margin: 0;
                                    }
                                    .pad-left-right-space td b{
                                        font-size:15px;
                                        font-family: 'Roboto', sans-serif;
                                    }
                                    .order-detail th{
                                        font-size:16px;
                                        padding:15px;
                                        text-align:center;
                                        background: #fafafa;
                                    }
                                    .footer-social-icon tr td img{
                                        margin-left:5px;
                                        margin-right:5px;
                                    }
                                </style>
                            </head>
                            <body style="margin: 20px auto;">
                                <table align="center" border="0" cellpadding="0" cellspacing="0" style="padding: 0 30px;background-color: #fff; -webkit-box-shadow: 0px 0px 14px -4px rgba(0, 0, 0, 0.2705882353);box-shadow: 0px 0px 14px -4px rgba(0, 0, 0, 0.2705882353);width: 100%;">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <table align="left" border="0" cellpadding="0" cellspacing="0" style="text-align: left;" width="100%">
                                                    <tr>
                                                        <td style="text-align: center;">
                                                            <img src="https://i.ibb.co/s2DyTgb/vapehan.png" alt="" style="width: 100px; height: 100px; margin-bottom: 30px;">
                                                        </td>
                                                    </tr>                            
                                                <tr>
                                                        <td>
                                                            <p style="font-size: 19px;"><b>Hi ${dataAkun.firstname} ${dataAkun.lastname},</b></p>
                                                            <p style="font-size: 14px;">Thank you for being a our customer at Vapehan Store , you can click the link below for activation account:</p>
                                                            <p style="font-size: 14px;"><a href="http://192.168.1.160:4200/pages/login/${dataAkun.accessToken}" style="cursor: pointer; color: #ff0000; text-decoration: underline;">Activate Your Account</a></p>
                                                        </td>
                                                    </tr> 
                                                </table>
                                                                
                                            </td>
                                        </tr>
                                    </tbody>            
                                </table>
                                <table class="main-bg-light text-center top-0"  align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                                                    <tr>
                                                        <td style="padding: 30px;">
                                                            <div>
                                                                <h4 class="title" style="margin:0;text-align: center;">Follow us</h4>
                                                            </div>
                                                            <table border="0" cellpadding="0" cellspacing="0" class="footer-social-icon" align="center" class="text-center" style="margin-top:20px;">
                                                                <tr>
                                                                    <td>
                                                                        <a href="https://www.facebook.com/vapehan/" target="_blank"><img src="https://i.ibb.co/WyCqkG0/facebook.png" alt=""></a>
                                                                    </td>
                                                                    <td>
                                                                        <a target="_blank" href="https://www.youtube.com/channel/UCmczby514u9CnJcFO0s0Cxg"><img src="https://i.ibb.co/wWrd3Fz/youtube.png" alt=""></a>
                                                                    </td>
                                                                    <td>
                                                                        <a href="https://www.instagram.com/vapehan/?hl=en" target="_blank"><img src="https://i.ibb.co/cyNjBZy/instagram.png" alt=""></a>
                                                                    </td>
                                                                    <td>
                                                                        <a target="_blank" href="https://www.tokopedia.com/vapehan?source=universe&st=product"><img src="https://i.ibb.co/GHxKCCB/tokopedia.png" alt=""></a>
                                                                    </td>
                                                                    <td>
                                                                        <a target="_blank" href="https://shopee.co.id/vapehan"><img src="https://i.ibb.co/5cLqh72/shopee.png" alt=""></a>
                                                                    </td>
                                                                    <td>
                                                                        <a target="_blank" href="https://www.bukalapak.com/u/vapehan"><img src="https://i.ibb.co/zNPb3mZ/bukalapak.png" alt=""></a>
                                                                    </td>
                                                                </tr>                                    
                                                            </table>
                                                            <div style="border-top: 1px solid #444; margin: 20px auto 0;"></div>
                                                            <table  border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px auto 0;" >
                                                                
                                                                <tr>
                                                                    <td>
                                                                        <p style="font-size:13px; margin:0;">2019 Copy Right by Vapehan powerd by HSG</p>
                                                                    </td>
                                                                </tr>
                                                                
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                            </body>
                        </html>` // html body
            });

            console.log('Message sent: %s', info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        }

        main().catch(console.error);
        res.json({message: 'Success'});
    }

    public async sendMail(req: Request, res: Response): Promise<void> {
          async function main() {
            const dataAkun = {
                id: req.body.id,
                accessToken: req.body.accessToken,
                email: req.body.email,
                firstname: req.body.firstname,
                lastname: req.body.lastname
            }
            // console.log(dataAkun);
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: 'in-v3.mailjet.com',
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: '0e4bed1f5c9aca6cd09e4048c2b1b179',
                    pass: 'b03e8e328002d108907a62fb7d2ea2fb'
                }
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"Vapehan Store" <shop@vapehan.com>', // sender address
                to: dataAkun.email, // list of receivers
                subject: 'Forget Your Password', // Subject line
                html: `<!DOCTYPE html>
                        <html lang="en">
                            <head>
                                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <link rel="icon" href="http://192.168.1.160:4000/assets/images/email-temp/favicon/1.png" type="image/x-icon">
                                <link rel="shortcut icon" href="http://192.168.1.160:4000/assets/images/email-temp/favicon/1.png" type="image/x-icon">
                                <title></title>
                                <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700,900" rel="stylesheet">
                        
                                <style type="text/css">
                                    body{
                                        text-align: center;
                                        margin: 0 auto;
                                        width: 650px;
                                        font-family: 'Open Sans', sans-serif;
                                        background-color: #e2e2e2;		      	
                                        display: block;
                                    }
                                    ul{
                                        margin:0;
                                        padding: 0;
                                    }
                                    li{
                                        display: inline-block;
                                        text-decoration: unset;
                                    }
                                    a{
                                        text-decoration: none;
                                    }
                                    p{
                                        margin: 15px 0;
                                    }
                        
                                    h5{
                                        color:#444;
                                        text-align:left;
                                        font-weight:400;
                                    }
                                    
                                    .text-center{
                                        text-align: center
                                    }
                                    .main-bg-light{
                                        background-color: #e2e2e2;
                                    }
                                    .title{
                                        color: #444444;
                                        font-size: 22px;
                                        font-weight: bold;
                                        margin-top: 10px;
                                        margin-bottom: 10px;
                                        padding-bottom: 0;
                                        text-transform: uppercase;
                                        display: inline-block;
                                        line-height: 1;
                                    }
                                    table{
                                        margin-top:30px
                                    }
                                    table.top-0{
                                        margin-top:0;
                                    }
                                    table.order-detail {
                                        border: 1px solid #ddd;
                                        border-collapse: collapse;
                                    }
                                    table.order-detail tr:nth-child(even) {
                                    border-top:1px solid #ddd;
                                    border-bottom:1px solid #ddd;
                                    }
                                    table.order-detail tr:nth-child(odd) {
                                        border-bottom:1px solid #ddd;
                                    }
                                    .pad-left-right-space{
                                        border: unset !important;
                                    }
                                    .pad-left-right-space td{
                                        padding: 5px 15px;
                                    }
                                    .pad-left-right-space td p{
                                        margin: 0;
                                    }
                                    .pad-left-right-space td b{
                                        font-size:15px;
                                        font-family: 'Roboto', sans-serif;
                                    }
                                    .order-detail th{
                                        font-size:16px;
                                        padding:15px;
                                        text-align:center;
                                        background: #fafafa;
                                    }
                                    .footer-social-icon tr td img{
                                        margin-left:5px;
                                        margin-right:5px;
                                    }
                                </style>
                            </head>
                            <body style="margin: 20px auto;">
                                <table align="center" border="0" cellpadding="0" cellspacing="0" style="padding: 0 30px;background-color: #fff; -webkit-box-shadow: 0px 0px 14px -4px rgba(0, 0, 0, 0.2705882353);box-shadow: 0px 0px 14px -4px rgba(0, 0, 0, 0.2705882353);width: 100%;">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <table align="left" border="0" cellpadding="0" cellspacing="0" style="text-align: left;" width="100%">
                                                    <tr>
                                                        <td style="text-align: center;">
                                                            <img src="https://i.ibb.co/s2DyTgb/vapehan.png" alt="" style="width: 100px; height: 100px; margin-bottom: 30px;">
                                                        </td>
                                                    </tr>                            
                                                <tr>
                                                        <td>
                                                            <p style="font-size: 14px;"><b>Hi ${dataAkun.firstname} ${dataAkun.lastname},</b></p>
                                                            <p style="font-size: 14px;">If you forget your password, you can click the link below:</p>
                                                            <p style="font-size: 14px;"><a href="http://192.168.1.160:4200/pages/changepassword/${dataAkun.accessToken}" style="cursor: pointer; color: #ff0000; text-decoration: underline;">Change Your Password</a></p>
                                                        </td>
                                                    </tr> 
                                                </table>
                                                                
                                            </td>
                                        </tr>
                                    </tbody>            
                                </table>
                                <table class="main-bg-light text-center top-0"  align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                                                    <tr>
                                                        <td style="padding: 30px;">
                                                            <div>
                                                                <h4 class="title" style="margin:0;text-align: center;">Follow us</h4>
                                                            </div>
                                                            <table border="0" cellpadding="0" cellspacing="0" class="footer-social-icon" align="center" class="text-center" style="margin-top:20px;">
                                                                <tr>
                                                                    <td>
                                                                        <a href="https://www.facebook.com/vapehan/" target="_blank"><img src="https://i.ibb.co/WyCqkG0/facebook.png" alt=""></a>
                                                                    </td>
                                                                    <td>
                                                                        <a target="_blank" href="https://www.youtube.com/channel/UCmczby514u9CnJcFO0s0Cxg"><img src="https://i.ibb.co/wWrd3Fz/youtube.png" alt=""></a>
                                                                    </td>
                                                                    <td>
                                                                        <a href="https://www.instagram.com/vapehan/?hl=en" target="_blank"><img src="https://i.ibb.co/cyNjBZy/instagram.png" alt=""></a>
                                                                    </td>
                                                                    <td>
                                                                        <a target="_blank" href="https://www.tokopedia.com/vapehan?source=universe&st=product"><img src="https://i.ibb.co/GHxKCCB/tokopedia.png" alt=""></a>
                                                                    </td>
                                                                    <td>
                                                                        <a target="_blank" href="https://shopee.co.id/vapehan"><img src="https://i.ibb.co/5cLqh72/shopee.png" alt=""></a>
                                                                    </td>
                                                                    <td>
                                                                        <a target="_blank" href="https://www.bukalapak.com/u/vapehan"><img src="https://i.ibb.co/zNPb3mZ/bukalapak.png" alt=""></a>
                                                                    </td>
                                                                </tr>                                    
                                                            </table>
                                                            <div style="border-top: 1px solid #444; margin: 20px auto 0;"></div>
                                                            <table  border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px auto 0;" >
                                                                
                                                                <tr>
                                                                    <td>
                                                                        <p style="font-size:13px; margin:0;">2019 Copy Right by Vapehan powerd by HSG</p>
                                                                    </td>
                                                                </tr>
                                                                
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                            </body>
                        </html>` // html body
            });

            console.log('Message sent: %s', info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        }

        main().catch(console.error);
        res.json({ text: 'Success' });
    }

    public async verify(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const verify = {
            verification: true,
            status: true
        }
        // console.log(id);
        const customer = await pool.query('SELECT id FROM vh_customer WHERE accessToken = ?', [id]);
        await pool.query('UPDATE vh_customer set ? WHERE accessToken = ?', [verify, id]);
        if (customer== "") {
            res.status(404).json({ text: "Customer doesn't exists" });
        } else {
            res.json({ text: 'Success Delete' });
            
        }
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
    public async delete(req: Request, res: Response): Promise<any> {
        const { id } = req.params;        
        const customer = await pool.query('SELECT id FROM vh_customer WHERE id = ?', [id]);
        await pool.query('CALL DeleteCustomer(?)', [id]);
        if (customer== "") {
            res.status(404).json({ text: "Customer doesn't exists" });
        } else {
            res.json({ text: 'Success Delete' });
            
        }
    }

    public async update(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const customer = await pool.query('SELECT id FROM vh_customer WHERE id = ?', [id]);
        await pool.query('UPDATE vh_customer set ? WHERE id = ?', [req.body, id]);
        if(customer == "") {
            res.status(404).json({ text: "Customer doesn't exists" });
        } else {
            res.json({ message: 'The Customer was Update' });
        }
        
    }

    public async updatePhone(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const customer = await pool.query('SELECT id_customer FROM vh_customer_info WHERE id_customer = ?', [id]);
        await pool.query('UPDATE vh_customer_info SET phone = ? WHERE id_customer = ?', [req.body.phone, id]);
        if(customer == "") {
            res.status(404).json({ text: "Customer doesn't exists" });
        } else {
            res.json({ message: 'The Customer was Update' });
        }
        
    }

    public async editAddress(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const data = {
            address : req.body.address,
            id_province : req.body.id_province,
            id_city : req.body.id_city,
            id_district : req.body.id_district,
            postal : req.body.postal
        }
        const customer = await pool.query('SELECT id FROM vh_customer WHERE id = ?', [id]);
        // console.log(dataA, dataB);
        await pool.query('UPDATE vh_customer_info set ? WHERE id_customer = ?', [data, id]);

        if(customer == "") {
            res.status(404).json({ text: "Customer doesn't exists" });
        } else {
            res.json({ message: 'The Customer was Update' });
        }
        
    }

    public async editInfo(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const customer = await pool.query('SELECT id FROM vh_customer WHERE id = ?', [id]);
        const dataA = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
        }
        const dataB = {
            gender: req.body.gender,
            dob: req.body.dob
        }
        // console.log(dataA, dataB);

        await pool.query('UPDATE vh_customer set ? WHERE id = ?', [dataA, id]);
        await pool.query('UPDATE vh_customer_info set ? WHERE id_customer = ?', [dataB, id]);

        if(customer == "") {
            res.status(404).json({ text: "Customer doesn't exists" });
        } else {
            res.json({ message: 'The Customer was Update' });
        }
        
    }

    public async editContact(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const customer = await pool.query('SELECT id FROM vh_customer WHERE id = ?', [id]);
        const dataA = {
            email: req.body.email,
        }
        const dataB = {
            phone: req.body.phone,
        }
        // console.log(dataA, dataB);

        await pool.query('UPDATE vh_customer set ? WHERE id = ?', [dataA, id]);
        await pool.query('UPDATE vh_customer_info set ? WHERE id_customer = ?', [dataB, id]);

        if(customer == "") {
            res.status(404).json({ text: "Customer doesn't exists" });
        } else {
            res.json({ message: 'The Customer was Update' });
        }
        
    }

    public async editPassword(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const customer = await pool.query('SELECT id FROM vh_customer WHERE id = ?', [id]);
        const dataA = {
            password: md5(req.body.password)
        }
        // console.log(dataA, dataB);

        await pool.query('UPDATE vh_customer set ? WHERE id = ?', [dataA, id]);

        if(customer == "") {
            res.status(404).json({ text: "Customer doesn't exists" });
        } else {
            res.json({ message: 'The Customer was Update' });
        }
        
    }

    public async addAddress(req: Request, res: Response): Promise<any> {
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
        }
        await pool.query('INSERT INTO vh_customer_info set ?', data);
        res.json({message: 'Success'});
    }

}

const registercontroller = new RegisterController();
export default registercontroller;