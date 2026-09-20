// ==========================================================
// KALEBE - AVENTURA DA MULTIPLICAÇÃO
// PARTE 4 - MAPA DE FASES + BATALHA PREMIUM
// ==========================================================


// ==========================================================
// ESTADO DO JOGO
// ==========================================================

let currentTable = 2;
let currentLevel = 1;
let number = 1;

let score =
    Number(localStorage.getItem("kalebe_score")) || 0;

let coins =
    Number(localStorage.getItem("kalebe_coins")) || 0;


// ==========================================================
// CONFIGURAÇÕES
// ==========================================================

const QUESTIONS_PER_LEVEL = 10;

let questionsAnswered = 0;
let correctAnswers = 0;

let lives = 3;

let answering = false;


// ==========================================================
// SISTEMA DE BATALHA
// ==========================================================

let enemyMaxHealth = 100;
let enemyHealth = 100;

let combo = 0;
let maxCombo = 0;

// ==========================================================
// GERENCIADOR DE ÁUDIO
// ==========================================================

const sounds = {

    attack:
        new Audio("./sounds/attack.wav"),

    coin:
        new Audio("./sounds/coin.wav"),

    correct:
        new Audio("./sounds/correct.wav"),

    defeat:
        new Audio("./sounds/defeat.wav"),

    monsterHit:
        new Audio("./sounds/monster-hit.wav"),

    unlock:
        new Audio("./sounds/unlock.wav"),

    victory:
        new Audio("./sounds/victory.wav"),

    wrong:
        new Audio("./sounds/wrong.wav")

};


// ==========================================================
// MÚSICA DE FUNDO
// ==========================================================

const backgroundMusic =
    new Audio("./sounds/background.ogg");

backgroundMusic.loop = true;

// 18% de volume para não atrapalhar os efeitos
backgroundMusic.volume = 0.18;


// ==========================================================
// CONFIGURAÇÃO DO SOM
// ==========================================================

let soundEnabled =
    localStorage.getItem("kalebe_sound") !== "off";
// ==========================================================
// REPRODUZIR SOM
// ==========================================================

function playSound(name) {

    if (!soundEnabled) {
        return;
    }

    const sound = sounds[name];

    if (!sound) {
        console.warn(
            `Som não encontrado: ${name}`
        );

        return;
    }

    sound.currentTime = 0;

    sound
        .play()
        .catch(error => {

            console.warn(
                `Não foi possível tocar ${name}:`,
                error
            );

        });

}

// ==========================================================
// INICIAR MÚSICA DE FUNDO
// ==========================================================

function startBackgroundMusic() {

    if (!soundEnabled) {
        return;
    }

    backgroundMusic
        .play()
        .catch(error => {

            console.warn(
                "Não foi possível iniciar a música:",
                error
            );

        });

}


// ==========================================================
// PARAR MÚSICA DE FUNDO
// ==========================================================

function stopBackgroundMusic() {

    backgroundMusic.pause();

}
// ==========================================================
// LIGAR / DESLIGAR SOM
// ==========================================================

function toggleSound() {

    soundEnabled = !soundEnabled;

    localStorage.setItem(
        "kalebe_sound",
        soundEnabled ? "on" : "off"
    );

    updateSoundButton();

}


// ==========================================================
// ATUALIZAR BOTÃO DO SOM
// ==========================================================

function updateSoundButton() {

    const button =
        document.getElementById(
            "sound-button"
        );

    if (!button) {
        return;
    }

    button.textContent =
        soundEnabled ? "🔊" : "🔇";

}
// ==========================================================
// INICIALIZAÇÃO
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {

    updateHeader();

});


// ==========================================================
// ATUALIZAR PONTOS E MOEDAS
// ==========================================================

function updateHeader() {

    const scoreElement =
        document.getElementById("score");

    const coinsElement =
        document.getElementById("coins");

    const levelCoinsElement =
        document.getElementById("level-coins");


    if (scoreElement) {
        scoreElement.textContent = score;
    }


    if (coinsElement) {
        coinsElement.textContent = coins;
    }


    if (levelCoinsElement) {
        levelCoinsElement.textContent = coins;
    }

}


// ==========================================================
// TROCAR TELAS
// ==========================================================

function showScreen(screenId) {

    document
        .querySelectorAll(".screen")
        .forEach(screen => {

            screen.classList.remove("active");

        });


    const target =
        document.getElementById(screenId);


    if (target) {

        target.classList.add("active");

    }

}


