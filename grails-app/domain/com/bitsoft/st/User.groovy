package com.bitsoft.st

import com.bitsoft.st.utils.AppConstant
import grails.gorm.MultiTenant


class User implements MultiTenant<User> {

    Long id
    String fullName
    String designation
    String note
    String userName
    String password
    String contactNo
    String deviceMac
    String status = AppConstant.STATUS.ACTIVE
    String imagePath

    Integer syncLocInMin = 15

    Date created
    Date updated

    Role role

    static constraints = {
        contactNo(nullable: false, unique: true, blank: false)
        userName(nullable: false, unique: true, blank: false)
        deviceMac(nullable: true, unique: true, blank: true)
        designation(nullable: true)
        imagePath(nullable: true)
        note(nullable: true)
        role(nullable: true, blank: true)
    }

    def beforeUpdate = {
        this.updated = new Date()
    }

    def beforeValidate() {
        this.created = this.created ?: new Date()
        this.updated = this.updated ?: new Date()
    }

    String getFullImagePath(){
        return "${AppConstant.getBaseUrl()}${this.imagePath}"
    }
}