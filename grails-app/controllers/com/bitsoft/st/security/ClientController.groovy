package com.bitsoft.st.security

import com.bitsoft.st.security.common.Client
import com.bitsoft.st.security.common.UserMapping
import grails.converters.JSON

class ClientController {

    ClientService clientService

    def createClient() {
        Map params = request.JSON
        Client client = clientService.createClient(params)
        if (client) {
            render([status: "success", client: client] as JSON)
        } else {
            render([status: "warning", message: "Sorry!"] as JSON)
        }
    }

    def getAvailableEntity() {
        Client client = clientService.getAvailableEntity()
        if (client) {
            render([status: "success", client: client] as JSON)
        } else {
            render([status: "warning", message: "Sorry!"] as JSON)
        }
    }

    def saveUserMapping() {
        UserMapping userMapping = clientService.saveUserMapping(params)
        if (userMapping) {
            render([status: "success", userMapping: userMapping] as JSON)
        } else {
            render([status: "warning", message: "Sorry!"] as JSON)
        }
    }

    def getByDeviceMac() {
        Map params = request.JSON
        Map userData = clientService.getByDeviceMac(params)
        if (userData) {
            render([status: "success", userData: userData] as JSON)
        } else {
            render([status: "warning", message: "Sorry!"] as JSON)
        }
    }

}