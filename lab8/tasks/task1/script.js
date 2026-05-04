'use strict';

const settingsPanel      = document.getElementById('settings-panel');
const gamePanel          = document.getElementById('game-panel');
const resultsPanel       = document.getElementById('results-panel');

const playersRadios      = document.querySelectorAll('input[name="players"]');
const player1NameInput   = document.getElementById('player1-name');
const player2NameInput   = document.getElementById('player2-name');
const player2NameLabel   = document.getElementById('player2-name-label');

const rowsInput          = document.getElementById('rows-input');
const colsInput          = document.getElementById('cols-input');
const gridWarning        = document.getElementById('grid-warning');
const difficultyRadios   = document.querySelectorAll('input[name="difficulty"]');
const roundsInput        = document.getElementById('rounds-input');

const resetSettingsBtn   = document.getElementById('reset-settings-btn');
const startGameBtn       = document.getElementById('start-game-btn');
const restartBtn         = document.getElementById('restart-btn');
const backSettingsBtn    = document.getElementById('back-settings-btn');
const playAgainBtn       = document.getElementById('play-again-btn');
const newSettingsBtn     = document.getElementById('new-settings-btn');

const currentRoundEl     = document.getElementById('current-round');
const totalRoundsEl      = document.getElementById('total-rounds');
const scoreP1El          = document.getElementById('score-p1');
const scoreP2El          = document.getElementById('score-p2');
const p1LabelEl          = document.getElementById('p1-label');
const p2LabelEl          = document.getElementById('p2-label');
const p1ScoreEl          = document.getElementById('p1-score');
const p2ScoreEl          = document.getElementById('p2-score');
const p1MovesEl          = document.getElementById('p1-moves');
const p2MovesEl          = document.getElementById('p2-moves');
const timerValueEl       = document.getElementById('timer-value');
const timerDisplayEl     = document.getElementById('timer-display');
const currentTurnEl      = document.getElementById('current-turn-display');
const boardEl            = document.getElementById('board');
const resultsContentEl   = document.getElementById('results-content');

const ANIMAL_EMOJIS = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯',
                       '🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🦆','🦉',
                       '🦇','🐺','🐗','🐴','🦄','🐝','🐛','🦋','🐌','🐞'];

const DIFFICULTY_TIME = { easy: 180, normal: 120, hard: 60 };

const IMG_PATH = '../../img/';

const DEFAULT_SETTINGS = {
  players: 1, player1: 'Гравець 1', player2: 'Гравець 2',
  rows: 4, cols: 4, difficulty: 'easy', rounds: 1
};

let state = {};

const readSettings = () => ({
  players:    parseInt([...playersRadios].find(r => r.checked).value),
  player1:    player1NameInput.value.trim() || 'Гравець 1',
  player2:    player2NameInput.value.trim() || 'Гравець 2',
  rows:       parseInt(rowsInput.value),
  cols:       parseInt(colsInput.value),
  difficulty: [...difficultyRadios].find(r => r.checked).value,
  rounds:     parseInt(roundsInput.value) || 1
});

const isPairCount = (rows, cols) => (rows * cols) % 2 === 0;

const shuffleArray = arr => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const buildDeck = (rows, cols) => {
  const total   = rows * cols;
  const pairs   = total / 2;
  const emojis  = shuffleArray(ANIMAL_EMOJIS).slice(0, pairs);
  const doubled = shuffleArray([...emojis, ...emojis]);
  return doubled.map((emoji, i) => ({
    id: i, emoji, flipped: false, matched: false
  }));
};

const formatTime = secs => {
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
};

const calcWinner = (roundResults, p1Name, p2Name) => {
  const p1Wins = roundResults.filter(r => r.winner === 'p1').length;
  const p2Wins = roundResults.filter(r => r.winner === 'p2').length;
  if (p1Wins > p2Wins) return p1Name;
  if (p2Wins > p1Wins) return p2Name;
  return 'Нічия';
};

