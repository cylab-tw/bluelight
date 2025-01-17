
(async function () {
    let config = await loadConfig("../data/configAsusSso.json");

    if (config.enabled) {
        let loginUrl = config.loginUrl;
        let redirectUrl = config.redirectUrl;
        const raccoonLoginUrl = `${loginUrl}?redirectUrl=${encodeURIComponent(redirectUrl)}`;

        let token = localStorage.getItem("asusWebStorageToken");
        if (!token) {
            localStorage.setItem("bluelightUrl", window.location.href);
            window.location.href = raccoonLoginUrl;
        }

        if (config.tokenInRequest) {
            XMLHttpRequest.prototype.origOpen = XMLHttpRequest.prototype.open;

            XMLHttpRequest.prototype.open = function () {
                this.origOpen.apply(this, arguments);
                let decodedToken = JSON.parse(atob(token.split(".")[1]));
                let expiresAt = decodedToken.exp;
                let currentTime = Math.floor(Date.now() / 1000);

                if (expiresAt < currentTime) {
                    localStorage.setItem("bluelightUrl", window.location.href);
                    window.location.href = raccoonLoginUrl;
                }
                this.setRequestHeader('Authorization', "Bearer " + token);
            };
            loadLdcmview();
        }
    }

    async function loadConfig(url) {
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
})();


