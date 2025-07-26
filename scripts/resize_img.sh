#!/bin/bash

# === resize_slides.sh ===

# Префикс и суффикс имени файлов
PREFIX="slide-"
SUFFIX=".jpg"

# Проверка наличия ImageMagick (convert)
if ! command -v convert &> /dev/null
then
    echo "Ошибка: ImageMagick (команда 'convert') не найдена. Пожалуйста, установите ImageMagick."
    exit 1
fi

# Цикл от 1 до 16
for i in {1..16}
do
  # Форматируем номер с ведущим нулем (01, 02, ...)
  NUMBER=$(printf "%02d" $i)
  
  # Формируем имя исходного файла
  INPUT_FILE="${PREFIX}${NUMBER}${SUFFIX}"
  
  # Проверяем, существует ли файл
  if [ ! -f "$INPUT_FILE" ]; then
    echo "Предупреждение: Файл $INPUT_FILE не найден. Пропускаем."
    continue
  fi
  
  # Формируем имя выходного файла (можно изменить суффикс, например, добавить _resized)
  # OUTPUT_FILE="${PREFIX}${NUMBER}_resized${SUFFIX}" # Вариант с новым именем
  OUTPUT_FILE="$INPUT_FILE" # Вариант с перезаписью оригинала (ОПАСНО!)

  # --- ВАЖНО: Выберите один из вариантов OUTPUT_FILE выше ---
  # ВАРИАНТ 1 (рекомендуется для теста): Создать новый файл
  # OUTPUT_FILE="${PREFIX}${NUMBER}_small${SUFFIX}"
  # ВАРИАНТ 2 (опасно): Перезаписать оригиналы. Раскомментируйте следующую строку, если это нужно.
  # echo "ВНИМАНИЕ: Будут перезаписаны оригинальные файлы!"
  # read -p "Вы уверены? (y/N): " -n 1 -r
  # echo
  # if [[ ! $REPLY =~ ^[Yy]$ ]]
  # then
  #     echo "Отменено пользователем."
  #     exit 0
  # fi

  # Для безопасности по умолчанию создаем файл с суффиксом _small
  OUTPUT_FILE="${PREFIX}${NUMBER}_small${SUFFIX}"

  echo "Обработка $INPUT_FILE -> $OUTPUT_FILE"
  
  # Выполняем команду convert для уменьшения размера
  convert "$INPUT_FILE" -resize 50% "$OUTPUT_FILE"
  
  # Проверяем успешность выполнения
  if [ $? -eq 0 ]; then
    echo "  Успешно."
  else
    echo "  Ошибка при обработке $INPUT_FILE."
  fi
done

echo "Готово."
