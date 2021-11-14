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

    LocationLog saveLocationLog(Map params) {
        try {
            LocationLog locationLog = new LocationLog()
            if (params.userId) {
                locationLog.user = userService.getUserById(params.userId.toLong())
            } else {
                locationLog.identifier = System.currentTimeMillis()
            }

            locationLog.charge = params.charge

            locationLog.lat = params.lat.toDouble()
            locationLog.lng = params.lng.toDouble()
            locationLog.deviceInfo = params.deviceInfo
            locationLog.address = getAddressByLatAndLng(params)
            locationLog.save()
            if (!locationLog.hasErrors()) {
                return locationLog
            }
            return null
        }
        catch (Exception e) {
            log.error(e.message)
            return null
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
            between("created", DateTimeUtil.getDateFromStringForReport(params.startDate) ?: DateTimeUtil.startOfTheDay(), DateTimeUtil.getDateFromStringForReport(params.endDate) ?: DateTimeUtil.endOfTheDay())
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


    String getAddressByLatAndLng(Map params) {
        try {
            String lat = params.lat
            String lng = params.lng
            String lang = params.lang ?: "en"
            String url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${AppConstant.GOOGLE_API_KEY}&language=${lang}"
            String json = HttpUtil.doGetRequest(url, ["Content-Type" : "application/json; charset=UTF-8"])
            if (params.debug) {
                println("==================json: " + json + "====================")
            }
            Map result = JSON.parse(json)
            if (params.debug) {
                println("==================result: " + result + "====================")
            }
            if (result && result.results) {
                if (params.debug) {
                    println("==================" + result.results[0].formatted_address + "====================")
                }
                return result.results[0].formatted_address
            }
        } catch (Exception e) {
            log.error(e.message)
        }
    }

}
