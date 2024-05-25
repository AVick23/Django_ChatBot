// Обработчик события нажатия на кнопку меню
menuButton.addEventListener('click', function(event) {
    event.preventDefault();
    
    // Удаляем все сообщения с классом 'removable'
    var removableMessages = document.getElementsByClassName('removable');
    while(removableMessages[0]) {
        removableMessages[0].parentNode.removeChild(removableMessages[0]);
    }

    const botMessage = createMessageElement('bot', 'Вы открыли меню с дополнительным функционалом:');
    botMessage.classList.add('removable');
    chatbox.appendChild(botMessage);
    botMessage.scrollIntoView();
    
    // Добавляем кнопки меню
    const all_buttons = [{
        "id": "button1",
        "text": "🗂Нерешенные вопросы студентов для приёмной комиссии",
        "class": "custom-button",
        "title": "Нажмите на эту кнопку, если вы хотите выбрать параметры и подобрать образователькую программу для себя."
    },
    {
        "id": "button2",
        "text": "🗃️Конвертировать в PDF",
        "class": "custom-button",
        "title": "Нажмите на эту кнопку, если хотите узнать расположение корпусов ДГТУ в Ростове-на-Дону."
    }
];
for (let button of all_buttons) {
    const buttonElement = document.createElement('button');
    buttonElement.id = button.id;
    buttonElement.className = button.class;
    buttonElement.textContent = button.text;
    botMessage.appendChild(buttonElement);

    if (button.title) {
        const infoIcon = document.createElement('i');
        infoIcon.className = 'info-icon';
        infoIcon.textContent = 'i';

        const modal = document.createElement('div');
        modal.className = 'my-custom-modal'; // Измененный класс для модального окна
        const modalContent = document.createElement('div');
        modalContent.className = 'my-text-container'; // Измененный класс для контейнера текста
        modalContent.textContent = button.title;
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        infoIcon.addEventListener('click', function() {
            modal.style.display = 'block';
        });

        window.addEventListener('click', function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });

        botMessage.appendChild(infoIcon);
    }

    botMessage.appendChild(document.createElement('br'));
}

    
    // Добавляем обработчик событий для button1
    document.getElementById('button1').addEventListener('click', async function(event) {
        event.preventDefault();
        await loadUnresolvedQuestions();
    });
    
    async function loadUnresolvedQuestions() {
        try {
            const response = await fetch('/get_unresolved_questions/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            const data = await response.json();
            displayQuestions(data);
        } catch (error) {
            console.error('Ошибка при загрузке нерешенных вопросов:', error);
        }
    }
    
    function displayQuestions(questions) {
        const botMessage = createMessageElement('bot', 'Выберите нерешенный вопрос:');
        const keyboard = document.createElement('div');
        keyboard.classList.add('keyboard');
    
        questions.forEach(question => {
            const questionButton = document.createElement('button');
            questionButton.textContent = question.question_text;
            questionButton.setAttribute('class', 'custom-button');
            questionButton.addEventListener('click', function() {
                promptAnswer(question.id);
            });
            keyboard.appendChild(questionButton);
        });
    
        botMessage.appendChild(keyboard);
        chatbox.appendChild(botMessage);
        botMessage.scrollIntoView();
    }
    
    function promptAnswer(questionId) {
        const botMessage = createMessageElement('bot', 'Введите ответ на вопрос:');
        const inputElement = document.createElement('input');
        inputElement.setAttribute('id', 'answerInput');
        inputElement.setAttribute('class', 'messageInputTap');
        inputElement.setAttribute('placeholder', 'Введите сюда свой ответ');
    
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Отправить';
        submitButton.setAttribute('class', 'custom-button');
        submitButton.addEventListener('click', function() {
            const answerText = inputElement.value;
            sendAnswer(questionId, answerText);
        });
    
        botMessage.appendChild(inputElement);
        botMessage.appendChild(submitButton);
        chatbox.appendChild(botMessage);
        botMessage.scrollIntoView();
    }
    
    async function sendAnswer(questionId, answerText) {
        try {
            const response = await fetch('/save_answer/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                },
                body: JSON.stringify({ question_id: questionId, answer: answerText }),
            });
    
            const data = await response.json();
            const botMessage = createMessageElement('bot', data.message);
            chatbox.appendChild(botMessage);
            botMessage.scrollIntoView();
        } catch (error) {
            console.error('Ошибка при сохранении ответа:', error);
        }
    }
    document.getElementById('button2').addEventListener('click', function(event) {
        event.preventDefault();
    
        // Создаем сообщение с инструкцией
        var instructionMessage = createMessageElement('bot', 'Пришли мне любые документы Word, Excel или PowerPoint, и я переведу их в PDF. Желательно не более 10 файлов за раз.');
        // var instructionSignature = createSignatureDiv('Чат-Бот'); // Убираем создание подписи
        // chatbox.appendChild(instructionSignature); // Убираем добавление подписи
        chatbox.appendChild(instructionMessage);
        instructionMessage.scrollIntoView();
    
        // Создаем элемент загрузки файлов
        var fileInput = document.createElement('input');
        fileInput.setAttribute('type', 'file');
        fileInput.setAttribute('accept', '.doc,.docx,.xls,.xlsx,.ppt,.pptx');
        fileInput.setAttribute('id', 'fileInput');
        fileInput.setAttribute('multiple', 'multiple'); // Позволяем выбирать несколько файлов
        fileInput.style.display = 'none'; // Скрываем элемент
    
        // Добавляем элемент загрузки файла в чат
        chatbox.appendChild(fileInput);
    
        // Автоматически открываем диалог выбора файла
        fileInput.click();
    
        // Обработчик выбора файла
        fileInput.addEventListener('change', function(event) {
            var files = event.target.files;
            if (files.length > 10) {
                var warningMessage = createMessageElement('bot', 'Я конвертирую только первые 10 документов, остальные документы вы можете загрузить потом, но так же не более 10.');
                // chatbox.appendChild(createSignatureDiv('Чат-Бот')); // Убираем добавление подписи
                chatbox.appendChild(warningMessage);
                warningMessage.scrollIntoView();
    
                // Ограничиваем файлы первыми 10
                files = Array.from(files).slice(0, 10);
            }
    
            if (files.length > 0) {
                // Создаем контейнеры для прогресса загрузки и конвертации
                var uploadProgressLabel = createMessageElement('bot', 'Прогресс загрузки файлов:');
                var uploadProgressContainer = document.createElement('div');
                uploadProgressContainer.classList.add('progress-container');
                var uploadProgressBar = document.createElement('div');
                uploadProgressBar.classList.add('progress-bar');
                uploadProgressContainer.appendChild(uploadProgressBar);
    
                var conversionProgressLabel = createMessageElement('bot', 'Прогресс конвертации файлов:');
                var conversionProgressContainer = document.createElement('div');
                conversionProgressContainer.classList.add('progress-container');
                var conversionProgressBar = document.createElement('div');
                conversionProgressBar.classList.add('progress-bar');
                conversionProgressContainer.appendChild(conversionProgressBar);
    
                // Создаем сообщение "Файлы качаются"
                var downloadingMessage = createMessageElement('bot', 'Файлы качаются и обрабатываются...');
                // var downloadingSignature = createSignatureDiv('Чат-Бот'); // Убираем создание подписи
    
                // Добавляем элементы прогресса в чат
                chatbox.appendChild(uploadProgressLabel);
                chatbox.appendChild(uploadProgressContainer);
                chatbox.appendChild(conversionProgressLabel);
                chatbox.appendChild(conversionProgressContainer);
                // chatbox.appendChild(downloadingSignature); // Убираем добавление подписи
                chatbox.appendChild(downloadingMessage);
                downloadingMessage.scrollIntoView();
    
                // Создаем FormData и добавляем файлы текущей партии
                var formData = new FormData();
                Array.from(files).forEach(file => {
                    formData.append('files', file);
                });
    
                // Отправляем файлы на сервер с визуализацией прогресса
                var xhr = new XMLHttpRequest();
                xhr.open('POST', '/upload_file/', true);
                xhr.setRequestHeader('X-CSRFToken', document.querySelector('[name=csrfmiddlewaretoken]').value);
    
                xhr.upload.onprogress = function(event) {
                    if (event.lengthComputable) {
                        var percentComplete = (event.loaded / event.total) * 100;
                        uploadProgressBar.style.width = percentComplete + '%';
                        uploadProgressBar.textContent = Math.round(percentComplete) + '%';
                    }
                };
    
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        var blob = new Blob([xhr.response], { type: 'application/zip' });
                        var blobURL = URL.createObjectURL(blob);
    
                        // Удаляем сообщения о процессе
                        chatbox.removeChild(uploadProgressLabel);
                        chatbox.removeChild(uploadProgressContainer);
                        chatbox.removeChild(conversionProgressLabel);
                        chatbox.removeChild(conversionProgressContainer);
                        chatbox.removeChild(downloadingMessage);
                        // chatbox.removeChild(downloadingSignature); // Убираем удаление подписи
                        // chatbox.removeChild(instructionSignature); // Убираем удаление подписи
                        chatbox.removeChild(instructionMessage);
    
                        // Создаем ссылку для скачивания ZIP-файла
                        var downloadLink = document.createElement('a');
                        downloadLink.href = blobURL;
                        downloadLink.download = 'converted_files.zip'; // Устанавливаем имя файла по умолчанию
                        downloadLink.textContent = 'Скачать все PDF-файлы';
                        downloadLink.classList.add('custom-button'); // Добавляем класс .custom-button для стилизации
    
                        var confirmationMessage = createMessageElement('bot', 'Ваши документы были успешно загружены и преобразованы в PDF.');
                        confirmationMessage.appendChild(downloadLink);
                        // chatbox.appendChild(createSignatureDiv('Чат-Бот')); // Убираем добавление подписи
                        chatbox.appendChild(confirmationMessage);
                        confirmationMessage.scrollIntoView();
                    } else {
                        var errorMessage = createMessageElement('bot', 'Произошла ошибка при загрузке документов. Пожалуйста, попробуйте еще раз.');
                        // chatbox.appendChild(createSignatureDiv('Чат-Бот')); // Убираем добавление подписи
                        chatbox.appendChild(errorMessage);
                        errorMessage.scrollIntoView();
                    }
                    uploadProgressContainer.style.display = 'none'; // Скрываем прогресс-бар
                    conversionProgressContainer.style.display = 'none'; // Скрываем прогресс-бар конвертации
                };
    
                xhr.onerror = function() {
                    var errorMessage = createMessageElement('bot', 'Произошла ошибка при загрузке документов. Пожалуйста, попробуйте еще раз.');
                    // chatbox.appendChild(createSignatureDiv('Чат-Бот')); // Убираем добавление подписи
                    chatbox.appendChild(errorMessage);
                    errorMessage.scrollIntoView();
                    uploadProgressContainer.style.display = 'none'; // Скрываем прогресс-бар
                    conversionProgressContainer.style.display = 'none'; // Скрываем прогресс-бар конвертации
                };
    
                xhr.responseType = 'blob';
                xhr.send(formData);
    
                // Устанавливаем соединение SSE для обновления прогресса конвертации
                var eventSource = new EventSource('/progress/');
                eventSource.onmessage = function(event) {
                    var data = event.data;
                    if (data === 'heartbeat') {
                        return; // Игнорируем сообщения heartbeat
                    }
                    var [current, total] = data.split('/').map(Number);
                    var percentComplete = (current / total) * 100;
                    conversionProgressBar.style.width = percentComplete + '%';
                    conversionProgressBar.textContent = Math.round(percentComplete) + '%';
                };
    
                eventSource.onerror = function() {
                    eventSource.close();
                };
            }
        });
    });    
});