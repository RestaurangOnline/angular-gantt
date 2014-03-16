gantt.factory('HeaderGenerator', [ 'Column', 'dateFunctions', function (Column, df) {

    var generateQuarterHeader = function(columns) {
        var generatedHeaders = [];
        var header;
        for (var i = 0, l = columns.length; i < l; i++) {
            var col = columns[i];
            var d1, d2;
            if (i > 0) {
                d1 = columns[i-1].date;
                d2 = columns[i].date;
            }

            if (i === 0 || (d1.getHours() !== d2.getHours() || d1.getMinutes() !== d2.getMinutes())) {
                header = new Column.Quarter(df.clone(col.date), col.left, col.width, col.isWeekend, col.isWorkHour);
                generatedHeaders.push(header);
            } else {
                header.width += col.width;
            }
        }

        return generatedHeaders;
    };

    var generateHourHeader = function(columns) {
        var generatedHeaders = [];

        var header;
        for (var i = 0, l = columns.length; i < l; i++) {
            var col = columns[i];
            if (i === 0 || columns[i-1].date.getHours() !== col.date.getHours()) {
                header = new Column.Hour(df.clone(col.date), col.left, col.width, col.isWeekend, col.isWorkHour);
                generatedHeaders.push(header);
            } else {
                header.width += col.width;
            }
        }

        return generatedHeaders;
    };

    var generateDayHeader = function(columns) {
        var generatedHeaders = [];

        var header;
        for (var i = 0, l = columns.length; i < l; i++) {
            var col = columns[i];
            if (i === 0 || columns[i-1].date.getDay() !== col.date.getDay()) {
                header = new Column.Day(df.clone(col.date), col.left, col.width, col.isWeekend);
                generatedHeaders.push(header);
            } else {
                header.width += col.width;
            }
        }

        return generatedHeaders;
    };

    var generateWeekHeader = function(columns) {
        var generatedHeaders = [];

        var header;
        for (var i = 0, l = columns.length; i < l; i++) {
            var col = columns[i];
            if (i === 0 || df.getWeek(columns[i-1].date) !== df.getWeek(col.date)) {
                header = new Column.Week(df.clone(col.date), col.left, col.width, df.getWeek(col.date));
                generatedHeaders.push(header);
            } else {
                header.width += col.width;
            }
        }

        return generatedHeaders;
    };

    var generateMonthHeader = function(columns) {
        var generatedHeaders = [];

        var header;
        for (var i = 0, l = columns.length; i < l; i++) {
            var col = columns[i];
            if (i === 0 || columns[i-1].date.getMonth() !== col.date.getMonth()) {
                header = new Column.Month(df.clone(col.date), col.left, col.width);
                generatedHeaders.push(header);
            } else {
                header.width += col.width;
            }
        }

        return generatedHeaders;
    };

    return {
        instance: function(viewScale) {
            this.generate = function(columns) {
                var headers = {};

                switch(viewScale) {
                    case 'quarter':
                        headers.quarter = generateQuarterHeader(columns);
                        headers.hour = generateHourHeader(columns);
                        break;

                    case 'hour':
                        headers.hour = generateHourHeader(columns);
                        headers.day = generateDayHeader(columns);

                        break;
                    case 'day':
                        headers.day = generateDayHeader(columns);
                        headers.week = generateWeekHeader(columns);
                        headers.month = generateMonthHeader(columns);

                        break;
                    case 'week':
                        headers.week = generateWeekHeader(columns);
                        headers.month = generateMonthHeader(columns);

                        break;
                    case 'month':
                        headers.month = generateMonthHeader(columns);

                        break;
                    default:
                        throw "Unsupported view scale: " + viewScale;
                }

                return headers;
            };
        }
    };
}]);
