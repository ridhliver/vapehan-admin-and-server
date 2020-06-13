"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Services
var confirm_service_1 = require("./confirm.service"); // You have to uncomment this, when your real back-end is done
exports.ConfirmService = confirm_service_1.ConfirmService;
var order_service_1 = require("./order.service"); // You have to comment this, when your real back-end is done
exports.OrderService = order_service_1.OrderService;
var shipping_service_1 = require("./shipping.service");
exports.ShippingService = shipping_service_1.ShippingService;
var delivery_service_1 = require("./delivery.service");
exports.DeliveryService = delivery_service_1.DeliveryService;
var invoice_service_1 = require("./invoice.service");
exports.InvoiceService = invoice_service_1.InvoiceService;
var notif_service_1 = require("./notif.service");
exports.NotifService = notif_service_1.NotifService;
