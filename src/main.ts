import { Sequelize } from 'sequelize';
import 'dotenv/config';

const SOURCE_DATABASE_URL = process.env.SOURCE_DATABASE_URL as string;
const WAREHOUSE_DATABASE_URL = process.env.WAREHOUSE_DATABASE_URL as string;
const sourceDB = new Sequelize(SOURCE_DATABASE_URL, { logging: false });
const warehouseDB = new Sequelize(WAREHOUSE_DATABASE_URL, { logging: false });

type SyncTable =
  | 'account_versions'
  | 'referral_commissions'
  | 'orders'
  | 'trades';

interface Job {
  table_name: SyncTable;
  count: number;
  keys: string[];
  data_source_keys: string[];
}

const jobsConfig: Record<SyncTable, Job> = {
  'account_versions': {
    table_name: 'account_versions',
    count: 10000,
    keys: ['id', 'member_id', 'account_id', 'reason', 'balance', 'locked', 'fee', 'amount', 'modifiable_id', 'modifiable_type', 'created_at', 'updated_at', 'currency', 'fun'],
    data_source_keys: ['id', 'member_id', 'account_id', 'reason', 'balance', 'locked', 'fee', 'amount', 'modifiable_id', 'modifiable_type', 'created_at', 'updated_at', 'currency', 'fun']
  },
  'referral_commissions': {
    table_name: 'referral_commissions',
    count: 10000,
    keys: ['id', 'referred_by_member_id', 'trade_member_id', 'market', 'currency', 'amount', 'state', 'created_at', 'deposited_at'],
    data_source_keys: ['id', 'referred_by_member_id', 'trade_member_id', 'voucher_id', 'applied_plan_id', 'applied_policy_id', 'trend', 'market', 'currency', 'ref_gross_fee', 'ref_net_fee', 'amount', 'state', 'deposited_at', 'created_at', 'updated_at'],
  },
  'orders': {
    table_name: 'orders',
    count: 10000,
    keys: ['id', 'ask', 'bid', 'price', 'origin_volume', 'type', 'member_id', 'created_at', 'updated_at'],
    data_source_keys: ['id', 'ask', 'bid', 'currency' ,'price', 'volume', 'origin_volume', 'state', 'done_at', 'type', 'member_id', 'created_at', 'updated_at', 'sn', 'source', 'ord_type', 'locked', 'origin_locked', 'funds_received', 'trades_count'],
  },
  'trades': {
    table_name: 'trades',
    count: 10000,
    keys: ['id', 'currency', 'ask_id', 'bid_id', 'ask_member_id', 'bid_member_id', 'created_at'],
    data_source_keys: ['id', 'price', 'volume', 'ask_id', 'trend', 'currency', 'bid_id', 'created_at', 'updated_at', 'ask_member_id', 'bid_member_id', 'funds', 'trade_fk'],
  }
};

async function doJob(jobConfig: Job) {
  const t = await warehouseDB.transaction();
  try {
    const table_name = jobConfig.table_name;
    const count = jobConfig.count;

    // step1: read job status from warehouse
    const jobs_keys = ['id', 'table_name', 'sync_id', 'parsed_id', 'created_at', 'updated_at'];
    const jobs_keys_str = jobs_keys.join(', ');
    const step1Query = `SELECT ${jobs_keys_str} FROM jobs WHERE table_name = '${table_name}';`;
    const [jobStatus, jobStatusMetadata] = await warehouseDB.query(step1Query, { transaction: t });
    const jobStartId: number = (jobStatus[0] as { sync_id: number })?.sync_id || 0;

    // step1.1: check latest id from warehouse
    const [latestIdResults, latestIdMetadata] = await warehouseDB.query(
      `SELECT MAX(id) as id FROM ${jobConfig.table_name};`, { transaction: t }
    );
    const latestId: number = (latestIdResults[0] as { id: number })?.id || 0;
    const startId: number = latestId > jobStartId ? latestId : jobStartId;
    const endId: number = startId + count;

    // step2: read data from source
    const data_source_keys = jobConfig.data_source_keys;
    const data_source_keys_str = data_source_keys.join(', ');
    const [results, metadata] = await sourceDB.query(
      `SELECT ${data_source_keys_str} FROM ${table_name} WHERE id > ${startId} AND id <= ${endId};`, { transaction: t }
    );

    // step3: write data to warehouse
    if (results.length > 0) {
      const step3Values = results.map((result: any) => {
        const values = jobConfig.keys.map(key => {
          const value = result[key];
          if (typeof value === 'string') {
            return `'${value}'`;
          } else if (value instanceof Date) {
            return `'${value.toISOString()}'`;
          } else if (value === null || value === undefined) {
            return 'NULL';
          } else {
            return value;
          }
        });
        return `(${values.join(', ')})`;
      });
      const step3Query = `INSERT INTO ${table_name} (${jobConfig.keys.join(', ')}) VALUES ${step3Values};`;
      const [step3Results] = await warehouseDB.query(step3Query, { transaction: t });
    }

    // step4: update or insert job status
    const keepGo = results.length > 0;
    const currentEndId: number = keepGo ? (results[results.length - 1] as { id: number })?.id : startId;
    const unix_timestamp = Math.round((new Date()).getTime() / 1000);
    const step4Query = `INSERT INTO jobs (table_name, sync_id, parsed_id, created_at, updated_at) VALUES ('${table_name}', ${currentEndId}, 0, ${unix_timestamp}, ${unix_timestamp}) ON CONFLICT(table_name) DO UPDATE SET sync_id = ${currentEndId}, updated_at = ${unix_timestamp};`;
    const [step4Results] = await warehouseDB.query(step4Query, { transaction: t });

    await t.commit(); 
    // step5: return if continue or not
    const currentCount = results.length;
    const time = new Date().toTimeString().split(' ')[0];
    console.log(`synced ${startId} - ${endId} (${currentCount} records) at ${time}`);
    return keepGo;
  } catch (error) {
    await t.rollback();
    console.error(error);
    return false;
  }
}

async function sleep(ms: number = 500) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function syncDB() {
  for (const jobType of Object.values(jobsConfig)) {
    let keepGo = true;
    while (keepGo) {
      keepGo = await doJob(jobType);
      await sleep();
    }
  }

  sourceDB.close();
  warehouseDB.close();
  await sleep(3600000);
}
syncDB();
