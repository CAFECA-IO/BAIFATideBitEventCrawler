import { Sequelize } from 'sequelize';
import * as XLSX from 'xlsx';
import 'dotenv/config';

const SOURCE_DATABASE_URL = process.env.SOURCE_DATABASE_URL as string;
const WAREHOUSE_DATABASE_URL = process.env.WAREHOUSE_DATABASE_URL as string;
const sourceDB = new Sequelize(SOURCE_DATABASE_URL, { logging: false });
const warehouseDB = new Sequelize(WAREHOUSE_DATABASE_URL, { logging: false });

type Job = {
  table_name: string;
}

const exchangeRate = {
  USD: 1,
  BTC: 51846,
  ETH: 2805,
  SC: 0.01389,
  DGD: 48.17,
  ETC: 26.18,
  ZEC: 26.44,
  HKD: 0.13,
  XPA: 0.0001403,
  TWD: 0.032,
  JPY: 0.0067,
  KRW: 0.000002595,
  BT1: 0.0000002746,
  BT2: 0.00000003630,
  BCH: 267.36,
  LTC: 70.37,
  DASH: 29.70,
  QLC: 0.00001939,
  NEO: 12.91,
  CBT: 0,
  HKX: 0.13,
  USX: 1,
  EOS: 0.78,
  LIKE: 0.0025,
  XTP: 1.8633,
  CNX: 0.14,
  EUR: 1.08,
  EUX: 1.08,
  TRY: 0.032,
  PCW: 0,
  PCT: 0,
  SSK: 0,
  TBT: 0.039065,
  USDT: 1,
  GOLD: 0,
  USDC: 1,
  BUSD: 1,
  DAI: 1,
  LINK: 19.43,
  MKR: 2135.38,
  SNX: 3.68,
  UNI: 7.82,
  SUSHI: 1.21,
  CRV: 0.5411,
  '1INCH': 0.45,
  BAL: 3.97,
  LON: 0.69,
  YFI: 7710.23,
  COMP: 56.83,
  AAVE: 91.71,
  MATIC: 0.92,
  FTM: 0.41,
  FTT: 1.90,
  MANA: 0.49,
  SAND: 0.50,
  DYDX: 3.09,
  ALICE: 1.300958,
  C98: 0.34,
  GALA: 0.0256,
  FIL: 6.23,
}

const exportAccounts = async (job: Job) => {
  const table_name = job.table_name;

  try {
    // step1: read account info from source
    const step1Query = `SELECT id, email from members;`;
    const [step1Results, step1Metadata] = await sourceDB.query(step1Query);

    // step2: read currency info from source and compute price
    const step2Query = `SELECT id, symbol from asset_bases;`;
    const [step2Results, step2Metadata] = await sourceDB.query(step2Query);
    const currencyWithPrice = step2Results.map((result: any) => {
      const symbol = result.symbol;
      const price = exchangeRate[symbol] || 0;
      return {
        id: result.id,
        symbol,
        price
      };
    });

    // step3: read account data from warehouse
    const step3Query = `SELECT id, member_id, account_id, currency, balance, locked, created_at, updated_at from ${table_name};`;
    const [step3Results, step3Metadata] = await warehouseDB.query(step3Query);

    // step4: collect data and calculate price
    const step4Results = {};
    step3Results.map((result: any) => {
      const member_email = (step1Results.find((r: any) => r.id === result.member_id) as { email: string })?.email || '';
      const currency = (currencyWithPrice.find((r: any) => r.id === result.currency) as { symbol: string, price: number });
      const symbol = currency.symbol;
      const price = currency.price;
      const balance = Number(result.balance) + Number(result.locked);
      const value = balance * price;
      if (!step4Results[member_email]) {
        step4Results[member_email] = { email: member_email, [symbol]: balance, total_in_USD: value };
      } else {
        step4Results[member_email][symbol] = balance;
        step4Results[member_email].total_in_USD += value;
      }
    });

    // step5: write data to xlsx
    const filePath = `./${table_name}.xlsx`;
    const data = Object.values(step4Results);
    const unix_timestamp = Math.round((new Date()).getTime() / 1000);
    /*
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, sheet, 'accounts');
    XLSX.writeFile(workbook, filePath);
    */
    const step5Query = `INSERT INTO reports (name, data, created_at) VALUES ('${table_name}', '${JSON.stringify(data)}', ${unix_timestamp});`;
    const [step5Results] = await warehouseDB.query(step5Query);
    
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

const createReports = async () => {
  const job1:Job = {
    table_name: 'accounts_2023_04_01'
  };
  const job2:Job = {
    table_name: 'accounts_2024_02_01'
  };
  await exportAccounts(job1);
  await exportAccounts(job2);
}

const exportXLSXs = async () => {
  const step1Query = `SELECT name, data from reports;`;
  const [step1Results, step1Metadata] = await warehouseDB.query(step1Query);
  
  step1Results.map((result: any) => {
    const name = result.name;
    const data = result.data;
    const summarize = { total_in_USD: 0 };
    data.map((d: any) => {
      summarize.total_in_USD += d.total_in_USD;
      Object.keys(d).map((key: string) => {
        if (key !== 'email' && key !== 'total_in_USD') {
          if (!summarize[key]) {
            summarize[key] = d[key];
          } else {
            summarize[key] += d[key];
          }
        }
      });
    });
    const filePath = `./${name}.xlsx`;
    const workbook = XLSX.utils.book_new();
    const sheet1 = XLSX.utils.json_to_sheet(data);
    const sheet2 = XLSX.utils.json_to_sheet([summarize]);
    XLSX.utils.book_append_sheet(workbook, sheet1, 'accounts');
    XLSX.utils.book_append_sheet(workbook, sheet2, 'summarize');
    XLSX.writeFile(workbook, filePath);
  });
}

// createReports();
exportXLSXs();