// ==========================================================
// COMEÇAR JOGO
// ==========================================================

function startGame() {

    startBackgroundMusic();

    updateWorldMap();

    showScreen("map");

}

// ==========================================================
// MAPA DOS MUNDOS
// ==========================================================

function updateWorldMap() {

    /*
        Por enquanto ×2 e ×3 ficam disponíveis
        para facilitar nossos testes.

        Depois implementaremos o desbloqueio
        automático dos mundos.
    */

    updateHeader();

}


// ==========================================================
// ABRIR MUNDO
// ==========================================================

function openWorld(table) {

    currentTable = table;


    currentLevel =
        Number(
            localStorage.getItem(
                `kalebe_level_${table}`
            )
        ) || 1;


    /*
        Segurança:

        nunca permite fase menor que 1
        ou maior que 10.
    */

    if (currentLevel < 1) {
        currentLevel = 1;
    }


    if (currentLevel > 10) {
        currentLevel = 10;
    }


    updateLevelMap();

    showScreen("levels");

}


// ==========================================================
// DADOS DOS MUNDOS
// ==========================================================

function getWorldData(table) {

    const worlds = {

        2: {

            icon: "🌳",

            name: "FLORESTA",

            description:
                "Explore a floresta e domine a multiplicação por 2!"

        },


        3: {

            icon: "🏜️",

            name: "DESERTO",

            description:
                "Atravesse o deserto e domine a multiplicação por 3!"

        },


        4: {

            icon: "🏰",

            name: "CASTELO",

            description:
                "Entre no castelo e domine a multiplicação por 4!"

        },


        5: {

            icon: "🌊",

            name: "OCEANO",

            description:
                "Mergulhe no oceano e domine a multiplicação por 5!"

        },


        10: {

            icon: "🚀",

            name: "ESPAÇO",

            description:
                "Viaje pelo espaço e domine a multiplicação por 10!"

        }

    };


    return worlds[table];

}


// ==========================================================
// ATUALIZAR MAPA DAS FASES
// ==========================================================

function updateLevelMap() {

    const world =
        getWorldData(currentTable);


    if (!world) {

        console.error(
            "Mundo não encontrado:",
            currentTable
        );

        return;

    }


    const title =
        document.getElementById(
            "level-world-title"
        );


    const description =
        document.getElementById(
            "level-world-description"
        );


    const coinsElement =
        document.getElementById(
            "level-coins"
        );


    if (title) {

        title.textContent =
            `${world.icon} ${world.name} DO ×${currentTable}`;

    }


    if (description) {

        description.textContent =
            world.description;

    }


    if (coinsElement) {

        coinsElement.textContent =
            coins;

    }


    // ------------------------------------------------------
    // ATUALIZA AS 10 FASES
    // ------------------------------------------------------

    for (
        let level = 1;
        level <= 10;
        level++
    ) {

        const button =
            document.getElementById(
                `level-button-${level}`
            );


        const starsElement =
            document.getElementById(
                `stars-level-${level}`
            );


        if (
            !button ||
            !starsElement
        ) {

            continue;

        }


        const stars =
            Number(
                localStorage.getItem(
                    `kalebe_stars_${currentTable}_${level}`
                )
            ) || 0;


        // --------------------------------------------------
        // FASE DESBLOQUEADA
        // --------------------------------------------------

        if (level <= currentLevel) {

            button.classList.remove(
                "locked-level"
            );


            starsElement.textContent =
                "⭐".repeat(stars) +
                "☆".repeat(3 - stars);

        }


        // --------------------------------------------------
        // FASE BLOQUEADA
        // --------------------------------------------------

        else {

            button.classList.add(
                "locked-level"
            );


            starsElement.textContent =
                "🔒";

        }

    }

}


// ==========================================================
// SELECIONAR FASE
// ==========================================================

function selectLevel(level) {

    /*
        Não deixa entrar em uma fase
        que ainda não foi desbloqueada.
    */

    if (level > currentLevel) {

        const button =
            document.getElementById(
                `level-button-${level}`
            );


        if (button) {

            button.classList.add(
                "locked-shake"
            );


            setTimeout(() => {

                button.classList.remove(
                    "locked-shake"
                );

            }, 500);

        }


        return;

    }


    // ------------------------------------------------------
    // DEFINE A FASE ESCOLHIDA
    // ------------------------------------------------------

    currentLevel = level;


    // ------------------------------------------------------
    // COMEÇA A FASE
    // ------------------------------------------------------

    startLevel();

}


