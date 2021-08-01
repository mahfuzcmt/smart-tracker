package com.bitsoft.st

import com.bitsoft.st.utils.AppConstant
import grails.gorm.multitenancy.CurrentTenant
import grails.gorm.transactions.Transactional
import org.mortbay.util.StringUtil

import java.text.DecimalFormat

@CurrentTenant
@Transactional
class LocationService {

    UserService userService


    DecimalFormat decimalFormat = new DecimalFormat("#.00")

    LocationLog saveLocationLog(Map params) {
        try {
            LocationLog locationLog = new LocationLog()
            if (params.id) {
                locationLog.user = userService.getUserById(params.id.toLong())
            } else {
                locationLog.identifier = System.currentTimeMillis()
            }

            locationLog.charge = params.charge

            locationLog.lat = params.lat
            locationLog.lng = params.lng
            locationLog.deviceInfo = params.deviceInfo
            locationLog.address = params.address

            locationLog.save()
            if (!locationLog.hasErrors()) {
                return locationLog
            }
            return null
        }
        catch (Exception e) {
            log.error(e.message)
            return false
        }
    }

    List<LocationLog> getLocationLogsByUser(Map params) {
        return LocationLog.createCriteria().list {
            if(params.userId){
                eq("user.id", params.userId?.toLong())
            }
            if(params.identifier){
                eq("identifier", params.identifier)
            }
            //TODO need to think
            if(params.startDate){
                lt("created", params.startDate)
            }
        }
    }

    List<LocationLog> getLocationLogsByIdentifier(String identifier) {
        return LocationLog.createCriteria().list {
            eq("identifier", identifier)
        }
    }

}
