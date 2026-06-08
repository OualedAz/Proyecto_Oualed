const db = require('./config/db');

db.query('SELECT 1')
  .then(([rows]) => {
    console.log('Test Query Success:', rows);
    process.exit(0);
  })
  .catch(err => {
    console.error('Test Query Failed!');
    console.error('Error code:', err.code);
    console.error('Error errno:', err.errno);
    console.error('Error sqlState:', err.sqlState);
    console.error('Error message:', err.message);
    process.exit(1);
  });