// ==========================================================
// COMEÇAR FASE
// ==========================================================

function startLevel() {

    questionsAnswered = 0;

    correctAnswers = 0;

    lives = 3;

    answering = false;


    // ------------------------------------------------------
    // REINICIA A BATALHA
    // ------------------------------------------------------

    enemyMaxHealth =
        currentLevel === 10
            ? 150
            : 100;

    enemyHealth = enemyMaxHealth;

    combo = 0;
    maxCombo = 0;

    updateBattleUI();


    // ------------------------------------------------------
    // MUNDO
    // ------------------------------------------------------

    const worldNumber =
        document.getElementById(
            "world-number"
        );


    if (worldNumber) {

        worldNumber.textContent =
            currentTable;

    }


    // ------------------------------------------------------
    // FASE
    // ------------------------------------------------------

    const levelNumber =
        document.getElementById(
            "level-number"
        );


    if (levelNumber) {

        levelNumber.textContent =
            currentLevel;

    }


    // ------------------------------------------------------
    // ESCONDE RESULTADO ANTERIOR
    // ------------------------------------------------------

    const complete =
        document.getElementById(
            "level-complete"
        );


    if (complete) {

        complete.classList.add(
            "hidden"
        );

    }


    // ------------------------------------------------------
    // MOSTRA PERGUNTA
    // ------------------------------------------------------

    const question =
        document.getElementById(
            "question"
        );


    if (question) {

        question.style.display =
            "block";

    }


    // ------------------------------------------------------
    // MOSTRA RESPOSTAS
    // ------------------------------------------------------

    const answers =
        document.getElementById(
            "answers"
        );


    if (answers) {

        answers.style.display =
            "grid";

    }


    // ------------------------------------------------------
    // LIMPA FEEDBACK
    // ------------------------------------------------------

    const feedback =
        document.getElementById(
            "feedback"
        );


    if (feedback) {

        feedback.textContent = "";

    }


    updateLives();

    updateProgress();

    updateHeader();


    showScreen("battle");


    generateQuestion();

}


// ==========================================================
// GERAR PERGUNTA
// ==========================================================

