package com.bitsoft.st

import com.bitsoft.st.security.OperationLog
import com.bitsoft.st.utils.AppConstant
import com.bitsoft.st.utils.AppUtil
import com.sun.org.apache.xpath.internal.operations.Bool
import grails.converters.JSON
import grails.gorm.multitenancy.CurrentTenant
import grails.gorm.transactions.Transactional
import grails.util.Holders
import org.mortbay.util.StringUtil
import org.omg.CORBA.Environment

import java.text.DecimalFormat
import java.text.SimpleDateFormat

@CurrentTenant
class UserService {

    AppUtilService appUtilService

    Boolean saveUserMapping(User user, String currentTenantId){
        String prod_end_pont = Holders.grailsApplication.config['prod_end_pont']
        if(grails.util.Environment.isDevelopmentMode()){
            prod_end_pont = "http://localhost:8080/"
        }
        URLConnection get = new URL("${prod_end_pont}client/saveUserMapping?currentTenantId=${currentTenantId}&deviceMac=${user.deviceMac}&userId=${user.id}&status=${user.status}&syncLocInMin=${user.syncLocInMin}").openConnection()
        String response = get?.getInputStream()?.getText()
        return JSON.parse(response).status == "success"
    }

    Boolean deleteUserMapping(User user, String currentTenantId){
        String prod_end_pont = Holders.grailsApplication.config['prod_end_pont']
        if(grails.util.Environment.isDevelopmentMode()){
            prod_end_pont = "http://localhost:8080/"
        }
        URLConnection get = new URL("${prod_end_pont}client/deleteUserMapping?currentTenantId=${currentTenantId}&deviceMac=${user.deviceMac}&userId=${user.id}").openConnection()
        String response = get?.getInputStream()?.getText()
        return JSON.parse(response).status == "success"
    }

    @Transactional
    def saveUser(Map params) {
        try {
            if(AppUtil.session[AppConstant.SESSION_ATTRIBUTE.LIMIT] <= User.countByStatus(AppConstant.STATUS.ACTIVE)){
                throw new Exception("User Limit is over. Contact with your administrator.")
            }

            Role role = null
            if (params.role && !params.role.equals(AppConstant.ROLE.USER)) {
                role = Role.findByName(params.role.toString())
            }
            params.role = role
            User user = new User(params)
            if (user.validate()) {
                user.save()
                if (user.hasErrors()) {
                    appUtilService.printError(user)
                    return false
                } else {
                    if(saveUserMapping(user, AppUtil.session[AppConstant.SESSION_ATTRIBUTE.TENANT_ID].toString())){
                        return user?.id
                    }else {
                        return false
                    }
                }
            } else {
                appUtilService.printError(user)
                return false
            }
        }
        catch (Exception e) {
            log.error(e.message)
            return false
        }
    }

    @Transactional
    def updateUser(def params) {
        Long id = params?.id?.toLong()
        User user = getUserById(id)
        if (!user) {
            return false
        }
        Role role = null
        if (params.role && !params.role.equals(AppConstant.ROLE.USER)) {
            role = Role.findByName(params.role.toString())
        }
        params.role = role
        user.properties = params
        if (user.validate()) {
            user.save()
            saveUserMapping(user, AppUtil.session[AppConstant.SESSION_ATTRIBUTE.TENANT_ID].toString())
            return true
        } else {
            return false
        }
    }

    List<User> loadUsers(def params) {
        List<User> users
        try {
            params.max = params.max ?: -1
            users = User.createCriteria().list(params) {
                if (params?.colName && params?.colValue) {
                    eq(params.colName, params.colValue)
                }
                if (!params.sort) {
                    order("id", "desc")
                }
            }
        } catch (Exception exception) {
            log.error(exception.message)
            return users
        }
        return users
    }

    User getUserById(Long Id) {
        return User.get(Id)
    }

    User getUserByDeviceMac(String deviceMac) {
        return User.findByDeviceMac(deviceMac)
    }

    String getUserFullNameByKounterId(Long kounterId) {
        List<User> userList = User.findAllByRespectiveCounterId(kounterId)
        return userList.size() ? userList.first()?.fullName ?: "" : ""
    }

    String getUserNameByKounterId(Long kounterId) {
        List<User> userList = User.findAllByRespectiveCounterId(kounterId)
        return userList.size() ? userList.first()?.userName ?: "" : ""
    }

    String getUserMobileNoByKounterId(Long kounterId) {
        List<User> userList = User.findAllByRespectiveCounterId(kounterId)
        return userList.size() ? userList.first()?.contactNo ?: "" : ""
    }

    Long getUserIdByKounterId(Long kounterId) {
        List<User> userList = User.findAllByRespectiveCounterId(kounterId)
        return userList.size() ? userList.first()?.id ?: 0l : 0l
    }

    /*def changePassword(String oldPassword, String newPassword, String retrievePassword){
        User member = getCurrentMember()
        if (!newPassword || !retrievePassword || !newPassword.equals(retrievePassword)) {
            return AppUtil.infoMessage("Your Entered Password Not Matched.", false)
        } else if (member && !member.password.equals(oldPassword.encodeAsMD5())) {
            return AppUtil.infoMessage("Incorrect Old Password.", false)
        } else {
            member = User.get(member.id)
            member.password = newPassword
            member.save(flush: true)
            setMemberAuthorization(member)
        }
        return AppUtil.infoMessage("Password Changed")
    }*/


    void beforeUserDelete(User user) {
        OperationLog.createCriteria().list {
            eq("user.id", user.id)
        }.each { OperationLog operationLog ->
            operationLog.user = null
            operationLog.merge()
        }

        LocationLog.createCriteria().list {
            eq("user.id", user.id)
        }.each { LocationLog locationLog ->
            locationLog.user = null
            locationLog.merge()
        }
    }

    @Transactional
    def deleteUser(def id) {
        try {
            User user = User.get(id)
            if (user) {
                beforeUserDelete(user)
                user.delete()
                deleteUserMapping(user, AppUtil.session[AppConstant.SESSION_ATTRIBUTE.TENANT_ID].toString())
                return true
            }
        } catch (Exception exception) {
            log.error(exception.message)
            return false
        }
    }
}
