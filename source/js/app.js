define(['lib/news_special/bootstrap', 'lib/news_special/share_tools/controller', 'facewall'], function (news, shareTools, facewall) {

    
    facewall.init();

    shareTools.init('.tempShareToolsHolder', {
        storyPageUrl: document.referrer,
        header:       'Share this page',
        message:      'Custom message',
        hashtag:      'BBCNewsGraphics',
        template:     'dropdown' // 'default' or 'dropdown'
    });

    news.sendMessageToremoveLoadingImage();

});