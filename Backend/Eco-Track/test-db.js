import pool from './config/db.js'; // siguraduhing tama ang path kung nasa ibang folder ang db.js

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Connection failed:', err);
  } else {
    console.log('✅ Connected to Eco-Track_db!');
    console.log('Server time:', res.rows[0].now);
  }
  pool.end(); // isara ang connection pool
});

