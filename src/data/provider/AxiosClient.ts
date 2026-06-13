import axios, {AxiosError, AxiosInstance} from "axios";
import showToast from "@/core/utils/toastUtils";
import {clearAll} from "@/core/utils/storage";

class AxiosClient {
    static instance: null | AxiosInstance = null;

    static getInstance() {
        if (AxiosClient.instance === null) {
            AxiosClient.instance = axios.create({
                baseURL: process.env.NEXT_PUBLIC_API_ADDRESS,
                timeout: 30000
            });
            this.instance?.interceptors.response.clear();
            this.instance?.interceptors.response.use(
                (response,) => {
                    return Promise.resolve(response);
                },
                (error) => {
                    console.log("ERROR IS", error);
                    if (error.response) {
                        const {status, data} = error.response;
                        if (data.detail) {
                            showToast({message: data.detail, type: "error"})
                        }
                        if (status === 401) {
                            // clearAll();
                            // saveValue("showAuthorizationError", true);
                            // window.location.href = '/login';
                            // return this.refreshTokenAndRetry(error.config);
                        } else {
                            console.log("here is ", data);
                            handleHttpStatus(status, data);
                        }
                    } else if (error.request) {
                        handleAxiosError(error.code, error.message);
                    } else {
                        console.log(error);
                        console.error('Error:', error.message);
                    }
                    return Promise.reject(error);
                }
            );
        }
        return AxiosClient.instance;
    }

    static resetInstance() {
        AxiosClient.instance = null;
    }
}

