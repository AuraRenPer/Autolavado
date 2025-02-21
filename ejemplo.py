from flask import Flask, request, jsonify

app = Flask(__name__)
todos = []

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/api/todos', methods=['GET'])
def get_todos():
    return jsonify(todos), 200

@app.route('/api/todos', methods=['POST'])
def create_todo():
    if not request.json or 'title' not in request.json:
        return jsonify({"error": "Title is required"}), 400
    
    todo = {
        'id': len(todos) + 1,
        'title': request.json['title'],
        'completed': False
    }
    todos.append(todo)
    return jsonify(todo), 201



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True, use_reloader=True)