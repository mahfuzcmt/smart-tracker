
   ###Innitialize Role and User Data

http://localhost:8080/security/init/?tenantId=test2

{
"key" : "super",
"fullName" : "Test Admin",
"contactNo": "11111111",
"userName": "userName", //password will be same
}


http://45.86.70.142:8080/st/user/save?tenantId=TENANT_ID

{
 fullName: "Mahfuz Ahmed",
 contactNo: "01975585960",
 deviceMac: "123",
}

http://45.86.70.142:8080/st/client/getByDeviceMac?tenantId=TENANT_ID
Request:
{
 deviceMac: "123"
}

Response:
{
  "status": "success",
  "userData": {
    "userId": 10,
    "deviceMac": "123",
    "orgName": "Jhenaidah Agri",
    "tenantId": "tenant-1"
  }
}



http://45.86.70.142:8080/st/location/save?tenantId=TENANT_ID

{
	userId: "2"
	charge: "50%",
	lat: "",
	lng: "",
	deviceInfo: ""

}