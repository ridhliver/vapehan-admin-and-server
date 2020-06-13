"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const indexRoutes_1 = __importDefault(require("./routes/indexRoutes"));
const productRoutes_1 = __importDefault(require("./routes/catalog/product/productRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/catalog/category/categoryRoutes"));
const bannerRoutes_1 = __importDefault(require("./routes/catalog/banner/bannerRoutes"));
const brandRoutes_1 = __importDefault(require("./routes/catalog/brand/brandRoutes"));
const discountRoutes_1 = __importDefault(require("./routes/catalog/discount/discountRoutes"));
const voucherRoutes_1 = __importDefault(require("./routes/catalog/voucher/voucherRoutes"));
const userRoutes_1 = __importDefault(require("./routes/auth/user/userRoutes"));
const permissionRoutes_1 = __importDefault(require("./routes/auth/permission/permissionRoutes"));
const rolesRoutes_1 = __importDefault(require("./routes/auth/roles/rolesRoutes"));
const companyRoutes_1 = __importDefault(require("./routes/auth/company/companyRoutes"));
const ordersRoutes_1 = __importDefault(require("./routes/order/orders/ordersRoutes"));
const deliveriesRoutes_1 = __importDefault(require("./routes/order/delivery/deliveriesRoutes"));
const invoicesRoutes_1 = __importDefault(require("./routes/order/invoice/invoicesRoutes"));
const confirmRoutes_1 = __importDefault(require("./routes/order/confirm/confirmRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/order/cart/cartRoutes"));
const notifRoutes_1 = __importDefault(require("./routes/order/notif/notifRoutes"));
const registerRoutes_1 = __importDefault(require("./routes/customer/register/registerRoutes"));
const cinvoiceRoutes_1 = __importDefault(require("./routes/customer/invoice/cinvoiceRoutes"));
const courierRoutes_1 = __importDefault(require("./routes/shipping/courier/courierRoutes"));
const addressRoutes_1 = __importDefault(require("./routes/shipping/address/addressRoutes"));
const ongkirRoutes_1 = __importDefault(require("./routes/shipping/ongkir/ongkirRoutes"));
const distributorRoutes_1 = __importDefault(require("./routes/distributor/distributorRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboard/dashboardRoutes"));
const settingRoutes_1 = __importDefault(require("./routes/setting/settingRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/payment/paymentRoutes"));
const notRoutes_1 = __importDefault(require("./routes/payment/notifRoutes"));
const wholesale_1 = __importDefault(require("./routes/wholesale/wholesaleRoutes"));
const sendEmail_1 = __importDefault(require("./routes/sendEmail"));
/*
const whitelist = ['https://pay.doku.com', 'http://192.168.1.160:1234'];
const whitelistIp = ['147.139.133.123', '103.10.130.35', '103.10.129.9'];

const corsOptionsDelegate = function (req, callback) {
    var f = /f/gi;
    var t = /:/gi
    const ip = req.connection.remoteAddress.replace(f,'').replace(t,'');
    console.log(ip);
    console.log(whitelist.indexOf(req.header('Origin')));
    console.log(whitelistIp.indexOf(ip));
    
    let corsOptions;
    
    if (whitelist.indexOf(req.header('Origin')) !== -1 || whitelistIp.indexOf(ip) !== -1) {
        corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = { origin: false }; // disable CORS for this request
    }
        callback(null, corsOptions); // callback expects two parameters: error and options
};
*/
var whitelist = ['http://vapehan.com', 'http://admin.vapehan.com', 'https://www.vapehan.com', 'https://admin.vapehan.com', 'https://api.vapehan.com', 'https://pay.doku.com/', 'https://vapehan.com', 'https://www.admin.vapehan.com'];
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        }

    }
};
class Server {
    constructor() {
        this.app = express_1.default();
        this.config();
        this.routes();
    }
    config() {
        this.app.set('port', process.env.PORT || 4000);
        this.app.use(morgan_1.default('dev'));

        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this.app.use('/', indexRoutes_1.default);
        this.app.use('/api/catalog/product', cors_1.default(), productRoutes_1.default);
        this.app.use('/api/catalog/category', cors_1.default(), categoryRoutes_1.default);
        this.app.use('/api/catalog/brand', cors_1.default(), brandRoutes_1.default);
        this.app.use('/api/catalog/disct', cors_1.default(), discountRoutes_1.default);
        this.app.use('/api/catalog/voch', cors_1.default(), voucherRoutes_1.default);
        this.app.use('/api/catalog/banner', cors_1.default(), bannerRoutes_1.default);
        this.app.use('/api/auth/user', cors_1.default(), userRoutes_1.default);
        this.app.use('/api/auth/permission', cors_1.default(), permissionRoutes_1.default);
        this.app.use('/api/auth/roles', cors_1.default(), rolesRoutes_1.default);
        this.app.use('/api/auth/company', cors_1.default(), companyRoutes_1.default);
        this.app.use('/api/order/orders', cors_1.default(), ordersRoutes_1.default);
        this.app.use('/api/order/delivery', cors_1.default(), deliveriesRoutes_1.default);
        this.app.use('/api/order/invoice', cors_1.default(), invoicesRoutes_1.default);
        this.app.use('/api/order/confirm', cors_1.default(), confirmRoutes_1.default);
        this.app.use('/api/order/cart', cors_1.default(), cartRoutes_1.default);
        this.app.use('/api/order/notif', cors_1.default(), notifRoutes_1.default);
	    this.app.use('/api/customer/register', cors_1.default(), registerRoutes_1.default);
        this.app.use('/api/customer/invoice/list', cors_1.default(), cinvoiceRoutes_1.default);
        this.app.use('/api/shipping/courier', cors_1.default(), courierRoutes_1.default);
        this.app.use('/api/shipping/address', cors_1.default(), addressRoutes_1.default);
        this.app.use('/api/shipping/ongkir', cors_1.default(), ongkirRoutes_1.default);
        this.app.use('/api/dist/distributor', cors_1.default(), distributorRoutes_1.default);
        this.app.use('/api/data/dashboard', cors_1.default(), dashboardRoutes_1.default);
        this.app.use('/api/setting', cors_1.default(), settingRoutes_1.default);
        this.app.use('/api/payment', cors_1.default(), paymentRoutes_1.default);
        this.app.use('/api/payment/mid/notif', cors_1.default(), notRoutes_1.default);
        this.app.use('/api/wholesale/register', cors_1.default(), wholesale_1.default);
        this.app.use('/images', express_1.default.static('images'));
        this.app.use('/images/product', express_1.default.static('images/product'));
        this.app.use('/images/categories', express_1.default.static('images/categories'));
        this.app.use('/images/brands', express_1.default.static('images/brands'));
        this.app.use('/images/distributors', express_1.default.static('images/distributors'));
        this.app.use('/images/banners', express_1.default.static('images/banners'));
        this.app.use('/assets/image/email-temp', express_1.default.static('assets/image/email-temp'));
        this.app.use('/api/sendemail', sendEmail_1.default);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('server on port', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
