// "use strict";
import * as express from 'express';
// import bodyParser = require('body-parser');
import * as bodyParser from 'body-parser';
import { IGroup } from '../model/IUser';
import { LoginResponse } from '../model/userLoginResponse';

// const fs = require('fs');
import * as fs from 'fs';

export class BasicController {
    protected _router: express.Router;

    constructor() {
        this._router = express.Router();
        this._router.use(bodyParser.urlencoded({
            extended: true
        }));
    }

    public get router(): express.Router {
        return this._router;
    }
    
    public responseMsg(res: any, errCode: number, errMsg: string): boolean {
        res.status(errCode).send({
            loginSucceed: errCode === 200,
            reason: errMsg
        });
        return errCode === 200;
    }

    // password: req.body.password
    // checkAuthentication(auth: string, (retCode: number, user: any) )
    public checkAuthentication(auth: string, pCallback: any) {
        
        //TODO: check if a valid sessionId is presented in the header to bypass the normal authentication process
        if (!auth) {     // No Authorization header was passed in so it's the first time the browser hit us

            // Sending a 401 will require authentication, we need to send the 'WWW-Authenticate' to tell them the sort of authentication to use
            // Basic auth is quite literally the easiest and least secure, it simply gives back  base64( username + ":" + password ) from the browser
            // res.statusCode = 401;
            // res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
            // res.status(401).send('<html><body>Need some creds son</body></html>');
            const resp: LoginResponse = {
                'loginSucceed': false,
                'reason': 'Secure Area, Need valid credential to login!'
            };
            pCallback(401, resp);
            return;
        }
        else if (auth) {
            let tmp = auth.split(' ');   // Split on a space, the original auth looks like  "Basic Y2hhcmxlczoxMjM0NQ==" and we need the 2nd part

            let buf = new Buffer(tmp[1], 'base64'); // create a buffer and tell it the data coming in is base64
            let plain_auth = buf.toString();        // read it back out as a string

            // console.log("Decoded Authorization ", plain_auth);

            // At this point plain_auth = "username:password"

            let creds = plain_auth.split(':');      // split on a ':'
            let username = creds[0];
            let password = creds[1];
            console.log(`decoded username: ${username}, password: ${password}`);
            //HardCode user and password here for now
            //TODO: verify valid user/password with actual record in backend database
            let cmpres: boolean = (username == "admin" && password == "admin123");
            console.log('hashCode is equal to myPass : ', cmpres);
            const retCode: number = cmpres ? 200 : 401;
            const resp: LoginResponse = {
                'loginName': username,
                'loginSucceed': cmpres,
                'reason': (cmpres ? 'success' : 'invalid password for user : ' + username)
            };
            pCallback(retCode, resp);
        }
    }

    public parseUrl(url: string) {
        console.log("parseUrl url: ", url);
        let q=url.split('?'), res=new Map<string, any>();
        if (q.length >= 2) {
            q[1].split('&').forEach((item) => {
                let vp = decodeURIComponent(item).split('=');
                console.log("parseUrl : ", item);
                if (res.has(vp[0])) {
                    res.get(vp[0]).push(vp[1]);
                } else {
                    res.set(vp[0], [vp[1]]);
                }
            });
        }
        return res;        
    }

    public getGroup(grpfile: string, callback: any) {
        console.log(`loading group info from ${grpfile}`);
        fs.readFile(grpfile, (err: any, data: any) => {
            if (err) {
                throw err;
            }
            //console.log(data.toString());
            let lines = data.toString().split("\n");
            //console.log("all lines : ", lines);
            let grps: IGroup[] = [];
    
            lines.forEach( (line: string) => {
                //console.log("get line : ", line);
                let f = line.split(':');
                if (f.length == 0 || f[0] == "") {
                    console.log('empty fields');
                    return;
                }
                //console.log(`get user : ${f[0]} , id: ${f[2]}`);
                let m=[];
                if (f.length > 3) {
                    m = f[3].split(',');
                }
                grps.push(
                    {
                    "name": f[0],
                    "gid": parseInt(f[2]),
                    "members": m
                    }
                );
            });
            if (callback) callback(grps);
        });
    }

    //match any of the condition
    public isMatchAny(obj: any, Cnds: Map<string, any>) {
        let keyNames = Object.keys(obj);
        let res=false;
        keyNames.forEach((item) => {
            if (!res && Cnds.has(item)) {
                let val = String(obj[item]);
                res = Cnds.get(item).includes(val); 
            }
        });
        return res;
    }

    //match all condition
    public isMatchAll(obj: any, Cnds: Map<string, any>) {
        let keyNames = Object.keys(obj);
        let res=true;
        keyNames.forEach((item) => {
            if (res && Cnds.has(item)) {
                let val = String(obj[item]);
                res = Cnds.get(item).includes(val); 
            }
        });
        return res;
    }
    
}