var box = document.getElementById('show-question');
var content = document.getElementById('question');
var input = document.getElementById('answer');
var teamBox = document.getElementById('teams');
var addTeams = document.getElementById('add-teams');
var timer = document.getElementById('timer');
var bonus = document.getElementById('bonus');
var rows = document.getElementById('table').rows;
var pauseAnswer = false;
var currentAnswer;
var currentQuestion;
var currentIndex;
var currentTeam;
var intervalID;
var flashIntervalID;
var wedgeIntervalID;
var x = 0;
var handlers = [];
var teams = [];
var questions = [];
var turn = 0;
var time;
var audio;
input.addEventListener('keyup', function(e){
    if(e.keyCode == 13 && input.value.trim() != '' && !pauseAnswer){
        acceptAnswer(input.value);
    }
});
for(let i = 0; i < 6; i++){
    questions.push({q: '', a: ''});
}
questions = questions.concat([
    {q: 'The person who is making the offer', a:'Offeror'},
    {q: 'The age of majority in most states', a: '18'},
    {q: 'When a valid offer is met by a valid agreement', a: 'Genuine Agreement'},
    {q: 'Legally good or binding', a: 'Valid'},
    {q: 'A system of laws that allow a debtor protection against their obligations', a: 'Bankruptcy'},
    {q: 'Refusal of an offer by the offeree', a: 'Rejection'},

    {q: 'The person who receives the offer', a: 'Offeree'},
    {q: 'A person under the effects of drugs or alcohol', a: 'Intoxicated Persons'},
    {q: 'Both parties exchange a thing of ______', a: 'value'},
    {q: 'Missing an element or illegal', a: 'void'},
    {q: 'A person fails to perform the duties spelled out in a contract', a: 'Breach of contract'},
    {q: 'Taking back of the offer by the offeree', a: 'Revocation'},

    {q: 'A basic requirement in an offer', a: ['Made Seriously', 'Definite and Certain', 'Communicated to the Offeree']},
    {q: 'When a minor agrees to go on paying a contract after reaching the age of majority', a: 'Ratification'},
    {q: ' An agreement is not a contract unless it contains _______', a: '6 elements of a contract'},
    {q: 'Able to cancel or get out of', a: 'Voidable'},
    {q: 'When one party assigns their benefits to a third party', a: 'Transfer of Rights'},
    {q: 'A contract can be revoked any time before it is ______', a: 'Accepted'},

    {q: 'A basic requirement of acceptance', a: ['Unconditional', 'Follow Rules']},
    {q: 'A contract that cannot be upheld by the law', a: 'Unenforceable'},
    {q: 'A legally enforceable agreement ______ both parties', a: 'Binds'},
    {q: 'A court will not uphold', a: 'Unenforceable'},
    {q: 'A reason to void a contract that becomes impossible to perform', a: 'Impossiblity of Performance'},
    {q: 'Legal means of enforcing a right or correcting a wrong', a: 'Damages'},

    {q: 'Methods of acceptance', a: ['Accepted by a specific time or action', 'Accepted when offer sent', 'Accepted when received']},
    {q: 'Six legal aspects of a contract (all)', a: ['Capacity', 'Legality', 'Genuine Agreement', 'Consideration', 'Offer', 'Acceptance']},
    {q: 'If nothing is offered in return then there is no _____', a: 'Consideration'},
    {q: 'A contract that may be oral or written but is not implied', a: 'Express'},
    {q: 'When a negotiator says something false that they believe to be true', a: 'Innocent Misrepresentation'},
    {q: 'One of three basic options for injured party', a: ['Accept breach', 'Sue for damages', 'Ask the court for equitable remedy']},

    {q: 'Type of acceptance that must exactly mirror or match the offer', a: 'Unconditional'},
    {q: 'What are colonial american laws that prevented deals on Sundays?', a: 'Sunday Statute'},
    {q: 'A contract where not all demands of the contract or real, or can be easily avoided', a: 'Illusory Promise'},
    {q: 'A contract that contains a promise by 1 person to do something, if and when the other party performs some action', a: 'Unilateral'},
    {q: 'A law stating the time until a party can sue for breach of contract', a: 'Statute of Limitations'},
    {q: 'The 5 methods of terminating an offer (all)', a: ['Rejection', 'Revocation', 'Counteroffer', 'Expiration of Time', 'Death or Insanity']}
]);
init();
function showQuestion(idx){
    pauseAnswer = false;
    var question = questions[idx];
    var wedge = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSACnoP5zCtvu-jXSaq4tFNRlclRSzF04ctAH-zMVxo1lFqHt6m';
    currentQuestion = question;
    box.style.display = 'block';
    content.innerHTML = question.q;
    currentAnswer = question.a;
    currentIndex = idx;
    if(question.price > 500){
        var img = document.createElement('IMG');
        img.src = wedge;
        img.id = 'wedge';
        document.body.appendChild(img);
        time = 90;
        audio = new Audio('assets/trap.mp3');
        bonus.style.display = 'block';
        bonus.style.top = Math.round(content.getBoundingClientRect().top - bonus.offsetHeight - 100) + 'px';
        flashIntervalID = setInterval(flash, 100);
        wedgeIntervalID = setInterval(fadeWedge, 100);
    }else{
        time = 30;
        audio = new Audio('assets/std.mp3');
    }
    timer.innerHTML = time;
    audio.play();
    intervalID = setInterval(setTimer, 1000);
}
function acceptAnswer(answer){
    if(flashIntervalID){
        window.clearInterval(flashIntervalID);
        bonus.style.display = 'none';
    }
    input.value = '';
    window.clearInterval(intervalID);
    timer.innerHTML = '';
    audio.pause();
    audio.currentTime = 0;
    pauseAnswer = true;
    var correct = false;
    var isBonus = false;
    var cleaned = cleanup(answer);
    if(currentAnswer instanceof Array){
        if(currentQuestion.q.includes('(all)')){
            var arr = cleaned.split(',');
            points = 0;
            for(i in arr){
                var part = arr[i];
                if(currentAnswer.filter(e => cleanup(e) == cleanup(part)).length > 0){
                    points++;
                }
            }
            if(points == currentAnswer.length){
                correct = true;
            }
        }else{
            if(currentAnswer.filter(e => cleanup(e) == cleaned).length > 0){
                correct = true;
            }
        }
    }else{
        if(cleaned == cleanup(currentAnswer)){
            correct = true;
        }
    }
    if(currentQuestion.price > 500){
        isBonus = true;
        currentQuestion.price = numberLottery();
        window.clearInterval(wedgeIntervalID);
        x = 0;
        document.body.removeChild(document.getElementById('wedge'));
    }
    if(correct){
        content.innerHTML = `
            <span style="color: #81C784">${isBonus && currentQuestion.price < 500 ? 'Sorry, ' : 'Congratulations, '}</span><p>You got ${currentQuestion.price} points!</p>
            <button class="ok" onclick="closeQuestion(${currentIndex}, true)">Ok</button>
        `;
        addPoints(currentQuestion.price);
    }else{
        content.innerHTML = `
            <span style="color: #E57373">Wrong</span>
            <p>The answer was ${currentAnswer instanceof Array ? currentAnswer.map(e => ' ' + e) : currentAnswer}</p>
            <div class="inline">
                <button class="ok" onclick="override(${currentQuestion.price}, ${currentIndex})">Override</button>
                <button class="ok" onclick="closeQuestion(${currentIndex}, false)">Ok</button>
            </div>
        `;
    }
}
function closeTeams(){
    if(teams.length > 0){
        addTeams.style.display = 'none';
        currentTeam = document.getElementById(`team0`);
        currentTeam.style.borderColor = '#FFEB3B';
    }
}
function closeQuestion(idx, correct){
    var y = Math.floor(idx/6);
    var cell = rows[y].cells[idx - 6*y];
    if(correct){
        cell.innerHTML = '&#10004;';
    }else{
        cell.innerHTML = '&#10008';
    }
    cell.removeEventListener('click', handlers[idx]);
    cell.style.cursor = 'auto';  
    box.style.display = 'none';
    turn = turn < teams.length - 1? turn + 1 : 0;
    currentTeam.style.borderColor = '#303F9F';
    currentTeam = document.getElementById(`team${turn}`);
    currentTeam.style.borderColor = '#FFEB3B';
}
function override(points, idx){
    addPoints(points);
    closeQuestion(idx, true);
}
function addPoints(points){
    var addTo = document.getElementById(`points${turn}`);
    addTo.innerHTML = parseInt(addTo.innerHTML) +   points;
    teams[turn].points += points;
}
function cleanup(str){
    return str.trim().toLowerCase();
}
function numberLottery(){
    return 100*Math.round(5*(Math.random()/Math.random())*Math.random()*Math.random()*Math.pow(Math.random()/Math.random(), 10*Math.random()*Math.random()) + 5*(Math.random()/Math.random())*Math.random()*Math.random()*Math.pow(Math.random()/Math.random(), 10*Math.random()*Math.random()));
}
function init(){
    Array.prototype.forEach.call(rows, function(row, i){
        Array.prototype.forEach.call(row.cells, function(cell, j){
            var idx = j + i*row.cells.length;
            questions[idx].price = i*100;
            handlers.push(function(){
                showQuestion(idx);
            });
            cell.addEventListener('click', handlers[idx]);
        });
    });
}
function addTeam(){
    var teamInput = document.getElementById('name');
    if(!teams.includes(teamInput.value)){
        teams.push({name: teamInput.value});
        var html = `
            <div class="team-added">
                ${teamInput.value}
            </div>
        `;
        teamBox.innerHTML += `
            <div class="outer-team" id="team${teams.length - 1}">
                ${html}
                <p><span class="points" id="points${teams.length - 1}">0</span> points</p>
            </div>
        `;
        addTeams.innerHTML += `
            <div class="add-team-wrapper">${html}<p>Team #${teams.length}</p></div>
        `;
    }
}
function setTimer(){
    if(time > 0){
        time--;
        timer.innerHTML = time;
    }else{
        acceptAnswer('?');
    }
}
function flash(){
    if(bonus.style.color == 'rgb(48, 63, 159)'){
        bonus.style.color = '#FFEB3B';
    }else{
        bonus.style.color = '#303F9F';
    }
}
function fadeWedge(){
    var elem = document.getElementById('wedge');
    x++;
    if(x % 2 == 0){
        elem.style.opacity = Math.log(x)/50;
    }else{
        elem.style.opacity = Math.log(x-1)/50;
    }
}