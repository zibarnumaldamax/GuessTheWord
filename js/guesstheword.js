let difficultyEasy = ["cat", "dog", "net", "hat", "tag", "bike", "duck", "gold", "king", "leaf"];
let difficultyMedium = ["array", "apple", "clock", "fruit", "paper", "circle", "badger", "castle", "island", "summer"];
let difficultyHard = ["airport", "battery", "element", "message", "penguin", "concrete", "building", "employee", "incident", "portrait"];
let difficultyLevel;

if (confirm("Хотите сыграть в угадай слово?")) {
    while(true){
        let difficulty = prompt("Введите уровень сложности: л - легкий, с - средний, т - тяжелый");
        difficulty = difficulty.toLowerCase();
    if (difficulty == "л"){
        guessArray = difficultyEasy;
        difficultyLevel = "Легкий";
        break;
    } else if (difficulty == "с"){
        guessArray = difficultyMedium;
        difficultyLevel = "Средний";
        break;
    } else if (difficulty == "т"){
        guessArray = difficultyHard;
        difficultyLevel = "Тяжелый";
        break;
    } else if (difficulty == null) {
        break;
    } else {
        alert("Неверный ввод, попробуйте еще раз.");
    }
    }

    let stats = [0, 0];
    let info = [];
    let maxRounds = guessArray.length;
    let roundCount = 0;

    for (let i = 1; i <= maxRounds; i++){
        round(guessArray, difficultyLevel, stats, info, roundCount);
        roundCount = roundCount + 1;
        if (guessArray.length == 0){
            break;
        }
        if (confirm("Играть еще раунд?")){
            continue;
        } else {
            break;
        }
    }

    if (stats[0] <= stats [1]){
        alert("Игра закончена!"  + "\r\n" +
            "Вы играли на сложности: " + difficultyLevel + "\r\n" +
            "Вы угадали " + stats[0] + " и не угадали " + stats[1] + " слов" + "\r\n" +
            "Молодец! В следующий раз получится лучше!"); 
    } else {        
        alert("Игра закончена!"  + "\r\n" +
            "Вы играли на сложности: " + difficultyLevel + "\r\n" +
            "Вы угадали " + stats[0] + " и не угадали " + stats[1] + " слов" + "\r\n" +
            "Молодец! Это победа!"); 
    } 
} else {
    alert("Ну как хотите.");
}

function round(guessArray, difficultyLevel, stats, info, roundCount){
    let random = Math.random()*guessArray.length;
    let wordToGuess = guessArray[Math.floor(random)];
    info[roundCount] = {
        word: wordToGuess,
        win: "нет",
        time: 0
    };
    let wordToGuessArray = wordToGuess.split("");
    let hiddenArray = wordToGuess.replace(/[a-z]/g, "*").split("");
    let RegExp = /^[a-zA-Z]{1,8}$/;
    let i = 1;
    let maxI = (difficultyLevel == "Легкий") ? 4 :
        (difficultyLevel == "Средний") ? 5 :
        (difficultyLevel == "Тяжелый") ? 6 : 4;
    let guesses = [];
    let guessesCount = 0;
    let win = false;
    let start = Date.now();
    while(i < maxI){
        let guess = prompt("Осталось попыток: " + (maxI - i) + "\r\n" +
                            "Загадано слово из " + hiddenArray.length + " букв" + "\r\n" +
                            "Вы пробовали: " + guesses.toString() + "\r\n" +
                            hiddenArray.join("") + "\r\n" + 
                            "Введите букву, или угадайте слово:");
        if (guess == null){
            alert("Раунд закончен досрочно.");
            return;
        }
        guess = guess.toLowerCase();
        if (guess == wordToGuess){
            alert("Вы угадали слово! " + wordToGuess);
            win = true;
            break;
        } else if (guess.length == wordToGuess.length && guess != wordToGuess && RegExp.test(guess)) {
            alert("Это неправильное слово.");
            if (letterFound(hiddenArray)){
                i = i + 1;
            }
            guesses[guessesCount] = guess; 
            guessesCount = guessesCount + 1;
            continue;
        } else if (guess.length == 1 && RegExp.test(guess)) {
            for (let j = 0; j <= hiddenArray.length; j++){
                if(wordToGuessArray[j] == guess){
                    hiddenArray[j] = guess;
                }     
            }
            if (hiddenArray.join("") == wordToGuess){
                alert("Вы угадали слово! " + wordToGuess);
                win = true;
                break;        
            } else if (hiddenArray.includes(guess)){
                alert("Вы угадали букву: " + guess + "\r\n" +
                        hiddenArray.join("")) 
                continue;
            } else {
                alert("Такой буквы нет");
                if (letterFound(hiddenArray)){
                    i = i + 1;
                }
                guesses[guessesCount] = guess; 
                guessesCount = guessesCount + 1;
                continue;
            }
        } else {
            alert("Неверный ввод");
            continue;
        }
    }
    let end = Date.now();
    guessArray.splice(Math.floor(random), 1);
    info[roundCount].time = (end - start);
    win? (stats[0] = stats[0] + 1, info[roundCount].win = "да") : (stats[1] = stats[1] + 1, info[roundCount].win = "нет");
    info.sort(compareTime);
    info.sort(compareWin);
    alert("Раунд закончен! Вы " + (win? "Победили!" : "Проиграли!")  + "\r\n" +
            "Сложность: " + difficultyLevel + "\r\n" +
            "Загаданное слово было: " + wordToGuess + "\r\n" +
            "У вас " + stats[0] + " побед и " + stats[1] + " поражений" + "\r\n" +
            "Раунд занял: " + Math.floor((end - start)/1000) + " секунд" + "\r\n" + "\r\n" +
            "Слово  |  Угадал  |  Длительность" + "\r\n" + 
            printInfo(info)); 
}

function printInfo(info){
    let string = "";
    for (let rnd of info){
        string = string + rnd.word + "   |    " + rnd.win + "    |   " + 
        timeFormat(rnd.time) + "\r\n";
    }
    return string;
}

function timeFormat(time){
    dateObj = new Date(time);
    hours = dateObj.getUTCHours();
    minutes = dateObj.getUTCMinutes();
    seconds = dateObj.getSeconds();

    return hours.toString().padStart(2, '0') + ':' + 
    minutes.toString().padStart(2, '0') + ':' + 
    seconds.toString().padStart(2, '0');
}

function compareTime(a, b) {
	if (a.time > b.time) return 1;
	if (a.time == b.time) return 0;
	if (a.time < b.time) return -1;
}

function compareWin(a, b) {
	if (a.win > b.win) return 1;
	if (a.win == b.win) return 0;
	if (a.win < b.win) return -1;
}

function letterFound(arr){
    let match = /[a-z]/g ;
    for(let i = 0 ; i < arr.length ; i++)
    {
    if(match.test(arr[i]))
    {
        return true;
    }
}
}