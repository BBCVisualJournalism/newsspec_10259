define(['lib/news_special/bootstrap', 'filters', 'options', 'pen_portrait', 'tooltip'], function (news, Filters, options, PenPortrait, Tooltip) {


    if (typeof Function.prototype.bind !== 'function') {
        Function.prototype.bind = function (context) {
            var slice = Array.prototype.slice;
            var fn = this;

            return function () {
                var args = slice.call(arguments, 1);

                if (args.length) {
                    return arguments.length ? fn.apply(context, args.concat(slice.call(arguments))) : fn.apply(context, args);
                } else {
                    return arguments.length ? fn.apply(context, arguments) : fn.call(context);
                }
            };
        };
    }
    //ref: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (searchElement, fromIndex) {
            var k;
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }
            var O = Object(this);
            var len = O.length >>> 0;
            if (len === 0) {
                return -1;
            }
            var n = +fromIndex || 0;
            if (Math.abs(n) === Infinity) {
                n = 0;
            }
            if (n >= len) {
                return -1;
            }
            k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
            while (k < len) {
                if (k in O && O[k] === searchElement) {
                    return k;
                }
                k++;
            }
            return -1;
        };
    }

    var Facewall = function () {
        this.filtersNode = news.$('.ns_facewall__filters');
    };

    Facewall.prototype = {
        init: function () {
            var filters = new Filters();
            var penPortrait = new PenPortrait();
            var tooltip = new Tooltip();

            filters.init();
            penPortrait.init();
            tooltip.init();

            this.setEvents();
            news.$(options.filters.tabs).first().trigger('click');
        },

        setEvents: function () {

            news.pubsub.on(options.facewall.displayFace, this.showFace.bind(this));
            news.pubsub.on(options.facewall.hideFace, this.hideFace.bind(this));
            news.pubsub.on(options.facewall.updateCounter, this.updateCounter.bind(this));

            news.pubsub.on(options.facewall.hideFaceIfFiltered, this.hideFaceIfFiltered.bind(this));
            news.pubsub.on(options.facewall.showFaceIfFiltered, this.showFaceIfFiltered.bind(this));

            news.$(options.filters.tabs).on('click', function (ev) {
                ev.preventDefault();
                news.pubsub.emit(options.filters.toggleTabFilter, [news.$(this)]);
            });

            news.$(options.filters.filterClassName).on('click', function (ev) {
                news.pubsub.emit(options.filters.applyFilter, [news.$(this).val()]);
            });

            news.$(options.facewall.thumbnailCTAClass).on('click', function (ev) {
                ev.preventDefault();
                
                news.pubsub.emit(options.facewall.displayPenPortrait, [news.$(this)]);
                news.pubsub.emit('istats', ['portrait-clicked', 'newsspec-interaction', true]);
            });

            if (news.$(options.facewall.penPortraitContainer).css('display') !== 'none') {
                news.$(options.facewall.thumbnailCTAClass).on('mouseover', function (ev) {
                    ev.preventDefault();

                    news.pubsub.emit(options.facewall.showFaceIfFiltered, [news.$(this)]);
                });

                news.$(options.facewall.thumbnailCTAClass).on('mouseout', function (ev) {
                    ev.preventDefault();
                    news.pubsub.emit(options.facewall.hideFaceIfFiltered, [news.$(this)]);
                });
            }

            news.$(options.cta.backToFacewall).on('click', function (ev) {
                ev.preventDefault();
                news.pubsub.emit(options.facewall.backtofacewall);
            });

            news.$(window).resize(function () {
                news.pubsub.emit('resize');
            });
        },

        showFace: function (classNameSuffix) {
            if (classNameSuffix) {
                news.$(options.facewall.faceItemBaseClass + classNameSuffix).addClass(options.facewall.faceFilterClass);
                return;
            }
            news.$(options.facewall.faceItemClass).addClass(options.facewall.faceFilterClass);
        },

        showFaceIfFiltered: function (node) {
            node.parent().addClass(options.facewall.mouseOverFilterClass);
        },

        hideFace: function (classNameSuffix) {
            if (classNameSuffix) {
                news.$(options.facewall.faceItemBaseClass + classNameSuffix).removeClass(options.facewall.faceFilterClass);
                return;
            }

            news.$(options.facewall.faceItemClass).removeClass(options.facewall.faceFilterClass);
        },

        hideFaceIfFiltered: function (node) {
            node.parent().removeClass(options.facewall.mouseOverFilterClass);
        },

        updateCounter: function () {
            news.$('.ns_facewall__counter').text(news.$(options.facewall.faceFilterClass).length + ' / 40');
        }
    };

    return new Facewall();
});