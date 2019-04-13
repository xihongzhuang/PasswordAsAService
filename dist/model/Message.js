"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UTCMessageType;
(function (UTCMessageType) {
    UTCMessageType["mtSTOP"] = "stopCommunication";
    UTCMessageType["mtPROXYREGISTER"] = "proxyRegister";
    UTCMessageType["mtPROXYRESPONSE"] = "proxy";
    UTCMessageType["mtHEARTBEAT"] = "heartbeat";
    UTCMessageType["mtSETUPURL"] = "setupURL";
    UTCMessageType["mtMERSOFTCOMMAND"] = "mersoftCommand";
    UTCMessageType["mtMERSOFTNOTIFICATION"] = "mersoftNotification";
    UTCMessageType["mtRESPONSE"] = "response";
    UTCMessageType["mtPTZ"] = "PTZ";
})(UTCMessageType = exports.UTCMessageType || (exports.UTCMessageType = {}));
