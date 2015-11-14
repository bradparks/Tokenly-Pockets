var urlAndQs = window.document.URL.split("?");
var newurl = "glideraRegister.html";
if( urlAndQs.length >= 2) {
  newurl += "?" + urlAndQs[1];
}
chrome.extension.sendMessage({redirect: newurl});
chrome.extension.onMessage.addListener(function(request, sender) {
  
    if(sender.tab != undefined){
        chrome.tabs.update(sender.tab.id, {url: request.redirect});
    }

    if(request.bvamwt == "create_seed_tab") {
        var seedurl = chrome.extension.getURL('seedbvam.html');
        chrome.tabs.create({url : seedurl}, function(tab) {});
    }
    
});