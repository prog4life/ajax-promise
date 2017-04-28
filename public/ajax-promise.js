
let foodCheck = (function() {
    'use strict';

    // let counter = 0;
    let foodInput = document.getElementById('food');
    let answer= document.querySelector('#answer');
    let foodForm = document.forms[0];
    let xhrQueue = [];
    // let prevXHR;
    // let sequence = Promise.resolve();
    let lock = false;
    let interval = 100;
    let timeoutID;

    foodInput.addEventListener('input', processAjax);
    foodForm.addEventListener('keypress', (event) => event.keyCode != 13);
    foodInput.value = '';

    function processAjax() {
        let reqID = Date.now().toString().substr(-4);
        // console.log(`processAjax() was called for the ${++counter} time`);
        // console.log(`request gets next id: ${+reqID}`);

        // let url = 'https://main-dev2get.c9users.io/store?food=';
        let url = 'http://localhost:3000/store?food=';

        coolDown(interval)
            .then(() => url += foodInput.value)
            .then(() => xhrGet(url, reqID))
            .then(response => {
                // console.log('response xhr id: ', response.id);
                return parseJSON(response.json);
            })
            .then(showAnswer)
            .catch(error => {
                if (error.reqID) {
                    // console.log('response ' + error.reqID + ' aborted');
                }
                console.error(error);
            });

        // let inputValue = foodInput.value;
        // let url = `https://main-dev2get.c9users.io/store?food=${inputValue}`;
        // let url = `http://localhost:3000/store?food=${inputValue}`;

        // sequence = sequence
        //     .then(() => xhrGet(url, reqID))

        // fetch(url, { method: 'GET' })
        //     .then(response => { return parseJSON(response); })
        //     .then(responseObj => { showAnswer(responseObj); })
        //     .catch(error => {
        //         console.error(error);
        //     });
    }

    function coolDown(interval) {
        return new Promise((resolve) => {
            if (lock) {
                clearTimeout(timeoutID);
            }
            timeoutID = setTimeout(() => {
                lock = false;
                resolve();
            }, interval);

            lock = true;
        });
    }

    function parseJSON(json) {
        try {
            return JSON.parse(json);
        } catch (e) {
            console.error(`JSON parsing error: ${e}`);
        }
    }

    function showAnswer(responseObj) {
        answer.innerHTML = responseObj.answer || 'Nothing to show';
    }

    function xhrGet(url, reqID) {
// TODO: maybe it's enough to abort only prev xhr
        if (xhrQueue.length !== 0) {
            xhrQueue.forEach((xhr) => xhr.abort());
            xhrQueue.length = 0;
        }

        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();

            xhr.open('GET', url, true);

            // xhr.setRequestHeader('dataType', 'json');
            // xhr.setRequestHeader('xhr-id', reqID);

            xhr.onload = function() {

                if (this.status == 200) {
                    // resolve(this.response);
                    resolve({
                        json: this.response,
                        id: reqID
                    });

                } else {
                    // server was reached, but it returned an error
                    let error = new Error(this.statusText);
                    error.code = this.status;
                    reject(error);
                }
            };

            xhr.onabort = function() {
                let error = new Error('xhr aborted');
                error.reqID = reqID;
                reject(error);
            };

            xhr.onerror = function() {
                reject(new Error('Some xhr connection error'));
            };

            xhrQueue.push(xhr);
            xhr.send();
        });
    }

    return {
        // whatever
    };

}());
