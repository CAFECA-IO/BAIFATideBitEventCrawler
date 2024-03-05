import { Sequelize } from "sequelize";
import "dotenv/config";
import { currencies } from "./constants/coins";
import { markets } from "./constants/markets";
import { EVENT_CODE, EVENT_TYPE, REASON, TYPE } from "./constants/constants";

const WAREHOUSE_DATABASE_URL = process.env.WAREHOUSE_DATABASE_URL as string;
const warehouseDB = new Sequelize(WAREHOUSE_DATABASE_URL, { logging: false });

const currencyMap = currencies.reduce((prev, coin) => {
  prev[coin.id] = coin;
  return prev;
}, {});

const marketMap = markets.reduce((prev, ticker) => {
  prev[ticker.code] = ticker;
  return prev;
}, {});

const account_versions_keys = ["id", "member_id", "account_id", "reason", "balance", "locked", "fee", "amount", "modifiable_id", "modifiable_type", "created_at", "updated_at", "currency", "fun"];
const account_versions_keys_str = account_versions_keys.join(", ");

const events_keys = ["id", "event_code", "type", "details", "occurred_at", "created_at", "account_version_ids"];
const events_keys_str = events_keys.join(", ");

const referral_commissions_keys = ["id", "referred_by_member_id", "market", "currency", "amount", "state", "deposited_at"];
const referral_commissions_keys_str = referral_commissions_keys.join(", ");

const orders_keys = ["id", "bid", "ask", "price", "origin_volume", "type", "member_id", "created_at"];
const orders_keys_str = orders_keys.join(", ");

const trades_keys = ["id", "bid", "ask", "ask_member_id", "bid_member_id", "updated_at"];
const trades_keys_str = trades_keys.join(", ");

const jobs_keys = ["id", "table_name", "sync_id", "parsed_id", "created_at", "updated_at"];
const jobs_keys_str = jobs_keys.join(", ");
interface AccountVersion {
  id: number;
  member_id: number;
  account_id: number;
  reason: number;
  balance: number;
  locked: number;
  fee: number;
  amount: number;
  modifiable_id: number;
  modifiable_type: string;
  created_at: Date;
  updated_at: Date;
  currency: number;
  fun: number;
};

interface TideBitEvent {
  id?: number;
  event_code: string;
  type: string;
  details: string;
  occurred_at: number;
  created_at: number;
  account_version_ids: string;
};

interface Order {
  id: number,
  bid: number,
  ask: number,
  // currency: number,
  price: number,
  // volume: number,
  origin_volume: number,
  // state: number,
  // done_at: Date,
  type: string,
  member_id: number,
  created_at: Date,
  updated_at: Date,
  // sn?: string,
  // source: string,
  // ord_type: string,
  // locked: number,
  // origin_locked: number,
  // funds_received: number,
  // trades_count: number,
}

interface Trade {
  id: number,
  // price: number,
  // volume: number,
  ask_id: number,
  bid_id: number,
  // trend: string,
  currency: number,
  created_at: Date,
  // updated_at: Date,
  ask_member_id: number,
  bid_member_id: number,
  // funds: number,
  // trade_fk: number
}

interface ReferralCommision {
  id: number,
  referred_by_member_id: number,
  trade_member_id: number,
  // voucher_id?: number,
  // applied_plan_id?: number,
  // applied_policy_id?: number,
  // trend: string,
  market: number,
  currency: number,
  // ref_gross_fee: number,
  // ref_net_fee: number,
  amount: number,
  state: string,
  deposited_at?: Date,
  created_at: Date,
  // updated_at: Date,
}

