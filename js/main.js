async function handleSendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    if (!message) return;
    
    input.value = '';
    addMessage(message, true);
    
    const botMessageDiv = addMessage('', false);
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "moonshot-v1-32k",  // Model name
                messages: [
                    {"role": "system", "content": "你是 Kimi，由 Moonshot AI 提供的人工智能助手。"}, //role
                    {"role": "user", "content": message}
                ],
                temperature: 0.3, // Temperature of the response
                stream: true
            })
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        const { appendChar, complete } = await streamMessage(botMessageDiv);

        while (true) {
            const {done, value} = await reader.read();
            if (done) {
                complete();
                break;
            }
            
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                    const data = JSON.parse(line.slice(6));
                    const content = data.choices[0].delta.content;
                    if (content) {
                        appendChar(content);
                    }
                }
            }
        }
    } catch (error) {
        botMessageDiv.textContent = `错误: ${error}`;  // Display error message
    }
}

document.getElementById('send-button').onclick = handleSendMessage;

document.getElementById('message-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handleSendMessage();
    }
});
