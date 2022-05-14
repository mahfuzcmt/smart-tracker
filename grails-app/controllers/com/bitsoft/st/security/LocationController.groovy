package com.bitsoft.st.security

import com.bitsoft.st.LocationLog
import com.bitsoft.st.LocationService
import com.bitsoft.st.UserService
import grails.converters.JSON

class LocationController {

    LocationService locationService
    SecurityService securityService
    UserService userService

    def save() {
        Map params = request.JSON
        List<LocationLog> locationLogs = locationService.saveLocationLog(params)
        if (locationLogs) {
            LocationLog locationLog = locationLogs.first()
            Integer syncLocInMin = 0
            if(locationLog.user){
                syncLocInMin = userService.getUserById(locationLog.user.id)?.syncLocInMin ?: 0
            }
            render([status: "success", locationLogs: locationLogs, syncLocInMin: syncLocInMin] as JSON)
        } else {
            render([status: "warning", message: "Sorry!"] as JSON)
        }
    }

    def list() {
        if (securityService.isRequestValid(params.adminId?.toLong(), params.token)) {
            List<Map> locationLogList = locationService.getLocationLogsByUser(params)
            if (locationLogList) {
                render([status: "success", locationLogs: locationLogList] as JSON)
            } else {
                render([status: "warning", message: "Sorry!"] as JSON)
            }
        } else {
            render([status: "error", message: "Unauthorized access!"] as JSON)
        }
    }

    def liveLoc() {
        Map params = request.JSON
        if (securityService.isRequestValid(params.adminId?.toLong(), params.token)) {
            List<Map> locationLogList = locationService.getLiveLoc(params)
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