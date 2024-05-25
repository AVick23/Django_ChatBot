import spacy
from rank_bm25 import BM25Okapi
import numpy as np

# Загрузка языковой модели
nlp = spacy.load("ru_core_news_lg")

def train_word_vectors(sentences):
    # Функция для обучения векторных представлений слов
    word_vectors = []
    for sentence in sentences:
        doc = nlp(sentence)
        vectors = [token.vector for token in doc if not token.is_stop and token.is_alpha]
        if vectors:
            sentence_vector = np.mean(vectors, axis=0)
            word_vectors.append(sentence_vector)
    return word_vectors

def filter_sentences(file_path, output_file):
    # Функция для фильтрации уникальных предложений
    unique_sentences = set()

    with open(file_path, 'r', encoding='utf-8') as file:
        sentences = [line.strip() for line in file if line.strip()]
        bm25 = BM25Okapi(sentences)
        word_vectors = train_word_vectors(sentences)

        for sentence in sentences:
            if sentence not in unique_sentences:
                unique_sentences.add(sentence)
            else:
                query = sentence.split()
                bm25_scores = bm25.get_scores(query)
                max_score = max(bm25_scores)
                if max_score > 15:
                    continue

                sentence_vector = np.mean(train_word_vectors([sentence]), axis=0)

                similar_found = False
                for unique_sentence in unique_sentences:
                    unique_sentence_vector = np.mean(train_word_vectors([unique_sentence]), axis=0)
                    similarity = np.dot(sentence_vector, unique_sentence_vector) / (np.linalg.norm(sentence_vector) * np.linalg.norm(unique_sentence_vector))
                    if similarity > 0.7:
                        similar_found = True
                        break

                if not similar_found:
                    unique_sentences.add(sentence)

    with open(output_file, 'w', encoding='utf-8') as output:
        for sentence in unique_sentences:
            output.write(sentence + '\n')