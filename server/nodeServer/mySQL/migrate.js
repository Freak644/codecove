import fs from "node:fs/promises";
import chalk from "chalk";
import mysql from "mysql2/promise";
import "dotenv/config";
async function migrate() {
    let connection;

    try {
        connection = await mysql.createConnection({
            host: process.env.mySQL_host,
            user: process.env.mySQL_user,
            password: process.env.mySQL_password,
            multipleStatements: true
        });

        console.log(
            chalk.green.bold("✅ Successfully connected to MySQL")
        );

        let dbStepFile = await fs.readFile(
            "nodeServer/mySQL/init.sql",
            "utf-8"
        );

        // Remove BOM if present
        dbStepFile = dbStepFile.replace(/^\uFEFF/, "");

        await connection.query(dbStepFile);

        console.log(
            chalk.green.bold("✅ Successfully initialized database")
        );

    } catch (error) {
        console.error(
            chalk.red("❌ Migration failed:"),
            error.message
        );

        process.exitCode = 1;

    } finally {
        if (connection) {
            await connection.end();
            console.log(chalk.gray("MySQL connection closed."));
        }
    }
}

await migrate();