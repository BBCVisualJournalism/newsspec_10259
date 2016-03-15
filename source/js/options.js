define({
    mobileMaxWidth: 500,
    filters: {
        toggleTabFilter: 'toggle:filter',
        tabs: '.ns_filter__toggle',
        tabActiveClassName: 'ns_filter__toggle--active',
        parentNodeEl: '.ns_facewall__filters',
        defaultActiveTab: 'age',
        filtersControlClassBase: '.ns_filter__control--',
        filterControlActiveClassName: 'ns_filter__control--active',
        filterOptionBaseClass: '.ns_facewall__input--',
        filterClassName: '.ns_facewall__input',
        applyFilter: 'apply:filter',
        hideFiltersClass: 'ns_facewall__filters--hidden'
    },
    facewall: {
        facewallList: '.ns_facewall__list',
        faceItemClass: '.ns_facewall__item',
        faceFilterClass: 'ns_facewall__item--filtered',
        faceItemBaseClass: '.ns_facewall__item--',
        displayFace: 'facewall:showface',
        hideFace: 'facewall:hideface',
        hideFaceIfFiltered: 'facewall:hideface:unhover',
        showFaceIfFiltered: 'facewall:showface:hover',
        mouseOverFilterClass: 'ns_facewall__item--hover',
        thumbnailCTAClass: '.ns_facewall__thumb',
        penPortraitContainer: '.ns_facewall__panel',
        penPortraitContainerNarrowClassName: 'ns_facewall__panel--narrow',
        displayPenPortrait: 'facewall:show-pen-portrait',
        penpotraitTooltipClass: '.ns_facewall__tooltip',
        backtofacewall: 'facewall:back-to-facewall',
        hideFacewallClass: 'ns_facewall__list--hidden',
        portraitsSelector: '.ns_facewall__portrait',
        portraitsVisibleClass: 'ns_facewall__portrait--active',
        tooltipClass: '.ns_facewall__tooltip',
        activateTooltipClassName: 'ns_facewall__tooltip--active',
        leftAlignTooltip: 'ns_facewall__tooltip--left',
        rightAlignTooltip: 'ns_facewall__tooltip--right',
        introCount: '.ns_intro__count',
        mobileToggleSelector: '.ns_mob_toggle',
        mobileToggleClassName: 'ns_mob_toggle--hide',
        windowScrollTo: 'window:scrollTo',
        enableStickyCTA: 'facewall:show:cta'

    },
    cta: {
        backToFacewall: '.cta__back_to_facewall',
        backToFacewallActive: 'cta__back_to_facewall--active'
    },

    bespoke: {
        // add all bespoke hooks
    }
});