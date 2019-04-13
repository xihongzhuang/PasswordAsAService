"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
// import { Server, createServer } from 'https';
// import * as https from 'https';
const express = require("express");
const fs = require("fs");
// import { CameraController } from './db/CameraController';
const UserController_1 = require("./db/UserController");
const GroupController_1 = require("./db/GroupController");
var cors = require('cors');
class PasswdService {
    constructor(CFGFile = "/etc/ms_retrieve_userinfo.cfg") {
        this.CFG = CFGFile;
        this.prepareConfigure((err) => {
            if (err) {
                console.error(err);
                throw err;
            }
            this.createApp();
            this.config();
            this.createHTTPServer();
            this.listen();
        });
    }
    prepareConfigure(onCFGLoaded) {
        try {
            if (fs.existsSync(this.CFG)) {
                console.log("loading configuration file from : " + this.CFG);
                fs.readFile(this.CFG, (err, data) => {
                    if (err) {
                        if (onCFGLoaded)
                            onCFGLoaded(err);
                        return;
                    }
                    let lines = data.toString();
                    var obj = JSON.parse(lines);
                    /*
                    the configuration file passed in should have the following structure
{
"pwd_file": "/etc/passwd",
"group_file": "/etc/group"
}
                     */
                    if (obj.pwd_file && fs.existsSync(obj.pwd_file)) {
                        this.passwdFile = obj.pwd_file;
                    }
                    else {
                        if (onCFGLoaded)
                            onCFGLoaded("passwd file not found !");
                        return;
                    }
                    if (obj.group_file && fs.existsSync(obj.group_file)) {
                        this.groupFile = obj.group_file;
                    }
                    else {
                        if (onCFGLoaded)
                            onCFGLoaded("group file not found !");
                        return;
                    }
                    console.log(`get CFG : ${this.passwdFile}, groupFile: ${this.groupFile}`);
                    if (onCFGLoaded)
                        onCFGLoaded(undefined);
                });
            }
            else {
                console.log(`config file ${this.CFG} not found, load default value`);
                this.passwdFile = "/etc/passwd";
                this.groupFile = "/etc/group";
                if (onCFGLoaded)
                    onCFGLoaded(undefined);
            }
        }
        catch (err) {
            if (onCFGLoaded)
                onCFGLoaded(err);
        }
    }
    createApp() {
        this.app = express();
        this.app.use(cors({
            origin: '*'
        }));
        this.userController = new UserController_1.UserController(this.passwdFile, this.groupFile);
        this.app.use('/users', this.userController.router);
        this.grpController = new GroupController_1.GroupController(this.groupFile);
        this.app.use('/groups', this.grpController.router);
    }
    createHTTPServer() {
        //Support HTTPS
        // this.server = createServer(this.options, this.app);
        //support HTTP for the moment
        this.server = http_1.createServer(this.app);
    }
    config() {
        this.port = process.env.PORT || PasswdService.PORT;
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log(`Running https server on port ${this.port}`);
            // console.log(`Running http server on port ${this.port}`);
        });
    }
    getApp() {
        return this.app;
    }
}
PasswdService.PORT = 8080;
exports.PasswdService = PasswdService;
