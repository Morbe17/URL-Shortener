"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.get('/', (req, res) => {
    var _a, _b;
    const urlToRedirect = (_a = req.query) === null || _a === void 0 ? void 0 : _a.url;
    const hoursToKeepOnline = (_b = req.query) === null || _b === void 0 ? void 0 : _b.hours;
    if (!urlToRedirect) {
        res.status(400).send('No url provided');
    }
    if (!hoursToKeepOnline) {
        res.status(400).send('No hours provided');
    }
    if (!urlToRedirect || !hoursToKeepOnline) {
        return;
    }
    if (!urlToRedirect.startsWith('http')) {
        res.status(400).send('Invalid url');
    }
    if (isNaN(Number(hoursToKeepOnline))) {
        res.status(400).send('Invalid hours');
    }
    if (!urlToRedirect.startsWith('http') || isNaN(Number(hoursToKeepOnline))) {
        return;
    }
    // Your code here
});
