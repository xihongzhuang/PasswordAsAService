// import * as express from 'express';
import { BasicController } from './basicController';
import { IGroup } from '../model/IUser';
import { LoginResponse } from '../model/userLoginResponse';

// const uuid = require('uuid/v4');

export class GroupController extends BasicController {

    constructor(public groupfile: string) {
        super();
        console.log(`Group controller created with group file : ${this.groupfile}`);
        this.setupRouter();
    }
    
    //match all condition
    private isMatchAllCnd(grp: IGroup, Cnds: Map<string, any>) {
        let keyNames = Object.keys(grp);
        let res=true;
        // console.log("group condition : ", Cnds);

        keyNames.forEach((item) => {
            if (res) {
                // if (item == "members" && Array.isArray(grp.members)) {
                if (item == "members") {
                    // console.log("grp.members : ", grp.members);
                    if (Cnds.has('member')) {
                        res = Cnds.get('member').every((m: string) => {
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

    private setupRouter(): void {
        this._router.get('/', (req, res) => {
            //req.url is the command line

            this.checkAuthentication(req.headers.authorization, (errCode: number, resp: LoginResponse) => {
                if (resp.loginSucceed && errCode == 200) {
                    this.getGroup(this.groupfile, (grps: IGroup[]) => {
                        if (grps.length == 0) {
                            res.status(404).send({"error": "no group found, invalid configuration file !"});
                        }
                        else {
                            res.status(200).send(grps);
                        }    
                    });
        
                } else {
                    res.status(errCode).send(resp.reason);
                }
            });

        });

        this._router.get('/query', (req, res) => {
            console.log('query url: ', req.url);
            let Cnds = this.parseUrl(req.url);
            console.log("cnds :", Cnds);
            this.checkAuthentication(req.headers.authorization, (errCode: number, resp: LoginResponse) => {
                if (resp.loginSucceed && errCode == 200) {
                    this.getGroup(this.groupfile, (grps: IGroup[]) => {
                        let qRes : IGroup[] = [];
                        grps.forEach((grp: IGroup) => {
                            if (this.isMatchAllCnd(grp, Cnds)) {
                                console.log("match : ", grp);
                                qRes.push(grp);
                            }
                        });
                        if (qRes.length == 0) {
                            res.status(404).send({"error": "specified group not found !"});
                        }
                        else {                    
                            res.status(200).send(qRes);
                        }    
                    });
                
                } else {
                    res.status(errCode).send(resp.reason);
                }
            });
        });

        this._router.get('/:id', (req, res) => {
            this.checkAuthentication(req.headers.authorization, (errCode: number, resp: LoginResponse) => {
                if (resp.loginSucceed && errCode == 200) {
                    this.getGroup(this.groupfile, (grps: IGroup[]) => {
                        let grp = grps.find((item : IGroup) => {
                            return item.gid == req.params.id;
                        });
                        if (grp) {
                            res.status(200).send(grp);
                        }
                        else {                    
                            res.status(404).send({"error": `group ${req.params.id} not found !`});
                        }    
                    });
                
                } else {
                    res.status(errCode).send(resp.reason);
                }
            });

        });

    }
}
