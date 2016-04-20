riot.tag2('alarm-list', '<div class="section__container"> <header class="header__black"> <div class="header__title">iCalendar</div> <div class="header__left"> <div class="alarm__list__close header__icon header__icon__back"></div> </div> <div class="header__right"> <div class="alarm__list__icon__add header__icon"></div> </div> </header> <div each="{item in data}" no-reorder class="alarm__list__item alarm__list__item{utils.getBetweenDay(item.date)} {alarm__list__item--off : !item.active}"> <div onclickdelegateupdate="{switchAlarm}" class="alarm__list__item__switch"></div> <div onclickdelegate="{openAlarm}" riot-item=".alarm__settings" riot-addclass="section--show" class="alarm__list__time"><span class="alarm__list__hour">{utils.getHours(item.time)}</span>:{utils.getMinutes(item.time)}</div> <div onclickdelegate="{openPhone}" riot-item=".alarm__settings" riot-addclass="section--show" class="alarm__list__text"> <div if="{item.phone}" class="alarm__list__phone">{item.phone}</div> <div class="alarm__list__when"><strong class="alarm__list__strong">{utils.getDate(item.date)}</strong><virtual if="{item.name}">, {item.name}</virtual></div> </div> <div class="alarm__list__days"> <div class="alarm__list__days__item {alarm__list__days__item--active : utils.dayOfWeek(item.date) === ⁗Пн⁗}">Пн</div> <div class="alarm__list__days__item {alarm__list__days__item--active : utils.dayOfWeek(item.date) === ⁗Вт⁗}">Вт</div> <div class="alarm__list__days__item {alarm__list__days__item--active : utils.dayOfWeek(item.date) === ⁗Ср⁗}">Ср</div> <div class="alarm__list__days__item {alarm__list__days__item--active : utils.dayOfWeek(item.date) === ⁗Чт⁗}">Чт</div> <div class="alarm__list__days__item {alarm__list__days__item--active : utils.dayOfWeek(item.date) === ⁗Пт⁗}">Пт</div> <div class="alarm__list__days__item {alarm__list__days__item--active : utils.dayOfWeek(item.date) === ⁗Сб⁗}">Сб</div> <div class="alarm__list__days__item {alarm__list__days__item--active : utils.dayOfWeek(item.date) === ⁗Вс⁗}">Вс</div> </div> <div onclickdelegate="{removeAlarm}" class="alarm__list__item__remove"></div> </div> </div> <div if="{!data.length}" class="section__wrapper__alarm__empty"> <div class="section__wrapper__alarm__empty__text">Сейчас нет активных напоминаний</div> </div>', '', 'id="alarm__list__scroll" class="section__wrapper section__wrapper__alarm"', function(opts) {

    var $ = this,
    $scope = $$($.root),
    $section = $$($.parent.root);

    $.data = [
        {
            id: "1",
            date: "2016-04-04",
            time: "720",
            phone: "89160172086",
            name: "Ирина",
            active: true
        },
        {
            id: "2",
            date: "2016-04-04",
            time: "750",
            phone: "89160172086",
            name: "Ирина",
            active: true
        },
        {
            id: "3",
            date: "2016-04-05",
            time: "960",
            phone: "89855216480",
            name: "Ирина",
            active: true
        },
        {
            id: "4",
            date: "2016-04-06",
            time: "1020",
            phone: "9264571727",
            name: "Ирина",
            active: true
        },
        {
            id: "5",
            date: "2016-04-07",
            time: "1080",
            phone: "9264571727",
            name: "Ирина",
            active: true
        },
        {
            id: "6",
            date: "2016-04-08",
            time: "1080",
            phone: "9264571727",
            name: "Ирина",
            active: true
        },
        {
            id: "7",
            date: "2016-04-09",
            time: "1080",
            phone: "9264571727",
            name: "Ирина",
            active: true
        }
    ];

    $.data.forEach(function(item, i) {
        $.data[i].date = tempus().calc({day: i}).format('%Y-%m-%d');
    });

    $.utils = {

        getBetweenDay: function(date){
            var days = tempus(date).between(tempus(), 'day');
            if (days < 1 && days > -7) days = Math.abs(days) + 1;
            else if (days < -6) days = 7;
            else days = 0;
            return days;
        },

        getDate: function(date){
            var between = tempus(date).between(tempus(), 'day');
            if (between === 0) return "сегодня";
            else if (between === -1) return "завтра";
            else {
                return tempus(date).format('%d, %b');
            }
        },

        getHours: function(time){
            return Math.floor(time / 60);
        },

        getMinutes: function(time){
            var min = time - Math.floor(time / 60) * 60;
            return min < 10 ? "0" + min : min;
        },

        dayOfWeek: function(date){
            return tempus(date).dayOfWeek("short");
        }
    };

    $.switchAlarm = function(){
        if (this.item.active) this.item.active = false;
        else this.item.active = true;
    };

    $.openAlarm = function(){
        $.settings.alarmShow({
            alarm: this.item,
            section: "time"
        });
    };

    $.openPhone = function(){
        $.settings.alarmShow({
            alarm: this.item,
            section: "phone"
        });
    };

    $.removeAlarm = function(e){
        var _this = this,
            id = this.item.id,
            $item = $$(e.target.parentNode);

        $item.addClass("alarm__list__item--remove");
        app.utils.onEndAnimation($item[0], function(){
            $item[0].style[prefixed.transform] = "";
            $item[0].show = false;
            $.data.forEach(function(item, i) {
                if (item.id === id) $.data.splice(i, 1);
            });
            _this.update();
            $.iScrollAlarmList.refresh();
        });
    };

    this.on("mount", function(){

        $.settings = $.parent.tags["alarm-settings"];

        $scope.find(".header__icon__back").on(clickEvent, function(){
            $section.removeClass("section--show");
        });

        $.iScrollAlarmList = new IScroll($scope[0], {
            scrollX: true,
            scrollY: true
        });

        (function animationAlarmLoop(){
            app.utils.raf(animationAlarmLoop);
            app.utils.getScroll($.iScrollAlarmList);
        })();

        var slideItem = function(elem, item){
            this.el = $$(elem);
            this.items = item;
            this.touchStart();
            this.touchMove();
            this.touchEnd();
        };

        slideItem.prototype = {

            isAnimating: false,

            startTime: null,

            firstTouch: {
                x: null,
                y: null
            },

            touchDelta: {
                x: null,
                y: null
            },

            touchStart: function(){
                var _this = this;

                this.el.on(app.device.isMobile ? "touchstart" : "mousedown", this.items, function(ev){
                    ev.preventDefault();
                    _this.isAnimating = false;
                    _this.item = ev.currentTarget;
                    _this.startTime = _this.getTime();
                    if (app.device.isMobile){
            		    _this.firstTouch = {
                            x: parseInt(ev.changedTouches[0].clientX),
                            y: parseInt(ev.changedTouches[0].clientY)
                        }
                    }
                    else {
                        _this.firstTouch = {
                            x: parseInt(ev.clientX),
                            y: parseInt(ev.clientY)
                        }
                    }
                });
            },

            touchMove: function() {
                var _this = this;

                this.el.on(app.device.isMobile ? "touchmove" : "mousemove", this.items, function(ev){
                    ev.preventDefault();

                    var moving = function(){

                        if (app.device.isMobile){
                            _this.touchDelta = {
                                x: parseInt(ev.changedTouches[0].clientX) - _this.firstTouch.x,
                                y: Math.abs(parseInt(ev.changedTouches[0].clientY) - _this.firstTouch.y)
                            }
                        }
                        else {
                            _this.touchDelta = {
                                x: parseInt(ev.clientX) - _this.firstTouch.x,
                                y: Math.abs(parseInt(ev.clientY) - _this.firstTouch.y)
                            }
                        }

                        if (_this.touchDelta.x < 0) _this.direction = "left";
                        else _this.direction = "right";

                        var desTime = _this.getTime() - _this.startTime,
                            show = _this.item && _this.item.show;

                        if (desTime < 100 && !_this.isAnimating && !show || _this.touchDelta.y > 12 || !show && (_this.touchDelta.x > 0 || _this.touchDelta.x >= -10) || show && _this.touchDelta.x < 0) return;

                        _this.isAnimating = true;

                        if (show){
                            _this.item.style[prefixed.transform] = 'translate3d(' + (_this.touchDelta.x - 150) + 'px, 0, 0)';
                        }
                        else {
                            _this.item.style[prefixed.transform] = 'translate3d(' + (_this.touchDelta.x * 0.4) + 'px, 0, 0)';
                        }
                    }

                    app.utils.raf(moving);
                    moving();
                });
        	},

            touchEnd: function() {
                var _this = this;

                this.el.on(app.device.isMobile ? "touchend" : "mouseup", this.items, function(ev){
                    ev.preventDefault();
                    if (!_this.item.show && _this.direction === 'left') {
                        if (Math.abs(_this.touchDelta.x) > 75){
                            _this.slide(true);
                        }
                        else {
                            _this.slide(false);
                        }
                    }
                    else if (_this.item.show && _this.direction === 'right') {
                        if (Math.abs(_this.touchDelta.x) > 50){
                            _this.slide(false);
                        }
                        else {
                            _this.slide(true);
                        }
                    }
                    _this.isAnimating = false;
                });
        	},

            slide: function(show) {
                var _this = this;

                this.$item = $$(this.item);

                this.$item.addClass("alarm__list__item--animate");

                if (show) {
                    this.item.style[prefixed.transform] = 'translate3d(-150px, 0, 0)';
                    this.item.show = true;
                }
                else {
                    this.item.style[prefixed.transform] = "";
                    this.item.show = false;
                }
                app.utils.onEndTransition(this.item, function(){
                    _this.$item.removeClass("alarm__list__item--animate");
                });
        	},

            getTime: function(){
                return new Date().getTime();
            }
        };

        new slideItem($scope[0], ".alarm__list__item");
    });

});

