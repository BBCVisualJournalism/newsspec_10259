define(['lib/news_special/bootstrap', 'options'], function (news, options) {


    var Filters = function () {
        this._activeFilter = options.filters.defaultActiveTab;
        this._filterList = {};
        this._totalProfiles = 0;
    };

    Filters.prototype = {
        init: function () {
            news.$(options.filters.parentNodeEl).show();
            news.pubsub.on(options.filters.toggleTabFilter, this.showFilter.bind(this));
            news.pubsub.on(options.filters.applyFilter, this.applyFilter.bind(this));
            this.setActiveFilter(this._activeFilter);
            this.setupFilterCounter();
        },

        isMobileView: function () {
            return news.$(window).width() <= options.mobileMaxWidth;
        },

        showFilter: function (activeFilterNode) {
            var i,
                activeFilterName = activeFilterNode.attr('href');

            activeFilterNode.addClass(options.filters.tabActiveClassName)
                .siblings()
                .removeClass(options.filters.tabActiveClassName);

            this.setActiveFilter(activeFilterName);
            news.pubsub.emit('istats', ['tab-' + activeFilterName, 'newsspec-interaction', true]);

            news.pubsub.emit(options.facewall.hideFace);

            if (this._filterList.hasOwnProperty(this._activeFilter) && this._filterList[this._activeFilter].length > 0) {
                for (i in this._filterList[this._activeFilter]) {
                    news.pubsub.emit(options.facewall.displayFace, [this._filterList[this._activeFilter][i]]);
                }
            } else {
                news.pubsub.emit(options.facewall.displayFace);
            }
            this.updateCounter();
        },

        setActiveFilter: function (filter) {
            this._activeFilter = filter;
            if (!this._filterList.hasOwnProperty(filter)) {
                this._filterList[filter] = [];
            }

            news.$(options.filters.filtersControlClassBase + filter)
                .addClass(options.filters.filterControlActiveClassName)
                .siblings()
                .removeClass(options.filters.filterControlActiveClassName);
        },

        applyFilter: function (filterValue) {
            if (news.$(options.filters.filterOptionBaseClass + filterValue).prop('checked')) {
                this.addToFilterList(filterValue);
            } else {
                this.removeFromFilterList(filterValue);
            }
            this.updateCounter();
            this.displayFirstProfile();

            news.pubsub.emit('istats', ['filter-' + filterValue, 'newsspec-interaction', true]);
        },

        addToFilterList: function (filterValue) {
            this._filterList[this._activeFilter].push(filterValue);
            if (this._filterList[this._activeFilter].length === 1) {
                news.pubsub.emit(options.facewall.hideFace);
            }
            news.pubsub.emit(options.facewall.displayFace, [filterValue]);
        },

        removeFromFilterList: function (filterValue) {
            this._filterList[this._activeFilter].splice(this._filterList[this._activeFilter].indexOf(filterValue), 1);

            if (this._filterList[this._activeFilter].length === 0) {
                news.pubsub.emit(options.facewall.displayFace);
            } else {
                news.pubsub.emit(options.facewall.hideFace, [filterValue]);
            }
        },

        setupFilterCounter: function () {
            var totalProfilesArray = new Array(news.$(options.facewall.faceItemClass).length + 1);
            this._totalProfiles = totalProfilesArray.length - 1;
            news.$('.ns_facewall__indicator').prepend(totalProfilesArray.join('<li class="ns__count_item ns__count_item--active"></li>'));
            news.$(options.facewall.introCount).text(this._totalProfiles);
        },

        displayFirstProfile: function () {
            if (this.isMobileView()) { return; }
            var activeProfiles = news.$('.' + options.facewall.faceFilterClass);
            news.pubsub.emit(options.facewall.displayPenPortrait, [news.$(activeProfiles[0].firstChild)]);
        },

        updateCounter: function () {
            var filteredCount = news.$('.' + options.facewall.faceFilterClass).length;

            if (filteredCount === 0 && this._filterList.hasOwnProperty(this._activeFilter) && this._filterList[this._activeFilter].length === 0) {
                filteredCount = news.$(options.facewall.faceItemClass).length;
            }
            news.$('.ns__count_item').removeClass('ns__count_item--active');
            news.$('.ns__count_item').slice(0, filteredCount).addClass('ns__count_item--active');
            news.$('.ns_facewall__counter').text(filteredCount + '/' + this._totalProfiles);
        }
    };

    return Filters;
});