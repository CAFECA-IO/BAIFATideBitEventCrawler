import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sourceDB = new Sequelize(process.env.SOURCE_DATABASE_URL);
const warehouseDB = new Sequelize(process.env.WAREHOUSE_DATABASE_URL);

type Job = {
  table_name: string;
  count: number;
}

async function doJob(job: Job) {
  try {
    const table_name = job.table_name;
    const count = job.count;

    // step1: read job status from warehouse
    const jobs_keys = ['id', 'table_name', 'sync_id', 'parsed_id', 'created_at', 'updated_at'];
    const jobs_keys_str = jobs_keys.join(', ');
    const step1Query = `SELECT ${jobs_keys_str} FROM jobs WHERE table_name = '${table_name}';`;
    const [jobStatus, jobStatusMetadata] = await warehouseDB.query(step1Query);
    const startId: number = (jobStatus[0] as { sync_id: number })?.sync_id || 0;
    const endId: number = startId + count;

    // step2: read data from source
    const account_versions_keys = ['id', 'member_id', 'account_id', 'reason', 'balance', 'locked', 'fee', 'amount', 'modifiable_id', 'modifiable_type', 'created_at', 'updated_at', 'currency', 'fun'];
    const account_versions_keys_str = account_versions_keys.join(', ');
    const [results, metadata] = await sourceDB.query(`SELECT ${account_versions_keys_str} FROM account_versions WHERE id > ${startId} AND id <= ${endId};`);

    // step3: write data to warehouse
    const step3Values = results.map((result: any) => {
      return `(${result.id}, ${result.member_id}, ${result.account_id}, '${result.reason}', ${result.balance}, ${result.locked}, ${result.fee}, ${result.amount}, ${result.modifiable_id}, '${result.modifiable_type}', '${result.created_at}', '${result.updated_at}', '${result.currency}', ${result.fun})`;
    });
    const step3Query = `INSERT INTO account_versions (id, member_id, account_id, reason, balance, locked, fee, amount, modifiable_id, modifiable_type, created_at, updated_at, currency, fun) VALUES ${step3Values};`;
    await warehouseDB.query(step3Query);

    // step4: update or create job status
    const unix_timestamp = Math.round((new Date()).getTime() / 1000);
    const step4Query = `INSERT INTO jobs (table_name, sync_id, parsed_id, created_at, updated_at) VALUES ('${table_name}', ${endId}, 0, ${unix_timestamp}, ${unix_timestamp}) ON DUPLICATE KEY UPDATE sync_id = ${endId}, updated_at = ${unix_timestamp};`;
    await warehouseDB.query(step4Query);

    // step5: return if continue or not
    console.log(`synced ${startId} - ${endId} (${count} records) from source to warehouse.`);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function sleep(ms: number = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function syncDB() {
  const job:Job = {
    table_name: 'account_versions',
    count: 10
  };

  let keepGo = await doJob(job);
  while (keepGo)  {
    await sleep(1000);
    keepGo = await doJob(job);
  }

  sourceDB.close();
  warehouseDB.close();
}
syncDB();
