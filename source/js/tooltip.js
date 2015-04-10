define(['lib/news_special/bootstrap', 'options'], function (news, options) {

    var Tooltip = function () {
    };

    Tooltip.prototype = {
        init: function () {
            news.pubsub.on(options.facewall.hideFaceIfFiltered, this.hideTooltip.bind(this));
            news.pubsub.on(options.facewall.showFaceIfFiltered, this.showTooltip.bind(this));
        },

        showTooltip: function (node) {
            var tooltip = node.parent().find(options.facewall.tooltipClass);
            tooltip.addClass(options.facewall.activateTooltipClassName);

            this.repositionTooltip(tooltip);
        },

        hideTooltip: function (node) {
            node.parent().find(options.facewall.tooltipClass)
                .removeClass(options.facewall.activateTooltipClassName)
                .removeClass(options.facewall.rightAlignTooltip)
                .removeClass(options.facewall.leftAlignTooltip);
        },

        repositionTooltip: function (tooltip) {
            if (this.rightAlignTooltip(tooltip)) {
                tooltip.addClass(options.facewall.rightAlignTooltip);
            } else {
                tooltip.addClass(options.facewall.leftAlignTooltip);
            }
        },

        rightAlignTooltip: function (tooltip) {
            return (news.$(options.facewall.facewallList).width() - tooltip.offset().left) < (tooltip.width() - parseFloat(tooltip.parent().css('margin-right')));
        }
    };

    return Tooltip;
});