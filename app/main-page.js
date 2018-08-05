const LocalNotifications = require("nativescript-local-notifications")
const power = require("nativescript-powerinfo")
const dialogs = require("ui/dialogs")
const Observable = require("data/observable").fromObject

const defaultTargetBatteryLevel = 10

const notifyBatteryLevel = (batteryLevel) => {
    LocalNotifications.schedule([{
        title: `Your battery has reached ${batteryLevel}%`,
        body: "Better charge it!",
        at: new Date()
      }])
}

exports.onNavigatingTo = (args) => {
    const page = args.object
    
    page.bindingContext = new Observable({
        targetBatteryLevel: defaultTargetBatteryLevel
    })

    power.startPowerUpdates((batteryInfo) => {
        if (batteryInfo.percent <= page.bindingContext.get("targetBatteryLevel")) {
            notifyBatteryLevel(batteryInfo.percent)
            power.stopPowerUpdates()
        }
    })
    
}

exports.onSetTargetBatteryLevel = (args) => {
    const page = args.object
    LocalNotifications.cancelAll()
    const targetBatteryLevel = parseFloat(page.bindingContext.get("targetBatteryLevel"))
    if (!isNaN(targetBatteryLevel)) {
        if (targetBatteryLevel >= 1 && targetBatteryLevel <= 99) {
            dialogs.confirm({
                title: "Success",
                message: `Target battery level notification set to ${targetBatteryLevel}%!`,
                okButtonText: "OK"
            })
        } else {
            dialogs.confirm({
                title: "Error",
                message: "Battery level must be between 1 and 99",
                okButtonText: "OK"
            })
            page.bindingContext.set("targetBatteryLevel", defaultTargetBatteryLevel) 
        }
    } else {
        dialogs.confirm({
            title: "Error",
            message: "Battery level must be a number",
            okButtonText: "OK"
        })
        page.bindingContext.set("targetBatteryLevel", defaultTargetBatteryLevel)
    }
}

exports.onCancelNotificationsTap = (args) => {
    LocalNotifications.cancelAll()
}