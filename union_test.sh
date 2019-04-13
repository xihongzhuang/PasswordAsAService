#/bin/bash -x

##if Password As a Service is running on different machine, change the hostname here, 
##etc. TARGET=192.168.0.100
TARGET=localhost
## username : admin/admin123
HEAD="Authorization: Basic YWRtaW46YWRtaW4xMjM="
##this is the encoding string of admin:admin1234
INVALIDAUTH="Authorization: Basic YWRtaW46YWRtaW4xMjM0"

echo ">>>>>>>>test invalid login ..."

curl -H "$INVALIDAUTH" --request POST "http://$TARGET:8080/users/login"

echo 
echo ">>>>>>>>login ..."

curl -H "$HEAD" --request POST http://$TARGET:8080/users/login

echo 
echo ">>>>>>>>query all users ..."
##curl http://$TARGET:8080/users
curl -H "$HEAD" http://$TARGET:8080/users

echo 
echo ">>>>>>>>query all users with shell /bin/false..."
curl -H "$HEAD" http://$TARGET:8080/users/query?shell=%2Fbin%2Ffalse

echo 
echo ">>>>>>>>query user root ..."

curl -H "$HEAD" "http://$TARGET:8080/users/query?name=root"

echo 
echo ">>>>>>>>query all groups for surjohn ..."
curl -H "$HEAD" http://$TARGET:8080/users/1000/groups

echo 
echo ">>>>>>>>query all groups ..."
curl -H "$HEAD" http://$TARGET:8080/groups

echo 
echo ">>>>>>>>query group member of syslog and surjohn ..."
curl -H "$HEAD" "http://$TARGET:8080/groups/query?member=syslog&member=surjohn"
echo 
