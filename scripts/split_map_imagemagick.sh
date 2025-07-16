# Удаляем предыдущие части, если они есть
rm -f src/assets/map_part*.png

# Часть 1 (от 0 до 2048)
convert src/assets/map.png -crop 2048x2944+0+0 src/assets/map_part1.png

# Часть 2 (от 2048 до 4096)
convert src/assets/map.png -crop 2048x2944+2048+0 src/assets/map_part2.png

# Часть 3 (оставшиеся 640 пикселей, от 4096 до 4736)
convert src/assets/map.png -crop 640x2944+4096+0 src/assets/map_part3.png