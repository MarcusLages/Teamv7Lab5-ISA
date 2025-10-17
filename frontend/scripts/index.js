import { USER_MESSAGES } from "../messages/lang/en/user"

const insert_button = document.getElementById("insert_button");
const submit_query_button = document.getElementById("submit_query")
const sql_query = document.getElementById("sql_query");
const server_response_div = document.getElementById("server_response")

window.onload = () => {
    insert_button.innerHTML =  USER_MESSAGES.INSERT_BUTTON;
    submit_query_button.innerHTML = USER_MESSAGES.SUBMIT_QUERY_BTN;

}