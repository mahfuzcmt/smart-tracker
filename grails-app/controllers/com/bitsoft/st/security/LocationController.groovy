package com.bitsoft.st.security

import com.bitsoft.st.LocationLog
import com.bitsoft.st.LocationService
import grails.converters.JSON

class LocationController {

    LocationService locationService
    SecurityService securityService

    def save() {
        Map params = request.JSON
        LocationLog locationLog = locationService.saveLocationLog(params)
        if (locationLog) {
            render([status: "success", locationLog: locationLog] as JSON)
        } else {
            render([status: "warning", message: "Sorry!"] as JSON)
        }
    }

    def list() {
        Map params = request.JSON
        if (securityService.isRequestValid(params.adminId?.toLong(), params.token)) {
            List<LocationLog> locationLogList = locationService.getLocationLogsByUser(params)
            if (locationLogList) {
                render([status: "success", locationLogs: locationLogList] as JSON)
            } else {
                render([status: "warning", message: "Sorry!"] as JSON)
            }
        } else {
            render([status: "error", message: "Unauthorized access!"] as JSON)
        }
    }

}