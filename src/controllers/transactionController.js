import { sql } from "../config/db.js";

export async function createTransaction(req, res) {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || !amount || !category || !user_id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const transaction = await sql`
    INSERT INTO transactions(user_id , title , amount , category)
    VALUES (${user_id}, ${title}, ${amount}, ${category})
    RETURNING *
    `;

    res.status(201).json(transaction[0]);
  } catch (err) {
    console.error("Error creating transaction:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getTransactionByUserId(req, res) {
  try {
    const { userId } = req.params;
    const transactions =
      await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`;

    if (transactions.length === 0) {
      return res
        .status(404)
        .json({ error: "No transactions found for this user" });
    }

    res.status(200).json(transactions);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const result =
      await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;

    if (result.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (err) {
    console.error("Error deleting transaction:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getTransactionSummary(req, res) {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`
    SELECT COALESCE(SUM(amount) , 0) AS balance FROM transactions WHERE user_id = ${userId}
    `;

    const incomeResult = await sql`
    SELECT COALESCE(SUM(amount) , 0) AS income FROM transactions WHERE user_id = ${userId} AND amount > 0`;

    const expenseResult = await sql`
    SELECT COALESCE(SUM(amount) , 0) AS expense FROM transactions WHERE user_id = ${userId} AND amount < 0`;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expense: expenseResult[0].expense,
    });
  } catch (err) {
    console.error("Error fetching transaction summary:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
