package com.bitsoft.st.security.common

class UserMapping {

    Long id
    String deviceMac

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
