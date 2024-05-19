from django.http import HttpResponse
from django.shortcuts import render
import spacy
import json
from django.views.decorators.csrf import csrf_exempt
from .models import ChatMessage
import os
import subprocess
from django.http import JsonResponse, FileResponse, StreamingHttpResponse
from zipfile import ZipFile, ZIP_DEFLATED
from io import BytesIO
from tempfile import TemporaryDirectory
from py_files.NLP import question_answer_pairs
from py_files.searh_directions import search_directions_strict, search_directions_flexible, get_direction_data, search_similar_questions
from py_files.save_questions import save_question_to_db, get_answer_for_question

db_path = "university.sqlite"

# Загрузка языковой модели Spacy
nlp = spacy.load('ru_core_news_lg')

@csrf_exempt
def chat(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_message = data.get('message')

        # Анализ текста пользователя с использованием Spacy
        user_message_doc = nlp(user_message.lower())

        # Обработка запроса на предложение похожих вопросов
        similarities = []
        for pair in question_answer_pairs:
            question = pair['question']
            answer = pair['answer']
            question_doc = nlp(question.lower())
            similarity_score = user_message_doc.similarity(question_doc)
            similarities.append((question, answer, similarity_score))

        # Сортировка по убыванию сходства и выбор топ-N подходящих вопросов
        similarities.sort(key=lambda x: x[2], reverse=True)
        top_similarities = similarities[:3]  # Выбираем топ-3 похожих вопросов

        # Формирование ответа, включающего и вопросы, и ответы
        suggested_responses = [{'question': q[0], 'answer': q[1]} for q in top_similarities]

        # Сохранение сообщений в сессии
        chat_history = request.session.get('chat_history', [])
        chat_history.append({'sender': 'user', 'message': user_message})
        for response in suggested_responses:
            chat_history.append({'sender': 'bot', 'message': response['answer']})
        request.session['chat_history'] = chat_history

        return JsonResponse({'suggestedQuestions': suggested_responses})
    
    # Возврат шаблона для GET-запросов
    return render(request, 'chatbot.html')

@csrf_exempt
def get_chat_history(request):
    chat_history = request.session.get('chat_history', [])
    return JsonResponse({'chatHistory': chat_history})


@csrf_exempt
def handle_question(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            message = data.get('message', '')  # Получаем текст сообщения пользователя
            if message:
                with open('questions.txt', 'a', encoding='utf-8') as file:
                    file.write(message + '\n')
                return JsonResponse({'success': True})
            else:
                return JsonResponse({'success': False, 'error': 'Неверный формат данных'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Ошибка разбора JSON'}, status=400)
    else:
        return JsonResponse({'success': False, 'error': 'Метод не разрешен'}, status=405)

# Обновляем функцию save_message
@csrf_exempt
def save_message(request):
    data = json.loads(request.body)
    message = ChatMessage(
        session_id=data['sessionId'],
        message_text=data['message'],
        is_user=data['isUser'],
    )
    message.save()
    return JsonResponse({'status': 'ok'})

# Обновляем функцию load_chat
@csrf_exempt
def load_chat(request):
    data = json.loads(request.body)
    sessionId = data.get('sessionId')

    # Загружаем сообщения из базы данных, включая подписи
    messages = ChatMessage.objects.filter(session_id=sessionId).order_by('timestamp')

    # Преобразуем сообщения в формат, который можно сериализовать в JSON
    messages_data = [{'text': message.message_text, 'isUser': message.is_user, 'signature': message.signature} for message in messages]

    return JsonResponse({'messages': messages_data})
      
def button1(request):
    return HttpResponse('Вы выбрали: 📘Подобрать образовательную программу')

def button2(request):
    return HttpResponse('Вы выбрали: 📕Информация об образовательной программе')

@csrf_exempt
def get_programs(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        area = data.get('area')
        subjects = data.get('subjects')
        form = data.get('form')
        payment = data.get('payment')
        search_type = data.get('search_type')

        # передав в нее полученные параметры. Например:
        if search_type == 'Строгий':
            directions = search_directions_strict(area, subjects, form)
        else:
            directions = search_directions_flexible(area, subjects, form)

        return JsonResponse(directions, safe=False)
    
@csrf_exempt
def get_direction_info(request):
    if request.method == 'POST':
        data = json.loads(request.body)  # Получаем данные из запроса
        direction = data.get('direction')  # Получаем выбранное направление

        # Здесь вы можете получить информацию о выбранном направлении из базы данных или другого источника
        direction_info = get_direction_data(direction)

        # Возвращаем информацию о выбранном направлении в формате JSON
        return JsonResponse(direction_info, safe=False)
        
@csrf_exempt
def save_question(request):
    data = json.loads(request.body)
    question_text = data['question']
    user_id = data['user_id']
    
    save_question_to_db(question_text, user_id)
    
    similar_questions = search_similar_questions(question_text)
    
    return JsonResponse({'similar_questions': similar_questions})

@csrf_exempt
def get_answer(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        question_text = data.get('question_text')
        answer = get_answer_for_question(question_text)
        return JsonResponse({'answer': answer})

progress_data = {}

def convert_to_pdf(input_file, output_folder, file_id, total_files):
    filename, _ = os.path.splitext(os.path.basename(input_file))
    output_file = os.path.join(output_folder, f"{filename}.pdf")

    # Путь к исполняемому файлу LibreOffice (soffice)
    if os.name == 'nt':  # Windows
        libreoffice_path = "C:\\Program Files\\LibreOffice\\program\\soffice.exe"
    else:  # Linux
        libreoffice_path = "/usr/bin/libreoffice"

    try:
        subprocess.run([libreoffice_path, '--headless', '--convert-to', 'pdf', input_file, '--outdir', output_folder], check=True)
        progress_data[file_id] += 1
        progress_data['processed'] += 1
        return output_file
    except subprocess.CalledProcessError:
        # Логируем ошибку или обрабатываем её каким-либо образом
        progress_data[file_id] += 1  # Обновляем прогресс даже при ошибке
        progress_data['processed'] += 1
        return None

def process_files_in_batches(uploaded_files, temp_dir, file_id):
    batch_size = 10
    zip_buffer = BytesIO()
    with ZipFile(zip_buffer, 'w', ZIP_DEFLATED) as zip_file:
        for i in range(0, len(uploaded_files), batch_size):
            batch_files = uploaded_files[i:i + batch_size]
            for uploaded_file in batch_files:
                file_path = os.path.join(temp_dir, uploaded_file.name)
                with open(file_path, 'wb') as f:
                    for chunk in uploaded_file.chunks():
                        f.write(chunk)

                pdf_path = convert_to_pdf(file_path, temp_dir, file_id, len(uploaded_files))
                if pdf_path:
                    zip_file.write(pdf_path, os.path.basename(pdf_path))

    zip_buffer.seek(0)
    return zip_buffer

def upload_file(request):
    if request.method == 'POST' and request.FILES.getlist('files'):
        uploaded_files = request.FILES.getlist('files')
        total_files = len(uploaded_files)
        file_id = str(request.user.id)  # или другой уникальный идентификатор пользователя

        progress_data[file_id] = 0
        progress_data['total'] = total_files
        progress_data['processed'] = 0

        with TemporaryDirectory() as temp_dir:
            zip_buffer = process_files_in_batches(uploaded_files, temp_dir, file_id)
            
            response = FileResponse(zip_buffer, content_type='application/zip')
            response['Content-Disposition'] = 'attachment; filename="converted_files.zip"'
            return response
    else:
        return JsonResponse({'error': 'Files not provided'}, status=400)

def progress(request):
    file_id = str(request.user.id)  # или другой уникальный идентификатор пользователя
    def event_stream():
        while True:
            if file_id in progress_data:
                current = progress_data[file_id]
                total = progress_data['total']
                yield f"data: {current}/{total}\n\n"
                if progress_data['processed'] == total:
                    del progress_data[file_id]
                    break
            else:
                yield f"data: 0/0\n\n"

    return StreamingHttpResponse(event_stream(), content_type='text/event-stream')