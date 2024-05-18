// Обработчик события нажатия клавиши в поле ввода сообщения
messageInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        submitBtn.click();
    }
});

// Создает новый элемент сообщения
function createMessageElement(className, text) {
    const messageElement = document.createElement('p');
    messageElement.className = `message ${className}`;
    messageElement.textContent = text;
    return messageElement;
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

// Функция для сохранения сообщений в Session Storage
function saveMessageToSession(type, content, html) {
    const chatMessages = JSON.parse(sessionStorage.getItem('chatMessages')) || [];
    chatMessages.push({ type: type, content: content, html: html });
    sessionStorage.setItem('chatMessages', JSON.stringify(chatMessages));
}