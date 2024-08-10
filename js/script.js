const encryptedURL = 'U2FsdGVkX1839ecE7PweKy5wFHwwdsRU+oyOEAff8ZP3f8pn4YNo6ZuHbI75kZ/B7lb441B3VBqE9BeRz3AGvMrKhAaeGOgY2Nb9GrGt9svUAa66TB5uiNUbK9LX7qkNaoY+TOQR4CG2KtkPAAdaCQ=='
function decryptURL(str, key){
    return CryptoJS.AES.decrypt(str, key).toString(CryptoJS.enc.Utf8);
}
var url = 'What is the URL?'
const keyWordInput = document.getElementById('key-word-input')
const keyWordButton = document.getElementById('key-word-button')
const alert_text = document.getElementById('alert-text')
keyWordButton.addEventListener('click', function(){
    let keyWord = keyWordInput.value
    let decryptedURL = decryptURL(encryptedURL, keyWord)
    if (decryptedURL === ''){
        alert_text.textContent = '輸入錯誤'
        sleep(2000).then(() => {
            alert_text.textContent = ''
        })
    }else{
        url = decryptedURL;
        keyWordInput.value = '';
        playerInit();
    }
})
keyWordInput.addEventListener('keypress', function(event){
    if (event.key === 'Enter'){
        event.preventDefault();
        keyWordButton.click();
    }
})

const player = document.querySelector('audio')
const file_name_text = document.getElementsByClassName('file-name-text')[0]

// load json list
fetch('fileNameList.json')
.then(response => response.json())
.then(data => FILE_NAME_LIST = data);

const prevButton = document.getElementById('prev-page-button');
const playButton = document.getElementById('play-button');
const nextButton = document.getElementById('next-page-button');
const stopButton = document.getElementById('reset-button');
const muteButton = document.getElementById('mute-button');
const fileSelectInput = document.getElementById('file-selector-input');
const fileSelectButton = document.getElementById('file-selector-button');
const volumeSlider = document.getElementById('volume-slider');
const speedSlider = document.getElementById('speed-slider');
const back5sButton = document.getElementById('back-5s-button');
const forward5sButton = document.getElementById('forward-5s-button');
const nextUnitButton = document.getElementById('next-unit-button');
const prevUnitButton = document.getElementById('prev-unit-button');
const autoPlayCheckbox = document.getElementById('auto-play-checkbox');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function format_filename(playingFile){
    let unit = playingFile['unit'].toString().padStart(2, '0')
    let first = playingFile['first'].toString().padStart(2, '0')
    let last = playingFile['last'].toString().padStart(2, '0')
    let output = unit + first + '-' + unit + last
    if (playingFile['new']){
        output += 'new'
    }
    return output
}

function reverse_format_filename(playingName){
    let unit = playingName.substring(0, 2)
    let first = playingName.substring(2, 4)
    let last = playingName.substring(7, 9)
    let newFlag = playingName.includes('new')
    return {
        'unit': parseInt(unit),
        'first': parseInt(first),
        'last': parseInt(last),
        'new': newFlag
    }
}

function getCurrentPlayingFileIndex(){
    return FILE_NAME_LIST.indexOf(nowPlayingName)
}

function setPlayingFile(playingName){
    player.src = url + playingName + '.mp3';
}

function setPlayingFileNameText(playingName){
    file_name_text.textContent = playingName;
}

function playNext(){
    player.pause();
    player.currentTime = 0;
    nowPlayingName = FILE_NAME_LIST[getCurrentPlayingFileIndex() + 1]
    setPlayingFile(nowPlayingName)
    setPlayingFileNameText(nowPlayingName)
}

function playPrev(){
    player.pause();
    player.currentTime = 0;
    nowPlayingName = FILE_NAME_LIST[getCurrentPlayingFileIndex() - 1]
    setPlayingFile(nowPlayingName)
    setPlayingFileNameText(nowPlayingName)
}
function playerInit(){
    nowPlayingName = '0101-0103'
    setPlayingFile(nowPlayingName)
    setPlayingFileNameText(nowPlayingName)
}

player.volume = 0.5;

playButton.addEventListener('click', () => {
    if (player.paused) {
        player.play();
        playButton.textContent = '暫停';
    }else{
        player.pause();
        playButton.textContent = '播放';
    }
});

stopButton.addEventListener('click', () => {
    player.pause();
    player.currentTime = 0;
    playButton.textContent = '播放';
});

muteButton.addEventListener('click', () => {
    if(player.muted){
        player.muted = false;
        muteButton.textContent = '靜音';
    }else{
        player.muted = true;
        muteButton.textContent = '播音';
    }
});

nextButton.addEventListener('click', () => {
    playNext();
});

prevButton.addEventListener('click', () => {
    playPrev();
});

function playInputFile(){
    player.pause();
    playButton.textContent = '播放';
    player.currentTime = 0;
    if (FILE_NAME_LIST.includes(fileSelectInput.value)){
        nowPlayingName = fileSelectInput.value
    }else{
        alert_text.textContent = 'File Not Found'
        sleep(2000).then(() => {
            alert_text.textContent = ''
        })
        return
    }
    setPlayingFile(nowPlayingName)
    setPlayingFileNameText(nowPlayingName)
}

fileSelectButton.addEventListener('click', playInputFile);
fileSelectInput.addEventListener('keypress', function (event){
    if (event.key === 'Enter'){
        event.preventDefault();
        playInputFile();
    }
})

volumeSlider.addEventListener('input', function(){
    player.volume = volumeSlider.value / 100;
});

speedSlider.addEventListener('input', function(){
    player.playbackRate = speedSlider.value / 50;
});

back5sButton.addEventListener('click', function(){
    player.currentTime -= 5;
});

forward5sButton.addEventListener('click', function(){
    player.currentTime += 5;
});

nextUnitButton.addEventListener('click', function(){
    let nextUnit = (parseInt(nowPlayingName.substring(1, 2)) + 1).toString().padStart(2, '0')
    for (let i = getCurrentPlayingFileIndex() + 1; i < FILE_NAME_LIST.length; i++){
        if (FILE_NAME_LIST[i].substring(0, 2) === nextUnit){
            nowPlayingName = FILE_NAME_LIST[i]
            setPlayingFile(nowPlayingName)
            setPlayingFileNameText(nowPlayingName)
            return
        }
    }
    alert_text.textContent = 'No Next Unit'
});

prevUnitButton.addEventListener('click', function(){
    let prevUnit = (parseInt(nowPlayingName.substring(1, 2)) - 2).toString().padStart(2, '0')
    for (let i = getCurrentPlayingFileIndex() - 1; i >= 0; i--){
        if (FILE_NAME_LIST[i].substring(0, 2) === prevUnit){
            nowPlayingName = FILE_NAME_LIST[i + 1]
            setPlayingFile(nowPlayingName)
            setPlayingFileNameText(nowPlayingName)
            return
        }
    }
    nowPlayingName = FILE_NAME_LIST[0]
    setPlayingFile(nowPlayingName)
    setPlayingFileNameText(nowPlayingName)
});

autoPlayCheckbox.addEventListener('change', function(){
    if (autoPlayCheckbox.checked){
        player.onended = function(){
            playNext();
        }
        player.autoplay = true;
    }else{
        player.onended = function(){
            player.pause();
            player.currentTime = 0;
            playButton.textContent = '播放';
        }
        player.autoplay = false;
    }
});