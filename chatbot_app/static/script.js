 // Получаем элементы
 const messageInput = document.getElementById('messageInput');
 const messageForm = document.getElementById('messageForm');
 const submitBtn = document.getElementById('submitBtn');
 const chatbox = document.getElementById('chatbox');
 const menuButton = document.getElementById('menuButton');
 const toggleButton = document.getElementById('theme-toggle');
 const icon = document.getElementById('icon');

 // Обработчик события нажатия клавиши в поле ввода сообщения
 messageInput.addEventListener('keydown', function(event) {
     if (event.key === 'Enter') {
         event.preventDefault();
         submitBtn.click();
     }
 });

 messageForm.addEventListener('submit', function(event) {
     event.preventDefault();
     const message = messageInput.value;
     messageInput.value = '';
 
     const userMessage = createMessageElement('user', message);
     const userSignature = createSignatureDiv('Вы');
     chatbox.appendChild(userSignature);
     chatbox.appendChild(userMessage);
     animateMessage(userMessage);
     userMessage.scrollIntoView();
 
     if (!sessionStorage.getItem('sessionId')) {
         sessionStorage.setItem('sessionId', Date.now());
     }
     var sessionId = sessionStorage.getItem('sessionId');  
 
     fetch('/', {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json',
             'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
         },
         body: JSON.stringify({ message: message }),
     })
     .then(response => response.json())
     .then(data => {
         const botSignature = createSignatureDiv('Чат-Бот');
         chatbox.appendChild(botSignature);
 
         if (data.suggestedQuestions && data.suggestedQuestions.length > 0) {
             const suggestionMessage = createMessageElement('bot', 'Может быть, вы имели в виду это?');
             chatbox.appendChild(suggestionMessage);
 
             data.suggestedQuestions.forEach(question => {
                 const buttonElement = document.createElement('button'); // Создаем кнопку
                 buttonElement.textContent = question.question; // Устанавливаем текст кнопки
                 buttonElement.classList.add('custom-button'); // Добавляем класс кнопке для стилизации
 
                 // Добавляем обработчик событий для нажатия на кнопку
                 buttonElement.addEventListener('click', function() {
                     const userQuestion = question.question;
                     const botAnswer = question.answer;
 
                     const userQuestionMessage = createMessageElement('user', userQuestion);
                     const userSignature = createSignatureDiv('Вы');
                     chatbox.appendChild(userSignature);
                     chatbox.appendChild(userQuestionMessage);
                     animateMessage(userQuestionMessage);
                     userQuestionMessage.scrollIntoView();
 
                     const botAnswerMessage = createMessageElement('bot', ''); // Создаем пустое сообщение бота
                     const botSignature = createSignatureDiv('Чат-Бот');
                     chatbox.appendChild(botSignature);
                     chatbox.appendChild(botAnswerMessage); // Добавляем сообщение бота с ответом
                     animateMessage(botAnswerMessage);
                     botAnswerMessage.scrollIntoView();
 
                     // Выводим каждый символ с анимацией
                     let i = 0;
                     const typing = setInterval(function() {
                         if (i < botAnswer.length) {
                             botAnswerMessage.textContent += botAnswer[i];
                             i++;
                         } else {
                             clearInterval(typing);
                             
                             // Проверяем, есть ли в ответе бота URL-ы
                             if (typeof botAnswer === 'string') {
                                 var urlRegex = /(https?:\/\/[^\s]+)/g;
                                 var urls = botAnswer.match(urlRegex);
                                 if (urls) {
                                     // Выводим ссылки
                                     urls.forEach(function(url) {
                                         botAnswerMessage.innerHTML +=  `<br><a href="${url}" target="_blank" rel="noopener noreferrer" title="Это ссылка на ${url}">Перейти по ссылке</a><br>`;
                                     });
                                 }
                             }
                         }
                     },20);
                 });
 
                 const buttonContainer = document.createElement('div'); // Создаем контейнер для кнопки
                 buttonContainer.classList.add('button-container'); // Добавляем класс контейнеру для стилизации
                 buttonContainer.appendChild(buttonElement); // Добавляем кнопку в контейнер
 
                 // Добавляем контейнер с кнопкой к сообщению бота
                 suggestionMessage.appendChild(buttonContainer);
             });
         } else {
             // Если нет предложенных вопросов, просто добавляем текст ответа бота
             const botMessage = createMessageElement('bot', data.response);
             chatbox.appendChild(botMessage);
             animateMessage(botMessage);
             botMessage.scrollIntoView();
         }
 
         // Сохраняем сообщения в сессии
         saveMessage(sessionId, message, true);
         saveMessage(sessionId, data.response, false);
     });
 });
 
 
 
 
 

 // Функция для сохранения сообщения на сервере
 function saveMessage(sessionId, message, isUser) {
     fetch('/save_message/', {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json',
             'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
         },
         body: JSON.stringify({
             sessionId: sessionId,
             message: message,
             isUser: isUser,
             signature: isUser ? 'Вы' : 'Чат-Бот'
         }),
     });
 }

 // window.onload = function() {
 //     var sessionId = sessionStorage.getItem('sessionId');  

 //     // Загружаем историю чата с сервера
 //     fetch('/load_chat/', {
 //         method: 'POST',
 //         headers: {
 //             'Content-Type': 'application/json',
 //             'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
 //         },
 //         body: JSON.stringify({
 //             sessionId: sessionId
 //         }),
 //     })
 //     .then(response => response.json())
 //     .then(data => {
 //         data.messages.forEach(function(message) {
 //             const messageElement = createMessageElement(message.isUser ? 'user' : 'bot', message.text);
 //             const signature = document.createElement('div');
 //             signature.textContent = message.signature || ''; // Добавляем пустую строку для случая, если подписи нет
 //             messageElement.appendChild(signature);
 //             chatbox.appendChild(messageElement);
 //             animateMessage(messageElement);
 //         });
 //     });
 // };
     
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
     const botSignature = createSignatureDiv('Чат-Бот');
     chatbox.appendChild(botSignature); 
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
             modal.className = 'modal';
             const modalContent = document.createElement('div');
             modalContent.className = 'modal-content';
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
         const botSignature = createSignatureDiv('Чат-Бот');
         chatbox.appendChild(botSignature); 
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
                 const botSignature = createSignatureDiv('Чат-Бот');
                 chatbox.appendChild(botSignature);
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
                     const botSignature = createSignatureDiv('Чат-Бот');
                     chatbox.appendChild(botSignature);
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
                             const botSignature = createSignatureDiv('Чат-Бот');
                             chatbox.appendChild(botSignature);
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
                                             modal.className = 'modal';
                                             const modalContent = document.createElement('div');
                                             modalContent.className = 'modal-content';
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
                                         searchMessage.appendChild(document.createElement('br'));
                                     }
                                     
                                     // Добавляем подпись и сообщение типов поиска к чату
                                     searchMessage.classList.add('removable');
                                     const botSignature = createSignatureDiv('Чат-Бот');
                                     chatbox.appendChild(botSignature);
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
                                                             const botSignature = createSignatureDiv('Чат-Бот');
                                                             chatbox.appendChild(botSignature);
                                                             chatbox.appendChild(directionInfoMessage);
                                                             directionInfoMessage.innerHTML = dataString;
                                                         });
                                                     });
                                                     directionsMessage.appendChild(directionButton);
                                                     directionsMessage.appendChild(document.createElement('br')); // Добавляем перенос строки после каждой кнопки
                                                 }
                                                 directionsMessage.classList.add('removable');
                                                 const botSignature = createSignatureDiv('Чат-Бот');
                                                 chatbox.appendChild(botSignature);
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

         const botSignature = createSignatureDiv('Чат-Бот');
         chatbox.appendChild(botSignature);
         chatbox.appendChild(botMessage);
         botMessage.scrollIntoView();
         
         // Добавляем обработчик событий для поля ввода
         document.getElementById('direction-input').addEventListener('change', function(event) {
             var direction = event.target.value; // Получаем название образовательной программы
             
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
                 const botSignature = createSignatureDiv('Чат-Бот');
                 chatbox.appendChild(botSignature);
                 chatbox.appendChild(directionInfoMessage);
                 directionInfoMessage.innerHTML = dataString;
             });
         });
     });

     document.getElementById('button3').addEventListener('click', function(event) {
         event.preventDefault();
         
         var questionMessage = createMessageElement('bot', 'Напишите свой вопрос для приёмной комисии:');
         questionMessage.classList.add('removable'); // Добавляем класс 'removable' к сообщению
         var inputElement = document.createElement('input');
         inputElement.setAttribute('id', 'questionInput');
         inputElement.setAttribute('class', 'messageInputTap');
         inputElement.setAttribute('placeholder', 'Введите сюда свой вопрос'); // Добавляем атрибут placeholder
         questionMessage.appendChild(inputElement);

         const botSignature = createSignatureDiv('Чат-Бот');
         chatbox.appendChild(botSignature);
         chatbox.appendChild(questionMessage);
         questionMessage.scrollIntoView();
         
         // Добавляем обработчик событий для поля ввода
         document.getElementById('questionInput').addEventListener('change', function(event) {
             event.preventDefault();
             var question = event.target.value;
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
             var newMessage = createMessageElement('bot', 'Ваш вопрос отправлен на расмотрение приёмной комиссии. А пока я нашёл похожие вопросы с готовыми ответами:');
             for (var i = 0; i < similarQuestions.length; i++) {
                 var questionButton = document.createElement('button');
                 questionButton.textContent = similarQuestions[i];
                 questionButton.setAttribute('class', 'custom-button'); // Добавляем класс .custom-button
                 newMessage.appendChild(questionButton);
             }
             const botSignature = createSignatureDiv('Чат-Бот');
             chatbox.appendChild(botSignature);
             chatbox.appendChild(newMessage);
             newMessage.scrollIntoView();
                 
                 // Добавляем обработчик событий для кнопки
                 questionButton.addEventListener('click', function(event) {
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
                         const botSignature = createSignatureDiv('Чат-Бот');
                         chatbox.appendChild(botSignature);
                         chatbox.appendChild(answerMessage);
                         answerMessage.scrollIntoView();
                     });
                 });                       
             });
         });
     });            
 });

 // Создает новый элемент сообщения
 function createMessageElement(className, text) {
     const messageElement = document.createElement('p');
     messageElement.className = `message ${className}`;
     messageElement.textContent = text;
     return messageElement;
 }

 function createSignatureElement(sender) {
     const signatureElement = document.createElement('p');
     signatureElement.classList.add('signature');
     signatureElement.textContent = sender;
     return signatureElement;
 }

 function createSignatureDiv(author) {
     const signature = document.createElement('div');
     signature.textContent = author;
     if (author === 'Вы') {
         signature.classList.add('user-signature');
     } else {
         signature.classList.add('bot-signature');
     }
     return signature;
 }        

 // Создает анимацию для элемента сообщения
 function animateMessage(messageElement) {
     const keyframes = [
         { transform: 'translateY(100%)', opacity: 0 },
         { transform: 'translateY(0)', opacity: 1 }
     ];
     const options = {
         duration: 500,
         easing: 'ease-out'
     };
     messageElement.animate(keyframes, options);
 }

 function createSignatureDiv(author) {
     const signature = document.createElement('div');
     signature.textContent = author;
     if (author === 'Вы') {
         signature.classList.add('user-signature');
     } else {
         signature.classList.add('bot-signature');
     }
     return signature;
 }        

 // Создает анимацию для элемента сообщения
 function animateMessage(messageElement) {
     const keyframes = [
         { transform: 'translateY(100%)', opacity: 0 },
         { transform: 'translateY(0)', opacity: 1 }
     ];
     const options = {
         duration: 500,
         easing: 'ease-out'
     };
     messageElement.animate(keyframes, options);
 }

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

 const darkCssPath = 'dark.css';
 const lightCssPath = 'light.css';

 toggleButton.addEventListener('click', function() {
     const currentTheme = document.documentElement.getAttribute('data-theme');
     const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
 
     document.documentElement.setAttribute('data-theme', newTheme);
 
     // Удаляем старый стиль, если он существует
     const oldStyle = document.getElementById('theme-style');
     if (oldStyle) {
         document.head.removeChild(oldStyle);
     }
 
     // Создаем новый стиль
     const style = document.createElement('style');
     style.id = 'theme-style';
 
     // Определяем путь к файлу стилей в зависимости от выбранной темы
     const cssFilePath = newTheme === 'dark' ? darkCssPath : lightCssPath;
 
     // Загружаем новый стиль
     fetch(cssFilePath)
         .then(response => response.text())
         .then(css => {
             style.textContent = css;
             document.head.appendChild(style);
         });
 
     // Меняем иконку в зависимости от выбранной темы
     if (newTheme === 'dark') {
         icon.classList.remove('sun');
         icon.classList.add('moon');
         icon.style.left = '35px';
     } else {
         icon.classList.remove('moon');
         icon.classList.add('sun');
         icon.style.left = '0';
     }
 });
 
   
   window.onscroll = function() {scrollFunction()};

   function scrollFunction() {
     var scrollToBottom = document.getElementById("scrollToBottom");
   
     // Показать стрелочку, если пользователь прокрутил вверх на 20 пикселей
     if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
       scrollToBottom.style.display = "block";
     } else {
       scrollToBottom.style.display = "none";
     }
   }
   
   // Плавная прокрутка вниз при нажатии на стрелочку
   document.getElementById("scrollToBottom").onclick = function() {
     scrollToBottom();
   };
   
   function scrollToBottom() {
     window.scroll({
       top: document.body.scrollHeight,
       behavior: 'smooth'
     });
   }