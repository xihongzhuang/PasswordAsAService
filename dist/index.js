'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const passwd_service_1 = require("./passwd.service");
let app = new passwd_service_1.PasswdService().getApp();
exports.app = app;
