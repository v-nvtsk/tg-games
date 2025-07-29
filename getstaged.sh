#!/bin/bash

# === get_staged_code.sh ===

# Имя выходного файла
OUTPUT_FILE="staged_code_for_review.txt"

# Проверка, находится ли Git репозиторий в порядке
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "Ошибка: Не найден Git репозиторий в текущей или родительских директориях."
    exit 1
fi

# Получаем список файлов, находящихся в staged (INDEX)
# Используем --cached для staged, --name-only для получения только имен файлов
STAGED_FILES=$(git diff --cached --name-only)

# Проверяем, есть ли staged файлы
if [ -z "$STAGED_FILES" ]; then
    echo "Нет файлов в состоянии 'staged' (INDEX)."
    # Создаем пустой файл или можно выйти
    touch "$OUTPUT_FILE"
    echo "Создан пустой файл: $OUTPUT_FILE"
    exit 0
fi

# Начинаем запись в файл
{
    echo "========================="
    echo "Список файлов в 'staged':"
    echo "========================="
    echo "$STAGED_FILES"
    echo ""
    echo "========================="
    echo "Содержимое файлов:"
    echo "========================="
} > "$OUTPUT_FILE"

# Проходим по каждому staged файлу
echo "$STAGED_FILES" | while IFS= read -r file; do
    # Проверяем, существует ли файл (он может быть удален)
    if [ -f "$file" ]; then
        echo "=========================" >> "$OUTPUT_FILE"
        echo "Файл: $file" >> "$OUTPUT_FILE"
        echo "=========================" >> "$OUTPUT_FILE"
        cat "$file" >> "$OUTPUT_FILE"
        echo -e "\n\n" >> "$OUTPUT_FILE" # Добавляем пару пустых строк между файлами
    else
        # Файл мог быть удален (deleted)
        echo "=========================" >> "$OUTPUT_FILE"
        echo "Файл (удален): $file" >> "$OUTPUT_FILE"
        echo "=========================" >> "$OUTPUT_FILE"
        echo "[Файл отсутствует в рабочей директории, возможно, был удален]" >> "$OUTPUT_FILE"
        echo -e "\n\n" >> "$OUTPUT_FILE"
    fi
done

echo "Содержимое staged файлов успешно сохранено в '$OUTPUT_FILE'"
