var score
var numQuestions
let waitForPressResolve
var btn
var questionBox
var correctAnswer
var scoreBox

window.onload = init

function init(){
    btn = document.getElementById("submitBtn")
    questionBox = document.getElementById("questionBox")
    scoreBox = document.getElementById("scoreBox")
}

function runTest(){
    scoreBox.hidden = true
    questionBox.hidden = false
    score = 0

    // Show Questions From DB
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow' 
    };

    btn.addEventListener('click', btnResolver);

    fetch("https://jxl5ow12hb.execute-api.us-east-1.amazonaws.com/dev", requestOptions)
    .then(response => response.json())
    .then(async (responseJson) => {
        numQuestions = responseJson.length
        for(var i=0;i<numQuestions;i++){
            
            //get answer here for comparison when student submits answer
            correctAnswer = responseJson[i].answer

            //display the question and the options
            document.getElementById("question").innerHTML = responseJson[i].question+responseJson[i].options
            
            //Waits for the user to click "submit" before proceeding to next question
            await waitForPress()

        }
        btn.removeEventListener('click', btnResolver);
        viewScore()
        questionBox.hidden = true
    })
    .catch((error) => {
        console.error(error);
    });
    // console.log(responseJson);
    return false;
}

//displays user score on the page
function viewScore(){
    var scoreTxt = score + "/" + numQuestions
    scoreBox.hidden = false
    document.getElementById("score").innerHTML = scoreTxt
    return true;}

function waitForPress() {
    return new Promise(resolve => waitForPressResolve = resolve);
}

function btnResolver() {
    if (waitForPressResolve) waitForPressResolve();

    var studentAnswer

    var radioA = document.getElementById("option1").checked
    var radioB = document.getElementById("option2").checked
    var radioC = document.getElementById("option3").checked
    var radioD = document.getElementById("option4").checked

    //unchecks all radio buttons
    for(var i = 1; i <= 4; i++){
        document.getElementById("option"+i).checked = false
    }

    if(radioA == true){
        studentAnswer = "A"
    }
    if(radioB == true){
        studentAnswer = "B"
    }
    if(radioC == true){
        studentAnswer = "C"
    }
    if(radioD == true){
        studentAnswer = "D"
    }

    if(studentAnswer == correctAnswer){
        score++
    }

}