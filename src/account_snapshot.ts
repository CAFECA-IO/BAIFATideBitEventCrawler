import { Sequelize } from 'sequelize';
import 'dotenv/config';

const SOURCE_DATABASE_URL = process.env.SOURCE_DATABASE_URL as string;
const WAREHOUSE_DATABASE_URL = process.env.WAREHOUSE_DATABASE_URL as string;
const sourceDB = new Sequelize(SOURCE_DATABASE_URL, { logging: false });
const warehouseDB = new Sequelize(WAREHOUSE_DATABASE_URL, { logging: false });

type Job = {
  date: string;
}

async function snapshot(job: Job) {
  console.log(`start snapshot ${job.date}`);
  const start = new Date().getTime();
  const date = job.date;
  const snake_date = job.date.split('-').join('_');
  const table_name = `accounts_${snake_date}`;
  try {
    // step1: read max acount_versions id from warehouse
    const step1Query = `SELECT account_version_id FROM version_times WHERE date = '${date}';`;
    const [step1Results, step1Metadata] = await warehouseDB.query(step1Query);
    const latestId: number = (step1Results[0] as { account_version_id: number })?.account_version_id || 0;

    // step2: summarize account_versions from source
    const step2Query = `SELECT member_id, account_id, currency, SUM(balance) as balance, SUM(locked) as locked, MIN(created_at) as created_at, MAX(created_at) as updated_at FROM account_versions WHERE id < ${latestId} GROUP BY member_id, account_id, currency;`;
    const [step2Results, step2Metadata] = await sourceDB.query(step2Query);

    // step3: write data to snapshot
    if(step2Results.length > 0) {
      const step3Values = step2Results.map((result: any) => {
        return `(${result.member_id}, ${result.account_id}, ${result.currency}, ${result.balance}, ${result.locked}, '${Math.floor(result.created_at.getTime() / 1000)}', '${Math.floor(result.updated_at.getTime() / 1000)}')`;
      });
      const step3Query = `INSERT INTO ${table_name} (member_id, account_id, currency, balance, locked, created_at, updated_at) VALUES ${step3Values};`;
      const [step3Results] = await warehouseDB.query(step3Query);
    }
    
    // step4: show cost time
    const end = new Date().getTime();
    const time = (end - start) / 1000;
    console.log(`snapshot ${table_name} cost ${time} seconds`);
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function sleep(ms: number = 500) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function analyze() {
  const job1:Job = {
    date: '2023-04-01'
  };
  const job2:Job = {
    date: '2024-02-01'
  };

  await snapshot(job1);
  await snapshot(job2);

  sourceDB.close();
  warehouseDB.close();
}
analyze();
