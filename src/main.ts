import { Sequelize } from 'sequelize';
import 'dotenv/config';

const SOURCE_DATABASE_URL = process.env.SOURCE_DATABASE_URL as string;
const WAREHOUSE_DATABASE_URL = process.env.WAREHOUSE_DATABASE_URL as string;
const sourceDB = new Sequelize(SOURCE_DATABASE_URL, { logging: false });
const warehouseDB = new Sequelize(WAREHOUSE_DATABASE_URL, { logging: false });

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
    const jobStartId: number = (jobStatus[0] as { sync_id: number })?.sync_id || 0;

    // step1.1: check latest id from warehouse
    const [latestIdResults, latestIdMetadata] = await warehouseDB.query(`SELECT MAX(id) as id FROM account_versions;`);
    const latestId: number = (latestIdResults[0] as { id: number })?.id || 0;
    const startId: number = latestId > jobStartId ? latestId : jobStartId;
    const endId: number = startId + count;

    // step2: read data from source
    const account_versions_keys = ['id', 'member_id', 'account_id', 'reason', 'balance', 'locked', 'fee', 'amount', 'modifiable_id', 'modifiable_type', 'created_at', 'updated_at', 'currency', 'fun'];
    const account_versions_keys_str = account_versions_keys.join(', ');
    const [results, metadata] = await sourceDB.query(`SELECT ${account_versions_keys_str} FROM account_versions WHERE id > ${startId} AND id <= ${endId};`);

    // step3: write data to warehouse
    if(results.length > 0) {
      const step3Values = results.map((result: any) => {
        return `(${result.id}, ${result.member_id}, ${result.account_id}, ${result.reason}, ${result.balance}, ${result.locked}, ${result.fee}, ${result.amount}, ${result.modifiable_id}, '${result.modifiable_type}', '${result.created_at.toISOString()}', '${result.updated_at.toISOString()}', ${result.currency}, ${result.fun})`;
      });
      const step3Query = `INSERT INTO account_versions (id, member_id, account_id, reason, balance, locked, fee, amount, modifiable_id, modifiable_type, created_at, updated_at, currency, fun) VALUES ${step3Values};`;
      const [step3Results] = await warehouseDB.query(step3Query);
    }

    // step4: update or insert job status
    const keepGo = results.length > 0;
    const currentEndId: number = keepGo ? (results[results.length - 1] as { id: number })?.id : startId;
    const unix_timestamp = Math.round((new Date()).getTime() / 1000);
    const step4Query = `INSERT INTO jobs (table_name, sync_id, parsed_id, created_at, updated_at) VALUES ('${table_name}', ${currentEndId}, 0, ${unix_timestamp}, ${unix_timestamp}) ON CONFLICT(table_name) DO UPDATE SET sync_id = ${currentEndId}, updated_at = ${unix_timestamp};`;
    const [step4Results] = await warehouseDB.query(step4Query);

    // step5: return if continue or not
    const currentCount = results.length;
    const time = new Date().toTimeString().split(' ')[0];
    console.log(`synced ${startId} - ${endId} (${currentCount} records) at ${time}`);
    return keepGo;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function sleep(ms: number = 500) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function syncDB() {
  const job:Job = {
    table_name: 'account_versions',
    count: 10000
  };

  let keepGo = await doJob(job);
  while (keepGo)  {
    await sleep();
    keepGo = await doJob(job);
  }

  sourceDB.close();
  warehouseDB.close();
  await sleep(3600000);
}
syncDB();
