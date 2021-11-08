
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
 syncLocInMin: 5,
}

http://45.86.70.142:8080/st/client/getByDeviceMac
Request:
{
 deviceMac: "123"
}

Response:
{
  "status": "success",
  "userData": {
    "userId": 14,
    "deviceMac": "121212123",
    "orgName": "Jhenaidah Agri",
    "syncLocInMin": 25,
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

Response:

{
  "status": "success",
  "locationLog": {
    "id": 24,
    "created": "2021-11-08T10:41:17Z",
    "lat": 5423545.0,
    "address": null,
    "updated": "2021-11-08T10:41:17Z",
    "deviceInfo": "54325",
    "user": {
      "id": 14
    },
    "charge": "50%",
    "identifier": null,
    "lng": 324535.0
  },
  "syncLocInMin": 25
}