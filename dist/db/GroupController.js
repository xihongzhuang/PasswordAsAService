"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as express from 'express';
const basicController_1 = require("./basicController");
// const uuid = require('uuid/v4');
class GroupController extends basicController_1.BasicController {
    constructor(groupfile) {
        super();
        this.groupfile = groupfile;
        console.log(`Group controller created with group file : ${this.groupfile}`);
        this.setupRouter();
    }
    //match all condition
    isMatchAllCnd(grp, Cnds) {
        let keyNames = Object.keys(grp);
        let res = true;
        // console.log("group condition : ", Cnds);
        keyNames.forEach((item) => {
            if (res) {
                // if (item == "members" && Array.isArray(grp.members)) {
                if (item == "members") {
                    // console.log("grp.members : ", grp.members);
                    if (Cnds.has('member')) {
                        res = Cnds.get('member').every((m) => {
                            return grp.members.includes(m);
                        });
                    }
                }
                else if (Cnds.has(item)) {
                    let val = String(grp[item]);
                    res = Cnds.get(item).includes(val);
                }
            }
        });
        return res;
    }
    setupRouter() {
        this._router.get('/', (req, res) => {
            //req.url is the command line
            this.getGroup(this.groupfile, (grps) => {
                if (grps.length == 0) {
                    res.status(404).send({ "error": "no group found, invalid configuration file !" });
                }
                else {
                    res.status(200).send(grps);
                }
            });
        });
        this._router.get('/query', (req, res) => {
            console.log('query url: ', req.url);
            let Cnds = this.parseUrl(req.url);
            console.log("cnds :", Cnds);
            //req.url is the command line
            this.getGroup(this.groupfile, (grps) => {
                let qRes = [];
                grps.forEach((grp) => {
                    if (this.isMatchAllCnd(grp, Cnds)) {
                        console.log("match : ", grp);
                        qRes.push(grp);
                    }
                });
                if (qRes.length == 0) {
                    res.status(404).send({ "error": "specified group not found !" });
                }
                else {
                    res.status(200).send(qRes);
                }
            });
        });
        this._router.get('/:id', (req, res) => {
            this.getGroup(this.groupfile, (grps) => {
                let grp = grps.find((item) => {
                    return item.gid == req.params.id;
                });
                if (grp) {
                    res.status(200).send(grp);
                }
                else {
                    res.status(404).send({ "error": `group ${req.params.id} not found !` });
                }
            });
        });
    }
}
exports.GroupController = GroupController;
