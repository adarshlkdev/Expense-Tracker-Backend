import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getTransactionByUserId,
  getTransactionSummary,
} from "../controllers/transactionController.js";

const router = express.Router();

router.post("/", createTransaction);

router.get("/:userId", getTransactionByUserId);

router.delete("/:id", deleteTransaction);

router.get("/summary/:userId", getTransactionSummary);

export default router;