riot.tag2('alarm-section', '<alarm-list></alarm-list> <alarm-settings></alarm-settings>', '', 'class="section section__right alarm-section section__header__nofixed"', function(opts) {
});

riot.tag2('alarm-settings', '<div class="section__down__wrapper alarm__settings__wrapper {alarm__settings--off : !alarm.active} {alarm__settings--dateSelect : section === ⁗date⁗} {alarm__settings--phone : section === ⁗phone⁗}"> <div onclickdelegateupdate="{switcher}" class="alarm__settings__switch">ON</div> <div onclickdelegateupdate="{sectionDate}" class="alarm__settings__date__select"> <div class="alarm__settings__date__text"><span class="alarm__settings__day">{utils.dayAlarm(alarm.date)}</span> {utils.monthAlarm(alarm.date)}</div> <div class="alarm__settings__weekday">{utils.dayOfWeek(alarm.date)}</div> </div> <div class="alarm__settings__date"> <div class="alarm__settings__date__container"> <div id="alarm__settings__iscroll__days" class="alarm__settings__iscroll__wrapper"> <div class="alarm__settings__iscroll__container"> <div each="{item in days}" no-reorder data-value="{item.value}" class="alarm__settings__date__item {alarm__settings__item--active : item.active}">{item.title}</div> </div> </div> </div> <div class="alarm__settings__date__container"> <div id="alarm__settings__iscroll__months" class="alarm__settings__iscroll__wrapper"> <div class="alarm__settings__iscroll__container"> <div each="{item in months}" no-reorder data-value="{item.value}" class="alarm__settings__date__item {alarm__settings__item--active : item.active}">{item.title}</div> </div> </div> </div> <div onclickdelegate="{setDateNow}" class="alarm__settings__date__now"> <span class="alarm__settings__date__now__title">Сегодня:</span>&nbsp; {dateNow} </div> </div> <div class="alarm__settings__time"> <div class="alarm__settings__time__container"> <div id="alarm__settings__iscroll__hours" class="alarm__settings__iscroll__wrapper"> <div class="alarm__settings__iscroll__container"> <div each="{item in hours}" no-reorder data-value="{item.value}" class="alarm__settings__time__item {alarm__settings__item--active : item.active}">{item.title}</div> </div> </div> </div> <div class="alarm__settings__time__dots">:</div> <div class="alarm__settings__time__container"> <div id="alarm__settings__iscroll__minutes" class="alarm__settings__iscroll__wrapper"> <div class="alarm__settings__iscroll__container"> <div each="{item in minutes}" no-reorder data-value="{item.value}" class="alarm__settings__time__item {alarm__settings__item--active : item.active}">{item.title}</div> </div> </div> </div> </div> <div class="alarm__settings__phone"> <div class="alarm__settings__phone__text">{alarm.phone}</div> <div if="{alarm.name}" class="alarm__settings__phone__name">{alarm.name}</div> <div class="alarm__settings__phone__button"> <div class="alarm__settings__phone__button__text">позвонить</div> </div> </div> <div class="alarm__settings__buttons__left"> <div onclickdelegateupdate="{sectionTime}" class="alarm__settings__buttons__left__btn alarm__settings__button__options {alarm__settings__buttons__left__btn--active : section === ⁗time⁗ || section === ⁗date⁗}"></div> <div onclickdelegateupdate="{sectionPhone}" class="alarm__settings__buttons__left__btn alarm__settings__button__phone {alarm__settings__buttons__left__btn--active : section === ⁗phone⁗}"></div> </div> <div class="alarm__settings__buttons"> <div onclickdelegate="{success}" riot-item=".alarm__settings" riot-removeclass="section--show" class="alarm__settings__button alarm__settings__button__success"></div> <div onclickdelegate="{cancel}" riot-item=".alarm__settings" riot-removeclass="section--show" class="alarm__settings__button alarm__settings__button__cancel"></div> </div> </div>', '', 'class="section section__down alarm__settings"', function(opts) {

    var $ = this,
    $scope = $$($.root),
    $alarmList = $.parent.tags["alarm-list"];

    $.activity = false;

    $.section = "time";

    $.alarm = {
        id: null,
        show: false,
        date: "2016-04-03",
        time: "720",
        active: true
    };

    $.utils = {

        dateNow: function(){
            return tempus();
        },

        getHours: function(hours){
            var data = [];
            for (var i = 9; i < 20; i++){
                var hour = i;
                if (hour < 10) hour = "0" + hour;
                data.push({
                    title: hour,
                    value: i,
                    active: hours === i ? true : false
                });
            }
            return data;
        },

        getMinutes: function(mins){
            var data = [];
            for (var i = 0; i < 12; i++){
                var min = i * 5;
                if (min < 10) min = "0" + (min === 0 ? 0 : min);
                data.push({
                    title: min,
                    value: i * 5,
                    active: mins === i ? true : false
                });
            }
            return data;
        },

        getDays: function(day, count){
            var data = [];
            for (var i = 1; i < count + 1; i++){
                var d = i;
                if (d < 10) d = "0" + d;
                data.push({
                    title: d,
                    value: i,
                    active: day === i ? true : false
                });
            }
            return data;
        },

        getMonths: function(month){
            var data = [];
            for (var i = 1; i < 13; i++){
                data.push({
                    title: tempus({month: i}).format('%B'),
                    value: i,
                    active: month === i ? true : false
                });
            }
            return data;
        },

        dayOfWeek: function(date){
            return tempus(date).dayOfWeek("short");
        },

        dayAlarm: function(date){
            return tempus(date).format('%d');
        },

        monthAlarm: function(date){
            return tempus(date).format('%B');
        }
    };

    var now = $.utils.dateNow();

    $.dayCount = now.dayCount();
    $.hours = $.utils.getHours();
    $.minutes = $.utils.getMinutes();
    $.days = $.utils.getDays(now.format('%d'), 31);
    $.months = $.utils.getMonths(now.format('%m'));

    $.switcher = function(){
        if ($.alarm.active) $.alarm.active = false;
        else $.alarm.active = true;
    };

    $.sectionTime = function(){
        $.section = "time";
    };

    $.sectionDate = function(){
        if ($.section === "date") $.section = "time";
        else $.section = "date";
    };

    $.sectionPhone = function(){
        $.section = "phone";
    };

    $.setDateNow = function(){
        var dateNow = tempus();
        $.alarm.date = dateNow.format('%Y-%m-%d');

        var day = dateNow.format('%d'),
            month = dateNow.format('%m'),
            dayCount = dateNow.dayCount();

        if ($.dayCount != dayCount){
            $.days = $.utils.getDays(day, dayCount);
            $.daysScroll.refresh();
        }
        $.activity = false;
        $.daysScroll.scrollTo(day);
        $.monthsScroll.scrollTo(month);
        this.update();
        setTimeout(function(){
            $.activity = true;
        }, 500);
    };

    $.alarmShow = function(data){
        $.alarm = JSON.stringify(data.alarm);
        $.alarm = JSON.parse($.alarm);
        $.section = data.section;

        var day = tempus($.alarm.date).format('%d'),
            month = tempus($.alarm.date).format('%m'),
            dayCount = tempus($.alarm.date).dayCount();

        if ($.dayCount != dayCount){
            $.days = $.utils.getDays(day, dayCount);
            $.daysScroll.refresh();
        }
        $.daysScroll.scrollTo(day);
        $.monthsScroll.scrollTo(month);
        $.hoursScroll.scrollTo(Math.floor($.alarm.time / 60));
        $.minutesScroll.scrollTo($.alarm.time - Math.floor($.alarm.time / 60) * 60);
        $.dateNow = tempus().format('%d %b, %a');

        app.utils.onEndTransition($scope[0], function(){
            $.activity = true;
            $.update();
        });
    };

    $.success = function(){
        var time = $.hoursScroll.value * 60 + $.minutesScroll.value;
        $.alarm.time = time;
        $alarmList.data.forEach(function(item, i) {
            if (item.id === $.alarm.id){
                $alarmList.data[i] = $.alarm;
            }
        });
        $alarmList.data.sort($.compareDate);
        $alarmList.update();

        $.activity = false;
    };

    $.cancel = function(){

        $.activity = false;
    };

    $.compareDate = function(a, b){
        if (a.date > b.date) return 1;
        if (a.date < b.date) return -1;
    };

    this.on("mount", function(){

        var iScrollSelect = function(){};

        iScrollSelect.prototype = {

            init: function(name, item){

                var _this = this,
                    i = 0;

                this.wrapper = $scope.find("#alarm__settings__iscroll__" + name);

                this.container = this.wrapper.children();

                this.step = parseInt(this.container.find(".alarm__settings__" + item + "__item:first").height());

                this.item = item;

                this.container.find(".alarm__settings__" + item + "__item").each(function(){
                    this.setAttribute("data-step", i);
                    i += _this.step;
                });

                this.scroll = new IScroll(this.wrapper[0], {
                    scrollX: false,
                    scrollY: true,
                    snap: true,
                    snapSpeed: item === "time" ? 200 : 300,
                    probeType: 3
                });

                (function animationAlarmLoops(){
                    app.utils.raf(animationAlarmLoops);
                    app.utils.getScroll(_this.scroll);
                })();

                this.wrapper.on(clickEvent, ".alarm__settings__" + item + "__item", function(){
                    _this.scroll.scrollToElement(this, 200, null, null, IScroll.utils.ease.cubicOut);
                });

                this.scroll.on('scrollEnd', function(){
                    var pos = Math.abs(this.y),
                        $elem = _this.container.find(".alarm__settings__" + item + "__item[data-step='" + pos + "']");

                    if ($elem.length){
                        $elem
                        .addClass("alarm__settings__item--active")
                        .siblings()
                        .removeClass("alarm__settings__item--active");

                        _this.value = parseInt($elem[0].getAttribute("data-value"));

                        if ($.activity){
                            if (name === "months") _this.calcDays();
                            if (name === "days" || name === "months"){
                                var day = $.daysScroll.value,
                                    month = $.monthsScroll.value;

                                if (day < 10) day = "0" + day;
                                if (month < 10) month = "0" + month;
console.log("scrollEnd");
                                $.alarm.date = $.alarm.date.replace(/(\d+)-\d+-\d+/g, "$1-" + month + "-" + day);
                                $.update();
                            }
                        }
                    }
                });
            },

            calcDays: function(){
                var dayCount = tempus({month: this.value}).dayCount();
                if ($.dayCount != dayCount){
                    $.days = $.utils.getDays($.daysScroll.value, dayCount);
                    $.dayCount = parseInt(dayCount);
                    if ($.daysScroll.value && $.daysScroll.value > $.dayCount) {
                        $.daysScroll.value = $.dayCount;
                        $.daysScroll.scrollTo($.dayCount);
                    }

                    $.daysScroll.refresh();
                }
            },

            refresh: function(){

                this.scroll.refresh();

                var _this = this,
                    i = 0;

                _this.container.find(".alarm__settings__" + _this.item + "__item").each(function(){
                    this.setAttribute("data-step", i);
                    i += _this.step;
                });
            },

            scrollTo: function(item){
                if (!item && item !== 0) return;
                item = parseInt(item);
                this.value = item;
                this.scroll.scrollToElement(this.container.find("div[data-value='" + item + "']")[0], 1);
            }
        };

        $.hoursScroll = new iScrollSelect();
        $.hoursScroll.init("hours", "time");

        $.minutesScroll = new iScrollSelect();
        $.minutesScroll.init("minutes", "time");

        $.daysScroll = new iScrollSelect();
        $.daysScroll.init("days", "date");

        $.monthsScroll = new iScrollSelect();
        $.monthsScroll.init("months", "date");
    });

});

