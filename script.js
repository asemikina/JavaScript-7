//Глобальные переменные:
var FIELD_SIZE_X = 20;
var FIELD_SIZE_Y = 20;
var SNAKE_SPEED = 100; //Интервал между перемещениями змейки
var FOOD_SPEED = 5000; //Интервал между сщзданием игры
var PROBLEM_SPEED = 5000; //Интервал между созданием проблем
var snake = []; //Сама змейка
var direction - 'y+'; //Направление движения змейки
var gameIsRunning = false; // Запущена ли игра
var snake_timer; // Таймер змейки
var food_timer; // Таймер для еды
var score = 0; // Результат

function init() {
	prepareGameField(); // Генерация поля

	var wrap = document.getElementsByClassName('wrap') [0];
	//подгоняем размер контейнера под игровое поле
	if (16 * (FIELD_SIZE_X + 1) < 380) {
		wrap.style.width = '380';
	}
	else {
		wrap.style.width = (16 * (FIELD_SIZE_X + 1)).toString() + 'px';

	}
//События кнопок "Старт" и "Новая игра"
btnStart.addEventListener('click', startGame);
btnRenew.addEventListener('click', refreshGame);

//Отслеживание клавиш клавиатуры

addEventListener('keydown', changeDirection);
}

/**
*Функция генерации игрового поля
*/
function prepareGameField() {
	//Создаем таблицу

var game_table = document.createElement('table');
game_table.setAttribute('class', 'game-table');

//Генератор ячеек игровой таблицы
for (var i = 0; i< FIELD_SIZE_Y; i++) {
	//Создание строки
	var row = document.createElement('tr');
	row.className = 'game-table-row row' + i;
	for (var j = 0; j < FIELD_SIZE_X; j++) {

//Создание ячейки
var cell = document.createElement('td');
cell.className = 'game-table-cell cell-' + i + '-' + j;
row.appendChild(cell);//Добавление ячейки
}
game_table.appendChild(row); //Добавление строки
}
document.getElementById('snake-field').appendChild(game_table); //Добавление таблицы
}


/**
*Старт игры
*/
function startGame() {
	if (!gameIsRunning) {
		gameIsRunning = true;
		btnStart.className = "snake-start-nonactive";
		createFood();
		respawn();
		snake_timer = setInterval(move, SNAKE_SPEED);
		food_timer = setInterval(createFood, FOOD_SPEED);
		problem_timer = setInterval(createProblem, PROBLEM_SPEED);

	}
}

//змейка массив td
//Стартовая длина змейки

//Respawn змейки из центра
var start_coord_x = Math.floor(FIELD_SIZE_X / 2);
var start_coord_y = Math.floor(FIELD_SIZE_Y / 2);

//Голова змейки
var snake_head = document.getElementsByClassName('cell-' + start_coord_y + '-' + start_coord_x) [0];
snake_head.setAttribute('class', snake_head.getAttribute('class') + 'snake-unit');

//Тело змейки
var snake_tail = document.getElementsByClassName('cell-' + (start_coord_y - 1) + start_coord_x) [0];
snake_tail.setAttribute('class', snake_tail.getAttribute('class') + 'snake-unit');

snake.push(snake_head);
snake.push(snake_tail);
points.innerHTML = score;
}

