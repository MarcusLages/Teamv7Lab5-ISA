const { MSGS } = require("../lang/messages/en/user.js")

exports.Response = class Response {
    
    static RES_CONTENT_TYPE = "application/json";
    static DEFAULT_SUCC_CODE = 200;
    static CREATED_CODE = 201;
    static DEFAULT_ERR_CODE = 400;
    static BAD_REQ_CODE = 402;
    static NOT_FOUND_CODE = 404;
    static FORBIDDEN_CODE = 403;
    static DEFAULT_INT_SERVER_CODE = 500;
    
    static sendResponse(res, data, code) {
        res.writeHead(code, { "Content-Type": this.RES_CONTENT_TYPE });
        res.end(JSON.stringify(data));
    } 

    static successRes(res, data, code) {
        const res_data = {
            status: "success",
            code: code || this.DEFAULT_SUCC_CODE,
            data: data
        };
        this.sendResponse(res, res_data, res_data.code);
    }

    static createdRes(res, data) {
        this.successRes(res, data, this.CREATED_CODE);
    }

    static errorRes(res, err_msg, err_code) {
        const res_data = {
            status: "error",
            code: err_code || this.DEFAULT_ERR_CODE,
            data: err_msg
        };
        this.sendResponse(res, res_data, res_data.code);
    }

    static badReqError(res, err_msg) {
        this.errorRes(
            res,
            err_msg || MSGS.DEFAULT_BAD_REQ_ERR,
            this.BAD_REQ_CODE
        );
    }
    
    static notFoundError(res, err_msg) {
        this.errorRes(
            res,
            err_msg || MSGS.DEFAULT_NOT_FOUND_ERR,
            this.NOT_FOUND_CODE
        );
    }

    static forbiddenError(res, err_msg) {
        this.errorRes(
            res,
            err_msg || MSGS.DEFAULT_FORBIDDEN_ERR,
            this.FORBIDDEN_CODE
        )
    }

    static serverError(res, err_msg) {
        this.errorRes(
            res,
            err_msg || MSGS.DEFAULT_INT_SERVER_ERR,
            this.DEFAULT_INT_SERVER_CODE
        )
    }
}