async function convertDeposit(accountVersion: AccountVersion): Promise<TideBitEvent> {
  const currency = currencyMap[accountVersion.currency].code.toUpperCase();
  let tidebitEventCode: string = EVENT_CODE.DEPOSIT[currency];
  console.log(`convertDeposit accountVersion: `, accountVersion)
  const query = `SELECT ${referral_commissions_keys_str} FROM referral_commissions WHERE state = 'deposited' AND referred_by_member_id = ? AND currency = ? AND amount = ? AND deposited_at <= ? LIMIT 1;`;
  const values = [accountVersion.member_id, accountVersion.currency, accountVersion.balance, accountVersion.created_at];
  const [result, metadata] = await warehouseDB.query(query, { replacements: values });
  // Deprecated: debug (20240220 - tzuhan)
  console.log(`convertDeposit result`, result)
  const referralCommision = result[0] as ReferralCommision;
  let tidebitEvnet: TideBitEvent;
  if (referralCommision) {
    const tickerName = marketMap[referralCommision.market].name.replace(
      "/",
      "_"
    );
    tidebitEventCode = EVENT_CODE.REFERRAL_COMMISSION[tickerName];
    tidebitEvnet = {
      event_code: tidebitEventCode ?? EVENT_CODE.UNDEFINED,
      type: EVENT_TYPE.REFERRAL_COMMISSION,
      details: JSON.stringify({
        EP001: referralCommision.amount,
        EP002: 0,
        // EP003: 0,//TODO: exchange rate (20240205 - tzuhan)
        // EP004: 0,//TODO: exchange rate (20240205 - tzuhan)
        // EP005: SafeMath.div(referralCommision.amount, referralCommision.ref_gross_fee),
        EP003: accountVersion.created_at,
      }),
      occurred_at: new Date(accountVersion.created_at).getTime(),
      created_at: new Date().getTime(),
      account_version_ids: JSON.stringify([accountVersion.id]),
    };
  } else {
    tidebitEvnet = {
      event_code: tidebitEventCode ?? EVENT_CODE.UNDEFINED,
      type: EVENT_TYPE.DEPOSIT,
      details: JSON.stringify({
        EP001: accountVersion.balance,
        EP002: accountVersion.fee,
        EP003: 0,
        EP004: accountVersion.created_at,
        EP005: 0, //TODO: exchange rate (20240123 - tzuhan)
      }),
      occurred_at: new Date(accountVersion.created_at).getTime(),
      created_at: new Date().getTime(),
      account_version_ids: JSON.stringify([accountVersion.id]),
    };
  }
  return tidebitEvnet;
}

async function convertWithdraw(
  type: string,
  accountVersion: AccountVersion
): Promise<TideBitEvent> {
  const [result, metadata] = await warehouseDB.query(`SELECT ${account_versions_keys_str} FROM account_versions WHERE modifiable_id = ${accountVersion.modifiable_id} AND reason = ${REASON[`WITHDRAW_FEE${type ? `_${type}` : ""}`]} LIMIT 1;`);
  // Deprecated: debug (20240220 - tzuhan)
  console.log(`convertWithraw result`, result)
  const withdrawFeeAccountVeresion = result[0] as AccountVersion;
  const currency = currencyMap[accountVersion.currency].code.toUpperCase();
  const tidebitEventCode =
    EVENT_CODE[`WITHDRAW${type ? `_${type}` : ""}`][currency];
  const tidebitEvent: TideBitEvent = {
    event_code: tidebitEventCode ?? EVENT_CODE.UNDEFINED,
    type: EVENT_TYPE[`WITHDRAW${type ? `_${type}` : ""}`],
    details: JSON.stringify({
      EP001: Math.abs(+accountVersion.locked),
      EP002: Math.abs(+withdrawFeeAccountVeresion?.locked || 0),
      EP003: 0,
      EP004: accountVersion.created_at,
      EP005: 0, //TODO: exchange rate of withdraw currency (20240123 - tzuhan)
    }),
    occurred_at: new Date(accountVersion.created_at).getTime(),
    created_at: new Date().getTime(),
    account_version_ids: JSON.stringify([
      accountVersion.id,
      withdrawFeeAccountVeresion.id,
    ]),
  };
  return tidebitEvent;
}

