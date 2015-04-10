define(['lib/news_special/bootstrap', 'options'], function (news, options) {

    var PenPortrait = function () {
        this.penportraitInitialised = false;
        this.currentFacewall = null;
        this.init();
    };

    PenPortrait.prototype = {
        init: function () {
            news.pubsub.on(options.facewall.displayPenPortrait, this.displayPenPortrait.bind(this));
            news.pubsub.on('facewall:hide:cta', this.hidePenPortrait.bind(this));
            this.showPortrait(news.$(options.facewall.portraitsSelector).first());
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

        }
    };

    return PenPortrait;
});