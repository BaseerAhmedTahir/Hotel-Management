import sql from 'mssql';

const sqlConfig = {
  server: 'localhost',
  database: 'HotelBookingManagementSystem',
  user: 'hotelapp',
  password: 'Hotel@2026!',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 2,
    idleTimeoutMillis: 30000
  },
  connectionTimeout: 15000,
  requestTimeout: 15000,
};

// Use globalThis to persist pool across Next.js hot reloads in dev mode
const globalForDb = globalThis;

async function getConnection() {
  if (globalForDb.__sqlPool) {
    return globalForDb.__sqlPool;
  }

  try {
    console.log('Opening SQL Server connection pool...');
    const pool = await sql.connect(sqlConfig);
    console.log('SQL Server connected!');
    globalForDb.__sqlPool = pool;
    return pool;
  } catch (err) {
    console.error('SQL Connection Error:', err.message);
    throw err;
  }
}

export async function query(queryString, params = {}) {
  const pool = await getConnection();
  const request = pool.request();
  Object.keys(params).forEach(key => {
    request.input(key, params[key]);
  });
  const result = await request.query(queryString);
  return result.recordset;
}

export async function executeProc(procName, params = {}) {
  const pool = await getConnection();
  const request = pool.request();
  Object.keys(params).forEach(key => {
    request.input(key, params[key]);
  });
  const result = await request.execute(procName);
  return result;
}

export default { query, executeProc, getConnection };