riot.tag2('alert-window', '<div class="alert__window__wrapper"> <div class="alert__window__header"> <div class="alert__window__title">{data.title}</div> <div if="{data.subtitle}" class="alert__window__subtitle"></div> <input if="{data.input}" type="text" class="alert__window__input" autocomplete="off" spellcheck="off"> </div> <div class="alert__window__buttons"> <div onclickdelegateupdate="{onCancel}" class="alert__window__button {alert__window__button--active : data.button === ⁗cancel⁗}">{data.cancel && data.cancel.title ? data.cancel.title : ⁗Отмена⁗}</div> <div onclickdelegateupdate="{onSuccess}" class="alert__window__button {alert__window__button--active : data.button === ⁗success⁗}">{data.success && data.success.title ? data.success.title : ⁗OK⁗}</div> </div> </div>', '', 'class="alert__window {alert__window--active : active}"', function(opts) {

    var $ = this,
    $scope = $$($.root);

    $.active = false;

    $.data = {
        title: null,
        subtitle: null
    };

    $.show = function(data){
        if (data){
            $.data = data;
            $.active = true;
            $.update();
        }
    };

    $.onSuccess = function(){
        if ($.data.success && typeof $.data.success.callback === "function"){
            $.data.success.callback();
        }
        $.data.button = "success";
        $.active = false;
    };

    $.onCancel = function(){
        if ($.data.cancel && typeof $.data.cancel.callback === "function"){
            $.data.cancel.callback();
        }
        $.data.button = "cancel";
        $.active = false;
    };

});

riot.tag2('chat-list-raw', '', '', '', function(opts) {
  this.root.innerHTML = opts.content;
});

