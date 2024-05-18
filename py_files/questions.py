import spacy
from rank_bm25 import BM25Okapi
import numpy as np

# Загрузка языковой модели
nlp = spacy.load("ru_core_news_lg")

def train_word_vectors(sentences):
    word_vectors = []
    for sentence in sentences:
        doc = nlp(sentence)
        vectors = [token.vector for token in doc if not token.is_stop and token.is_alpha]
        if vectors:
            sentence_vector = np.mean(vectors, axis=0)
            word_vectors.append(sentence_vector)
    return word_vectors

def filter_sentences(file_path, output_file):
    unique_sentences = set()  # Множество для хранения уникальных предложений

    # Открыть файл и прочитать его построчно
    with open(file_path, 'r', encoding='utf-8') as file:
        sentences = [line.strip() for line in file if line.strip()]  # Прочитать и очистить предложения
        bm25 = BM25Okapi(sentences)  # Инициализировать модель BM25

        # Обучение модели векторных представлений слов
        word_vectors = train_word_vectors(sentences)

        for sentence in sentences:
            # Проверка, является ли предложение уникальным
            if sentence not in unique_sentences:
                # Если предложение уникально, добавляем его в множество уникальных предложений
                unique_sentences.add(sentence)
            else:
                # Если предложение не уникально, проверяем схожесть с другими предложениями

                # Проверка схожести с помощью BM25
                query = sentence.split()
                bm25_scores = bm25.get_scores(query)
                max_score = max(bm25_scores)
                if max_score > 15:  # Пороговое значение для BM25
                    continue

                # Получаем вектор предложения
                sentence_vector = np.mean(train_word_vectors([sentence]), axis=0)
                
                # Проверка схожести с предложениями из множества уникальных предложений
                similar_found = False
                for unique_sentence in unique_sentences:
                    unique_sentence_vector = np.mean(train_word_vectors([unique_sentence]), axis=0)
                    similarity = np.dot(sentence_vector, unique_sentence_vector) / (np.linalg.norm(sentence_vector) * np.linalg.norm(unique_sentence_vector))
                    if similarity > 0.9:  # Пороговое значение для косинусного расстояния
                        similar_found = True
                        break

                # Если похожего предложения нет в уникальных предложениях, добавляем его
                if not similar_found:
                    unique_sentences.add(sentence)

    # Запись уникальных предложений в новый файл
    with open(output_file, 'w', encoding='utf-8') as output:
        for sentence in unique_sentences:
            output.write(sentence + '\n')

# Путь к файлу, который вы хотите обработать
file_path = "questions.txt"  # Замените "example.txt" на путь к вашему файлу
# Путь к файлу, в который вы хотите записать уникальные предложения
output_file = "questions_new.txt"  # Замените "unique_sentences.txt" на путь к новому файлу

# Получить уникальные предложения из файла и записать их в новый файл
filter_sentences(file_path, output_file)

print("Уникальные предложения записаны в файл:", output_file)