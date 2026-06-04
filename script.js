// ===== ESTADO GLOBAL =====
const state = {
  activity: '',
  day: null,
  month: null,
  year: null,
  time: ''
};

let calMonth, calYear;
const hoje = new Date();

// ===== CORAÇÕES FLUTUANTES =====
(function createFloatingHearts() {
  const container = document.getElementById('heartsBg');
  const symbols = ['❤️', '💕', '💖', '💗', '💓', '💝', '🌹', '💘', '💞'];
  for (let i = 0; i < 30; i++) {
    const h = document.createElement('span');
    h.classList.add('heart-float');
    h.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    h.style.fontSize = (1 + Math.random() * 2) + 'rem';
    h.style.left = Math.random() * 100 + '%';
    h.style.animationDelay = (Math.random() * 10) + 's';
    h.style.animationDuration = (6 + Math.random() * 10) + 's';
    container.appendChild(h);
  }
})();

// ===== TROCA DE PÁGINAS =====
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none';
  });
  const page = document.getElementById(id);
  page.style.display = 'flex';
  // força reflow para a animação reiniciar
  void page.offsetWidth;
  page.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Mostra/oculta o botão "Não" apenas na página 1
  const btnNao = document.getElementById('btnNao');
  if (id === 'page1') {
    btnNao.style.display = 'block';
  } else {
    btnNao.style.display = 'none';
  }
}

// ===== PÁGINA 1 — BOTÃO "NÃO" FOGE PELA TELA TODA =====
let naoClickCount = 0;
const btnNaoEl = document.getElementById('btnNao');
const btnSimEl = document.getElementById('btnSim');

// Posiciona o "Não" inicialmente ao lado do "Sim"
window.addEventListener('load', () => {
  positionNaoInitial();
});

function positionNaoInitial() {
  const simRect = btnSimEl.getBoundingClientRect();
  // Coloca o "Não" à direita do "Sim" com uma distância
  btnNaoEl.style.position = 'fixed';
  btnNaoEl.style.left = (simRect.right + 30) + 'px';
  btnNaoEl.style.top  = simRect.top + 'px';
}

function moveNao() {
  naoClickCount++;
  const hint = document.getElementById('hintNao');
  const btn  = btnNaoEl;

  // Mostra mensagem de dica
  hint.style.display = 'block';
  hint.style.animation = 'none';
  void hint.offsetWidth;
  hint.style.animation = 'shake 0.5s ease';

  const messages = [
    'Hmm... tente o outro botão 😏',
    'Esse botão não leva a lugar nenhum 😂',
    'Você vai ter que dizer sim! 💕',
    'Insistindo? O "Sim" está esperando 🥺',
    'Vai, coragem! Clica no Sim! ❤️',
    'O "Não" simplesmente não funciona aqui 😇',
    'Última chance... melhor clicar no Sim! 💖',
    'Não adianta... o Sim é o único caminho 💘',
    'Tô esperando... 🥰',
  ];
  hint.textContent = messages[Math.min(naoClickCount - 1, messages.length - 1)];

  // Obtém as dimensões da tela e do botão
  const vw  = window.innerWidth;
  const vh  = window.innerHeight;
  const bw  = btn.offsetWidth  + 10;
  const bh  = btn.offsetHeight + 10;

  // Obtém posição atual do "Sim" para evitar sobreposição
  const simRect = btnSimEl.getBoundingClientRect();
  const simZone = {
    x1: simRect.left   - 20,
    y1: simRect.top    - 20,
    x2: simRect.right  + 20,
    y2: simRect.bottom + 20,
  };

  // Tenta encontrar posição aleatória que não sobreponha o "Sim"
  let newX, newY, attempts = 0;
  do {
    newX = Math.random() * (vw - bw);
    newY = Math.random() * (vh - bh);
    attempts++;
  } while (
    attempts < 50 &&
    newX + bw > simZone.x1 && newX < simZone.x2 &&
    newY + bh > simZone.y1 && newY < simZone.y2
  );

  btn.style.left = newX + 'px';
  btn.style.top  = newY + 'px';
}

// ===== PÁGINA 1 → 2 =====
function goToPage2() {
  showPage('page2');
}

// ===== PÁGINA 2 — ATIVIDADE =====
function selectActivity(btn, name) {
  document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  state.activity = name;
  document.getElementById('btnNext2').disabled = false;
}