riot.tag2('chat-list', '<div class="section section__primary chat__list"> <header> <div class="header__title">iMessenger</div> <div class="header__left"> <div class="chat__list__close header__icon header__icon__back"></div> </div> <div class="header__right"> <div class="chat__list__header__photo header__icon header__icon__avatar"> <div if="{lastClient.avatar}" class="header__icon__avatar__container"> <div riot-style="background-image:url({lastClient.avatar})" class="header__icon__avatar__image"></div> </div> <div if="{lastClient.id}" class="header__icon__avatar__status {lastClient.online ? \'header__icon__avatar__status--online\' : \'header__icon__avatar__status--offline\'}"></div> </div> </div> </header> <div id="chat__list__scroll" class="section__wrapper"> <div class="chat__list__container section__container"> <div onclickdelegate="{openRoom}" each="{user in users}" no-reorder class="chat__list__item"> <div class="chat__list__photo {chat__list__photo--avatar : user.avatar}"> <div if="{user.avatar}" riot-style="background-image:url({user.avatar})" class="chat__list__avatar"></div> </div> <div class="chat__list__status {user.online ? \'chat__list__status--online\' : \'chat__list__status--offline\'}"></div> <div class="chat__list__text"> <div class="chat__list__time">{user.joinTime}</div> <div class="chat__list__counts {chat__list__counts--active : user.newMessages}">{user.newMessages}</div> <div class="chat__list__title">{user.name ? user.name : \'Гость\'}</div> <div class="chat__list__message">{user.lastMessage ? user.lastMessage : \'С вами хотят пообщаться\'}</div> </div> </div> </div> </div> <div if="{!users.length}" class="chat__list__empty"><span class="chat__list__empty__text">Сейчас нет активных чатов</span></div> </div> <div class="section chat__body"> <div each="{user in users}" no-reorder id="chat__room__{user.id}" class="section section__secondary"> <header> <div class="header__title header__title__chat__room">{user.name ? user.name : \'Гость\'}</div> <div class="header__left"> <div class="chat__room__close header__icon header__icon__back"></div> </div> <div class="header__right"> <div class="chat__header__photo header__icon header__icon__avatar"> <div if="{user.avatar}" class="header__icon__avatar__container"> <div riot-style="background-image:url({user.avatar})" class="header__icon__avatar__image"></div> </div> <div if="{user.id}" class="header__icon__avatar__status {user.online ? \'header__icon__avatar__status--online\' : \'header__icon__avatar__status--offline\'}"></div> </div> </div> </header> <div id="chat__room__scroll__{user.id}" class="section__wrapper"> <div class="section__container chat__room__container"> <div each="{message in user.messages}" no-reorder class="chat__message {message.me ? \'chat__message__left\' : \'chat__message__right\'}"> <div class="{message.me ? \'chat__message__que\' : \'chat__message__answer\'} {chat__message__system : message.type !== \'chat\'} {chat__message__system--active : message.type == \'auth\' && user.auth || message.type == \'phone\' && user.phone || message.type == \'email\' && user.email} {chat__message__new : message.new} chat__message__inner"> <chat-list-raw content="{message.text}">{message.text}</chat-list-raw> <div if="{message.type === \'auth\' && !user.auth}" class="chat__message__icon--auth"></div> <div if="{message.type === \'auth\' && user.auth}" class="chat__message__icon--checked"></div> <div if="{message.type === \'phone\'}" class="chat__message__icon--phone"></div> <div if="{message.type === \'email\'}" class="chat__message__icon--email"></div> </div> </div> </div> </div> <div class="chat__panel"> <div class="chat__panel__info"> <div class="chat__panel__info__typing {chat__panel__info__typing--active : client_id && client_id == typed_id}">Вам печатают сообщение...</div> </div> <div class="chat__panel__effect {chat__panel__effect--active : client_id && client_id == typed_id}"> <div class="chat__panel__effect__bar"></div> <div class="chat__panel__effect__dots {chat__panel__effect__dots--active : client_id && client_id == typed_id}"> <div class="chat__panel__effect__dot chat__panel__effect__dot1"></div> <div class="chat__panel__effect__dot chat__panel__effect__dot2"></div> <div class="chat__panel__effect__dot chat__panel__effect__dot3"></div> </div> </div> <form class="chat__panel__form"> <div class="chat__panel__menu"> <i class="chat__panel__menu__circle"></i> <select onchange="{changeOptions}" name="chat__select__options" class="chat__select__options"> <option value="1">Предложить представиться</option> <option value="2">Предложить оставить телефон</option> <option value="3">Предложить оставить email</option> <option value="4">Прикрепить картинку</option> </select> </div> <input onclickdelegate="{focusInput}" type="text" name="chat__panel__input" class="chat__panel__input" placeholder="Набрать сообщение..." autocomplete="off"> <div onclickdelegate="{sendMessage}" class="chat__panel__button"></div> </form> </div> </div> </div> <div each="{user in users}" no-reorder id="chat__metrika__{user.id}" class="section section__right section__right__not__fully section__header__without"> <div class="chat__metrika__close"></div> <div id="chat__metrika__wrapper__{user.id}" class="section__wrapper section__wrapper__metrika"> <div class="section__container"> <div class="chat__metrika__header"> <div class="chat__metrika__time">{user.joinTime}</div> <div class="chat__metrika__photo {user.online ? \'chat__metrika__photo--online\' : \'chat__metrika__photo--offline\'}"> <div if="{user.avatar}" class="chat__metrika__avatar" riot-style="background-image:url({user.avatar})"></div> </div> <div if="{user.profile.bdate}" class="chat__metrika__bdate">{user.profile.bdate}</div> <div class="chat__metrika__title">{user.name ? user.name : \'Гость\'}</div> </div> <div class="chat__metrika__content"> <div if="{user.phone}" class="chat__metrika__tile"> <div class="chat__metrika__tile__title">Телефон: <span class="chat__metrika__text__blue">{user.phone}</span></div> </div> <div class="chat__metrika__tile"> <div class="chat__metrika__tile__subtitle">По данным счетчика</div> <div class="chat__metrika__tile__text">{user.metrika.visit}-й раз на сайте, {user.metrika.city}</div> </div> <div if="{user.metrika.start}" class="chat__metrika__tile"> <div class="chat__metrika__tile__subtitle">Страница входа</div> <div class="chat__metrika__tile__text"><a class="chat__metrika__link" href="{user.metrika.start}" target="_blank">{user.metrika.start}</a></div> </div> <div class="chat__metrika__tile"> <div class="chat__metrika__tile__subtitle">На сайт перешли {user.metrika.adv ? \'по рекламе\' : \'с\'}</div> <div class="chat__metrika__tile__text"> {⁗Яндекс.Директ⁗ : user.metrika.adv && user.metrika.referer === ⁗yandex⁗} {⁗Яндекс.Поиск⁗ : !user.metrika.adv && user.metrika.referer === ⁗yandex⁗} {⁗Google.Adwords⁗ : user.metrika.adv && user.metrika.referer === ⁗google⁗} {⁗Google.Поиск⁗ : !user.metrika.adv && user.metrika.referer === ⁗google⁗} {⁗Rambler.Поиск⁗ : user.metrika.referer === ⁗rambler⁗} {⁗Yahoo.Поиск⁗ : user.metrika.referer === ⁗yahoo⁗} {⁗Bing.Поиск⁗ : user.metrika.referer === ⁗bing⁗} {⁗Mail.ru.Поиск⁗ : user.metrika.referer === ⁗mail⁗} <virtual if="{user.metrika.referer && user.metrika.referer.match(/http/)}"> {user.metrika.referer} </virtual> <virtual if="{user.metrika.keyword}">, {user.metrika.keyword}</virtual> </div> </div> <div if="{user.metrika.pages}" class="chat__metrika__tile"> <div class="chat__metrika__tile__title">Посещено: {user.metrika.pages} страниц(ы)</div> <div class="chat__metrika__pages__container"> <div each="{link in user.metrika.pagesData}" no-reorder class="chat__metrika__tile"> <a class="chat__metrika__link" target="_blank" href="{link}">{link}</a> </div> </div> </div> </div> </div> </div> </div> <svg style="position:absolute" xmlns="http://www.w3.org/2000/svg" version="1.1"> <defs> <filter id="goo"> <fegaussianblur in="SourceGraphic" stddeviation="10" result="blur"></fegaussianblur> <fecolormatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 19 -9" result="goo"></fecolormatrix> <fecomposite in="SourceGraphic" in2="goo"></fecomposite> </filter> </defs> </svg>', '', 'data-marquee="chat" class="section section__marquee"', function(opts) {

    var $ = this,
    $scope = $$($.root);

    $.sid = 777;
    $.users = [];
    $.activity = false;
    $.ready = false;
    $.socket_id = null;
    $.user_id = sessionStorage.chat_uid || new Date().getTime() + (Math.round(Math.random() * 10000));
    $.lastClient = sessionStorage.chat_client && JSON.parse(sessionStorage.chat_client) || {};
    $.client_id = null;
    $.timeOutTyped = null;
    $.typed_id = null;
    $.iScrollList = null;
    $.iScrollRoom = {};
    $.iScrollMetrika = {};
    $.socket = io.connect('http://5.101.124.21:8008', {
		reconnection: false
	});
    $.reconnectInterval = null;

    if (!sessionStorage.chat_uid) sessionStorage.chat_uid = $.user_id;

    this.on("mount", function(){

        setTimeout(function(){
            if (!$.socket.connected){
                $.reconnect();
                console.log('Chat: невозможно подключиться к серверу!');
            }
        }, 1000);

        $.socket.on('connect', function(){
            console.log('Chat: соединение установленно!');
            clearInterval($.reconnectInterval);
            $.reconnectInterval = null;
            $.ready = true;
            $.socket_id = this.id;
            $.socket.emit("join", {
                id: $.user_id,
                sid: $.sid,
                admin: true
            });
        });

        var $chat_list = $$($scope.children()[0]),
            $chat_body = $$($scope.children()[1]);

        $scope.find(".chat__list__close").on(clickEvent, function(){
            app.sections.nav("data-list");
            app.iScrollDataList.refresh();
        });

        $.openRoom = function(e){
            var $elem = $$(e.currentTarget),
                id = this._item.user.id;

            var $room = $$($["chat__room__" + id]);

            try {
                $elem.addClass("chat__list__item--active").siblings().removeClass("chat__list__item--active");
            } catch(e){}
            $room.addClass("section--show");
            $chat_list.addClass("section--hidden");

            $.client_id = id;
            $.scrollDown();

            app.utils.onEndAnimation($["chat__room__" + id], function(){
                $.activity = true;
                $room.addClass("section--active").removeClass("section--show");
                $.users.forEach(function(item, i) {
                    if ($.lastClient && $.lastClient.id !== id || !$.lastClient && item.id == id){
                        $.lastClient = {
                            id: item.id,
                            avatar: item.avatar,
                            online: item.online
                        };
                        sessionStorage.chat_client = JSON.stringify($.lastClient);
                        $.update();
                    }
                });
                $.viewedList();
            });
        };

        $chat_body.on(clickEvent, ".chat__room__close", function(){

            var $room = $$($["chat__room__" + $.client_id]);

            $room.addClass("section--hidden");
            $chat_list.removeClass("section--hidden");

            app.utils.onEndAnimation($["chat__room__" + $.client_id], function(){
                $.client_id = null;
                $.activity = false;
                $room.removeClass("section--active").removeClass("section--hidden");
                $.update();
            });
        });

        $scope.find(".chat__list__header__photo").on(clickEvent, function(){
            if ($.lastClient && $.lastClient.id) {
                var $metrika = $$($["chat__metrika__" + $.lastClient.id]);
                $metrika.addClass("section--show");
            }
        });

        $chat_body.on(clickEvent, ".chat__header__photo", function(){
            if ($.client_id) {
                var $metrika = $$($["chat__metrika__" + $.client_id]);
                $metrika.addClass("section--show");
            }
        });

        $scope.on(clickEvent, ".chat__metrika__close", function(){
            if ($.lastClient && $.lastClient.id) {
                var $metrika = $$($["chat__metrika__" + $.lastClient.id]);
                $metrika.removeClass("section--show");
            }
        });
    });

    $.socket.on("update_" + $.sid, function(data){
        if ($.ready) {

            $.users = data;
            $.typed_id = null;
            if ($.activity){
                $.users.forEach(function(item, i) {
                    if (item.id == $.client_id){
                        var j = item.messages.length - 1;
                        $.users[i].messages[j].new = true;
                    }
                });
            }
            $.update();
             if ($.client_id){
                if (!$.users.length){
                    $.client_id = null;
                    $.lastClient = null;
                    sessionStorage.chat_client = null;
                    $.update();
                }
                else {
                    $.iScrollRoom[$.client_id].refresh();
                    $.iScrollRoom[$.client_id].scrollTo(0, $.iScrollRoom[$.client_id].maxScrollY, 400, IScroll.utils.ease.cubicOut);
                }

            }

            else if (!$.client_id){
                if ($.users.length && $.lastClient) {
                    var avail = false;
                    $.users.forEach(function(item, i) {
                        if ($.lastClient.id === item.id) avail = true;
                    });
                    if (!avail){
                        $.lastClient = null;
                        sessionStorage.chat_client = null;
                        $.update();
                    }
                }
                else {
                    $.lastClient = null;
                    sessionStorage.chat_client = null;
                    $.update();
                }
            }
            $.scrollContent($.users);
            clearTimeout($.timeOutTyped);
            if ($.activity){
                app.utils.onEndAnimation($["chat__room__" + $.client_id].querySelector(".chat__message__new"), function(){
                    setTimeout(function(){
                        $.users.forEach(function(item, i) {
                            if (item.id == $.client_id){
                                var j = item.messages.length - 1;
                                $.users[i].messages[j].new = false;
                            }
                        });
                        $.update();
                    }, 300);
                });
            }
        }
    });

    $.socket.on("notify_" + $.sid, function(id){
        if ($.activity && $.client_id === id){
            $.viewedList();
        }
    });

    $.socket.on("update_offer" + $.sid, function(type){
        $.tags["chat-list-raw"].forEach(function(item, i) {
            if (item.message.type === type || item.message.type === "auth" && (type === "name" || type === "profile")){
                var text = item.message.text;
                item.root.innerHTML = text;
            }
        });
    });

    $.socket.on("typed_" + $.sid, function(id){
        if ($.ready && $.client_id === id) {
            clearTimeout($.timeOutTyped);
            $.typed_id = id;
            $.update();
            $.timeOutTyped = setTimeout(function(){
                $.typed_id = null;
                $.update();
            }, 5000);
        }
    });

    $.socket.on('disconnect', function() {
        $.reconnect();
        console.log('Chat: соединение потеряно!');
        $.users = [];
        $.update();
    });

    $.reconnect = function(){
        if ($.reconnectInterval) return;
        $.reconnectInterval = setInterval(function(){
            $.socket.connect();
        }, 500);
        console.log('Chat: запуск реконнекта!');
    };

    $.scrollContent = function(users){
        if (!$.iScrollList){
            $.iScrollList = new IScroll($["chat__list__scroll"], {
                scrollX: false,
                scrollY: true,
                mouseWheel: true
            });
        }
        users.forEach(function(item, i) {
            if (!$.iScrollRoom[item.id]){
                $.iScrollRoom[item.id] = new IScroll($["chat__room__scroll__" + item.id], {
            		scrollX: false,
            		scrollY: true,
                    mouseWheel: true
            	});
                $.iScrollRoom[item.id].scrollTo(0, $.iScrollRoom[item.id].maxScrollY);

                $.iScrollMetrika[item.id] = new IScroll($["chat__metrika__wrapper__" + item.id], {
            		scrollX: false,
            		scrollY: true,
                    mouseWheel: true
            	});

                (function animationLoopRoom(){
            		app.utils.raf(animationLoopRoom);
            		app.utils.getScroll($.iScrollRoom[item.id]);
            	})();

                (function animationLoopMetrika(){
            		app.utils.raf(animationLoopMetrika);
            		app.utils.getScroll($.iScrollMetrika[item.id]);
            	})();

                $["chat__room__scroll__" + item.id].addEventListener("touchstart", function(e){
                    $["chat__room__" + item.id].querySelector(".chat__panel__input").blur();
                });
            }
        });
    };

    $.scrollDown = function(slow){
        if (!$.client_id || !$.iScrollRoom[$.client_id]) return;
        $.iScrollRoom[$.client_id].refresh();
        $.iScrollRoom[$.client_id].scrollTo(0, $.iScrollRoom[$.client_id].maxScrollY);
    };

    $.focusInput = function(){
        setTimeout(function(){
            $.socket.emit("typed", $.client_id);
        }, app.device.isMobile ? 400 : 0);
    };

    $.sendMessage = function(e){
        e.preventDefault();
        e.stopPropagation();
        var text = this.chat__panel__input.value;
        if (text.length){
            this.chat__panel__input.value = "";
            this.chat__panel__input.blur();

            setTimeout(function(){
                $.socket.emit("send", {
                    id: $.client_id,
                    message: text
                });
            }, app.device.isMobile ? 400 : 0);
        }
    };

    $.changeOptions = function(e){
        var value = e.target.value;
        if (value === "1"){
            $.socket.emit("send", {
                id: $.client_id,
                type: "auth",
                message: "Предложение представиться"
            });
        }
        else if (value === "2"){
            $.socket.emit("send", {
                id: $.client_id,
                type: "phone",
                message: "Предложение оставить телефон"
            });
        }
        else if (value === "3"){
            $.socket.emit("send", {
                id: $.client_id,
                type: "email",
                message: "Предложение оставить email"
            });
        }
    };

    $.viewedList = function(){
        var avail = false;
        $.users.forEach(function(item, i) {
            if (item.id === $.client_id && $.users[i].newMessages > 0) {
                $.users[i].newMessages = 0;
                $.users[i].messages.forEach(function(message, j) {
                    message.viewed = true;
                });
                $.socket.emit("viewed", i);
                avail = true;
            }
        });
        if (avail) $.update();
    };

});

