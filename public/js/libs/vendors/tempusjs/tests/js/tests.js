(function() {
    function isLeapYear(year) {
        if (year % 4 == 0) {
            if (year % 100 == 0) {
                return year % 400 == 0;
            } else return true;
        }
        return false;
    }

    // prepare for tests
    var today = new Date(); // current day
    var dd = today.getDate(); // day. Begin from 1.
    var mm = today.getMonth()+1; // month. Begin from 0.
    var yyyy = today.getFullYear();
    var day, month, year, hours, minutes, seconds;


    tempus.lang('en');

    // *************************************************
    // *                                               *
    // *                   BASE                        *
    // *                                               *
    // *************************************************

    test('Tests dayCount()', function() {
        equal(tempus([2013, 11, 18]).dayCount(), 30, 'November');
        equal(tempus([2012, 2]).dayCount(), 29, 'February leap year');
        equal(tempus([2013, 2]).dayCount(), 28, 'February not leap year');
        equal(tempus([2013, 1]).dayCount(), 31, 'January');
    });

    test('Test year() method', function () {
        // values
        equal(tempus().year(), new Date().getFullYear(), 'Test value: Current');
        equal(tempus().year(2000).year(), 2000, 'Test value: 2000');
        equal(tempus().year(1000).year(), 1000, 'Test value: 1000');
        equal(tempus().year(3000).year(), 3000, 'Test value: 3000');
        equal(tempus().year(undefined).year(), tempus.MIN_YEAR, 'Test value: undefined');
        equal(tempus().year(1).year(), 1, 'Test value: 1');
        equal(tempus().year(-15).year(), -15, 'Test value: -15');
        equal(tempus().year('0').year(), 0, 'Test value: \'0\'');
        equal(tempus().year({foo: 'bar'}).year(), tempus.MIN_YEAR, 'Test value: {foo: \'bar\'}');
        equal(tempus().year([1,2,3]).year(), tempus.MIN_YEAR, 'Test value: [1,2,3]');
        equal(tempus().year(null).year(), tempus.MIN_YEAR, 'Test value: null');
        equal(tempus().year(true).year(), tempus.MIN_YEAR, 'Test value: true');
        equal(tempus().year(false).year(), tempus.MIN_YEAR, 'Test value: false');
        equal(tempus().year(NaN).year(), tempus.MIN_YEAR, 'Test value: false');
        // check types
        equal(typeof tempus().year(2000).year(), 'number', 'Type is number');
    });

    test('Test month() method', function () {
        // values
        equal(tempus().month(), new Date().getMonth() + 1, 'Test value: Current');
        equal(tempus().month(100).month(), 100, 'Test value: 100');
        equal(tempus().month(12).month(), 12, 'Test value: 12');
        equal(tempus().month(1).month(), 1, 'Test value: 12');
        equal(tempus().month(-5).month(), -5, 'Test value: -5');
        equal(tempus().month('0').month(), 0, 'Test value: \'0\'');
        equal(tempus().month(undefined).month(), tempus.MIN_MONTH, 'Test value: undefined');
        equal(tempus().month({foo: 'bar'}).month(), tempus.MIN_MONTH, 'Test value: {foo: \'bar\'}');
        equal(tempus().month([1,2,3]).month(), tempus.MIN_MONTH, 'Test value: [1,2,3]');
        equal(tempus().month(null).month(), tempus.MIN_MONTH, 'Test value: null');
        equal(tempus().month(true).month(), tempus.MIN_MONTH, 'Test value: true');
        equal(tempus().month(false).month(), tempus.MIN_MONTH, 'Test value: false');
        equal(tempus().month(NaN).month(), tempus.MIN_MONTH, 'Test value: false');
        // check types
        equal(typeof tempus().month(1).month(), 'number', 'Type is number');
    });

    test('Test day() method', function () {
        // values
        equal(tempus().day(), new Date().getDate(), 'Test value: Current');
        equal(tempus().day(100).day(), 100, 'Test value: 100');
        equal(tempus().day(12).day(), 12, 'Test value: 12');
        equal(tempus().day(-5).day(), -5, 'Test value: -5');
        equal(tempus().day('0').day(), 0, 'Test value: \'0\'');
        equal(tempus().day({foo: 'bar'}).day(), tempus.MIN_DAY, 'Test value: {foo: \'bar\'}');
        equal(tempus().day([1,2,3]).day(), tempus.MIN_DAY, 'Test value: [1,2,3]');
        equal(tempus().day(undefined).day(), tempus.MIN_DAY, 'Test value: undefined');
        equal(tempus().day(null).day(), tempus.MIN_DAY, 'Test value: null');
        equal(tempus().day(true).day(), tempus.MIN_DAY, 'Test value: true');
        equal(tempus().day(false).day(), tempus.MIN_DAY, 'Test value: false');
        equal(tempus().day(NaN).day(), tempus.MIN_DAY, 'Test value: false');
        // check types
        equal(typeof tempus().day(1).day(), 'number', 'Type is number');
    });

    test('Test hours() method', function () {
        // values
        equal(tempus().hours(), new Date().getHours(), 'Test value: Current');
        equal(tempus().hours(100).hours(), 100, 'Test value: 100');
        equal(tempus().hours(12).hours(), 12, 'Test value: 12');
        equal(tempus().hours(-5).hours(), -5, 'Test value: -5');
        equal(tempus().hours('0').hours(), 0, 'Test value: \'0\'');
        equal(tempus().hours({foo: 'bar'}).hours(), tempus.MIN_HOURS, 'Test value: {foo: \'bar\'}');
        equal(tempus().hours([1,2,3]).hours(), tempus.MIN_HOURS, 'Test value: [1,2,3]');
        equal(tempus().hours(undefined).hours(), tempus.MIN_HOURS, 'Test value: undefined');
        equal(tempus().hours(null).hours(), tempus.MIN_HOURS, 'Test value: null');
        equal(tempus().hours(true).hours(), tempus.MIN_HOURS, 'Test value: true');
        equal(tempus().hours(false).hours(), tempus.MIN_HOURS, 'Test value: false');
        equal(tempus().hours(NaN).hours(), tempus.MIN_HOURS, 'Test value: false');
        // check types
        equal(typeof tempus().hours(1).hours(), 'number', 'Type is number');
    });

    test('Test minutes() method', function () {
        // values
        equal(tempus().minutes(), new Date().getMinutes(), 'Test value: Current');
        equal(tempus().minutes(100).minutes(), 100, 'Test value: 100');
        equal(tempus().minutes(12).minutes(), 12, 'Test value: 12');
        equal(tempus().minutes(-5).minutes(), -5, 'Test value: -5');
        equal(tempus().minutes('0').minutes(), 0, 'Test value: \'0\'');
        equal(tempus().minutes({foo: 'bar'}).minutes(), tempus.MIN_MINUTES, 'Test value: {foo: \'bar\'}');
        equal(tempus().minutes([1,2,3]).minutes(), tempus.MIN_MINUTES, 'Test value: [1,2,3]');
        equal(tempus().minutes(undefined).minutes(), tempus.MIN_MINUTES, 'Test value: undefined');
        equal(tempus().minutes(null).minutes(), tempus.MIN_MINUTES, 'Test value: null');
        equal(tempus().minutes(true).minutes(), tempus.MIN_MINUTES, 'Test value: true');
        equal(tempus().minutes(false).minutes(), tempus.MIN_MINUTES, 'Test value: false');
        equal(tempus().minutes(NaN).minutes(), tempus.MIN_MINUTES, 'Test value: false');
        // check types
        equal(typeof tempus().minutes(1).minutes(), 'number', 'Type is number');
    });

    test('Test seconds() method', function () {
        // values
        equal(tempus().seconds(), new Date().getSeconds(), 'Test value: Current');
        equal(tempus().seconds(100).seconds(), 100, 'Test value: 100');
        equal(tempus().seconds(12).seconds(), 12, 'Test value: 12');
        equal(tempus().seconds(-5).seconds(), -5, 'Test value: -5');
        equal(tempus().seconds('0').seconds(), 0, 'Test value: \'0\'');
        equal(tempus().seconds({foo: 'bar'}).seconds(), tempus.MIN_SECONDS, 'Test value: {foo: \'bar\'}');
        equal(tempus().seconds([1,2,3]).seconds(), tempus.MIN_SECONDS, 'Test value: [1,2,3]');
        equal(tempus().seconds(undefined).seconds(), tempus.MIN_SECONDS, 'Test value: undefined');
        equal(tempus().seconds(null).seconds(), tempus.MIN_SECONDS, 'Test value: null');
        equal(tempus().seconds(true).seconds(), tempus.MIN_SECONDS, 'Test value: true');
        equal(tempus().seconds(false).seconds(), tempus.MIN_SECONDS, 'Test value: false');
        equal(tempus().seconds(NaN).seconds(), tempus.MIN_SECONDS, 'Test value: false');
        // check types
        equal(typeof tempus().seconds(1).seconds(), 'number', 'Type is number');
    });

    test('Test timestamp() method', function () {
        equal(tempus([2013, 11, 18]).timestamp(), 1384732800, 'Test');
        equal(tempus().timestamp(1384718400).timestamp(), 1384718400, 'Test');
    });

    test('Test utc() method', function () {
        equal(tempus([2013, 11, 18]).utc()*1000, new Date(2013, 10, 18).getTime(), 'Test');
        equal(tempus({year: 2013, month: 11, day: 18}).utc()*1000, new Date(2013, 10, 18).getTime(), 'Test');
        equal(tempus().utc(1384732800).utc(), 1384732800, 'Test');
        equal(tempus(1384732800).utc(), 1384732800, 'Test');
    });

    test('Test dayOfWeek() method', function () {
        equal(tempus().dayOfWeek(), new Date().getDay(), 'Test');
        equal(tempus([2013, 11, 18]).dayOfWeek(), new Date(2013, 10, 18).getDay(), 'Test');
        equal(tempus([2013, 11, 21]).dayOfWeek('Sunday').format('%Y-%m-%d'), '2013-11-17', 'Test setter');
        equal(tempus([2013, 11, 21]).dayOfWeek('Friday').format('%Y-%m-%d'), '2013-11-22', 'Test setter');

    });

    test('Test timezone() method', function () {
        equal(tempus().timezone(), new Date().getTimezoneOffset()*60, 'Test');
        equal(tempus().timezone('minutes'), new Date().getTimezoneOffset(), 'Test');
        equal(tempus().timezone('hours'), new Date().getTimezoneOffset()/60, 'Test');
    });

    test('Tests get() method', function() {
        equal(tempus().get().year, new Date().getFullYear(), 'Test');
        equal(tempus().get().month, new Date().getMonth()+1, 'Test');
        equal(tempus().get().day, new Date().getDate(), 'Test');
        equal(tempus().get().hours, new Date().getHours(), 'Test');
        equal(tempus().get().minutes, new Date().getMinutes(), 'Test');
        equal(tempus().get().seconds, new Date().getSeconds(), 'Test');
        deepEqual(tempus([2014,1,1,12,0,0]).get('Array'), [2014,1,1,12,0,0,0], 'Test');
        equal(Math.floor(tempus().get('Date').getTime()/1000), Math.floor(new Date().getTime()/1000), 'Test');
        equal(Math.floor(tempus().get('DateUTC').getTime()/1000), Math.floor(new Date().getTime()/1000) - new Date().getTimezoneOffset()*60, 'Test');
    });

    test('Tests leapYear() method', function () {
        equal(tempus().leapYear(), isLeapYear(yyyy), 'Current year is leap or not leap');
        equal(tempus([2013]).leapYear(), false, '2013 is not leap year');
        equal(tempus([2012]).leapYear(), true, '2012 is leap year');
        equal(tempus([2000]).leapYear(), true, '2000 is leap year');
        equal(tempus([1900]).leapYear(), false, '1900 is not leap year');
        equal(tempus([1904]).leapYear(), true, '1904 is leap year');
        equal(tempus([1905]).leapYear(), false, '1905 is not leap year');
        equal(tempus({year: 1941, day: 22, month: 6}).leapYear(), false, '1941 is not leap year');
        equal(tempus({year: 2008, day: 1, month: 1}).leapYear(), true, '2008 is not leap year');
        equal(typeof tempus().leapYear(), 'boolean', 'Type is boolean');
        for (var year = 1800; year <= yyyy; year++) {
            equal(tempus().year(year).leapYear(), isLeapYear(year), 'Dynamic test. Year: ' + year);
        }
    });

    test('Test instances', function() {
        var resultTest1 = function() {
            var a = tempus({year: 2013, month: 5, day: 5, hours: 12, minutes: 41, seconds: 36});
            return a.format('%Y-%m-%d %H:%M:%S');
        };
        var resultTest2 = function() {
            var a = tempus({year: 2013, month: 5, day: 5, hours: 12, minutes: 41, seconds: 36});
            var b = tempus();
            return a.format('%Y-%m-%d %H:%M:%S');
        };

        equal(resultTest1(), '2013-05-05 12:41:36', 'Test 1');
        equal(resultTest2(), '2013-05-05 12:41:36', 'Test 2');
    });

    test('Tests valid()', function () {
        equal(tempus({day:32,month:12,year:2013,hours:0,minutes:0,seconds:0}).valid(), false, 'valid');
        equal(tempus({day:20,month:3,year:2013,hours:-1,minutes:0,seconds:0}).valid(), false, 'valid');
        equal(tempus({day:1,month:1,year:2013,hours:0,minutes:0,seconds:0}).valid(), true, 'valid');
        equal(tempus('2013-03-12', '%Y-%m-%d').valid(), true, 'valid');
        equal(tempus('16:00 08.08.2013', '%H:%M %d.%m.%Y').valid(), true, 'valid');
        equal(tempus('32.08.2013', '%d.%m.%Y').valid(), false, 'valid');
        equal(tempus('29.02.2013', '%d.%m.%Y').valid(), false, 'valid');
        equal(tempus('29.02.2012', '%d.%m.%Y').valid(), true, 'valid');
        equal(tempus('24:61 29.02.2012', '%H:%M %d.%m.%Y').valid(), false, 'valid');
        equal(tempus('00:00 01.01.2012', '%H:%M %d.%m.%Y').valid(), true, 'valid');
        equal(typeof tempus({day:32,month:12,year:2013,hours:0,minutes:0,seconds:0}).valid(), 'boolean', 'Type is boolean');
    });

    test('Tests errors()', function () {
        deepEqual(tempus().year(-5).errors(),
            {"year":-5,"month":false,"day":false,"hours":false,"minutes":false,"seconds":false,"milliseconds":false}, 'Get errors');
    });

    test('Tests between()', function () {
        equal(tempus({year: 2013, month: 11, day: 1}).between(tempus({year: 2013, month: 11, day: 5}), 'day'), 4, 'test');
        equal(tempus([2013, 11, 1]).between(tempus([2014, 5, 5]), 'month'), 6, 'test');
        equal(tempus({year: 2013, month: 11, day: 1}).between(tempus({year: 2014, month: 5, day: 5}), 'minutes'), 266400, 'test');
        equal(tempus({year: 2013, month: 11, day: 1}).between(tempus({year: 2015, month: 1, day: 1}), 'hours'), 10224, 'test');
    });

    // *************************************************
    // *                                               *
    // *                    SET                        *
    // *                                               *
    // *************************************************

    test('Tests set() method', function() {
        equal(tempus().set().utc(), Math.floor(new Date().valueOf()/1000),
            'This test may be not completed and it be right, because here checking two NOW dates');
        equal(tempus().set({year: 2013, month: 1, day: 15}).utc()*1000, new Date(2013, 0, 15).valueOf(),
            'Checking constructor with some object value');
        equal(tempus().set([2000, 6, 1, 12, 1, 15]).utc()*1000, new Date(2000, 5, 1, 12, 1, 15).valueOf(),
            'Checking constructor with array value');
        equal(tempus().set('2001-05-10 05:30:00').utc()*1000, new Date(2001, 4, 10, 5, 30, 0).valueOf(),
            'Checking constructor with string value');
        equal(tempus().set(989454600).utc(), 989454600,
            'Checking constructor with numeric value');
    });

    test('Test now date', function () {
        // check current date/time
        equal(tempus().utc(), Math.floor(new Date().getTime() / 1000), 'Current UTC');
        equal(tempus().year(), new Date().getFullYear(), 'Full year');
        equal(tempus().month(), new Date().getMonth() + 1, 'Month');
        equal(tempus().day(), new Date().getDate(), 'Day');
        equal(tempus().hours(), new Date().getHours(), 'Hours');
        equal(tempus().minutes(), new Date().getMinutes(), 'Minutes');
        equal(tempus().seconds(), new Date().getSeconds(), 'Seconds');
        equal(tempus().dayOfWeek(), new Date().getDay(), 'Day of week');
        // check types
        equal(typeof tempus(), 'object', 'Type is object');
        equal(typeof tempus().year(), 'number', 'Type is number');
        equal(typeof tempus().month(), 'number', 'Type is number');
        equal(typeof tempus().day(), 'number', 'Type is number');
        equal(typeof tempus().hours(), 'number', 'Type is number');
        equal(typeof tempus().minutes(), 'number', 'Type is number');
        equal(typeof tempus().seconds(), 'number', 'Type is number');
        equal(typeof tempus().dayOfWeek(), 'number', 'Type is number');
        equal(typeof tempus().timestamp(), 'number', 'Type is number');
    });

    test('Test set() year ranges', function () {
        for (year = 1000; year <= 3000; year++) {
            equal(tempus({year: year}).year(), year, 'Year can be from 1000 to 3000, else MIN_YEAR. Year: ' + year);
        }
        for (year = -100; year <= 999; year++) {
            equal(tempus({year: year}).year(), year, 'Year can not be 999 or less, else current and set incorrect. Year: ' + year);
        }
        for (year = 3001; year <= 4000; year++) {
            equal(tempus({year: year}).year(), year, 'Year can not be 3001 or more, else current and set incorrect. Year: ' + year);
        }
        equal(tempus({}).year(), 1000, 'If year is not setted, setting MIN_YEAR');
    });

    test('Test set() months ranges', function () {
        for (month = 1; month <= 12; month++) {
            equal(tempus().set({month: month}).month(), month, 'Month can be from 1 to 12. Month: ' + month);
        }
        for (month = -100; month <= 0; month++) {
            equal(tempus().set({month: month}).month(), month, 'Month can not be 0 or less. Month: ' + month);
        }
        for (month = 13; month <= 100; month++) {
            equal(tempus().set({month: month}).month(), month, 'Month can not be 13 or more. Month: ' + month);
        }
        equal(tempus().set({}).month(), 1, 'If month is not setted, setting MIN_MONTH');
    });

    test('Test set() day ranges', function () {
        // Not leap year check
        var dayInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        for (month = 1; month <= 12; month++) {
            for (day = 1; day <= dayInMonth[month - 1]; day++) {
                equal(tempus().set({year: 2001, month: month, day: day}).day(), day, 'Year: 2001. Day can be from 1 to X. Month: ' + month + '. Day:' + day);
            }
            for (day = -10; day <= 0; day++) {
                equal(tempus().set({year: 2001, month: month, day: day}).day(), day, 'Year: 2001. Day can not be 0 or less. Month: ' + month + '. Day:' + day);
            }
            for (day = dayInMonth[month - 1] + 1; day <= 40; day++) {
                equal(tempus().set({year: 2001, month: month, day: day}).day(), day, 'Year: 2001. Day can not be 0 or less. Month: ' + month + '. Day:' + day);
            }
        }
        // leap year check
        dayInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        for (month = 1; month <= 12; month++) {
            for (day = 1; day <= dayInMonth[month - 1]; day++) {
                equal(tempus().set({year: 2012, month: month, day: day}).day(), day, 'Year: 2012. Day can be from 1 to X. Month: ' + month + '. Day:' + day);
            }
            for (day = -10; day <= 0; day++) {
                equal(tempus().set({year: 2012, month: month, day: day}).day(), day, 'Year: 2012. Day can not be 0 or less. Month: ' + month + '. Day:' + day);
            }
            for (day = dayInMonth[month - 1] + 1; day <= 40; day++) {
                equal(tempus().set({year: 2012, month: month, day: day}).day(), day, 'Year: 2012. Day can not be 0 or less. Month: ' + month + '. Day:' + day);
            }
        }
        equal(tempus().set({}).day(), 1, 'If day is not setted, setting MIN_DAY');
    });

    test('Test set() hours ranges', function () {
        for (hours = 0; hours <= 23; hours++) {
            equal(tempus().set({hours: hours}).hours(), hours, 'Hours can be from 0 to 23. Hours: ' + hours);
        }
        for (hours = -100; hours < 0; hours++) {
            equal(tempus().set({hours: hours}).hours(), hours, 'Hours can not be 0 or less. Month: ' + hours);
        }
        for (hours = 24; hours <= 100; hours++) {
            equal(tempus().set({hours: hours}).hours(), hours, 'Hours can not be 24 or more. Month: ' + hours);
        }
        equal(tempus().set({}).hours(), 0, 'If hours is not setted, setting MIN_HOURS');
    });

    test('Test set() minutes ranges', function () {
        for (minutes = 0; minutes <= 59; minutes++) {
            equal(tempus().set({minutes: minutes}).minutes(), minutes, 'Minutes can be from 0 to 59. Minutes: ' + minutes);
        }
        for (minutes = -100; minutes < 0; minutes++) {
            equal(tempus().set({minutes: minutes}).minutes(), minutes, 'Minutes can not be 0 or less. Minutes: ' + minutes);
        }
        for (minutes = 60; minutes <= 100; minutes++) {
            equal(tempus().set({minutes: minutes}).minutes(), minutes, 'Minutes can not be 59 or more. Minutes: ' + minutes);
        }
        equal(tempus().set({}).minutes(), 0, 'If minutes is not setted, setting MIN_MINUTES');
    });

    test('Test set() seconds ranges', function () {
        for (seconds = 0; seconds <= 59; seconds++) {
            equal(tempus().set({seconds: seconds}).seconds(), seconds, 'Seconds can be from 0 to 59. Minutes: ' + seconds);
        }
        for (seconds = -100; seconds < 0; seconds++) {
            equal(tempus().set({seconds: seconds}).seconds(), seconds, 'Seconds can not be 0 or less. Minutes: ' + seconds);
        }
        for (seconds = 60; seconds <= 100; seconds++) {
            equal(tempus().set({seconds: seconds}).seconds(), seconds, 'Seconds can not be 59 or more. Minutes: ' + seconds);
        }
        equal(tempus().set({}).seconds(), 0, 'If seconds is not setted, setting MIN_SECONDS');
    });

    test('Test calc()', function() {
        equal(tempus({year: 2013, month: 6, day: 1}).calc({month: -1}).format('%d.%m.%Y'), '01.05.2013', 'Easy test');
        equal(tempus([2011, 5, 2]).calc({year: 1, month: -4, day: -1}).format('%d.%m.%Y'), '01.01.2012', 'Easy test');
    });

    // *************************************************
    // *                                               *
    // *                   LANGS                       *
    // *                                               *
    // *************************************************

    test('Tests monthNames()', function () {

        var anotherLangTest = function(lang) {
            var names;
//            tempus.loadTranslations('../src/translations.json');
            tempus.lang(lang);
            names = tempus.monthNames();
            tempus.lang();
            return names;
        };

        deepEqual(tempus.monthNames(),
            ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
            'Test');
        deepEqual(tempus.monthNames('long'),
            ["January","February","March","April","May","June",
             "July","August","September","October","November","December"],
            'Test');
        deepEqual(anotherLangTest('ru'),
            ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
            'Test');
        deepEqual(anotherLangTest('ua'),
            ["Січ", "Лют", "Берез", "Квіт", "Трав", "Черв", "Лип", "Серп", "Верес", "Жовт", "Листоп", "Груд"],
            'Test');
        deepEqual(anotherLangTest('de'),
            ["Jan", "Feb", "März", "Apr", "Mai", "Juni", "Juli", "Aug", "Sept", "Okt", "Nov", "Dez"],
            'Test');
    });

    // *************************************************
    // *                                               *
    // *                   FORMAT                      *
    // *                                               *
    // *************************************************

    test('Tests format()', function() {
        tempus.lang('en');
        equal(tempus({year: 2013, month: 11, day:5}).format('%d.%m.%Y'), '05.11.2013', 'Test');
        equal(tempus([2013, 11, 18, 12, 36, 42]).format('%Y-%m-%d %H:%M:%S'), '2013-11-18 12:36:42', 'Test');
        // all formats
        equal(tempus([2013, 11, 5, 12, 15, 32, 108]).format('%Y'), '2013', 'Test');
        equal(tempus([2013, 11, 5, 12, 15, 32, 108]).format('%m'), '11', 'Test');
        equal(tempus([2013, 11, 5, 12, 15, 32, 108]).format('%d'), '05', 'Test');
        equal(tempus([2013, 11, 5, 12, 15, 32, 108]).format('%H'), '12', 'Test');
        equal(tempus([2013, 11, 5, 12, 15, 32, 108]).format('%M'), '15', 'Test');
        equal(tempus([2013, 11, 5, 12, 15, 32, 108]).format('%S'), '32', 'Test');
        equal(tempus([2013, 11, 5, 12, 15, 32, 108]).format('%s'), '1383653732', 'Test');
        equal(tempus([2013, 11, 5, 12, 15, 32, 108]).format('%F'), '2013-11-05', 'Test');
        equal(tempus("2013-11-30", "%F").format("%F"), '2013-11-30', 'Test');
        equal(tempus("11/30/2013", "%D").format("%D"), '11/30/2013', 'Test');

        equal(tempus([2013, 11, 5, 12, 15, 32, 108]).format('%D'), '11/05/2013', 'Test');
        // months
        equal(tempus([2013, 11, 5]).format('%Y%m%d'), '20131105', 'Test');
        equal(tempus([2013, 1, 1]).format('%b %B'), 'Jan January', 'Test');
        equal(tempus([2013, 2, 1]).format('%b %B'), 'Feb February', 'Test');
        equal(tempus([2013, 3, 1]).format('%b %B'), 'Mar March', 'Test');
        equal(tempus([2013, 4, 1]).format('%b %B'), 'Apr April', 'Test');
        equal(tempus([2013, 5, 1]).format('%b %B'), 'May May', 'Test');
        equal(tempus([2013, 6, 1]).format('%b %B'), 'Jun June', 'Test');
        equal(tempus([2013, 7, 1]).format('%b %B'), 'Jul July', 'Test');
        equal(tempus([2013, 8, 1]).format('%b %B'), 'Aug August', 'Test');
        equal(tempus([2013, 9, 1]).format('%b %B'), 'Sep September', 'Test');
        equal(tempus([2013, 10, 1]).format('%b %B'), 'Oct October', 'Test');
        equal(tempus([2013, 11, 1]).format('%b %B'), 'Nov November', 'Test');
        equal(tempus([2013, 12, 1]).format('%b %B'), 'Dec December', 'Test');
        // day of week
        equal(tempus([2013, 11, 17]).format('%a %A'), 'Sun Sunday', 'Test');
        equal(tempus([2013, 11, 18]).format('%a %A'), 'Mon Monday', 'Test');
        equal(tempus([2013, 11, 19]).format('%a %A'), 'Tue Tuesday', 'Test');
        equal(tempus([2013, 11, 20]).format('%a %A'), 'Wed Wednesday', 'Test');
        equal(tempus([2013, 11, 21]).format('%a %A'), 'Thu Thursday', 'Test');
        equal(tempus([2013, 11, 22]).format('%a %A'), 'Fri Friday', 'Test');
        equal(tempus([2013, 11, 23]).format('%a %A'), 'Sat Saturday', 'Test');
    });

    test('Tests registerFormat() and unregisterFormat()', function() {
        tempus.registerFormat('%q',
            function(date) {
                return date.month();
            },
            function(value) {
                var v = Number(value);
                return {month: (isNaN(v) ? undefined : v) };
            },
            1,
            2,
            'number'
        );

        equal(tempus({year: 2013, month: 1, day: 1}).format('%d.%q.%Y'), "01.1.2013", 'Test');
        equal(tempus('10.2.2013', '%d.%q.%Y').month(), 2, 'Test');

        tempus.unregisterFormat('%q');

        equal(tempus({year: 2013, month: 1, day: 1}).format('%d.%q.%Y'), "01.%q.2013", 'Test');
        equal(tempus('10.2.2013', '%d.%q.%Y').month(), -1, 'Test');
    });

    // *************************************************
    // *                                               *
    // *                  FACTORY                      *
    // *                                               *
    // *************************************************

    test('Tests constructor of TempusDate', function() {
        equal(Math.floor(tempus().utc()), Math.floor(new Date().valueOf()/1000),
            'This test may be not completed and it be right, because here checking two NOW dates');
        equal(tempus({year: 2013, month: 1, day: 15}).utc()*1000, new Date(2013, 0, 15).valueOf(),
            'Checking constructor with some object value');
        equal(tempus([2000, 6, 1, 12, 1, 15]).utc()*1000, new Date(2000, 5, 1, 12, 1, 15).valueOf(),
            'Checking constructor with array value');
        equal(tempus('2001-05-10 05:30:00').utc()*1000, new Date(2001, 4, 10, 5, 30, 0).valueOf(),
            'Checking constructor with string value');
        equal(tempus(989454600).utc(), 989454600,
            'Checking constructor with numeric value');
    });

    test('Tests generator of many TempusDate', function() {
        deepEqual(tempus.generate({dateFrom: '01.01.2013',dateTo: '10.01.2013',period: 'day',format: '%d.%m.%Y'}),
            ["01.01.2013", "02.01.2013", "03.01.2013", "04.01.2013", "05.01.2013",
             "06.01.2013", "07.01.2013", "08.01.2013", "09.01.2013", "10.01.2013"],
            'Tests simply generation of dates');
        deepEqual(tempus.generate({dateFrom: '20130329',formatFrom: '%Y%m%d',dateTo: '20130402',period: {day: 1},format: '%d.%m.%Y'}),
            ["29.03.2013", "30.03.2013", "31.03.2013", "01.04.2013", "02.04.2013"],
            'Tests generation of dates with custom format and period as object');
        deepEqual(tempus.generate({
                dateFrom: tempus([2014,1]).day(1),
                dateTo: tempus([2014, 1]).day(3),
                period: {
                    day:1
                },
                format: '%d',
                groupBy: 'week',
                fillNulls: true
            }),
            [[null,null,null,"01","02","03",null]],
            'Tests generation of dates');
        deepEqual(tempus.generate({
                dateFrom: tempus([2014,2]).day(1),
                dateTo: tempus([2014, 2]).day(25),
                period: {
                    day:1
                },
                format: '%d',
                groupBy: 'week',
                fillNulls: true
            }),
            [[null,null,null,null,null,null,"01"],["02","03","04","05","06","07","08"],
                ["09","10","11","12","13","14","15"],["16","17","18","19","20","21","22"],
                ["23","24","25",null,null,null,null]],
            'Tests generation of dates');
    });
})();