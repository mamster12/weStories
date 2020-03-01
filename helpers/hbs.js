const moment = require('moment');

module.exports = {
    truncate: function(str, len) {
        if (str.length > len && str.length > 0) {
            var new_str = str + " ";
            new_str = str.substr(0, len);
            new_str = str.substr(0, new_str.lastIndexOf(" "));
            new_str = (new_str.length > 0) ? new_str : str.substr(0, len);

            return new_str + '...';
        }
        return str;
    },

    stripTags: function(str) {
        return str.replace(/<[^>]*>/g, '');
        // return str.replace(/<(?:.|\n)*?>/gm, ''); --this is another method
    },

    formatDate: function(date, format) {
        return moment(date).format(format);
    }
}