package com.bitsoft.st.security.common

import com.bitsoft.st.utils.AppConstant

class UserMapping {

    Long id
    Long userId
    String deviceMac
    String status = AppConstant.STATUS.ACTIVE

    Integer syncLocInMin = 10

    Client client

    Date created
    Date updated

    static constraints = {
        deviceMac(unique: true)
    }

    def beforeUpdate = {
        this.updated = new Date()
    }

    def beforeValidate() {
        this.created = this.created ?: new Date()
        this.updated = this.updated ?: new Date()
    }
}