riot.tag2('dashboard-balance', '<div id="dashboard__balance__scroll" class="section__wrapper"> <div class="section__container"> <header class="header__black"> <div class="header__title">Ваш баланс</div> <div class="header__left"> <div onclickdelegate="{onClose}" class="alarm__list__close header__icon header__icon__back"></div> </div> <div class="header__right dashboard__balance__days"> 28 дн </div> </header> <div class="dashboard__screen"> <div class="dashboard__balance__label">остаток</div> <div id="dashboard__balance__big" class="dashboard__screen__circle"></div> </div> <div class="dashboard__balance__button">Пополнить баланс</div> <div class="dashboard__table"> <div class="dashboard__table__row"> <div class="c-gray">12 мар 2016</div> <div class="t-right"><strong>1 250,0 Р</strong></div> </div> <div class="dashboard__table__row"> <div class="c-gray">7 мар 2016</div> <div class="t-right"><strong>3 480,0 Р</strong></div> </div> <div class="dashboard__table__row"> <div class="c-gray">5 мар 2016</div> <div class="t-right"><strong>900,0 Р</strong></div> </div> </div> </div> </div>', '', 'class="section section__secondary section__header__nofixed"', function(opts) {

    var $ = this,
    $scope = $$($.root),
    $dashboardList = $.parent.tags["dashboard-list"];

    $.onClose = function(e){
        $dashboardList.closeSection("balance");
    };

    this.on("mount", function(){

        $scope.find("#dashboard__balance__big").circliful({
            foregroundColor: "#68f5ff",
            foregroundBorderWidth: 8.5,
            backgroundBorderWidth: 8.5,
            showPercent: false,
            percent: 88,
            textFamily: "roboto",
            textSize: "25px",
            target: "4 750,0"
        });

        $.iScrollList = new IScroll($["dashboard__balance__scroll"], {
            scrollX: false,
            scrollY: true
        });

        (function animationLoop(){
            app.utils.raf(animationLoop);
            app.utils.getScroll($.iScrollList);
        })();

    });

});

riot.tag2('dashboard-currency', '<div id="dashboard__currency__scroll" class="section__wrapper"> <div class="section__container"> <header class="header__black"> <div class="header__title">Курсы валют</div> <div class="header__left"> <div onclickdelegate="{onClose}" class="alarm__list__close header__icon header__icon__back"></div> </div> <div class="header__right"> <div class="header__icon UI__menu__circleV UI__menu__circle--white"><div class="UI__menu__circle__item"></div></div> </div> </header> <div class="dashboard__screen dashboard__screen--currency"> <div class="dashboard__screen__label">cегодня</div> <div class="dashboard__screen__label dashboard__screen__label--left">ЦБ РФ</div> <div class="dashboard__screen__currency dashboard__screen__currency--line"> <div class="dashboard__screen__currency__item dashboard__screen__currency__value">66,69 <span class="dashboard__screen__currency__rub">Р</span></div> <div class="dashboard__screen__currency__item dashboard__screen__currency__title">$</div> </div> <div class="dashboard__screen__currency"> <div class="dashboard__screen__currency__item dashboard__screen__currency__title">&euro;</div> <div class="dashboard__screen__currency__item dashboard__screen__currency__value">75,99 <span class="dashboard__screen__currency__rub">Р</span></div> </div> </div> <div class="dashboard__table"> <div class="dashboard__table__row"> <div class="c-gray">Австралийский доллар</div> <div class="t-right"><strong>50.726 Р</strong></div> </div> <div class="dashboard__table__row"> <div class="c-gray">Белорусский рубль</div> <div class="t-right"><strong>33.604 Р</strong></div> </div> <div class="dashboard__table__row"> <div class="c-gray">Венгерский форинт</div> <div class="t-right"><strong>24.500 Р</strong></div> </div> </div> </div> </div>', '', 'class="section section__secondary section__header__nofixed"', function(opts) {

    var $ = this,
    $scope = $$($.root),
    $dashboardList = $.parent.tags["dashboard-list"];

    $.onClose = function(e){
        $dashboardList.closeSection("currency");
    };

    this.on("mount", function(){

        $.iScrollList = new IScroll($["dashboard__currency__scroll"], {
            scrollX: false,
            scrollY: true
        });

        (function animationLoop(){
            app.utils.raf(animationLoop);
            app.utils.getScroll($.iScrollList);
        })();

    });

});