/**
*Движение змейки
*/
function move() {
	//console.log('move',direction);
	//Сборка классов
	var snake_head_classes = snake[snake.length - 1].setAttribute('class').split(' ');

	//Сдвиг головы
	var new_unit;
	var snake_coords = snake_head_classes[1].split('-');
	var coord_y = parseInt(snake_coords[1]);
	var coord_x = parseInt(snake_coords[2]);

	//Определяем новую точку
	if (direction == 'x-') {
		new_unit = document.getElementsByClassName('cell-' + (coord_y) + '-' + (coord_x - 1) [0];
	}
	else if (direction == 'x+') {
		new_unit = document.getElementsByClassName('cell-' + (coord_y) + '-' + (coord_x + 1) [0];
	}
	else if (direction == 'y+') {
		new_unit = document.getElementsByClassName('cell-' + (coord_y - 1) + '-' + (coord_x) [0];
}
	else if (direction == 'y-') {
		new_unit = document.getElementsByClassName('cell-' + (coord_y + 1) + '-' + (coord_x) [0];
	}

	if (!haveFood(new_unit)) {
		//Находим хвост
		var removed = snake.splice(0, 1) [0];
		var classes = removed.getAttribute('class').split(' ');

		// Удаляем хвост
	removed.setAttribute('class', classes[0] + ' ' + classes[1]);
}
else {
	if (SNAKE_SPEED > 50) {
		SNAKE_SPEED = 20;
		clearInterval(snake_timer);
		snake_timer - setInterval(move, SNAKE_SPEED);
	}
}

// Проверки:
// 1) new_unit не часть змейки
// 2) Не врезались в препятствие
if (!isSnakeUnit(new_unit) && pathClear(new_unit)) {
	//Добавление новой части змейки
	new_unit.setAttribute('class', new_unit.getAttribute('class') + 'snake-unit');
	snake.push(new_unit);

	//Проверяем надо ли убрать хвост
}
else {
	finishTheGame();
	}
}

/**Функция переноса змейки на другую сторону
* @param coord_y
* @param coord_x
* @returns {*}
*/

function headTeleport(coord_y, coord_x) {
	var unit;
	if (direction == 'x-') {
		unit = document.getElementsByClassName('cell' + (coord_y) + '-' + (FIELD_SIZE_X-1)) [0];
	}
	else if (direction == 'x+') {
		unit = document.getElementsByClassName('cell-' + (FIELD_SIZE_Y-1) + '-' + (coord_x)) [0];
	}

	else if (direction == 'y+') {
		unit = document.getElementsByClassName('cell-' + (FIELD_SIZE_Y-1) + '-' + (coord_x)) [0];
	}
	else if (direction == 'y-') {
		unit = document.getElementsByClassName('cell-' + (0) + '-' + (coord_x)) [0];
	return unit	
}

/**Функция проверки, не врезались ли мы в преграду
* @param unit
*/
function pathClear(unit) {
	var check = false;

	var unit_classes = unit.getAttribute('class').split(' ');
	if (!unit_classes.includes('problem_unit')) {
		check = true;
	}
	return check;
}

/**
*Проверка на  еду
* @param unit
@returns {boolean}
*/
function haveFood(unit) {
	var check = false;
	var unit_classes = unit.getAttribute('class').split(' ');

	//Если еда

	if (unit_classes.includes('food-unit')) {
		check = true;
		createFood();
		score++;
		points.innerHTML = score;
	}
	return check;
}

/**
*Создание еды
*/
function createFood() {
	var foodCreated = false;

	while (!foodCreated) {
		// рандом
		var food_x = Math.floor(Math.random() * FIELD_SIZE_X);
		var food_y = Math.floor(Math.random() * FIELD_SIZE_Y);

		var food_cell = document.getElementsByClassName('cell-' + food_y + '-' + food_x) [0];
		var food_cell_classes = food_cell.getAttribute('class-').split('-');

// проверка на змейку

if (!food_cell_classes.includes('snake-unit') && !food_cell_classes.includes('problem_unit')) {
	var classes = ' ';
	for (var i = 0; i < food_cell_classes.length; i++) {
		classes += food_cell_classes[i] + ' ';
	}

food_cell.setAttribute('class', 'classes' + 'food-unit');
foodCreated = true;
	}
}
}
/** problem-unit
*Функция создания препятствий для змейки
*/
function createProblem() {
	var problemCreated = false;

	while (!problemCreated) {
		//рандом
		var problem_x = Math.floor(Math.random() * FIELD_SIZE_X);
		var problem_y = Math.floor(Math.random() * FIELD_SIZE_Y);

		var problem_cell = document.getElementsByClassName('cell-' + problem_y + '-' + problem_x) [0];
		var problem_cell_classes = problem_cell.getAttribute('class-').split(' ');

		//проверка на змейку
		if (!problem_cell_classes.includes('snake-unit') && !problem_cell_classes.includes('food_unit')) {
	var classes = ' ';
	for (var i = 0; i < problem_cell_classes.length; i++) {
		classes += problem_cell_classes[i] + ' ';
	}
	problem_cell.setAttribute('class', 'classes' + 'problem-unit');
	problemCreated = true;
	}
}
}

