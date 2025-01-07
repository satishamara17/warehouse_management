"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expenseControllers_1 = require("../controllers/expenseControllers");
const router = (0, express_1.Router)();
router.get("/", expenseControllers_1.getExpensesByCategory);
exports.default = router;
