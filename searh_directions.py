import sqlite3
db_path = "university.sqlite"


# Здесь вы можете вызвать функцию поиска направлений, которую вы определили ранее,
def search_directions_strict(area, subjects, form):
    with sqlite3.connect(db_path) as con:
        cursor = con.cursor()

        # Если subjects является списком, преобразуйте элементы в строку с разделителем ','
        if isinstance(subjects, list):
            subjects = ','.join(subjects)

        subjects_escaped = subjects.replace('%', r'\\%').replace('_', r'\\_')

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

        if isinstance(subjects, str):
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
    
def get_direction_data(direction):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT * FROM Info WHERE Direction LIKE ?;
        """, (f'%{direction}%',))

        direction_data = cursor.fetchone()
        url = "https://donstu.ru/about/3d/"
        url_direction = "https://new.donstu.ru/abiturient/napravleniya/"

        if direction_data:
            direction_info = (
                f"Название программы: \n{direction_data[1]}\n\n"
                f"Информация о руководителе: \n{direction_data[3]}\n\n"
                f"Стоимость обучения в год: \n{direction_data[6]} руб.\n\n"
                f"Форма обучения: \n{direction_data[5]}\n\n"
                f"Количество бюджетных мест: \n{direction_data[8]}\n\n"
                f"Уровень обучения: \n{direction_data[9]}\n\n"
                f"Продолжительность обучения: \n{direction_data[7]} год(а)\n\n"
                f"Предметы: \n{direction_data[10]}\n\n"
                f"Полное описание всегда можно посмотреть на сайте: {url_direction}\n\n "
                f"3D-тур по корпусу ДГТУ: \n{url}"
            )

            return direction_info
        else:
            return "Информация о выбранном направлении отсутствует."
    finally:
        conn.close()