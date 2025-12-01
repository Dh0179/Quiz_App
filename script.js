"use strict";
const contents = document.querySelectorAll('.content');
const inp = document.querySelectorAll('input');
const sc = document.getElementById('content');
const title = document.querySelector('title');
const lien = document.querySelector('a');
let answers = ["océan pacifique", "monte everest", "russie", "nil", "antarctique", "lac caspienne", "chine", "éléphant d'afrique", "rhodium", "séquio géant"];
function check(inputs) {
    return Array.from(inputs).some(input => input.checked);
}

// checklink: return true if at least one input is checked (caller handles navigation)
function checklink(/* url, */ inputs) {
    return check(inputs);
}
let score = localStorage.getItem('score');

// When the link is clicked: compute score from checked inputs, then navigate
// Only attach the handler on pages named indexN.html (quiz pages), not on result/score pages
const currentFile = globalThis.location?.pathname.substring(globalThis.location.pathname.lastIndexOf('/') + 1) || '';
const isIndexPage = /^index(\d+)\.html$/i.test(currentFile);
// Helper: get checked inputs
function getCheckedInputs() {
    return Array.from(inp).filter(i => i.checked);
}

// Helper: count correct answers among checked inputs
function countCorrectAnswers(checkedInputs) {
    let count = 0;
    for (const ci of checkedInputs) {
        const label = document.querySelector(`label[for="${ci.id}"]`);
        if (!label) continue;
        const text = label.textContent.trim().toLowerCase();
        if (answers.some(a => a.trim().toLowerCase() === text)) count += 1;
    }
    return count;
}

// Helper: compute next page (indexN.html -> index(N+1).html), or score.html when N >= 10
function getNextPage() {
    const pathname = globalThis.location?.pathname || '';
    const file = pathname.substring(pathname.lastIndexOf('/') + 1);
    const exec = /^index(\d+)\.html$/i.exec(file);
    if (exec) {
        const currentIndex = Number(exec[1], 10);
        if (currentIndex >= 10) return 'score.html';
        return `index${currentIndex + 1}.html`;
    }
    return 'index2.html';
}

// Helper: update score in localStorage
function applyScoreIncrease(correctCount) {
    score = score === null ? 0 : Number.parseInt(score, 10) || 0;
    if (correctCount > 0) {
        score += correctCount * 2;
    }
    localStorage.setItem('score', score);
}

// Click handler uses small helpers for clarity
if (lien && isIndexPage) {
    lien.addEventListener('click', (e) => {
        e.preventDefault();
        if (!checklink(inp)) {
            alert('Veuillez sélectionner une réponse avant de continuer.');
            return;
        }

        const checked = getCheckedInputs();
        const correctCount = countCorrectAnswers(checked);
        applyScoreIncrease(correctCount);
        if (sc) sc.style.display = 'none';

        const next = getNextPage();
        globalThis.location.href = next;
    });
} else {
    // no link found or not an index page — nothing to attach
}
if (title.textContent === 'Result_Quiz') {
    sc.style.display = "block";
    sc.style.padding = "10px";
    sc.style.fontSize = "20px";
    sc.innerHTML = `<h2> Votre score est : ${score}</h2>`;
}
if (title.textContent === 'Quiz_App_1') {
    localStorage.removeItem('score');
    score = 0;
}
