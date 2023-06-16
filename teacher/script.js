// Takes ChatGPT response and adds it to the DB
id =0
function sendToDB(question,options,answer){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({"id":id,"question":question,"options":options,"answer":answer});
    console.log("sending: " + raw)
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow' 
    };

    id+=1

    fetch("https://jxl5ow12hb.execute-api.us-east-1.amazonaws.com/dev", requestOptions)
    .then(response => response.text())
    .then(result => alert(JSON.parse(result).body))
    .catch(error => console.log('error', error));
}

// Takes text and sends it to ChatGPT
function callAPI(form){
    const OPENAI_API_KEY="yourkey"
    const MODEL_ID="gpt-3.5-turbo"
    const message = form.querySelector("textarea").value;
    if (message == "") {
        alert("Type in your question!");
        //txtMsg.focus();
        return;
    }
    var oHttp = new XMLHttpRequest();
    oHttp.open("POST", "https://api.openai.com/v1/chat/completions");
    oHttp.setRequestHeader("Accept", "application/json");
    oHttp.setRequestHeader("Content-Type", "application/json");
    oHttp.setRequestHeader("Authorization", "Bearer " + OPENAI_API_KEY);
    // payload parameters
    var sModel = MODEL_ID; 
    var iMaxTokens = 2048;
    var dTemperature = 0.7; 
    var eFrequency_penalty = 0.0; // Between -2 and 2, Positive values decreases repeat responses.
    var cPresence_penalty = 0.0; // Between -2 and 2, Positive values increases new topic probability. 
    var hStop = "&*&"; 

    var data = {
        model: sModel,
        messages: [
            { role: 'system', content: "You are a helpful assistant that creates multiple choice questions." }, 
            { role: 'user', content: "Create a multiple choice question for university student from the following topic with the following format 'Question:', 'Options:', and 'Answer:'" + message }, 
            
        ],
        max_tokens: iMaxTokens,
        temperature:  dTemperature,
        frequency_penalty: eFrequency_penalty,
        presence_penalty: cPresence_penalty,
	    stop: hStop
    }
    oHttp.send(JSON.stringify(data));
    oHttp.onreadystatechange = function(){
        if (oHttp.readyState === XMLHttpRequest.DONE) {
            if (oHttp.status === 200) {
                // The request was successful, so parse the response JSON data
                var responseData = JSON.parse(oHttp.responseText);
                //console.log(responseData.choices[0].message.content);
                var content = responseData.choices[0].message.content;
                var split = content.split('Options:');
                var split2 = split[1].split('Answer:');
                console.log(split[0]);
                console.log(split2[0]);
                console.log(split2[1][1]);
                var query = split[0];
                var response = split[1];
                var options = split2[0];
                var answer = split2[1][1];
                // console.log(query  + response);
                var send = confirm(query + response);

                if(send){
                    console.log("Sending Response to DB");
                    sendToDB(query, options, answer)
                    return false;
                }
                console.log("Not Sending Reponse")

            } else {
                // The request failed, so log the error message
                console.log("Error: " + oHttp.status);
            }
        }
    };
    //console.log("chatgpt-turbo.js Line 155" + JSON.stringify(data));
    return false;
    /*// If user presses Yes, send to DB , else delete
    var send = confirm(query + response);

    if(send){
        console.log("Sending Response to DB");
        sendToDB(query , response)
        return false;
    }
    console.log("Not Sending Reponse")
    return false;*/
}