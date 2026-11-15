import mysql from 'mysql2/promise';
import chalk from 'chalk';
async function setConnection() {
    try {
        const connection = await mysql.createConnection({
            host:process.env.mySQL_host,
            user:process.env.mySQL_user,
            password:process.env.mySQL_password,
            database:process.env.mySQL_DB,
            waitForConnections:true,
            multipleStatements:true,
            connectionLimit:process.env.mySQL_limit
        })
        console.log(chalk.green.bold("✅Succesfully build connection with MySQL"))
        return connection;
    } catch (error) {
        console.log(chalk.red("something went wrong"+error.message))
    }
}
const database = await setConnection();
export {database}