async function convertOrder(
  type: string,
  accountVersion: AccountVersion
): Promise<TideBitEvent> {
  let currency1: string, currency2: string, order: Order, tidebitEventCode: string, tidebitEvnet: TideBitEvent;
  // TODO: need orders table (20240220 - tzuhan)
  const [result, metadata] = await warehouseDB.query(`SELECT ${orders_keys_str} FROM orders WHERE id = ${accountVersion.modifiable_id} LIMIT 1;`);
  // Deprecated: debug (20240220 - tzuhan)
  console.log(`convertOrder result`, result)
  order = result[0] as Order;
  if (order.type === TYPE.ORDER_ASK) {
    currency1 = currencyMap[order.ask].code.toUpperCase();
    currency2 = currencyMap[order.bid].code.toUpperCase();
  } else {
    currency1 = currencyMap[order.bid].code.toUpperCase();
    currency2 = currencyMap[order.ask].code.toUpperCase();
  }
  tidebitEventCode = EVENT_CODE[`SPOT_TRADE${type ? `_${type}` : ''}`][`${currency1}_${currency2}`];
  tidebitEvnet = {
    event_code: tidebitEventCode ?? EVENT_CODE.UNDEFINED,
    type: EVENT_TYPE.SPOT_TRADE,
    details: JSON.stringify({
      EP001: Math.abs(+accountVersion.locked),
      EP002:
        order.type === TYPE.ORDER_ASK
          ? +order.price * Math.abs(+accountVersion.locked)
          : order.origin_volume,
      EP003: accountVersion.created_at,
    }),
    occurred_at: new Date(accountVersion.created_at).getTime(),
    created_at: new Date().getTime(),
    account_version_ids: JSON.stringify([accountVersion.id]),
  };
  return tidebitEvnet;
}

