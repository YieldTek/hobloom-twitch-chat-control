var fs = require('fs');

class FileUtils {
    static getFileContents (file, callback) {
        fs.readFile(file, 'utf-8', function (err, data) {
            if (err) {
                callback(err, null);
            }
            callback(null, data);
        });
    }
}

module.exports = FileUtils;