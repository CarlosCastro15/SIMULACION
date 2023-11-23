import mysql from 'mysql2';

export const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Estefany152407.',
    port: 3306,
    database: 'icm'
});