async function convertTrade(
  accountVersion: AccountVersion,
  tidebitEvents: TideBitEvent[]
): Promise<TideBitEvent | null> {

  const [result1, metadata1] = await warehouseDB.query(`SELECT ${account_versions_keys_str} FROM account_versions WHERE modifiable_id = ${accountVersion.modifiable_id} AND modifiable_type = '${accountVersion.modifiable_type}';`);
  // Deprecated: debug (20240220 - tzuhan)
  console.log(`convertTrade result1`, result1)
  const accountVersions = result1 as AccountVersion[];
  let existedTidebitEvent = tidebitEvents?.find((tidebitEvent) =>
    JSON.parse(tidebitEvent.account_version_ids).includes(accountVersion.id)
  );
  if (!existedTidebitEvent) {
    let [result2, metadata2] = await warehouseDB.query(`SELECT ${events_keys_str} FROM accounting_events WHERE account_version_ids = "[${accountVersions.sort((a, b) => +a.id - +b.id).map(accV => accV.id).join(',')}]" LIMIT 1;`);
    // Deprecated: debug (20240220 - tzuhan)
    console.log(`convertTrade result2`, result2)
    existedTidebitEvent = result2[0] as TideBitEvent;
  }
  if (existedTidebitEvent) return null;
  const [result3, metadata3] = await warehouseDB.query(`SELECT ${trades_keys_str} FROM trades WHERE id = ${accountVersion.modifiable_id} LIMIT 1;`);
  // Deprecated: debug (20240220 - tzuhan)
  console.log(`convertOrder result3`, result3)
  const trade = result3[0] as Trade;
  const [result4, metadata4] = await warehouseDB.query(`SELECT ${orders_keys_str} FROM orders WHERE id = ${trade.ask_id} LIMIT 1;`);
  // Deprecated: debug (20240220 - tzuhan)
  console.log(`convertOrder result4`, result4)
  const askOrder = result4[0] as Order;
  const [result5, metadata5] = await warehouseDB.query(`SELECT ${orders_keys_str} FROM orders WHERE id = ${trade.bid_id} LIMIT 1;`);
  // Deprecated: debug (20240220 - tzuhan)
  console.log(`convertOrder result5`, result5)
  const bidOrder = result5[0] as Order;
  if (!askOrder || !bidOrder) {
    // Deprecated: [debug] (20240229 - tzuhan)
    console.error(
      `[convertTrade] askOrder or bidOrder is null, accountVersion.modifiable_id:${accountVersion.modifiable_id}, accountVersions`,
      accountVersions
    );
    return null;
  }
  let makerOrder: Order,
    takerOrder: Order,
    currency1: string,
    currency2: string,
    makerAccountVersionSubbed: AccountVersion,
    makerAccountVersionAdded: AccountVersion,
    takerAccountVersionSubbed: AccountVersion,
    takerAccountVersionAdded: AccountVersion;
  if (
    new Date(askOrder.created_at).getTime() >
    new Date(bidOrder.created_at).getTime()
  ) {
    takerOrder = askOrder;
    makerOrder = bidOrder;
  } else {
    takerOrder = bidOrder;
    makerOrder = askOrder;
  }
  if (makerOrder.type === TYPE.ORDER_ASK) {
    currency1 = currencyMap[makerOrder.ask].code.toUpperCase();
    currency2 = currencyMap[makerOrder.bid].code.toUpperCase();
  } else {
    currency1 = currencyMap[makerOrder.bid].code.toUpperCase();
    currency2 = currencyMap[makerOrder.ask].code.toUpperCase();
  }
  makerAccountVersionAdded = accountVersions.find(
    (accountVersion) =>
      accountVersion.reason === REASON.STRIKE_ADD &&
      accountVersion.member_id === makerOrder.member_id
  );
  makerAccountVersionSubbed = accountVersions.find(
    (accountVersion) =>
      accountVersion.reason === REASON.STRIKE_SUB &&
      accountVersion.member_id === makerOrder.member_id
  );
  takerAccountVersionAdded = accountVersions.find(
    (accountVersion) =>
      accountVersion.reason === REASON.STRIKE_ADD &&
      accountVersion.member_id === takerOrder.member_id
  );
  takerAccountVersionSubbed = accountVersions.find(
    (accountVersion) =>
      accountVersion.reason === REASON.STRIKE_SUB &&
      accountVersion.member_id === takerOrder.member_id
  );
  if (
    !makerAccountVersionAdded ||
    !makerAccountVersionSubbed ||
    !takerAccountVersionAdded ||
    !takerAccountVersionSubbed
  ) {
    // Deprecated: [debug] (20240229 - tzuhan)
    console.error(
      `[convertTrade], makerAccountVersionAdded or makerAccountVersionSubbed or takerAccountVersionAdded or takerAccountVersionSubbed is null, accountVersion.modifiable_id:${accountVersion.modifiable_id}, accountVersions`,
      accountVersions
    );
    return null;
  }
  const tidebitEventCode =
    EVENT_CODE.SPOT_TRADE_MATCH[`${currency1}_${currency2}`];
  const tidebitEvnet: TideBitEvent = {
    event_code: tidebitEventCode ?? EVENT_CODE.UNDEFINED,
    type: EVENT_TYPE.SPOT_TRADE_MATCH,
    details: JSON.stringify({
      EP001: Math.abs(+makerAccountVersionSubbed.locked), // 0.101 BTC (maker)
      EP002: Math.abs(+makerAccountVersionAdded.balance), // 2750 USDT (maker)
      EP003: Math.abs(+takerAccountVersionSubbed.locked), // 2800 USDT (taker)
      EP004: Math.abs(+takerAccountVersionAdded.balance), // 0.1 BTC (taker)
      EP005: 0, //TODO: 交易時匯率 1 USDT = 1.01 USD (20240129 - tzuhan)
      EP006: 0, //TODO: 交易時匯率 1 BTC = 25000 USD (20240129 - tzuhan)
      EP007: takerAccountVersionAdded.fee, // 內扣手續費 0.001 BTC (taker)
      EP008: 0, // 外扣手續費 10 USDT (taker)
      EP009: makerAccountVersionAdded.fee, // 內扣手續費 20 USDT (maker)
      EP010: 0, // 外扣手續費 0.002 BTC (maker)
    }),
    occurred_at: new Date(accountVersion.created_at).getTime(),
    created_at: new Date().getTime(),
    account_version_ids: JSON.stringify([
      makerAccountVersionAdded.id,
      makerAccountVersionSubbed.id,
      takerAccountVersionAdded.id,
      takerAccountVersionSubbed.id,
    ]),
  };
  return tidebitEvnet;
}

