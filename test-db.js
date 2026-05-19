const sql = require('mssql');

const config = {
  server: 'localhost',
  database: 'HotelBookingManagementSystem',
  user: 'hotelapp',
  password: 'Hotel@2026!',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  connectionTimeout: 10000,
};

async function test() {
  try {
    console.log('Testing SQL Auth connection...');
    const pool = await sql.connect(config);
    console.log('Connected!');
    
    const rooms = await pool.request().query('SELECT TOP 3 * FROM dbo.vw_AvailableRooms');
    console.log('Available Rooms:', rooms.recordset);
    
    const guests = await pool.request().query('SELECT TOP 3 FullName FROM dbo.Guests');
    console.log('Guests:', guests.recordset);
    
    await pool.close();
    console.log('\nSUCCESS! Database connection is working.');
  } catch (err) {
    console.error('FAILED:', err.message);
  }
}

test();
