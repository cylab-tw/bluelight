var OAuthConfig = {};
var keycloakAPI = "";

//auth();
window.addEventListener("load", function(event) {
    auth();
});
/**
 * Login Auth Check
 */
async function auth() {
    OAuthConfig = await loadOAuthConfig("../data/configOAuth.json");
    if (OAuthConfig.enabled) {
        let theToken = getCookie("access_token");
        let searchParams = new URL(window.location.href).searchParams;
        let authCode = searchParams.get("code");
        let session_state = searchParams.get("session_state");
        let thePort = OAuthConfig.port != "" ? `:${OAuthConfig.port}` : "";
        keycloakAPI = `${OAuthConfig.http}://${OAuthConfig.hostname}${thePort}/`;

        // No token but have auth code (usually when it's login complete and is redirecting back).
        if (theToken == "" && authCode != null) {
            theToken = await requestToken(authCode, session_state);
        }
        // Have token so let's see if it's vaild or not.
        let tokenVaild = await isTokenVaild(theToken);
        if (tokenVaild) {
            if(window.location.href.indexOf(`code=`) != -1)
            {
                try {
                    let originalUrl = removeURLParameter(window.location.href, "code");
                    originalUrl = removeURLParameter(originalUrl, "session_state");
                    
                    // 檢查是否為本地URL
                    const isLocalUrl = (url) => {
                        try {
                            const parsed = new URL(url, window.location.origin);
                            return parsed.origin === window.location.origin || url.startsWith('/');
                        } catch(e) {
                            return false;
                        }
                    };

                    if(isLocalUrl(originalUrl)) {
                        window.location.href = originalUrl;
                    } else {
                        console.error("Detected potential malicious redirect attempt");
                        window.location.href = "/"; // 重定向到安全的首頁
                    }
                } catch(e) {
                    console.error("Error processing redirect URL:", e);
                    window.location.href = "/";
                }
            }
            if(OAuthConfig.tokenInRequest == true)
            {
                ConfigLog.QIDO.token.Authorization = "Bearer " + theToken;
                ConfigLog.WADO.token.Authorization = "Bearer " + theToken;
                ConfigLog.STOW.token.Authorization = "Bearer " + theToken;
                //readAllJson(readJson);
            }
            console.log(ConfigLog);
            return true;
        }
        // No token or token is not vaild, redirect to keycloak login page and put current url in the Callback URL parameter.
        else {
            setCookie("access_token","",7);
            let redirectUri = removeURLParameter(window.location.href, "code");
            redirectUri = removeURLParameter(redirectUri, "session_state");
            let loginPage = `${keycloakAPI}${OAuthConfig.endpoints.auth}?client_id=${OAuthConfig.client_id}&grant_type=authorization_code&response_type=code&redirect_uri=${redirectUri}`;
            window.location.href = loginPage;
            return false;
        }
    }
    else {
        return true;
    }
}

/**
 * Load a cookie.
 */
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    else {
        return "";
    }
}

/**
 * Set a cookie.
 */
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

/**
 * send token to the keycloak server to see if the token is vaild or not.
 */
function isTokenVaild(theToken) {
    return new Promise((resolve, reject) => {
        let tokenAuthAPI = `${keycloakAPI}${OAuthConfig.endpoints.validation}`;

        let request = new XMLHttpRequest();
        request.open('GET', tokenAuthAPI);
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        request.setRequestHeader("Authorization", "Bearer " + theToken);
        request.responseType = 'json';

        request.onerror = function (e) {
            console.log(e);
            resolve(false);
        };
        request.onload = function () {
            if (request.status == "200") {
                resolve(true);
            }
            else {
                resolve(false);
            }
        }

        request.send();
    });
}

/**
 * Use auth code to request a token from keycloak server.
 */
function requestToken(code, session_state) {
    return new Promise((resolve, reject) => {
        let tokenAPI = `${keycloakAPI}${OAuthConfig.endpoints.token}`;
        let redirectUri = removeURLParameter(window.location.href, "code");
        redirectUri = removeURLParameter(redirectUri, "session_state");
        let responseToken = "";
        let params = `grant_type=authorization_code&client_id=${OAuthConfig.client_id}&client_secret=${OAuthConfig.client_secret}&scope=${OAuthConfig.scope}&code=${code}&session_state=${session_state}&redirect_uri=${redirectUri}`;
        let request = new XMLHttpRequest();
        request.open('POST', tokenAPI);
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        request.responseType = 'json';
        request.send(params);
        request.onload = function () {
            let result = request.response;
            responseToken = result.access_token;
            setCookie("access_token",responseToken,7);
            resolve(responseToken);
        }
    });
}

/**
 * Load OAuth config file.
 */
function loadOAuthConfig(url) {
    return new Promise((resolve, reject) => {
        let config = {};
        let requestURL = url;
        let request = new XMLHttpRequest();
        request.open('GET', requestURL);
        request.responseType = 'json';
        request.send();
        request.onload = function () {
            config = request.response;
            return resolve(config);
        }
    });
}

/**
 * Remove a parameter from a url.
 */
function removeURLParameter(url, parameter) {
    //prefer to use l.search if you have a location/link object.
    let urlparts = url.split("?");
    if (urlparts.length >= 2) {
        let prefix = encodeURIComponent(parameter) + "=";
        let pars = urlparts[1].split(/[&;]/g);

        //reverse iteration as may be destructive.
        for (let i = pars.length; i-- > 0;) {
            //idiom for string.startsWith.
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                pars.splice(i, 1);
            }
        }

        return urlparts[0] + (pars.length > 0 ? "?" + pars.join("&") : "");
    }
    return url;
}