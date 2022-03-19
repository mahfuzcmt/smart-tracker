package com.bitsoft.smarttracking.model;

public class LocModel {
    double lat;
    double lng;
    String address;
    String charge;
    String created;
    int userId;
    String fullName;
    String contactNo;
    String imagePath;
    String designation;

    public LocModel() {
    }

    public LocModel(double lat, double lng, String address, String charge, String created, int userId, String fullName, String contactNo, String imagePath, String designation) {
        this.lat = lat;
        this.lng = lng;
        this.address = address;
        this.charge = charge;
        this.created = created;
        this.userId = userId;
        this.fullName = fullName;
        this.contactNo = contactNo;
        this.imagePath = imagePath;
        this.designation = designation;
    }

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public double getLng() {
        return lng;
    }

    public void setLng(double lng) {
        this.lng = lng;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCharge() {
        return charge;
    }

    public void setCharge(String charge) {
        this.charge = charge;
    }

    public String getCreated() {
        return created;
    }

    public void setCreated(String created) {
        this.created = created;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getContactNo() {
        return contactNo;
    }

    public void setContactNo(String contactNo) {
        this.contactNo = contactNo;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }
}