function generateQuestion() {

    answering = false;


    // ------------------------------------------------------
    // NÚMERO ENTRE 1 E 10
    // ------------------------------------------------------

    number =
        Math.floor(
            Math.random() * 10
        ) + 1;


    const correct =
        currentTable * number;


    const question =
        document.getElementById(
            "question"
        );


    if (question) {

        question.textContent =
            `${currentTable} × ${number}`;

    }


    const feedback =
        document.getElementById(
            "feedback"
        );


    if (feedback) {

        feedback.textContent = "";

    }


    // ======================================================
    // CRIAR ALTERNATIVAS
    // ======================================================

    let answers =
        new Set();


    answers.add(correct);


    /*
        Criamos alternativas próximas da
        resposta correta.

        Isso evita respostas absurdamente
        fáceis de eliminar.
    */

    while (answers.size < 4) {

        let variation =
            Math.floor(
                Math.random() * 11
            ) - 5;


        let possible =
            correct + variation;


        if (
            possible > 0 &&
            possible !== correct
        ) {

            answers.add(
                possible
            );

        }

    }


    // ------------------------------------------------------
    // EMBARALHAR
    // ------------------------------------------------------

    answers =
        Array.from(answers)
            .sort(
                () =>
                    Math.random() - 0.5
            );


    const container =
        document.getElementById(
            "answers"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    // ------------------------------------------------------
    // CRIAR BOTÕES
    // ------------------------------------------------------

    answers.forEach(answer => {

        const button =
            document.createElement(
                "button"
            );


        button.className =
            "answer";


        button.textContent =
            answer;


        button.onclick =
            () =>
                checkAnswer(
                    answer,
                    button
                );


        container.appendChild(
            button
        );

    });

}
// ==========================================================
// ATUALIZAR INTERFACE DA BATALHA
// ==========================================================

function updateBattleUI() {

    const bar =
        document.getElementById(
            "enemy-health-bar"
        );

    const text =
        document.getElementById(
            "enemy-health-text"
        );

    const comboDisplay =
        document.getElementById(
            "combo-display"
        );

    const comboNumber =
        document.getElementById(
            "combo-number"
        );


    const percentage =
        Math.max(
            0,
            enemyHealth /
            enemyMaxHealth * 100
        );


    if (bar) {

        bar.style.width =
            `${percentage}%`;

    }


    if (text) {

        text.textContent =
            `${Math.max(0, enemyHealth)} / ${enemyMaxHealth}`;

    }


    if (
        combo >= 2 &&
        comboDisplay &&
        comboNumber
    ) {

        comboDisplay
            .classList
            .remove("hidden");

        comboNumber.textContent =
            combo;

    }

    else if (comboDisplay) {

        comboDisplay
            .classList
            .add("hidden");

    }

}


// ==========================================================
// ATAQUE DO KALEBE
// ==========================================================

function playerAttack() {
    playSound("attack");

    combo++;


    if (combo > maxCombo) {

        maxCombo = combo;

    }


    let damage = 10;


    // ------------------------------------------------------
    // COMBO AUMENTA O DANO
    // ------------------------------------------------------

    if (combo >= 3) {

        damage = 12;

    }


    if (combo >= 5) {

        damage = 15;

    }


    enemyHealth -= damage;


    if (enemyHealth < 0) {

        enemyHealth = 0;

    }


    // ------------------------------------------------------
    // EFEITO DO ATAQUE
    // ------------------------------------------------------

    createAttackEffect(
        "⭐",
        "player-attack"
    );


    const player =
        document.getElementById(
            "player"
        );


    const monster =
        document.getElementById(
            "monster"
        );


    if (player) {

        player.classList.add(
            "player-attacking"
        );

    }


    // ------------------------------------------------------
    // MONSTRO RECEBE O IMPACTO
    // ------------------------------------------------------

    setTimeout(() => {

    playSound("monsterHit");

    if (monster) {

        monster.classList.add(
            "monster-hit"
        );

    }

}, 180);


    // ------------------------------------------------------
    // REMOVE AS ANIMAÇÕES
    // ------------------------------------------------------

    setTimeout(() => {

        if (player) {

            player.classList.remove(
                "player-attacking"
            );

        }


        if (monster) {

            monster.classList.remove(
                "monster-hit"
            );

        }

    }, 650);


    updateBattleUI();

}


// ==========================================================
// ATAQUE DO MONSTRO
// ==========================================================

function enemyAttack() {

    /*
        Qualquer erro quebra o combo.
    */

    combo = 0;


    createAttackEffect(
        "💥",
        "enemy-attack"
    );


    const monster =
        document.getElementById(
            "monster"
        );


    const player =
        document.getElementById(
            "player"
        );


    if (monster) {

        monster.classList.add(
            "enemy-attacking"
        );

    }


    // ------------------------------------------------------
    // KALEBE RECEBE O IMPACTO
    // ------------------------------------------------------

    setTimeout(() => {

        if (player) {

            player.classList.add(
                "player-hit"
            );

        }

    }, 180);


    // ------------------------------------------------------
    // REMOVE AS ANIMAÇÕES
    // ------------------------------------------------------

    setTimeout(() => {

        if (monster) {

            monster.classList.remove(
                "enemy-attacking"
            );

        }


        if (player) {

            player.classList.remove(
                "player-hit"
            );

        }

    }, 650);


    updateBattleUI();

}


// ==========================================================
// EFEITO DO PROJÉTIL
// ==========================================================

function createAttackEffect(
    symbol,
    className
) {

    const zone =
        document.getElementById(
            "attack-zone"
        );


    if (!zone) {

        return;

    }


    const projectile =
        document.createElement(
            "div"
        );


    projectile.className =
        `battle-projectile ${className}`;


    projectile.textContent =
        symbol;


    zone.appendChild(
        projectile
    );


    // ------------------------------------------------------
    // REMOVE O PROJÉTIL APÓS A ANIMAÇÃO
    // ------------------------------------------------------

    setTimeout(() => {

        projectile.remove();

    }, 700);

}


// ==========================================================
// VERIFICAR RESPOSTA
// ==========================================================

function checkAnswer(
    answer,
    button
) {

    /*
        Evita dois cliques rápidos
        na mesma pergunta.
    */

    if (answering) {

        return;

    }


    answering = true;


    const correct =
        currentTable * number;


    const feedback =
        document.getElementById(
            "feedback"
        );


    questionsAnswered++;


    // ======================================================
    // ACERTO
    // ======================================================

    if (answer === correct) {

        correctAnswers++;


        score += 10;

coins += 2;

setTimeout(() => {
    playSound("coin");
}, 300);

button.classList.add(
    "correct"
);

playSound("correct");

playerAttack();

        // --------------------------------------------------
        // KALEBE ATACA
        // --------------------------------------------------

        playerAttack();


        if (feedback) {

            feedback.textContent =
                "⭐ Muito bem, Kalebe!";

        }

    }


    // ======================================================
    // ERRO
    // ======================================================

    else {

        lives--;


        button.classList.add(
            "wrong"
        );
playSound("wrong");

        // --------------------------------------------------
        // MONSTRO ATACA
        // --------------------------------------------------

        enemyAttack();


        if (feedback) {

            feedback.textContent =
                `💡 ${currentTable} × ${number} = ${correct}`;

        }


        highlightCorrectAnswer(
            correct
        );

    }


    saveProgress();

    updateLives();

    updateProgress();


    // ======================================================
    // PRÓXIMA AÇÃO
    // ======================================================

    setTimeout(() => {

        /*
            Se perdeu todas as vidas,
            encerra imediatamente.
        */

        if (lives <= 0) {

            loseLevel();

            return;

        }


        /*
            Se respondeu as 10 questões,
            finaliza a fase.
        */

        if (
            questionsAnswered >=
            QUESTIONS_PER_LEVEL
        ) {

            finishLevel();

            return;

        }


        /*
            Caso contrário:
            próxima pergunta.
        */

        generateQuestion();


    }, 1200);

}


// ==========================================================
// DESTACAR RESPOSTA CORRETA
// ==========================================================

function highlightCorrectAnswer(
    correct
) {

    document
        .querySelectorAll(
            ".answer"
        )
        .forEach(button => {

            if (
                Number(
                    button.textContent
                ) === correct
            ) {

                button.classList.add(
                    "correct"
                );

            }

        });

}


// ==========================================================
// VIDAS
// ==========================================================

function updateLives() {

    const container =
        document.querySelector(
            ".lives"
        );


    if (!container) {

        return;

    }


    let hearts = "";


    for (
        let i = 0;
        i < 3;
        i++
    ) {

        hearts +=
            i < lives
                ? "❤️ "
                : "🖤 ";

    }


    container.textContent =
        hearts;

}


// ==========================================================
// BARRA DE PROGRESSO
// ==========================================================

function updateProgress() {

    const percentage =
        Math.min(
            100,
            (
                questionsAnswered /
                QUESTIONS_PER_LEVEL
            ) * 100
        );


    const progress =
        document.getElementById(
            "progress-bar"
        );


    if (progress) {

        progress.style.width =
            `${percentage}%`;

    }

}


// ==========================================================
// PERDEU A FASE
// ==========================================================

function loseLevel() {

    playSound("defeat");

    const question =
        document.getElementById(
            "question"
        );


    const answers =
        document.getElementById(
            "answers"
        );


    const feedback =
        document.getElementById(
            "feedback"
        );


    if (question) {

        question.style.display =
            "none";

    }


    if (answers) {

        answers.style.display =
            "none";

    }


    if (feedback) {

        feedback.innerHTML =
            "💪 Quase, Kalebe!<br>" +
            "Você consegue! Vamos tentar novamente.";

    }


    /*
        Importante:

        NÃO salva estrela.
        NÃO desbloqueia próxima fase.
    */


    setTimeout(() => {

        updateLevelMap();

        showScreen(
            "levels"
        );

    }, 2300);

}
// ==========================================================
// FINALIZAR FASE
// ==========================================================

function finishLevel() {

    playSound("victory");

    const question =
        document.getElementById(
            "question"
        );


    const answers =
        document.getElementById(
            "answers"
        );


    const feedback =
        document.getElementById(
            "feedback"
        );


    if (question) {

        question.style.display =
            "none";

    }


    if (answers) {

        answers.style.display =
            "none";

    }


    if (feedback) {

        feedback.textContent = "";

    }


    // ======================================================
    // CALCULAR ESTRELAS
    // ======================================================

    let stars = 1;


    /*
        8, 9 ou 10 acertos
        = 3 estrelas
    */

    if (correctAnswers >= 8) {

        stars = 3;

    }


    /*
        6 ou 7 acertos
        = 2 estrelas
    */

    else if (
        correctAnswers >= 6
    ) {

        stars = 2;

    }


    /*
        Menos de 6 acertos,
        mas conseguiu chegar ao final
        = 1 estrela
    */


    // ======================================================
    // SALVAR MELHOR RESULTADO
    // ======================================================

    const starKey =
        `kalebe_stars_${currentTable}_${currentLevel}`;


    const previousStars =
        Number(
            localStorage.getItem(
                starKey
            )
        ) || 0;


    /*
        Nunca substituímos 3 estrelas
        por um resultado pior.
    */

    if (
        stars >
        previousStars
    ) {

        localStorage.setItem(
            starKey,
            stars
        );

    }


    // ======================================================
    // MOSTRAR ESTRELAS
    // ======================================================

    const starsElement =
        document.getElementById(
            "level-stars"
        );


    if (starsElement) {

        starsElement.textContent =
            "⭐".repeat(stars) +
            "☆".repeat(
                3 - stars
            );

    }


    // ======================================================
    // MOSTRAR RESULTADO
    // ======================================================

    const complete =
        document.getElementById(
            "level-complete"
        );


    if (complete) {

        complete.classList.remove(
            "hidden"
        );

    }

}


// ==========================================================
// PRÓXIMA FASE
// ==========================================================

function nextLevel() {

    // ======================================================
    // FASES 1 ATÉ 9
    // ======================================================

    if (currentLevel < 10) {

        const unlockedLevel =
            currentLevel + 1;


        const savedLevel =
            Number(
                localStorage.getItem(
                    `kalebe_level_${currentTable}`
                )
            ) || 1;


        /*
            Só aumenta o progresso.

            Nunca diminui uma fase
            já desbloqueada.
        */

        if (
            unlockedLevel >
            savedLevel
        ) {

            localStorage.setItem(
                `kalebe_level_${currentTable}`,
                unlockedLevel
            );

        }


        currentLevel =
            Math.max(
                unlockedLevel,
                savedLevel
            );


        /*
            Volta ao mapa para o Kalebe
            enxergar a nova fase liberada.
        */

       updateLevelMap();

showScreen(
    "levels"
);

playSound("unlock");

    }


    // ======================================================
    // FASE 10
    // ======================================================

    else {

        worldCompleted();

    }

}


// ==========================================================
// MUNDO COMPLETO
// ==========================================================

function worldCompleted() {

    localStorage.setItem(
        `kalebe_world_${currentTable}_completed`,
        "true"
    );


    /*
        Por enquanto utilizamos alert.

        Depois podemos substituir
        por uma tela premium de vitória.
    */

    alert(

        `🏆 PARABÉNS, KALEBE!\n\n` +

        `Você completou o Mundo ×${currentTable}!`

    );


    updateWorldMap();

    showScreen(
        "map"
    );

}


// ==========================================================
// SALVAR PROGRESSO
// ==========================================================

function saveProgress() {

    localStorage.setItem(
        "kalebe_score",
        score
    );


    localStorage.setItem(
        "kalebe_coins",
        coins
    );


    updateHeader();

}


// ==========================================================
// RESET DO PROGRESSO
// USAREMOS SOMENTE DURANTE DESENVOLVIMENTO
// ==========================================================

function resetGame() {

    const confirmation =
        confirm(
            "Deseja apagar todo o progresso do Kalebe?"
        );


    if (!confirmation) {

        return;

    }


    /*
        Remove apenas informações
        que pertencem ao nosso jogo.
    */

    const keysToRemove = [];


    for (
        let i = 0;
        i < localStorage.length;
        i++
    ) {

        const key =
            localStorage.key(i);


        if (
            key &&
            key.startsWith(
                "kalebe_"
            )
        ) {

            keysToRemove.push(
                key
            );

        }

    }


    keysToRemove.forEach(
        key =>
            localStorage.removeItem(
                key
            )
    );


    score = 0;

    coins = 0;

    currentTable = 2;

    currentLevel = 1;


    updateHeader();

    updateWorldMap();


    alert(
        "🔄 Progresso reiniciado!"
    );


    showScreen(
        "home"
    );

}


// ==========================================================
// SERVICE WORKER / PWA
// ==========================================================

if (
    "serviceWorker" in navigator
) {

    window.addEventListener(
        "load",
        () => {

            navigator
                .serviceWorker
                .register(
                    "./service-worker.js"
                )
                .then(() => {

                    console.log(
                        "KALEBE PWA: Service Worker ativo."
                    );

                })
                .catch(error => {

                    console.warn(
                        "Não foi possível registrar o Service Worker:",
                        error
                    );

                });

        }
    );

}