define(['jquery'], function ($) {
    var hostCommunicator = {
        postMessageAvailable: (window.postMessage ? true : false),
        init: function () {
            var externalHostCommunicator = this;
            this.setHeight();
            this.startWatching();
            if (this.postMessageAvailable) {
                this.setupPostMessage();
            }
            $.on('istats', function (actionType, actionName, viewLabel) {
                externalHostCommunicator.setHeight();
                externalHostCommunicator.registerIstatsCall(actionType, actionName, viewLabel);
            });
            $.on('window:scrollTo', this.sendScrollToHost);
            $.on('facewall:show:cta', this.enableStickyCTA);
        },
        height: 0,
        registerIstatsCall: function (actionType, actionName, viewLabel) {
            var istatsData = {
                'actionType': actionType,
                'actionName': actionName,
                'viewLabel':  viewLabel
            };
            if (this.postMessageAvailable) {
                this.sendDataByPostMessage(istatsData);
            }
            else {
                window.istatsQueue.push(istatsData);
            }
        },
        setupPostMessage: function () {
            var self = this;
            window.setInterval(this.sendDataByPostMessage, 32);

            this.onEvent(window, 'message', function (message) {
                var data = self.getObjectNotationFromDataString(message.data);
                if (data) {
                    $.emit(data.ctahideEvent);
                }
            });

        },
        onEvent: function (domElement, eventName, callback, useCapture) {
            if (useCapture === undefined) {
                useCapture = false;
            }

            if (domElement.addEventListener) {
                domElement.addEventListener(eventName, callback, useCapture);
            } else {
                domElement.attachEvent('on' + eventName, callback);
            }
        },
        getObjectNotationFromDataString: function (data) {
            if (data.indexOf('::') > -1) {
                return JSON.parse(data.split('::')[1]);
            }
            return false;
        },
        sendDataByPostMessage: function (istatsData) {
            var talker_uid = window.location.pathname,
                message = {
                    height:           this.height,
                    hostPageCallback: hostCommunicator.hostPageCallback
                };
            if (istatsData) {
                message.istats = istatsData;
            }
            window.parent.postMessage(talker_uid + '::' + JSON.stringify(message), '*');
        },
        startWatching: function () {
            window.setInterval(this.setHeight, 32);
        },
        staticHeight: null,
        setStaticHeight: function (newStaticHeight) {
            this.staticHeight = newStaticHeight;
        },
        setHeight: function () {
            var heightValues = [this.staticHeight || 0];
            if ($('.main').length > 0) {
                heightValues.push($('.main')[0].scrollHeight);
            }
            this.height = Math.max.apply(Math, heightValues);
        },
        hostPageCallback: false,
        setHostPageInitialization: function (callback) {
            hostCommunicator.hostPageCallback = callback.toString();
        },
        sendMessageToremoveLoadingImage: function () {
            var message,
                funcToExecute,
                iframeUID = this.getValueFromQueryString('iframeUID');

            funcToExecute = '' +
                'var iframeDivContainer = document.getElementById("' + iframeUID + '--bbc-news-visual-journalism-loading-spinner");' +
                'if (iframeDivContainer) {' +
                '    iframeDivContainer.parentNode.removeChild(iframeDivContainer);' +
                '}';

            message = {
                'hostPageCallback' : funcToExecute
            };

            if (this.postMessageAvailable) {
                window.parent.postMessage(window.location.pathname + '::' + JSON.stringify(message), '*');
            }
        },
        getValueFromQueryString: function (name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
                results = regex.exec(location.search);
            return results == null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        },
        sendScrollToHost: function (scrollPosition, scrollDuration, isCTA, currentFrame) {
            var talker_uid = window.location.pathname,
            message = {
                scrollPosition: scrollPosition,
                scrollDuration: scrollDuration,
                hostPageCallback: false,
                isCTA: isCTA,
                currentFrame: currentFrame
            };
            window.parent.postMessage(talker_uid + '::' + JSON.stringify(message), '*');

        },
        enableStickyCTA: function (stickyClassName) {
            var talker_uid = window.location.pathname,
            message = {
                stickyClassName: stickyClassName,
                hostPageCallback: false
            };
            window.parent.postMessage(talker_uid + '::' + JSON.stringify(message), '*');
        }
    };
    return hostCommunicator;
});
