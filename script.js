/* ================= Shared helpers (localStorage-based) ================= */

function getUsers(){
  return JSON.parse(localStorage.getItem('users') || '{}');
}
function saveUsers(users){
  localStorage.setItem('users', JSON.stringify(users));
}
function setSession(username){
  localStorage.setItem('session', username);
}
function getSession(){
  return localStorage.getItem('session');
}
function clearSession(){
  localStorage.removeItem('session');
}
function setMsg(el, text, type){
  el.textContent = text || '';
  el.className = 'msg ' + (type || 'error');
}

/* ================= signup.html ================= */
function initSignup(){
  const btn = document.getElementById('signup-btn');
  const msg = document.getElementById('signup-msg');

  btn.addEventListener('click', () => {
    const username = document.getElementById('su-username').value.trim();
    const email = document.getElementById('su-email').value.trim();
    const password = document.getElementById('su-password').value;

    if(!username || !email || !password){
      setMsg(msg, 'Please fill in all fields.', 'error');
      return;
    }

    const users = getUsers();
    if(users[username]){
      setMsg(msg, 'That username is already taken.', 'error');
      return;
    }

    users[username] = { email, password };
    saveUsers(users);

    setMsg(msg, 'Account created! Redirecting to login...', 'success');
    setTimeout(() => { window.location.href = 'index.html'; }, 800);
  });
}

/* ================= login.html ================= */
function initLogin(){
  // if already logged in, skip straight to dashboard
  if(getSession()){
    window.location.href = 'dashboard.html';
    return;
  }

  const btn = document.getElementById('login-btn');
  const msg = document.getElementById('login-msg');

  btn.addEventListener('click', () => {
    const username = document.getElementById('li-username').value.trim();
    const password = document.getElementById('li-password').value;

    if(!username || !password){
      setMsg(msg, 'Please enter username and password.', 'error');
      return;
    }

    const users = getUsers();
    const user = users[username];

    if(!user || user.password !== password){
      setMsg(msg, 'Invalid username or password.', 'error');
      return;
    }

    setSession(username);
    window.location.href = 'dashboard.html';
  });
}

/* ================= dashboard.html ================= */
const RATE_PER_UNIT = 0.15; // $ per kW unit consumed

function initDashboard(){
  const username = getSession();
  if(!username){
    window.location.href = 'index.html';
    return;
  }
  document.getElementById('welcome-text').textContent = 'Welcome ' + username;

  document.getElementById('logout-btn').addEventListener('click', () => {
    clearSession();
    window.location.href = 'index.html';
  });

  // ---- EDC Calculator ----
  document.getElementById('edc-btn').addEventListener('click', () => {
    const oldKw = parseFloat(document.getElementById('old-kw').value);
    const newKw = parseFloat(document.getElementById('new-kw').value);
    const resultEl = document.getElementById('edc-result');

    if(isNaN(oldKw) || isNaN(newKw)){
      resultEl.textContent = 'Please enter both Old Kw and New Kw.';
      return;
    }
    if(newKw < oldKw){
      resultEl.textContent = 'New Kw must be greater than or equal to Old Kw.';
      return;
    }
    const unitsUsed = newKw - oldKw;
    const payment = unitsUsed * RATE_PER_UNIT;
    resultEl.textContent = 'Units used: ' + unitsUsed.toFixed(2) +
      ' kW  |  Amount due: $' + payment.toFixed(2);
  });
// ---- GRADE CALCULATOR ----
  document.getElementById('grade-btn').addEventListener('click', () => {
    const score = parseFloat(document.getElementById('score').value);
    const resultEl = document.getElementById('grade-result');
 
    if(isNaN(score) || score < 0 || score > 100){
      resultEl.textContent = 'Please enter a valid score between 0 and 100.';
      return;
    }

        let grade;
        if (score >= 90) grade = 'A';
        else if (score >= 80) grade = 'B';
        else if (score >= 70) grade = 'C';
        else if (score >= 60) grade = 'D';
        else grade = 'F';
        resultEl.textContent = 'Score: ' + score + '  \u2192  Grade: ' + grade;
        });
}
