package com.bitsoft.st

import com.bitsoft.st.utils.AppConstant
import com.bitsoft.st.utils.DateTimeUtil
import grails.gorm.multitenancy.CurrentTenant
import grails.gorm.transactions.Transactional
import groovy.json.JsonSlurper
import org.apache.poi.ss.usermodel.DateUtil
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
            locationLog.address = getAddressByLatAndLng(params.lat, params.lng)
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
            if (params.userId) {
                eq("user.id", params.userId?.toLong())
            }
            if (params.identifier) {
                eq("identifier", params.identifier)
            }
            between("created", DateTimeUtil.getDateFromStringForReport(params.startDate) ?: DateTimeUtil.startOfTheDay(), DateTimeUtil.getDateFromStringForReport(params.endDate) ?: DateTimeUtil.endOfTheDay())
        }
    }

    List<LocationLog> getLocationLogsByIdentifier(String identifier) {
        return LocationLog.createCriteria().list {
            eq("identifier", identifier)
        }
    }


    String getAddressByLatAndLng(String lat, String lng) {
        try {
            String url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${AppConstant.GOOGLE_API_KEY}"
            String response = url.toURL().text
            Map responseObj = new JsonSlurper().parseText(response)
            if (responseObj && responseObj.results) {
                return responseObj.results[0].formatted_address
            }
        } catch (Exception e) {
            log.error(e.message)
        }
    }

}
