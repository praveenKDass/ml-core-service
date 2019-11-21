let fcmNotification = require('fcm-notification'); // load firebase notification
const FCM_KEY_PATH = (process.env.FCM_KEY_PATH && process.env.FCM_KEY_PATH != "") ? process.env.FCM_KEY_PATH : "/config/fcm-keystore.json"
const fcm_token_path = require(ROOT_PATH + FCM_KEY_PATH); //read firebase token from the file
let FCM = new fcmNotification(fcm_token_path);
let samikshaThemeColor = process.env.SAMIKSHA_THEME_COLOR ? process.env.SAMIKSHA_THEME_COLOR : "#A63936"

module.exports = class notificationsHelper {

    static pushToTopic(element) {
        return new Promise(async (resolve, reject) => {
            try {

                let pushNotificationRelatedInformation = {
                    topic: element.topicName,
                    notification: {
                        title: "Kendra Service",
                        body: element.message
                    },
                    data: {
                        welcomeMsg: "welcome to kendra service"
                    }
                }

                let pushToTopicData = await this.sendMessage(pushNotificationRelatedInformation)

                return resolve(pushToTopicData)

            } catch (error) {
                return reject(error);
            }
        })
    }



    static createNotificationInAndroid(notificationData) {
        return new Promise(async (resolve, reject) => {
            try {

                let pushNotificationRelatedInformation = {
                    "data": notificationData.data,
                    android: {
                        ttl: 3600 * 1000, // 1 hour in milliseconds
                        priority: 'high',
                        notification: {
                            "click_action": "FCM_PLUGIN_ACTIVITY",
                            title: notificationData.title ? notificationData.title : 'kendra service',
                            body: notificationData.text ? notificationData.text : notificationData.message,
                            icon: 'stock_ticker_update',
                            color: samikshaThemeColor
                        },

                    },
                    token: notificationData.deviceId
                }

                let pushToDevice = await this.sendMessage(pushNotificationRelatedInformation);

                return resolve(pushToDevice)

            } catch (error) {
                return reject(error);
            }
        })
    }

    static createNotificationInIos(notificationData) {
        return new Promise(async (resolve, reject) => {
            try {

                let pushNotificationRelatedInformation = {
                    android: {
                        notification: {
                            title: "Kendra Service",
                            body: notificationData.message
                        },
                        data: {
                            welcomeMsg: "Welcome to Kendra "
                        }
                    },
                    token: notificationData.deviceId
                }

                let pushToTopicData = await this.sendMessage(pushNotificationRelatedInformation)

                if (pushToTopicData.success) {
                    return resolve({
                        message: req.t('pushNotificationSuccess')
                    })
                }

            } catch (error) {
                return reject(error);
            }
        })
    }

    static pushToDeviceId(notificationData) {
        return new Promise(async (resolve, reject) => {
            try {

                var token = notificationData.deviceId;

                let pushNotificationRelatedInformation = {
                    token: token,
                    notification: {
                        title: "Kendra Service",
                        body: notificationData.message
                    },
                    data: {
                        welcomeMsg: "Welcome to Kendra "
                    }
                }

                let pushToFcmToken = await this.sendMessage(pushNotificationRelatedInformation)

                if (pushToFcmToken.success) {
                    return resolve({
                        message: req.t('pushNotificationSuccess')
                    })
                }

            } catch (error) {
                return reject(error)
            }
        })
    }

    static sendMessage(notificationInformation) {

        return new Promise(async (resolve, reject) => {
            try {

                FCM.send(notificationInformation, (err, response) => {

                    let success;
                    let message = "";
                    if (err) {
                        if (err.errorInfo && err.errorInfo.message) {
                            if (err.errorInfo.message == "The registration token is not a valid FCM registration token") {
                                message = err.errorInfo.message;
                            }
                        }

                        success = false;
                        // throw "Failed to push the notification"
                    } else {
                        console.log(notificationInformation)
                        success = true
                    }

                    return resolve({
                        success: success,
                        message: message
                    })
                });

            } catch (error) {
                return reject(error)
            }
        })

    }


};