all_majors = [
    "Математические и естественные науки",
    "Инженерное дело, технологии и технические науки",
    "Здравоохранение и медицинские науки",
    "Сельское хозяйство и сельскохозяйственные науки",
    "Науки об обществе",
    "Образования и педагогические науки",
    "Гуманитарные науки",
    "Исскуства и культура"
]

all_subjects = [
    "Биология", "География", "Иностранный язык", "Информатика", "История", "Клаузура", "Литература", "Математика",
    "Музыкальное искусство эстрады", "Обществознание", "Основы медиа", "Рисунок", "Русский язык", "Собеседование",
    "Специальная графика", "Специальный предмет", "Физика", "Физическая подготовка", "Химия", "Художественное творчество"
]

form_list = ["Очная форма", "Заочная форма", "Очно-заочная форма"]

all_payment_options = ["Бюджет", "Коммерция"]

all_search_types = ["Строгий", "Гибкий"]


import sqlite3
db_path = "university.sqlite"

def search_directions_strict(area, subjects, form):
    with sqlite3.connect(db_path) as con:
        cursor = con.cursor()

        subjects_escaped = subjects.replace('%', r'\%').replace('_', r'\_')

        params = {
            'chosen_major': area,
            'education_form': form,
            'subjects': f'%{subjects_escaped}%'
        }

        cursor.execute("""
            SELECT Direction
            FROM Info
            WHERE Direction IN (
                SELECT Direction
                FROM Info
                WHERE AreasEdu = :chosen_major
                    AND Form = :education_form
            )
            AND Tests LIKE :subjects
        """, params)

        matching_directions = cursor.fetchall()

        matching_directions = [row[0] for row in matching_directions]

        return matching_directions

def search_directions_flexible(area, subjects, form):
    with sqlite3.connect(db_path) as con:
        cursor = con.cursor()

        subjects = subjects.split()
        subjects_escaped = [subject.replace('%', r'\%').replace('_', r'\_') for subject in subjects]

        params = {
            'chosen_major': area,
            'education_form': form,
        }

        query = """
            SELECT Direction
            FROM Info
            WHERE Direction IN (
                SELECT Direction
                FROM Info
                WHERE AreasEdu = :chosen_major
                    AND Form = :education_form
            )
        """

        for i, subject in enumerate(subjects_escaped):
            param_name = f'subject{i}'
            params[param_name] = f'%{subject}%'
            if i == 0:
                query += f"AND (Tests LIKE :{param_name} "
            else:
                query += f"OR Tests LIKE :{param_name} "

        query += ")"

        cursor.execute(query, params)

        matching_directions = cursor.fetchall()

        matching_directions = [row[0] for row in matching_directions]

        return matching_directions