async function convertOrderFullfilled(
  accountVersion: AccountVersion
): Promise<TideBitEvent> {
  let currency1: string, currency2: string, order: Order, tidebitEventCode: string, tidebitEvnet: TideBitEvent;
  const [result1, metadata1] = await warehouseDB.query(`SELECT ${trades_keys_str} FROM trades WHERE id = ${accountVersion.modifiable_id} LIMIT 1;`);
  // Deprecated: debug (20240220 - tzuhan)
  console.log(`convertOrder result1`, result1)
  const trade = result1[0] as Trade;
  if (accountVersion.member_id === trade.ask_member_id) {
    const [result2, metadata2] = await warehouseDB.query(`SELECT ${orders_keys_str} FROM orders WHERE id = ${trade.ask_id} LIMIT 1;`);
    // Deprecated: debug (20240220 - tzuhan)
    console.log(`convertOrder result2`, result2)
    order = result2[0] as Order;
  }
  if (accountVersion.member_id === trade.bid_member_id) {
    const [result3, metadata3] = await warehouseDB.query(`SELECT ${orders_keys_str} FROM orders WHERE id = ${trade.bid_id} LIMIT 1;`);
    // Deprecated: debug (20240220 - tzuhan)
    console.log(`convertOrder result3`, result3)
    order = result3[0] as Order;
  }
  if (order.type === TYPE.ORDER_ASK) {
    currency1 = currencyMap[order.ask].code.toUpperCase();
    currency2 = currencyMap[order.bid].code.toUpperCase();
  } else {
    currency1 = currencyMap[order.bid].code.toUpperCase();
    currency2 = currencyMap[order.ask].code.toUpperCase();
  }
  tidebitEventCode =
    EVENT_CODE.SPOT_TRADE_FULLFILL[`${currency1}_${currency2}`];
  tidebitEvnet = {
    event_code: tidebitEventCode ?? EVENT_CODE.UNDEFINED,
    type: EVENT_TYPE.SPOT_TRADE_FULLFILL,
    details: JSON.stringify({
      EP001: accountVersion.balance,
      EP002: accountVersion.created_at,
    }),
    occurred_at: new Date(accountVersion.created_at).getTime(),
    created_at: new Date().getTime(),
    account_version_ids: JSON.stringify([accountVersion.id]),
  };
  return tidebitEvnet;
}

async function eventParser(
  accountVersion: AccountVersion,
  tidebitEvents: TideBitEvent[],
): Promise<TideBitEvent | null> {
  switch (accountVersion.reason) {
    case REASON.DEPOSIT:
      return convertDeposit(accountVersion);
    case REASON.WITHDRAW_LOCK:
      // case REASON.WITHDRAW_FEE_LOCK:
      return convertWithdraw("LOCK", accountVersion);
    case REASON.WITHDRAW:
      // case REASON.WITHDRAW_FEE:
      return convertWithdraw(null, accountVersion);
    case REASON.WITHDRAW_UNLOCK:
      // case REASON.WITHDRAW_FEE_UNLOCK:
      return convertWithdraw("UNLOCK", accountVersion);
    case REASON.ORDER_SUBMIT:
      return convertOrder(null, accountVersion);
    case REASON.ORDER_CANCEL:
      return convertOrder("CANCEL", accountVersion);
    case REASON.STRIKE_ADD:
      // case REASON.STRIKE_SUB: // Info: 只要有 add 就好有對應的 sub，降低耗能 (20240201 - tzuhan)
      // case REASON.STRIKE_UNLOCK:// Info: 不知道為什麼會有 STRIKE_UNLOCK 的 accountVersion 跟 ORDER_FULLFILLED 的區別是？ 遍歷目前的 account_versions 沒有找到對應 reason(20240201 - tzuhan)
      return convertTrade(accountVersion, tidebitEvents);
    case REASON.ORDER_FULLFILLED:
      return convertOrderFullfilled(accountVersion);
    default:
      return null;
  }
}

