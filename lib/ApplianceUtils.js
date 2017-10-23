var request = require('request');

// TODO: Put in settings
var LOCK_TIMES = 15 * 60000;

function ApplianceUtils() {
    this.appliance_locks =  {
        'intake': null,
        'lights': null,
        'exhaust': null
    };
}

ApplianceUtils.prototype.changeAppliancePower = function (settings, type, on) {
    if (settings.isDevMode()) {
        return;
    }

    var params = {
        asset_type: type
    };
    params['turn_on'] = 'false';
    if (on) {
        params['turn_on'] = 'true';
    }
    request({ url: settings.getBaseUnitIP() + '/appliancepower', method: 'POST', json: params }, function (error, response, body) {
    });
};

ApplianceUtils.prototype.checkApplianceLock = function (type) {
    if(this.appliance_locks[type] != null && new Date() - this.appliance_locks[type] < LOCK_TIMES) {
        return 'I can\'t complete your request as your party has failed to slay a monster and is still being punished!';
    }
    if(this.appliance_locks[type] != null && new Date() - this.appliance_locks[type] > LOCK_TIMES) {
        this.appliance_locks[type] = null;
    }
    return null;
}

module.exports = ApplianceUtils;