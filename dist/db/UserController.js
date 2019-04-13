"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as express from 'express';
const basicController_1 = require("./basicController");
// const uuid = require('uuid/v4');
// const fs = require('fs');
const fs = require("fs");
class UserController extends basicController_1.BasicController {
    constructor(userfile, groupfile) {
        super();
        this.userfile = userfile;
        this.groupfile = groupfile;
        console.log(`User controller created with ${this.userfile}, group file : ${this.groupfile}`);
        this.setupRouter();
    }
    getUser(userfile, callback) {
        console.log(`loading user info from ${userfile}`);
        fs.readFile(userfile, (err, data) => {
            if (err) {
                throw err;
            }
            //console.log(data.toString());
            let lines = data.toString().split("\n");
            //console.log("all lines : ", lines);
            let users = [];
            lines.forEach((line) => {
                //console.log("get line : ", line);
                let f = line.split(':');
                if (f.length == 0 || f[0] == "") {
                    // console.log('empty fields');
                    return;
                }
                // console.log(`get user : ${f[0]} , uid: ${f[2]}, gid: ${f[3]}`);
                users.push({
                    "name": f[0],
                    "uid": parseInt(f[2]),
                    "gid": parseInt(f[3]),
                    "comment": f[4],
                    "home": f[5],
                    "shell": f[6]
                });
                //if (callback) callback(user);
            });
            if (callback)
                callback(users);
        });
    }
    setupRouter() {
        //TODO: login should return a temporary sessionId to be used in the following commands, sessionId expire in 24 hours by default
        this._router.post('/login', (req, res) => {
            console.log("Authorization Header is: ", req.headers);
            // let auth: string = req.headers['authorization'];  // auth is in base64(username:password)  so we need to decode the base64
            this.checkAuthentication(req.headers.authorization, (errCode, resp) => {
                res.status(errCode).send(resp);
            });
        });
        this._router.get('/', (req, res) => {
            console.log('requesting all Users info');
            this.checkAuthentication(req.headers.authorization, (errCode, resp) => {
                if (resp.loginSucceed && errCode == 200) {
                    this.getUser(this.userfile, (users) => {
                        if (users.length == 0) {
                            res.status(404).send({ "error": "invalid configuration file !" });
                        }
                        else {
                            res.status(200).send(users);
                        }
                    });
                }
                else {
                    res.status(errCode).send(resp.reason);
                }
            });
        });
        this._router.get('/query', (req, res) => {
            //req.url is the command line
            console.log('query url: ', req.url);
            this.checkAuthentication(req.headers.authorization, (errCode, resp) => {
                let Cnds = this.parseUrl(req.url);
                console.log("cnds :", Cnds);
                if (resp.loginSucceed && errCode == 200) {
                    this.getUser(this.userfile, (users) => {
                        let qRes = [];
                        users.forEach((user) => {
                            if (this.isMatchAll(user, Cnds)) {
                                console.log("match : ", user);
                                qRes.push(user);
                            }
                        });
                        if (qRes.length == 0) {
                            res.status(404).send({ "error": "not found" });
                        }
                        else {
                            res.status(200).send(qRes);
                        }
                    });
                }
                else {
                    res.status(errCode).send(resp.reason);
                }
            });
        });
        this._router.get('/:id', (req, res) => {
            this._router.get('/', (req, res) => {
                console.log('requesting all Users info');
                this.checkAuthentication(req.headers.authorization, (errCode, resp) => {
                    if (resp.loginSucceed && errCode == 200) {
                        this.getUser(this.userfile, (users) => {
                            let user = users.find((item) => {
                                return item.uid == req.params.id;
                            });
                            if (user) {
                                res.status(200).send(user);
                            }
                            else {
                                res.status(404).send({ "error": "not found" });
                            }
                        });
                    }
                    else {
                        res.status(errCode).send(resp.reason);
                    }
                });
            });
        });
        this._router.get('/:id/groups', (req, res) => {
            this.checkAuthentication(req.headers.authorization, (errCode, resp) => {
                if (resp.loginSucceed && errCode == 200) {
                    this.getUser(this.userfile, (users) => {
                        let user = users.find((item) => {
                            return item.uid == req.params.id;
                        });
                        this.getGroup(this.groupfile, (grps) => {
                            let qRes = grps.filter((grp) => {
                                return grp.members.includes(user.name);
                            });
                            if (qRes.length == 0) {
                                res.status(404).send({ "error": "specified group not found !" });
                            }
                            else {
                                res.status(200).send(qRes);
                            }
                        });
                    });
                }
                else {
                    res.status(errCode).send(resp.reason);
                }
            });
        });
    }
}
exports.UserController = UserController;
