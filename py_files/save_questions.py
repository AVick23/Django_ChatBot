import sqlite3

db_path = "university.sqlite"


def save_question_to_db(question_text, user_id):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO questions (user_id, question) VALUES (?, ?)", (user_id, question_text))
    conn.commit()
    conn.close()

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