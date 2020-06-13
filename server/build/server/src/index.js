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
const sendEmail_1 = __importDefault(require("./routes/sendEmail"));
class Server {
    constructor() {
        this.app = express_1.default();
        this.config();
        this.routes();
    }
    config() {
        this.app.set('port', process.env.PORT || 4000);
        this.app.use(morgan_1.default('dev'));
        this.app.use(cors_1.default());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this.app.use('/', indexRoutes_1.default);
        this.app.use('/api/catalog/product', productRoutes_1.default);
        this.app.use('/api/catalog/category', categoryRoutes_1.default);
        this.app.use('/api/catalog/brand', brandRoutes_1.default);
        this.app.use('/api/catalog/disct', discountRoutes_1.default);
        this.app.use('/api/catalog/voch', voucherRoutes_1.default);
        this.app.use('/api/auth/user', userRoutes_1.default);
        this.app.use('/api/auth/permission', permissionRoutes_1.default);
        this.app.use('/api/auth/roles', rolesRoutes_1.default);
        this.app.use('/api/auth/company', companyRoutes_1.default);
        this.app.use('/api/order/orders', ordersRoutes_1.default);
        this.app.use('/api/order/delivery', deliveriesRoutes_1.default);
        this.app.use('/api/order/invoice', invoicesRoutes_1.default);
        this.app.use('/api/order/confirm', confirmRoutes_1.default);
        this.app.use('/api/order/cart', cartRoutes_1.default);
        this.app.use('/api/order/notif', notifRoutes_1.default);
        this.app.use('/api/customer/register', registerRoutes_1.default);
        this.app.use('/api/customer/invoice/list', cinvoiceRoutes_1.default);
        this.app.use('/api/shipping/courier', courierRoutes_1.default);
        this.app.use('/api/shipping/address', addressRoutes_1.default);
        this.app.use('/api/shipping/ongkir', ongkirRoutes_1.default);
        this.app.use('/api/dist/distributor', distributorRoutes_1.default);
        this.app.use('/images', express_1.default.static('images'));
        this.app.use('/images/product', express_1.default.static('images/product'));
        this.app.use('/images/categories', express_1.default.static('images/categories'));
        this.app.use('/images/brands', express_1.default.static('images/brands'));
        this.app.use('/images/distributors', express_1.default.static('images/distributors'));
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
