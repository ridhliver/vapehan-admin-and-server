import express from 'express';
import { Application } from 'express-serve-static-core';
import morgan from 'morgan';
import cors from 'cors';

import indexRoutes from './routes/indexRoutes';
import productRoutes from './routes/catalog/product/productRoutes';
import categoryRoutes from './routes/catalog/category/categoryRoutes';
import brandRoutes from './routes/catalog/brand/brandRoutes';
import discountRoutes from './routes/catalog/discount/discountRoutes';
import voucherRoutes from './routes/catalog/voucher/voucherRoutes';
import userRoutes from './routes/auth/user/userRoutes';
import permissionRoutes from './routes/auth/permission/permissionRoutes';
import rolesRoutes from './routes/auth/roles/rolesRoutes';
import companyRoutes from './routes/auth/company/companyRoutes';
import orderRoutes from './routes/order/orders/ordersRoutes';
import deliveryRoutes from './routes/order/delivery/deliveriesRoutes';
import invoiceRoutes from './routes/order/invoice/invoicesRoutes';
import confirmRoutes from './routes/order/confirm/confirmRoutes';
import cartRoutes from './routes/order/cart/cartRoutes';
import notifRoutes from './routes/order/notif/notifRoutes';
import registerRoutes from './routes/customer/register/registerRoutes';
import cinvoiceRoutes from './routes/customer/invoice/cinvoiceRoutes';
import courierRoutes from './routes/shipping/courier/courierRoutes';
import addressRoutes from './routes/shipping/address/addressRoutes';
import ongkirRoutes from './routes/shipping/ongkir/ongkirRoutes';
import distributorRoutes from './routes/distributor/distributorRoutes';

import sendEmail from './routes/sendEmail';



 class Server {

    public app: Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config(): void {
        this.app.set('port', process.env.PORT || 4000);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
    }

    routes(): void {
        this.app.use('/', indexRoutes);
        this.app.use('/api/catalog/product' ,productRoutes);
        this.app.use('/api/catalog/category', categoryRoutes);
        this.app.use('/api/catalog/brand', brandRoutes);
        this.app.use('/api/catalog/disct', discountRoutes);
        this.app.use('/api/catalog/voch', voucherRoutes);
        this.app.use('/api/auth/user', userRoutes);
        this.app.use('/api/auth/permission', permissionRoutes);
        this.app.use('/api/auth/roles', rolesRoutes);
        this.app.use('/api/auth/company', companyRoutes);
        this.app.use('/api/order/orders', orderRoutes);
        this.app.use('/api/order/delivery', deliveryRoutes);
        this.app.use('/api/order/invoice', invoiceRoutes);
        this.app.use('/api/order/confirm', confirmRoutes)
        this.app.use('/api/order/cart', cartRoutes);
        this.app.use('/api/order/notif', notifRoutes);
	this.app.use('/api/customer/register', registerRoutes);
        this.app.use('/api/customer/invoice/list', cinvoiceRoutes);
        this.app.use('/api/shipping/courier', courierRoutes);
        this.app.use('/api/shipping/address', addressRoutes);
        this.app.use('/api/shipping/ongkir', ongkirRoutes);
        this.app.use('/api/dist/distributor', distributorRoutes);
        this.app.use('/images', express.static('images'));
        this.app.use('/images/product', express.static('images/product'));
        this.app.use('/images/categories', express.static('images/categories'));
        this.app.use('/images/brands', express.static('images/brands'));
        this.app.use('/images/distributors', express.static('images/distributors'));
        this.app.use('/assets/image/email-temp', express.static('assets/image/email-temp'));

        this.app.use('/api/sendemail', sendEmail);
    }

    start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('server on port', this.app.get('port'));
        });
    }    
 }

 const server = new Server();
 server.start();
