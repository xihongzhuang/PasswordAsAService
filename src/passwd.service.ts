import { Server, createServer } from 'http';
// import { Server, createServer } from 'https';
// import * as https from 'https';
import * as express from 'express';
import * as fs from 'fs';

// import { CameraController } from './db/CameraController';
import { UserController } from './db/UserController';
import { GroupController } from './db/GroupController';
var cors = require('cors');

export class PasswdService {
    public static readonly PORT: number = 8080;
    private app: express.Application;
    private server: Server;
    private port: string | number;
    private CFG: string;
    private passwdFile: string;
    private groupFile: string;
    private userController : UserController;
    private grpController : GroupController;

    constructor(CFGFile: string="/etc/ms_retrieve_userinfo.cfg") {
        this.CFG = CFGFile;
        this.prepareConfigure((err: any) => {
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

    private prepareConfigure(onCFGLoaded: any): void {
        try
        {
            if (fs.existsSync(this.CFG)) {
                console.log("loading configuration file from : " + this.CFG);
                fs.readFile(this.CFG, (err, data) => {                    
                    if (err) {
                        if (onCFGLoaded) onCFGLoaded(err);
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
                        if (onCFGLoaded) onCFGLoaded("passwd file not found !");
                        return;
                    }
                    if (obj.group_file && fs.existsSync(obj.group_file)) {
                        this.groupFile = obj.group_file;
                    }
                    else {
                        if (onCFGLoaded) onCFGLoaded("group file not found !");
                        return;
                    }
                    console.log(`get CFG : ${this.passwdFile}, groupFile: ${this.groupFile}`);
                    if (onCFGLoaded) onCFGLoaded(undefined);
                });
            }
            else {
                console.log(`config file ${this.CFG} not found, load default value`);
                this.passwdFile = "/etc/passwd";
                this.groupFile = "/etc/group";
                if (onCFGLoaded) onCFGLoaded(undefined);
            }
        
        } catch (err) {
            if (onCFGLoaded) onCFGLoaded(err);
        }
        
    }

    private createApp(): void {
        this.app = express();
        this.app.use(cors({
            origin: '*'
        }));
        this.userController = new UserController(this.passwdFile, this.groupFile);
        this.app.use('/users', this.userController.router);
        this.grpController = new GroupController(this.groupFile);
        this.app.use('/groups', this.grpController.router);
    }

    private createHTTPServer(): void {
        //Support HTTPS
        // this.server = createServer(this.options, this.app);
        //support HTTP for the moment
        this.server = createServer(this.app);
    }

    private config(): void {
        this.port = process.env.PORT || PasswdService.PORT;
    }

    
    private listen(): void {
        this.server.listen(this.port, () => {
            console.log(`Running https server on port ${this.port}`);
            // console.log(`Running http server on port ${this.port}`);
        });
    }

    public getApp(): express.Application {
        return this.app;
    }
}