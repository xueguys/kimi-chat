function addMessage(content, isUser) {
    const history = document.getElementById('chat-history');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    
    if (isUser) {
        messageDiv.textContent = content;
    }
    
    history.appendChild(messageDiv);
    
    messageDiv.addEventListener('animationend', () => {
        messageDiv.classList.add('animated');
    }, { once: true });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                messageDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
                observer.disconnect();
            }
        });
    });
    
    observer.observe(messageDiv);
    return messageDiv;
}

async function streamMessage(messageDiv) {
    let text = '';
    messageDiv.textContent = '';
    
    const textContent = document.createElement('span');
    textContent.className = 'text-content';
    messageDiv.appendChild(textContent);
    
    const typingIndicator = document.createElement('span');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = '<span></span><span></span><span></span>';
    messageDiv.appendChild(typingIndicator);
    typingIndicator.style.opacity = '1';

    let lastHeight = messageDiv.offsetHeight;

    return new Promise((resolve) => {
        function appendChar(char) {
            messageDiv.classList.add('typing');
            const span = document.createElement('span');
            span.className = 'text-char';
            span.textContent = char;
            textContent.appendChild(span);
            text += char;

            const newHeight = messageDiv.scrollHeight;
            if (newHeight !== lastHeight) {
                requestAnimationFrame(() => {
                    messageDiv.style.height = `${newHeight}px`;
                    lastHeight = newHeight;
                });
            }
        }

        function complete() {
            typingIndicator.remove();
            const completeIndicator = document.createElement('span');
            completeIndicator.className = 'complete-indicator';
            completeIndicator.innerHTML = '✓';
            messageDiv.appendChild(completeIndicator);
            
            setTimeout(() => {
                completeIndicator.style.opacity = '0';
                setTimeout(() => completeIndicator.remove(), 300);
            }, 2000);
        }

        return resolve({ appendChar, complete });
    });
}
