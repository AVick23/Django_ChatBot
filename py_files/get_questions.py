import sqlite3
import spacy
from scipy.spatial.distance import cosine

nlp = spacy.load('ru_core_news_lg')

db_path = "university.sqlite"

def request_db(query, data=None):
    con = sqlite3.connect(db_path)
    cur = con.cursor()
    try:
        if data is not None:
            res = cur.execute(query, (data,))
        else:
            res = cur.execute(query)
    except sqlite3.ProgrammingError:
        if data is not None:
            res = cur.execute(query, data)
        else:
            res = cur.execute(query)
    result = res.fetchall()
    if "INSERT" in query or "UPDATE" in query:
        con.commit()
    con.close()
    return result


def get_unresolved_questions(similarity_threshold=0.70):
    
    connection = sqlite3.connect(db_path)
    cursor = connection.cursor()

    # Извлечение вопросов, у которых нет ответов
    cursor.execute("""
        SELECT id, question
        FROM questions
        LEFT JOIN answers ON questions.id = answers.question_id
        WHERE answers.question_id IS NULL
    """)
    unresolved_questions = cursor.fetchall()

    # Фильтрация вопросов с использованием векторных представлений
    filtered_questions = []

    for question_id, question_text in unresolved_questions:
        is_unique = True
        question_vector = nlp(question_text).vector
        for _, existing_question_text in filtered_questions:
            existing_vector = nlp(existing_question_text).vector
            similarity = 1 - cosine(question_vector, existing_vector)
            if similarity >= similarity_threshold:
                is_unique = False
                break

        if is_unique:
            filtered_questions.append((question_id, question_text))

    connection.close()
    return filtered_questions

def reg_answer(question_id, answer_text):
    query = """
        INSERT INTO answers
        (question_id, answer)
        VALUES
        (?, ?)
    """
    values = [question_id, answer_text]
    request_db(query, values)