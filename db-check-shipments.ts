import pool from "./src/config/db.js";

async function main() {
    try {
        const res = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'shipments';
        `);
        console.log("Columns in 'shipments' table:");
        console.log(res.rows);
    } catch (err) {
        console.error("Error executing query:", err);
    } finally {
        await pool.end();
    }
}

main();
