// Функция инициализации распознавания речи
function initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
        var recognition = new webkitSpeechRecognition();
        recognition.lang = "ru-RU";
        recognition.onresult = handleRecognitionResult;
        recognition.onerror = handleRecognitionError;
        recognition.onstart = handleRecognitionStart;
        recognition.onend = handleRecognitionEnd;
        return recognition;
    } else {
        console.error('Браузер не поддерживает распознавание речи.');
        return null;
    }
}

// Функция для обработки результатов распознавания
function handleRecognitionResult(event) {
    var transcript = event.results[0][0].transcript;
    var messageInput = document.querySelector('#messageInput');
    messageInput.value = transcript;
    recognition.stop();

    // Создаем событие клавиатурного нажатия клавиши Enter
    var enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        keyCode: 13,
        bubbles: true,
        cancelable: true
    });

    // Диспатчим событие на поле ввода сообщения
    messageInput.dispatchEvent(enterEvent);
}

// Функции для обработки других событий распознавания
function handleRecognitionError(event) {
console.error('Ошибка распознавания речи: ', event.error);
}

function handleRecognitionStart() {
document.querySelector('#mic').classList.add('active');
}

function handleRecognitionEnd() {
document.querySelector('#mic').classList.remove('active');
}

// Инициализация распознавания речи
var recognition = initializeSpeechRecognition();

// Получаем ссылку на кнопку микрофона
var micButton = document.querySelector('#mic');

// Обработчик нажатия на кнопку микрофона
micButton.addEventListener('click', function() {
    if (recognition && recognition.state === 'running') {
        // Если распознавание речи уже запущено, останавливаем его
        recognition.stop();
    } else {
        // Если распознавание речи не запущено, запускаем его
        recognition.start();
    }
});