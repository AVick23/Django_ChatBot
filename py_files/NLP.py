def read_questions_answers(file_path):
    pairs = []
    with open(file_path, 'r', encoding='utf-8') as file:
        for line in file:
            # Разделение строки на вопрос и ответ без использования ':'
            question, answer = line.strip().split(' : ')
            pairs.append({'question': question, 'answer': answer})
    return pairs

# Загрузка вопрос-ответных пар из файла
question_answer_pairs = read_questions_answers('context2.txt')

# # Ручное создание списка словарей вопрос-ответов
# question_answer_pairs = [
#     {'question': 'Как тебя зовут?', 'answer': 'Меня зовут бот.'},
#     {'question': 'Сколько тебе лет?', 'answer': 'Мне несколько месяцев.'},
#     {'question': 'Где ты живешь?', 'answer': 'Я живу в облаке данных.'},
#     # Добавьте сюда любые другие пары вопросов и ответов
# ]