const handleHttpStatus = (status: number, data: any) => {
    switch (status) {
        // Information responses
        case 100: // Continue
            // Handle 100 Continue
            break;
        case 101: // Switching Protocols
            // Handle 101 Switching Protocols
            break;
        case 102: // Processing (WebDAV)
            // Handle 102 Processing
            break;
        case 103: // Early Hints
            // Handle 103 Early Hints
            break;

        // Successful responses
        case 200: // OK
            // Handle 200 OK
            break;
        case 201: // Created
            // Handle 201 Created
            break;
        case 202: // Accepted
            // Handle 202 Accepted
            break;
        case 203: // Non-Authoritative Information
            // Handle 203 Non-Authoritative Information
            break;
        case 204: // No Content
            // Handle 204 No Content
            break;
        case 205: // Reset Content
            // Handle 205 Reset Content
            break;
        case 206: // Partial Content
            // Handle 206 Partial Content
            break;
        case 207: // Multi-Status (WebDAV)
            // Handle 207 Multi-Status
            break;
        case 208: // Already Reported (WebDAV)
            // Handle 208 Already Reported
            break;
        case 226: // IM Used (HTTP Delta encoding)
            // Handle 226 IM Used
            break;

        // Redirection messages
        case 300: // Multiple Choices
            // Handle 300 Multiple Choices
            break;
        case 301: // Moved Permanently
            // Handle 301 Moved Permanently
            break;
        case 302: // Found
            // Handle 302 Found
            break;
        case 303: // See Other
            // Handle 303 See Other
            break;
        case 304: // Not Modified
            // Handle 304 Not Modified
            break;
        case 305: // Use Proxy Deprecated
            // Handle 305 Use Proxy Deprecated
            break;
        case 307: // Temporary Redirect
            // Handle 307 Temporary Redirect
            break;
        case 308: // Permanent Redirect
            // Handle 308 Permanent Redirect
            break;

        // Client error responses
        case 400: // Bad Request
            // throw new BadRequestException();
            break;
        case 401: // Unauthorized
            // Handle 401 Unauthorized
            break;
        case 402: // Payment Required Experimental
            // Handle 402 Payment Required Experimental
            break;
        case 403: // Forbidden
            showToast({message: data.message, type: "error"});
            break;
        case 404: // Not Found
            break;
        case 405: // Method Not Allowed
            // Handle 405 Method Not Allowed
            break;
        case 406: // Not Acceptable
            // Handle 406 Not Acceptable
            break;
        case 407: // Proxy Authentication Required
            // Handle 407 Proxy Authentication Required
            break;
        case 408: // Request Timeout
            // Handle 408 Request Timeout
            break;
        case 409: // Conflict
            // Handle 409 Conflict
            break;
        case 410: // Gone
            // Handle 410 Gone
            break;
        case 411: // Length Required
            // Handle 411 Length Required
            break;
        case 412: // Precondition Failed
            // Handle 412 Precondition Failed
            break;
        case 413: // Payload Too Large
            // Handle 413 Payload Too Large
            break;
        case 414: // URI Too Long
            // Handle 414 URI Too Long
            break;
        case 415: // Unsupported Media Type
            // Handle 415 Unsupported Media Type
            break;
        case 416: // Range Not Satisfiable
            // Handle 416 Range Not Satisfiable
            break;
        case 417: // Expectation Failed
            // Handle 417 Expectation Failed
            break;
        case 418: // I'm a teapot
            // Handle 418 I'm a teapot
            break;
        case 421: // Misdirected Request
            // Handle 421 Misdirected Request
            break;
        case 422: // Unprocessable Content (WebDAV)
            // Handle 422 Unprocessable Content
            break;
        case 423: // Locked (WebDAV)
            // Handle 423 Locked
            break;
        case 424: // Failed Dependency (WebDAV)
            // Handle 424 Failed Dependency
            break;
        case 425: // Too Early Experimental
            // Handle 425 Too Early Experimental
            break;
        case 426: // Upgrade Required
            // Handle 426 Upgrade Required
            break;
        case 428: // Precondition Required
            // Handle 428 Precondition Required
            break;
        case 429: // Too Many Requests
            // Handle 429 Too Many Requests
            break;
        case 431: // Request Header Fields Too Large
            // Handle 431 Request Header Fields Too Large
            break;
        case 451: // Unavailable For Legal Reasons
            // Handle 451 Unavailable For Legal Reasons
            break;

        // Server error responses
        case 500: // Internal Server Error
            showToast({type: "error", message: data.message});
            break;
        case 501: // Not Implemented
            // Handle 501 Not Implemented
            break;
        case 502: // Bad Gateway
            // Handle 502 Bad Gateway
            break;
        case 503: // Service Unavailable
            // Handle 503 Service Unavailable
            break;
        case 504: // Gateway Timeout
            // Handle 504 Gateway Timeout
            break;
        case 505: // HTTP Version Not Supported
            // Handle 505 HTTP Version Not Supported
            break;
        case 506: // Variant Also Negotiates
            // Handle 506 Variant Also Negotiates
            break;
        case 507: // Insufficient Storage (WebDAV)
            // Handle 507 Insufficient Storage
            break;
        case 508: // Loop Detected (WebDAV)
            // Handle 508 Loop Detected
            break;
        case 510: // Not Extended
            // Handle 510 Not Extended
            break;
        case 511: // Network Authentication Required
            // Handle 511 Network Authentication Required
            break;

        default:
            console.error(`Unhandled status code: ${status}`, data);
        // Handle other status codes here
    }
};

const handleAxiosError = (errorStatus: string, message: string) => {
    switch (errorStatus) {
        case AxiosError.ECONNABORTED:
            showToast({message: "Timeout!", type: "error"});
            break;
        case AxiosError.ERR_BAD_OPTION:
            console.log(message);
            break;
        case AxiosError.ERR_BAD_REQUEST:
            console.log(message);
            break;
        case AxiosError.ERR_BAD_OPTION_VALUE:
            console.log(message);
            break;
        case AxiosError.ERR_BAD_RESPONSE:
            console.log(message);
            break;
        case AxiosError.ERR_CANCELED:
            console.log(message);
            break;
        case AxiosError.ERR_DEPRECATED:
            console.log(message);
            break;
        case AxiosError.ERR_FR_TOO_MANY_REDIRECTS:
            console.log(message);
            break;
        case AxiosError.ERR_INVALID_URL:
            console.log(message);
            break;
        case AxiosError.ERR_NETWORK:
            showToast({message: "Network Error", type: "error"});
            break;
        case AxiosError.ERR_NOT_SUPPORT:
            console.log(message);
            break;
        case AxiosError.ETIMEDOUT:
            console.log(message);
            break;
    }
};

export const axiosInstance = AxiosClient.getInstance();
export const resetAxiosInstance = AxiosClient.resetInstance;