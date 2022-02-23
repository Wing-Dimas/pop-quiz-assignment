// declare variable
let pending_list;
let passed_list;
let question_list;
let seconds_left;

let inp_time;
let timeTimer;
let interval;

let beginButton;
let correctButton;
let wrongButton;

let modalWrapper;
let sentence;
let textQuestion;
let textCandidate;

let candidatesPending;
let candidatesAnswer;

let left_container;
let right_container

let selected_candidate;

// call event onload
window.onload = function(){
    // assignment variable
    left_container  = document.querySelector(".left-container");
    right_container = document.querySelector(".right-container");
    seconds_left    = document.getElementById("seconds-left");
    beginButton     = document.getElementById("begin-button");
    correctButton   = document.getElementById("correct-button");
    wrongButton     = document.getElementById("wrong-button");
    sentence         = document.querySelector(".sentence");
    textQuestion    = document.getElementById("question");
    textCandidate   = document.getElementById("candidate");
    modalWrapper    = document.querySelector(".modal-wrapper");

    // get data form local storage
    pending_list = JSON.parse(localStorage.getItem("pending_list")) || [];
    passed_list = JSON.parse(localStorage.getItem("passed_list")) || [];
    question_list = JSON.parse(localStorage.getItem("question_list")) || [];
    
    // create question
    const continue_old_list = confirm("Do you wish continue the old list?");
    if(!continue_old_list){
        pending_list = [];
        passed_list = [];
        question_list = ["question 1", "question 2", "question 3", "question 4", "question 5", "question 6", "question 7", "question 8", "question 9", "question 10", "question 11", "question 12", "question 13", "question 14", "question 15", "question 16", "question 17", "question 18", "question 19", "question 20"];
        let again = true;
        alert("Please enter all candidates name one into the prompt after");
        do {
            const candidate = prompt("Enter new candidate name")
            pending_list.push(candidate);
            again = confirm("Do you wish to enter new candidate?");
        } while (again);
    
        localStorage.setItem("pending_list",JSON.stringify(pending_list));
    }else{
        const add = confirm("Do you wish to add new pending candidate?");
        if(add){
            let again = true;
            alert("Please enter all candidates name one into the prompt after");
            do {
                const candidate = prompt("Enter new candidate name")
                pending_list.push(candidate);
                again = confirm("Do you wish to enter new candidate?");
            } while (again);

        }
    }
    // initial timer
    inp_time = Number(prompt("How many seconds do you wish to set your timer?"));
    timeTimer = inp_time;

    // add event to button
    beginButton.addEventListener("click",showQuestion);
    correctButton.addEventListener("click", function(e){
        setAnswer(true);
    });
    wrongButton.addEventListener("click", function(e){
        setAnswer(false);
    });

    // display data in html
    fillLeftContainer(pending_list);
    fillRightContainer(passed_list);
    // start game
    startTimer();
}

function startTimer(){
    // create interval to work
    interval = setInterval(decrementTimer, inp_time * 100);
}

function decrementTimer(){
    // decrement timer until empty
    timeTimer--;
    seconds_left.innerText = timeTimer;
    if(timeTimer == 0){
        // if time is 0, stop interval
        clearInterval(interval);
        // assign to intial value
        timeTimer = inp_time;
        // display modal
        showDialog(pending_list);
    }
}

// function to generate random numbers
function generateRandom(max){
    return Math.floor(Math.random() * max);
}


function showDialog(pending_list = []){
    // find candidate

    const len = pending_list.length;
    // generate ramdom number
    random = generateRandom(len); 
    // get lement from random numbers
    selected_candidate = pending_list[random];
    // delete element on index
    pending_list.splice(random,1);
    // display to html
    candidate.innerText = selected_candidate;

    // display modal
    modalWrapper.style.display = "block";
}

function showQuestion(){
    beginButton.style.display = "none";
    correctButton.style.display = "inline-block";
    wrongButton.style.display = "inline-block";

    sentence.style.display = "none";
    textQuestion.style.display = "block";
    
    // find question
    const random = generateRandom(question_list.length);
    console.log(question_list[random]);
    textQuestion.innerText = question_list[random];
    question_list.splice(random, 1);

    // update question to local storage
    localStorage.setItem("question_list",JSON.stringify(question_list));
}


function setAnswer(answer){
    modalWrapper.style.display = "none";
    beginButton.style.display = "inline-block";
    correctButton.style.display = "none";
    wrongButton.style.display = "none";
    sentence.style.display = "block";
    textQuestion.style.display = "none";

    // create candidate data that has finished answering
    const candidate = {
        "name" : selected_candidate,
        "answer" : answer
    };

    passed_list.push(candidate);
    
    // check if there are still candidates who haven't answered
    if(pending_list.length == 0){
        // end game
        resetContainer();
        storeData();
        alert("GAME OVER")
    }else{
        // repeat the previous step
        resetContainer();
        storeData();
        startTimer();
    }

}
function storeData(){
    localStorage.setItem("pending_list",JSON.stringify(pending_list));
    localStorage.setItem("passed_list",JSON.stringify(passed_list));
}

function fillLeftContainer(pendingList = []){
    pendingList.forEach((candidate)=>{
        const span = document.createElement("span");
        span.append(candidate);
        left_container.appendChild(span);
    });
}

function fillRightContainer(passed_list = []){
    passed_list.forEach((candidate) => {
        const span = document.createElement("span");
        span.append(candidate.name);
        if(candidate.answer){
            span.classList.add("correct");
        }else{
            span.classList.add("wrong");
        }
        right_container.appendChild(span);
    });
}

function resetContainer(){
    const p_left = document.createElement("p");
    p_left.innerText = "Pending List";
    left_container.innerText = "";
    left_container.appendChild(p_left);

    const p_right = document.createElement("p");
    p_right.innerText = "Passed The Question";
    right_container.innerText = "";
    right_container.appendChild(p_right);

    fillLeftContainer(pending_list);
    fillRightContainer(passed_list);
}