riot.tag2('dashboard-list', '<div id="dashboard__scroll" class="section__wrapper"> <div class="section__container section__container__dashboard"> <header class="header__dashboard"> <div class="header__title">Инфо-панель</div> <div class="header__left"> <div class="dashboard__openMenu header__icon UI__menu"><div class="UI__menu__item"></div></div> </div> <div class="header__right"> <div onclickdelegate="{openDataList}" class="dashboard__next__section header__icon header__icon__next__white"></div> </div> </header> <div onclickdelegate="{openBalance}" class="dashboard__tile dashboard__tile__balance"> <div class="dashboard__tile__label">пополнить</div> <div id="dashboard__balance" class="dashboard__circle"></div> <div class="dashboard__title"> <div class="dashboard__subtitle">Ваш баланс:</div> <div class="dashboard__balance">4 750,0 <span class="dashboard__balance__rub">Р</span></div> </div> </div> <div onclickdelegate="{openTraffic}" class="dashboard__tile dashboard__tile__traffic"> <div class="dashboard__tile__label">подробнее</div> <div id="dashboard__traffic__score" class="dashboard__circle"></div> <div class="dashboard__title">Входящие</div> </div> <div class="dashboard__tile"> <span id="dashboard__traffic__graph">5,3,9,6,5,9,7,3,5,2</span> </div> <div onclickdelegate="{openWeather}" class="dashboard__tile dashboard__tile__weather"> <div class="dashboard__tile__label">сегодня</div> <canvas id="partly-cloudy-night" class="dashboard__weather__canvas"></canvas> <div class="dashboard__weather"> <div class="dashboard__weather__temp">+6</div> <div class="dashboard__weather__text">Облачно, дождь</div> <div class="dashboard__weather__text">70% / 745 мм рт.с.</div> </div> </div> <div onclickdelegate="{openCurrency}" class="dashboard__tile dashboard__tile__currency"> <div class="dashboard__currency"> <div class="dashboard__currency__title">$</div> <div class="dashboard__currency__value">68,89</div> </div> <div class="dashboard__currency"> <div class="dashboard__currency__title">&euro;</div> <div class="dashboard__currency__value">78,27</div> </div> </div> </div> </div>', '', 'class="section section__primary"', function(opts) {

    var $ = this,
    $scope = $$($.root),
    $section = $$($.parent.root);

    $.openDataList = function(e){
        app.sections.nav("data-list");
    };

    $.openBalance = function(e){
        $.openSection("balance");
    };

    $.openTraffic = function(e){
        $.openSection("traffic");
    };

    $.openWeather = function(e){
        $.openSection("weather");
    };

    $.openCurrency = function(e){
        $.openSection("currency");
    };

    $.openSection = function(section){
        $.sections[section].section.addClass("section--show");
        $scope.addClass("section--hidden");

        app.utils.onEndAnimation($.sections[section].section[0], function(){
            $.sections[section].section.addClass("section--active").removeClass("section--show");
            $.sections[section].tag.iScrollList.refresh();

        });
    };

    $.closeSection = function(section){
        $.sections[section].section.addClass("section--hidden");
        $scope.removeClass("section--hidden");

        app.utils.onEndAnimation($.sections[section].section[0], function(){
            $.sections[section].section.removeClass("section--active").removeClass("section--hidden");

        });
    };

    this.on("mount", function(){

        $.sections = {
            balance: {
                tag: $.parent.tags["dashboard-balance"],
                section: $$($.parent.tags["dashboard-balance"].root)
            },
            traffic: {
                tag: $.parent.tags["dashboard-traffic"],
                section: $$($.parent.tags["dashboard-traffic"].root)
            },
            weather: {
                tag: $.parent.tags["dashboard-weather"],
                section: $$($.parent.tags["dashboard-weather"].root)
            },
            currency: {
                tag: $.parent.tags["dashboard-currency"],
                section: $$($.parent.tags["dashboard-currency"].root)
            }
        };

        $scope.find("#dashboard__balance").circliful({
            foregroundColor: "#68f5ff",
            backgroundColor: "#f0f4fb",
            textColor: "#333947",
            foregroundBorderWidth: 10,
            backgroundBorderWidth: 10,
            percent: 88
        });

        $scope.find("#dashboard__traffic__score").circliful({
            foregroundColor: "#fcde30",
            backgroundColor: "#f0f4fb",
            textColor: "#333947",
            foregroundBorderWidth: 10,
            backgroundBorderWidth: 10,
            textSize: "35px",
            showPercent: false,
            percent: 54,
            target: 12
        });

        $scope.find("#dashboard__traffic__graph").peity("bar", {
            fill: ["#839ae3", "#62e1d8"],
            width: "100%",
            height: "100px"
        });

        if (typeof Skycons !== 'undefined'){
            var skycons = new Skycons(
                {"color": "#839ae3"},
                {"resizeClear": true}
            );
            skycons.add("partly-cloudy-night", Skycons.PARTLY_CLOUDY_NIGHT);
            skycons.play();
        };

        $.iScrollList = new IScroll($["dashboard__scroll"], {
            scrollX: false,
            scrollY: true
        });

        (function animationLoop(){
            app.utils.raf(animationLoop);
            app.utils.getScroll($.iScrollList);
        })();

        app.iScrollDashboardList = $.iScrollList;

    });

});

riot.tag2('dashboard-section', '<dashboard-list></dashboard-list> <dashboard-balance></dashboard-balance> <dashboard-traffic></dashboard-traffic> <dashboard-weather></dashboard-weather> <dashboard-currency></dashboard-currency>', '', 'data-marquee="dashboard" class="section section__marquee section__header__nofixed"', function(opts) {
});

riot.tag2('dashboard-traffic', '<div id="dashboard__traffic__scroll" class="section__wrapper"> <div class="section__container"> <header class="header__black"> <div class="header__title">Статистика входящих</div> <div class="header__left"> <div onclickdelegate="{onClose}" class="alarm__list__close header__icon header__icon__back"></div> </div> <div class="header__right"> <div class="header__icon UI__menu__circleV UI__menu__circle--white"><div class="UI__menu__circle__item"></div></div> </div> </header> <div class="dashboard__screen"> <div class="dashboard__screen__label">cегодня</div> <span id="dashboard__traffic__big">5,3,9,6</span> </div> <div class="dashboard__table"> <div class="dashboard__table__row"> <div class="dashboard__table__title w-70p"><span class="dashboard__table__circle" style="background:#00d1fe"></span>Обратные звонки</div> <div class="w-15p t-center c-gray">12%</div> <div class="w-15p t-center"><strong>3</strong></div> </div> <div class="dashboard__table__row"> <div class="dashboard__table__title w-70p"><span class="dashboard__table__circle" style="background:#ffe02d"></span>Онлайн-чаты</div> <div class="w-15p t-center c-gray">24%</div> <div class="w-15p t-center"><strong>5</strong></div> </div> <div class="dashboard__table__row"> <div class="dashboard__table__title w-70p"><span class="dashboard__table__circle" style="background:#b77de9"></span>Сообщения</div> <div class="w-15p t-center c-gray">27%</div> <div class="w-15p t-center"><strong>6</strong></div> </div> <div class="dashboard__table__row"> <div class="dashboard__table__title w-70p"><span class="dashboard__table__circle" style="background:#ff9498"></span>Заявки</div> <div class="w-15p t-center c-gray">18%</div> <div class="w-15p t-center"><strong>4</strong></div> </div> </div> </div> </div>', '', 'class="section section__secondary section__header__nofixed"', function(opts) {

    var $ = this,
    $scope = $$($.root),
    $dashboardList = $.parent.tags["dashboard-list"];

    $.onClose = function(e){
        $dashboardList.closeSection("traffic");
    };

    this.on("mount", function(){

        $$($["dashboard__traffic__big"]).peity("donut", {

            fill: ["#00d1fe", "#ffe02d", "#b77de9", "#ff9498"],
            width: 176,
            height: 176
        });

        $.iScrollList = new IScroll($["dashboard__traffic__scroll"], {
            scrollX: false,
            scrollY: true
        });

        (function animationLoop(){
            app.utils.raf(animationLoop);
            app.utils.getScroll($.iScrollList);
        })();

    });

});

