import http from "http";
import { Response } from "./modules/response.js";
import { MSGS } from "./lang/messages/en/user.js";
import { PatientDB } from "./modules/db.js";

const URL_TEMPLATE = "http://%1";

class App {
    static API_VERSION = "/v1";
    static QUERY_ROUTE = "/query";
    static QUERY_PARAM = "query";

    constructor() {
        this.db = new PatientDB();
        this.port = process.env.PORT || 8000;
        this.server = http.createServer((req, res) => this.startServer(req, res));
    }

    // Set CORS headers to authorize specific origins, req methods and 
    // req headers to use the API
    static setHeaders(res) {
        res.setHeader("Access-Control-Allow-Origin", "*"); // allow all origins
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    async startServer(req, res) {
        App.setHeaders(res);
        // Handle browser preflight OPTIONS request
        if (req.method === "OPTIONS") {
            res.writeHead(204); // No Content
            res.end();
            return;
        }

        const req_url = new URL(req.url,
            URL_TEMPLATE.replace("%1", req.headers.host)
        );

        switch (req.method) {
            case "GET":
                await this.handleQueryGet(req_url, res);
                break;
            case "POST":
                await this.handleQueryPost(req_url, req, res);
                break;
            default:
                Response.notFoundError(res);
                break;
        }
    }

    async handleQueryGet(req_url, res) {
        if (req_url.pathname.includes(App.QUERY_ROUTE)) {
            const query = req_url.searchParams.get(App.QUERY_PARAM);
            // Would be good to abstract this if we had more query types
            try {
                const data = await this.db.selectQuery(query);
                if (data.query) {
                    Response.successRes(res, data);
                } else if (data.err_code === Response.FORBIDDEN_CODE) {
                    Response.forbiddenError(res, data.err_msg);
                } else {
                    Response.badReqError(res, data.err_msg);
                }
            } catch (err) {
                Response.serverError(res, MSGS.DATABASE_ERR);
            }
        } else {
            Response.notFoundError(res);
        }
    }

    async handleQueryPost(req_url, req, res) {
        if (req_url.pathname.includes(App.QUERY_ROUTE)) {
            let body_str = "";
            req.on("data", chunk => { body_str += chunk; });
            req.on("end", async () => {
                try {
                    const body = JSON.parse(body_str);
                    const query = body.query;
                    try {
                        const data = await this.db.insertQuery(query);
                        if (data.query) {
                            Response.successRes(res, data);
                        } else if (data.err_code === Response.FORBIDDEN_CODE) {
                            Response.forbiddenError(res, data.err_msg);
                        } else {
                            Response.badReqError(res, data.err_msg);
                        }
                    } catch (err) {
                        Response.serverError(res, MSGS.DATABASE_ERR);
                    }
                } catch (err) {
                    Response.badReqError(res);
                }
            });
        } else {
            Response.notFoundError(res);
        }
    }

    start() {
        this.db.init();
        this.server.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`);
        });
    }
}

const app = new App();
app.start();