async function doJob() {
  const t = await warehouseDB.transaction();
  try {
    let keepGo = false;
    const table_name = 'account_versions';
    const count = 10000;

    // step1: read job status from warehouse
    const step1Query = `SELECT ${jobs_keys_str} FROM jobs WHERE table_name = '${table_name}';`;
    const [jobStatus, jobStatusMetadata] = await warehouseDB.query(step1Query);
    const jobStartId: number = (jobStatus[0] as { parsed_id: number })?.parsed_id || 0;
    console.log(`doJob, jobStartId: ${jobStartId}`);

    // step1.1: check latest id from warehouse
    const [latestIdResults, latestIdMetadata] = await warehouseDB.query(`SELECT MAX(id) as id FROM account_versions;`);
    const latestId: number = (latestIdResults[0] as { id: number })?.id || 0;
    console.log(`doJob, latestId: ${latestId}`);
    if (latestId > jobStartId) {
      const startId: number = jobStartId;
      const endId: number = startId + count;

      // step2: read data from source
      const [results, metadata] = await warehouseDB.query(`SELECT ${account_versions_keys_str} FROM account_versions WHERE id > ${startId} AND id <= ${endId};`);

      // step3: convert account version to TideBit event
      const tidebitEvents = [];
      for (const accountVersion of results) {
        const tidebitEvent = await eventParser(accountVersion as AccountVersion, [...tidebitEvents]);
        if (!!tidebitEvent) tidebitEvents.push(tidebitEvent);
      }
      // step4: write data to warehouse
      if (tidebitEvents.length > 0) {
        const step4Values = tidebitEvents.map((result: any) => {
          return `(${result.event_code}, ${result.type}, ${result.details}, ${result.occurred_at}, ${result.created_at}, ${result.account_version_ids})`;
        });
        const step4Query = `INSERT INTO accounting_events (event_code, type, details, occurred_at, created_at, account_version_ids) VALUES ${step4Values.join(',')};`;
        const [step4Results] = await warehouseDB.query(step4Query, { transaction: t });
      }

      // step5: update or insert job status
      keepGo = endId <  latestId;
      const currentEndId: number = keepGo ? (results[results.length - 1] as { id: number })?.id : startId;
      const unix_timestamp = Math.round(new Date().getTime() / 1000);
      const step5Query = `INSERT INTO jobs (table_name, sync_id, parsed_id, created_at, updated_at) VALUES ('${table_name}', ${(jobStatus[0] as { sync_id: number })?.sync_id || 0}, ${currentEndId}, ${unix_timestamp}, ${unix_timestamp}) ON CONFLICT(table_name) DO UPDATE SET parsed_id = ${currentEndId}, updated_at = ${unix_timestamp};`;
      const [step5Results] = await warehouseDB.query(step5Query, { transaction: t });

      await t.commit(); // Commit the transaction
      
      // step5: return if continue or not
      const currentCount = results.length;
      const time = new Date().toTimeString().split(" ")[0];
      console.log(`parsed ${startId} - ${endId} (${currentCount} records) at ${time}`);
    }
    console.log(`doJob, keepGo: ${keepGo}`);
    return keepGo;
  } catch (error) {
    await t.rollback(); // Roll back the transaction in case of error
    console.error(error);
    return false;
  }
}


async function sleep(ms: number = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function parser() {
  let keepGo = await doJob();
  while (keepGo) {
    await sleep();
    keepGo = await doJob();
  }

  warehouseDB.close();
  await sleep(3600000);
}