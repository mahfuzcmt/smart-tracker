package com.bitsoft.st.security

import com.bitsoft.st.LocationLog
import com.bitsoft.st.LocationService
import grails.converters.JSON

class LocationController {

    LocationService locationService

    def saveLocationLog() {
        Map params = request.JSON
        LocationLog locationLog = locationService.saveLocationLog(params)
        if (locationLog) {
            render([status: "success", locationLog: locationLog] as JSON)
        } else {
            render([status: "warning", message: "Sorry!"] as JSON)
        }
    }

    def getLocationLogs() {
        Map params = request.JSON
        LocationLog locationLog = locationService.getLocationLogsByUser(params)
        if (locationLog) {
            render([status: "success", locationLog: locationLog] as JSON)
        } else {
            render([status: "warning", message: "Sorry!"] as JSON)
        }
    }

}