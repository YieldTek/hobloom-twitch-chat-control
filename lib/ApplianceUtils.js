var request = require('request');

class ApplianceUtils {
    static changeAppliancePower(settings, type, on) {
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
    }
}

module.exports = ApplianceUtils;