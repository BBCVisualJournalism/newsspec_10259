define(['lib/news_special/bootstrap', 'options'], function (news, options) {

    var PenPortrait = function () {
        this.penportraitInitialised = false;
        this.currentFacewall = null;

        this.iframeOffset = {
            top: 0,
            left: 0
        };
        this.listOffset = {
            top: 0,
            left: 0
        };

        this.init();
    };

    PenPortrait.prototype = {
        init: function () {
            var self = this;

            news.pubsub.on(options.facewall.displayPenPortrait, self.displayPenPortrait.bind(self));
            news.pubsub.on('facewall:hide:cta', self.hidePenPortrait.bind(self));
            news.pubsub.on('resize', function () {
                self.handleResize();
            });

            self.setIframeOffset();
            self.setListOffset();

            if (self.isMobileView()) {
                self.disableAutomaticRepositioning();
            } else {
                self.enableAutomaticRepositioning();
            }

            self.showPortrait(news.$(options.facewall.portraitsSelector).first());
        },

        displayPenPortrait: function (thumbNode) {
            var activeId = thumbNode.attr('href');
            this.showPortrait(news.$(activeId));

            if (news.$(options.facewall.penPortraitContainer).css('display') === 'none') {
                news.$(options.facewall.mobileToggleSelector).addClass(options.facewall.mobileToggleClassName);
                news.$(options.facewall.penPortraitContainer).addClass(options.facewall.penPortraitContainerNarrowClassName);

                news.pubsub.emit(options.facewall.enableStickyCTA);

                this.scrollToFacewallTop(thumbNode);
            }

            if (!this.isMobileView()) {
                this.setPortraitPos();
            }
        },

        showPortrait: function (node) {
            node.addClass(options.facewall.portraitsVisibleClass)
                .siblings().removeClass(options.facewall.portraitsVisibleClass);
        },

        hidePenPortrait: function () {
            news.$(options.facewall.penPortraitContainer).removeClass(options.facewall.penPortraitContainerNarrowClassName);
            news.$(options.facewall.mobileToggleSelector).removeClass(options.facewall.mobileToggleClassName);
            news.pubsub.emit(options.facewall.windowScrollTo, [0, 100, true, this.currentFacewall]);
        },

        scrollToFacewallTop: function (thumbNode) {
            var scrollPositionToSend = news.$(thumbNode.attr('href')).offset().top - 30;
            news.pubsub.emit(options.facewall.windowScrollTo, [scrollPositionToSend, 200, false]);

            this.currentFacewall = thumbNode.closest('.ns_facewall').attr('data');
        },

        setIframeOffset: function () {
            var iframeUrl = window.location.href.split('?')[0];
            var iframeCategory = iframeUrl.match('english/(.*).html')[1];
            try {
                this.iframeOffset = news.$(window.parent.document).find('#ns_facewall__' + iframeCategory + ' .responsive-iframe').offset();
            } catch (e) {
                this.iframeOffset.top = 0;
                this.iframeOffset.left = 0;
            }
        },

        setListOffset: function () {
            this.listOffset = news.$(options.facewall.facewallList).offset();
        },

        isMobileView: function () {
            return news.$(window).width() <= 500;
        },

        calcPortraitPos: function (myScrollTop) {
            var listHeight = news.$(options.facewall.facewallList).outerHeight();
            var panelHeight = news.$(options.facewall.penPortraitContainer).outerHeight();
            var scrollBreakPoint = (listHeight + this.iframeOffset.top + this.listOffset.top) - panelHeight;
            var maxScrollPos = listHeight - panelHeight;
            var optimumScrollPos = myScrollTop;

            if (myScrollTop > this.iframeOffset.top + this.listOffset.top) {
                optimumScrollPos = myScrollTop - (this.iframeOffset.top + this.listOffset.top);
            } else {
                optimumScrollPos = 0;
            }

            if (listHeight < panelHeight) {
                maxScrollPos = 0;
            }

            if (myScrollTop >= scrollBreakPoint) {
                return maxScrollPos;
            } else {
                return optimumScrollPos;
            }
        },

        setPortraitPos: function () {
            var self = this;
            news.$(options.facewall.penPortraitContainer)
                .stop()
                .css('margin-top', self.calcPortraitPos(news.$(window.parent, window.parent.document).scrollTop()) + 'px');
        },

        enableAutomaticRepositioning: function () {
            var self = this;

            news.$(window.parent.document, window.parent.document).ready(function () {
                news.$(window.parent, window.parent.document).scroll(function () {
                    self.setPortraitPos();
                });
            });
        },

        disableAutomaticRepositioning: function () {
            news.$(options.facewall.penPortraitContainer).css('margin-top', 0);
            news.$(window.parent, window.parent.document).unbind('scroll');
        },

        handleResize: function () {
            var self = this;

            self.setIframeOffset();
            self.setListOffset();

            if (self.isMobileView()) {
                self.disableAutomaticRepositioning();
            } else {
                self.enableAutomaticRepositioning();
                self.setPortraitPos();
            }
        }
    };

    return PenPortrait;
});