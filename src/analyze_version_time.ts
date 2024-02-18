import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sourceDB = new Sequelize(process.env.SOURCE_DATABASE_URL, { logging: false });
const warehouseDB = new Sequelize(process.env.WAREHOUSE_DATABASE_URL, { logging: false });

type Job = {
  table_name: string;
  date: string;
}

type VersionTime = {
  account_version_id: number
  date: string
  unix_timestamp: number
}

async function readMiddelId(startId: number, endId: number): Promise<VersionTime> {
  const id = Math.ceil((startId + endId) / 2);
  const query = `SELECT id, created_at FROM account_versions WHERE id = ${id};`;
  const [results, metadata] = await sourceDB.query(query);
  const account_version_id: number = (results[0] as { id: number })?.id || 0;
  const date: string = (results[0] as { created_at: Date })?.created_at.toISOString().split('T')[0] || '';
  const unix_timestamp: number = Math.round((new Date(date)).getTime() / 1000);
  const result: VersionTime = {
    account_version_id,
    date,
    unix_timestamp
  };
  return result;
}

async function findDateVersionID(job: Job) {
  try {
    const table_name = job.table_name;
    const date = job.date;
    const unix_timestamp = Math.round((new Date(date)).getTime() / 1000);

    // step1: read max acount_versions id from source
    const step1Query = `SELECT MAX(id) as id FROM account_versions;`;
    const [latestIdResults, latestIdMetadata] = await sourceDB.query(step1Query);
    const latestId: number = (latestIdResults[0] as { id: number })?.id || 0;

    // step2: read the middle id from source
    let startId = 0;
    let endId = latestId;
    let checkpoint: VersionTime;
    let findGt: VersionTime;
    let findLet: VersionTime;
    let done: boolean = false;

    while (!done) {
      checkpoint = await readMiddelId(startId, endId);
      if (checkpoint.account_version_id === 0) break;
      if (checkpoint.unix_timestamp <= unix_timestamp) {
        // step3: if the middle id's date is less  or equal than the date, then the start id is the middle id
        findLet = checkpoint;
        startId = checkpoint.account_version_id;
        console.log(`find Let version id: ${findLet.account_version_id} at ${findLet.date} (${findLet.unix_timestamp})`);
      } else {
        // step4: if the middle id's date is greater than the date, then the end id is the middle id
        findGt = checkpoint;
        endId = checkpoint.account_version_id;
        console.log(`find Gt version id: ${findGt.account_version_id} at ${findGt.date} (${findGt.unix_timestamp})`);
      }
      done = endId - startId <= 1;
    }

    // step5: save result to warehouse
    const step5Query = `INSERT INTO version_times (account_version_id, date, unix_timestamp) VALUES (${findGt.account_version_id}, '${findGt.date}', ${findGt.unix_timestamp});`;
    const [step5Results] = await warehouseDB.query(step5Query);
    console.log(`find ${date} version id: ${findGt.account_version_id} at ${findGt.date} (${findGt.unix_timestamp})`);
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
    table_name: 'account_versions',
    date: '2023-03-31'
  };
  const job2:Job = {
    table_name: 'account_versions',
    date: '2024-01-31'
  };

  findDateVersionID(job1);
  findDateVersionID(job2);

  sourceDB.close();
  warehouseDB.close();
}
analyze();
