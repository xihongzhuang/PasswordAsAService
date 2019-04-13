
this project is a minimal HTTP service that exposes the user and group information on
a UNIX-like system that is usually locked away in the UNIX /etc/passwd and /etc/groups files.
Prerequisite:
    this project is based on node.js (written in javascript)
    install latest node.js before proceed
    this project was tested orginally on Ubuntu 18.04, but should work on other platform with minor change

For testing purpose, here we use curl with basic Authentication hardcode with username : admin, password: admin123
HTTP header :
Authorization: Basic YWRtaW46YWRtaW4xMjM=
in production code, we should link this authentication process to a real backend user database or LDAP

##INSTALL
$ cd ~/PasswordAsAService
$ npm install

##to start the backend process:
$ npm start

##default configuration file is /etc/ms_retrieve_userinfo.cfg or user provided configuration file,
the configuration file passed in should have the following structure
{
"pwd_file": "/etc/passwd",
"group_file": "/etc/group"
}
which indicate the path of passwd file and group file

USAGE example:
## login process, pass in basic encoding for admin:admin123
curl -H "Authorization: Basic YWRtaW46YWRtaW4xMjM=" --request POST http://localhost:8080/users/login
## "query all users ..."
curl -H "$HEAD" http://localhost:8080/users

##unit test script : 
$ ./union_test.sh


