package com.bitsoft.st.security

import com.bitsoft.st.security.common.Client
import com.bitsoft.st.security.common.UserMapping
import com.bitsoft.st.utils.AppConstant
import grails.gorm.transactions.Transactional

class ClientService {

    Client getClientById(Long id) {
        return Client.get(id)
    }

    Client getAvailableEntity() {
        List<Client> clientList = Client.createCriteria().list {
            isNull("name")
        }
        if (clientList) {
            return clientList.first()
        }
        return null
    }

    @Transactional
    Client createClient(params) {
        Client client = params.id ? getClientById(params.id.toLong()) : new Client()

        client.name = params.name
        client.tenantId = params.tenantId
        client.contactNo = params.contactNo
        client.status = params.status ?: AppConstant.STATUS.ACTIVE
        client.subscriptionPackage = params.subscriptionPackage ?: "Standard"
        client.subscriptionStartDate = params.subscriptionStartDate ?: new Date()
        client.save()
        if (!client.hasErrors()) {
            return client
        }
        return null
    }

    Map getByDeviceMac(params) {
        UserMapping userMapping = UserMapping.findByDeviceMacAndStatus(params.deviceMac, AppConstant.STATUS.ACTIVE)
        Map userData = [:]
        if(userMapping){
            userData.userId = userMapping.userId
            userData.deviceMac = userMapping.deviceMac
            userData.orgName = userMapping.client.name
            userData.syncLocInMin = userMapping.syncLocInMin ?: userMapping.client.syncLocInMin
            userData.tenantId = userMapping.client.tenantId
        }
        return userData
    }

    @Transactional
    UserMapping saveUserMapping(Map params) {
        UserMapping userMapping = UserMapping.findByDeviceMac(params.deviceMac.toString()) ?: new UserMapping()
        userMapping.userId = params.userId.toLong()
        userMapping.status = params.status
        userMapping.deviceMac = params.deviceMac
        userMapping.syncLocInMin = params.syncLocInMin.toInteger()
        userMapping.client = Client.findByTenantId(params.currentTenantId.toString())
        userMapping.save()
    }

    @Transactional
    Boolean deleteUserMapping(Map params) {
        UserMapping userMapping = UserMapping.findByDeviceMacAndClientAndUserId(params.deviceMac.toString(), Client.findByTenantId(params.currentTenantId.toString()), params.userId.toLong())
        if(userMapping){
            userMapping.delete()
        }
        return true
    }

}