function goToPage3() {
  calMonth = hoje.getMonth();
  calYear  = hoje.getFullYear();
  renderCalendar();
  showPage('page3');
}

// ===== PÁGINA 3 — CALENDÁRIO =====
const monthNames = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
];
const dayNames = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

function renderCalendar() {
  const grid  = document.getElementById('calendarGrid');
  const label = document.getElementById('monthLabel');
  label.textContent = monthNames[calMonth] + ' ' + calYear;
  grid.innerHTML = '';

  dayNames.forEach(d => {
    const cell = document.createElement('div');
    cell.classList.add('cal-header');
    cell.textContent = d;
    grid.appendChild(cell);
  });

  const firstDay     = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth  = new Date(calYear, calMonth + 1, 0).getDate();
  const todayMidnight = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    empty.classList.add('cal-day', 'empty');
    grid.appendChild(empty);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const cell    = document.createElement('div');
    cell.classList.add('cal-day');
    cell.textContent = d;
    const thisDate = new Date(calYear, calMonth, d);

    if (thisDate < todayMidnight) {
      cell.classList.add('past');
    } else {
      cell.addEventListener('click', () => selectDay(cell, d));
    }

    if (state.day === d && state.month === calMonth && state.year === calYear) {
      cell.classList.add('selected');
    }

    grid.appendChild(cell);
  }
}

function changeMonth(dir) {
  calMonth += dir;
  if (calMonth < 0)  { calMonth = 11; calYear--; }
  if (calMonth > 11) { calMonth = 0;  calYear++; }
  renderCalendar();
}

function selectDay(cell, day) {
  document.querySelectorAll('.cal-day').forEach(c => c.classList.remove('selected'));
  cell.classList.add('selected');
  state.day   = day;
  state.month = calMonth;
  state.year  = calYear;
  document.getElementById('btnNext3').disabled = false;
}

function goToPage4() {
  renderTimes();
  showPage('page4');
}

// ===== PÁGINA 4 — HORÁRIO =====
function renderTimes() {
  const container = document.getElementById('timeOptions');
  container.innerHTML = '';
  const times = [
    '10:00','11:00','12:00','13:00','14:00',
    '15:00','16:00','17:00','18:00','19:00',
    '20:00','21:00','22:00'
  ];
  times.forEach(t => {
    const btn = document.createElement('button');
    btn.classList.add('time-btn');
    btn.textContent = t;
    if (state.time === t) btn.classList.add('selected');
    btn.addEventListener('click', () => selectTime(btn, t));
    container.appendChild(btn);
  });
}

function selectTime(btn, time) {
  document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  state.time = time;
  document.getElementById('btnNext4').disabled = false;
}

// ===== PÁGINA 5 — RESULTADO =====
function goToPage5() {
  const monthName = monthNames[state.month];
  const dayPad    = String(state.day).padStart(2, '0');
  const dateStr   = `${dayPad} de ${monthName} de ${state.year}`;

  document.getElementById('resActivity').textContent = state.activity;
  document.getElementById('resDate').textContent     = dateStr;
  document.getElementById('resTime').textContent     = state.time;

  document.getElementById('finalText').innerHTML =
    `💌 Você tem um encontro marcado no Mês de <strong>${monthName}</strong> ` +
    `do dia <strong>${dayPad}</strong> às <strong>${state.time}</strong> ` +
    `com <strong>João Pedro famoso Piuco</strong> 💕<br><br>` +
    `Mal posso esperar para te ver! 🥰❤️`;

  showPage('page5');
  launchConfetti();
}

// ===== CHUVA DE CORAÇÕES NA PÁGINA FINAL =====
function launchConfetti() {
  const container = document.getElementById('heartsBg');
  const extras = ['💖','✨','🌹','💝','⭐','💘','🎉'];
  for (let i = 0; i < 25; i++) {
    const h = document.createElement('span');
    h.classList.add('heart-float');
    h.textContent = extras[Math.floor(Math.random() * extras.length)];
    h.style.fontSize = (1.5 + Math.random() * 2.5) + 'rem';
    h.style.left = Math.random() * 100 + '%';
    h.style.bottom = '-60px';
    h.style.animationDuration = (3 + Math.random() * 4) + 's';
    h.style.animationDelay    = (Math.random() * 2) + 's';
    container.appendChild(h);
    setTimeout(() => h.remove(), 8000);
  }
}