const buildRoundResultsHTML = (roundResults, settings) => {
  const isMulti = settings.players === 2;

  const rows = roundResults.map((r, i) => {
    const winnerCell = isMulti
      ? `<td>${r.winner === 'p1' ? settings.player1 : r.winner === 'p2' ? settings.player2 : 'Нічия'}</td>`
      : '';
    const p2cols = isMulti
      ? `<td>${r.p2Moves}</td><td>${r.p2Pairs}</td>` : '';
    return `<tr class="${isMulti && r.winner && r.winner !== 'draw' ? 'winner-row' : ''}">
      <td>Раунд ${i+1}</td>
      <td>${r.p1Moves}</td>
      <td>${r.p1Pairs}</td>
      ${p2cols}
      <td>${formatTime(r.timeSpent)}</td>
      ${winnerCell}
    </tr>`;
  }).join('');

  const p2header = isMulti
    ? `<th>${settings.player2} ходів</th><th>${settings.player2} пар</th>` : '';
  const winnerHeader = isMulti ? `<th>Переможець</th>` : '';

  return `
    <table class="rounds-table">
      <thead><tr>
        <th>Раунд</th>
        <th>${settings.player1} ходів</th>
        <th>${settings.player1} пар</th>
        ${p2header}
        <th>Час</th>
        ${winnerHeader}
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
};

const buildInitialState = settings => ({
  settings,
  deck:          buildDeck(settings.rows, settings.cols),
  flippedIds:    [],
  matchedIds:    [],
  locked:        false,
  moves:         { p1: 0, p2: 0 },
  score:         { p1: 0, p2: 0 },
  currentPlayer: 1,
  currentRound:  1,
  timerSecs:     DIFFICULTY_TIME[settings.difficulty],
  timerInterval: null,
  roundStartTime: Date.now(),
  roundResults:  [],
  gameOver:      false
});

const renderBoard = st => {
  const { rows, cols } = st.settings;
  boardEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  boardEl.style.maxWidth = `${cols * 142}px`;
  boardEl.innerHTML = '';

  st.deck.forEach(card => {
    const el = document.createElement('div');
    el.className = 'card' +
      (card.flipped || card.matched ? ' flipped' : '') +
      (card.matched ? ' matched' : '');
    el.dataset.id = card.id;

    const frontImg = card.matched ? 'card_matched.png' : 'card_front.png';
    el.innerHTML = `
      <div class="card-inner">
        <div class="card-back">
          <img src="${IMG_PATH}card_back.png" alt="card back" draggable="false" />
        </div>
        <div class="card-front">
          <img src="${IMG_PATH}${frontImg}" alt="card front" draggable="false" />
          <span class="card-emoji">${card.emoji}</span>
        </div>
      </div>`;

    if (!card.matched) el.addEventListener('click', onCardClick);
    boardEl.appendChild(el);
  });
};

const renderScoreboard = st => {
  p1LabelEl.textContent = st.settings.player1;
  p1ScoreEl.textContent = st.score.p1;
  p1MovesEl.textContent = st.moves.p1;

  if (st.settings.players === 2) {
    scoreP2El.classList.remove('hidden');
    p2LabelEl.textContent = st.settings.player2;
    p2ScoreEl.textContent = st.score.p2;
    p2MovesEl.textContent = st.moves.p2;
  } else {
    scoreP2El.classList.add('hidden');
  }

  scoreP1El.classList.toggle('active-player', st.settings.players === 2 && st.currentPlayer === 1);
  scoreP2El.classList.toggle('active-player', st.settings.players === 2 && st.currentPlayer === 2);
};

const renderTimer = secs => {
  timerValueEl.textContent = formatTime(secs);
  timerDisplayEl.classList.toggle('danger', secs <= 15);
};

const renderRoundInfo = st => {
  currentRoundEl.textContent = st.currentRound;
  totalRoundsEl.textContent  = st.settings.rounds;
};

const renderTurnInfo = st => {
  currentTurnEl.textContent = st.settings.players === 2
    ? `Хід: ${st.currentPlayer === 1 ? st.settings.player1 : st.settings.player2}`
    : '';
};

const fullRender = st => {
  renderBoard(st);
  renderScoreboard(st);
  renderTimer(st.timerSecs);
  renderRoundInfo(st);
  renderTurnInfo(st);
};

const stopTimer = () => {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
};

const startTimer = () => {
  stopTimer();
  state.timerInterval = setInterval(() => {
    state.timerSecs -= 1;
    renderTimer(state.timerSecs);
    if (state.timerSecs <= 0) {
      stopTimer();
      onTimeUp();
    }
  }, 1000);
};

const onCardClick = e => {
  const cardEl = e.currentTarget;
  const id     = parseInt(cardEl.dataset.id);
  const card   = state.deck[id];

  if (state.locked) return;
  if (card.flipped || card.matched) return;
  if (state.flippedIds.length >= 2) return;

  state.deck[id] = { ...card, flipped: true };
  state.flippedIds = [...state.flippedIds, id];
  cardEl.classList.add('flipped');

  if (state.flippedIds.length === 2) {
    const cp = state.currentPlayer;
    state.moves[cp === 1 ? 'p1' : 'p2'] += 1;
    renderScoreboard(state);
    checkMatch();
  }
};

const checkMatch = () => {
  const [id1, id2] = state.flippedIds;
  const c1 = state.deck[id1];
  const c2 = state.deck[id2];

  if (c1.emoji === c2.emoji) {
    state.deck[id1] = { ...c1, matched: true };
    state.deck[id2] = { ...c2, matched: true };
    state.matchedIds = [...state.matchedIds, id1, id2];

    const cp = state.currentPlayer;
    state.score[cp === 1 ? 'p1' : 'p2'] += 1;

    [id1, id2].forEach(id => {
      const el = boardEl.querySelector(`[data-id="${id}"]`);
      if (el) { el.classList.add('matched'); el.removeEventListener('click', onCardClick); }
    });

    state.flippedIds = [];
    renderScoreboard(state);

    if (state.matchedIds.length === state.deck.length) {
      setTimeout(onRoundComplete, 500);
    }
  } else {
    state.locked = true;
    const els = state.flippedIds.map(id => boardEl.querySelector(`[data-id="${id}"]`));
    els.forEach(el => el && el.classList.add('shake'));

    setTimeout(() => {
      state.deck[id1] = { ...c1, flipped: false };
      state.deck[id2] = { ...c2, flipped: false };
      els.forEach(el => { if (el) { el.classList.remove('flipped', 'shake'); } });
      state.flippedIds = [];
      state.locked     = false;

      if (state.settings.players === 2) {
        state.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
        renderTurnInfo(state);
        renderScoreboard(state);
      }
    }, 900);
  }
};

const recordRoundResult = timeSpent => {
  const { score, moves, settings } = state;
  const total = settings.rows * settings.cols / 2;
  let winner = null;
  if (settings.players === 2) {
    winner = score.p1 > score.p2 ? 'p1' : score.p2 > score.p1 ? 'p2' : 'draw';
  } else {
    winner = null;
  }
  return {
    p1Pairs: score.p1, p2Pairs: score.p2,
    p1Moves: moves.p1, p2Moves: moves.p2,
    timeSpent, winner, total
  };
};

const onRoundComplete = () => {
  stopTimer();
  const timeSpent = DIFFICULTY_TIME[state.settings.difficulty] - state.timerSecs;
  const result = recordRoundResult(timeSpent);
  state.roundResults = [...state.roundResults, result];

  if (state.currentRound >= state.settings.rounds) {
    showResults(false);
  } else {
    state.currentRound += 1;
    advanceRound();
  }
};

const onTimeUp = () => {
  const timeSpent = DIFFICULTY_TIME[state.settings.difficulty];
  const result = recordRoundResult(timeSpent);
  state.roundResults = [...state.roundResults, result];
  showResults(true);
};

const advanceRound = () => {
  state.deck         = buildDeck(state.settings.rows, state.settings.cols);
  state.flippedIds   = [];
  state.matchedIds   = [];
  state.locked       = false;
  state.moves        = { p1: 0, p2: 0 };
  state.score        = { p1: 0, p2: 0 };
  state.currentPlayer = 1;
  state.timerSecs    = DIFFICULTY_TIME[state.settings.difficulty];
  state.roundStartTime = Date.now();
  fullRender(state);
  startTimer();
};

const showResults = timedOut => {
  stopTimer();
  showPanel('results');

  const { settings, roundResults } = state;
  let html = '';

  if (timedOut && roundResults.length > 0) {
    const last = roundResults[roundResults.length - 1];
    html += `<div class="no-time-banner">Час вийшов у раунді ${state.currentRound}!</div>`;
  }

  if (settings.players === 2 && roundResults.length > 0) {
    const winner = calcWinner(roundResults, settings.player1, settings.player2);
    html += `<div class="winner-banner">Переможець: ${winner}!</div>`;
  } else if (settings.players === 1 && roundResults.length > 0) {
    const last = roundResults[roundResults.length - 1];
    html += `<div class="winner-banner"> ${settings.player1} завершив гру!</div>`;
  }

  html += buildRoundResultsHTML(roundResults, settings);
  resultsContentEl.innerHTML = html;
};

const showPanel = name => {
  settingsPanel.classList.add('hidden');
  gamePanel.classList.add('hidden');
  resultsPanel.classList.add('hidden');
  if (name === 'settings') settingsPanel.classList.remove('hidden');
  if (name === 'game')     gamePanel.classList.remove('hidden');
  if (name === 'results')  resultsPanel.classList.remove('hidden');
};

const applyDefaultSettings = () => {
  player1NameInput.value = DEFAULT_SETTINGS.player1;
  player2NameInput.value = DEFAULT_SETTINGS.player2;
  rowsInput.value        = DEFAULT_SETTINGS.rows;
  colsInput.value        = DEFAULT_SETTINGS.cols;
  roundsInput.value      = DEFAULT_SETTINGS.rounds;
  [...playersRadios].find(r => r.value === String(DEFAULT_SETTINGS.players)).checked = true;
  [...difficultyRadios].find(r => r.value === DEFAULT_SETTINGS.difficulty).checked   = true;

  player2NameLabel.classList.add('hidden');
  gridWarning.classList.add('hidden');
};

const validateGrid = () => {
  const rows = parseInt(rowsInput.value);
  const cols = parseInt(colsInput.value);
  const valid = isPairCount(rows, cols) && rows >= 4 && cols >= 4;
  gridWarning.classList.toggle('hidden', valid);
  return valid;
};

const startGame = settings => {
  state = buildInitialState(settings);
  showPanel('game');
  fullRender(state);
  startTimer();
};

const restartCurrentRound = () => {
  stopTimer();
  state.deck          = buildDeck(state.settings.rows, state.settings.cols);
  state.flippedIds    = [];
  state.matchedIds    = [];
  state.locked        = false;
  state.moves         = { p1: 0, p2: 0 };
  state.score         = { p1: 0, p2: 0 };
  state.currentPlayer = 1;
  state.timerSecs     = DIFFICULTY_TIME[state.settings.difficulty];
  fullRender(state);
  startTimer();
};

playersRadios.forEach(r => r.addEventListener('change', () => {
  const selected = [...playersRadios].find(x => x.checked);
  player2NameLabel.classList.toggle('hidden', selected.value !== '2');
}));

rowsInput.addEventListener('input', validateGrid);
colsInput.addEventListener('input', validateGrid);

resetSettingsBtn.addEventListener('click', applyDefaultSettings);

startGameBtn.addEventListener('click', () => {
  if (!validateGrid()) return;
  const settings = readSettings();
  if (settings.rows < 4 || settings.cols < 4) return;
  startGame(settings);
});

restartBtn.addEventListener('click', restartCurrentRound);

backSettingsBtn.addEventListener('click', () => {
  stopTimer();
  showPanel('settings');
});

playAgainBtn.addEventListener('click', () => {
  startGame(state.settings);
});

newSettingsBtn.addEventListener('click', () => {
  stopTimer();
  showPanel('settings');
});

applyDefaultSettings();
showPanel('settings');