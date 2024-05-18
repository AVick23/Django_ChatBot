// Получаем элементы
const messageInput = document.getElementById('messageInput');
const messageForm = document.getElementById('messageForm');
const submitBtn = document.getElementById('submitBtn');
const chatbox = document.getElementById('chatbox');
const menuButton = document.getElementById('menuButton');
const toggleButton = document.getElementById('theme-toggle');
const icon = document.getElementById('icon');

document.addEventListener("DOMContentLoaded", function() {
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    const chatbox = document.getElementById('chatbox');

    // Загрузка сообщений из Session Storage
    const savedMessages = JSON.parse(sessionStorage.getItem('chatMessages')) || [];
    savedMessages.forEach(function(message) {
        const messageElement = createMessageElement(message.type, message.content, message.html);
        chatbox.appendChild(messageElement);
        animateMessage(messageElement);
        messageElement.scrollIntoView();
    });

    messageForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const message = messageInput.value;
        messageInput.value = '';

        const userMessage = createMessageElement('user', message);
        chatbox.appendChild(userMessage);
        animateMessage(userMessage);
        userMessage.scrollIntoView();

        saveMessageToSession('user', message, userMessage.outerHTML); // Сохранение сообщения пользователя в Session Storage

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
            if (data.suggestedQuestions && data.suggestedQuestions.length > 0) {
                const suggestionMessage = createMessageElement('bot', 'Может быть, вы имели в виду это?');
                const buttonsContainer = document.createElement('div'); 
                buttonsContainer.classList.add('button-container');

                data.suggestedQuestions.forEach(question => {
                    const buttonElement = document.createElement('button'); 
                    buttonElement.textContent = question.question; 
                    buttonElement.classList.add('custom-button'); 

                    buttonElement.addEventListener('click', function() {
                        const userQuestion = question.question;
                        const botAnswer = question.answer;

                        const userQuestionMessage = createMessageElement('user', userQuestion);
                        chatbox.appendChild(userQuestionMessage);
                        animateMessage(userQuestionMessage);
                        userQuestionMessage.scrollIntoView();

                        const botAnswerMessage = createMessageElement('bot', ''); 
                        chatbox.appendChild(botAnswerMessage); 
                        animateMessage(botAnswerMessage);
                        botAnswerMessage.scrollIntoView();

                        let i = 0;
                        const typing = setInterval(function() {
                            if (i < botAnswer.length) {
                                botAnswerMessage.textContent += botAnswer[i];
                                i++;
                            } else {
                                clearInterval(typing);
                                
                                if (typeof botAnswer === 'string') {
                                    var urlRegex = /(https?:\/\/[^\s]+)/g;
                                    var urls = botAnswer.match(urlRegex);
                                    if (urls) {
                                        urls.forEach(function(url) {
                                            botAnswerMessage.innerHTML +=  `<br><a href="${url}" target="_blank" rel="noopener noreferrer" title="Это ссылка на ${url}">Перейти по ссылке</a><br>`;
                                        });
                                    }
                                }
                                saveMessageToSession('bot', botAnswerMessage.textContent, botAnswerMessage.outerHTML); // Сохранение сообщения бота в Session Storage
                            }
                        },);

                        saveMessageToSession('user', userQuestion, userQuestionMessage.outerHTML);
                    });

                    buttonsContainer.appendChild(buttonElement); 
                    buttonsContainer.appendChild(document.createElement('br')); 
                });

                // Создаем кнопку "Не нашли ответ на свой вопрос?"
                const notFoundButton = document.createElement('button');
                notFoundButton.textContent = 'Не нашли ответ на свой вопрос? Нажмите сюда!';
                notFoundButton.classList.add('custom-button');

                notFoundButton.addEventListener('click', function() {
                    const userQuestion = message; 

                    fetch('/handle_question/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                        },
                        body: JSON.stringify({ message: userQuestion }), 
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            const modal = document.createElement('div');
                            modal.className = 'my-custom-modal'; // Измененный класс для модального окна
                            const modalContent = document.createElement('div');
                            modalContent.className = 'my-text-container'; // Измененный класс для контейнера текста в модальном окне
                            modalContent.textContent = 'Ваш вопрос сохранен. Я постараюсь скоро научиться отвечать на него!😊';
                            modal.appendChild(modalContent);
                            document.body.appendChild(modal);
                
                            modal.style.display = 'block';

                            window.addEventListener('click', function(event) {
                                if (event.target == modal) {
                                    modal.style.display = 'none';
                                    modal.remove();
                                }
                            });
                        } else {
                            console.error('Ошибка сохранения вопроса:', data.error);
                        }
                    })
                    .catch(error => {
                        console.error('Ошибка:', error);
                    });
                    
                });

                buttonsContainer.appendChild(notFoundButton); 

                suggestionMessage.appendChild(buttonsContainer); 
                chatbox.appendChild(suggestionMessage); 
            } else {
                const botMessage = createMessageElement('bot', data.response);
                chatbox.appendChild(botMessage);
                animateMessage(botMessage);
                botMessage.scrollIntoView();

                saveMessageToSession('bot', data.response, botMessage.outerHTML); // Сохранение сообщения бота в Session Storage
            }
        });
    });
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