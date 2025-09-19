// utils/callPythonAPI.js
const axios = require("axios");

const PYTHON_API = process.env.PYTHON_API || "http://localhost:8000";

const callPythonAPI = async (endpoint, payload, opts = {}) => {
    try {
        const response = await axios.post(`${PYTHON_API}${endpoint}`, payload, {
            timeout: opts.timeout || 120000, // 2 minutes default
            headers: opts.headers || {},
        });
        return response.data;
    } catch (err) {
        console.error(`Python API error [${endpoint}]`, {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
        });
        if (err.response && err.response.data) {
            // prefer Python-side error message
            throw new Error(err.response.data.error || JSON.stringify(err.response.data));
        }
        throw new Error("Python API unreachable");
    }
};

module.exports = { callPythonAPI, PYTHON_API };
