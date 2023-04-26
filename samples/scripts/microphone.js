// Wait for HTML to load, then run JavaScript
window.addEventListener('DOMContentLoaded', () => {
    // collect DOMs
    const display = document.querySelector('.display');
    const controllerWrapper = document.querySelector('.controllers');

    const State = ['Initial', 'Record', 'Finished'];
    let stateIndex = 0;
    let mediaRecorder, chunks = [], audioURL = '';

    // mediaRecorder setup for audio
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log('mediaDevices supported..');

        navigator.mediaDevices.getUserMedia({
            audio: true
        }).then(stream => {
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (e) => {
                chunks.push(e.data);
            }

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
                chunks = [];
                audioURL = window.URL.createObjectURL(blob);
                let audio = document.querySelector('audio');
                audio.src = audioURL;
                audio.style.height = "150px";
            }
        }).catch(error => {
            console.log('Following error has occured : ', error);
        })
    } else {
        stateIndex = '';
        application(stateIndex);
    }

    const clearDisplay = () => {
        display.textContent = '';
    }

    const clearControls = () => {
        controllerWrapper.textContent = '';
    }

    const record = () => {
        stateIndex = 1;
        mediaRecorder.start();
        application(stateIndex);
    }

    const stopRecording = () => {
        stateIndex = 2;
        mediaRecorder.stop();
        application(stateIndex);
    }

    const addButton = (id, funString, text) => {
        const btn = document.createElement('button');
        btn.id = id;
        btn.onclick = funString;
        btn.textContent = text;
        btn.className = "blue-footer-button";
        controllerWrapper.append(btn);
    }

    const addMessage = (text) => {
        const msg = document.createElement('p');
        msg.textContent = text;
        display.append(msg);
    }

    const addAudio = () => {
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = audioURL;
        display.append(audio);
    }

    const application = (index) => {
        switch (State[index]) {
            case 'Initial':
                clearDisplay();
                clearControls();

                addMessage('Press the start button to start recording');
                addButton('record', record, 'Start Recording');
                break;

            case 'Record':
                clearDisplay();
                clearControls();

                addMessage('Recording...');
                addButton('stop', stopRecording, 'Stop Recording');
                break;

            case 'Finished':
                clearControls();
                clearDisplay();

                addAudio();
                addButton('record', record, 'Record Again');
                break;

            default:
                clearControls();
                clearDisplay();

                addMessage('Your browser does not support mediaDevices');
                break;
        }

    }

    application(stateIndex);
});