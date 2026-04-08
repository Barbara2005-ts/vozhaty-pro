// ---------- КОНФИГУРАЦИЯ ИГРЫ ----------
const categories = [
    "Нормативно-правовые основы",
    "Психолого-педагогические основы",
    "Организация жизнедеятельности ВДК",
    "Технологии работы вожатого",
    "Основы безопасности"
];

const questionsData = [
    [   // Нормативно-правовые основы
        "С какого возраста гражданин РФ может быть принят на работу вожатым в детский лагерь (без опыта работы)?",
        "Какой документ является основным международным актом, гарантирующим права ребенка?",
        "Как называется документ, в котором ежедневно фиксируется количество детей в отряде, отметки о проведенных мероприятиях и происшествиях?",
        "Какая максимальная продолжительность рабочего времени для вожатого (несовершеннолетнего 16-18 лет) в день по Трудовому кодексу РФ?"
    ],
    [   // Психолого-педагогические основы
        "Как называется период смены, когда дети начинают проверять вожатого «на прочность», нарушать дисциплину?",
        "Какой тип темперамента характеризуется высокой подвижностью, склонностью к лидерству, но при этом быстрой сменой настроения?",
        "Назовите 3 стадии развития коллектива по А.С. Макаренко (можно кратко).",
        "Вожатый заметил, что один из детей систематически игнорируется отрядом. Как называется такое явление и первые шаги вожатого?"
    ],
    [   // Организация жизнедеятельности ВДК
        "Как называется графическое изображение мероприятий на смену?",
        "Назовите главный орган детского самоуправления в лагере.",
        "Какой метод сбора отряда предполагает объявление «Вечернего огонька» и анализ дня?",
        "Перечислите 4 этапа организационного периода смены (по А.И. Тимонину)."
    ],
    [   // Технологии работы вожатого
        "Что в лагерной терминологии означает аббревиатура «КТД»?",
        "Какая игра лучше всего подходит для знакомства в первый день, если в автобусе едет 40 детей?",
        "Назовите 3 типа линеек, которые проводятся в лагере.",
        "Расположите в правильной последовательности этапы подготовки КТД: А) Проведение дела; Б) Коллективное планирование; В) Разведка дел и идей; Г) Анализ (огонек); Д) Подготовка (распределение поручений)."
    ],
    [   // Основы безопасности
        "Какой номер телефона экстренных служб (для мобильных телефонов) в РФ?",
        "Какова первая помощь при солнечном ударе? (основные действия)",
        "Что вожатый должен сделать в первую очередь, если ребенок потерялся во время экскурсии за территорией лагеря?",
        "Вожатый увидел, что у ребенка начался эпилептический припадок (судороги). Опишите алгоритм действий (можно и нельзя)."
    ]
];

const values = [10, 20, 30, 40];

// Доступные эмодзи для выбора
const availableEmojis = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🐴", "🦋", "🐝", "🐙", "🦄", "⭐", "🔥", "⚡", "🌈", "🍕", "🎮", "⚽", "🎸", "🚀"];

// ---------- СОСТОЯНИЕ ИГРЫ ----------
let teams = [
    { name: "Команда 🔴", score: 0, emoji: "🔴" },
    { name: "Команда 🟢", score: 0, emoji: "🟢" },
    { name: "Команда 🔵", score: 0, emoji: "🔵" }
];
let activeTeamIdx = 0;
let usedQuestions = [];

let currentQuestionCat = null;
let currentQuestionRow = null;
let currentQuestionValue = null;

// ---------- ЭКРАН НАСТРОЙКИ ----------
function renderSetupScreen() {
    const container = document.getElementById("teamsSetup");
    container.innerHTML = "";
    
    const defaultNames = ["Красные", "Зелёные", "Синие"];
    const defaultEmojis = ["🔴", "🟢", "🔵"];
    
    for (let i = 0; i < 3; i++) {
        const teamCard = document.createElement("div");
        teamCard.className = "team-setup-card";
        teamCard.innerHTML = `
            <h3>Команда ${i + 1}</h3>
            <input type="text" class="team-name-input" id="teamName${i}" placeholder="Название команды" value="${defaultNames[i]}">
            <div class="emoji-selector" id="emojiSelector${i}"></div>
        `;
        container.appendChild(teamCard);
        
        // Добавляем эмодзи для выбора
        const emojiContainer = document.getElementById(`emojiSelector${i}`);
        availableEmojis.forEach(emoji => {
            const emojiDiv = document.createElement("div");
            emojiDiv.className = `emoji-option ${emoji === defaultEmojis[i] ? "selected" : ""}`;
            emojiDiv.innerText = emoji;
            emojiDiv.addEventListener("click", () => {
                // Убираем выделение у всех эмодзи в этой команде
                document.querySelectorAll(`#emojiSelector${i} .emoji-option`).forEach(el => {
                    el.classList.remove("selected");
                });
                emojiDiv.classList.add("selected");
            });
            emojiContainer.appendChild(emojiDiv);
        });
    }
}

