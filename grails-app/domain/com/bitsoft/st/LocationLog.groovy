package com.bitsoft.st

import com.bitsoft.st.utils.AppConstant
import grails.gorm.MultiTenant


class LocationLog implements MultiTenant<LocationLog> {

    Long id

    User user

    String identifier //without user for one time tracking
    String address
    String deviceInfo
    String charge

    Double lat
    Double lng

    Date trackingTime
    Date created
    Date updated

    static constraints = {
        deviceInfo(column: "deviceInfo", sqlType: "varchar(5000)")
        user(nullable: true)
        identifier(nullable: true)
        charge(nullable: true)
        deviceInfo(nullable: true)
        address(nullable: true)
        trackingTime(nullable: true)
    }

    def beforeUpdate = {
        this.updated = new Date()
    }

    def beforeValidate() {
        this.created = this.created ?: new Date()
        this.updated = this.updated ?: new Date()
    }
}