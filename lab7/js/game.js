'use strict';

let  level = 1,
    timeToDuel = 1125,
    readyToDuel = false,
    time,
    score,
    gunmanComesFromLeft = false;


const startButton = document.querySelector('.button-start-game'),
    restartButton = document.querySelector('.button-restart'),
    nextButton = document.querySelector('.button-next-level'),
    gameMenu = document.querySelector('.game-menu'),
    wrapper = document.querySelector('.wrapper'),
    gamePanels = document.querySelector('.game-panels'),
    gameScreen = document.querySelector('.game-screen'),
    winScreen = document.querySelector('.win-screen'),
    gunman = document.querySelector('.gunman'),
    timeYou = document.querySelector('.time-panel__you'),
    timeGunman = document.querySelector('.time-panel__gunman'),
    showLevel = document.querySelector('.score-panel__level'),
    message = document.querySelector('.message');

const sfxIntro = new Audio('sfx/intro.m4a'),
    sfxWait = new Audio('sfx/wait.m4a'),
    sfxFire = new Audio('sfx/fire.m4a'),
    sfxShot = new Audio('sfx/shot.m4a'),
    sfxWin = new Audio('sfx/win.m4a'),
    sfxDeath = new Audio('sfx/death.m4a');

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
nextButton.addEventListener('click', nextLevel);

function startGame() {
    gameMenu.style.display = 'none';
    gamePanels.style.display = 'block';
    gameScreen.style.display = 'block';
    wrapper.style.display = 'block';

    timeGunman.innerHTML = (timeToDuel / 1000).toFixed(2);
    timeYou.innerHTML = (0).toFixed(2);
    score = +document.querySelector('.score-panel__score_num').innerHTML;
    showLevel.innerHTML = 'level: ' + level;

    gunmanComesFromLeft = Math.random() < 0.5;

    gunman.style.left = gunmanComesFromLeft ? '-130px' : '800px';
    gunman.classList.remove('moving', 'standing', 'flipped');

    if (gunmanComesFromLeft) {
        gunman.classList.add('flipped');
    }

    gunman.classList.add('gunman-level-' + level);
    gunman.addEventListener('transitionend', prepareForDuel);

    setTimeout(() => moveGunman(), 500);
}

function restartGame() {
    sfxDeath.pause();

    restartButton.style.display = 'none';
    message.innerHTML = '';
    gameScreen.classList.remove('game-screen--death');
    message.classList.remove('message--dead', 'animated', 'zoomIn');

    gunman.classList.remove(
        'gunman-level-' + level,
        'gunman-level-' + level + '__standing',
        'gunman-level-' + level + '__ready',
        'gunman-level-' + level + '__shooting'
    );

    setTimeout(startGame, 1000);
}

function nextLevel() {
    if (level < 5) {
        nextButton.style.display = 'none';
        message.innerHTML = '';
        message.classList.remove('message--win', 'animated', 'zoomIn');

        gunman.classList.remove(
            'gunman-level-' + level,
            'gunman-level-' + level + '__standing',
            'gunman-level-' + level + '__death'
        );

        level++;
        timeToDuel -= (level * 77);

        startGame();
    } else {
        message.style.display = 'none';
        gameScreen.style.display = 'none';
        gamePanels.style.display = 'none';
        winScreen.style.display = 'block';
    }
}

function moveGunman() {
    setTimeout(() => {
        gunman.classList.add('moving');
        gunman.style.left = gunmanComesFromLeft ? '340px' : '340px';
        sfxIntro.play();
        sfxIntro.loop = true;
    }, 50);
}

function prepareForDuel() {
    sfxIntro.pause();
    sfxWait.play();
    sfxWait.currentTime = 0;
    sfxWait.loop = true;

    gunman.classList.remove('moving');
    gunman.classList.add('standing', 'gunman-level-' + level + '__standing');

    setTimeout(() => {
        sfxWait.pause();
        gunman.classList.add('gunman-level-' + level + '__ready');
        message.classList.add('message--fire');
        sfxFire.play();

        gunman.addEventListener('mousedown', playerShootsGunman);
        readyToDuel = true;

        timeCounter(new Date().getTime());
        setTimeout(gunmanShootsPlayer, timeToDuel);
    }, 1000);
}

function timeCounter(startTime) {
    (function update() {
        const currentTime = new Date().getTime();

        if (readyToDuel) {
            time = ((currentTime - startTime + 10) / 1000).toFixed(2);
            timeYou.innerHTML = time;
            setTimeout(update, 10);
        }
    })();
}

function gunmanShootsPlayer() {
    if (!readyToDuel) return;

    readyToDuel = false;

    gunman.classList.remove('standing');
    gunman.classList.add('gunman-level-' + level + '__shooting');

    setTimeout(() => {
        sfxShot.play();
        message.classList.remove('message--fire');
        gameScreen.classList.add('game-screen--death');
        message.classList.add('message--dead', 'animated', 'zoomIn');
        message.innerHTML = 'You are dead!';
    }, timeToDuel / 3);

    gunman.removeEventListener('mousedown', playerShootsGunman);

    setTimeout(() => {
        sfxDeath.play();
        restartButton.style.display = 'block';
    }, 1000);
}

function playerShootsGunman() {
    if (!readyToDuel) return;

    readyToDuel = false;

    sfxShot.play();
    message.classList.remove('message--fire');

    gunman.classList.remove('standing', 'gunman-level-' + level + '__shooting');
    gunman.classList.add('gunman-level-' + level + '__death');
    gunman.removeEventListener('mousedown', playerShootsGunman);

    sfxWin.play();

    setTimeout(() => {
        message.classList.add('message--win', 'animated', 'zoomIn');
        message.innerHTML = 'You Win!';
        scoreCount();
        nextButton.style.display = 'block';
    }, 1000);
}

function scoreCount() {
    const scoreDiv = document.querySelector('.score-panel__score_num');
    const pointsToAdd = +(timeToDuel/10 - +time * 100) * level * 77;

    (function animate() {
        if (+scoreDiv.innerHTML - score < pointsToAdd) {
            scoreDiv.innerHTML = +scoreDiv.innerHTML + 100;
            setTimeout(animate, 10);
        }
    })();
}