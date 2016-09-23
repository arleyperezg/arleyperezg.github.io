
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta http-equiv="pragma" content="no-cache"/>
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
    <meta name="format-detection" content="telephone=no"/>
    <meta name="viewport" content="user-scalable=0, width=device-width, initial-scale=1.0, maximum-scale=1.0"/>
    <meta name="msapplication-TileImage" content="prem/16.1409.12.2104857/resources/images/0/owa_browserpinnedtile.png"/>
    <meta name="msapplication-TileColor" content="#0072c6"/>
    <meta name="msapplication-tap-highlight" content="no" />
    <meta name="google" value="notranslate">
    <meta name="apple-mobile-web-app-title" content="OWA"/>
    <meta name="referrer" content="origin" />
    
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    

    <title>Outlook</title>

    <script>
        var startLoadTime = new Date();
        var appCachedPage = true;
        window.dateZero = new Date(0);
        var scriptStart = ((new Date()) - window.dateZero);
        window.clientId = '8BFEBD0058A8412F858210B29A919FC6';        
        window.corrId = window.clientId + "_" + (new Date()).getTime();
        window.traceTid= '84df9e7f-e9f6-40af-b435-aaaaaaaaaaaa';
        window.traceMguid = '53df56b4-59d9-46b2-9505-c0c5d811402c';
        window.owaUserNetId = '00060000DAA796FA';
        window.owaMbxGuid = '00060000-daa7-96fa-0000-000000000000';
        window.bootTraceUrl = 'https://xsi.outlook.com/';
        var onunloadbeforeboot = null;
        window.owaSDState = {};
        window.owaBootStatus = {};
        window.ariaLoggingEnabled = 0;
        
                
        
        var isPopOut = window.location.href.indexOf('ispopout=1') > 0;

               
        
        if (!window.owaSDState.fcr) {
            if (!isPopOut) {
                try
                {
                    
                    window.owaSDConsumable=false;
                    window.owaSDConsumed = false;
                    sendOwaSDRequest(false);
                }
                catch (ex) {
                    window.owaLastErrorReported = ex;
                    throw ex;
                }
            }
            else {
                onunloadbeforeboot = function() {
                    callPopOutBootErrorCallback("PopOutClosed");
                };
                if (window.attachEvent) {
                    window.attachEvent("onunload", onunloadbeforeboot);
                }
                else {
                    window.addEventListener("unload", onunloadbeforeboot, false);
                }
            }
        }

        function createOwaSDXMLHttpRequest() {
            var request = null;
            try
            {
                request = new window.XMLHttpRequest();
            }
            catch (e) {
                
                if (window.ActiveXObject) {
                    request = new window.ActiveXObject("Microsoft.XMLHTTP");
                }
            }

            return request;
        }
        
        function sendOwaSDRequest(retryAttempt) {
            
            window.owaSDState.usrPending = 1;
            window.owaSDState.usrReceived = false;
            
            window.owaSD = createOwaSDXMLHttpRequest();
            window.owaSD.retryAttempt = retryAttempt;
            window.owaSD.open("POST","sessiondata.ashx" + getSdqp(retryAttempt));
            window.owaSD.onreadystatechange = sdResponseHandler;
            window.owaSD.setRequestHeader("X-OWA-CorrelationId", window.corrId);
            window.owaSD.clientRequestId = window.corrId;
            window.owaSD.setRequestHeader("client-request-id", window.owaSD.clientRequestId);
            
            try {
                if (navigator.userAgent.indexOf("OWASMIME/" > 0)) {
                    window.owaSD.setRequestHeader("X-OWA-SmimeInstalled", "1");
                }
                else if (window.ActiveXObject) {
                    var smimePlugin = new ActiveXObject("Microsoft.Exchange.Clients.SmimeAX");
                    window.owaSD.setRequestHeader("X-OWA-SmimeInstalled", "1");
                    smimePlugin.Dispose();
                }
            }
            catch (e) {
            }

            window.owaSD.send();
        }

        function getSdqp(retryAttempt) {
            var sdqp = "?appcacheclient=1";
            
                    sdqp += "&acver=16.1409.12.2104857";
                

                sdqp += "&crr=1";
                if (retryAttempt) {
                    sdqp += "&crrretry=1";
                }
            
             return sdqp;
        }

        function sdResponseHandler() {
            try {
            
                if (!window.owaSD) {
                    return;
                }

                if (!tryAuthOwaSD()) {
                    return;
                }

                if (!window.owaSDState.usrReceived && !(window.owaSDState.usrReceived = tryReceiveUSR())) {
                    return;
                }
                
                if (!window.owaSDState.sdReceived && !(window.owaSDState.sdReceived = tryReceiveSD())) {
                    return;
                }

                completeOwaSD();
                
            }
            catch (ex) {
                window.owaLastErrorReported = ex;
                throw ex;
            }
        }

        function tryAuthOwaSD() {
            if ((window.owaSD.status == 440 || window.owaSD.status == 401) && !isPalEnabled()) {
                    postBootTrace("AuthRedirect");

                    
                    trackRedirectToAuth();
                    redirect('authRedirect', 'true');
                    return false;
                    }

            return true;
        }

        function completeOwaSD() {
            window.owaSDdidHandlerExecute = true;
            window.owaSDReceivedTime = (new Date()).toString();
            window.owaSDReceivedTimeStamp = ((new Date()) - window.dateZero);

            if (window.owaSDConsumable && !window.owaSDConsumed) {
                owastart();
            }
        }

                
        function onUSRPendingComplete(e) {
            window.owaSDState.usrPending--;

            if (e && e.target && e.target.src) {
                parseEndTimes[getFileName(e.target.src)] = ((new Date()) - window.dateZero);
            }

            if (window.owaSDState.usrPending == 0 && window.startUpOwa) {
                window.startUpOwa();
            }
        }

        function onUSRPendingError(e) {
            var errMsg = "Failed to load script: ";
            if (e && e.target && e.target.src) {
                errMsg += e.target.src;
            }
            handleBootError2("USRLoadError", errMsg);
        }

        function tryConsumeUSR() {
            if (window.owaSDState.usrConsumable && window.owaSDState.usrReceived && !window.owaSDState.usrConsumed) {
                window.owaSDState.usrConsumed = true;
                eval(window.owaSDState.usr);
                setCompositeUsrTime();
                loadStyles(styleResources);
                onUSRPendingComplete();
            }
        }

        function getSDCompositeErr() {
            var errorInfo = "";
            var sdErrorHeader = "Content-Name: SdError\r\n\r\n";
            var errorStartIndex = window.owaSD.responseText.indexOf(sdErrorHeader);
            if (errorStartIndex >= 0) {
                var errorEndIndex = window.owaSD.responseText.indexOf("SdErrorEnd", errorStartIndex);
                if (errorEndIndex > 0) {
                    errorInfo = window.owaSD.responseText.substring(errorStartIndex + sdErrorHeader.length, errorEndIndex);
                }
                else {
                    errorInfo = window.owaSD.responseText.substring(errorStartIndex + sdErrorHeader.length);
                }
            }

            return errorInfo;
        }

        function tryReceiveUSR() {
            
            if (window.owaSDState.usrReceived) {
                return true;
            }

            var result = false;

            if (window.owaSD.readyState == 3 || window.owaSD.readyState == 4) {
                if (window.owaSD.responseText) {
                    var match = window.owaSD.responseText.match(/^SESSION DATA\r\nVersion: 1\r\n\r\nContent-Name: UserSpecificResources\r\nContent-Size: (\d+)\r\n\r\n/);
                    if (match) {
                        var usrBegin = match[0].length;
                        var usrEnd = usrBegin + parseInt(match[1]);
                        if (window.owaSD.responseText.length >= usrEnd) {
                            window.owaSDState.usr = window.owaSD.responseText.substring(usrBegin, usrEnd);
                            window.owaSDState.sdBegin = usrEnd;
                            result = window.owaSDState.usrReceived = true;

                            tryConsumeUSR();
                        }
                    }
                }
            }

            if (!result && window.owaSD.readyState == 4) {
                var errMsg = window.owaSD.getResponseHeader("X-Auth-Error");
                var errType = "USRCompositeAuthErr";
                if (!errMsg) {
                    errMsg = window.owaSD.getResponseHeader("X-OWA-Error");
                    errType = "USRCompositeServerErr";
                }

                if (!errMsg) {
                    var errorInfo = getSDCompositeErr();
                    if (errorInfo) {
                        errMsg = errorInfo;
                        errType = "USRCompositeBeginErr";
                    }
                }

                handleBootError2(
                    errType,
                    errMsg,
                    window.owaSD.getResponseHeader("X-OWA-Version"),
                    window.owaSD.getResponseHeader('X-CalculatedBETarget'));
            }

            return result;
        }

        function tryReceiveSD() {

            if (window.owaSDState.sdReceived) {
                return true;
            }

            var result = false;
            var retrySDRequest = false;
            var errorInfo = "";

            if (window.owaSD.readyState == 4) {
                errorInfo = getSDCompositeErr();
                var sdHeader = "Content-Name: SessionData\r\n\r\n";
                var retrySDRequestCode = "RetryCrrRequest";

                if (errorInfo) {
                    if (!this.owaSD.retryAttempt && errorInfo.indexOf(retrySDRequestCode) >= 0) {
                        retrySDRequest = true;
                    }
                }
                else if (window.owaSD.responseText.indexOf(sdHeader, window.owaSDState.sdBegin) == window.owaSDState.sdBegin) {
                    window.owaSDState.data = window.owaSD.responseText.substring(window.owaSDState.sdBegin + sdHeader.length);
                    result = window.owaSDState.sdReceived = true;
                }
            }

            if (retrySDRequest) {
                this.owaSD.onreadystatechange = null;
                this.owaSD = null;
                sendOwaSDRequest(true);
            }
            else if (!result && window.owaSD.readyState == 4) {
                handleBootError2(
                    "SDCompositeError",
                    errorInfo,
                    window.owaSD.getResponseHeader("X-OWA-Version"),
                    window.owaSD.getResponseHeader('X-CalculatedBETarget'));
            }

            return result;
        }
        
            Object.setPrototypeOf && (Object['protoInheritEnabled']=1);
        var LT_ANY="Any";var LT_MOUSE="Mouse";var LT_TNARROW="TNarrow";var LT_TWIDE="TWide";var layout,bootTraceTimerId,cdnEndPointName,lcver,readingPaneOn,parseEndTimes={},owaRedirecting;function getQueryStr(){return window.location.search?window.location.search:""}function isPalEnabled(){var n=getQueryStr();return document.cookie.indexOf("PALEnabled")!=-1||n.indexOf("palenabled=1")!=-1}function validateLocalStorage(){if(isLocalStorageEnabled==undefined)try{if(window.localStorage!=null){window.localStorage.dummy="dummy";window.localStorage.removeItem("dummy");isLocalStorageEnabled=!0}else isLocalStorageEnabled=!1}catch(n){isLocalStorageEnabled=!1}return isLocalStorageEnabled}var isLocalStorageEnabled=validateLocalStorage();function getLocalStorageValue(n){return validateLocalStorage()?window.localStorage[n]:undefined}function setLocalStorageValue(n,t){if(!validateLocalStorage())return undefined;var i=window.localStorage[n];window.localStorage[n]=t;return i}function deleteLocalStorageValue(n){if(!validateLocalStorage())return undefined;var t=window.localStorage[n];t&&delete window.localStorage[n];return t}function getCookie(n){var t=new RegExp("(?:^|; )"+encodeURIComponent(n)+"=([^;]*)").exec(document.cookie);return t?decodeURIComponent(t[1]):null}function eraseCookie(n,t){document.cookie=n+"=; expires=Thu, 01 Jan 1970 00:00:01 GMT; domain="+t+"; path=/"}function loadSlabSources(n,t,i){n!==""&&n[n.length-1]!="/"&&(n+="/");for(var r=0;r<t.length;r++){var f=t[r];var u=n+f.name;document.write("<script src='"+u+"'></"+"script>")}}function userEnabledOffline(){if(isPalEnabled())return!0;else if(isLocalStorageEnabled){var n=window.localStorage.userEnabledOffline||"";return n!=="false"&&n!=null&&n!=""}}function updateStatusText(n,t){if(!isPopOut){var i=document.getElementById("statusText");if(i){i.className=n;window.setTimeout(function(){i.className==n&&(i.className=n+"Delay")},t*1e3)}}}function appendQueryWhenBootError(n){var t=getQueryStr();(t.indexOf("aC=1")>=0||t.indexOf("bFS=1")>=0)&&n.indexOf("?")==-1&&(n=n+"?bO=1");return n}function includeScripts(n,t,i,r,u,f){for(var s=0;s<t.length;s++){var l=t[s];var h=l.fileName;var e=n+h;e=appendQueryWhenBootError(e);var c=document.getElementsByTagName("head")[0];if(!c.querySelector("script[src='"+e+"']"))if(r){var o=document.createElement("script");o.type="text/javascript";o.src=e;o.onload=u;o.onerror=f;c.appendChild(o)}else{document.write("<script src='"+e+"' onerror='onScriptLoadError2(this)'");document.write("></"+"script>");document.write("<script>parseEndTimes['"+getFileName(h)+"'] = ((new Date()) - window.dateZero);</"+"script>")}}}function addCssLink(n){if(document.createStyleSheet)document.createStyleSheet(n);else{var i=document.getElementsByTagName("head")[0];var t=document.createElement("link");t.setAttribute("href",n);t.setAttribute("rel","stylesheet");t.setAttribute("type","text/css");i.appendChild(t)}}function includeStyles(n,t,i){var s=window.matchMedia&&window.matchMedia("screen and (-webkit-min-device-pixel-ratio: 2)")&&window.matchMedia("screen and (-webkit-min-device-pixel-ratio: 2)").matches;n!==""&&n[n.length-1]!="/"&&(n+="/");for(var o=i.length,f=0;f<o;f++){var r=i[f];var h=r.fileName||r.name;var e=n;(r.type=="Sprite"||r.type=="HighResolution")&&(e=t);var u=e+h;u=appendQueryWhenBootError(u);r.highResolution||r.type=="HighResolution"?s&&addCssLink(u):addCssLink(u)}}function includeScriptsAndStyles(n,t,i,r,u,f){if(!f)for(var e in n)if(n[e]==n.boot||u){var o=n[e].PackagedSources;o||(o=n[e].Sources);loadSlabSources(t,o,layout);var s=n[e].Styles;includeStyles(i,r,s,layout)}}var appcacheLoaded=!1;function suppressErrorRedirect(){return sver=="bld_ver"||window.location.href.indexOf("noErrR=1")!=-1}(function(){isPalEnabled()||(window.onerror=function(n,t,i){if(!appcacheLoaded)if(window.owaLastErrorReported){window.owaLastErrorReported.r=!0;window.owaLastErrorReported.message&&(n=window.owaLastErrorReported.message);window.owaLastErrorReported.stack&&(t=window.owaLastErrorReported.stack);window.owaLastErrorReported=null;handleBootError2("ClientError",formatErrorMsg(n,t,i))}else{if(!window.owaErrorState){window.owaErrorState={};window.owaErrorState.owaUncaughtError=[]}window.owaErrorState.owaUncaughtError.push(formatErrorMsg(n,t,i))}})})();function formatErrorMsg(n,t,i){return"exMsg="+n+";file="+t+":"+i}function handleBootError2(n,t,i,r){try{if(owaRedirecting)return;var u=getQueryStr();if(appCachedPage&&(n=="ScriptLoadError"||n=="ClientError")&&!isPalEnabled()){postBootTrace(n,t);var a=userEnabledOffline()?"10":"2";trackRebootReason(a);redirect("aC","1")}else if(!appCachedPage||userEnabledOffline()||isPalEnabled())if(u.indexOf("bO=1")!=-1||u.indexOf("aC=1")!=-1||u.indexOf("bFS=1")!=-1||n=="ScriptLoadError"||n=="ClientError"||n=="USRLoadError"||userEnabledOffline()||isPalEnabled())if(u.indexOf("bO=1")!=-1||u.indexOf("bFS=1")!=-1||n!="ScriptLoadError"&&n!="ClientError"&&n!="USRLoadError"||userEnabledOffline()||isPalEnabled()){postBootTrace(n,t);isPopOut&&callPopOutErrorCallback("BootError_"+n);if(!isPalEnabled()&&!userEnabledOffline()){if(t){t=encodeURIComponent(t);t.length>1024&&(t=t.substring(0,1024))}var f;var c;var s;var h;var e;var o;try{f=window.owaSD.getResponseHeader("X-OWAErrorMessageID");c=window.owaSD.getResponseHeader("request-id");s=window.owaSD.getResponseHeader("X-InnerException");e=window.owaSD.getResponseHeader("X-OWA-CorrelationId");o=window.owaSD.getResponseHeader("X-FEServer");h=window.owaSD.clientRequestId}catch(v){}f||(f=n);suppressErrorRedirect()||redirectToUrl("/owa/auth/errorfe.aspx?owaError="+n+";"+t+"&owaVer="+i+"&be="+r+"&msg="+f+"&reqid="+c+"&inex="+s+"&creqid="+h+"&fe="+o+"&cid="+e)}}else{postBootTrace(n,t);trackRebootReason("9");redirect("bFS","1")}else{postBootTrace(n,t);trackRebootReason("8");redirect("bO","1")}else{postBootTrace(n,t);trackRebootReason("1");redirect("bO","1")}}catch(v){if(!suppressErrorRedirect()){var l=v.message+";"+v.stack;redirectToUrl("/owa/auth/errorfe.aspx?owaError=Unknown;handle boot error failed;"+l+"&owaVer="+i+"&be="+r)}}}function onScriptLoadError2(n){var t="Failed to load script: ";n&&(t+=n.src);handleBootError2("ScriptLoadError",t,null)}function htmlDec(n){var t=document.createElement("div");t.innerHTML=n;return t.innerText||t.textContent}function loadScripts(n,t,i,r,u){for(var f=0;f<n.length;++f)n[f].fileName=n[f].fileName.replace("##LANG##",userLanguageVar).replace("##CULTURE##",userCultureVar).toLowerCase();includeScripts("",n,t,i,r,u)}function loadStyles(n){includeStyles("","",n,layout)}function redirect(n,t,i,r,u,f,e,o,s,h){if(!owaRedirecting){var c=addParamsToUrl(window.location.href,n,t);i!==undefined&&(c=addParamsToUrl(c,i,r));u!==undefined&&(c=addParamsToUrl(c,u,f));e!==undefined&&(c=addParamsToUrl(c,e,o));s!==undefined&&(c=addParamsToUrl(c,s,h));redirectToUrl(c)}}function redirectToUrl(n){if(n!=window.location.href&&!owaRedirecting){setTimeout(function(){window.location.href=n},50);owaRedirecting=!0;detachUnloadEvent()}}function addParamsToUrl(n,t,i){var u=t+"="+i;var r=n.split("#");var f=r.length==1?"":n.substr(n.indexOf("#"));if(r[0].indexOf(u)>=0)return n;n=r[0].indexOf("?")>=0?r[0]+"&"+u+f:r[0]+"?"+u+f;return n}function isMajorVersionChanged(n,t){if(n==null||t==null)return!0;var r=n.split(".");var u=t.split(".");if(r.length<3||u.length<3)return n!=t;for(var i=0;i<3;++i)if(r[i]!=u[i])return!0;return!1}var measure;var measureTitle;var measureDict={};var indentStr="";var consoleLogger=null;function startMeasure(n){if(consoleLogger){var t=new Date;measureTitle=n;consoleLogger.log("Start Scenario --- "+measureTitle+"@"+(t-measure));measure=t}}function endMeasure(){if(consoleLogger&&measure){var n=new Date;consoleLogger.log("End Scenario --- "+measureTitle+"@"+(n-measure))}}function timeStamp(n){if(consoleLogger&&measure){var t=new Date;consoleLogger.log(indentStr+" Stamp-"+n+"@"+(t-measure))}}function time(n){if(consoleLogger){var t=new Date;measureDict[n]=t;measure?consoleLogger.log(indentStr+"┌─Start-"+n+"@"+(t-measure)):consoleLogger.log(indentStr+"┌─Start-"+n);indentStr=indentStr+"│ "}}function timeEnd(n){if(consoleLogger){var i=measureDict[n];var r=new Date;delete measureDict[n];indentStr=indentStr.substr(2);var t="";i&&(t=r-i);measure?consoleLogger.log(indentStr+"└─End  -"+n+"@"+(r-measure)+" "+t+"ms"):consoleLogger.log(indentStr+"└─End  -"+n+" "+t+"ms")}}function trackRedirectToAuth(){setLocalStorageValue("authRedirect","1")}function trackRedirectToAuthDone(){var n=deleteLocalStorageValue("authRedirect");return n=="1"}function trackRebootReason(n){setLocalStorageValue("rebootReason",n)}function getRebootReasonAndReset(){var n=deleteLocalStorageValue("rebootReason");return n?n:"0"}function getClientId(){return getLocalStorageValue("cid")}function setClientId(n){setLocalStorageValue("cid",n)}function updateLastClientVersion(n){return setLocalStorageValue("LastClientVersion",n)}function isAppCacheSupported(){try{return window.applicationCache!=null}catch(n){return!1}}function getMissingBootFiles(){var t="";try{if(!!window.scriptsLoaded)for(var n in window.scriptsLoaded)t+=!window.scriptsLoaded[n]||window.scriptsLoaded[n]==0?n+";":"";return t?t:"nf"}catch(i){return null}}function postBootTrace(n,t){try{if(owaRedirecting)return;if(isPopOut)return;var d=window.bootTraceUrl,ht=appCachedPage,ct=trackRedirectToAuthDone();var l=null,v=null,k=null,b=null,g=null,c=null,f=null,s=null,it=null;if(window.owaSD&&window.owaSD.readyState==4){l=window.owaSD.getResponseHeader("X-FEServer");v=window.owaSD.getResponseHeader("X-BEServer");k=window.owaSD.getResponseHeader("X-CalculatedBETarget");g=window.owaSD.getResponseHeader("X-OWA-Version");b=window.owaSD.status;f=window.owaSD.getResponseHeader("X-MSEdge-Ref");c=f?"1":"0";s=window.owaSD.getResponseHeader("X-OWA-DAG");it=window.owaSD.getResponseHeader("X-OWA-Forest")}perfData=getPerformanceNumbers(ht);var tt=getRebootReasonAndReset();var nt=userEnabledOffline()?"1":"0";var w=isPalEnabled()?"1":"0";var r="?cId="+window.clientId+"&msg="+n+"&tg="+window.traceTid+"&MDB="+window.traceMguid+"&nId="+window.owaUserNetId+"&MBX="+window.owaMbxGuid+"&sdCoId="+window.corrId+"&sds="+b+"&fe="+l+"&be="+v+"&cbe="+k+"&dag="+s+"&cver="+sver+"&sdver="+g+"&rpo="+(readingPaneOn?"1":"0")+"&off="+nt+"&pal="+w+"&rfe="+tt+"&te="+c+"&"+perfData[0];if(window.performance&&window.performance.timing&&window.performance.timing.domLoading&&window.scriptStart){var st=window.scriptStart-window.performance.timing.domLoading;r+="&tcd="+st}ct&&(r+="&backFromAuth=true");if(isLocalStorageEnabled){var et=window.localStorage.BootVer;var ot=window.localStorage.InstalledCacheVer;var lt=window.localStorage.InstallAttemptCacheVer;var pt=window.localStorage.UICulture;var wt=window.localStorage.UITheme;var yt=window.localStorage.DownloadedCacheCount;var at=window.localStorage.LastHostName;var vt=window.location.hostname;var p=getMissingBootFiles();r+="&lbv="+et+"&icv="+ot+"&iacr="+lt+"&lcver="+lcver+"&accu="+pt+"&acth="+wt+"&acdc="+yt+"&lhn="+at+"&chn="+vt}r+="&acs="+(isAppCacheSupported()?"1":0);r+="&mf="+p;if(window.owaErrorState&&window.owaErrorState.owaUncaughtError&&window.owaErrorState.owaUncaughtError.length>0){for(var y="",o=0;o<window.owaErrorState.owaUncaughtError.length;o++)y+=window.owaErrorState.owaUncaughtError[o]+";";r+="&ue="+encodeURIComponent(y)}var rt=setLocalStorageValue("featureChanges","null");r+="&fc="+encodeURIComponent(rt);var u=window.location.href;u&&(u=encodeURIComponent(u));var a=new XMLHttpRequest;a.open("POST","plt1.ashx"+r,!0);var e=(u?"&refUrl="+u:"")+(f?"&edgeRef="+f:"")+(t?"&Err="+encodeURIComponent(t):"");a.setRequestHeader("X-OWA-PLT-Info",e);perfData[1].length>0&&(e="&"+perfData[1]+e);perfData[2].length>0&&(e=perfData[2]+e);a.send(e);if(d){r=r+(u?"&refUrl="+u:"")+(f?"&edgeRef="+f:"")+(t?"&Err="+encodeURIComponent(t):"");r.length>4096&&(r=r.substring(0,4096));var h=document.getElementById("traceFrame");if(h){h.src=d+r;bootTraceTimerId!=null&&window.clearTimeout(bootTraceTimerId);bootTraceTimerId=window.setTimeout(function(){bootTraceTimerId=null;h.src="about:blank"},3e4)}}if(window.ariaLoggingEnabled){microsoft.applications.telemetry.LogManager.initialize(window.ariaTenantToken);defaultLogger=new microsoft.applications.telemetry.Logger;var i=new microsoft.applications.telemetry.EventProperties;var ft=tt=="0"?"OwaBootError":"OwaBootFatalError";var ut="edgeRef="+f+"&refUrl="+u+"&perfData="+perfData[0]+"&off="+nt+"&pal="+w+"&mf="+p+"&tg="+window.traceTid;i.name=t?ft:"OwaBootSuccess";i.setProperty("Source","client");i.setProperty("ClientId",window.clientId);i.setProperty("RequestId",window.corrId);i.setProperty("NetId",window.owaUserNetId);i.setProperty("MDB",window.traceMguid);i.setProperty("HttpStatusCode",window.sdStatus);i.setProperty("MachineName",v);i.setProperty("Forest",it);i.setProperty("DAG",s);i.setProperty("FEServer",l);i.setProperty("Edge",c);i.setProperty("Message",n);i.setProperty("MiscData",ut);t&&i.setProperty("Exception",encodeURIComponent(t));defaultLogger.logEvent(i)}}catch(bt){}}function getPerformanceNumbers(n){var r=window.performance;typeof r!="undefined"&&typeof window.webkitPerformance!="undefined"&&(r=window.webkitPerformance);var u=[];var o=new Date-window.dateZero;u.push((n?"ALT=":"PLT=")+getPerformanceTimings(r?r.timing:null,o));u.push("nowTS="+o);var s=getCookie("wlidperf");if(s){var t=s.split("&");for(i=0;i<t.length;i++)if(t[i].indexOf("ST=")>=0&&t[i].length==16){var h=t[i].substring(3,t[i].length);u.push("authTS="+h)}}eraseCookie("wlidperf",".live.com");var e=[];getResourceEntries(r,e);var f="";isLocalStorageEnabled&&(f=window.localStorage.OwaStartupPerfTrace?window.localStorage.OwaStartupPerfTrace:"");return[u.join("&"),e.join("&"),f]}var renderStartTime=0;function setStartRenderTime(){renderStartTime=new Date-window.dateZero}var compositeUsrTime=0;function setCompositeUsrTime(){compositeUsrTime=new Date-window.dateZero}function getPerformanceTimings(n,t){var i=[],r=window.scriptStart;if(n){r=n.navigationStart;if(n.unloadEventStart){i.push("uES");i.push(n.unloadEventStart-r|0)}if(n.unloadEventEnd){i.push("uEE");i.push(n.unloadEventEnd-r|0)}r=fillTimingValues(n,r,i);if(window.owaSDReceivedTimeStamp){i.push("sdR");i.push(window.owaSDReceivedTimeStamp-r|0)}if(parseEndTimes.allBootScripts){i.push("pEab");i.push(parseEndTimes.allBootScripts-r|0)}if(parseEndTimes.allDone){i.push("pE");i.push(parseEndTimes.allDone-r|0)}if(renderStartTime){i.push("rSt");i.push(renderStartTime-r|0)}if(compositeUsrTime){i.push("cUsr");i.push(compositeUsrTime-r|0)}i.push("now");i.push(t-r)}if(window.scriptStart){i.push("nowNoTim");i.push(t-window.scriptStart|0);if(renderStartTime){i.push("rStNoTim");i.push(renderStartTime-window.scriptStart|0)}}return i.join(",")}function getResourceEntries(n,t){if(!n||!n.getEntries&&!n.webkitGetEntries)return null;for(var e=n.getEntries?n.getEntries():n.webkitGetEntries(),r=0;r<e.length;r++){var i=e[r];if(i.name.lastIndexOf(".js")>0||i.name.lastIndexOf(".ashx")>0||i.name.lastIndexOf(".png")>0||i.name.lastIndexOf(".gif")>0||i.name.lastIndexOf(".css")>0||i.name.lastIndexOf(".eot")>0||i.name.lastIndexOf(".ttf")>0||i.name.lastIndexOf(".htm")>0||i.name.lastIndexOf(".woff")>0){var f="Res="+getFileName(i.name)+",tim="+getResourceTiming(i);var u=getFileName(i.name);parseEndTimes[u]&&(f+=",pE,"+(parseEndTimes[u]-n.timing.fetchStart));t.push(f)}}}function getResourceTiming(n){var t=[];var i=n.startTime|0;t.push("st");t.push(i);fillTimingValues(n,i,t);return t.join(",")}function getFileName(n){var u=Math.max(n.lastIndexOf("/"),n.lastIndexOf("\\"));var i=n.indexOf("?");var r=n.indexOf("#");var t=-1;t=i==-1||r==-1?Math.max(i,r):Math.min(i,r);t=t==-1?n.length:t;return n.substring(u+1,t)}function fillTimingValues(n,t,i){if(n.redirectStart){i.push("reds");i.push(n.redirectStart-t|0)}if(n.redirectEnd){i.push("redE");i.push(n.redirectEnd-t|0)}if(n.fetchStart){i.push("fS");i.push(n.fetchStart-t|0);t=n.fetchStart}if(n.domainLookupStart){i.push("dLS");i.push(n.domainLookupStart-t|0)}if(n.domainLookupEnd){i.push("dLE");i.push(n.domainLookupEnd-t|0)}if(n.connectStart){i.push("cS");i.push(n.connectStart-t|0)}if(n.connectEnd){i.push("cE");i.push(n.connectEnd-t|0)}if(n.secureConnectionStart){i.push("sCS");i.push(n.secureConnectionStart-t|0)}if(n.requestStart){i.push("reqS");i.push(n.requestStart-t|0)}if(n.responseStart){i.push("resS");i.push(n.responseStart-t|0)}if(n.responseEnd){i.push("resE");i.push(n.responseEnd-t|0)}if(n.domLoading){i.push("domL");i.push(n.domLoading-t|0)}if(n.domContentLoadedEventStart){i.push("domCLES");i.push(n.domContentLoadedEventStart-t|0)}if(n.domContentLoadedEventEnd){i.push("domCLEE");i.push(n.domContentLoadedEventEnd-t|0)}if(n.domComplete){i.push("domC");i.push(n.domComplete-t|0)}if(n.loadEventStart){i.push("lES");i.push(n.loadEventStart-t|0)}if(n.loadEventEnd){i.push("lEE");i.push(n.loadEventEnd-t|0)}return t}function callPopOutErrorCallback(n){try{if(window.opener&&window.opener.popOutErrorCallbacks){var t=getParameterByName("wid");window.opener.popOutErrorCallbacks[t](n)}cleanupErrorCallback()}catch(i){}}function cleanupErrorCallback(){try{detachUnloadEvent();if(window.opener&&window.opener.popOutErrorCallbacks){var n=getParameterByName("wid");window.opener.popOutErrorCallbacks[n]=null}}catch(t){}}function getParameterByName(n){var i=new RegExp("[\\#&]"+n+"=([^&#]*)");var t=i.exec(location.hash);return t==null?null:decodeURIComponent(t[1])}function detachUnloadEvent(){try{onunloadbeforeboot&&(window.detachEvent?window.detachEvent("onunload",onunloadbeforeboot):window.removeEventListener("unload",onunloadbeforeboot,!1))}catch(n){}}var pbar={};pbar.startTime=Date.now();pbar.s={plt:6500,maxTime:2e4,sLoad:.05,pltLSKey:"AvgPLT"};pbar.caculatecubic=function(n){var t=n/pbar.s.maxTime;t>1&&(t=1);return"cubic-bezier("+t+",.9,"+t+",.9)"};pbar.startScriptLoad=function(){try{var i=getLocalStorageValue(pbar.s.pltLSKey);i&&(pbar.s.plt=parseInt(i));var n=document.getElementById("progressBar");if(n){var t=pbar.caculatecubic(pbar.s.plt);n.style.WebkitAnimationTimingFunction=t;n.style.animationTimingFunction=t}}catch(r){}};pbar.scriptLoadCompleted=function(){try{var n=document.getElementById("progressBar");var i=(Date.now()-pbar.startTime)/pbar.s.sLoad;if(i<pbar.s.plt&&n){var t=pbar.caculatecubic(i);n.style.WebkitAnimationTimingFunction=t;n.style.animationTimingFunction=t}}catch(r){}};pbar.renderCompleted=function(){try{var t=Date.now()-pbar.startTime;var n=(t+pbar.s.plt)/2;setLocalStorageValue(pbar.s.pltLSKey,n)}catch(i){}}
    </script>
      
        <style>
        
                
                @font-face {
                    font-family: "wf_segoe-ui_light";
                    src: local("Segoe UI Light"),
                         local("Segoe WP Light"),
                         url('prem/fonts/segoeui-light.woff') format('woff'),
                         url('prem/fonts/segoeui-light.ttf') format('truetype');
                }
                @font-face {
                    font-family: "wf_segoe-ui_normal";
                    src: local("Segoe UI"),
                         local("Segoe WP"),
                         url('prem/fonts/segoeui-regular.woff') format('woff'),
                         url('prem/fonts/segoeui-regular.ttf') format('truetype');
                }
                @font-face {
                    font-family: "wf_segoe-ui_semibold";
                    src: local("Segoe UI Semibold"),
                         local("Segoe WP Semibold"),
                         url('prem/fonts/segoeui-semibold.woff') format('woff'),
                         url('prem/fonts/segoeui-semibold.ttf') format('truetype');
                    font-weight: bold;
                }
                @font-face {
                    font-family: "wf_segoe-ui_semilight";
                    src: local("Segoe UI Semilight"),
                         local("Segoe WP Semilight"),
                         url('prem/fonts/segoeui-semilight.woff') format('woff'),
                         url('prem/fonts/segoeui-semilight.ttf') format('truetype');
                }

        

        @font-face {
            font-family: 'webfontPreload';
            src: url('prem/16.1409.12.2104857/resources/styles/fonts/office365icons.eot?#iefix') format('embedded-opentype'),
                 url('prem/16.1409.12.2104857/resources/styles/fonts/office365icons.woff') format('woff'),
                 url('prem/16.1409.12.2104857/resources/styles/fonts/office365icons.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
        }
      </style>

       <script>
        var LocaleFontFamilyTemplate = ".ms-font-su{color:#333;font-family:@font-family-semilight;font-size:42px;font-weight:normal}.ms-font-xxl{color:#333;font-family:@font-family-light;font-size:28px;font-weight:normal}.touch .ms-font-xxl{font-size:30px}.ms-font-xl{color:#333;font-family:@font-family-light;font-size:21px;font-weight:normal}.touch .ms-font-xl{font-size:22px}.ms-font-l{color:#333;font-family:@font-family-semilight;font-size:17px;font-weight:normal}.touch .ms-font-l{font-size:18px}.ms-font-m{color:#333;font-family:@font-family-regular;font-size:14px;font-weight:normal}.touch .ms-font-m{font-size:15px}.ms-font-s{color:#333;font-family:@font-family-regular;font-size:12px;font-weight:normal}.touch .ms-font-s{font-size:13px}.ms-font-xs{color:#333;font-family:@font-family-regular;font-size:11px;font-weight:normal}.touch .ms-font-xs{font-size:12px}.ms-font-mi{color:#333;font-family:@font-family-semibold;font-size:10px;font-weight:normal}.touch .ms-font-mi{font-size:11px}.ms-font-weight-light,.ms-fwt-l,.ms-font-weight-light-hover:hover,.ms-font-weight-light-before:before,.ms-fwt-l-h:hover,.ms-fwt-l-b:before{font-family:@font-family-light;}.ms-font-weight-semilight,.ms-fwt-sl,.ms-font-weight-semilight-hover:hover,.ms-font-weight-semilight-before:before,.ms-fwt-sl-h:hover,.ms-fwt-sl-b:before{font-family:@font-family-semilight}.ms-font-weight-regular,.ms-fwt-r,.ms-font-weight-regular-hover:hover,.ms-font-weight-regular-before:before,.ms-fwt-r-h:hover,.ms-fwt-r-b:before{font-family:@font-family-regular}.ms-font-weight-semibold,.ms-fwt-sb,.ms-font-weight-semibold-hover:hover,.ms-font-weight-semibold-before:before,.ms-fwt-sb-h:hover,.ms-fwt-sb-b:before{font-family:@font-family-semibold;font-weight:bold}";
        var ThemedColorTemplate = ".ms-bg-color-themeDark, .ms-bgc-td, .ms-bg-color-themeDark-hover:hover, .ms-bg-color-themeDark-focus:focus, .ms-bg-color-themeDark-before:before, .ms-bgc-td-h:hover, .ms-bgc-td-f:focus, .ms-bgc-td-b:before { background-color: @color-themeDark; }.ms-bg-color-themeDarkAlt, .ms-bgc-tda, .ms-bg-color-themeDarkAlt-hover:hover, .ms-bg-color-themeDarkAlt-focus:focus, .ms-bg-color-themeDarkAlt-before:before, .ms-bgc-tda-h:hover, .ms-bgc-tda-f:focus, .ms-bgc-tda-b:before { background-color: @color-themeDarkAlt; }.ms-bg-color-themeDarker, .ms-bgc-tdr, .ms-bg-color-themeDarker-hover:hover, .ms-bg-color-themeDarker-focus:focus, .ms-bg-color-themeDarker-before:before, .ms-bgc-tdr-h:hover, .ms-bgc-tdr-f:focus, .ms-bgc-tdr-b:before { background-color: @color-themeDarker; }.ms-bg-color-themePrimary, .ms-bgc-tp, .ms-bg-color-themePrimary-hover:hover, .ms-bg-color-themePrimary-focus:focus, .ms-bg-color-themePrimary-before:before, .ms-bgc-tp-h:hover, .ms-bgc-tp-f:focus, .ms-bgc-tp-b:before { background-color: @color-themePrimary; }.ms-bg-color-themeSecondary, .ms-bgc-ts, .ms-bg-color-themeSecondary-hover:hover, .ms-bg-color-themeSecondary-focus:focus, .ms-bg-color-themeSecondary-before:before, .ms-bgc-ts-h:hover, .ms-bgc-ts-f:focus, .ms-bgc-ts-b:before { background-color: @color-themeSecondary; }.ms-bg-color-themeTertiary, .ms-bgc-tt, .ms-bg-color-themeTertiary-hover:hover, .ms-bg-color-themeTertiary-focus:focus, .ms-bg-color-themeTertiary-before:before, .ms-bgc-tt-h:hover, .ms-bgc-tt-f:focus, .ms-bgc-tt-b:before { background-color: @color-themeTertiary; }.ms-bg-color-themeLight, .ms-bgc-tl, .ms-bg-color-themeLight-hover:hover, .ms-bg-color-themeLight-focus:focus, .ms-bg-color-themeLight-before:before, .ms-bgc-tl-h:hover, .ms-bgc-tl-f:focus, .ms-bgc-tl-b:before { background-color: @color-themeLight; }.ms-bg-color-themeLighter, .ms-bgc-tlr, .ms-bg-color-themeLighter-hover:hover, .ms-bg-color-themeLighter-focus:focus, .ms-bg-color-themeLighter-before:before, .ms-bgc-tlr-h:hover, .ms-bgc-tlr-f:focus, .ms-bgc-tlr-b:before { background-color: @color-themeLighter; }.ms-bg-color-themeLighterAlt, .ms-bgc-tlra, .ms-bg-color-themeLighterAlt-hover:hover, .ms-bg-color-themeLighterAlt-focus:focus, .ms-bg-color-themeLighterAlt-before:before, .ms-bgc-tlra-h:hover, .ms-bgc-tlra-f:focus, .ms-bgc-tlra-b:before { background-color: @color-themeLighterAlt; }.ms-border-color-themeDark, .ms-bcl-td, .ms-border-color-themeDark-hover:hover, .ms-border-color-themeDark-focus:focus, .ms-border-color-themeDark-before:before, .ms-bcl-td-h:hover, .ms-bcl-td-f:focus, .ms-bcl-td-b:before { border-color: @color-themeDark; }.ms-border-color-themeDarkAlt, .ms-bcl-tda, .ms-border-color-themeDarkAlt-hover:hover, .ms-border-color-themeDarkAlt-focus:focus, .ms-border-color-themeDarkAlt-before:before, .ms-bcl-tda-h:hover, .ms-bcl-tda-f:focus, .ms-bcl-tda-b:before { border-color: @color-themeDarkAlt; }.ms-border-color-themeDarker, .ms-bcl-tdr, .ms-border-color-themeDarker-hover:hover, .ms-border-color-themeDarker-focus:focus, .ms-border-color-themeDarker-before:before, .ms-bcl-tdr-h:hover, .ms-bcl-tdr-f:focus, .ms-bcl-tdr-b:before { border-color: @color-themeDarker; }.ms-border-color-themePrimary, .ms-bcl-tp, .ms-border-color-themePrimary-hover:hover, .ms-border-color-themePrimary-focus:focus, .ms-border-color-themePrimary-before:before, .ms-bcl-tp-h:hover, .ms-bcl-tp-f:focus, .ms-bcl-tp-b:before { border-color: @color-themePrimary; }.ms-border-color-themeSecondary, .ms-bcl-ts, .ms-border-color-themeSecondary-hover:hover, .ms-border-color-themeSecondary-focus:focus, .ms-border-color-themeSecondary-before:before, .ms-bcl-ts-h:hover, .ms-bcl-ts-f:focus, .ms-bcl-ts-b:before { border-color: @color-themeSecondary; }.ms-border-color-themeTertiary, .ms-bcl-tt, .ms-border-color-themeTertiary-hover:hover, .ms-border-color-themeTertiary-focus:focus, .ms-border-color-themeTertiary-before:before, .ms-bcl-tt-h:hover, .ms-bcl-tt-f:focus, .ms-bcl-tt-b:before { border-color: @color-themeTertiary; }.ms-border-color-themeLight, .ms-bcl-tl, .ms-border-color-themeLight-hover:hover, .ms-border-color-themeLight-focus:focus, .ms-border-color-themeLight-before:before, .ms-bcl-tl-h:hover, .ms-bcl-tl-f:focus, .ms-bcl-tl-b:before { border-color: @color-themeLight; }.ms-border-color-themeLighter, .ms-bcl-tlr, .ms-border-color-themeLighter-hover:hover, .ms-border-color-themeLighter-focus:focus, .ms-border-color-themeLighter-before:before, .ms-bcl-tlr-h:hover, .ms-bcl-tlr-f:focus, .ms-bcl-tlr-b:before { border-color: @color-themeLighter; }.ms-border-color-themeLighterAlt, .ms-bcl-tlra, .ms-border-color-themeLighterAlt-hover:hover, .ms-border-color-themeLighterAlt-focus:focus, .ms-border-color-themeLighterAlt-before:before, .ms-bcl-tlra-h:hover, .ms-bcl-tlra-f:focus, .ms-bcl-tlra-b:before { border-color: @color-themeLighterAlt; }.ms-border-color-top-themePrimary, .ms-bcl-t-tp, .ms-border-color-top-themePrimary-hover:hover, .ms-border-color-top-themePrimary-focus:focus, .ms-border-color-top-themePrimary-before:before, .ms-bcl-t-tp-h:hover, .ms-bcl-t-tp-f:focus, .ms-bcl-t-tp-b:before { border-top-color: @color-themePrimary; }.ms-font-color-themeDark, .ms-fcl-td, .ms-font-color-themeDark-hover:hover, .ms-font-color-themeDark-focus:focus, .ms-font-color-themeDark-before:before, .ms-fcl-td-h:hover, .ms-fcl-td-f:focus, .ms-fcl-td-b:before { color: @color-themeDark; }.ms-font-color-themeDarkAlt, .ms-fcl-tda, .ms-font-color-themeDarkAlt-hover:hover, .ms-font-color-themeDarkAlt-focus:focus, .ms-font-color-themeDarkAlt-before:before, .ms-fcl-tda-h:hover, .ms-fcl-tda-f:focus, .ms-fcl-tda-b:before { color: @color-themeDarkAlt; }.ms-font-color-themeDarker, .ms-fcl-tdr, .ms-font-color-themeDarker-hover:hover, .ms-font-color-themeDarker-focus:focus, .ms-font-color-themeDarker-before:before, .ms-fcl-tdr-h:hover, .ms-fcl-tdr-f:focus, .ms-fcl-tdr-b:before { color: @color-themeDarker; }.ms-font-color-themePrimary, .ms-fcl-tp, .ms-font-color-themePrimary-hover:hover, .ms-font-color-themePrimary-focus:focus, .ms-font-color-themePrimary-before:before, .ms-fcl-tp-h:hover, .ms-fcl-tp-f:focus, .ms-fcl-tp-b:before { color: @color-themePrimary; }.ms-font-color-themeSecondary, .ms-fcl-ts, .ms-font-color-themeSecondary-hover:hover, .ms-font-color-themeSecondary-focus:focus, .ms-font-color-themeSecondary-before:before, .ms-fcl-ts-h:hover, .ms-fcl-ts-f:focus, .ms-fcl-ts-b:before { color: @color-themeSecondary; }.ms-font-color-themeTertiary, .ms-fcl-tt, .ms-font-color-themeTertiary-hover:hover, .ms-font-color-themeTertiary-focus:focus, .ms-font-color-themeTertiary-before:before, .ms-fcl-tt-h:hover, .ms-fcl-tt-f:focus, .ms-fcl-tt-b:before { color: @color-themeTertiary; }.ms-font-color-themeLight, .ms-fcl-tl, .ms-font-color-themeLight-hover:hover, .ms-font-color-themeLight-focus:focus, .ms-font-color-themeLight-before:before, .ms-fcl-tl-h:hover, .ms-fcl-tl-f:focus, .ms-fcl-tl-b:before { color: @color-themeLight; }.ms-font-color-themeLighter, .ms-fcl-tlr, .ms-font-color-themeLighter-hover:hover, .ms-font-color-themeLighter-focus:focus, .ms-font-color-themeLighter-before:before, .ms-fcl-tlr-h:hover, .ms-fcl-tlr-f:focus, .ms-fcl-tlr-b:before { color: @color-themeLighter; }.ms-font-color-themeLighterAlt, .ms-fcl-tlra, .ms-font-color-themeLighterAlt-hover:hover, .ms-font-color-themeLighterAlt-focus:focus, .ms-font-color-themeLighterAlt-before:before, .ms-fcl-tlra-h:hover, .ms-fcl-tlra-f:focus, .ms-fcl-tlra-b:before { color: @color-themeLighterAlt; }";
        var o365ColorTemplate = ".o365cs-base.o365cst .o365cs-topnavLinkBackground-2{background-color:@topnavLinkBG;background-color:@topnavLinkBGrgb;}.o365cs-base.o365cst .o365cs-topnavText,.o365cs-base.o365cst .o365cs-topnavText:hover{color:@topnavText;}.o365cs-base.o365cst .o365cs-navMenuButton{color:@navmenu;}.o365cs-base.o365cst.o365cs-topnavBGColor-2{background-color:@topnavBG;}.o365cs-base.o365cst .o365cs-appLauncherBackground{background-color:@appLauncherBG}";
                
        </script>
        <style>.customScrollBar::-webkit-scrollbar{height:18px;width:18px}.customScrollBar::-webkit-scrollbar:disabled{display:none}.customScrollBar::-webkit-scrollbar-button{background-color:#fff;background-repeat:no-repeat;cursor:pointer}.customScrollBar::-webkit-scrollbar-button:horizontal:increment,.customScrollBar::-webkit-scrollbar-button:horizontal:decrement,.customScrollBar::-webkit-scrollbar-button:horizontal:increment:hover,.customScrollBar::-webkit-scrollbar-button:horizontal:decrement:hover,.customScrollBar::-webkit-scrollbar-button:vertical:increment,.customScrollBar::-webkit-scrollbar-button:vertical:decrement,.customScrollBar::-webkit-scrollbar-button:vertical:increment:hover,.customScrollBar::-webkit-scrollbar-button:vertical:decrement:hover{background-position:center;height:18px;width:18px}.customScrollBarLight::-webkit-scrollbar-button{display:none}.customScrollBar::-webkit-scrollbar-track{background-color:#fff}.customScrollBarLight::-webkit-scrollbar-track{background-color:#0072c6}.customScrollBar::-webkit-scrollbar-thumb{border-radius:9px;border:solid 6px #fff;background-color:#c8c8c8}.customScrollBarLight::-webkit-scrollbar-thumb{border-color:#0072c6;background-color:#95b1c1}.customScrollBar::-webkit-scrollbar-thumb:vertical{min-height:50px}.customScrollBar::-webkit-scrollbar-thumb:horizontal{min-width:50px}.customScrollBar::-webkit-scrollbar-thumb:hover{border-radius:9px;border:solid 6px #fff;background-color:#98a3a6}.customScrollBar::-webkit-scrollbar-corner{background-color:#fff}.nativeScrollInertia{-webkit-overflow-scrolling:touch}.csimg{display:inline-block;overflow:hidden}button::-moz-focus-inner{border-width:0;padding:0}.textbox{border-width:1px;border-style:solid;border-radius:0;-moz-border-radius:0;-webkit-border-radius:0;box-shadow:none;-moz-box-shadow:none;-webkit-box-shadow:none;-webkit-appearance:none;height:30px;padding:0 5px}.tnarrow .textbox,.twide .textbox{font-size:12px;background-color:#fff;height:14px;padding:3px 5px}.textbox::-webkit-input-placeholder{color:#a6a6a6}.textbox:-moz-placeholder{color:#a6a6a6}.textbox::-moz-placeholder{color:#a6a6a6}.textbox:-ms-input-placeholder{color:#a6a6a6}.textarea{padding:10px}.textarea:hover{background-color:transparent;border-color:transparent}.o365button{background:transparent;border-width:0;padding:0;cursor:pointer!important;font-size:14px}.o365button:disabled,label.o365button[disabled=true]{cursor:default!important}.o365buttonOutlined{padding-right:11px;padding-left:11px;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;border-width:1px;border-style:solid}.o365buttonOutlined .o365buttonLabel{display:inline-block}.o365buttonOutlined{height:30px}.twide .o365buttonOutlined,.tnarrow .o365buttonOutlined{height:22px}.o365buttonOutlined .o365buttonLabel{height:22px}.checkbox{border-style:none;cursor:pointer;vertical-align:middle}.popupShadow{box-shadow:0 0 20px rgba(0,0,0,.4);border:1px solid #eaeaea}.contextMenuDropShadow{box-shadow:0 0 7px rgba(0,0,0,.4);border:1px solid #eaeaea}.modalBackground{background-color:#fff;height:100%;width:100%;opacity:.65;filter:Alpha(opacity=65)}.clearModalBackground{background-color:#fff;opacity:0;filter:Alpha(opacity=0);height:100%;width:100%}.contextMenuPopup{background-color:#fff}.removeFocusOutline *:focus{outline:none}.addFocusOutline button:focus{outline:dotted 1px}.addFocusRingOutline button:focus{outline:auto 5px -webkit-focus-ring-color}.border-color-transparent{border-color:transparent}.vResize,.hResize{z-index:2000}.hResize,.hResizeCursor *{cursor:row-resize!important}.vResize,.vResizeCursor *{cursor:col-resize!important}.vResizing,.hResizing{filter:alpha(opacity=60);opacity:.6;-moz-opacity:.6;border:solid 1px #666}.vResizing{border-width:0 1px}.hResizing{border-width:1px 0}</style>
        <style></style>
        <style id="FontLocaleStyles"></style>
        <style id="ThemedColorStyles"></style>
        <style>.ms-bg-color-black,.ms-bgc-b,.ms-bg-color-black-hover:hover,.ms-bg-color-black-focus:focus,.ms-bg-color-black-before:before,.ms-bgc-b-h:hover,.ms-bgc-b-f:focus,.ms-bgc-b-b:before{background-color:#000}.ms-bg-color-neutralDark,.ms-bgc-nd,.ms-bg-color-neutralDark-hover:hover,.ms-bg-color-neutralDark-focus:focus,.ms-bg-color-neutralDark-before:before,.ms-bgc-nd-h:hover,.ms-bgc-nd-f:focus,.ms-bgc-nd-b:before{background-color:#212121}.ms-bg-color-neutralPrimary,.ms-bgc-np,.ms-bg-color-neutralPrimary-hover:hover,.ms-bg-color-neutralPrimary-focus:focus,.ms-bg-color-neutralPrimary-before:before,.ms-bgc-np-h:hover,.ms-bgc-np-f:focus,.ms-bgc-np-b:before{background-color:#333}.ms-bg-color-neutralSecondary,.ms-bgc-ns,.ms-bg-color-neutralSecondary-hover:hover,.ms-bg-color-neutralSecondary-focus:focus,.ms-bg-color-neutralSecondary-before:before,.ms-bgc-ns-h:hover,.ms-bgc-ns-f:focus,.ms-bgc-ns-b:before{background-color:#666}.ms-bg-color-neutralSecondaryAlt,.ms-bgc-nsa,.ms-bg-color-neutralSecondaryAlt-hover:hover,.ms-bg-color-neutralSecondaryAlt-focus:focus,.ms-bg-color-neutralSecondaryAlt-before:before,.ms-bgc-nsa-h:hover,.ms-bgc-nsa-f:focus,.ms-bgc-nsa-b:before{background-color:#767676}.ms-bg-color-neutralTertiary,.ms-bgc-nt,.ms-bg-color-neutralTertiary-hover:hover,.ms-bg-color-neutralTertiary-focus:focus,.ms-bg-color-neutralTertiary-before:before,.ms-bgc-nt-h:hover,.ms-bgc-nt-f:focus,.ms-bgc-nt-b:before{background-color:#a6a6a6}.ms-bg-color-neutralTertiaryAlt,.ms-bgc-nta,.ms-bg-color-neutralTertiaryAlt-hover:hover,.ms-bg-color-neutralTertiaryAlt-focus:focus,.ms-bg-color-neutralTertiaryAlt-before:before,.ms-bgc-nta-h:hover,.ms-bgc-nta-f:focus,.ms-bgc-nta-b:before{background-color:#c8c8c8}.ms-bg-color-neutralLight,.ms-bgc-nl,.ms-bg-color-neutralLight-hover:hover,.ms-bg-color-neutralLight-focus:focus,.ms-bg-color-neutralLight-before:before,.ms-bgc-nl-h:hover,.ms-bgc-nl-f:focus,.ms-bgc-nl-b:before{background-color:#eaeaea}.ms-bg-color-neutralLighter,.ms-bgc-nlr,.ms-bg-color-neutralLighter-hover:hover,.ms-bg-color-neutralLighter-focus:focus,.ms-bg-color-neutralLighter-before:before,.ms-bgc-nlr-h:hover,.ms-bgc-nlr-f:focus,.ms-bgc-nlr-b:before{background-color:#f4f4f4}.ms-bg-color-neutralLighterAlt,.ms-bgc-nlra,.ms-bg-color-neutralLighterAlt-hover:hover,.ms-bg-color-neutralLighterAlt-focus:focus,.ms-bg-color-neutralLighterAlt-before:before,.ms-bgc-nlra-h:hover,.ms-bgc-nlra-f:focus,.ms-bgc-nlra-b:before{background-color:#f8f8f8}.ms-bg-color-white,.ms-bgc-w,.ms-bg-color-white-hover:hover,.ms-bg-color-white-focus:focus,.ms-bg-color-white-before:before,.ms-bgc-w-h:hover,.ms-bgc-w-b:before{background-color:#fff}.ms-border-color-black,.ms-bcl-b,.ms-border-color-black-hover:hover,.ms-border-color-black-focus:focus,.ms-border-color-black-before:before,.ms-bcl-b-h:hover,.ms-bcl-b-f:focus,.ms-bcl-b-b:before{border-color:#000}.ms-border-color-neutralDark,.ms-bcl-nd,.ms-border-color-neutralDark-hover:hover,.ms-border-color-neutralDark-focus:focus,.ms-border-color-neutralDark-before:before,.ms-bcl-nd-h:hover,.ms-bcl-nd-f:focus,.ms-bcl-nd-b:before{border-color:#212121}.ms-border-color-neutralPrimary,.ms-bcl-np,.ms-border-color-neutralPrimary-hover:hover,.ms-border-color-neutralPrimary-focus:focus,.ms-border-color-neutralPrimary-before:before,.ms-bcl-np-h:hover,.ms-bcl-np-f:focus,.ms-bcl-np-b:before{border-color:#333}.ms-border-color-neutralSecondary,.ms-bcl-ns,.ms-border-color-neutralSecondary-hover:hover,.ms-border-color-neutralSecondary-focus:focus,.ms-border-color-neutralSecondary-before:before,.ms-bcl-ns-h:hover,.ms-bcl-ns-f:focus,.ms-bcl-ns-b:before{border-color:#666}.ms-border-color-neutralSecondaryAlt,.ms-bcl-nsa,.ms-border-color-neutralSecondaryAlt-hover:hover,.ms-border-color-neutralSecondaryAlt-focus:focus,.ms-border-color-neutralSecondaryAlt-before:before,.ms-bcl-nsa-h:hover,.ms-bcl-nsa-f:focus,.ms-bcl-nsa-b:before{border-color:#767676}.ms-border-color-neutralTertiary,.ms-bcl-nt,.ms-border-color-neutralTertiary-hover:hover,.ms-border-color-neutralTertiary-focus:focus,.ms-border-color-neutralTertiary-before:before,.ms-bcl-nt-h:hover,.ms-bcl-nt-f:focus,.ms-bcl-nt-b:before{border-color:#a6a6a6}.ms-border-color-neutralTertiaryAlt,.ms-bcl-nta,.ms-border-color-neutralTertiaryAlt-hover:hover,.ms-border-color-neutralTertiaryAlt-focus:focus,.ms-border-color-neutralTertiaryAlt-before:before,.ms-bcl-nta-h:hover,.ms-bcl-nta-f:focus,.ms-bcl-nta-b:before{border-color:#c8c8c8}.ms-border-color-neutralLight,.ms-bcl-nl,.ms-border-color-neutralLight-hover:hover,.ms-border-color-neutralLight-focus:focus,.ms-border-color-neutralLight-before:before,.ms-bcl-nl-h:hover,.ms-bcl-nl-f:focus,.ms-bcl-nl-b:before{border-color:#eaeaea}.ms-border-color-neutralLighter,.ms-bcl-nlr,.ms-border-color-neutralLighter-hover:hover,.ms-border-color-neutralLighter-focus:focus,.ms-border-color-neutralLighter-before:before,.ms-bcl-nlr-h:hover,.ms-bcl-nlr-f:focus,.ms-bcl-nlr-b:before{border-color:#f4f4f4}.ms-border-color-neutralLighterAlt,.ms-bcl-nlra,.ms-border-color-neutralLighterAlt-hover:hover,.ms-border-color-neutralLighterAlt-focus:focus,.ms-border-color-neutralLighterAlt-before:before,.ms-bcl-nlra-h:hover,.ms-bcl-nlra-f:focus,.ms-bcl-nlra-b:before{border-color:#f8f8f8}.ms-border-color-white,.ms-bcl-w,.ms-border-color-white-hover:hover,.ms-border-color-white-focus:focus,.ms-border-color-white-before:before,.ms-bcl-w-h:hover,.ms-bcl-w-f:focus,.ms-bcl-w-b:before{border-color:#fff}.ms-font-color-black,.ms-fcl-b,.ms-font-color-black-hover:hover,.ms-font-color-black-focus:focus,.ms-font-color-black-before:before,.ms-fcl-b-h:hover,.ms-fcl-b-f:focus,.ms-fcl-b-b:before{color:#000}.ms-font-color-neutralDark,.ms-fcl-nd,.ms-font-color-neutralDark-hover:hover,.ms-font-color-neutralDark-focus:focus,.ms-font-color-neutralDark-before:before,.ms-fcl-nd-h:hover,.ms-fcl-nd-f:focus,.ms-fcl-nd-b:before{color:#212121}.ms-font-color-neutralPrimary,.ms-fcl-np,.ms-font-color-neutralPrimary-hover:hover,.ms-font-color-neutralPrimary-focus:focus,.ms-font-color-neutralPrimary-before:before,.ms-fcl-np-h:hover,.ms-fcl-np-f:focus,.ms-fcl-np-b:before{color:#333}.ms-font-color-neutralSecondary,.ms-fcl-ns,.ms-font-color-neutralSecondary-hover:hover,.ms-font-color-neutralSecondary-focus:focus,.ms-font-color-neutralSecondary-before:before,.ms-fcl-ns-h:hover,.ms-fcl-ns-f:focus,.ms-fcl-ns-b:before{color:#666}.ms-font-color-neutralSecondaryAlt,.ms-fcl-nsa,.ms-font-color-neutralSecondaryAlt-hover:hover,.ms-font-color-neutralSecondaryAlt-focus:focus,.ms-font-color-neutralSecondaryAlt-before:before,.ms-fcl-nsa-h:hover,.ms-fcl-nsa-f:focus,.ms-fcl-nsa-b:before{color:#767676}.ms-font-color-neutralTertiary,.ms-fcl-nt,.ms-font-color-neutralTertiary-hover:hover,.ms-font-color-neutralTertiary-focus:focus,.ms-font-color-neutralTertiary-before:before,.ms-fcl-nt-h:hover,.ms-fcl-nt-f:focus,.ms-fcl-nt-b:before{color:#a6a6a6}.ms-font-color-neutralTertiaryAlt,.ms-fcl-nta,.ms-font-color-neutralTertiaryAlt-hover:hover,.ms-font-color-neutralTertiaryAlt-focus:focus,.ms-font-color-neutralTertiaryAlt-before:before,.ms-fcl-nta-h:hover,.ms-fcl-nta-f:focus,.ms-fcl-nta-b:before{color:#c8c8c8}.ms-font-color-neutralLight,.ms-fcl-nl,.ms-font-color-neutralLight-hover:hover,.ms-font-color-neutralLight-focus:focus,.ms-font-color-neutralLight-before:before,.ms-fcl-nl-h:hover,.ms-fcl-nl-f:focus,.ms-fcl-nl-b:before{color:#eaeaea}.ms-font-color-neutralLighter,.ms-fcl-nlr,.ms-font-color-neutralLighter-hover:hover,.ms-font-color-neutralLighter-focus:focus,.ms-font-color-neutralLighter-before:before,.ms-fcl-nlr-h:hover,.ms-fcl-nlr-f:focus,.ms-fcl-nlr-b:before{color:#f4f4f4}.ms-font-color-neutralLighterAlt,.ms-fcl-nlra,.ms-font-color-neutralLighterAlt-hover:hover,.ms-font-color-neutralLighterAlt-focus:focus,.ms-font-color-neutralLighterAlt-before:before,.ms-fcl-nlra-h:hover,.ms-fcl-nlra-f:focus,.ms-fcl-nlra-b:before{color:#f8f8f8}.ms-font-color-white,.ms-fcl-w,.ms-font-color-white-hover:hover,.ms-font-color-white-focus:focus,.ms-font-color-white-before:before,.ms-fcl-w-h:hover,.ms-fcl-w-f:focus,.ms-fcl-w-b:before{color:#fff}</style>
        <style>.ms-bg-color-yellow,.ms-bgc-y,.ms-bg-color-yellow-hover:hover,.ms-bg-color-yellow-before:before,.ms-bgc-y-h:hover,.ms-bgc-y-b:before{background-color:#ffb900}.ms-bg-color-yellowLight,.ms-bgc-yl,.ms-bg-color-yellowLight-hover:hover,.ms-bg-color-yellowLight-before:before,.ms-bgc-yl-h:hover,.ms-bgc-yl-b:before{background-color:#fff100}.ms-bg-color-orange,.ms-bgc-o,.ms-bg-color-orange-hover:hover,.ms-bg-color-orange-before:before,.ms-bgc-o-h:hover,.ms-bgc-o-b:before{background-color:#d83b01}.ms-bg-color-orangeLight,.ms-bgc-ol,.ms-bg-color-orangeLight-hover:hover,.ms-bg-color-orangeLight-before:before,.ms-bgc-ol-h:hover,.ms-bgc-ol-b:before{background-color:#ff8c00}.ms-bg-color-redDark,.ms-bgc-rd,.ms-bg-color-redDark-hover:hover,.ms-bg-color-redDark-before:before,.ms-bgc-rd-h:hover,.ms-bgc-rd-b:before{background-color:#a80000}.ms-bg-color-red,.ms-bgc-r,.ms-bg-color-red-hover:hover,.ms-bg-color-red-before:before,.ms-bgc-r-h:hover,.ms-bgc-r-b:before{background-color:#e81123}.ms-bg-color-magentaDark,.ms-bgc-md,.ms-bg-color-magentaDark-hover:hover,.ms-bg-color-magentaDark-before:before,.ms-bgc-md-h:hover,.ms-bgc-md-b:before{background-color:#5c005c}.ms-bg-color-magenta,.ms-bgc-m,.ms-bg-color-magenta-hover:hover,.ms-bg-color-magenta-before:before,.ms-bgc-m-h:hover,.ms-bgc-m-b:before{background-color:#b4009e}.ms-bg-color-magentaLight,.ms-bgc-ml,.ms-bg-color-magentaLight-hover:hover,.ms-bg-color-magentaLight-before:before,.ms-bgc-ml-h:hover,.ms-bgc-ml-b:before{background-color:#e3008c}.ms-bg-color-purpleDark,.ms-bgc-pd,.ms-bg-color-purpleDark-hover:hover,.ms-bg-color-purpleDark-before:before,.ms-bgc-pd-h:hover,.ms-bgc-pd-b:before{background-color:#32145a}.ms-bg-color-purple,.ms-bgc-p,.ms-bg-color-purple-hover:hover,.ms-bg-color-purple-before:before,.ms-bgc-p-h:hover,.ms-bgc-p-b:before{background-color:#5c2d91}.ms-bg-color-purpleLight,.ms-bgc-pl,.ms-bg-color-purpleLight-hover:hover,.ms-bg-color-purpleLight-before:before,.ms-bgc-pl-h:hover,.ms-bgc-pl-b:before{background-color:#b4a0ff}.ms-bg-color-blueDark,.ms-bgc-bd,.ms-bg-color-blueDark-hover:hover,.ms-bg-color-blueDark-before:before,.ms-bgc-bd-h:hover,.ms-bgc-bd-b:before{background-color:#002050}.ms-bg-color-blueMid,.ms-bgc-bm,.ms-bg-color-blueMid-hover:hover,.ms-bg-color-blueMid-before:before,.ms-bgc-bm-h:hover,.ms-bgc-bm-b:before{background-color:#00188f}.ms-bg-color-blue,.ms-bgc-blu,.ms-bg-color-blue-hover:hover,.ms-bg-color-blue-before:before,.ms-bgc-blu-h:hover,.ms-bgc-blu-b:before{background-color:#0078d7}.ms-bg-color-blueLight,.ms-bgc-bl,.ms-bg-color-blueLight-hover:hover,.ms-bg-color-blueLight-before:before,.ms-bgc-bl-h:hover,.ms-bgc-bl-b:before{background-color:#00bcf2}.ms-bg-color-tealDark,.ms-bgc-ted,.ms-bg-color-tealDark-hover:hover,.ms-bg-color-tealDark-before:before,.ms-bgc-ted-h:hover,.ms-bgc-ted-b:before{background-color:#004b50}.ms-bg-color-teal,.ms-bgc-t,.ms-bg-color-teal-hover:hover,.ms-bg-color-teal-before:before,.ms-bgc-t-h:hover,.ms-bgc-t-b:before{background-color:#008272}.ms-bg-color-tealLight,.ms-bgc-tel,.ms-bg-color-tealLight-hover:hover,.ms-bg-color-tealLight-before:before,.ms-bgc-tel-h:hover,.ms-bgc-tel-b:before{background-color:#00b294}.ms-bg-color-greenDark,.ms-bgc-gd,.ms-bg-color-greenDark-hover:hover,.ms-bg-color-greenDark-before:before,.ms-bgc-gd-h:hover,.ms-bgc-gd-b:before{background-color:#004b1c}.ms-bg-color-green,.ms-bgc-g,.ms-bg-color-green-hover:hover,.ms-bg-color-green-before:before,.ms-bgc-g-h:hover,.ms-bgc-g-b:before{background-color:#107c10}.ms-bg-color-greenLight,.ms-bgc-gl,.ms-bg-color-greenLight-hover:hover,.ms-bg-color-greenLight-before:before,.ms-bgc-gl-h:hover,.ms-bgc-gl-b:before{background-color:#bad80a}.ms-border-color-yellow,.ms-bcl-y,.ms-border-color-yellow-hover:hover,.ms-border-color-yellow-before:before,.ms-bcl-y-h:hover,.ms-bcl-y-b:before{border-color:#ffb900}.ms-border-color-yellowLight,.ms-bcl-yl,.ms-border-color-yellowLight-hover:hover,.ms-border-color-yellowLight-before:before,.ms-bcl-yl-h:hover,.ms-bcl-yl-b:before{border-color:#fff100}.ms-border-color-orange,.ms-bcl-o,.ms-border-color-orange-hover:hover,.ms-border-color-orange-before:before,.ms-bcl-o-h:hover,.ms-bcl-o-b:before{border-color:#d83b01}.ms-border-color-orangeLight,.ms-bcl-ol,.ms-border-color-orangeLight-hover:hover,.ms-border-color-orangeLight-before:before,.ms-bcl-ol-h:hover,.ms-bcl-ol-b:before{border-color:#ff8c00}.ms-border-color-redDark,.ms-bcl-rd,.ms-border-color-redDark-hover:hover,.ms-border-color-redDark-before:before,.ms-bcl-rd-h:hover,.ms-bcl-rd-b:before{border-color:#a80000}.ms-border-color-red,.ms-bcl-r,.ms-border-color-red-hover:hover,.ms-border-color-red-before:before,.ms-bcl-r-h:hover,.ms-bcl-r-b:before{border-color:#e81123}.ms-border-color-magentaDark,.ms-bcl-md,.ms-border-color-magentaDark-hover:hover,.ms-border-color-magentaDark-before:before,.ms-bcl-md-h:hover,.ms-bcl-md-b:before{border-color:#5c005c}.ms-border-color-magenta,.ms-bcl-m,.ms-border-color-magenta-hover:hover,.ms-border-color-magenta-before:before,.ms-bcl-m-h:hover,.ms-bcl-m-b:before{border-color:#b4009e}.ms-border-color-magentaLight,.ms-bcl-ml,.ms-border-color-magentaLight-hover:hover,.ms-border-color-magentaLight-before:before,.ms-bcl-ml-h:hover,.ms-bcl-ml-b:before{border-color:#e3008c}.ms-border-color-purpleDark,.ms-bcl-pd,.ms-border-color-purpleDark-hover:hover,.ms-border-color-purpleDark-before:before,.ms-bcl-pd-h:hover,.ms-bcl-pd-b:before{border-color:#32145a}.ms-border-color-purple,.ms-bcl-p,.ms-border-color-purple-hover:hover,.ms-border-color-purple-before:before,.ms-bcl-p-h:hover,.ms-bcl-p-b:before{border-color:#5c2d91}.ms-border-color-purpleLight,.ms-bcl-pl,.ms-border-color-purpleLight-hover:hover,.ms-border-color-purpleLight-before:before,.ms-bcl-pl-h:hover,.ms-bcl-pl-b:before{border-color:#b4a0ff}.ms-border-color-blueDark,.ms-bcl-bd,.ms-border-color-blueDark-hover:hover,.ms-border-color-blueDark-before:before,.ms-bcl-bd-h:hover,.ms-bcl-bd-b:before{border-color:#002050}.ms-border-color-blueMid,.ms-bcl-bm,.ms-border-color-blueMid-hover:hover,.ms-border-color-blueMid-before:before,.ms-bcl-bm-h:hover,.ms-bcl-bm-b:before{border-color:#00188f}.ms-border-color-blue,.ms-bcl-blu,.ms-border-color-blue-hover:hover,.ms-border-color-blue-before:before,.ms-bcl-blu-h:hover,.ms-bcl-blu-b:before{border-color:#0078d7}.ms-border-color-blueLight,.ms-bcl-bl,.ms-border-color-blueLight-hover:hover,.ms-border-color-blueLight-before:before,.ms-bcl-bl-h:hover,.ms-bcl-bl-b:before{border-color:#00bcf2}.ms-border-color-tealDark,.ms-bcl-ted,.ms-border-color-tealDark-hover:hover,.ms-border-color-tealDark-before:before,.ms-bcl-ted-h:hover,.ms-bcl-ted-b:before{border-color:#004b50}.ms-border-color-teal,.ms-bcl-t,.ms-border-color-teal-hover:hover,.ms-border-color-teal-before:before,.ms-bcl-t-h:hover,.ms-bcl-t-b:before{border-color:#008272}.ms-border-color-tealLight,.ms-bcl-tel,.ms-border-color-tealLight-hover:hover,.ms-border-color-tealLight-before:before,.ms-bcl-tel-h:hover,.ms-bcl-tel-b:before{border-color:#00b294}.ms-border-color-greenDark,.ms-bcl-gd,.ms-border-color-greenDark-hover:hover,.ms-border-color-greenDark-before:before,.ms-bcl-gd-h:hover,.ms-bcl-gd-b:before{border-color:#004b1c}.ms-border-color-green,.ms-bcl-g,.ms-border-color-green-hover:hover,.ms-border-color-green-before:before,.ms-bcl-g-h:hover,.ms-bcl-g-b:before{border-color:#107c10}.ms-border-color-greenLight,.ms-bcl-gl,.ms-border-color-greenLight-hover:hover,.ms-border-color-greenLight-before:before,.ms-bcl-gl-h:hover,.ms-bcl-gl-b:before{border-color:#bad80a}.ms-font-color-yellow,.ms-fcl-y,.ms-font-color-yellow-hover:hover,.ms-font-color-yellow-before:before,.ms-fcl-y-h:hover,.ms-fcl-y-b:before{color:#ffb900}.ms-font-color-yellowLight,.ms-fcl-yl,.ms-font-color-yellowLight-hover:hover,.ms-font-color-yellowLight-before:before,.ms-fcl-yl-h:hover,.ms-fcl-yl-b:before{color:#fff100}.ms-font-color-orange,.ms-fcl-o,.ms-font-color-orange-hover:hover,.ms-font-color-orange-before:before,.ms-fcl-o-h:hover,.ms-fcl-o-b:before{color:#d83b01}.ms-font-color-orangeLight,.ms-fcl-ol,.ms-font-color-orangeLight-hover:hover,.ms-font-color-orangeLight-before:before,.ms-fcl-ol-h:hover,.ms-fcl-ol-b:before{color:#ff8c00}.ms-font-color-redDark,.ms-fcl-rd,.ms-font-color-redDark-hover:hover,.ms-font-color-redDark-before:before,.ms-fcl-rd-h:hover,.ms-fcl-rd-b:before{color:#a80000}.ms-font-color-red,.ms-fcl-r,.ms-font-color-red-hover:hover,.ms-font-color-red-before:before,.ms-fcl-r-h:hover,.ms-fcl-r-b:before{color:#e81123}.ms-font-color-magentaDark,.ms-fcl-md,.ms-font-color-magentaDark-hover:hover,.ms-font-color-magentaDark-before:before,.ms-fcl-md-h:hover,.ms-fcl-md-b:before{color:#5c005c}.ms-font-color-magenta,.ms-fcl-m,.ms-font-color-magenta-hover:hover,.ms-font-color-magenta-before:before,.ms-fcl-m-h:hover,.ms-fcl-m-b:before{color:#b4009e}.ms-font-color-magentaLight,.ms-fcl-ml,.ms-font-color-magentaLight-hover:hover,.ms-font-color-magentaLight-before:before,.ms-fcl-ml-h:hover,.ms-fcl-ml-b:before{color:#e3008c}.ms-font-color-purpleDark,.ms-fcl-pd,.ms-font-color-purpleDark-hover:hover,.ms-font-color-purpleDark-before:before,.ms-fcl-pd-h:hover,.ms-fcl-pd-b:before{color:#32145a}.ms-font-color-purple,.ms-fcl-p,.ms-font-color-purple-hover:hover,.ms-font-color-purple-before:before,.ms-fcl-p-h:hover,.ms-fcl-p-b:before{color:#5c2d91}.ms-font-color-purpleLight,.ms-fcl-pl,.ms-font-color-purpleLight-hover:hover,.ms-font-color-purpleLight-before:before,.ms-fcl-pl-h:hover,.ms-fcl-pl-b:before{color:#b4a0ff}.ms-font-color-blueDark,.ms-fcl-bd,.ms-font-color-blueDark-hover:hover,.ms-font-color-blueDark-before:before,.ms-fcl-bd-h:hover,.ms-fcl-bd-b:before{color:#002050}.ms-font-color-blueMid,.ms-fcl-bm,.ms-font-color-blueMid-hover:hover,.ms-font-color-blueMid-before:before,.ms-fcl-bm-h:hover,.ms-fcl-bm-b:before{color:#00188f}.ms-font-color-blue,.ms-fcl-blu,.ms-font-color-blue-hover:hover,.ms-font-color-blue-before:before,.ms-fcl-blu-h:hover,.ms-fcl-blu-b:before{color:#0078d7}.ms-font-color-blueLight,.ms-fcl-bl,.ms-font-color-blueLight-hover:hover,.ms-font-color-blueLight-before:before,.ms-fcl-bl-h:hover,.ms-fcl-bl-b:before{color:#00bcf2}.ms-font-color-tealDark,.ms-fcl-ted,.ms-font-color-tealDark-hover:hover,.ms-font-color-tealDark-before:before,.ms-fcl-ted-h:hover,.ms-fcl-ted-b:before{color:#004b50}.ms-font-color-teal,.ms-fcl-t,.ms-font-color-teal-hover:hover,.ms-font-color-teal-before:before,.ms-fcl-t-h:hover,.ms-fcl-t-b:before{color:#008272}.ms-font-color-tealLight,.ms-fcl-tel,.ms-font-color-tealLight-hover:hover,.ms-font-color-tealLight-before:before,.ms-fcl-tel-h:hover,.ms-fcl-tel-b:before{color:#00b294}.ms-font-color-greenDark,.ms-fcl-gd,.ms-font-color-greenDark-hover:hover,.ms-font-color-greenDark-before:before,.ms-fcl-gd-h:hover,.ms-fcl-gd-b:before{color:#004b1c}.ms-font-color-green,.ms-fcl-g,.ms-font-color-green-hover:hover,.ms-font-color-green-before:before,.ms-fcl-g-h:hover,.ms-fcl-g-b:before{color:#107c10}.ms-font-color-greenLight,.ms-fcl-gl,.ms-font-color-greenLight-hover:hover,.ms-font-color-greenLight-before:before,.ms-fcl-gl-h:hover,.ms-fcl-gl-b:before{color:#bad80a}</style>
        <style>.owa-font-compose{font-family:Calibri,Arial,Helvetica,sans-serif}.owa-bg-color-neutral-orange{background-color:#D82300}.owa-bg-color-neutral-red{background-color:#A80F22}.owa-bg-color-neutral-yellow{background-color:#FFEE94}.owa-bg-color-neutral-green{background-color:#5DD255}.owa-bg-color-cal-green{background-color:#68A490}.owa-bg-color-cal-purple{background-color:#976CBE}.owa-border-color-neutral-orange{border-color:#D82300}.owa-border-color-neutral-red{border-color:#A80F22}.owa-border-color-neutral-yellow{border-color:#FFEE94}.owa-border-color-neutral-green{border-color:#5DD255}.owa-border-color-cal-green{border-color:#68A490}.owa-border-color-cal-purple{border-color:#976CBE}.owa-color-neutral-darkBlue{color:#00008B}.owa-color-neutral-orange{color:#D82300}.owa-color-neutral-red{color:#A80F22}.owa-color-neutral-yellow{color:#FFEE94}.owa-color-neutral-green{color:#5DD255}.owa-color-neutral-green-alt,.owa-color-neutral-green-alt:before{color:#107c10}.owa-color-cal-green{color:#68A490}.owa-color-cal-green-hover{color:#377353}.owa-color-cal-purple{color:#976CBE}.owa-color-cal-purple-hover{color:#67397B}.owa-color-cal-blue{color:#71C2EB}.owa-color-cal-brown{color:#AB9B81}.owa-color-cal-green-alt{color:#A9C47A}.owa-color-cal-grey{color:#999B9C}.owa-color-cal-orange{color:#E6975C}.owa-color-cal-pink{color:#CA6AAB}.owa-color-cal-red{color:#D57272}.owa-color-cal-teal{color:#7BCBC4}.owa-color-cal-yellow{color:#E3B75D}.owa-color-folder-brown{color:#EAC282}.ms-font-color-red{color:#E81123}.ms-font-color-redDark{color:#A80000}</style>

    
        <script>
         var HeaderImageTemplate = ".o365cs-topnavBGImage{background:url('prem/16.1409.12.2104857/resources/themes/@theme/images/0/headerbgmaing2.png'),url('prem/16.1409.12.2104857/resources/themes/@theme/images/0/headerbgmaing2.gif');width:1px;height:1px}";
        </script>
        <style id="HeaderImages"></style>
    

    <script>
        
        (function () {
            if ("-ms-user-select" in document.documentElement.style && navigator.userAgent.match(/IEMobile\/10\.0/)) {
                var msViewportStyle = document.createElement("style");
                msViewportStyle.appendChild(
                    document.createTextNode("@-ms-viewport{width:auto!important}")
                    );
                document.getElementsByTagName("head")[0].appendChild(msViewportStyle);
            }
        })();
    </script>

    <style>
        body
        {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
        }
 
        #owaLoading
        {
            background-color: #FFF;
            width: 100%;
            height: 100%;
            position: absolute;
            z-index: 10001;
        }
        
        #loadingLogo, #loadingSpinner, #statusText
        {
            display: block;
            margin-left: auto;
            margin-right: auto;
            text-align: center;
        }
        
        #loadingLogo
        {
            padding-top: 174px;
            padding-bottom: 22px;
        }
        
        .tnarrow #loadingLogo
        {
            padding-top: 52px;
        }

        #statusText
        {
            color: #0072c6;
            font-family: 'wf_segoe-ui_normal', 'Segoe UI', 'Segoe WP', Tahoma, Arial, sans-serif;
            font-size: 12px;
            margin-top: 20px;
        }

        #statusText > span
        {
            display: none;
            margin-left: auto;
            margin-right: auto;
            line-height: 11px;
        }

        #statusText.script > .script
        {
            display: inline;
        }

        #statusText.scriptDelay > .scriptDelay
        {
            display: inline;
        }

        #statusText.data > .data
        {
            display: inline;
        }

        #statusText.dataDelay > .dataDelay
        {
            display: inline;
        }

        #statusText.render > .render
        {
            display: inline;
        }
    
    </style>
  </head>
    <!--[if IE 8 ]> <body class="ie8 ms-fwt-r"> <![endif]-->
    <!--[if (gte IE 9)|!(IE)]><!--> <body class="notIE8 ms-fwt-r"> <!--<![endif]-->
    
    <div id="owaLoading">
      <img id="loadingLogo" alt="Outlook" src='data:image/png;base64,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'/>  
      

    <style>
        .prog_bar_container {
            width: 300px;
            height: 5px;
            overflow: hidden;
            background-color: #cccccc;
            margin-left: auto;
            margin-right: auto;
            text-align: center;
        }
        .prog_bar_keyframer_data {
            width: 0%;
            max-width: 100%;
            height: 5px;
            overflow: hidden;
            position: relative;
            background-color: #0078d7;
            -webkit-animation: progmove 20s 1 forwards;
            -moz-animation: progmove 20s 1 forwards;
            -ms-animation: progmove 20s 1 forwards;
            -o-animation: progmove 20s 1 forwards;
            animation: progmove 20s 1 forwards;
            -webkit-animation-timing-function: linear;
            -moz-animation-timing-function: linear;
            -ms-animation-timing-function: linear;
            -o-animation-timing-function: linear;
            animation-timing-function: linear;
        }
        .prog_bar_keyframer_data div {
            position: absolute;
            width: 0;
            height: 0;
        }
        .prog_bar_keyframer_data .animation {
            -webkit-animation-duration: 1s;
            -moz-animation-duration: 1s;
            -ms-animation-duration: 1s;
            -o-animation-duration: 1s;
            animation-duration: 1s;
            -webkit-animation-timing-function: linear;
            -moz-animation-timing-function: linear;
            -ms-animation-timing-function: linear;
            -o-animation-timing-function: linear;
            animation-timing-function: linear;
            -webkit-animation-direction: normal;
            -moz-animation-direction: normal;
            -ms-animation-direction: normal;
            -o-animation-direction: normal;
            animation-direction: normal;
            -webkit-animation-iteration-count: infinite;
            -moz-animation-iteration-count: infinite;
            -ms-animation-iteration-count: infinite;
            -o-animation-iteration-count: infinite;
            animation-iteration-count: infinite;
            -webkit-animation-delay: 0.687s;
            -moz-animation-delay: 0.687s;
            -ms-animation-delay: 0.687s;
            -o-animation-delay: 0.687s;
            animation-delay: 0.687s;
        }
        .prog_bar_keyframer_data .texture {
            position: absolute;
            background: no-repeat;
            background-size: cover;
        }
        .prog_bar_keyframer_data .layer-1-anchor {
            left: -500px;
            top: -3px;
        }
        .prog_bar_keyframer_data .layer-1-translateX {
            -webkit-animation-name: prog_bar_keyframer_data-layer-1-translateX;
            -moz-animation-name: prog_bar_keyframer_data-layer-1-translateX;
            -ms-animation-name: prog_bar_keyframer_data-layer-1-translateX;
            -o-animation-name: prog_bar_keyframer_data-layer-1-translateX;
            animation-name: prog_bar_keyframer_data-layer-1-translateX;
        }
        @-webkit-keyframes prog_bar_keyframer_data-layer-1-translateX {
            0% {
                -webkit-transform: translateX(-50px);
                -webkit-animation-timing-function: cubic-bezier(0.85, 0, 0.64, 1);
            }
            98.36% {
                -webkit-transform: translateX(350px);
                -webkit-animation-timing-function: linear;
            }
            100% {
                -webkit-transform: translateX(350px);
            }
        }
        @-moz-keyframes prog_bar_keyframer_data-layer-1-translateX {
            0% {
                -moz-transform: translateX(-50px);
                -moz-animation-timing-function: cubic-bezier(0.85, 0, 0.64, 1);
            }
            98.36% {
                -moz-transform: translateX(350px);
                -moz-animation-timing-function: linear;
            }
            100% {
                -moz-transform: translateX(350px);
            }
        }
        @-ms-keyframes prog_bar_keyframer_data-layer-1-translateX {
            0% {
                -ms-transform: translateX(-50px);
                -ms-animation-timing-function: cubic-bezier(0.85, 0, 0.64, 1);
            }
            98.36% {
                -ms-transform: translateX(350px);
                -ms-animation-timing-function: linear;
            }
            100% {
                -ms-transform: translateX(350px);
            }
        }
        @-o-keyframes prog_bar_keyframer_data-layer-1-translateX {
            0% {
                -o-transform: translateX(-50px);
                -o-animation-timing-function: cubic-bezier(0.85, 0, 0.64, 1);
            }
            98.36% {
                -o-transform: translateX(350px);
                -o-animation-timing-function: linear;
            }
            100% {
                -o-transform: translateX(350px);
            }
        }
        @keyframes prog_bar_keyframer_data-layer-1-translateX {
            0% {
                transform: translateX(-50px);
                animation-timing-function: cubic-bezier(0.85, 0, 0.64, 1);
            }
            98.36% {
                transform: translateX(350px);
                animation-timing-function: linear;
            }
            100% {
                transform: translateX(350px);
            }
        }
        .prog_bar_keyframer_data .layer-1-content {
            width: 800px;
            height: 10px;
            opacity: 0.85;
            background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyAAAAAKCAYAAABMrzqlAAAACXBIWXMAAAABAAAAAQE4IvRAAAAAJHpUWHRDcmVhdG9yAAAImXNMyU9KVXBMK0ktUnBNS0tNLikGAEF6Bs5qehXFAAAAxklEQVR4nO3bwQ3CIAAFUDBO4hyO4ZgeHcE5XEVPJg1V0lJaSvPexYAf8pv0IGkNAQAAAAAA4GjiWhvfn6+1toYQxvdubiwrKzsvu/d+VbO36+URANjMuXUBWChO+JyS6S3bS0/Z42d76ZnLOoAAbOjUugBQ5N26AABACQcQAABgMw4gACzhaRwAs/gPCL1Lf/x8x3Ewl77znc7/Gv/7bkpm6ZraPUvWlHQ4Qs+SNTWvbTje87Xl9mhxj9foCQAAAAAAAACFPsTMCankaacdAAAAAElFTkSuQmCC');
        }

        @-webkit-keyframes progmove { 
         from {}
         to { width: 95% }
        }

        @-moz-keyframes progmove { 
            from {}

            to { width: 95% }
        }

        @-ms-keyframes progmove { 
            from { }
            to { width: 95% }
        }

        @keyframes progmove { 
            from { }
            to { width: 95% }
        }
      </style>
      <div class="prog_bar_container">
        <div id="progressBar" class="prog_bar_keyframer_data">
            <div class="layer-1-translateX animation">
                <div class="layer-1-anchor">
                    <div class="layer-1-content texture "></div>
                </div>
            </div>
        </div>
      </div>
    <script>
            pbar.startScriptLoad();
    </script>
    
        <div id = "statusText" class="script">
            <p>Opening your mailbox...</p>
        </div>
    </div>
    

    <div id='preloadDiv' style="visibility:hidden;height: 1px; margin-bottom: -1px; overflow: hidden;">
        
        <iframe id="traceFrame" style="display:none" src="https://xsi.outlook.com/?636101836514719919"></iframe>
        
        
        <script>
            try{
                var userSpecificsLoaded = false,
                styleResources = [],
                userScriptResources = [],
                clientTheme = 'base',
                userCultureVar = 'es-CO',
                userCultureRtl = false,
                sver = '16.1409.12.2104857',
                besver = '15.1.629.8',
                userLanguageVar = 'es';
                osfLanguageVar = 'es';
                navFrontEndServer = 'BN3PR0401CA0004.NAMPRD04.PROD.OUTLOOK.COM',
                navBackEndServer = 'BN3PR10MB0162',
                cdnEndPointNameForBootResources = '';
                cdnEndPointNameForNonBootResources = 'https://r1.res.office365.com/';
                layout = 'mouse';
                stylesLocale = '0';
                
                pbar.scriptLoadCompleted();
                
                setClientId(window.clientId);
                lcver = updateLastClientVersion(sver);
                var slabManifest = {"deferredjquery":{"Dependencies":[],"Types":[],"Templates":[],"Styles":[],"Configurations":[{"layout":"Mouse","type":"DeferredJQueryComponent"}],"Sources":[{"layout":"Mouse","name":"jquery.owa.bundle.mouse.js"},{"layout":"Mouse","name":"microsoft.owa.boot.deferred.jquery.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["deferredjquery"]},"textboys":{"Dependencies":[],"Types":[],"Templates":[],"Styles":[],"Configurations":[{"type":"TextBoysComponents"}],"Sources":[{"name":"microsoft.owa.application.textboys.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["textboys"]},"readingpane":{"Dependencies":["nonbootwebservices","recipientwell","personacontrol","attachments","deferredboot","mailcommon"],"Types":["ReadingPaneViewModelBase","IMarkAsReadConversationActionFactory","IItemReadingPaneViewModelFactory","IItemReadingPaneViewModelPopOutFactory","IItemAttachmentPopOutFactory"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.application.readingpane.mouse.css","type":"Themed"}],"Configurations":[{"type":"ReadingPaneComponent"}],"Sources":[{"name":"microsoft.owa.application.readingpane.js"},{"layout":"Mouse","name":"microsoft.owa.application.readingpane.mouse.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["readingpane"]},"emojiprocessing":{"Dependencies":["deferredboot"],"Types":["IEmojiProcessor"],"Templates":[],"Styles":[{"name":"emoji.css","type":"Themed"}],"Configurations":[{"type":"EmojiProcessingComponent"}],"Sources":[{"name":"microsoft.owa.core.controls.emojiprocessing.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["emojiprocessing"]},"extendedmaillistview":{"Dependencies":["nonbootwebservices","deferredboot"],"Types":["IExtendedListViewModelFactory","IExtendedFrequentlyUsedMailFolders","IJunkUtils","IKeyboardShortcutsViewModel"],"Templates":["ExpandedConversationListView","JumpToListView","KeyboardShortcutsTemplate","ReportPhishView"],"Styles":[{"layout":"Mouse","name":"microsoft.owa.extendedmaillistview.mouse.css","type":"Themed"}],"Configurations":[{"type":"ExtendedMailListViewComponent"}],"Sources":[{"name":"microsoft.owa.extendedmaillistview.js"},{"layout":"Mouse","name":"microsoft.owa.extendedmaillistview.mouse.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["extendedmaillistview"]},"triageshared":{"Dependencies":["lightning"],"Types":["IHoverActionViewModelFactory","IModuleSwitcherViewModel"],"Templates":["HoverActionBarView","ModuleSwitcherDeferredView"],"Styles":[{"layout":"Mouse","name":"microsoft.owa.triageshared.mouse.css","type":"Themed"}],"Configurations":[{"type":"TriageSharedComponent"}],"Sources":[{"name":"microsoft.owa.triageshared.js"},{"name":"microsoft.owa.triageshared.mouse.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["triageshared"]},"editorEngine":{"Dependencies":["nonbootwebservices"],"Types":[],"Templates":[],"Styles":[],"Configurations":[],"Sources":[{"name":"microsoftajax.js"},{"name":"ms.rte.js"},{"name":"rteinit.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["editorEngine"]},"editor":{"Dependencies":["nonbootwebservices","personacontrol","commoncompose"],"Types":["Editor"],"Templates":[],"Styles":[{"layout":"Mouse","name":"nbsprite1.mouse.css","type":"Sprite"},{"layout":"Mouse","name":"microsoft.owa.core.controls.editorbase.mouse.css","type":"Themed"}],"Configurations":[{"type":"EditorComponent"}],"Sources":[{"name":"microsoft.owa.core.controls.editorbase.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.commonstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["editor"]},"richtexteditor":{"Dependencies":["nonbootwebservices","commoncompose","editor"],"Types":[],"Templates":["RTEWrapperView"],"Styles":[{"layout":"Mouse","name":"microsoft.owa.core.controls.richtexteditor.mouse.css","type":"Themed"}],"Configurations":[{"type":"RichTextEditorComponent"}],"Sources":[{"name":"microsoft.owa.core.controls.richtexteditor.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["richtexteditor"]},"metile":{"Dependencies":["shellcore"],"Types":["IMeTileViewModel"],"Templates":["MeTileMouseView.MeTileMenu","MeTileMouseView.MeTilePhoto","MeTileMouseView.MeTileNoPhoto","MeFlexPaneHeaderButtonView"],"Styles":[],"Configurations":[{"type":"MeTileComponent"}],"Sources":[{"name":"microsoft.o365.shellg2.metile.owa.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["metile"]},"emoji":{"Dependencies":["nonbootwebservices","deferredboot","commoncompose","editor","emojiprocessing"],"Types":["IEmojiFactory"],"Templates":[],"Styles":[{"layout":"Mouse","name":"nbsprite1.mouse.css","type":"Sprite"},{"layout":"Mouse","name":"microsoft.owa.core.controls.emojiresources.mouse.css","type":"Themed"}],"Configurations":[{"type":"EmojiResourcesComponent"}],"Sources":[{"layout":"Mouse","name":"microsoft.owa.core.controls.emojiresources.js"}],"PackagedSources":[],"Strings":[{"layout":"Mouse","name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"},{"layout":"Mouse","name":"microsoft.owa.core.editor.emoji.strings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["emoji"]},"peoplecore":{"Dependencies":["deferredboot","nonbootwebservices"],"Types":["Persona","IUpdatePersonaActionFactory","ICreatePersonaResponseProcessorFactory","IDeletePersonaResponseProcessorFactory","IUpdatePersonaResponseProcessorFactory"],"Templates":[],"Styles":[],"Configurations":[{"type":"PeopleCoreComponent"}],"Sources":[{"name":"microsoft.owa.people.core.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.pcstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["peoplecore"]},"contactmanagement":{"Dependencies":["deferredboot","nonbootwebservices","peoplecore"],"Types":[],"Templates":[],"Styles":[],"Configurations":[{"type":"ContactManagementComponent"}],"Sources":[{"name":"microsoft.owa.people.contactmanagement.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["contactmanagement"]},"photoupload":{"Dependencies":["nonbootwebservices"],"Types":[],"Templates":[],"Styles":[],"Configurations":[{"type":"PhotoUploadComponent"}],"Sources":[{"name":"microsoft.owa.people.photoupload.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["photoupload"]},"popout":{"Dependencies":["deferredboot","nonbootwebservices"],"Types":["IPopOutViewModel","IPopOutHelper"],"Templates":["Wrapper.PopOut"],"Styles":[],"Configurations":[{"type":"PopOutComponent"}],"Sources":[{"name":"microsoft.owa.core.popout.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["popout"]},"nonboot":{"Dependencies":["nonbootwebservices","calendarwebservices","attachments","attachmentwell","editor","peoplecore","contactmanagement","photoupload","calendarcore","calendarcontrols","calendarsurface","commoncompose","composepersonacard","mailcompose","recipientwell","meetingmessage","personacontrol","personacardfacade","peoplehub","findpeople","calendarmeetingforms","readpersoncard","deferredboot","offline","mailcommon","moderngroupsshared","moderngroupscalendarshared"],"Types":["IAddEventToMyCalendarResponseProcessorFactory","IBingSearchSuggestionAdaptorViewModel","ICreateAttachmentResponseProcessorFactory","IDeleteAttachmentResponseProcessorFactory","IDeletePlaceResponseProcessorFactory","IPerformReminderActionResponseProcessorFactory","IDeepLinkService","IReminderDeepLinkHandler","IOfflineHelpProvider","ITelURIPersonaCardPopupViewModelFactory","ISendNotificationProviderViewModel","ISendFailureNotificationProviderViewModel","ITaskReadingPaneViewModelFactory","ISendNotificationProviderViewModel","ISendFailureNotificationProviderViewModel","IModuleHelpProvider","ITasksModuleViewModel","ITelURIPersonaCardPopupViewModelFactory","IOpenAnotherMailboxViewModel","IExtendedSharedFolderViewModel","IMailErrorHandler","IMailFolderPermissionsDialogViewModel","IPopOutMailboxDataContextFactory","IGetComplianceConfigurationAction","IDiagnosticModuleViewDumper","IUnsupportedItemReadingPaneViewModel","ILinkSummaryCardViewModelFactory","IApprovalRequestHeaderViewModelFactory","IUMMessagePostHeaderViewModelFactory","IModernGroupMembershipRequestHeaderViewModelFactory","IPersonaToNABContactDiffCalculatorFactory","IUploadPhotoViewModelFactory","ILinkSummaryCardViewModelFactory","IUserOofNotificationProvider","IFolderPickerContainer","IDumpsterPopOutViewModelFactory","IFlowHomeScreenViewModelFactory","ITaskReadingPaneViewModelPopOutFactory","IOwaOptionPeoplePickerViewModelFactory","IOwaOptionRichPeoplePickerViewModelFactory"],"Templates":["CategoryManagementContentView","ComposeScreenView","MessageDetailsView","ItemPrintingPaneView"],"Styles":[{"layout":"Mouse","name":"nbsprite1.mouse.css","type":"Sprite"},{"layout":"Mouse","name":"nonboot.mouse.css","type":"Themed"}],"Configurations":[{"type":"CoreModelsComponent"},{"type":"CoreViewModelsComponent"},{"type":"ApplicationViewModelsComponent"},{"type":"ApplicationViewsComponent"}],"Sources":[{"name":"microsoft.owa.core.models.js"},{"name":"microsoft.owa.core.viewmodels.js"},{"name":"microsoft.owa.core.views.js"},{"layout":"Mouse","name":"microsoft.owa.core.views.mouse.js"},{"name":"microsoft.owa.application.viewmodels.js"},{"name":"microsoft.owa.application.views.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.commonstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.meetingmsgstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.options.strings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.oobestrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["nonboot"]},"react":{"Dependencies":[],"Types":[],"Templates":[],"Styles":[],"Configurations":[{"type":"ClientNextFrameworkComponent"}],"Sources":[{"name":"owa.clientnext.common.js"},{"name":"owa.clientnext.application.js"},{"name":"microsoft.owa.clientnext.framework.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["react"]},"offline":{"Dependencies":["deferredboot","deferredwebservices","calendarwebservices","nonbootwebservices","mailcommon"],"Types":["IAppStatusBarViewModel","IAttachmentInfoItemStore","IAttachmentsCleanupManager","IClientStore","IInlineImageItemStore","IItemStoreGetterFactory","INotificationHandlerProxyFactory","IOfflineManager","IPageDataPayloadGenerator","IPageDataPayloadPersisterFactory","ISyncFolderSettingProcessor","ISyncController","ISyncManagerFactory","ISyncManagerSingleton","IOfflineCreateItemResponseProcessorFactory"],"Templates":[],"Styles":[],"Configurations":[{"type":"OfflineBootComponent"},{"type":"CoreSyncComponent"},{"type":"CoreStorageComponent"}],"Sources":[{"name":"microsoft.owa.core.storage.framework.js"},{"name":"microsoft.owa.core.storage.js"},{"name":"microsoft.owa.core.offline.boot.js"},{"name":"microsoft.owa.core.sync.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["offline"]},"recipientwell":{"Dependencies":["deferredboot","nonbootwebservices","peoplecore","personacontrol","mailcommon"],"Types":["IRecipientWellViewModelFactory","IAtMentionsHandler"],"Templates":["ReadWriteRecipientWellView"],"Styles":[{"layout":"Mouse","name":"microsoft.owa.core.recipientwell.mouse.css","type":"Themed"}],"Configurations":[{"type":"RecipientWellComponent"}],"Sources":[{"name":"microsoft.owa.core.recipientwell.js"},{"layout":"Mouse","name":"microsoft.owa.core.recipientwell.mouse.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["recipientwell"]},"introductionPeek":{"Dependencies":["nonbootwebservices","deferredboot"],"Types":["IIntroductionControllerFactory","IIntroductionPeekContentViewModelFactory"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.core.introductionpeek.mouse.css","type":"Themed"}],"Configurations":[{"type":"IntroductionPeekComponent"}],"Sources":[{"name":"microsoft.owa.core.introductionpeek.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["introductionPeek"]},"attachmentsfilepicker":{"Dependencies":["nonbootwebservices","recipientwell","personacontrol","attachments","deferredboot"],"Types":["IAttachmentsFilePickerPanelViewModel","IAttachmentProviderItemViewModelFactory","IAttachmentLinksBuilder","IAttachmentDataProviderMap"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.attachments.filepicker.views.mouse.css","type":"Themed"}],"Configurations":[{"type":"AttachmentsFilePickerViewModelsComponent"},{"type":"AttachmentsFilePickerViewsComponent"}],"Sources":[{"name":"microsoft.owa.attachments.filepicker.models.js"},{"name":"microsoft.owa.attachments.filepicker.viewmodels.js"},{"name":"microsoft.owa.attachments.filepicker.views.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.attach.fp.strings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["attachmentsfilepicker"]},"shellcore":{"Dependencies":[],"Types":["IGlobalMiniaturesViewModel"],"Templates":["SharedHeaderMouseView"],"Styles":[{"layout":"Mouse","name":"o365shellg2coreowa.mouse.css","type":"Themed"}],"Configurations":[{"type":"O365ShellCoreG2Component"}],"Sources":[{"name":"microsoft.o365.suiteutil.js"},{"name":"microsoft.o365.clientlogging.js"},{"name":"microsoft.o365.clientperformance.js"},{"name":"microsoft.o365.shellg2.coremin.js"},{"name":"microsoft.o365.shellg2.core.owa.js"},{"layout":"Mouse","name":"microsoft.o365.shellg2.core.owa.mouse.js"},{"name":"microsoft.owa.shellcoreg2.o365.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.o365.shellg2.strings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["shellcore"]},"shellplus":{"Dependencies":["deferredboot","calendarwebservices","nonbootwebservices","shellcore","calendarcore","peoplecore","calendarmeetingforms","navigation","mailcompose"],"Types":["IGlobalNotificationTrayViewModel","IGlobalMiniaturesPlusViewModel","IGlobalAppsManager","IFlexPanePanelViewModel","IUserThemesHandler","IChangeThemeMenuItemClickHandler","INFDContentProvider","ICalloutViewFactory"],"Templates":["FlexPanePanelView"],"Styles":[{"layout":"Mouse","name":"o365shellg2plusowa.mouse.css","type":"Themed"}],"Configurations":[{"type":"CoreModelsComponent"},{"type":"O365ShellPlusG2Component"}],"Sources":[{"name":"microsoft.owa.core.models.js"},{"name":"msrcrypto-aes.js"},{"name":"msrcrypto-aes-fix.js"},{"name":"microsoft.o365.suiteserviceproxycommon.js"},{"name":"microsoft.o365.suiteserviceproxy.js"},{"name":"microsoft.owa.suiteapinotifications.js"},{"name":"microsoft.o365.suiteapi.owa.js"},{"layout":"Mouse","name":"microsoft.o365.suiteapiskypeintegration.js"},{"name":"microsoft.o365.shellg2.owa.js"},{"layout":"Mouse","name":"microsoft.o365.shellg2.owa.mouse.js"},{"name":"microsoft.owa.shellplusg2.o365.js"},{"layout":"Mouse","name":"meidp.min.js"},{"name":"cardmetadata.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"},{"name":"microsoft.o365.shellg2.settingstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["shellplus"]},"documentattachment":{"Dependencies":["deferredwebservices","nonbootwebservices","recipientwell","attachments"],"Types":["IDocumentAttachmentViewModelFactory"],"Templates":["DocumentAttachmentView"],"Styles":[],"Configurations":[{"type":"CollabDocumentAttachmentComponent"}],"Sources":[{"name":"microsoft.owa.attachments.collabdocattachment.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["documentattachment"]},"attachments":{"Dependencies":["nonbootwebservices","recipientwell","personacontrol","deferredboot"],"Types":["IAttachmentPolicyChecker","IAttachmentPropertyChecker","IAttachmentViewModelFactory","IUriFileAttachmentViewModelFactory","IDownloadAuthenticator","IDownloadAuthenticatorFactory","IFileReader"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.core.attachments.mouse.css","type":"Themed"}],"Configurations":[{"type":"AttachmentsComponent"}],"Sources":[{"name":"microsoft.owa.core.attachments.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["attachments"]},"attachmentwell":{"Dependencies":["nonbootwebservices","attachments","recipientwell","commoncompose","deferredboot"],"Types":["IAttachmentWellViewModelFactory","IWellKnownFileTypes"],"Templates":["AttachmentWellViewWrapper","AttachmentFilmStripView"],"Styles":[{"layout":"Mouse","name":"ewsprite1.mouse.css","type":"Sprite"},{"layout":"Mouse","name":"microsoft.owa.attachments.extendedattachmentwell.mouse.css","type":"Themed"}],"Configurations":[{"type":"ExtendedAttachmentWellComponent"}],"Sources":[{"name":"suiteextensions.js"},{"name":"suiteextensionscontrols.js"},{"name":"microsoft.owa.attachments.extendedattachmentwell.js"},{"layout":"Mouse","name":"microsoft.owa.attachments.extendedattachmentwell.mouse.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.commonstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["attachmentwell"]},"attachmentpreview":{"Dependencies":["nonbootwebservices","recipientwell","readingpane","deferredboot","documentattachment","imagealbumviewer","mailcompose","quickcompose"],"Types":["IAttachmentViewModelPopoutFactory","IAttachmentPreviewViewModelFactory","IFilePreviewViewModelFactory","ILightBoxViewModelFactory"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.attachments.collabattachmentpreview.mouse.css","type":"Themed"}],"Configurations":[{"type":"CollabAttachmentPreviewComponent"}],"Sources":[{"name":"microsoft.owa.attachments.collabattachmentpreview.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.attach.pr.strings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.commonstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["attachmentpreview"]},"files":{"Dependencies":["nonbootwebservices","personacontrol","deferredboot","attachments","moderngroupsnavigation","moderngroupscore","moderngroupsheader"],"Types":["IFilesContainerViewModel","IGroupFilesModuleContentViewModel"],"Templates":["FilesContainerView"],"Styles":[{"layout":"Mouse","name":"fsprite1.mouse.css","type":"Sprite"},{"layout":"Mouse","name":"microsoft.owa.files.mouse.css","type":"Themed"}],"Configurations":[{"type":"FilesComponent"}],"Sources":[{"name":"microsoft.owa.files.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.filesstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["files"]},"groupsdiscovery":{"Dependencies":["moderngroupspeople","moderngroupsnavigation","peoplehub"],"Types":["IGroupsDiscoveryViewModelFactory"],"Templates":["GroupsDiscoveryView"],"Styles":[{"layout":"Mouse","name":"microsoft.owa.groupsdiscovery.mouse.css","type":"Themed"}],"Configurations":[{"type":"GroupsDiscoveryComponent"}],"Sources":[{"name":"microsoft.owa.groupsdiscovery.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["groupsdiscovery"]},"navigation":{"Dependencies":["deferredboot","nonbootwebservices","calendarcore"],"Types":["INavigationViewModel","ICalendarMiniatureQueryTableFactory","ICalendarMiniatureNextAppointmentManager"],"Templates":[],"Styles":[],"Configurations":[{"type":"NavigationViewModelsComponent"},{"type":"NavigationViewsComponent"}],"Sources":[{"name":"microsoft.owa.navigation.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.nav.strings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["navigation"]},"moderngroupsshared":{"Dependencies":["deferredboot","calendarwebservices"],"Types":[],"Templates":[],"Styles":[],"Configurations":[{"type":"ModernGroupsSharedComponent"}],"Sources":[{"name":"microsoft.owa.moderngroups.shared.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["moderngroupsshared"]},"moderngroupscalendarshared":{"Dependencies":["deferredboot","calendarwebservices"],"Types":[],"Templates":[],"Styles":[],"Configurations":[{"type":"ModernGroupsCalendarSharedComponent"}],"Sources":[{"name":"microsoft.owa.moderngroups.calendar.shared.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["moderngroupscalendarshared"]},"readpersoncard":{"Dependencies":["boot","deferredboot","nonbootwebservices","peoplecore","commoncompose","personacontrol","findpeople"],"Types":["IReadPersonaCardViewModelFactory","ICommunicationActionsProviderFactory"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.people.personcard.mouse.css","type":"Themed"}],"Configurations":[{"type":"ReadPersonCardComponent"}],"Sources":[{"name":"microsoft.owa.people.personcard.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.personcardstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["readpersoncard"]},"peoplewebservices":{"Dependencies":["calendarcore","calendarwebservices","deferredwebservices","findpeople","instantsearch"],"Types":["IFindInsightsActionFactory","IGetNextMeetingWithPersonActionFactory"],"Templates":[],"Styles":[],"Configurations":[{"type":"PeopleWebServicesComponent"}],"Sources":[{"name":"microsoft.owa.people.webservices.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["peoplewebservices"]},"groupcard":{"Dependencies":["deferredboot","composepersonacard","findpeople","peoplehub","personacontrol","readpersoncard","recipientwell","personaprofile"],"Types":["IGroupCardMemberPickerViewModelFactory","IGroupCardViewModelFactory","IContactListPaneViewModelFactory","IGroupPaneViewModelFactory"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.people.groupcard.mouse.css","type":"Themed"}],"Configurations":[{"type":"GroupCardComponent"}],"Sources":[{"name":"microsoft.owa.people.groupcard.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["groupcard"]},"composepersonacard":{"Dependencies":["deferredboot","nonbootwebservices","readpersoncard","calendarcontrols","editor"],"Types":["IComposePersonaCardViewModelFactory","IContactPropertySuggestionAdaptorViewModel"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.people.composepersonacard.mouse.css","type":"Themed"}],"Configurations":[{"type":"ComposePersonaCardComponent"}],"Sources":[{"name":"microsoft.owa.people.composepersonacard.js"},{"layout":"Mouse","name":"microsoft.owa.people.composepersonacard.mouse.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.personcardstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.bootcommonstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.strings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.commonstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["composepersonacard"]},"quickcompose":{"Dependencies":["deferredboot","nonbootwebservices","recipientwell","personacontrol","commoncompose","editor","attachments"],"Types":["IQuickComposeRecipientComponentFactory","IQuickComposeSendComponentFactory","IQuickComposeAttachmentComponentFactory","IQuickComposeEventAggregatorFactory","IMailInlineComposeConductorViewModelFactory"],"Templates":["QuickComposeViewWrapper","QuickReplyViewWrapper","InlineComposeViewWrapper","InlineComposeEmptyPlaceholderViewWrapper"],"Styles":[{"layout":"Mouse","name":"microsoft.owa.core.quickcompose.mouse.css","type":"Themed"}],"Configurations":[{"type":"QuickComposeComponent"}],"Sources":[{"name":"microsoft.owa.core.quickcompose.js"},{"layout":"Mouse","name":"microsoft.owa.core.quickcompose.mouse.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["quickcompose"]},"smime":{"Dependencies":["deferredboot","nonbootwebservices","recipientwell","commoncompose"],"Types":["ISmimeCommandFactory","IComponentOverrideFactory"],"Templates":["SenderSignatureView","SignatureDetailsView","SmimeInvalidRecipientsDialogView"],"Styles":[{"layout":"Mouse","name":"microsoft.owa.core.smime.mouse.css","type":"Themed"}],"Configurations":[{"type":"SmimeComponent"}],"Sources":[{"name":"microsoft.owa.core.smime.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["smime"]},"imagealbumviewer":{"Dependencies":["deferredboot","nonbootwebservices","attachments"],"Types":["IImageStripViewModel","IImageAlbumViewModelFactory"],"Templates":["ImageAlbumView"],"Styles":[{"layout":"Mouse","name":"microsoft.owa.core.imagealbumviewer.mouse.css","type":"Themed"}],"Configurations":[{"type":"ImageAlbumViewerComponent"}],"Sources":[{"name":"microsoft.owa.core.imagealbumviewer.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["imagealbumviewer"]},"linkpreview":{"Dependencies":["deferredboot","nonbootwebservices"],"Types":["ILinkPreviewBuilder","ILinkPreviewBuilderFactory"],"Templates":["MessageSummarizationView"],"Styles":[{"layout":"Mouse","name":"microsoft.owa.core.linkpreview.mouse.css","type":"Themed"}],"Configurations":[{"type":"LinkPreviewComponent"}],"Sources":[{"name":"microsoft.owa.core.linkpreview.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["linkpreview"]},"immanager":{"Dependencies":["deferredboot","nonbootwebservices","recipientwell","shellcore","shellplus","editor"],"Types":["IChatProviderFactory","IChatProvider","IChatManagerFactory","IChatActionFactory","IChatManager","IPresenceManager","IChatViewModelFactory","IIMLoader"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.core.im.mouse.css","type":"Themed"}],"Configurations":[{"layout":"Mouse","type":"IMManagerComponent"}],"Sources":[{"layout":"Mouse","name":"microsoft.owa.core.lyncintegration.js"},{"layout":"Mouse","name":"microsoft.owa.core.im.js"},{"layout":"Mouse","name":"microsoft.owa.core.immanager.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["immanager"]},"personacontrol":{"Dependencies":["boot","deferredboot","nonbootwebservices","peoplecore","textboys"],"Types":["IBasePersonaViewModelFactory","IBasePersonaViewModel","IPersonaViewModelFactory","IPersonaViewModelWithDetails"],"Templates":["PersonaViewWrapper.ReadOnlyRecipientPopup","PersonaViewWrapper.PresenceDisplayPicturePopup","PersonaViewWrapper.BasicDetailsPopup","PersonaViewWrapper.PersonaMenuItem","PersonaViewWrapper.PersonaContextMenuHeader","PersonaView.PersonaPhotoHeader"],"Styles":[{"layout":"Mouse","name":"microsoft.owa.core.personacontrol.mouse.css","type":"Themed"}],"Configurations":[{"type":"PersonaControlComponent"}],"Sources":[{"name":"signalrmanager.js"},{"name":"microsoft.owa.core.personacontrol.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["personacontrol"]},"findpeople":{"Dependencies":["boot","deferredboot","nonbootwebservices","peoplecore","personacontrol"],"Types":["IPeopleSuggestionLoader","IFindPeopleActionFactory","IFindRecipientMailComposeViewModel","IFindRecipientMailComposeViewModelFactory","IFindRecipientAtMentionSuggestionViewModelFactory","IPeopleSearchSuggestionAdaptorViewModel"],"Templates":["FindRecipientView","FindRecipientResultViewWrapper","PeopleSuggesterViewWrapper","FindPeopleView"],"Styles":[{"layout":"Mouse","name":"microsoft.owa.core.findpeople.mouse.css","type":"Themed"}],"Configurations":[{"type":"FindPeopleComponent"}],"Sources":[{"name":"microsoft.owa.core.findpeople.js"},{"layout":"Mouse","name":"microsoft.owa.core.findpeople.mouse.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["findpeople"]},"personacardfacade":{"Dependencies":["deferredboot","nonbootwebservices","peoplecore","personacontrol","readpersoncard"],"Types":["IPersonaCardFacadeViewModelFactory","IModernGroupCardFacade","IPersonaCardViewModelFactory","IPersonaCardNavigator","ICompositePersonaViewModelFactory"],"Templates":["PersonaCardFacadeViewWrapper.PersonaView_Card"],"Styles":[],"Configurations":[{"type":"PersonaCardFacadeComponent"}],"Sources":[{"name":"microsoft.owa.core.personacardfacade.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["personacardfacade"]},"personaprofile":{"Dependencies":["personacardfacade","readpersoncard","findpeople","peoplewebservices"],"Types":["IPersonaProfileViewModelFactory","IPersonaPaneNavigatorViewModelFactory","IHoverCardInsightsProviderFactory"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.people.personaprofile.mouse.css","type":"Themed"}],"Configurations":[{"type":"PersonaProfileComponent"}],"Sources":[{"name":"microsoft.owa.people.personaprofile.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.ppstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["personaprofile"]},"personaprofiledeferred":{"Dependencies":["calendarcore","calendarmeetingforms","attachmentpreview","attachments","attachmentwell","personaprofile","instantsearch"],"Types":["IPersonaProfileDeferredViewModelFactory"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.people.personaprofiledeferred.mouse.css","type":"Themed"}],"Configurations":[{"type":"PersonaProfileDeferredComponent"}],"Sources":[{"name":"microsoft.owa.people.personaprofiledeferred.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.ppstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["personaprofiledeferred"]},"peoplehub":{"Dependencies":["deferredboot","nonbootwebservices","peoplecore","personacontrol","personacardfacade","recipientwell","findpeople","contactmanagement","optionscoremodels","composepersonacard","peoplewebservices","instantsearch"],"Types":["IPeopleModuleViewModel","IRichPeoplePickerViewModelFactory","IToPeoplePickerViewModelFactory"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.core.peoplehub.mouse.css","type":"Themed"}],"Configurations":[{"type":"PeopleHubComponent"}],"Sources":[{"name":"microsoft.owa.core.peoplehub.js"},{"layout":"Mouse","name":"microsoft.owa.core.peoplehub.mouse.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.strings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.pcstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.commonstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["peoplehub"]},"publicfolderfeaturesupport":{"Dependencies":[],"Types":["IPublicFolderFeatureSupportResolver"],"Templates":[],"Styles":[],"Configurations":[{"type":"PublicFolderFeatureSupportComponent"}],"Sources":[{"name":"microsoft.owa.core.publicfolderfeaturesupport.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["publicfolderfeaturesupport"]},"publicfolderpicker":{"Dependencies":["boot","nonbootwebservices","deferredboot"],"Types":["IPublicFolderPicker"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.core.publicfolderpicker.mouse.css","type":"Themed"}],"Configurations":[{"type":"PublicFolderPickerComponent"}],"Sources":[{"name":"microsoft.owa.core.publicfolderpicker.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.pfpickerstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["publicfolderpicker"]},"savetoonenote":{"Dependencies":["boot","nonboot","nonbootwebservices"],"Types":["ISaveToOneNote"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.core.savetoonenote.mouse.css","type":"Themed"}],"Configurations":[{"type":"SaveToOneNoteComponent"}],"Sources":[{"name":"microsoft.owa.core.savetoonenote.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.savetoonenotestrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.commonstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["savetoonenote"]},"mecard":{"Dependencies":["deferredboot","nonbootwebservices","personacontrol"],"Types":["IMeCardViewModelFactory"],"Templates":["MeCardHeaderView"],"Styles":[{"layout":"Mouse","name":"microsoft.owa.core.mecard.mouse.css","type":"Themed"}],"Configurations":[{"layout":"Mouse","type":"MeCardComponent"}],"Sources":[{"layout":"Mouse","name":"microsoft.owa.core.mecard.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["mecard"]},"suitemecard":{"Dependencies":["nonbootwebservices","shellplus"],"Types":["ISuiteMeCardViewModel"],"Templates":["MeCardMouseView"],"Styles":[],"Configurations":[{"layout":"Mouse","type":"O365SuiteMeCardComponent"}],"Sources":[{"layout":"Mouse","name":"microsoft.o365.shellg2.mecard.owa.js"},{"layout":"Mouse","name":"microsoft.owa.suitemecard.o365.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["suitemecard"]},"suitesettings":{"Dependencies":["shellplus"],"Types":["ISettingsFlexPaneViewModel"],"Templates":[],"Styles":[],"Configurations":[{"type":"O365SettingsComponent"}],"Sources":[{"name":"cardmetadata.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.o365.shellg2.settingstrings.localized.min.js"},{"name":"settingssearchclassifier.js"}],"PackagedStrings":[],"IncludedSlabs":["suitesettings"]},"calendarcore":{"Dependencies":["boot","calendarwebservices","commoncompose","deferredboot","peoplecore","calendarcontrols","mailcommon","moderngroupscalendarshared"],"Types":["IScheduleFollowupViewModelFactory","ILocationViewModel","ICalendarGroupModelFactory","ICalendarPrefetcher","ICalendarItemViewModel","ICalendars","ICancelCalendarItemActionFactory","IGetCalendarItemActionFactory","ICalendarTimeConverterFactory","ICalendarsConfiguration","IMasterCategoryListProvider","IUpdateCalendarEventResponseProcessorFactory","IUcwaSupportedDataCache"],"Templates":[],"Styles":[],"Configurations":[{"type":"CalendarCoreComponent"}],"Sources":[{"name":"microsoft.owa.calendar.core.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.calcorestrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.meetingmsgstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.commonstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["calendarcore"]},"calendartheming":{"Dependencies":["boot","deferredboot"],"Types":[],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.calendar.theming.mouse.css","type":"Themed"}],"Configurations":[{"type":"CalendarThemingComponent"}],"Sources":[{"name":"microsoft.owa.calendar.theming.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.calcorestrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["calendartheming"]},"calendarmeetingforms":{"Dependencies":["boot","calendarcore","deferredboot","recipientwell","peoplecore","personacontrol","findpeople","mailcommon","calendarcontrols","locationwell","calendarwebservices","addroom"],"Types":["IEventDetailsViewModelFactory","IComposeDurationViewModel"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.calendar.meetingforms.mouse.css","type":"Themed"}],"Configurations":[{"type":"CalendarMeetingFormsComponent"}],"Sources":[{"name":"microsoft.owa.calendar.meetingforms.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.calmfstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.commonstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["calendarmeetingforms"]},"calendarcontrols":{"Dependencies":["boot"],"Types":[],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.calendar.controls.v2.mouse.css","type":"Themed"}],"Configurations":[{"type":"CalendarControlsCoreComponent"},{"layout":"Mouse","type":"CalendarControlsComponentV2"}],"Sources":[{"name":"microsoft.owa.calendar.controls.core.js"},{"layout":"Mouse","name":"microsoft.owa.calendar.controls.v2.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.calcorestrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.coredeferredstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["calendarcontrols"]},"calendarpicker":{"Dependencies":["calendarsurface","personacontrol","deferredboot"],"Types":["ICalendarPickerViewModel","ICalendarPickerModernGroupsProvider","ICalendarPickerModernGroupsViewModel"],"Templates":["CalendarPickerViewWrapper"],"Styles":[{"layout":"Mouse","name":"cpsprite1.mouse.css","type":"Sprite"},{"layout":"Mouse","name":"calendarpicker.mouse.css","type":"Themed"}],"Configurations":[{"type":"CalendarPickerComponent"}],"Sources":[{"name":"microsoft.owa.calendar.calendarpicker.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.calpickerstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["calendarpicker"]},"calendarsurface":{"Dependencies":["boot","deferredboot","calendarwebservices","calendarcore","calendarcontrols","lightning"],"Types":["ICalendarModuleViewModel","ICalendarCommandProviderFactory"],"Templates":[],"Styles":[{"layout":"Mouse","name":"calendarsurface.mouse.css","type":"Themed"}],"Configurations":[{"type":"CalendarSurfaceCoreComponent"},{"layout":"Mouse","type":"CalendarSurfaceDesktopComponentV2"}],"Sources":[{"name":"microsoft.owa.calendar.surface.core.js"},{"name":"microsoft.owa.calendar.surface.core.mouse.js"},{"layout":"Mouse","name":"microsoft.owa.calendar.surface.v2.desktop.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.calsurfacestrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.meetingmsgstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["calendarsurface"]},"meetingmessage":{"Dependencies":["boot","deferredboot","mailcommon","calendarwebservices","calendarcore","editor","peoplecore","personacontrol"],"Types":["ILocationViewModelFactory","IMeetingMessageViewModel","IMeetingMessageViewModelFactory","IMeetingResponseViewModel","IMeetingResponseViewModelFactory","IProposeNewTimeManager","ICalendarMailComposeConductorFactory","ICalendarCoauthoringMessageViewModelFactory"],"Templates":["LocationView"],"Styles":[{"layout":"Mouse","name":"mmsprite1.mouse.css","type":"Sprite"},{"layout":"Mouse","name":"meetingmessage.mouse.css","type":"Themed"}],"Configurations":[{"type":"MeetingMessageComponent"}],"Sources":[{"name":"microsoft.owa.calendar.meetingmessage.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.meetingmsgstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.commonstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["meetingmessage"]},"mailcommon":{"Dependencies":["boot","deferredboot","nonbootwebservices"],"Types":[],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.mail.common.mouse.css","type":"Themed"}],"Configurations":[{"type":"MailCommonComponent"}],"Sources":[{"name":"microsoft.owa.mail.common.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["mailcommon"]},"calendarpeek":{"Dependencies":["calendarcore","boot","deferredboot","calendarwebservices","recipientwell","peoplecore","personacontrol","findpeople","calendarmeetingforms","meetingmessage","calendarsurface"],"Types":["ICalendarContextPeek","ICalendarContextPeekFactory","ICalendarItemPeekViewModelFactory"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.calendar.peek.mouse.css","type":"Themed"}],"Configurations":[{"type":"CalendarPeekComponent"}],"Sources":[{"name":"microsoft.owa.calendar.surface.core.js"},{"name":"microsoft.owa.calendar.surface.core.mouse.js"},{"name":"microsoft.owa.calendar.peek.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.calpeekstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.commonstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["calendarpeek"]},"feeds":{"Dependencies":["deferredboot","calendarwebservices","calendarcore","calendarcontrols"],"Types":["IFeedsFactory","IBrowseInterestingCalendarsControllerExecutor"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.calendar.feeds.mouse.css","type":"Themed"}],"Configurations":[{"type":"FeedsComponent"}],"Sources":[{"name":"microsoft.owa.calendar.feeds.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.owa.calendar.feeds.calendarfeedsstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["feeds"]},"holidays":{"Dependencies":["deferredboot","calendarwebservices","calendarcore","calendarcontrols"],"Types":["IHolidaysFactory"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.calendar.holidays.mouse.css","type":"Themed"}],"Configurations":[{"type":"HolidaysComponent"}],"Sources":[{"name":"microsoft.owa.calendar.holidays.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.holidaystrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["holidays"]},"calendarsharingmanagement":{"Dependencies":["nonbootwebservices","attachments","boot","deferredboot","calendarmeetingforms","calendarcore","calendarsurface","peoplecore","recipientwell","personacontrol","findpeople"],"Types":["IImportCalendarEventViewModelFactory","ISharingCalendarViewModelFactory","ICalendarSharingPermissionsViewModelFactory","ISubscribeCalendarControllerExecutor","ISubscribeCalendarViewModelFactory"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.calendar.sharing.management.v2.mouse.css","type":"Themed"}],"Configurations":[{"type":"CalendarSharingManagementComponentV2"}],"Sources":[{"name":"microsoft.owa.calendar.sharing.management.v2.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.calendar.sm.strs.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.commonstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["calendarsharingmanagement"]},"calendarsharingmessage":{"Dependencies":["deferredboot","calendarwebservices","calendarcore"],"Types":["ICalendarShareMessageViewModelFactory"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.calendar.sharing.message.mouse.css","type":"Themed"}],"Configurations":[{"type":"CalendarSharingMessageComponent"}],"Sources":[{"name":"microsoft.owa.calendar.sharing.message.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.calendar.sm.strs.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["calendarsharingmessage"]},"calendarprint":{"Dependencies":["deferredboot","calendarsurface"],"Types":["IPrintCalendarViewModelFactory"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.calendar.print.v2.mouse.css","type":"Themed"}],"Configurations":[{"type":"CalendarPrintComponentV2"}],"Sources":[{"name":"microsoft.owa.calendar.print.v2.js"},{"name":"printelement.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["calendarprint"]},"locationwell":{"Dependencies":["deferredboot","deferredwebservices","calendarwebservices","recipientwell","findpeople","calendarcore","addroom"],"Types":["ILocationWellViewModelFactory","ILocationWellViewModel"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.calendar.locationwell.mouse.css","type":"Themed"}],"Configurations":[{"type":"CalendarLocationWellComponent"}],"Sources":[{"name":"microsoft.owa.calendar.locationwell.js"},{"name":"microsoft.owa.calendar.locationwell.mouse.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.callwstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["locationwell"]},"calendartimesuggestions":{"Dependencies":["boot","deferredwebservices","calendarwebservices","calendarcore"],"Types":["ITimeSuggestionsViewModelFactory"],"Templates":["TimeSuggestionsView"],"Styles":[{"layout":"Mouse","name":"microsoft.owa.calendar.timesuggestions.mouse.css","type":"Themed"}],"Configurations":[{"type":"CalendarTimeSuggestionsComponent"}],"Sources":[{"name":"microsoft.owa.calendar.timesuggestions.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.caltsstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["calendartimesuggestions"]},"consensusscheduling":{"Dependencies":["calendarsurface","mailcommon"],"Types":["IConsensusSchedulingViewModelFactory","IConsensusSchedulingViewModel"],"Templates":["ConsensusSchedulingView","ConsensusSchedulingDatePickerView"],"Styles":[{"layout":"Mouse","name":"microsoft.owa.calendar.consensus.mouse.css","type":"Themed"}],"Configurations":[{"type":"ConsensusSchedulingComponent"}],"Sources":[{"name":"microsoft.owa.calendar.consensus.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.owa.calendar.consensus.strings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["consensusscheduling"]},"calendarcompose":{"Dependencies":["calendarcore","calendarcontrols","boot","deferredboot","calendarwebservices","recipientwell","peoplecore","personacontrol","findpeople","calendarmeetingforms","commoncompose","editor","locationwell","meetingmessage","addroom"],"Types":["IComposeCalendarItemViewModelFactory","IComposeCalendarItemViewModel","IComposeRecurrenceViewModel","IComposeNonPatternOccurrenceViewModelFactory","IComposeNonPatternRecurrenceViewModelFactory"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.calendar.compose.mouse.css","type":"Themed"}],"Configurations":[{"type":"CalendarComposeComponent"}],"Sources":[{"name":"microsoft.owa.calendar.compose.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.calcompstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.commonstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["calendarcompose"]},"calendarreadingpane":{"Dependencies":["calendarcore","boot","deferredboot","nonbootwebservices","recipientwell","peoplecore","personacontrol","findpeople","calendarmeetingforms","meetingmessage","mailcommon"],"Types":["ICalendarItemDetailsViewModelFactory"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.calendar.readingpane.mouse.css","type":"Themed"}],"Configurations":[{"type":"CalendarReadingPaneComponent"}],"Sources":[{"name":"microsoft.owa.calendar.readingpane.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.calreadstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.commonstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["calendarreadingpane"]},"calendarplaces":{"Dependencies":["calendarcore","boot","deferredboot","calendarwebservices","peoplecore","personacontrol","calendarmeetingforms","personacardfacade","recipientwell","readpersoncard","nonboot"],"Types":["IPlacePickerViewModelFactory","ILocationMapViewModelFactory","ILocationPanelViewModelFactory","IMapFactoryFactory","ILocationCardViewModelFactory"],"Templates":["LocationPanelView","BingMap"],"Styles":[{"layout":"Mouse","name":"clsprite1.mouse.css","type":"Sprite"},{"layout":"Mouse","name":"microsoft.owa.calendar.places.mouse.css","type":"Themed"}],"Configurations":[{"type":"CalendarPlacesComponent"}],"Sources":[{"name":"microsoft.owa.calendar.places.js"},{"layout":"Mouse","name":"microsoft.owa.calendar.places.mouse.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.calplacesstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.commonstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["calendarplaces"]},"calendarscheduling":{"Dependencies":["calendarcore","boot","deferredboot","nonbootwebservices","recipientwell","peoplecore","personacontrol","findpeople","calendarmeetingforms","calendarpeek","calendarsurface","calendarcontrols","meetingmessage"],"Types":["ISchedulingViewModel","ISchedulingViewModelFactory"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.calendar.scheduling.v2.mouse.css","type":"Themed"}],"Configurations":[{"type":"CalendarSchedulingComponentV2"}],"Sources":[{"name":"microsoft.owa.calendar.scheduling.v2.js"},{"layout":"Mouse","name":"microsoft.owa.calendar.scheduling.v2.mouse.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.calschedstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.commonstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["calendarscheduling"]},"decisioncollab":{"Dependencies":["boot","deferredboot","mailcommon"],"Types":["IDecisionCollabFactory"],"Templates":[],"Styles":[{"layout":"Mouse","name":"nbsprite1.mouse.css","type":"Sprite"},{"layout":"Mouse","name":"microsoft.owa.decisioncollab.mouse.css","type":"Themed"}],"Configurations":[{"type":"DecisionCollabComponent"}],"Sources":[{"name":"microsoft.owa.decisioncollab.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.owa.decisioncollab.strings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["decisioncollab"]},"naturalinput":{"Dependencies":["deferredwebservices","calendarsurface","calendarmeetingforms","locationwell"],"Types":["INaturalInputController"],"Templates":["CalendarNaturalInputItem"],"Styles":[{"layout":"Mouse","name":"microsoft.owa.calendar.naturalinput.v2.mouse.css","type":"Themed"}],"Configurations":[{"type":"NaturalInputComponentV2"}],"Sources":[{"name":"microsoft.owa.calendar.naturalinput.v2.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.naturalinput.strings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["naturalinput"]},"weather":{"Dependencies":["calendarwebservices","calendarcore"],"Types":["IWeatherController","IWeatherControllerViewModel","IWeatherLocationSearchViewModel","IWeatherProvider"],"Templates":["WeatherViewContainer","WeatherLocationSearchControl"],"Styles":[{"layout":"Mouse","name":"wsprite1.mouse.css","type":"Sprite"},{"layout":"Mouse","name":"microsoft.owa.calendar.weatherv2.mouse.css","type":"Themed"}],"Configurations":[{"type":"WeatherV2Component"}],"Sources":[{"name":"microsoft.owa.calendar.weatherv2.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.weather.strings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["weather"]},"birthdays":{"Dependencies":["deferredboot","calendarwebservices","calendarcontrols","calendarreadingpane"],"Types":["IBirthdayFactory","IBirthdayCalendarFactory"],"Templates":["BirthdayPeekViewContainer","BirthdayDetailsViewContainer"],"Styles":[{"layout":"Mouse","name":"bdsprite1.mouse.css","type":"Sprite"},{"layout":"Mouse","name":"microsoft.owa.calendar.birthdays.mouse.css","type":"Themed"}],"Configurations":[{"type":"BirthdaysComponent"}],"Sources":[{"name":"microsoft.owa.calendar.birthdays.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.birthdays.strings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.commonstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["birthdays"]},"bookingcalendar":{"Dependencies":["boot","deferredboot","calendarwebservices","bookingcore","calendarcore","calendarcontrols","reminders","peoplecore","personacontrol","locationwell","calendarpeek","bookingcustomersmodule","photoupload","shellplus"],"Types":["IComposeBookingItemViewModelFactory","IBookingManagementFactory","IBookingCommandProviderFactory","INewBookingCalendarFactory","IBookingMailboxCache","IChangePhotoViewModelFactory"],"Templates":[],"Styles":[{"layout":"Mouse","name":"bcsprite1.mouse.css","type":"Sprite"},{"layout":"Mouse","name":"microsoft.owa.calendar.booking.mouse.css","type":"Themed"}],"Configurations":[{"type":"BookingCalendarComponent"}],"Sources":[{"name":"microsoft.owa.calendar.booking.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.owa.calendar.booking.strings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.calcompstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.calmfstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.remindersstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["bookingcalendar"]},"schedules":{"Dependencies":["boot","deferredboot","calendarcore","calendarcontrols","calendarwebservices","calendartheming","meetingmessage","locationwell"],"Types":["ISchedulesFactory","IScheduleDetailsViewModelFactory","ISchedulesControllerExecutor"],"Templates":[],"Styles":[{"layout":"Mouse","name":"nbsprite1.mouse.css","type":"Sprite"},{"layout":"Mouse","name":"microsoft.owa.calendar.schedules.mouse.css","type":"Themed"}],"Configurations":[{"type":"SchedulesComponent"}],"Sources":[{"name":"microsoft.owa.calendar.schedules.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.owa.calendar.schedules.strings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["schedules"]},"bookingbusinesstypes":{"Dependencies":["boot","deferredboot","calendarwebservices","nonbootwebservices","bookingcalendar"],"Types":["IBookingBusinessTypesFactory"],"Templates":[],"Styles":[],"Configurations":[{"type":"BookingBusinessTypesComponent"}],"Sources":[{"name":"microsoft.owa.booking.businesstypes.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.owa.booking.businesstypes.strings.bt.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["bookingbusinesstypes"]},"bookingcore":{"Dependencies":["boot","deferredboot","lightning","peoplecore","personacontrol","calendarcore","deferredwebservices","calendarwebservices","analytics"],"Types":["IBookingsAnalytics"],"Templates":[],"Styles":[],"Configurations":[{"type":"BookingCoreComponent"}],"Sources":[{"name":"microsoft.owa.booking.core.js"},{"name":"localytics.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.owa.booking.core.strings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["bookingcore"]},"bookingshell":{"Dependencies":["boot","deferredboot","calendarwebservices","bookingcore","calendarcore","peoplecore","personacontrol"],"Types":["IBookingsModuleViewModel"],"Templates":[],"Styles":[{"layout":"Mouse","name":"booksprite1.mouse.css","type":"Sprite"},{"layout":"Mouse","name":"microsoft.owa.booking.shell.mouse.css","type":"Themed"}],"Configurations":[{"type":"BookingShellComponent"}],"Sources":[{"name":"microsoft.owa.booking.shell.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.owa.booking.shell.strings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["bookingshell"]},"bookingcalendarmodule":{"Dependencies":["boot","deferredboot","bookingcore","calendarcore","calendarsurface","bookingcalendar"],"Types":["IBookingCalendarModuleFactory"],"Templates":[],"Styles":[],"Configurations":[{"type":"BookingCalendarModuleComponent"}],"Sources":[{"name":"microsoft.owa.booking.modules.calendar.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["bookingcalendarmodule"]},"bookinghomepagemodule":{"Dependencies":["boot","deferredboot","bookingcore"],"Types":["IBookingHomePageModuleFactory"],"Templates":[],"Styles":[{"layout":"Mouse","name":"booksprite1.mouse.css","type":"Sprite"},{"layout":"Mouse","name":"microsoft.owa.booking.modules.homepage.mouse.css","type":"Themed"}],"Configurations":[{"type":"BookingHomePageComponent"}],"Sources":[{"name":"microsoft.owa.booking.modules.homepage.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["bookinghomepagemodule"]},"bookingcustomersmodule":{"Dependencies":["boot","deferredboot","bookingcore","peoplehub"],"Types":["IBookingCustomersModuleFactory","ICustomerCardViewModelFactory"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.booking.modules.customers.mouse.css","type":"Themed"}],"Configurations":[{"type":"BookingCustomersComponent"}],"Sources":[{"name":"microsoft.owa.booking.modules.customers.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["bookingcustomersmodule"]},"bookingpagemodule":{"Dependencies":["boot","deferredboot","bookingcore","calendarcore","bookingcalendar"],"Types":["IBookingPageModuleFactory"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.booking.modules.bookingpage.mouse.css","type":"Themed"}],"Configurations":[{"type":"BookingPageComponent"}],"Sources":[{"name":"microsoft.owa.booking.modules.bookingpage.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["bookingpagemodule"]},"bookingbusinessinformationmodule":{"Dependencies":["boot","deferredboot","bookingcore","calendarcore","bookingcalendar"],"Types":["IBookingBusinessInformationModuleFactory"],"Templates":[],"Styles":[],"Configurations":[{"type":"BookingBusinessInformationComponent"}],"Sources":[{"name":"microsoft.owa.booking.modules.businessinformation.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["bookingbusinessinformationmodule"]},"bookingservicesmodule":{"Dependencies":["boot","deferredboot","bookingcore","calendarcore","bookingcalendar"],"Types":["IBookingServicesModuleFactory"],"Templates":[],"Styles":[],"Configurations":[{"type":"BookingServicesComponent"}],"Sources":[{"name":"microsoft.owa.booking.modules.services.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["bookingservicesmodule"]},"bookingstaffmodule":{"Dependencies":["boot","deferredboot","bookingcore","calendarcore","bookingcalendar"],"Types":["IBookingStaffModuleFactory"],"Templates":[],"Styles":[],"Configurations":[{"type":"BookingStaffComponent"}],"Sources":[{"name":"microsoft.owa.booking.modules.staff.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["bookingstaffmodule"]},"extractedevents":{"Dependencies":["boot","deferredwebservices","nonbootwebservices","calendarcore","calendarpeek","tailoredexperiences","mailcommon"],"Types":["ITailoredPeekViewModel"],"Templates":["ExtractedEventViewContainer"],"Styles":[{"layout":"Mouse","name":"microsoft.owa.calendar.extractedevents.mouse.css","type":"Themed"}],"Configurations":[{"type":"ExtractedEventsComponent"}],"Sources":[{"name":"microsoft.owa.calendar.extractedevents.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.caleestrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["extractedevents"]},"tailoredexperiences":{"Dependencies":["boot","nonbootwebservices","mailcommon"],"Types":["ITailoredEntityViewModelFactory","ITailoredXpActionsFactory"],"Templates":["GroupedTailoredEntitiesView","VerticalEntityView"],"Styles":[{"layout":"Mouse","name":"nbsprite1.mouse.css","type":"Sprite"},{"layout":"Mouse","name":"microsoft.owa.tailoredexperiences.mouse.css","type":"Themed"}],"Configurations":[{"type":"TailoredExperiencesComponent"}],"Sources":[{"name":"microsoft.owa.tailoredexperiences.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.testrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["tailoredexperiences"]},"connectors":{"Dependencies":["boot","mailcommon"],"Types":["IConnectorsViewModelFactory","IGroupedConnectorCardsViewModelFactory","IConnectorCardsActionsFactory"],"Templates":["ConnectorsView","GroupedConnectorCardsView"],"Styles":[{"layout":"Mouse","name":"microsoft.owa.connectors.mouse.css","type":"Themed"}],"Configurations":[{"type":"ConnectorsComponent"}],"Sources":[{"name":"microsoft.owa.connectors.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["connectors"]},"helpPanel":{"Dependencies":["nonbootwebservices","deferredboot"],"Types":["IHelpPanelViewModel"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.helppanel.mouse.css","type":"Themed"}],"Configurations":[{"type":"HelpPanelComponent"}],"Sources":[{"name":"microsoft.owa.helppanel.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.helppanelstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["helpPanel"]},"calendarsearchinput":{"Dependencies":["deferredboot","nonbootwebservices","calendarsurface","personacontrol"],"Types":["ITopAppBarSearchViewModel"],"Templates":["CalendarSearchBox"],"Styles":[{"layout":"Mouse","name":"casprite1.mouse.css","type":"Sprite"},{"layout":"Mouse","name":"calendarsearchinput.mouse.css","type":"Themed"}],"Configurations":[{"type":"CalendarSearchInputComponentV2"}],"Sources":[{"name":"microsoft.owa.calendar.search.v2.input.js"},{"layout":"Mouse","name":"microsoft.owa.calendar.search.v2.input.mouse.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.csearch.strings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["calendarsearchinput"]},"calendarsearchoutput":{"Dependencies":["nonbootwebservices","calendarsearchinput","nonboot","calendarpicker","instantsearch","findpeople","deferredboot"],"Types":["ICalendarEventSearchViewModel","ICalendarEventSearchViewModelFactory","IEventSearchViewModel","IOpenCalendarSuggestionsViewModel"],"Templates":[],"Styles":[{"layout":"Mouse","name":"calendarsearchoutput.mouse.css","type":"Themed"}],"Configurations":[{"type":"CalendarSearchOutputComponentV2"}],"Sources":[{"name":"microsoft.owa.calendar.search.v2.output.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["calendarsearchoutput"]},"reminders":{"Dependencies":["boot","deferredboot","calendarwebservices","personacontrol","calendarcore"],"Types":["IEmailRemindersViewModel","IEmailRemindersViewModelFactory","IReminderMessageViewModelFactory"],"Templates":["EmailRemindersView"],"Styles":[{"layout":"Mouse","name":"microsoft.owa.reminders.mouse.css","type":"Themed"}],"Configurations":[{"type":"RemindersComponent"}],"Sources":[{"name":"microsoft.owa.reminders.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.remindersstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.commonstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.calmfstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["reminders"]},"optionscore":{"Dependencies":["nonbootwebservices","optionscoremodels","deferredboot"],"Types":["IOptionsLoader","IOptionsControllerExecutor","IOptionsPathGenerator"],"Templates":[],"Styles":[{"layout":"Mouse","name":"opsprite1.mouse.css","type":"Sprite"},{"layout":"Mouse","name":"microsoft.owa.options.core.mouse.css","type":"Themed"}],"Configurations":[{"type":"OptionsCoreComponent"}],"Sources":[{"name":"microsoft.owa.options.core.js"},{"layout":"Mouse","name":"microsoft.owa.options.core.mouse.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.commonstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.options.strings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["optionscore"]},"options":{"Dependencies":["nonbootwebservices","commoncompose","editor","personacontrol","calendarcontrols","peoplecore","optionscore","optionscoremodels","calendarcore","deferredboot","attachments","attachmentsfilepicker","offline","peoplehub","groupcard"],"Types":["IOptionsPresenterFactory","IOptionsPanelViewModelFactory"],"Templates":["OptionsPanelView"],"Styles":[{"layout":"Mouse","name":"microsoft.owa.options.mouse.css","type":"Themed"}],"Configurations":[{"type":"OptionsComponent"}],"Sources":[{"name":"microsoft.owa.options.js"},{"layout":"Mouse","name":"microsoft.owa.options.mouse.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.options.strings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["options"]},"calendaroptions":{"Dependencies":["deferredboot","calendarcore","calendarcontrols","peoplecore","optionscore","optionscoremodels"],"Types":["ICalendarOptionsPanelViewModelFactory"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.options.calendar.mouse.css","type":"Themed"}],"Configurations":[{"type":"CalendarOptionsComponent"}],"Sources":[{"name":"microsoft.owa.options.calendar.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.options.strings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["calendaroptions"]},"optionscoremodels":{"Dependencies":["deferredwebservices","nonbootwebservices","deferredboot"],"Types":[],"Templates":[],"Styles":[],"Configurations":[{"type":"OptionsCoreModelsComponent"}],"Sources":[{"name":"microsoft.owa.options.core.models.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.options.strings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["optionscoremodels"]},"resources":{"Dependencies":[],"Types":[],"Templates":[],"Styles":[{"name":"moeerrorux.css","type":"NotThemed"},{"name":"moeerroruxrtl.css","type":"NotThemed"}],"Configurations":[],"Sources":[{"name":"microsoft.naturallanguage.clientruntime.js"},{"name":"microsoft.naturallanguage.attachmentres.en.js"},{"name":"blank.html"}],"PackagedSources":[],"Strings":[{"name":"osfruntime_strings.js","type":"Extensibility"}],"PackagedStrings":[],"IncludedSlabs":["resources"]},"nonbootcontrols":{"Dependencies":["deferredboot","lightning"],"Types":[],"Templates":["CommandingBarExternalImageItem","GrayscaleImage","IconImage","SvgFilterGrayscale","SvgImage"],"Styles":[{"layout":"Mouse","name":"microsoft.owa.nonboot.controls.mouse.css","type":"Themed"}],"Configurations":[{"type":"NonBootControlsComponent"}],"Sources":[{"name":"microsoft.owa.nonboot.controls.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.extstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["nonbootcontrols"]},"extensibility":{"Dependencies":["deferredboot","lightning","nonbootcontrols","nonbootwebservices","personacontrol","mailcommon"],"Types":["IExtensibilityViewModelFactory","IInClientStoreViewModelFactory","IExtensibilityViewModelBase","IComposeExtensibilityViewModel","IExtensibilityCommandingBarItemsManagerFactory","IExtensibilityEntryPointCollection","IExtensibilityStatistics"],"Templates":["ComposeAppsPane","MinAppBar","XExtensibilityView","XComposeExtensibilityView","XExtensibilityCardView","ExtensibilityReactComponent"],"Styles":[{"layout":"Mouse","name":"nbsprite1.mouse.css","type":"Sprite"},{"layout":"Mouse","name":"microsoft.owa.extensibilitynext.mouse.css","type":"Themed"}],"Configurations":[{"type":"ExtensibilityNextComponent"}],"Sources":[{"name":"osfruntime.js"},{"name":"microsoft.owa.extensibilitynext.js"},{"name":"microsoft.owa.extensibility.common.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.extstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["extensibility"]},"infobarnotifications":{"Dependencies":[],"Types":["IExtensibilityNotificationsManager","IPersistedNotificationsManager","IInfoBarNotificationsManager"],"Templates":[],"Styles":[],"Configurations":[{"type":"InfoBarNotificationsComponent"}],"Sources":[{"name":"microsoft.owa.core.infobarnotifications.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["infobarnotifications"]},"infotips":{"Dependencies":["deferredboot","nonbootwebservices","recipientwell","findpeople"],"Types":["IMailTipsHandlerFactory","IPolicyTipsHandlerFactory","IPeopleRecommendationsHandlerFactory"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.infotips.mouse.css","type":"Themed"}],"Configurations":[{"type":"InfoTipsComponent"}],"Sources":[{"name":"microsoft.owa.infotips.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["infotips"]},"forgottenattachment":{"Dependencies":["nonbootwebservices"],"Types":["IForgottenAttachmentDetectorFactory"],"Templates":[],"Styles":[],"Configurations":[{"type":"ForgottenAttachmentComponent"}],"Sources":[{"name":"microsoft.naturallanguage.clientruntime.js"},{"name":"microsoft.naturallanguage.attachmentres.en.js"},{"name":"microsoft.owa.forgottenattachment.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["forgottenattachment"]},"commoncompose":{"Dependencies":["deferredboot"],"Types":["ComposeCopyPasteViewModelFactory","IFindTagResultViewModelFactory"],"Templates":["FindTagResultViewWrapper"],"Styles":[{"layout":"Mouse","name":"microsoft.owa.common.compose.mouse.css","type":"Themed"}],"Configurations":[{"type":"CommonComposeComponent"}],"Sources":[{"name":"microsoft.owa.common.compose.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["commoncompose"]},"survey":{"Dependencies":["nonbootwebservices","deferredboot"],"Types":["ISurveyFactory","ISurveyDialogViewModelFactory"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.survey.mouse.css","type":"Themed"}],"Configurations":[{"layout":"Mouse","type":"SurveyComponent"}],"Sources":[{"layout":"Mouse","name":"microsoft.owa.survey.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["survey"]},"mailcompose":{"Dependencies":["nonbootwebservices","commoncompose","editor","peoplecore","personacontrol","recipientwell","findpeople","deferredboot","mailcommon"],"Types":["IMailComposeActionFactory","IMailComposeContextFactory","IMailComposeDiscardManager","IMailComposeViewModelFactory","IMailResponseViewModelFactory","IMailInlineComposeViewModelFactory"],"Templates":["MailComposeView","MailInlineComposeView","MailComposeUnifiedView"],"Styles":[{"layout":"Mouse","name":"microsoft.owa.mail.compose.mouse.css","type":"Themed"}],"Configurations":[{"type":"MailComposeComponent"}],"Sources":[{"name":"microsoft.owa.mail.compose.js"},{"layout":"Mouse","name":"microsoft.owa.mail.compose.mouse.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.commonstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.meetingmsgstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["mailcompose"]},"instantsearch":{"Dependencies":["deferredwebservices","nonbootwebservices","personacontrol","calendarcontrols","deferredboot"],"Types":["IBingSearchSuggestionAdaptorViewModel","IInstantSearchFactory","IModuleSearchButtonAdaptorViewModel"],"Templates":["InstantSearchContainerView","InstantSearchSuggestionListContainerView","InstantSearchButtonsTemplate"],"Styles":[{"layout":"Mouse","name":"microsoft.owa.core.instantsearch.mouse.css","type":"Themed"}],"Configurations":[{"type":"InstantSearchComponent"}],"Sources":[{"name":"microsoft.owa.core.instantsearch.js"},{"layout":"Mouse","name":"microsoft.owa.core.instantsearch.mouse.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["instantsearch"]},"consumerfirstrun":{"Dependencies":["nonbootwebservices","shellplus","lightning"],"Types":["IFirstRunManager"],"Templates":[],"Styles":[{"layout":"Mouse","name":"nbsprite1.mouse.css","type":"Sprite"},{"layout":"Mouse","name":"microsoft.owa.consumerfirstrun.mouse.css","type":"Themed"}],"Configurations":[{"layout":"Mouse","type":"ConsumerFirstRunComponent"}],"Sources":[{"layout":"Mouse","name":"microsoft.owa.consumerfirstrun.js"}],"PackagedSources":[],"Strings":[{"layout":"Mouse","name":"microsoft.owa.strings.cfirstrun.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["consumerfirstrun"]},"hashtagsux":{"Dependencies":["nonbootwebservices","deferredwebservices","editor","personacontrol"],"Types":["TagSet","IEntitySuggestionManager","IHashtagViewModelFactory","IHashtagWellViewModelFactory","IEntityLinkHandler","IHashtagFirstRunHelper"],"Templates":["TagSetContainerWrapper"],"Styles":[{"layout":"Mouse","name":"microsoft.owa.core.tagset.mouse.css","type":"Themed"}],"Configurations":[{"type":"TagSetComponent"}],"Sources":[{"name":"microsoft.owa.core.tagset.js"},{"layout":"Mouse","name":"microsoft.owa.core.tagset.mouse.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["hashtagsux"]},"categorytree":{"Dependencies":["deferredboot"],"Types":["ICategoryTreeFactory","ICategoryTreeNodeViewModel","ICategoryTreeViewModel"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.categorytree.mouse.css","type":"Themed"}],"Configurations":[{"type":"CategoryTreeComponent"}],"Sources":[{"layout":"Mouse","name":"microsoft.owa.categorytree.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["categorytree"]},"readingpaneshared":{"Dependencies":["nonbootwebservices","personacontrol","deferredboot","findpeople"],"Types":["ILikeViewModelFactory"],"Templates":["LikeView","LikeView.LikersList","LikeView.LikeButton"],"Styles":[{"layout":"Mouse","name":"microsoft.owa.readingpaneshared.mouse.css","type":"Themed"}],"Configurations":[{"type":"ReadingPaneSharedComponent"}],"Sources":[{"name":"microsoft.owa.readingpaneshared.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["readingpaneshared"]},"feedback":{"Dependencies":["nonbootwebservices","deferredboot"],"Types":["IUserVoicePopupViewModel","IUserVoicePopupViewModelFactory","IHelpShiftPopupViewModel","IUserVoiceSatisfactionViewModel","IUserVoiceSatisfactionViewModelFactory","IUserVoiceControllerExecutor"],"Templates":["FeedbackInfoBarMessageView","ScreenshotView","ScreenshotAnnotatorView"],"Styles":[{"layout":"Mouse","name":"microsoft.owa.feedback.mouse.css","type":"Themed"}],"Configurations":[{"layout":"Mouse","type":"FeedbackComponent"}],"Sources":[{"layout":"Mouse","name":"microsoft.owa.feedback.js"},{"layout":"Mouse","name":"uservoicewidget.js"},{"layout":"Mouse","name":"html2canvas.js"}],"PackagedSources":[],"Strings":[{"layout":"Mouse","name":"microsoft.exchange.clients.owa2.client.strings.localized.min.js"},{"layout":"Mouse","name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["feedback"]},"adspromotion":{"Dependencies":["nonbootwebservices","deferredboot","lightning"],"Types":["IAdsEdgePromotionPopupManager"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.adspromotion.mouse.css","type":"Themed"}],"Configurations":[{"layout":"Mouse","type":"AdsPromotionComponent"}],"Sources":[{"name":"microsoft.owa.adspromotion.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.owa.adspromotion.strings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["adspromotion"]},"skypepromotion":{"Dependencies":["nonbootwebservices","deferredboot","lightning"],"Types":["ISkypePromotionPopupManager"],"Templates":[],"Styles":[],"Configurations":[{"layout":"Mouse","type":"SkypePromotionComponent"}],"Sources":[{"name":"microsoft.owa.skypepromotion.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.owa.skypepromotion.strings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["skypepromotion"]},"entityfeedbackmanager":{"Dependencies":[],"Types":["IEntityFeedbackManager","IEntityFeedbackManagerFactory"],"Templates":[],"Styles":[],"Configurations":[{"type":"EntityFeedbackComponent"}],"Sources":[{"name":"microsoft.owa.core.entityfeedbackmanager.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["entityfeedbackmanager"]},"adsbar":{"Dependencies":["nonbootwebservices","deferredboot"],"Types":["IAdsbarViewModel"],"Templates":["AdsbarPanelView"],"Styles":[{"layout":"Mouse","name":"microsoft.owa.adsbar.mouse.css","type":"Themed"}],"Configurations":[{"layout":"Mouse","type":"AdsbarComponent"}],"Sources":[{"name":"microsoft.owa.adsbar.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["adsbar"]},"deferredwebservices":{"Dependencies":[],"Types":[],"Templates":[],"Styles":[],"Configurations":[{"type":"DeferredWebServicesComponent"}],"Sources":[{"name":"microsoft.owa.boot.deferred.webservices.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["deferredwebservices"]},"deferredboot":{"Dependencies":["deferredjquery","deferredwebservices"],"Types":["IDiscoveryModuleViewModel","IInferenceTracker","IPublicFolderFeatureManager","IDeferredActionsFactory","IUserActionsInformationViewModelFactory","IUserActionsInformationViewModel","IModelResponseProcessorResolver","ISearchViewModel","IClientInfoCollector","ICategoryManagementDialogViewModel","IOtherUserMailboxFolderTreeViewModel","IOtherUserMailboxFolderTreeViewModelFactory"],"Templates":["ActivityIndicatorPanelView","AppStatusBarView","ArchiveFolderPickerView","BasicInfoBar","CategoryColorPickerTemplates.CategoryColorViewLabelTemplate","CategoryColorPickerTemplates.ColorGridMenuItemTemplate","CategoryColorPickerTemplates.ColorMenuItemTemplate","ConfirmDialog","ContextPeekView","DelayedSendInformationView","EndOfLifeMessageIE9View","FolderPickerContentView","FolderPickerForestView","FolderPickerTouchNarrowView","InfobarBullet","InfoBarMessageForComplexContent","InfoBarMessageSimple","InfoBarMessageWithAction","InfoBarMouse","InfoBarNarrow","InfoBarWide","LocationPlainTextView","MailSearchContainerView","MailSearchSuggestionItemView","MessageBoxContentView","MessageBoxDefaultView","OwaUserConfigurationUpdatedView","OtherUserMailboxFolderTreeView","ResizeControl.ResizeBox","SearchBarAndroidView","SearchBarIOSView","SearchContainerView","SearchContainerViewAppBar","SearchRefinerView","SearchSettingsView","SearchSuggestionListContainerView","SearchSuggestionPopupView","SweepCategorizeOptionsView","SweepDeleteOptionsView","SweepMoveOptionsView","SwipeMenu","UserActionsInformationView","VotingOptionsView"],"Styles":[{"layout":"Mouse","name":"microsoft.owa.boot.deferred.mouse.css","type":"Themed"},{"layout":"Mouse","name":"microsoft.owa.core.controls.extended.mouse.css","type":"Themed"}],"Configurations":[{"type":"BootDeferredComponent"}],"Sources":[{"name":"microsoft.owa.core.controls.extended.js"},{"name":"microsoft.owa.boot.deferred.js"},{"layout":"Mouse","name":"microsoft.owa.boot.deferred.mouse.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.coredeferredstrings.localized.min.js"},{"name":"microsoft.owa.boot.deferredstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["deferredboot"]},"ariaanalytics":{"Dependencies":[],"Types":["IAriaAnalyticsUploader"],"Templates":[],"Styles":[],"Configurations":[{"type":"AriaAnalyticsComponent"}],"Sources":[{"name":"microsoft.owa.ariaanalytics.js"},{"name":"aria-web-telemetry.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["ariaanalytics"]},"sackeranalytics":{"Dependencies":[],"Types":["ISackerAnalyticsUploader"],"Templates":[],"Styles":[],"Configurations":[{"type":"SackerAnalyticsComponent"}],"Sources":[{"name":"microsoft.owa.sackeranalytics.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["sackeranalytics"]},"nonbootwebservices":{"Dependencies":["deferredwebservices"],"Types":["IUseEmptyPostManager"],"Templates":[],"Styles":[],"Configurations":[{"type":"NonBootWebServicesComponent"}],"Sources":[{"name":"microsoft.owa.core.nonboot.webservices.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["nonbootwebservices"]},"serviceworkerboot":{"Dependencies":["deferredboot"],"Types":["IServiceWorkerBoot"],"Templates":[],"Styles":[],"Configurations":[{"type":"ServiceWorkerComponent"}],"Sources":[{"name":"microsoft.owa.serviceworkerboot.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["serviceworkerboot"]},"calendarwebservices":{"Dependencies":["deferredwebservices"],"Types":[],"Templates":[],"Styles":[],"Configurations":[{"type":"CalendarWebServicesComponent"}],"Sources":[{"name":"microsoft.owa.calendar.webservices.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["calendarwebservices"]},"focusedinboxrollup":{"Dependencies":["deferredwebservices","nonbootwebservices","deferredboot","lightning"],"Types":["IFocusedInboxManager"],"Templates":["FocusedRollupItemView.Mouse"],"Styles":[{"layout":"Mouse","name":"microsoft.owa.focusedinboxrollup.mouse.css","type":"Themed"}],"Configurations":[{"type":"FocusedInboxRollupComponent"}],"Sources":[{"name":"microsoft.owa.focusedinboxrollup.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["focusedinboxrollup"]},"lightning":{"Dependencies":["boot","deferredwebservices","deferredboot"],"Types":[],"Templates":["LightningPeekView","LightningPrimaryView"],"Styles":[{"layout":"Mouse","name":"microsoft.owa.lightning.mouse.css","type":"Themed"}],"Configurations":[{"type":"LightningComponent"}],"Sources":[{"name":"microsoft.owa.lightning.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.owa.lightning.strings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["lightning"]},"prefetch":{"Dependencies":[],"Types":["IPrefetchThrottler"],"Templates":[],"Styles":[],"Configurations":[{"type":"PrefetchComponent"}],"Sources":[{"name":"microsoft.owa.prefetch.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["prefetch"]},"boot":{"Dependencies":[],"Types":["OwaStart","IDeferredTypeLoader","IBundledListViewModelFactory","IBootDiagnostics"],"Templates":["HeaderView"],"Styles":[{"layout":"Mouse","name":"sprite1.mouse.css","type":"Sprite"},{"layout":"Mouse","name":"boot.worldwide.mouse.css","type":"Themed"}],"Configurations":[{"type":"CoreFrameworkComponent"},{"type":"BootModelsComponent"},{"type":"CoreControlsComponent"},{"type":"CoreWebServicesComponent"},{"type":"ApplicationAppComponent"},{"type":"BootViewModelsComponent"},{"type":"BootViewsComponent"},{"type":"MailListViewComponent"},{"type":"XOMailListViewViewsComponent"},{"type":"BootReadingPaneComponent"},{"type":"O365ShellCoreG2Component"},{"layout":"Mouse","type":"O365G2HeaderComponent"}],"Sources":[{"layout":"Mouse","name":"empty.js"},{"name":"microsoftajax.js"},{"name":"globalize.js"},{"isDeferrable":true,"name":"microsoft.jsmvvm.framework.js"},{"isDeferrable":true,"name":"microsoft.jsmvvm.controls.js"},{"isDeferrable":true,"name":"microsoft.fabric.framework.js"},{"isDeferrable":true,"name":"microsoft.fabric.models.js"},{"isDeferrable":true,"name":"microsoft.fabric.controls.js"},{"isDeferrable":true,"name":"microsoft.fabric.controls.extended.js"},{"isDeferrable":true,"name":"microsoft.owa.core.notifications.js"},{"isDeferrable":true,"name":"microsoft.owa.core.framework.js"},{"name":"microsoft.owa.program.js"},{"isDeferrable":true,"name":"microsoft.owa.core.webservices.js"},{"isDeferrable":true,"name":"microsoft.owa.boot.common.js"},{"isDeferrable":true,"name":"microsoft.owa.boot.models.js"},{"isDeferrable":true,"name":"microsoft.owa.boot.viewmodels.js"},{"isDeferrable":true,"name":"microsoft.owa.core.controls.js"},{"isDeferrable":true,"name":"microsoft.owa.boot.views.js"},{"layout":"Mouse","isDeferrable":true,"name":"microsoft.owa.boot.views.mouse.js"},{"isDeferrable":true,"name":"microsoft.owa.application.app.js"},{"isDeferrable":true,"name":"microsoft.owa.maillistviewmodels.js"},{"isDeferrable":true,"name":"microsoft.owa.triageactions.js"},{"isDeferrable":true,"name":"microsoft.owa.maillistview.js"},{"layout":"Mouse","name":"microsoft.owa.maillistview.mouse.js"},{"name":"microsoft.owa.xomaillistviewviews.js"},{"layout":"Mouse","isDeferrable":true,"name":"microsoft.owa.xomaillistviewviews.mouse.js"},{"isDeferrable":true,"name":"microsoft.owa.boot.bootreadingpane.js"},{"isDeferrable":true,"name":"microsoft.o365.suiteutil.js"},{"isDeferrable":true,"name":"microsoft.o365.clientlogging.js"},{"isDeferrable":true,"name":"microsoft.o365.clientperformance.js"},{"isDeferrable":true,"name":"microsoft.o365.shellg2.coremin.js"},{"isDeferrable":true,"name":"microsoft.o365.shellg2.core.owa.js"},{"layout":"Mouse","name":"microsoft.o365.shellg2.core.owa.mouse.js"},{"isDeferrable":true,"name":"microsoft.owa.shellcoreg2.o365.js"},{"layout":"Mouse","isDeferrable":true,"name":"microsoft.owa.header.o365g2.js"}],"PackagedSources":[{"layout":"Mouse","isDeferrable":true,"name":"boot.worldwide.0.mouse.js"},{"layout":"Mouse","isDeferrable":true,"name":"boot.worldwide.1.mouse.js"},{"layout":"Mouse","isDeferrable":true,"name":"boot.worldwide.2.mouse.js"},{"layout":"Mouse","isDeferrable":true,"name":"boot.worldwide.3.mouse.js"}],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.strings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.frameworkstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.bootcommonstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.bootmodelsstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.webservicesstrings.localized.min.js"},{"name":"microsoft.o365.shellg2.strings.localized.min.js"}],"PackagedStrings":[{"layout":"Mouse","name":"boot.worldwide.mouse.strings.localized.min.js"}],"IncludedSlabs":["bootjquery","boot","bundledmail","bootdiagnostics","xomaillistviewviews","bootreadingpane","header","reactmail"]},"moderngroupsnavigation":{"Dependencies":["moderngroupsshared","moderngroupscalendarshared","nonbootwebservices","personacontrol","deferredboot","lightning"],"Types":["IModernGroupsNavigationFactory","IModernGroupCalendarsProvider","IGroupMailModuleViewModel","IGroupsNavigationViewModelFactory"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.moderngroupsnavigation.mouse.css","type":"Themed"}],"Configurations":[{"type":"ModernGroupsNavigationComponent"}],"Sources":[{"name":"microsoft.owa.moderngroupsnavigation.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.mgstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.coredeferredstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["moderngroupsnavigation"]},"moderngroupsheader":{"Dependencies":["boot","deferredboot","deferredwebservices","lightning","moderngroupsnavigation","moderngroupsshared","nonbootwebservices","peoplecore","personacontrol","readingpaneshared","readpersoncard","mailcompose"],"Types":["IGetUnifiedGroupMembersActionFactory","IGroupManagementHeaderViewModelFactory","IGroupManagementHeaderViewModelFactoryExtended","IModernGroupCommandsViewModel"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.moderngroupsheader.mouse.css","type":"Themed"}],"Configurations":[{"type":"ModernGroupsHeaderComponent"}],"Sources":[{"name":"microsoft.owa.moderngroupsheader.js"},{"name":"microsoft.owa.moderngroupsheader.groupheaderredesign.js"},{"name":"color-thief.min.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.mgstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["moderngroupsheader"]},"moderngroupscore":{"Dependencies":["boot","deferredboot","deferredwebservices","instantsearch","mailcommon","moderngroupsheader","moderngroupsnavigation","modernreadingpane","moderngroupsshared","nonbootwebservices","peoplecore","readingpaneshared"],"Types":["IGroupConversationItemQueryTableFactory","IGroupConversationDataPrefetcher","IGroupSearchRefinerNavigationViewModelFactory","IGroupSearchViewModel","IGroupFilesModuleViewModel"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.moderngroupscore.mouse.css","type":"Themed"}],"Configurations":[{"type":"ModernGroupsCoreComponent"}],"Sources":[{"name":"microsoft.owa.moderngroupscore.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.coredeferredstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["moderngroupscore"]},"moderngroupspeople":{"Dependencies":["boot","calendarcontrols","calendarcore","deferredboot","moderngroupscompose","moderngroupscore","moderngroupsheader","moderngroupsnavigation","moderngroupsshared","nonbootwebservices","peoplecore","peoplehub","personacardfacade","personacontrol","readpersoncard"],"Types":["IModernGroupsProvider","IGroupPeopleModuleViewModel"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.moderngroupspeople.mouse.css","type":"Themed"}],"Configurations":[{"type":"ModernGroupsPeopleComponent"}],"Sources":[{"name":"microsoft.owa.moderngroupspeople.js"},{"layout":"Mouse","name":"microsoft.owa.moderngroupspeople.mouse.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.mgstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.strings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["moderngroupspeople"]},"addroom":{"Dependencies":["deferredboot","deferredwebservices","calendarwebservices","calendarcore"],"Types":[],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.calendar.addroom.mouse.css","type":"Themed"}],"Configurations":[{"type":"CalendarAddRoomComponent"}],"Sources":[{"name":"microsoft.owa.calendar.addroom.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.calarstrings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["addroom"]},"analytics":{"Dependencies":[],"Types":["IAnalyticsUploader"],"Templates":[],"Styles":[],"Configurations":[{"type":"AnalyticsComponent"}],"Sources":[{"name":"microsoft.owa.analytics.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["analytics"]},"moderngroupscompose":{"Dependencies":["boot","commoncompose","editor","findpeople","lightning","mailcommon","mailcompose","moderngroupscore","modernreadingpane","personacontrol","quickcompose","recipientwell"],"Types":["IGroupInlineComposeActionFactory","IGroupInlineComposeConductorViewModelFactory","IGroupInlineComposeViewModelFactory","IGroupMailComposeViewModelFactory","IGroupQuickComposeContextFactory","IGroupQuickComposeViewModel"],"Templates":["GroupInlineComposeView","GroupFullComposeView"],"Styles":[{"layout":"Mouse","name":"microsoft.owa.moderngroupscompose.mouse.css","type":"Themed"}],"Configurations":[{"type":"ModernGroupsComposeComponent"}],"Sources":[{"name":"microsoft.owa.moderngroupscompose.js"}],"PackagedSources":[],"Strings":[{"name":"microsoft.exchange.clients.owa2.client.commonstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.coredeferredstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.nonbootstrings.localized.min.js"},{"name":"microsoft.exchange.clients.owa2.client.strings.localized.min.js"}],"PackagedStrings":[],"IncludedSlabs":["moderngroupscompose"]},"modernreadingpane":{"Dependencies":["nonbootwebservices","quickcompose","recipientwell","personacontrol","readingpaneshared","deferredboot","modernbootreadingpane","hashtagsux","introductionPeek"],"Types":["IModernMarkAsReadConversationActionFactory","ModernReadingPaneViewModelBase","IModernItemPartViewModelFactory","IModernItemReadingPaneViewModelFactory","IModernItemReadingPaneViewModelPopOutFactory"],"Templates":[],"Styles":[{"layout":"Mouse","name":"microsoft.owa.modernreadingpane.mouse.css","type":"Themed"}],"Configurations":[{"type":"ModernReadingPaneComponent"}],"Sources":[{"name":"microsoft.owa.modernreadingpane.js"},{"layout":"Mouse","name":"microsoft.owa.modernreadingpane.mouse.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["modernreadingpane"]},"modernbootreadingpane":{"Dependencies":["nonbootwebservices","quickcompose"],"Types":[],"Templates":[],"Styles":[],"Configurations":[{"type":"ModernBootReadingPaneComponent"}],"Sources":[{"name":"microsoft.owa.modernbootreadingpane.js"}],"PackagedSources":[],"Strings":[],"PackagedStrings":[],"IncludedSlabs":["modernbootreadingpane"]}};
                var languageMarker = '##lang##';
                var cultureMarker = '##culture##';
                var localeMarker  = '##locale##';
            
                function checkUTFEncoding() {
                    var decodedString = "你好A";
                    if (htmlDec("&#20320;&#22909;&#65;") != decodedString) {
                        alert("Outlook necesita que el explorador use la codificación UTF-8. Para su protección, se cerrará su sesión. Establezca la codificación del explorador en UTF-8 y vuelva a iniciar sesión.");
                        window.location.href = "/owa/logoff.owa";
                    }
                }

                checkUTFEncoding();

                userScriptResources[userScriptResources.length] = { "fileName": "prem/16.1409.12.2104857/scripts/##lang##/boot.worldwide.mouse.strings.localized.min.js"};
userScriptResources[userScriptResources.length] = { "fileName": "prem/16.1409.12.2104857/scripts/globalize/globalize.culture.##culture##.js"};
styleResources[styleResources.length] = { "fileName": "prem/16.1409.12.2104857/resources/images/##locale##/sprite1.mouse.css"};
styleResources[styleResources.length] = { "fileName": "prem/16.1409.12.2104857/resources/styles/##locale##/boot.worldwide.mouse.css"};

                window.scriptsLoaded = window.scriptsLoaded || {};

                
                    window.scriptsLoaded['boot.worldwide.0.mouse.init.js'] = 0;
                
                    window.scriptsLoaded['boot.worldwide.1.mouse.init.js'] = 0;
                
                    window.scriptsLoaded['boot.worldwide.2.mouse.init.js'] = 0;
                
                    window.scriptsLoaded['boot.worldwide.3.mouse.init.js'] = 0;
                
            }
            catch (ex) {
                window.owaLastErrorReported = ex;
                throw ex;
            }

            function UpdateUserData(template) {
                for (var i = 0; i < template.length; ++i) {
                    if (template[i] != null && template[i]["fileName"] != null) {
                        template[i]["fileName"] = template[i]["fileName"].replace(languageMarker, userLanguageVar).replace(cultureMarker, userCultureVar).replace(localeMarker, stylesLocale).toLowerCase();
                    }
                }
            }

            function setupUserSpecificResources(serverVersion, curTheme, curCulture, curLang, isRtl, minOwsVersion, serverOwsVersion, curStyleLocale, userSpecificResourcesHash, curFeatures, curDefaultAspxVer, fontFamilies, themedColors, headerTheme, forceBO, osfLang) {
                try{
                    var defaultPageVer = 6;
                    var forcePLTOnVersionChange = false;
                    var versionCheckPassed = defaultPageVer == curDefaultAspxVer;

                    if (forcePLTOnVersionChange) {
                        versionCheckPassed = versionCheckPassed && serverVersion == sver;
                    }
                    else {
                        if (true) {
                            var clientVer = _g.OWSVersion.create(_g.ClientVersionProvider.currentOWSVersion);
                            var serverVer = _g.OWSVersion.create(serverOwsVersion);
                            var minVer = _g.OWSVersion.create(minOwsVersion);
                            versionCheckPassed = versionCheckPassed && clientVer.supports(minVer);

                            if (false) {
                               versionCheckPassed = versionCheckPassed && serverVer.supports(clientVer);
                            }
                        }
                    }

                    var addStyles = function(blockId, blockContent) {
                        var styleBlock = null;
                        if (blockContent)
                        {
                            styleBlock = document.getElementById(blockId);
                            if (styleBlock)
                            {
                                styleBlock.appendChild(document.createTextNode(blockContent));
                            }
                        }
                    };

                    var replaceTokens = function(templateString, tokens) {
                        if (templateString) {
                            return templateString.replace(/@([^;}\/\\]+)/g, function(match, token) {
                                if (token in tokens) {
                                    if (/(^(#)?[0-9A-F]{6}$)|(^(#)?[0-9A-F]{3}$)/i.test(tokens[token])){
                                        if (tokens[token][0] != '#') {
                                            return '#' + tokens[token];
                                        }
                                    }
                                    return tokens[token];
                                }
                                return "transparent";
                            });
                        }

                        return '';
                    };

                    var localeStyles = '';
                    var themedColorStlyes = '';
                    var headerImageStyles = '';

                    if (typeof(fontFamilies) != 'undefined' && typeof(LocaleFontFamilyTemplate) != 'undefined') {
                        localeStyles += replaceTokens(LocaleFontFamilyTemplate, fontFamilies);
                    }

                    if (typeof(headerTheme) != 'undefined' && typeof(HeaderImageTemplate) != 'undefined') {
                        headerImageStyles += replaceTokens(HeaderImageTemplate, headerTheme);
                    }

                    if (typeof(themedColors) != 'undefined') {
                        if (typeof(ThemedColorTemplate) != 'undefined') {
                            themedColorStlyes += replaceTokens(ThemedColorTemplate, themedColors);
                        }

                        if (typeof(o365ColorTemplate) != 'undefined') {
                            themedColorStlyes += replaceTokens(o365ColorTemplate, themedColors);
                        }
                    }

                    if (localeStyles) {
                        addStyles("FontLocaleStyles", localeStyles);
                    }

                    if (themedColorStlyes) {
                        addStyles("ThemedColorStyles", themedColorStlyes);
                    }

                    if (headerImageStyles) {
                        addStyles("HeaderImages", headerImageStyles);
                    }

                    var redirectParam = 'ver' + '=' + serverVersion;
                    if (!forceBO && versionCheckPassed &&
                            (serverVersion == sver || 
                            (curTheme == clientTheme && curCulture == userCultureVar && curLang == userLanguageVar))|| 
                            window.location.href.indexOf(redirectParam) >=0) {
                        clientTheme = curTheme;
                        userCultureVar = curCulture;
                        userLanguageVar = curLang;
                        osfLanguageVar = osfLang;
                        userCultureRtl = isRtl;
                        stylesLocale = curStyleLocale;

                        document.getElementsByTagName("html")[0].setAttribute('dir', isRtl ? "rtl" : "ltr");

                        UpdateUserData(userScriptResources);
                        UpdateUserData(styleResources);

                        
                        if (isPopOut) {
                            window.owaSDState.usrPending = 0;
                            loadScripts(userScriptResources, cdnEndPointNameForBootResources != "", false);
                        } else {
                            window.owaSDState.usrPending += userScriptResources.length;
                            loadScripts(userScriptResources, cdnEndPointNameForBootResources != "", true, onUSRPendingComplete, onUSRPendingError);
                        }
                        
                    }
                    else {
                        if (!versionCheckPassed) {
                            setLocalStorageValue("rebootReason", "4");
                        }
                        else if (forceBO) {
                            setLocalStorageValue("rebootReason", "11");
                        }
                        else {
                            setLocalStorageValue("rebootReason", "7");
                        }
                        redirect('ver', serverVersion,'cver', sver, 'vC', (versionCheckPassed ? 1 : 0), 'forceBO', forceBO);
                    }
                }
                catch (ex) {
                    window.owaLastErrorReported = ex;
                    throw ex;
                }
            }
        </script>
        
        <span style='font-family:"wf_segoe-ui_light";'>t</span>
        <span style='font-family:"wf_segoe-ui_normal";'>t</span>
        <span style='font-family:"wf_segoe-ui_semibold";'>t</span>
        <span style='font-family:"wf_segoe-ui_semilight";'>t</span>
        <span style='font-family:"webfontPreload";'></span>
        
        <script src="prem/16.1409.12.2104857/scripts/boot.worldwide.0.mouse.init.js" onerror="onScriptLoadError2(this)"></script>
        <script>parseEndTimes["boot.worldwide.0.mouse.init.js"] = ((new Date()) - window.dateZero);</script>
        
        <script src="prem/16.1409.12.2104857/scripts/boot.worldwide.1.mouse.init.js" onerror="onScriptLoadError2(this)"></script>
        <script>parseEndTimes["boot.worldwide.1.mouse.init.js"] = ((new Date()) - window.dateZero);</script>
        
        <script src="prem/16.1409.12.2104857/scripts/boot.worldwide.2.mouse.init.js" onerror="onScriptLoadError2(this)"></script>
        <script>parseEndTimes["boot.worldwide.2.mouse.init.js"] = ((new Date()) - window.dateZero);</script>
        
        <script src="prem/16.1409.12.2104857/scripts/boot.worldwide.3.mouse.init.js" onerror="onScriptLoadError2(this)"></script>
        <script>parseEndTimes["boot.worldwide.3.mouse.init.js"] = ((new Date()) - window.dateZero);</script>
        
        <script>parseEndTimes["allBootScripts"] = ((new Date()) - window.dateZero);</script>

        
        <script>
            if (isPopOut) {
                document.write("<script src='" + "userspecificresourceinjector.ashx?ver=16.1409.12.2104857&appcacheclient=1&layout=mouse" + "'></"+"script>");
                document.write("<script" + ">parseEndTimes['userspecificresourceinjector.ashx'] = ((new Date()) - window.dateZero);</"+"script>");
                document.write("<script" + ">loadStyles(styleResources);</"+"script>");
            }
        </script>
        
            <script>
                try{
                    window.owaSDState.usrConsumable = true;
                    tryConsumeUSR();
                }
                catch (ex){
                    window.owaLastErrorReported = ex;
                    throw ex;
                }
            </script>
        
        <script>
            function cdnVersionCheckFailed() {
                var redirectParam = 'cdn=1';
                if (window.location.href.indexOf(redirectParam) < 0) {
                    redirect('cdn', '1', 'ver', sver);
                }
            }

            try
            {
                var scriptElement = document.createElement("script");
                scriptElement.src = "https://r1.res.office365.com/owa/prem/16.1409.12.2104857/scripts/cdnversioncheck.js" + "?rand=" + Date.now();
                scriptElement.async = true;
                scriptElement.onerror = cdnVersionCheckFailed;
                document.getElementsByTagName('body')[0].appendChild(scriptElement);
            }
            catch (ex)
            {
                window.owaLastErrorReported = ex;
                throw ex;
            }
        </script>
        
            <img src='prem/16.1409.12.2104857/resources/images/0/sprite1.mouse.png'/>
        
    </div>
  </body>
    
    <script>
        
        function invokeMain(){
            try{
                setStartRenderTime();
                readingPaneOn = PageDataPayload.getConversationItems != null ? true : false;
                Program.main({'version': '16.1409.12.2104857','serverVersion': besver,'startTime': startLoadTime,'bootedFromAppcache': appCachedPage,'cdnEndpoint': 'https://r1.res.office365.com/','mapControlUrl': 'https://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0&s=1&mkt=es-CO','appDomainAppVirtualPath': '/owa','layout': layout,'uiCulture': userCultureVar,'uiLang': userLanguageVar,'osfLang': osfLanguageVar,'userCultureRtl': userCultureRtl,'uiTheme': clientTheme,'osfStringPath': 'https://r1.res.office365.com/owa/prem/16.1409.12.2104857/scripts/ext/##culture##/osfruntime_strings.js','scriptsFolder': 'https://r1.res.office365.com/owa/prem/16.1409.12.2104857/scripts','fallbackScriptsFolder': 'prem/16.1409.12.2104857/scripts','stringsFolder': 'https://r1.res.office365.com/owa/prem/16.1409.12.2104857/scripts','fallbackStringsFolder': 'prem/16.1409.12.2104857/scripts','resourcesFolder': 'https://r1.res.office365.com/owa/prem/16.1409.12.2104857/resources','clientSettings': {ActiveSyncSuppressReadReceipt:{"Name":"ActiveSyncSuppressReadReceipt","Enabled":true},AddinCommandDesign_F:{"Name":"AddinCommandDesign_F","Enabled":true},AgavePerformance:{"Name":"AgavePerformance","Enabled":true},AgendaMail:{"Name":"AgendaMail","Enabled":true},AtAllMentionUX:{"Name":"AtAllMentionUX","Enabled":true},AttachmentsFilePicker:{"Name":"AttachmentsFilePicker","Enabled":true},BasicLodgingReservationV1:{"Name":"BasicLodgingReservationV1","Enabled":true},BasicParcelDeliveryV1:{"Name":"BasicParcelDeliveryV1","Enabled":true},BasicRentalCarReservationV1:{"Name":"BasicRentalCarReservationV1","Enabled":true},CalendarFeeds:{"Name":"CalendarFeeds","Enabled":true},ClearCalendarOOF:{"Name":"ClearCalendarOOF","Enabled":true},ContextualApps:{"Name":"ContextualApps","Enabled":true},CopyLinkToConversation:{"Name":"CopyLinkToConversation","Enabled":true},EmailReminders:{"Name":"EmailReminders","Enabled":true},EmailRemindersRefresh:{"Name":"EmailRemindersRefresh","Enabled":true},EmojiContextualSearch:{"Name":"EmojiContextualSearch","Enabled":true},EnableConnectorsQueryParam:{"Name":"EnableConnectorsQueryParam","Enabled":true},EnableEnterpriseFBL:{"Name":"EnableEnterpriseFBL","Enabled":true},EnableFBL:{"Name":"EnableFBL","Enabled":true},EnhancedLocationAutosuggest:{"Name":"EnhancedLocationAutosuggest","Enabled":true},EwsGroupsInOwa:{"Name":"EwsGroupsInOwa","Enabled":true},FastSaveInboxRules:{"Name":"FastSaveInboxRules","Enabled":true},Filmstrip:{"Name":"Filmstrip","Enabled":true},FindPeopleEntityFeedback:{"Name":"FindPeopleEntityFeedback","Enabled":true},FindUnifiedGroupsEWS:{"Name":"FindUnifiedGroupsEWS","Enabled":true},FolderBasedClutter:{"Name":"FolderBasedClutter","Enabled":true},GroupsOobe:{"Name":"GroupsOobe","Enabled":true},GroupsRegionalConfiguration:{"Name":"GroupsRegionalConfiguration","Enabled":true},ImportIcs:{"Name":"ImportIcs","Enabled":true},InfoTipsSettings:{"MinimumConfidenceScore":200,"Name":"InfoTipsSettings"},InlinePreview:{"Name":"InlinePreview","Enabled":true},InstantSearch:{"Name":"InstantSearch","Enabled":true},InstantSearchHistorySuggestions:{"Name":"InstantSearchHistorySuggestions","Enabled":true},InstantSearchRefiners:{"Name":"InstantSearchRefiners","Enabled":true},InstantSurfaceFiltering:{"Name":"InstantSurfaceFiltering","Enabled":true},IsConnectorsIFramed:{"Name":"IsConnectorsIFramed","Enabled":true},LightBoxV3:{"Name":"LightBoxV3","Enabled":true},LightningCalendarFeeds:{"Name":"LightningCalendarFeeds","Enabled":true},LightningConsumerFirstRun:{"Name":"LightningConsumerFirstRun","Enabled":true},LightningConsumerPromotion:{"Name":"LightningConsumerPromotion","Enabled":true},LightningSatisfactionFirstSurvey:{"Name":"LightningSatisfactionFirstSurvey","Enabled":true},LightningSatisfactionSecondSurvey:{"Name":"LightningSatisfactionSecondSurvey","Enabled":true},LightningSkypePromotion:{"Name":"LightningSkypePromotion","Enabled":true},Like:{"Name":"Like","Enabled":true},LWX:{"SkypeScriptsUrl":"https://swx.cdn.skype.com/shared/v/1.2.14/SkypeBootstrap.min.js","SkypeConsumerApiKey":"b28f4819-da61-4880-94ab-4198414ff64c","SkypeEnterpriseApiKey":"b32c0389-1143-4a42-b15f-7b860f9eafbb","Name":"LWX","Enabled":true},ManageCalendarFeeds:{"Name":"ManageCalendarFeeds","Enabled":true},MCImage:{"Name":"MCImage","Enabled":true},MCMotionThumbnails:{"Name":"MCMotionThumbnails","Enabled":true},MCMoveImageAttachment:{"Name":"MCMoveImageAttachment","Enabled":true},MentionsUX:{"Name":"MentionsUX","Enabled":true},MessageSafetyReporting:{"Name":"MessageSafetyReporting","Enabled":true},ModernAttachments:{"Name":"ModernAttachments","Enabled":true},ModernGroupsComposePopout:{"Name":"ModernGroupsComposePopout","Enabled":true},ModernGroupsConversationsUseNotificationBroker:{"Name":"ModernGroupsConversationsUseNotificationBroker","Enabled":true},ModernGroupsDeleteMessage:{"Name":"ModernGroupsDeleteMessage","Enabled":true},ModernGroupsDirectDelivery:{"Name":"ModernGroupsDirectDelivery","Enabled":true},ModernGroupsFullCompose:{"Name":"ModernGroupsFullCompose","Enabled":true},ModernGroupsLikersStringBottom:{"Name":"ModernGroupsLikersStringBottom","Enabled":true},ModernGroupsLockConversation:{"Name":"ModernGroupsLockConversation","Enabled":true},ModernGroupsOpenInSeparateWindow:{"Name":"ModernGroupsOpenInSeparateWindow","Enabled":true},ModernGroupsQuickCompose:{"Name":"ModernGroupsQuickCompose","Enabled":true},ModernGroupsQuotedText:{"Name":"ModernGroupsQuotedText","Enabled":true},ModernGroupsSyncDelivery:{"Name":"ModernGroupsSyncDelivery","Enabled":true},NewGroupFromInboxCommandBar:{"Name":"NewGroupFromInboxCommandBar","Enabled":true},NotificationBroker:{"Name":"NotificationBroker","Enabled":true},O365FlexPanePanel:{"Name":"O365FlexPanePanel","Enabled":true},O365Miniatures:{"Name":"O365Miniatures","Enabled":true},O365NFDPanel:{"Name":"O365NFDPanel","Enabled":true},O365Panorama:{"Name":"O365Panorama","Enabled":true},O365SuiteDataSharing:{"Name":"O365SuiteDataSharing","Enabled":true},O365SuiteMeControl:{"Name":"O365SuiteMeControl","Enabled":true},O365ThemePanel:{"Name":"O365ThemePanel","Enabled":true},OwaBox:{"Name":"OwaBox","Enabled":true},OwaCancelCalendarEvent:{"Name":"OwaCancelCalendarEvent","Enabled":true},OwaClassicSlicedAttachments:{"Name":"OwaClassicSlicedAttachments","Enabled":true},OwaClassicSlicedAttachmentsV2:{"Name":"OwaClassicSlicedAttachmentsV2","Enabled":true},OwaConvertAttachmentType:{"Name":"OwaConvertAttachmentType","Enabled":true},OwaCreateCalendarEvent:{"Name":"OwaCreateCalendarEvent","Enabled":true},OwaDeferrableSlabs:{"Name":"OwaDeferrableSlabs","Enabled":true},OwaDeferredjQuery:{"Name":"OwaDeferredjQuery","Enabled":true},OwaDeleteCalendarEvent:{"Name":"OwaDeleteCalendarEvent","Enabled":true},OWADistributionGroups:{"Name":"OWADistributionGroups","Enabled":true},OwaDropbox:{"Name":"OwaDropbox","Enabled":true},OwaFilePickerV2:{"Name":"OwaFilePickerV2","Enabled":true},OwaForwardCalendarEvent:{"Name":"OwaForwardCalendarEvent","Enabled":true},OwaGetCalendarEvent:{"Name":"OwaGetCalendarEvent","Enabled":true},OWAInClientStore:{"Name":"OWAInClientStore","Enabled":true},OWAInClientStoreFeedback:{"Name":"OWAInClientStoreFeedback","Enabled":true},OWAInClientStoreMenuTitle1:{"Name":"OWAInClientStoreMenuTitle1","Enabled":true},OwaLightning:{"Name":"OwaLightning","Enabled":true},OwaLinkPrefetch:{"Name":"OwaLinkPrefetch","Enabled":true},OwaLocationEntityFeedback:{"Name":"OwaLocationEntityFeedback","Enabled":true},OwaSaveToCloud:{"Name":"OwaSaveToCloud","Enabled":true},OwaShowActiveGroupsInDiscovery:{"Name":"OwaShowActiveGroupsInDiscovery","Enabled":true},OwaSlicedAttachments:{"Name":"OwaSlicedAttachments","Enabled":true},OwaTimeEntityFeedback:{"Name":"OwaTimeEntityFeedback","Enabled":true},OwaUpdateCalendarEvent:{"Name":"OwaUpdateCalendarEvent","Enabled":true},PrankieAndFavoritesForUnifiedGroups:{"Name":"PrankieAndFavoritesForUnifiedGroups","Enabled":true},PrankieForUnifiedGroups:{"Name":"PrankieForUnifiedGroups","Enabled":true},PromptUnblockPopup:{"Name":"PromptUnblockPopup","Enabled":true},RPDefaultReplyOption:{"Name":"RPDefaultReplyOption","Enabled":true},RWSelfAsYou:{"Name":"RWSelfAsYou","Enabled":true},SaveToOneNote:{"Name":"SaveToOneNote","Enabled":true},SuperEmptyPost:{"Name":"SuperEmptyPost","Enabled":true},SuperExperiment8:{"Name":"SuperExperiment8","Enabled":true},SuperMailLink:{"Name":"SuperMailLink","Enabled":true},SuperScheduledFolder:{"Name":"SuperScheduledFolder","Enabled":true},SuperSearch:{"Name":"SuperSearch","Enabled":true},SuperSort:{"Name":"SuperSort","Enabled":true},SuperStart:{"Name":"SuperStart","Enabled":true},SuperSwipe:{"Name":"SuperSwipe","Enabled":true},SuperTriageThree:{"Name":"SuperTriageThree","Enabled":true},SuperTriageTwo:{"Name":"SuperTriageTwo","Enabled":true},SuperUnsubscribe:{"Name":"SuperUnsubscribe","Enabled":true},SuperVlvPerf:{"Name":"SuperVlvPerf","Enabled":true},SuperVlvSelection:{"Name":"SuperVlvSelection","Enabled":true},TailoredFeedbackV1:{"Name":"TailoredFeedbackV1","Enabled":true},TailoredFlightsV1:{"Name":"TailoredFlightsV1","Enabled":true},TailoredLodgingReservationV1:{"Name":"TailoredLodgingReservationV1","Enabled":true},TailoredParcelDeliveryV1:{"Name":"TailoredParcelDeliveryV1","Enabled":true},TailoredPropertiesMailV1:{"Name":"TailoredPropertiesMailV1","Enabled":true},TailoredPropertiesV1:{"Name":"TailoredPropertiesV1","Enabled":true},TailoredRentalCarReservationV1:{"Name":"TailoredRentalCarReservationV1","Enabled":true},TestNonPrefix_c:{"Name":"TestNonPrefix_c","Enabled":true},TextBoys:{"Name":"TextBoys","Enabled":true},TimeProfile:{"Name":"TimeProfile","Enabled":true},UnifiedGroupDataClassification:{"Name":"UnifiedGroupDataClassification","Enabled":true},UnifiedGroupHeaderV1:{"Name":"UnifiedGroupHeaderV1","Enabled":true},UnifiedGroupsAccessTypeSwitch:{"Name":"UnifiedGroupsAccessTypeSwitch","Enabled":true},UnifiedGroupsBulkAdditionSwitch:{"Name":"UnifiedGroupsBulkAdditionSwitch","Enabled":true},UrlManager:{"Name":"UrlManager","Enabled":true},UserVoiceSuggestion:{"Name":"UserVoiceSuggestion","Enabled":true},XOClientLoggingProduction:{"ClientLoggingUrl":"https://clientlog.portal.office.com/l.l/","ClientLoggingThreshold":0.0,"Name":"XOClientLoggingProduction","Enabled":true},XOFilterReportingOptions:{"Name":"XOFilterReportingOptions","Enabled":true},XOWAAds:{"DogfoodEnvironmentValue":"Prod","AdBarSdkBaseUrl":"https://r1.res.office365.com/adbar/v2.8/","AdBarSdkScript":"https://r1.res.office365.com/adbar/v2.8/adbar.js","SupportedMarkets":["AR-SA","AR-AE","AR-EG","DA-DK","DE-AT","DE-CH","DE-DE","EL-GR","EN-AE","EN-AR","EN-AT","EN-AU","EN-BR","EN-CA","EN-CH","EN-CL","EN-CO","EN-DE","EN-DK","EN-EG","EN-FI","EN-GB","EN-GR","EN-HK","EN-ID","EN-IE","EN-IN","EN-MX","EN-MY","EN-NL","EN-NO","EN-NZ","EN-PE","EN-PH","EN-PL","EN-PT","EN-RU","EN-SA","EN-SE","EN-SG","EN-TH","EN-TR","EN-US","EN-VN","EN-ZA","ES-AR","ES-CL","ES-CO","ES-CR","ES-DO","ES-EC","ES-ES","ES-GT","ES-MX","ES-PE","ES-US","ES-VE","FI-FI","FIL-PH","FR-BE","FR-CA","FR-CH","FR-FR","ID-ID","IT-IT","JA-JP","KO-KR","MS-MY","NB-NO","NL-BE","NL-NL","PL-PL","PT-BR","PT-PT","RU-RU","SV-SE","TH-TH","TR-TR","VI-VN","ZH-CN","ZH-HK","ZH-SG","ZH-TW"],"OwaAdBarBaseUrl":"https://r1.res.office365.com/adbar/v2.8/","OwaAdBarScript":"https://r1.res.office365.com/adbar/v2.8/adbar.js","OwaAdBarCountries":["BR","CA","DE","ES","FR","GB","IT","JP","US","AT","FI","NO","DK","IE","PT","CH","BE","NL","SE","AE","AR","CL","CO","CR","DO","EC","EG","GR","GT","HK","ID","IL","IN","KR","MX","MY","PA","PE","PH","PL","PY","QA","RO","RU","SA","SG","TH","TR","TT","TW","UA","UY","VE","VN","ZA","AU","NZ","CN"],"AstScriptUrl":"https://acdn.adnxs.com/ast/static/0.3.8/ast.js","AdsInComposeSupportedMarkets":["EN-US","PT-BR","ES-MX","EN-GB","ES-CO"],"Name":"XOWAAds","Enabled":true},XOWAAdsShowInCompose:{"Name":"XOWAAdsShowInCompose","Enabled":true},XOWAAdsUseOwaSdk:{"Name":"XOWAAdsUseOwaSdk","Enabled":true},XOWAAttachmentsFilePickerSorting:{"Name":"XOWAAttachmentsFilePickerSorting","Enabled":true},XOWACircularAvatars:{"Name":"XOWACircularAvatars","Enabled":true},XOWAClientConnectedAccountsVnext:{"Name":"XOWAClientConnectedAccountsVnext","Enabled":true},XOWAClientThumbnail:{"Name":"XOWAClientThumbnail","Enabled":true},XOWAConsumerFirstRun:{"Name":"XOWAConsumerFirstRun","Enabled":true},XOWAConsumerNotificationPanel:{"Name":"XOWAConsumerNotificationPanel","Enabled":true},XOWAConsumerPromotion:{"ServiceUrl":"https://upsell.azurewebsites.net/","ViewChancePercent":33,"ORMServiceUrl":"https://onerm.azurewebsites.net/","Name":"XOWAConsumerPromotion"},XOWAContactDetails:{"Name":"XOWAContactDetails","Enabled":true},XOWADeepLinkMail:{"Name":"XOWADeepLinkMail","Enabled":true},XOWADownloadDomain:{"Name":"XOWADownloadDomain","Enabled":true},XOWAExtendedFlattenRecipientWell:{"Name":"XOWAExtendedFlattenRecipientWell","Enabled":true},XOWAFlattenRecipientWell:{"Name":"XOWAFlattenRecipientWell","Enabled":true},XOWAFrequentContacts:{"Name":"XOWAFrequentContacts","Enabled":true},XOWAHolidayCalendars:{"Name":"XOWAHolidayCalendars","Enabled":true},XOWAIsConsumerUser:{"Name":"XOWAIsConsumerUser","Enabled":true},XOWAMail:{"Name":"XOWAMail","Enabled":true},XOWAOneDriveSxS:{"Name":"XOWAOneDriveSxS","Enabled":true},XOWAPeopleBulkActions:{"Name":"XOWAPeopleBulkActions","Enabled":true},XOWAPeopleCommandBar:{"Name":"XOWAPeopleCommandBar","Enabled":true},XOWAPeopleMultiSelect:{"Name":"XOWAPeopleMultiSelect","Enabled":true},XOWAPeopleToPicker:{"Name":"XOWAPeopleToPicker","Enabled":true},XOWAPeopleTypeAheadSearch:{"Name":"XOWAPeopleTypeAheadSearch","Enabled":true},XOWARecipientWell:{"Name":"XOWARecipientWell","Enabled":true},XOWASeparateSafeLists:{"Name":"XOWASeparateSafeLists","Enabled":true},XOWASharing:{"Name":"XOWASharing","Enabled":true},XOWAShowPersonaCardOnHover:{"Name":"XOWAShowPersonaCardOnHover","Enabled":true},XOWASuperSweep:{"Name":"XOWASuperSweep","Enabled":true},XOWAUserVoiceSatisfactionWidget:{"Name":"XOWAUserVoiceSatisfactionWidget","Enabled":true},XOWAUserVoiceWidget:{"Name":"XOWAUserVoiceWidget","Enabled":true},XOWAWeather:{"Name":"XOWAWeather","Enabled":true},YammerIntegrationWithOutlookGroups:{"Name":"YammerIntegrationWithOutlookGroups","Enabled":true}},'themedImagesFolderFormat': 'https://r1.res.office365.com/owa/prem/16.1409.12.2104857/resources/images/#LCL','stylesFolderFormat': 'https://r1.res.office365.com/owa/prem/16.1409.12.2104857/resources/styles/#LCL','stylesLocale': stylesLocale,'owaDeferrableSlabsEnabled': true}, slabManifest);
                PageDataPayload = {};
                document.getElementById('preloadDiv').style.display = "none";
            }
            catch (ex) {
                window.owaLastErrorReported = ex;
                throw ex;
            }
        }

        function owastart() {
            if (!userSpecificsLoaded && window.owaSD.status == 200) {
                handleBootError2('UserSpecificError');
                return;
            }

            if (!window.owaSD || window.owaSDState.consumed) {
                return;
            }

            window.owaSDState.consumed=true;
            if (window.owaSD.readyState == 4) { 
                if (window.owaSD.status == 200) {
                    try {
                        PageDataPayload = JsonParser.deserialize(window.owaSDState.data);               
                        besver = window.owaSD.getResponseHeader("X-OWA-Version")

                        
                    } catch (e) { 
                        var data = window.owaSDState.data;
                        var validResponse = data != null && data.indexOf('{') == 0 && data.lastIndexOf('}') == data.length-1 && data.indexOf('owaUserConfig') != -1;
                        var SDIsNotNull = data != null;
                        var errMsg = 'SrvErr:' + window.owaSD.getResponseHeader("X-OWA-Error") + ',ClientErr:' + e.message + ',ValidResponse:' + validResponse + ',SDIsNotNull:' + SDIsNotNull;
                        if (SDIsNotNull)
                        {
                            var bracketsInPair = data.indexOf('{') == 0 && data.lastIndexOf('}') == data.length-1;
                            var owaUserConfigExists = data.indexOf('owaUserConfig') != -1;
                            var subStringFromLastLeftBracket = data.substring(data.lastIndexOf('{'));
                            errMsg += ',BracketsInPair:' + bracketsInPair + ',OwaUserConfigExists:' + owaUserConfigExists + ',SubStringFromLastLeftBracket:' + subStringFromLastLeftBracket;
                        }
                        handleBootError2(
                            'SessionDataError',
                            errMsg,
                            window.owaSD.getResponseHeader("X-OWA-Version"),
                            window.owaSD.getResponseHeader('X-BEServer'));
                        return;
                    }
                } else {
                    var errMsg = window.owaSD.getResponseHeader("X-Auth-Error");
                    var errType = "SDAuthErr";
                    if (!errMsg) {
                        errMsg = window.owaSD.getResponseHeader("X-OWA-Error");
                        errType = "SDServerErr";
                    }

                    handleBootError2(
                        errType,
                        errMsg,
                        window.owaSD.getResponseHeader("X-OWA-Version"),
                        window.owaSD.getResponseHeader('X-CalculatedBETarget'));

                    if (!userEnabledOffline()) {
                        return;
                    }
                  }
            }

            
                pbar.renderCompleted();
                
                setTimeout(invokeMainandTrace, 0);
            
            }

        function invokeMainandTrace()
        {
            invokeMain();
            if (window.owaSD.readyState == 4) {
                postBootTrace('success;' + window.owaSD.status);
            } else {
                postBootTrace('success;' + window.owaSD.readyState);
            }
        }

        function owastartpopout()
        {
            if (!userSpecificsLoaded) {
                handleBootError2('UserSpecificError');
                return;
            }

            invokeMain();
            cleanupErrorCallback();
        }

        function startUpOwa() {
            parseEndTimes["allDone"] = ((new Date()) - (new Date(0)));

            if (isPopOut) {
                owastartpopout();
            } else {
                window.owaSDConsumable=true;
                if (window.owaSDdidHandlerExecute || userEnabledOffline()) {
                    owastart();
                }
            }
        }

        try
        {
            
            if (window.owaSDState.usrPending == 0) {
                startUpOwa();
            }
            
        }
        catch (ex) {
            window.owaLastErrorReported = ex;
            throw ex;
        }
    </script>
</html>
