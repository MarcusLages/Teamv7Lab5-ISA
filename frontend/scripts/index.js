import { USER_MESSAGES } from "/messages/lang/en/user.js"

// DOM element references in index.html
const insert_patient_btn = document.getElementById("insert_patients");
const submit_query_btn = document.getElementById("submit_query")
const sql_query = document.getElementById("sql_query");
const server_response_div = document.getElementById("server_response")

// Base domain - from backend README
const server_url = "https://mvslages.com/v1";

// Helper to display server response text to user.
function clientResponse(text){
    server_response_div.textContent = text;
}

// Part A - Inserts sample patients each time button is clicked
insert_patient_btn.addEventListener('click', () => {
    
    // Patients to be inserted everytime the button is pressed
    const sample_query = `
    INSERT INTO Patients (name, dateOfBirth) VALUES
    ('Sara Brown', '1901-01-01'),
    ('John Smith', '1941-01-01'),
    ('Jack Ma', '1961-01-30'),
    ('Elon Musk', '1999-01-01');
    `;

    // unfinished
    fetch(`${server_url}/query`, {
        method: 'POST', // required by backend 
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({query: sample_query})  // backend looks for req.body.query
    })
    .then(res => res.json()) // backend  responds with JSON format
    .then(data => clientResponse(JSON.stringify(data)))
    .catch(err => clientResponse(USER_MESSAGES.ERROR + err));
});

// Part B - Reads SQL queries typed by the user. Backend enforces correct
// SQL type (403 for invalid query type, error 402 for missing or invalid SQL queries)
// If query begins with SELECT ... send GET /query/?query=SELECT name,
// If query begins with INSERT ... send POST /query with JSON body
submit_query_btn.addEventListener('click', () => {
    
    const user_query = sql_query.value.trim();

    // If no query was entered by the user
    if (!user_query){
        clientResponse(USER_MESSAGES.EMPTY_QUERY);
        return;
    }

    // SELECT -> follow backend rule: GET /query + SQL as query param
    if (user_query.toLowerCase().startsWith('select')) {
        // ensure special chars within a URI component (query param value) is treated as data rather than URI structure.
        fetch(`${server_url}/query/?query=${encodeURIComponent(user_query)}`)
        .then(res => res.json())
        .then(data => clientResponse(JSON.stringify(data)))
        .catch(err => clientResponse(USER_MESSAGES.ERROR + err));

    // INSERT
    } else if (user_query.toLowerCase().startsWith('insert')) {
        fetch(`${server_url}/query`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({query: user_query}) // json body backend expects
        })
        .then(res => res.json())
        .then(data => clientResponse(JSON.stringify(data)))
        .catch(err => clientResponse(USER_MESSAGES.ERROR + err))
    } else {
        clientResponse(USER_MESSAGES.INVALID_QUERY)
    }
});

window.onload = () => {
    insert_patient_btn.innerHTML =  USER_MESSAGES.INSERT_BUTTON;
    submit_query_btn.innerHTML = USER_MESSAGES.SUBMIT_QUERY_BTN;

}
