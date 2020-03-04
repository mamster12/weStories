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
    },
    select: function(selected, options) {
        return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"')
            .replace(new RegExp('>' + selected + '</option>'), ' selected="selected"$&');
    },
    // ifEquals: function(v1, v2, options) {
    // 
    //     if (v1 === v2) {
    //         return options.fn(this);
    //     }
    //     return options.inverse(this);
    // }
    ifEquals: function(v1, operator, v2, options) {

        switch (operator) {
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '!=':
                return (v1 != v2) ? options.fn(this) : options.inverse(this);
            case '!==':
                return (v1 !== v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
    }
}