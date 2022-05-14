package com.bitsoft.st

import com.bitsoft.st.utils.AppConstant
import com.bitsoft.st.utils.DateTimeUtil
import com.bitsoft.st.utils.HttpUtil
import grails.converters.JSON
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


    LocationLog getLocationLogById(Long id){
        return LocationLog.get(id)
    }

    List<LocationLog> saveLocationLog(Map params) {
        List<LocationLog> locationLogList = []
        try {
            LocationLog locationLog
            params.locations.each { Map location ->
                locationLog = new LocationLog()
                if (params.userId) {
                    locationLog.user = userService.getUserById(params.userId.toLong())
                } else {
                    locationLog.identifier = System.currentTimeMillis()
                }
                locationLog.charge = location.charge

                locationLog.lat = location.lat.toDouble()
                locationLog.lng = location.lng.toDouble()
                if (location.datetime) {
                    locationLog.trackingTime = DateTimeUtil.getDateFromString(location.datetime, "yyyy-MM-dd hh:mm a")
                }
                if (params.deviceInfo) {
                    locationLog.deviceInfo = params.deviceInfo as String
                }
                locationLog.address = getAddressByLatAndLng(location)
                locationLog.save()
                if (locationLog && !locationLog.hasErrors()) {
                    locationLogList.add(locationLog)
                }
            }
            return locationLogList
        }
        catch (Exception e) {
            log.error(e.message)
            return locationLogList
        }
    }

    Map processLocationData(LocationLog locationLog) {
        Map locData = [:]
        if (locationLog) {
            locData.lat = locationLog.lat
            locData.lng = locationLog.lng
            locData.address = locationLog.address
            locData.charge = locationLog.charge
            locData.created = DateTimeUtil.getFormattedDate(locationLog.created)
            if (locationLog.user) {
                locData.userId = locationLog.user.id
                locData.fullName = locationLog.user.fullName
                locData.contactNo = locationLog.user.contactNo
                locData.imagePath = locationLog.user.getFullImagePath()
                locData.designation = locationLog.user.designation
            }
        }
        return locData
    }

    List<Map> getLiveLoc(Map params){
        List data = []
        User.createCriteria().list {
            eq("status", AppConstant.STATUS.ACTIVE)
            if (params.userId) {
                eq("user.id", params.userId.toLong())
            }
        }.each { User user ->
            Long lastLocId = LocationLog.createCriteria().get() {
                eq("user.id", user.id)
                projections {
                    max("id")
                }
            }
            data.add(processLocationData(getLocationLogById(lastLocId)))
        }
        return data
    }

    List<Map> getLocationLogsByUser(Map params) {
        List<Map> data = []
        List<LocationLog> locationLogList = LocationLog.createCriteria().list {
            if (params.userId) {
                eq("user.id", params.userId.toLong())
            }
            if (params.identifier) {
                eq("identifier", params.identifier)
            }
            if(!params.isAll?.toBoolean()){
                between("created", DateTimeUtil.getDateFromStringForReport(params.startDate) ?: DateTimeUtil.startOfTheDay(), DateTimeUtil.getDateFromStringForReport(params.endDate) ?: DateTimeUtil.endOfTheDay())
            }
            order("created", "desc")
        }
        locationLogList.each { LocationLog locationLog ->
            data.add(processLocationData(locationLog))
        }
        return data
    }

    List<LocationLog> getLocationLogsByIdentifier(String identifier) {
        return LocationLog.createCriteria().list {
            eq("identifier", identifier)
        }
    }


    String getAddressByLatAndLng(Map location) {
        try {
            String lat = location.lat
            String lng = location.lng
            String lang = location.lang ?: "en"
            String url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${AppConstant.GOOGLE_API_KEY}&language=${lang}"
            String json = HttpUtil.doGetRequest(url, ["Content-Type" : "application/json; charset=UTF-8"])
            if (location.debug) {
                println("==================json: " + json + "====================")
            }
            Map result = JSON.parse(json)
            if (location.debug) {
                println("==================result: " + result + "====================")
            }
            if (result && result.results) {
                if (location.debug) {
                    println("==================" + result.results[0].formatted_address + "====================")
                }
                return result.results[0].formatted_address
            }
        } catch (Exception e) {
            log.error(e.message)
        }
    }

}
