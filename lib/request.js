const XMLHttpRequest = require('sdk/net/xhr').XMLHttpRequest;

exports.send = function (request) {
    return new Promise(function (resolve, reject) {
        try {
            var xhr = new XMLHttpRequest({
                mozAnon: true,
                mozSystem: true
            });
            
            xhr.onerror = function () {
                reject('Could not connect to server.');
            };

            xhr.ontimeout = function () {
                reject('Requested timed out.');
            };

            xhr.onload = function () {
                var headers = {},
                    headersArray = xhr.getAllResponseHeaders().split('\n');

                for (let i = 0; i < headersArray.length; i++) {
                    if (headersArray[i].indexOf(':') > 0) {
                        let key = headersArray[i].substring(0, headersArray[i].indexOf(':')),
                            value = xhr.getResponseHeader(key);
                        if (key && value) {
                            headers[key] = value;
                        }
                    }
                }
                
                resolve({
                    status: xhr.status,
                    statusText: xhr.statusText,
                    headers: headers,
                    body: xhr.responseText
                });
            };

            xhr.open(request.method, request.url, true);
            xhr.timeout = 30000;

            // Remove default headers.
            xhr.setRequestHeader('Accept', '');
            xhr.setRequestHeader('Accept-Encoding', '');
            xhr.setRequestHeader('Accept-Language', '');
            xhr.setRequestHeader('User-Agent', '');

            for (let header in request.headers) {
                if (header && request.headers.hasOwnProperty(header)) {
                    xhr.setRequestHeader(header, request.headers[header]);
                }
            }

            xhr.send(request.body);
        } catch (e) {
            reject('Could not set up XHR: ' + e.message);
        }
    });
};