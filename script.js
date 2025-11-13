// script.js — Logika gry "GRA — Dopasuj zdjęcie do opisu"

(function(){
  if (!Array.isArray(PAIRS) || PAIRS.length === 0) {
    document.body.innerHTML = '<p style="padding:24px">Brak par! Dodaj zdjęcia i opisy w pliku pairs.js.</p>';
    return;
  }

  const board = document.getElementById('board');
  const matchesEl = document.getElementById('matches');
  const attemptsEl = document.getElementById('attempts');
  const messageEl = document.getElementById('message');
  const restartBtn = document.getElementById('restartBtn');

  let state = {
    matches: 0,
    attempts: 0,
    flipped: [],
    solved: new Set()
  };

  // Tworzymy talię
  let deck = [];
  PAIRS.forEach((p, i) => {
    const id = String(i);
    deck.push({ id, type: 'image', image: p.image });
    deck.push({ id, type: 'text', text: p.text });
  });

  function shuffle(arr){
    for(let i=arr.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]]=[arr[j],arr[i]];
    }
  }

  function render(){
    board.innerHTML = '';
    state.matches = 0;
    state.attempts = 0;
    state.flipped = [];
    state.solved = new Set();
    matchesEl.textContent = 'Dopasowane: 0';
    attemptsEl.textContent = 'Próby: 0';
    messageEl.textContent = '';

    shuffle(deck);
    const cols = Math.ceil(Math.sqrt(deck.length));
    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    deck.forEach(card => {
      const wrapper = document.createElement('div');
      wrapper.className = 'card';
      wrapper.dataset.id = card.id;
      wrapper.dataset.type = card.type;

      const inner = document.createElement('div');
      inner.className = 'card-inner';

      const front = document.createElement('div');
      front.className = 'card-face face-front';

      if (card.type === 'image') {
        const img = document.createElement('img');
        img.src = `images/${card.image}`;
        img.alt = card.image;
        front.appendChild(img);
      } else {
        const textDiv = document.createElement('div');
        textDiv.className = 'desc-text';
        textDiv.textContent = card.text;
        front.appendChild(textDiv);
      }

      const back = document.createElement('div');
      back.className = 'card-face face-back';
      back.textContent = 'GRA';

      inner.appendChild(front);
      inner.appendChild(back);
      wrapper.appendChild(inner);
      board.appendChild(wrapper);

      wrapper.addEventListener('click', () => onCardClick(wrapper));
    });
  }

  function onCardClick(card){
    if (state.solved.has(card.dataset.id)) return;
    if (state.flipped.includes(card)) return;
    if (state.flipped.length === 2) return;

    card.classList.add('flipped');
    state.flipped.push(card);

    if (state.flipped.length === 2) {
      state.attempts++;
      attemptsEl.textContent = `Próby: ${state.attempts}`;
      const [a,b] = state.flipped;
      const match = (a.dataset.id === b.dataset.id) && (a.dataset.type !== b.dataset.type);

      if (match) {
        state.matches++;
        matchesEl.textContent = `Dopasowane: ${state.matches}`;
        state.solved.add(a.dataset.id);
        messageEl.textContent = '✅ Dobrze!';
        setTimeout(() => messageEl.textContent = '', 1000);
        state.flipped = [];

        if (state.matches === PAIRS.length) {
          messageEl.textContent = `🎉 Brawo! Ukończono grę w ${state.attempts} próbach!`;
        }
      } else {
        setTimeout(() => {
          a.classList.remove('flipped');
          b.classList.remove('flipped');
          state.flipped = [];
          messageEl.textContent = '❌ Spróbuj ponownie';
          setTimeout(() => messageEl.textContent = '', 800);
        }, 1000);
      }
    }
  }

  restartBtn.addEventListener('click', render);
  render();
})();