function getSelectedEmoji(teamIndex) {
    const selected = document.querySelector(`#emojiSelector${teamIndex} .emoji-option.selected`);
    return selected ? selected.innerText : (teamIndex === 0 ? "🔴" : teamIndex === 1 ? "🟢" : "🔵");
}

function getTeamName(teamIndex) {
    const input = document.getElementById(`teamName${teamIndex}`);
    let name = input.value.trim();
    if (name === "") {
        name = teamIndex === 0 ? "Красные" : teamIndex === 1 ? "Зелёные" : "Синие";
    }
    return name;
}

function startGame() {
    // Собираем данные команд
    for (let i = 0; i < 3; i++) {
        const emoji = getSelectedEmoji(i);
        const name = getTeamName(i);
        teams[i] = {
            name: `${emoji} ${name}`,
            score: 0,
            emoji: emoji
        };
    }
    
    // Сбрасываем игровое состояние
    activeTeamIdx = 0;
    initUsed();
    
    // Переключаем экраны
    document.getElementById("setupScreen").style.display = "none";
    document.getElementById("gameScreen").style.display = "block";
    
    // Отрисовываем игровой интерфейс
    renderScoreboard();
    renderBoard();
}

// ---------- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ----------
function initUsed() {
    usedQuestions = Array(5).fill().map(() => Array(4).fill(false));
}

// Подсчёт количества оставшихся вопросов
function getRemainingQuestionsCount() {
    let count = 0;
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 4; j++) {
            if (!usedQuestions[i][j]) count++;
        }
    }
    return count;
}

// Показать результаты (победителей)
function showResults() {
    // Сортируем команды по баллам (по убыванию)
    const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
    
    const resultsModal = document.getElementById("resultsModal");
    const resultsList = document.getElementById("resultsList");
    resultsList.innerHTML = "";
    
    sortedTeams.forEach((team, idx) => {
        const place = idx + 1;
        let placeIcon = "";
        let placeClass = "";
        
        if (place === 1) {
            placeIcon = "🥇";
            placeClass = "place-1";
        } else if (place === 2) {
            placeIcon = "🥈";
            placeClass = "place-2";
        } else if (place === 3) {
            placeIcon = "🥉";
            placeClass = "place-3";
        } else {
            placeIcon = "📌";
            placeClass = "";
        }
        
        const resultItem = document.createElement("div");
        resultItem.className = `result-item ${placeClass}`;
        resultItem.innerHTML = `
            <span class="place-icon">${placeIcon}</span>
            <span class="result-name">${team.name}</span>
            <span class="result-score">${team.score} баллов</span>
        `;
        resultsList.appendChild(resultItem);
    });
    
    resultsModal.style.display = "flex";
}

// Проверка на завершение игры
function checkGameComplete() {
    if (getRemainingQuestionsCount() === 0) {
        showResults();
        return true;
    }
    return false;
}

// ---------- ОТРИСОВКА ИНТЕРФЕЙСА ----------
function renderScoreboard() {
    const container = document.getElementById("scoreboard");
    container.innerHTML = "";
    teams.forEach((team, idx) => {
        const card = document.createElement("div");
        card.className = `team-card ${idx === activeTeamIdx ? "active-team" : ""}`;
        card.innerHTML = `
            <div class="team-name">${team.name}</div>
            <div class="team-score">${team.score} баллов</div>
            <div class="score-controls">
                <button data-team="${idx}" data-delta="-10" class="team-modify">-10</button>
                <button data-team="${idx}" data-delta="10" class="team-modify">+10</button>
                <button data-team="${idx}" data-delta="25" class="team-modify">+25</button>
            </div>
        `;
        container.appendChild(card);
    });
    
    document.querySelectorAll(".team-modify").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const teamId = parseInt(btn.dataset.team);
            const delta = parseInt(btn.dataset.delta);
            teams[teamId].score = Math.max(0, teams[teamId].score + delta);
            renderScoreboard();
        });
    });
}

function renderBoard() {
    const categoriesDiv = document.getElementById("categories");
    categoriesDiv.innerHTML = "";
    categories.forEach(cat => {
        const catDiv = document.createElement("div");
        catDiv.className = "category";
        catDiv.innerText = cat;
        categoriesDiv.appendChild(catDiv);
    });

    const grid = document.getElementById("questionsGrid");
    grid.innerHTML = "";
    for (let col = 0; col < 5; col++) {
        for (let row = 0; row < 4; row++) {
            const cell = document.createElement("div");
            const isUsed = usedQuestions[col][row];
            cell.className = `question-cell ${isUsed ? "used" : ""}`;
            cell.innerText = values[row];
            if (!isUsed) {
                cell.addEventListener("click", (e) => {
                    e.stopPropagation();
                    openQuestion(col, row);
                });
            }
            grid.appendChild(cell);
        }
    }
}

