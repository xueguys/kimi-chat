from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os

app = Flask(__name__)
CORS(app)

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '')
        
        client = OpenAI(
            api_key="sk-uNu2QMgEc0Xa2RpN07cXNGL1cWEQgWvFZjFZHMggv0UJkqYJ",
            base_url="https://api.moonshot.cn/v1"
        )
        
        completion = client.chat.completions.create(
            model="moonshot-v1-8k",
            messages=[
                {"role": "system", "content": "你是 Kimi，由 Moonshot AI 提供的人工智能助手。"},
                {"role": "user", "content": user_message}
            ],
            temperature=0.3
        )
        
        return jsonify({"response": completion.choices[0].message.content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
