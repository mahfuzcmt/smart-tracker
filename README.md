
   ###Innitialize Role and User Data

http://localhost:8080/security/init/?tenantId=test2

{
"key" : "super",
"fullName" : "Test Admin",
"contactNo": "11111111",
"userName": "userName", //password will be same
}

http://localhost:8080/user/save?tenantId=TENANT_ID

{
 fullName: "Mahfuz Ahmed",
 contactNo: "01975585960",
 deviceMac: "123",
 syncLocInMin: 5,
}

http://localhost:8080/client/getByDeviceMac
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



http://localhost:8080/location/save?tenantId=TENANT_ID

{
  "userId": 1,
  "locations": [
    {
      "charge": "92%",
      "lat": "23.72488500",
      "lng": "90.40253000",
      "datetime": "2022-05-14 11:32 AM"
    }
  ],
  "deviceInfo": {
    "mac_address": "0C:25:76:53:23:4C",
    "android_id": "dca2d1e754bb7a70",
    "os_version": "4.4.22+",
    "android_sdk": "25",
    "brand": "SUNMI",
    "device_name": "V2",
    "device_manufacturer": "SUNMI"
  },
  "tenantId": "tenant-1"
}

Response:

{
  "status": "success",
  "locationLog": {
    "id": 20,
    "created": "2021-11-08T11:02:33Z",
    "lat": 23.544987,
    "address": "20, Jhenaidah, Bangladesh",
    "updated": "2021-11-08T11:02:33Z",
    "deviceInfo": "{}",
    "user": {
      "id": 4
    },
    "charge": "50%",
    "identifier": null,
    "lng": 89.1726
  },
  "syncLocInMin": 5
}
