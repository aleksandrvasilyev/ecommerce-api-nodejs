import fs from "fs";
import mysql from "mysql2/promise";
import pool from "./connection.js";
import bcrypt from "bcrypt";
import db from "./config.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_NAME = process.env.DB_DATABASE;

const makeQuery = async (sql) => {
  try {
    const [result] = await pool.query(sql);
    console.log("Query executed successfully");
    return result;
  } catch (error) {
    console.error("Query failed: ", error);
    throw error;
  }
};

const createDatabase = `
  DROP DATABASE IF EXISTS ${DB_NAME};
  CREATE DATABASE ${DB_NAME};
  USE ${DB_NAME};`;

const fillDatabase = fs.readFileSync(path.join(__dirname, "db.sql"), "utf8");

const fillDb = async () => {
  try {
    await makeQuery(createDatabase);
    await makeQuery(fillDatabase);

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);

    await makeQuery(
      `INSERT INTO ${db.usersTable} (id, email, password, role) VALUES (1, '${process.env.ADMIN_EMAIL}', '${hashedPassword}', 'admin');`
    );

    console.log("All operations completed successfully");
  } catch (error) {
    console.error("Migration process failed: ", error);
  } finally {
    await pool.end();
    console.log("Database connection closed");
  }
};

fillDb();
