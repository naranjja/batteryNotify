const LocalNotifications = require("nativescript-local-notifications")
const power = require("nativescript-powerinfo")
const dialogs = require("ui/dialogs")

const getBatteryLevel = () => new Promise((resolve, reject) => {
    power.startPowerUpdates((Info) => resolve(Info.percent))
})

const notifyBatteryLevel = (batteryLevel) => {
    LocalNotifications.schedule([{
        title: `Your battery has reached ${batteryLevel}%`,
        body: "Better charge it!",
        at: new Date()
      }])
}

exports.onNavigatingTo = (args) => {
    const page = args.object
}

exports.onNotificationTap = (args) => {
    getBatteryLevel()
        .then((batteryLevel) => notifyBatteryLevel(batteryLevel))
}