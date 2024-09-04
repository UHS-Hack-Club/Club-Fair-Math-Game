let currentAnswer;

// Ensure MathJax is configured
window.MathJax = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']]
    },
    startup: {
        pageReady: () => {
            return MathJax.startup.defaultPageReady().then(() => {
                displayMathProblem();
            });
        }
    }
};

function generateMathProblem() {
    const ops = ['+', '-', ' × ', ' ÷ '];
    const maxNum = 20;
    const maxTerms = 4;

    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const randOp = () => ops[Math.floor(Math.random() * ops.length)];

    const perfectSquares = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225];

    const factorial = (n) => n <= 1 ? 1 : n * factorial(n - 1);

    const genTerm = (isDivisor = false) => {
        let num = isDivisor ? randInt(1, 10) : randInt(1, maxNum);
        if (num <= 5 && Math.random() < 0.2 && !isDivisor) {
            const specialOps = ['!', '^', '\\sqrt'];
            const specialOp = specialOps[Math.floor(Math.random() * specialOps.length)];
            
            if (specialOp === '!') {
                num = randInt(1, 5);
                return { latex: num + '!', eval: factorial(num) };
            } else if (specialOp === '^') {
                const exponent = randInt(0, 4);
                return { latex: num + '^{' + exponent + '}', eval: Math.pow(num, exponent) };
            } else if (specialOp === '\\sqrt') {
                num = perfectSquares[Math.floor(Math.random() * perfectSquares.length)];
                return { latex: '\\sqrt{' + num + '}', eval: Math.sqrt(num) };
            }
        }
        return { latex: num.toString(), eval: num };
    };

    let terms = [genTerm()];
    let termCount = randInt(2, maxTerms);
    for (let i = 1; i < termCount; i++) {
        const operator = randOp();
        const nextTerm = operator === ' ÷ ' ? genTerm(true) : genTerm();

        let evalOperator = operator === ' × ' ? '*' : operator === ' ÷ ' ? '/' : operator;

        terms.push({ latex: operator, eval: evalOperator });
        terms.push(nextTerm);
    }

    if (ops.includes(terms[terms.length - 1].latex)) {
        terms.pop();
    }

    if (terms.length >= 5 && Math.random() < 0.3) {
        let start = randInt(0, terms.length - 4);
        let end = randInt(start + 2, Math.min(start + 3, terms.length - 1));
        
        while (ops.includes(terms[start].latex)) {
            start++;
        }
        while (ops.includes(terms[end].latex)) {
            end--;
        }
        
        if (end - start >= 2) {
            terms.splice(start, 0, { latex: '\\left(', eval: '(' });
            terms.splice(end + 2, 0, { latex: '\\right)', eval: ')' });
        }
    }

    const latexProblem = terms.map(term => term.latex).join(' ');
    const evalProblem = terms.map(term => term.eval).join(' ');

    currentAnswer = eval(evalProblem);
    if (currentAnswer.toString().split('.')[1]?.length >= 3) {
        currentAnswer = parseFloat(currentAnswer).toFixed(2);
    }

    return latexProblem;
}

function getCurrentAnswer() {
    return currentAnswer;
}

function displayMathProblem() {
    const problem = generateMathProblem();
    const mathProblemElement = document.getElementById('math-question');
    if (mathProblemElement) {
        mathProblemElement.innerHTML = '\\[' + problem + '\\]';
        
        if (window.MathJax) {
            MathJax.typesetPromise([mathProblemElement]).then(() => {
                mathProblemElement.style.opacity = '1';
            });
        } else {
            // If MathJax is not loaded yet, wait for it
            window.addEventListener('load', function() {
                MathJax.typesetPromise([mathProblemElement]).then(() => {
                    mathProblemElement.style.opacity = '1';
                });
            });
        }
    }
}

document.getElementById('answer-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const userAnswer = document.getElementById('answer-input').value.trim();
    const formElement = document.getElementById('answer-form');
    
    if (userAnswer === currentAnswer.toString()) {
        // Correct answer
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 100,
                spread: 200,
                origin: { y: 0.4 },
                ticks: 200,
                gravity: 0.5,
            });
        }
        
        // Generate and display next problem
        displayMathProblem();
        document.getElementById('answer-input').value = '';
    } else {
        // Incorrect answer
        formElement.classList.add('shake');
        setTimeout(() => {
            formElement.classList.remove('shake');
        }, 500);
    }
});

// Make getCurrentAnswer globally accessible
window.getCurrentAnswer = getCurrentAnswer;

// Initial question load
displayMathProblem();