riot.tag2('dashboard-weather', '<div id="dashboard__weather__scroll" class="section__wrapper"> <div class="section__container"> <header class="header__black"> <div class="header__title">Прогноз погоды</div> <div class="header__left"> <div onclickdelegate="{onClose}" class="alarm__list__close header__icon header__icon__back"></div> </div> <div class="header__right"> <div class="header__icon UI__menu__circleV UI__menu__circle--white"><div class="UI__menu__circle__item"></div></div> </div> </header> <div class="dashboard__screen"> <div class="dashboard__screen__label">cегодня</div> <div class="dashboard__screen__label dashboard__screen__label--left">Москва</div> <div class="dashboard__screen__weather"> <div class="dashboard__screen__weather__description"> <div class="dashboard__screen__weather__temp">+21</div> <div class="dashboard__screen__weather__text">Облачно, дождь</div> <div class="dashboard__screen__weather__text">Влаж. 70%</div> <div class="dashboard__screen__weather__text">745 мм рт.ст.</div> </div> <div class="dashboard__screen__weather__svg"></div> </div> </div> <div class="dashboard__weather__week"> <div class="dashboard__weather__week__item"> <div class="dashboard__weather__week__title">09/4</div> <canvas id="dashboard__weather__week1" class="dashboard__weather__week__canvas"></canvas> <div class="dashboard__weather__week__temp">+19</div> </div> <div class="dashboard__weather__week__item"> <div class="dashboard__weather__week__title">10/4</div> <canvas id="dashboard__weather__week2" class="dashboard__weather__week__canvas"></canvas> <div class="dashboard__weather__week__temp">+16</div> </div> <div class="dashboard__weather__week__item"> <div class="dashboard__weather__week__title">11/4</div> <canvas id="dashboard__weather__week3" class="dashboard__weather__week__canvas"></canvas> <div class="dashboard__weather__week__temp">+8</div> </div> <div class="dashboard__weather__week__item"> <div class="dashboard__weather__week__title">12/4</div> <canvas id="dashboard__weather__week4" class="dashboard__weather__week__canvas"></canvas> <div class="dashboard__weather__week__temp">+10</div> </div> <div class="dashboard__weather__week__item"> <div class="dashboard__weather__week__title">13/4</div> <canvas id="dashboard__weather__week5" class="dashboard__weather__week__canvas"></canvas> <div class="dashboard__weather__week__temp">+18</div> </div> </div> </div> </div>', '', 'class="section section__secondary section__header__nofixed"', function(opts) {

    var $ = this,
    $scope = $$($.root),
    $dashboardList = $.parent.tags["dashboard-list"];

    $.onClose = function(e){
        $dashboardList.closeSection("weather");
    };

    this.on("mount", function(){

        var skyconsWeek = new Skycons(
            {"color": "#158ffe"},
            {"resizeClear": true}
        );
        skyconsWeek.add("dashboard__weather__week1", Skycons.CLEAR_DAY);
        skyconsWeek.add("dashboard__weather__week2", Skycons.CLEAR_DAY);
        skyconsWeek.add("dashboard__weather__week3", Skycons.PARTLY_CLOUDY_DAY);
        skyconsWeek.add("dashboard__weather__week4", Skycons.PARTLY_CLOUDY_NIGHT);
        skyconsWeek.add("dashboard__weather__week5", Skycons.CLOUDY);

        $.iScrollList = new IScroll($["dashboard__weather__scroll"], {
            scrollX: false,
            scrollY: true
        });

        (function animationLoop(){
            app.utils.raf(animationLoop);
            app.utils.getScroll($.iScrollList);
        })();

    });

});

riot.tag2('data-header', '<div onclickdelegate="{openMenu}" class="header__title">{headerTitle}</div> <div class="header__left"> <div class="header__icon UI__menu"><div class="UI__menu__item"></div></div> </div> <div class="header__right"> <div onclickdelegate="{openAlarm}" class="header__icon header__icon__alarm header__icon__alarm--active"> <div class="header__icon__alarm__counts">3</div> </div> <div class="header__icon UI__menu__circleV UI__menu__circle--white"><div class="UI__menu__circle__item"></div></div> </div> <div class="header__data__panel {header__data__panel--active : show}"> <div class="header__left"> <div onclickdelegateupdate="{onClear}" class="header__icon header__icon__back__white"></div> <div class="header__icon header__data__panel__count">{counts}</div> </div> <div class="header__right"> <div onclickdelegateupdate="{onViewed}" class="header__icon header__data__panel__viewed"></div> <div onclickdelegateupdate="{onImportant}" class="header__icon header__data__panel__important"></div> <div onclickdelegate="{onRemove}" class="header__icon header__data__panel__remove"></div> <div onclickdelegate="{onStatus}" class="header__icon header__data__panel__folder"></div> <div onclickdelegate="{onCheckAll}" class="header__icon UI__menu__circleV UI__menu__circle--white"><div class="UI__menu__circle__item"></div></div> </div> </div> <div class="data__list__loader"> <i class="data__list__loader__blank"></i> </div>', '', 'class="header header__data__list"', function(opts) {

    var $ = this,
    $scope = $$($.root),
    $alert = $root.tags["alert-window"],
    $popupSelect = $root.tags["popup-select"],
    $dataList = $.parent.tags["data-list"],
    $dataMenu = $.parent.tags["data-menu"],
    $dataListScope = $$($dataList.root);

    $.headerTitle = "Входящие";

    this.on("mount", function(){
        $.loader();
    });

    $.openMenu = function(){
        $dataMenu.show();
    };

    $.onClear = function(update){
        $dataList.unChecked();
        $.show = false;
        $.counts = 0;
        if (update) $.update();
    };

    $.onViewed = function(){
        $fetch('data/list/viewed', "put", _.pluck($dataList.data.get('isChecked'), "_id"));
        $dataList.data.get('isChecked', function(item) {
            item.new = false;
        });
        $.onClear();
    };

    $.onImportant = function(){
        $dataList.data.get('isChecked', function(item){
            if (item.important) item.important = false;
            else item.important = true;
        });
        $.onClear();
    };

    $.onRemove = function(){
        $alert.show({
            title: "Удалить выбранные?",
            success: {
                callback: function(){
                    $dataList.data.get('isChecked', function(item){
                        item.remove = true;
                    });
                    $.onClear(true);
                    app.utils.onEndTransition($dataListScope.find(".data__list__item--remove:first")[0], function(){
                        var items = $dataList.data._data.items;
                        for (var i = 0; i < items.length; i++){
                            if (items[i].remove){
                                items.splice(i, 1);
                                i--;
                            }
                        }
                        $dataList.update();
                        $dataList.iScrollList.refresh();
                    });
                }
            }
        });
    };

    $.onStatus = function(){
        $popupSelect.show({
            type: "status",
            data: $dataList.data.get('status'),
            callback: function(value){
                $dataList.data.get('isChecked', function(item){
                    item.status = value;
                });
                $.onClear(true);
            }
        });
    };

    $.onCheckAll = function(){
        var counts = 0;
        $dataList.data.get('items', function(item){
            item.checked = true;
            counts++;
        });
        $.counts = counts;
        $.update();
        $dataList.update();
    };

    if ($root.tags["alarm-section"]){

        var $alarm_section = $$($root.tags["alarm-section"].root);

        $.openAlarm = function(){
            $alarm_section.addClass("section--show");
        };
    }

    $.loader = function(){

        if ($.loader.app) {
            $.loader.app.start();
            return;
        }

        var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

        var Loader = function(){
            this.addBanner = bind(this.addBanner, this);
        };

        Loader.prototype.loaded = 0;

        Loader.prototype.loop = 0;

        Loader.prototype.total = 80;

        Loader.prototype.lastPicked = ["blank", "blank", "blank"];

        Loader.prototype.colors = ["red", "green", "blue", "yellow", "purple"];

        Loader.prototype.end = true;

        Loader.prototype.init = function() {
            this.getElements();
        };

        Loader.prototype.start = function() {
            if (!this.end) return;

            var self = this;
            this.loaded = 0;
            this.loadSim = null;
            this.loadCheck = null;
            this.end = false;
            this.loop++;
            this.addListeners();

            setTimeout(function(){

                self.el.setAttribute("class", "data__list__loader data__list__loader--active");
            }, 350);
        };

        Loader.prototype.getElements = function() {
            return this.el = document.getElementsByClassName("data__list__loader")[0];
        };

        Loader.prototype.addListeners = function() {
            var self = this;
            this.animationLoop = function(){
                self.loadSim = setInterval((function(_this) {
                    return function() {
                        return _this.loaded += 1 + Math.floor(Math.random() * 4);
                    };
                })(self), 200);
                self.loadCheck = setInterval((function(_this) {
                    return function() {
                        if (_this.loaded < _this.total) {
                            return _this.addBanner();
                        } else {
                            if (_this.loadSim){
                                setTimeout(function(){

                                    self.el.setAttribute("class", "data__list__loader");
                                    self.end = true;
                                }, 1500);
                            }
                            clearInterval(_this.loadSim);
                            _this.loadSim = null;
                            return clearInterval(_this.loadCheck);
                        }
                    };
                })(self), 200);
            };
            if (this.loop < 2) app.utils.raf(this.animationLoop);
            this.animationLoop();
        };

        Loader.prototype.addBanner = function() {
            var banner, color, results;
            banner = document.createElement("i");
            color = this.lastPicked[0];
            while (this.lastPicked.indexOf(color) !== -1) {
                color = this.colors[Math.floor(Math.random() * this.colors.length)];
            }
            this.lastPicked.unshift(color);
            this.lastPicked.pop();
            banner.setAttribute("class", "data__list__loader__" + color);
            this.el.insertBefore(banner, this.el.children[0]);
            results = [];
            while (this.el.children.length > 12) {
                results.push(this.el.removeChild(this.el.children[12]));
            }
            return results;
        };

        $.loader.app = new Loader();

        $.loader.app.init();
    };

});