// ---------- РАБОТА С ВОПРОСАМИ ----------
function openQuestion(catIdx, rowIdx) {
    if (usedQuestions[catIdx][rowIdx]) return;
    currentQuestionCat = catIdx;
    currentQuestionRow = rowIdx;
    currentQuestionValue = values[rowIdx];
    const questionText = questionsData[catIdx][rowIdx];
    const modal = document.getElementById("questionModal");
    document.getElementById("modalValue").innerText = `${currentQuestionValue} баллов`;
    document.getElementById("modalQuestion").innerText = questionText;
    modal.style.display = "flex";
}

function closeModal() {
    document.getElementById("questionModal").style.display = "none";
    currentQuestionCat = null;
    currentQuestionRow = null;
}

function closeResultsModal() {
    // Закрываем окно результатов и показываем экран настройки для новой игры
    document.getElementById("resultsModal").style.display = "none";
    showSetupScreen();
}

function handleAnswer(isCorrect) {
    if (currentQuestionCat === null || currentQuestionRow === null) {
        closeModal();
        return;
    }
    const value = currentQuestionValue;
    if (isCorrect) {
        teams[activeTeamIdx].score += value;
    } else {
        teams[activeTeamIdx].score = Math.max(0, teams[activeTeamIdx].score - value);
    }
    
    usedQuestions[currentQuestionCat][currentQuestionRow] = true;
    renderScoreboard();
    renderBoard();
    closeModal();
    
    // Проверяем, не закончилась ли игра
    const isComplete = checkGameComplete();
    
    // Если игра не закончена, переключаем команду
    if (!isComplete) {
        activeTeamIdx = (activeTeamIdx + 1) % teams.length;
        renderScoreboard();
    }
}

// ---------- УПРАВЛЕНИЕ ИГРОЙ ----------
function resetGame() {
    // Показываем экран настройки для новой игры
    showSetupScreen();
}

function showSetupScreen() {
    // Сбрасываем команды к значениям по умолчанию
    teams = [
        { name: "Команда 🔴", score: 0, emoji: "🔴" },
        { name: "Команда 🟢", score: 0, emoji: "🟢" },
        { name: "Команда 🔵", score: 0, emoji: "🔵" }
    ];
    activeTeamIdx = 0;
    initUsed();
    
    // Переключаем экраны
    document.getElementById("gameScreen").style.display = "none";
    document.getElementById("setupScreen").style.display = "block";
    
    // Перерисовываем экран настройки
    renderSetupScreen();
}

function nextTeam() {
    // Проверяем, не закончена ли игра
    if (getRemainingQuestionsCount() === 0) {
        showResults();
        return;
    }
    activeTeamIdx = (activeTeamIdx + 1) % teams.length;
    renderScoreboard();
}

// ---------- ИНИЦИАЛИЗАЦИЯ ----------
function initGame() {
    // Показываем экран настройки
    renderSetupScreen();
    document.getElementById("setupScreen").style.display = "block";
    document.getElementById("gameScreen").style.display = "none";
    
    // Навешиваем обработчики
    document.getElementById("startGameBtn").addEventListener("click", startGame);
    document.getElementById("resetGameBtn").addEventListener("click", resetGame);
    document.getElementById("nextTeamBtn").addEventListener("click", nextTeam);
    document.getElementById("correctBtn").addEventListener("click", () => handleAnswer(true));
    document.getElementById("wrongBtn").addEventListener("click", () => handleAnswer(false));
    document.getElementById("closeModalBtn").addEventListener("click", closeModal);
    document.getElementById("closeResultsBtn").addEventListener("click", closeResultsModal);
    
    // Обработчики для кнопок правил
    const setupRulesBtn = document.getElementById("setupRulesBtn");
    const rulesBtn = document.getElementById("rulesBtn");
    const closeRulesBtn = document.getElementById("closeRulesBtn");
    const rulesModal = document.getElementById("rulesModal");
    
    function openRulesModal() {
        rulesModal.style.display = "flex";
    }
    
    function closeRulesModal() {
        rulesModal.style.display = "none";
    }
    
    if (setupRulesBtn) setupRulesBtn.addEventListener("click", openRulesModal);
    if (rulesBtn) rulesBtn.addEventListener("click", openRulesModal);
    if (closeRulesBtn) closeRulesBtn.addEventListener("click", closeRulesModal);
    
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (document.getElementById("questionModal").style.display === "flex") {
                closeModal();
            } else if (document.getElementById("resultsModal").style.display === "flex") {
                closeResultsModal();
            } else if (rulesModal.style.display === "flex") {
                closeRulesModal();
            }
        }
    });
}

// Запуск игры
initGame();