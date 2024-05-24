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
        "text": "📘Подобрать образовательную программу",
        "class": "custom-button",
        "title": "Нажмите на эту кнопку, если вы хотите выбрать параметры и подобрать образователькую программу для себя."
    },
    {
        "id": "button2",
        "text": "📕Информация об образовательной программе",
        "class": "custom-button",
        "title": "Нажмите на эту кнопку, если вы хотите узнать информацию по образовательной программе, название которой вы точно знаете."
    },
    {
        "id": "button3",
        "text": "❓Вопрос приёмной комиссии",
        "class": "custom-button",
        "title": "Нажмите на эту кнопку, если хотите задать вопрос приёмной комисси, мы постараемся ответить как можно скоре, а может у нас найдёт уже ответ на ваш вопрос."
    },
    {
        "id": "button4",
        "text": "🪄Расположение корпусов",
        "class": "custom-button",
        "title": "Нажмите на эту кнопку, если хотите узнать расположение корпусов ДГТУ в Ростове-на-Дону."
    },
    {
        "id": "button5",
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
    document.getElementById('button1').addEventListener('click', function(event) {
        event.preventDefault();
        var educationMessage = createMessageElement('bot', 'Выберите область образования:');
        educationMessage.appendChild(document.createElement('br'));
        botMessage.classList.add('removable');
        var all_areas = [
            "Математические и естественные науки", "Инженерное дело, технологии и технические науки", "Здравоохранение и медицинские науки",
            "Сельское хозяйство и сельскохозяйственные науки", "Науки об обществе", "Образования и педагогические науки",
            "Гуманитарные науки", "Исскуства и культура"
        ];
        for (var i = 0; i < all_areas.length; i++) {
            var areaButton = document.createElement('button');
            areaButton.className = 'custom-button education-button';
            areaButton.textContent = all_areas[i];
            educationMessage.appendChild(areaButton);
            educationMessage.appendChild(document.createElement('br')); // Добавляем перенос строки после каждой кнопки
        }
        educationMessage.classList.add('removable');
        chatbox.appendChild(educationMessage);
        educationMessage.scrollIntoView();
        
        var educationButtons = document.getElementsByClassName('education-button');
        for (var i = 0; i < educationButtons.length; i++) {
            educationButtons[i].addEventListener('click', function(event) {
                event.preventDefault();
                var area = event.target.innerText; // Получаем выбранную область образования
                var subjectMessage = createMessageElement('bot', 'Вы выбрали область образования: ' + area + '. Теперь выберите предмет:');
                educationMessage.classList.add('removable');
                var all_subjects = [
                    "Биология", "География", "Иностранный язык", "Информатика", "История", "Клаузура", "Литература", "Математика",
                    "Музыкальное искусство эстрады", "Обществознание", "Основы медиа", "Рисунок", "Русский язык", "Собеседование",
                    "Специальная графика", "Специальный предмет", "Физика", "Физическая подготовка", "Химия", "Художественное творчество"
                ];
                var table = document.createElement('table');
                for (var j = 0; j < all_subjects.length; j += 2) {
                    var row = document.createElement('tr');
                    var cell1 = document.createElement('td');
                    var cell2 = document.createElement('td');
                    cell1.innerHTML = '<button class="custom-button" data-selected="false">' + all_subjects[j] + '</button>';
                    if (j + 1 < all_subjects.length) {
                        cell2.innerHTML = '<button class="custom-button" data-selected="false">' + all_subjects[j + 1] + '</button>';
                    }
                    row.appendChild(cell1);
                    row.appendChild(cell2);
                    table.appendChild(row);
                }
                subjectMessage.appendChild(table);
                subjectMessage.classList.add('removable');
                chatbox.appendChild(subjectMessage);
                subjectMessage.scrollIntoView();
                
                // Добавляем обработчик событий для каждой кнопки
                var buttons = document.getElementsByClassName('custom-button');
                for (var i = 0; i < buttons.length; i++) {
                    buttons[i].addEventListener('click', function(event) {
                        var button = event.target;
                        var isSelected = button.getAttribute('data-selected') === 'true';
                        button.setAttribute('data-selected', !isSelected);
                        button.style.backgroundColor = isSelected ? '#0B93F6' : '#777'; // меняем цвет фона кнопки
                    });
                }
                
                // Добавляем кнопку подтверждения
                var confirmButton = document.createElement('button');
                confirmButton.className = 'custom-button confirm-button';
                confirmButton.textContent = 'Подтвердить выбор';
                subjectMessage.appendChild(confirmButton);

                            // Добавляем обработчик событий для кнопки подтверждения
                confirmButton.addEventListener('click', function(event) {
                    event.preventDefault();
                    var selectedSubjects = []; // массив для выбранных предметов
                    var buttons = document.getElementsByClassName('custom-button');
                    for (var i = 0; i < buttons.length; i++) {
                        if (buttons[i].getAttribute('data-selected') === 'true') {
                            selectedSubjects.push(buttons[i].textContent);
                        }
                    }
                
                    // Создаем сообщение с выбранными предметами
                    var formMessage = createMessageElement('bot', 'Вы выбрали предметы: ' + selectedSubjects.join(', ') + '. Теперь выберите форму обучения:');
                    formMessage.innerHTML += '<br>';
                    botMessage.classList.add('removable');
                
                    var all_forms = ["Очная форма", "Заочная форма", "Очно-заочная форма"];
                    for (var j = 0; j < all_forms.length; j++) {
                        formMessage.innerHTML += '<button class="custom-button form-button">' + all_forms[j] + '</button><br>'; // Добавляем перенос строки после каждой кнопки
                    }
                    
                    formMessage.classList.add('removable');
                    chatbox.appendChild(formMessage);
                    formMessage.scrollIntoView();
                
                    var formButtons = document.getElementsByClassName('form-button');
                    for (var i = 0; i < formButtons.length; i++) {
                        formButtons[i].addEventListener('click', function(event) {
                            event.preventDefault();
                            var form = event.target.innerText; // Получаем выбранную форму обучения
                            var paymentMessage = createMessageElement('bot', 'Вы выбрали форму обучения: ' + form + '. Теперь выберите форму оплаты:');
                            botMessage.classList.add('removable');
                            paymentMessage.innerHTML += '<br>';
                            var all_payment_options = ["Бюджет", "Коммерция"];
                            for (var j = 0; j < all_payment_options.length; j++) {
                                paymentMessage.innerHTML += '<button class="custom-button payment-button">' + all_payment_options[j] + '</button><br>'; // Добавляем перенос строки после каждой кнопки
                            }
                            paymentMessage.classList.add('removable');
                            chatbox.appendChild(paymentMessage);
                            paymentMessage.scrollIntoView();
                            
                            var paymentButtons = document.getElementsByClassName('payment-button');
                            for (var i = 0; i < paymentButtons.length; i++) {
                                paymentButtons[i].addEventListener('click', function(event) {
                                    event.preventDefault();
                                    var payment = event.target.innerText; // Получаем выбранную форму оплаты
                                    var searchMessage = createMessageElement('bot', 'Вы выбрали форму оплаты: ' + payment + '. Теперь выберите тип поиска:');
                                    botMessage.classList.add('removable');
                                    searchMessage.innerHTML += '<br>';
                                    var all_search_types = [
                                        { 
                                            text: "Строгий", 
                                            description: "Выберите этот тип поиска, если вам нужны строгие критерии поиска." 
                                        },
                                        { 
                                            text: "Гибкий", 
                                            description: "Выберите этот тип поиска, если вы предпочитаете гибкие критерии поиска." 
                                        }
                                    ];
                                    
                                    // Добавляем кнопки типов поиска
                                    // Добавляем кнопки типов поиска
                                    for (var j = 0; j < all_search_types.length; j++) {
                                        const searchContainer = document.createElement('div'); // Создаем контейнер
                                        searchContainer.className = 'search-container';
                                    
                                        const searchButton = document.createElement('button');
                                        searchButton.className = 'custom-button search-button';
                                        searchButton.textContent = all_search_types[j].text;
                                    
                                        // Добавляем кнопку типа поиска в контейнер
                                        searchContainer.appendChild(searchButton);
                                    
                                        // Создаем и добавляем иконку "i" и модальное окно
                                        if (all_search_types[j].description) {
                                            const infoIcon = document.createElement('i');
                                            infoIcon.className = 'info-icon';
                                            infoIcon.textContent = 'i';
                                    
                                            const modal = document.createElement('div');
                                            modal.className = 'my-custom-modal';
                                            const modalContent = document.createElement('div');
                                            modalContent.className = 'my-text-container';
                                            modalContent.textContent = all_search_types[j].description;
                                            modal.appendChild(modalContent);
                                            document.body.appendChild(modal);
                                    
                                            // Показываем модальное окно по клику на иконку "i"
                                            infoIcon.addEventListener('click', function() {
                                                modal.style.display = 'block';
                                            });
                                    
                                            // Закрываем модальное окно при клике вне него
                                            window.addEventListener('click', function(event) {
                                                if (event.target == modal) {
                                                    modal.style.display = 'none';
                                                }
                                            });
                                    
                                            // Добавляем иконку в контейнер
                                            searchContainer.appendChild(infoIcon);
                                        }
                                    
                                        searchMessage.appendChild(searchContainer); // Добавляем контейнер в сообщение
                                    }
                                    
                                    // Добавляем подпись и сообщение типов поиска к чату
                                    searchMessage.classList.add('removable');
                                    chatbox.appendChild(searchMessage);
                                    searchMessage.scrollIntoView();                                    

                                    var searchButtons = document.getElementsByClassName('search-button');
                                    for (var i = 0; i < searchButtons.length; i++) {
                                        searchButtons[i].addEventListener('click', function(event) {
                                            event.preventDefault();
                                            var searchType = event.target.innerText; // Получаем выбранный тип поиска

                                            // Отправляем запрос на сервер с выбранными параметрами
                                            fetch('/get_programs/', {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                                                },
                                                body: JSON.stringify({
                                                    area: area,
                                                    subjects: selectedSubjects,
                                                    form: form,
                                                    payment: payment,
                                                    search_type: searchType
                                                }),
                                            })
                                            .then(response => response.json())
                                            .then(data => {
                                                // Создаем сообщение с подходящими направлениями
                                                var directionsMessage = createMessageElement('bot', 'Подходящие направления:');
                                                directionsMessage.innerHTML += '<br>';

                                                // Добавляем кнопки с подходящими направлениями
                                                for (var j = 0; j < data.length; j++) {
                                                    var directionButton = document.createElement('button');
                                                    directionButton.className = 'custom-button direction-button';
                                                    directionButton.textContent = data[j];
                                                    directionButton.addEventListener('click', function(event) {
                                                        event.preventDefault();
                                                        var direction = event.target.innerText; // Получаем выбранное направление
                                            
                                                        // Отправляем запрос на сервер с выбранным направлением
                                                        fetch('/get_direction_info/', {
                                                            method: 'POST',
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                                                            },
                                                            body: JSON.stringify({
                                                                direction: direction
                                                            }),
                                                        })
                                                        .then(response => response.json())
                                                        .then(data => {
                                                            // Преобразуем объект data в строку
                                                            var dataString = JSON.stringify(data, null, 2);  // второй аргумент null и третий аргумент 2 делают вывод более читаемым

                                                            dataString = dataString.replace(/\\n/g, '<br>');

                                                            // Регулярное выражение для поиска URL
                                                            var urlRegex = /(https?:\/\/[^\s]+)/g;

                                                            // Находим все ссылки в строке JSON
                                                            var urls = dataString.match(urlRegex);

                                                            // Создаем новую строку для ссылок
                                                            var linkString = '';

                                                            // Проходим по всем найденным ссылкам
                                                            for (var i = 0; i < urls.length; i++) {
                                                                // Удаляем все <br> из найденной ссылки
                                                                var url = urls[i].replace(/<br>/g, '');
                                                                
                                                                // Добавляем HTML-ссылку в строку ссылок
                                                                linkString += `<br><a href="${url}" target="_blank" rel="noopener noreferrer" title="Это ссылка на ${url}">Перейти по ссылке</a><br>`;
                                                            }

                                                            // Добавляем строку ссылок в конец исходного текста
                                                            dataString += linkString;

                                                            // Создаем сообщение со всей информацией
                                                            var directionInfoMessage = createMessageElement('bot', dataString);
                                                            chatbox.appendChild(directionInfoMessage);
                                                            directionInfoMessage.innerHTML = dataString;
                                                        });
                                                    });
                                                    directionsMessage.appendChild(directionButton);
                                                    directionsMessage.appendChild(document.createElement('br')); // Добавляем перенос строки после каждой кнопки
                                                }
                                                directionsMessage.classList.add('removable');
                                                chatbox.appendChild(directionsMessage);
                                                directionsMessage.scrollIntoView();
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            });
        }
    });
    // Добавляем обработчик событий для button2
    document.getElementById('button2').addEventListener('click', function(event) {
        event.preventDefault();
        
        // Создаем сообщение бота и поле для ввода
        var botMessage = createMessageElement('bot', 'Просто напиши мне название любой образовательной программы');
        botMessage.classList.add('removable');
        var inputField = document.createElement('input');
        inputField.setAttribute('id', 'direction-input');
        inputField.setAttribute('class', 'messageInputTap');
        inputField.setAttribute('placeholder', 'Введите название образовательной программы'); // Добавляем атрибут placeholder
        botMessage.appendChild(inputField);
    
        // Создаем кнопку для отправки запроса
        var submitButton = document.createElement('button');
        submitButton.textContent = 'Отправить';
        submitButton.setAttribute('class', 'custom-button');
        botMessage.appendChild(submitButton);
    
        chatbox.appendChild(botMessage);
        botMessage.scrollIntoView();
        
        // Добавляем обработчик событий для поля ввода и кнопки отправки запроса
        document.getElementById('direction-input').addEventListener('change', function(event) {
            sendData(event.target.value);
        });
    
        submitButton.addEventListener('click', function(event) {
            var inputValue = document.getElementById('direction-input').value;
            sendData(inputValue);
        });
    });
    
    function sendData(direction) {
        // Отправляем запрос на сервер с выбранным направлением
        fetch('/get_direction_info/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
            },
            body: JSON.stringify({
                direction: direction
            }),
        })
        .then(response => response.json())
        .then(data => {
            // Преобразуем объект data в строку
            var dataString = JSON.stringify(data, null, 2);  // второй аргумент null и третий аргумент 2 делают вывод более читаемым
    
            dataString = dataString.replace(/\\n/g, '<br>');
    
            // Регулярное выражение для поиска URL
            var urlRegex = /(https?:\/\/[^\s]+)/g;
            
            // Находим все ссылки в строке JSON
            var urls = dataString.match(urlRegex);
    
            // Создаем новую строку для ссылок
            var linkString = '';
    
            // Проходим по всем найденным ссылкам
            for (var i = 0; i < urls.length; i++) {
                // Удаляем все <br> из найденной ссылки
                var url = urls[i].replace(/<br>/g, '');
                
                // Добавляем HTML-ссылку в строку ссылок
                linkString += `<br><a href="${url}" target="_blank" rel="noopener noreferrer" title="Это ссылка на ${url}">Перейти по ссылке</a><br>`;
            }
    
            // Добавляем строку ссылок в конец исходного текста
            dataString += linkString;
    
            // Создаем сообщение со всей информацией
            var directionInfoMessage = createMessageElement('bot', dataString);
            chatbox.appendChild(directionInfoMessage);
            directionInfoMessage.innerHTML = dataString;
        });
    }            

    document.getElementById('button3').addEventListener('click', function(event) {
        event.preventDefault();
        
        // Создаем сообщение с вопросом
        var questionMessage = createMessageElement('bot', 'Напишите свой вопрос для приёмной комиссии:');
        questionMessage.classList.add('removable'); // Добавляем класс 'removable' к сообщению
        
        // Создаем поле ввода
        var inputElement = document.createElement('input');
        inputElement.setAttribute('id', 'questionInput');
        inputElement.setAttribute('class', 'messageInputTap');
        inputElement.setAttribute('placeholder', 'Введите сюда свой вопрос'); // Добавляем атрибут placeholder
        questionMessage.appendChild(inputElement);

        // Создаем кнопку для отправки вопроса
        var submitButton = document.createElement('button');
        submitButton.textContent = 'Отправить';
        submitButton.setAttribute('class', 'custom-button');
        questionMessage.appendChild(submitButton);
    
        chatbox.appendChild(questionMessage);
        questionMessage.scrollIntoView();
        
        // Добавляем обработчик событий для кнопки отправки вопроса
        submitButton.addEventListener('click', function(event) {
            event.preventDefault();
            var question = inputElement.value;
            var user_id = 1
            
            var data = {
                question: question,
                user_id: user_id
            };
            
            fetch('/save_question/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                var similarQuestions = data.similar_questions;
                
                // Создаем новое сообщение с текстом и кнопками
                var newMessage = createMessageElement('bot', 'Ваш вопрос отправлен на рассмотрение приёмной комиссии. А пока я нашёл похожие вопросы с готовыми ответами:');
                for (var i = 0; i < similarQuestions.length; i++) {
                    var questionButton = document.createElement('button');
                    questionButton.textContent = similarQuestions[i];
                    questionButton.setAttribute('class', 'custom-button'); // Добавляем класс .custom-button
                    newMessage.appendChild(questionButton);
                }

                chatbox.appendChild(newMessage);
                newMessage.scrollIntoView();
                    
                // Добавляем обработчик событий для кнопок с похожими вопросами
                var buttons = newMessage.querySelectorAll('.custom-button');
                buttons.forEach(function(button) {
                    button.addEventListener('click', function(event) {
                        event.preventDefault();
                        var questionText = event.target.textContent;
                        
                        var data = {
                            question_text: questionText
                        };
                        
                        fetch('/get_answer/', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                            },
                            body: JSON.stringify(data),
                        })
                        .then(response => response.json())
                        .then(data => {
                            var answer = data.answer;
                            // Создаем новое сообщение с ответом
                            var answerMessage = createMessageElement('bot', answer);
                            chatbox.appendChild(answerMessage);
                            answerMessage.scrollIntoView();
                        });
                    });
                });                       
            });
        });
    });
    document.getElementById('button4').addEventListener('click', function(event) {
        event.preventDefault();
        
        // Массив имен файлов изображений
        var imageNames = [
            'Plan.png'
        ];
        
        // Создаем сообщение с изображениями
        var imageMessage = createMessageElement('bot', ''); // Создайте функцию createMessageElement, если ее еще нет в вашем коде
        
        // Создаем контейнер для изображений
        var imagesContainer = document.createElement('div');
        imagesContainer.setAttribute('class', 'my-images-container');
        
        // Создаем кнопку для скачивания изображения вне функции
        var downloadButton = document.createElement('button');
        var iconElement = document.createElement('i');
        iconElement.setAttribute('class', 'fas fa-cloud-download-alt'); // Используем класс иконки Font Awesome для облака с загрузкой
        downloadButton.appendChild(iconElement); // Добавляем иконку в кнопку
        downloadButton.setAttribute('class', 'my-custom-button custom-download-button'); // Используем ваши классы стилизации кнопки
        downloadButton.style.display = "none"; // Начинаем с ее скрытия
    
        // Добавляем кнопку в модальное окно
        var modal = document.getElementById('myCustomModal');
        modal.appendChild(downloadButton);
        
        // Перебираем массив имен файлов изображений
        imageNames.forEach(function(name) {
            // Создаем элемент изображения
            var imageElement = document.createElement('img');
            imageElement.setAttribute('src', staticImagePath + name);
            imageElement.setAttribute('alt', 'Описание изображения');
            imageElement.setAttribute('class', 'my-chat-image my-small-image'); // Измененные классы
            
            // Добавляем обработчик событий для открытия модального окна при клике на изображение
            imageElement.addEventListener('click', function() {
                var modal = document.getElementById('myCustomModal');
                var modalImg = document.getElementById('myModalImg');
                modal.style.display = "block";
                modalImg.src = this.src;
    
                // Устанавливаем ссылку для скачивания кнопки
                downloadButton.style.display = "block";
                downloadButton.onclick = function() {
                    var downloadLink = document.createElement('a');
                    downloadLink.href = modalImg.src; // Используем ссылку на изображение в модальном окне
                    downloadLink.download = 'image.jpg'; // Устанавливаем имя файла для скачивания
                    downloadLink.click();
                };
            });
            
            // Добавляем изображение в контейнер
            imagesContainer.appendChild(imageElement);
        });
        
        // Создаем текстовое сообщение
        var textMessage = document.createElement('p');
        textMessage.textContent = 'Вот план-схема корпусов и ссылка на навигатор:';
    
        // Создаем ссылку
        var linkElement = document.createElement('a');
        linkElement.href = 'https://nav.donstu.ru/navigator';
        linkElement.textContent = 'Перейти к навигатору';
        linkElement.setAttribute('class', 'my-navigation-link');
        
        // Добавляем текст и ссылку в сообщение
        imageMessage.appendChild(textMessage);
        imageMessage.appendChild(linkElement);
        imageMessage.appendChild(imagesContainer);
        
        // Добавляем сообщение с изображениями в чат
        chatbox.appendChild(imageMessage);
        
        // Прокручиваем чат к последнему добавленному элементу
        imageMessage.scrollIntoView();
    });
    
    // Обработчик события для закрытия модального окна по клику на кнопку или на затемненную область
    var modal = document.getElementById('myCustomModal');
    modal.addEventListener('click', function(event) {
        if (event.target === modal || event.target.classList.contains('my-close')) {
            modal.style.display = "none";
        }
    });       

    document.getElementById('button5').addEventListener('click', function(event) {
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