riot.tag2('data-list', '<div class="section__container section__container__data__list"> <div each="{item in data.get(\'items\')}" no-reorder class="data__list__item data__list__status--{getStatusColor(item.status)} {data__list__item--new : item.new} {data__list__item--checked : item.checked} {data__list__item--important : item.important} {data__list__item--remove : item.remove} {data__list__item--animation : item.animation}"> <div if="{item.alarm}" class="data__list__alarm"></div> <div class="data__list__date">{getDate(item.date)}</div> <div onclickdelegateupdate="{onChecked}" class="data__list__photo"> <div if="{item.type !== ⁗profile⁗}" class="data__list__photo__item data__list__icon data__list__icon--{item.type}"></div> <div if="{item.type === ⁗profile⁗}" class="data__list__photo__item"> <div class="data__list__photo__image" riot-style="background-image:url({item.image})"></div> </div> </div> <div class="data__list__textarea"> <div class="data__list__title"> <span class="data__list__name"> <virtual if="{item.type === ⁗order⁗}">#заявка,</virtual> <virtual if="{item.type === ⁗chat⁗}">#онлайн-чат,</virtual> <virtual if="{item.type === ⁗callback⁗}">#звонок,</virtual> <virtual if="{item.type === ⁗feedback⁗}">#письмо,</virtual> <virtual if="{item.type === ⁗profile⁗}">#профиль,</virtual> </span> {item.title} </div> <div class="data__list__text"> <virtual if="{item.type !== ⁗callback⁗}">{item.text}</virtual> <span if="{item.type === ⁗callback⁗}" class="data__list__strong">{item.text}</span> </div> </div> <div onclickdelegate="{selectStatus}" class="data__list__options"><div class="data__list__options__item"></div></div> </div> </div> <div onclickdelegate="{openChat}" class="chat__circle__button"> <div class="chat__circle__button__messages chat__circle__button__messages--active">4</div> </div>', '', 'class="section__wrapper"', function(opts) {

    var $ = this,
    $scope = $$($.root),
    $popupSelect = $root.tags["popup-select"];

    $.data = new Baobab({
        items: [],
        status: [],
        isChecked: Baobab.monkey(
            ['items'],
            function(data) {
              return data.filter(function(item) {
                return item.checked === true;
              });
            }
        )
    },
    {
        autoCommit: false,
        asynchronous: true,
        immutable: false,
        lazyMonkeys: false,
        persistent: false,
        pure: true
    });

    this.on("mount", function(){

            $fetch('data/list/init', "get").then(function(data){
                $.data.set('items', data.list);
                $.data.set('status', data.status);
                $.update();

                $.iScrollList.refresh();
            });

        $.panel = $.parent.tags["data-header"];

        $.iScrollList = new IScroll($scope[0], {
            scrollX: false,
            scrollY: true
        });

        (function animationLoop(){
            app.utils.raf(animationLoop);
            var scroll = app.utils.getScroll($.iScrollList);

            if (!$.panel.show){
                if (scroll.y < -80){
                    $.panel.loader();
                }
                else if (scroll.y > 0 && (scroll.maxY - scroll.y) < 40){

                }
            }
        })();

        app.iScrollDataList = $.iScrollList;
    });

    $.getDate = function(date){
        var days = tempus().between(tempus(date), 'day');
        if (days > 0) return tempus(date).format('%H:%M');
        else if (days === -1) return "вчера";
        else {
            return tempus(date).format('%d %b');
        }
    };

    $.getStatusColor = function(id){
        return $.data.get('status', {'_id': id}, 'color');
    };

    $.onChecked = function(){
        if (this.item.checked) {
            this.item.checked = false;
            $.data.select('items', {'_id': this.item._id}).set("checked", false);
        }
        else {
            this.item.checked = true;
            $.data.select('items', {'_id': this.item._id}).set("checked", true);
        }

        var counts = $.data.get('isChecked').length;

        if (counts) $.panel.show = true;
        else $.panel.show = false;

        $.panel.counts = counts;
        $.panel.update();
    };

    $.unChecked = function(){
        $.data.get('isChecked', function(item) {
            item.checked = false;
        });
        $.update();
    };

    $.selectStatus = function(){
        var _this = this,
            id = this.item._id;

        $popupSelect.show({
            type: "status",
            icon: {
                type: this.item.type,
                image: this.item.image
            },
            data: $.data.get('status'),
            value: this.item.status,
            callback: function(value){
                $.data.select('items', {'_id': id}).set("status", value);
                _this.update();
            }
        });
    };

    $.openChat = function(){
        app.sections.nav("chat");
    };

});

riot.tag2('data-menu', '<div onclickdelegateupdateall="{onSelect}" each="{items}" no-reorder class="data__menu__item {data__menu__item--active : name == value}"> <span class="data__menu__item__icon data__menu__item--{name}">{subtitle}</span> </div>', '', 'class="data__menu {data__menu--active : active}"', function(opts) {

    var $ = this,
    $scope = $$($.root),
    $dataHeader = $.parent.tags["data-header"];

    $.active = false;

    $.value = "inbox";

    $.items = [
        {
            title: "Звонки",
            subtitle: "Звонки c сайта",
            name: "callback"
        },
        {
            title: "Письма",
            subtitle: "Все письма",
            name: "feedback"
        },
        {
            title: "Онлайн-чаты",
            subtitle: "Онлайн-чаты",
            name: "chat"
        },
        {
            title: "Заявки",
            subtitle: "Все заявки",
            name: "order"
        },
        {
            title: "Входящие",
            subtitle: "Все входящие",
            name: "inbox"
        }
    ];

    $.show = function(){
        $.active = true;
        $.update();
    };

    $.onSelect = function(){
        $.value = this.name;
        $.active = false;
        $dataHeader.headerTitle = this.title;
        $dataHeader.update();
    };

});

riot.tag2('data-section', '<data-header></data-header> <data-list></data-list> <data-menu></data-menu>', '', 'data-marquee="data" class="section section__marquee section__data__list"', function(opts) {
});

riot.tag2('login-section', '<div class="login__section__logo"></div> <div class="login__section__form"> <div class="login__section__item login__section__item--login"> <div class="login__section__item__title">логин</div> <div class="login__section__item__circle login__section__item__circle--login"></div> <input class="login__section__input" name="login" type="text" placeholder="логин" spellcheck="false" autocomplete="off"> </div> <div class="login__section__item login__section__item--pass"> <div class="login__section__item__circle login__section__item__circle--pass"></div> <div class="login__section__item__title">пароль</div> <input class="login__section__input" name="password" type="text" placeholder="пароль" spellcheck="false" autocomplete="off"> </div> </div> <div class="login__section__footer"> <div class="login__section__button">Войти</div> </div>', '', 'class="login__section"', function(opts) {

    var $ = this,
    $scope = $$($.root);

    this.on("mount", function(){

        $scope.find(".login__section__item__circle").on("click", function(){
            $scope.addClass("login__section--input");
            $scope.find(".login__section__input[name=login]").focus();
        });

        $scope.find(".login__section__input").on("focus blur", function(e){
            if (e.type === "focus"){
                $scope.addClass("login__section--focus");
            }
            else if (e.type === "blur"){
                $scope.removeClass("login__section--focus");
            }
        });

        $scope.find(".login__section__button").on("click", function(e){
            $scope.addClass("login__section--loading");
            setTimeout(function(){
                $scope.addClass("login__section--enter");
            }, 1500);
        });

    });

});

riot.tag2('popup-select', '<div class="popup__select__wrapper"> <div if="{type === ⁗status⁗}" class="popup__select__container"> <div onclickdelegateupdateall="{onSelect}" each="{items}" no-reorder class="popup__select__item {popup__select__item--active : _id == value}"> <div class="popup__select__status__color popup__select__status__{color}"> <span class="popup__select__item__title">{title}</span> </div> </div> </div> <div if="{type === ⁗status⁗ && icon.type}" class="popup__select__status__icon"> <div if="{icon.type !== ⁗profile⁗}" class="popup__select__status__icon__item popup__select__status__icon__item--{icon.type}"></div> <div if="{icon.type === ⁗profile⁗}" class="popup__select__status__icon__item" riot-style="background-image:url({icon.image})"></div> </div> <div if="{!type}" class="popup__select__container"> <div onclickdelegateupdateall="{onSelect}" each="{items}" no-reorder class="popup__select__item"> <span class="popup__select__item__title">{title}</span> </div> </div> </div>', '', 'class="popup__select {popup__select--active : active}"', function(opts) {

    var $ = this,
    $scope = $$($.root);

    $.active = false;

    $.items = {};

    $.show = function(data){
        if (data){
            $.type = data.type;
            $.icon = data.icon;
            $.items = data.data;
            $.value = data.value;
            $.callback = data.callback;
            $.active = true;
            $.update();
        }
    };

    $.onSelect = function(){
        var id = this._id;
        $.value = id;
        $.active = false;
        if ($.callback) $.callback(id);
    };

    this.on("mount", function(){

        $scope.on(clickEvent, function(e){
            if (e.target.getAttribute("class") && e.target.getAttribute("class").match(/popup__select--active/)){
                $.active = false;
                $.update();
            }
        });

    });

});

riot.tag2('root-section', '<section id="sections"> <dashboard-section></dashboard-section> <data-section></data-section> </section> <popup-select></popup-select> <alert-window></alert-window> <alarm-section></alarm-section>', '', 'id="root"', function(opts) {

    $root = this;

    this.on("mount", function(){
        app.sections.init("data");
    });

});
