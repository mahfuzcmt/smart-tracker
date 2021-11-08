package com.bitsoft.st.user

import com.bitsoft.st.User
import com.bitsoft.st.UserService
import com.bitsoft.st.security.SecurityService
import com.bitsoft.st.utils.AppConstant
import grails.converters.JSON

class UserController {

    UserService userService
    SecurityService securityService

    static allowedMethods = [save:'POST', update: 'POST', getUsers: 'POST', getUserById: "GET"]

    def save() {
        Map params = request.JSON
        if (securityService.isRequestValid(params.adminId?.toLong(), params.token)) {
            if(!params.userName){
                params.userName =  params.contactNo
            }
            if(!params.password){
                params.password =  params.contactNo
            }
            if (userService.loadUsers([colName: "userName", colValue: params.userName])) {
                render([tatus: "error", message: "username already exits!"] as JSON)
            } else if (userService.loadUsers([colName: "contactNo", colValue: params.contactNo])) {
                render([tatus: "error", message: "Contact No already exits!"] as JSON)
            } else if (userService.loadUsers([colName: "deviceMac", colValue: params.deviceMac])) {
                render([tatus: "error", message: "Device Mac already exits!"] as JSON)
            }  else {
                if (userService.saveUser(params)) {
                    render([status: "success", message: "User successfully Saved"] as JSON)
                } else {
                    render([tatus: "error", message: "Sorry, failed to save user!"] as JSON)
                }
            }
        } else {
            render([status: "error", message: "Unauthorized access!"] as JSON)
        }
    }

    def update() {
        Map params = request.JSON
        if (securityService.isRequestValid(params.adminId?.toLong(), params.token)) {
            if(userService.updateUser(params)){
                render([status: "success", message: "User successfully updated."] as JSON)
            } else {
                render([status: "warning", message: "Sorry, failed to update user!"] as JSON)
            }
        } else {
            render([status: "warning", message: "Unauthorized access!"] as JSON)
        }
    }

    def delete() {
        Map params = request.JSON
        if (securityService.isRequestValid(params.adminId?.toLong(), params.token)) {
            if (params.id) {
                if (userService.deleteUser(params.id)) {
                    render([status: "success", message: "User successfully deleted."] as JSON)
                } else {
                    render([status: "warning", message: "Sorry, failed to delete user!"] as JSON)
                }
            } else {
                render([status: "warning", message: "Invalid request!"] as JSON)
            }
        } else {
            render([status: "warning", message: "Unauthorized access!"] as JSON)
        }
    }

    def getUsers() {
        Map params = request.JSON
        if(securityService.isRequestValid(params.adminId?.toLong(), params.token)){
            def users = userService.loadUsers(params)
            def dataList = []
            if (users) {
                users.each { User user ->
                    def newObj = [:]
                    newObj.id = user.id
                    newObj.fullName = user.fullName
                    newObj.userName = user.userName
                    newObj.counterName = (user.respectiveCounterId && user.role == null) ? kounterService.getCounterById(user.respectiveCounterId)?.name : ""
                    newObj.role = securityService.getRoleNameByUser(user) ?: "Counter Master"
                    newObj.status = user.status
                    newObj.shift = user.shift
                    newObj.contact = user.contactNo
                    dataList.add(newObj)
                }
                render([status: "success", data: dataList, totalCount: dataList.size()] as JSON)
            } else {
                render([status: "warning", data: [], message: "No user found"] as JSON)
            }
        } else {
            render([status: "warning", message: "Unauthorized access!"] as JSON)
        }

    }

    def getUserById() {
        def id = params.id?.toLong()
        User user
        if(id){
            user = userService.getUserById(id)
            def editableData = [:]
            editableData.id = user.id
            editableData.userName = user.userName
            editableData.fullName = user.fullName
            editableData.password = user.password
            editableData.role = securityService.getRoleNameByUser(user) ?: AppConstant.ROLE.USER

            editableData.syncLocInMin = user.syncLocInMin
            editableData.contactNo = user.contactNo
            editableData.status = user.status
            render([status: "success", data: editableData] as JSON)
        }else {
            render([status: "warning", data: user] as JSON)
        }
    }

    def getUserByDeviceMac() {
        User user
        if(params.deviceMac){
            user = userService.getUserByDeviceMac(params.deviceMac)
            def editableData = [:]
            editableData.id = user.id
            editableData.userName = user.userName
            editableData.fullName = user.fullName
            editableData.password = user.password
            editableData.role = securityService.getRoleNameByUser(user) ?: AppConstant.ROLE.USER

            if(user.deviceMac){
                editableData.deviceMac = user.deviceMac
                //TODO get org info from default db
            }
            editableData.syncLocInMin = user.syncLocInMin
            editableData.contactNo = user.contactNo
            editableData.status = user.status
            render([status: "success", data: editableData] as JSON)
        }else {
            render([status: "warning", data: user] as JSON)
        }
    }
}