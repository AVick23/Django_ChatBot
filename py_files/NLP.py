import spacy

# Загрузка языковой модели Spacy
nlp = spacy.load('ru_core_news_lg')

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