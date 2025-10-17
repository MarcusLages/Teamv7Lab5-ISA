import { USER_MESSAGES } from "../messages/lang/en/user.js"

const insert_patient_btn = document.getElementById("insert_patients");
const submit_query_btn = document.getElementById("submit_query")
const sql_query = document.getElementById("sql_query");
const server_response_div = document.getElementById("server_response")

const server_url = "placeholder"

function clientResponse(text){
    server_response_div.textContent = text;
}

// Part A
insert_patient_btn.addEventListener('click', () => {
    
    // Patients to be inserted everytime the button is pressed
    const sample_patients = [
        {name: 'Sara Brown', date_of_birth: '1901-01-01'},
        {name: 'John Smith', date_of_birth: '1941-01-1'},
        {name: 'Jack Ma', date_of_birth: '1961-01-30'},
        {name: 'Elon Musk', date_of_birth: '1999-01-01'}
    ];

    // unfinished
    fetch(``, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(sample_patients)
    })
    .then(res => res.text())
    .then(clientResponse()) // takes in res.text() (gets piped)
    .catch(err => clientResponse(USER_MESSAGES.ERROR + err))
});

// Part B
submit_query_btn.addEventListener('click', () => {
    
    const query = sql_query.value.trim();

    if (!query){
        clientResponse(USER_MESSAGES.EMPTY_QUERY);
    }

    // SELECT
    if (query.toLowerCase().startsWith('select')) {
        fetch(``)
        .then(res => res.json())
        // placeholder

    // INSERT
    } else if (query.toLowerCase().startsWith('insert')) {
        fetch(`/query`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(query)
        })
        .then(res => res.text())
        .then(clientResponse)
        .catch(err => clientResponse(USER_MESSAGES.ERROR + err))
    } else {
        clientResponse(USER_MESSAGES.INVALID_QUERY)
    }
});

window.onload = () => {
    insert_patient_btn.innerHTML =  USER_MESSAGES.INSERT_BUTTON;
    submit_query_btn.innerHTML = USER_MESSAGES.SUBMIT_QUERY_BTN;

}