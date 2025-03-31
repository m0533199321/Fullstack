from io import BytesIO
import os
import json
from docx import Document
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import openai
import requests
from dotenv import load_dotenv

load_dotenv()
my_key = os.getenv('OPENAI_API_KEY')

app = Flask(__name__)
CORS(app)

os.environ['OPENAI_API_KEY'] = my_key
client = openai.OpenAI()

my_model = "gpt-4o-mini"


@app.route('/api/recipe/name', methods=['POST'])
def get_recipe_name():
    user_request = request.json.get('request', '').strip()

    # קרא שם מתכון מהמודל
    recipe_name = name_recipe_with_ai(user_request)
    if "Error" in recipe_name:
        return jsonify({"error": recipe_name}), 500

    return jsonify({"recipe_name": recipe_name})


@app.route('/api/recipe/file', methods=['POST'])
def get_recipe_file():
    if request.json is None:
        return jsonify({"error": "No JSON body provided"}), 400
    user_request = request.json.get('request', '').strip()
    recipe_name = request.json.get('recipe_name', '').strip()

    try:
        completion = client.chat.completions.create(
            model=my_model,
            temperature=1.2,
            messages=[
                {
                    "role": "system",
                    "content": f"""Give me a kosher recipe for the request.the language must be only in the user's request language. Include the recipe name: {recipe_name}, full ingredient list, and step-by-step instructions. Use line breaks only.The format must be:
                                Ingredients:
                                - ingredient 1
                                - ingredient 2
                                - ...
                                Instructions:
                                1. Step 1
                                2. Step 2
                                ...
                                """
                },
                {
                    "role": "user",
                    "content": f"{user_request}"
                }
            ]
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    recipe_text = completion.choices[0].message.content

    url = 'https://malismartchef.s3.us-east-1.amazonaws.com/recipes/template.docx'

    response = requests.get(url)
    if response.status_code == 200:
        with open('template.docx', 'wb') as f:
            f.write(response.content)

    doc = Document('template.docx')

    lines = recipe_text.split("\n")
    ingredients = []
    instructions = []

    for line in lines:
        line = line.strip()
        if line.startswith("-"):
            ingredients.append(line)
        elif line and line.split('.')[0].isdigit():
            instructions.append(line)

    ingredients_text = "\n".join(ingredients)
    instructions_text = "\n".join(instructions)

    for para in doc.paragraphs:
        if "{{recipe_name}}" in para.text:
            para.text = para.text.replace("{{recipe_name}}", recipe_name)
        if "{{ingredients}}" in para.text:
            para.text = para.text.replace("{{ingredients}}", ingredients_text)
        if "{{instructions}}" in para.text:
            para.text = para.text.replace("{{instructions}}", instructions_text)

    output_stream = BytesIO()
    doc.save(output_stream)
    output_stream.seek(0)

    output_filename = f"{recipe_name}.docx"
    print(output_stream)
    return send_file(output_stream, as_attachment=True, download_name=output_filename,
                     mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document')


def name_recipe_with_ai(user_request):
    try:
        completion = client.chat.completions.create(
            model=my_model,
            messages=[
                {
                    "role": "system",
                    "content": f"""You are a precise chef who names recipes. The recipe name must be in the language of the user's request. Given the following request, return a recipe name that matches the request, a generic name without events, dates, and specific descriptions from the request."""
                },
                {
                    "role": "user",
                    "content": f"""{user_request}"""
                }
            ]
        )

        answer = completion.choices[0].message.content
        return answer

    except Exception as e:
        return f"Error: {e}"


if __name__ == '__main__':
    app.run(debug=True)

