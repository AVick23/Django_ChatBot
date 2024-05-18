import sqlite3
import spacy
from rank_bm25 import BM25Okapi

# Загрузка языковой модели Spacy
nlp = spacy.load('ru_core_news_lg')

db_path = "university.sqlite"


def save_question_to_db(question_text, user_id):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO questions (user_id, question) VALUES (?, ?)", (user_id, question_text))
    conn.commit()
    conn.close()

def search_similar_questions(question_text):
    similar_questions = []

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("SELECT DISTINCT question_id FROM answers")
    answered_question_ids = [row[0] for row in cursor.fetchall()]

    # Создание списка текстов вопросов для обучения BM25
    questions_corpus = []
    for question_id in answered_question_ids:
        cursor.execute("SELECT question FROM questions WHERE id = ?", (question_id,))
        answered_question_text = cursor.fetchone()[0]
        questions_corpus.append(answered_question_text)

    # Инициализация и обучение модели BM25
    bm25 = BM25Okapi(questions_corpus)

    # Применение языковой модели к входному вопросу
    question_doc = nlp(question_text)

    # Вычисление весов BM25 для каждого вопроса в базе данных
    scores = bm25.get_scores(question_doc.text.lower().split())

    # Сортировка идентификаторов вопросов по убыванию весов
    ranked_question_ids = [x for _, x in sorted(zip(scores, answered_question_ids), reverse=True)]

    # Получение текста похожих вопросов в соответствии с ранжированными идентификаторами
    for question_id in ranked_question_ids:
        cursor.execute("SELECT question FROM questions WHERE id = ?", (question_id,))
        answered_question_text = cursor.fetchone()[0]
        similar_questions.append(answered_question_text)

    conn.close()

    return similar_questions

def get_answer_for_question(question_text):
    with sqlite3.connect(db_path) as con:
        sql = con.cursor()
        sql.execute("SELECT id FROM questions WHERE question = ?", (question_text,))
        question_id = sql.fetchone()
        if question_id:
            question_id = question_id[0]
            sql.execute("SELECT answer FROM answers WHERE question_id = ?", (question_id,))
            answer = sql.fetchone()
            if answer:
                return answer[0]
    return None