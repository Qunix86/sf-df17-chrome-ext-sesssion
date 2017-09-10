(function(){

    "use strict";

    //this is the HTML ID that will be used to identify the extensions badge on the page
    //if a valid "sobject id" is found in the URL
    var randomCmpId = (chrome.runtime.id+'_'+Math.random()).replace('.','');
    console.log(randomCmpId);
    //stores current url: triggers content script only on "url" change
    var _currentUrl = window.location.href;

    //listener to background messages
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.action === $Constants.MESSAGES.GET_ORG_ID_CNT){

                //gets Salesforce Object ID from Page (if any)
                var objectId = $Utils.getSFIdFromURL(request.session.isLex);

                var appContainer = document.getElementById(randomCmpId);

                if(appContainer){
                    appContainer.remove();
                }

                if(!objectId) return;
                
                appContainer = document.createElement('div');
                appContainer.id = randomCmpId;
                appContainer.title = 'Double click to show all sobject fields';
                appContainer.className = 'ui-amzext-cnt-badge';
                window.document.body.appendChild(appContainer);

                appContainer.addEventListener('dblclick', function(evt){
                    window.open($Utils.getSwissKnifeUrl(request.session.domainAPI,
                        request.session.sid,
                        objectId));
                });
            }
    });


    //first session info request
    chrome.runtime.sendMessage({action: $Constants.MESSAGES.GET_ORG_ID_BKG});
    
    //this interval is necessary because LEX doesn't always refreshes the page when
    //moving in the LEX app, so we need to trigger the data retrievement periodically,
    //checking the page url
    setInterval(function(){
        //if current url has not changed since last execution, returns
        if(_currentUrl === window.location.href) return;

        chrome.runtime.sendMessage({action: $Constants.MESSAGES.GET_ORG_ID_BKG});

        //resets current url var
        _currentUrl = window.location.href;
    }, 2000);

}());