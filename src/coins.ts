interface Currency {
  id: number;
  key: string;
  code: string;
  symbol: string;
  coin: boolean;
  blockchain?: string;
  precision?: number;
  visible: boolean;
  disable?: boolean;
  marketing_category?: string;
  self_transfer?: boolean;
}

const currencies: Currency[] = [
  {
    id: 1,
    key: "usdollar",
    code: "usd",
    symbol: "$",
    coin: false,
    blockchain: undefined,
    precision: undefined,
    visible: true,
    disable: false,
    marketing_category: "fiat_currency",
    self_transfer: undefined,
  },
  {
    id: 2,
    key: "satoshi",
    code: "btc",
    symbol: "฿",
    coin: true,
    blockchain: "https://btc.com/tx/#{txid}",
    precision: 4,
    visible: true,
    disable: false,
    marketing_category: "general_cryptocurrency",
    self_transfer: true,
  },
  {
    id: 3,
    key: "ethereum",
    code: "eth",
    symbol: "ETH",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: true,
    disable: false,
    marketing_category: "general_cryptocurrency",
    self_transfer: true,
  },
  {
    id: 4,
    key: "siacoin",
    code: "sc",
    symbol: "SC",
    coin: true,
    blockchain: "http://explore.sia.tech/hash.html?hash=#{txid}",
    precision: undefined,
    visible: false,
    disable: true,
    marketing_category: undefined,
    self_transfer: undefined,
  },
  {
    id: 5,
    key: "digix",
    code: "dgd",
    symbol: "DGD",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 9,
    visible: false,
    disable: true,
    marketing_category: undefined,
    self_transfer: undefined,
  },
  {
    id: 6,
    key: "ethercls",
    code: "etc",
    symbol: "ETC",
    coin: true,
    blockchain: "http://gastracker.io/tx/#{txid}",
    precision: 18,
    visible: true,
    disable: undefined,
    marketing_category: "others",
    self_transfer: false,
  },
  {
    id: 7,
    key: "zcash",
    code: "zec",
    symbol: "ZEC",
    coin: true,
    blockchain: "#",
    precision: 8,
    visible: false,
    disable: true,
    marketing_category: undefined,
    self_transfer: undefined,
  },
  {
    id: 8,
    key: "hongkongdollar",
    code: "hkd",
    symbol: "$",
    coin: false,
    blockchain: undefined,
    precision: undefined,
    visible: true,
    disable: false,
    marketing_category: "fiat_currency",
    self_transfer: undefined,
  },
  {
    id: 9,
    key: "xpa",
    code: "xpa",
    symbol: "XPA",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: true,
    disable: false,
    marketing_category: "recommendation",
    self_transfer: true,
  },
  {
    id: 10,
    key: "newtaiwandollar",
    code: "twd",
    symbol: "NT$",
    coin: false,
    blockchain: undefined,
    precision: undefined,
    visible: false,
    disable: undefined,
    marketing_category: "fiat_currency",
    self_transfer: undefined,
  },
  {
    id: 11,
    key: "japaneseyen",
    code: "jpy",
    symbol: "￥",
    coin: false,
    blockchain: undefined,
    precision: undefined,
    visible: false,
    disable: undefined,
    marketing_category: "fiat_currency",
    self_transfer: undefined,
  },
  {
    id: 12,
    key: "hwan",
    code: "krw",
    symbol: "₩",
    coin: false,
    blockchain: undefined,
    precision: undefined,
    visible: false,
    disable: undefined,
    marketing_category: "fiat_currency",
    self_transfer: undefined,
  },
  {
    id: 13,
    key: "bt1",
    code: "bt1",
    symbol: "BT1",
    coin: true,
    blockchain: "#",
    precision: 18,
    visible: false,
    disable: true,
    marketing_category: undefined,
    self_transfer: undefined,
  },
  {
    id: 14,
    key: "bt2",
    code: "bt2",
    symbol: "BT2",
    coin: true,
    blockchain: "#",
    precision: 18,
    visible: false,
    disable: true,
    marketing_category: undefined,
    self_transfer: undefined,
  },
  {
    id: 15,
    key: "bitcoincash",
    code: "bch",
    symbol: "฿",
    coin: true,
    blockchain: "https://blockchair.com/bitcoin-cash/transaction/#{txid}",
    precision: undefined,
    visible: true,
    disable: undefined,
    marketing_category: "general_cryptocurrency",
    self_transfer: true,
  },
  {
    id: 16,
    key: "litecoin",
    code: "ltc",
    symbol: "Ł",
    coin: true,
    blockchain: "https://live.blockcypher.com/ltc/tx/#{txid}",
    precision: undefined,
    visible: true,
    disable: undefined,
    marketing_category: "general_cryptocurrency",
    self_transfer: true,
  },
  {
    id: 17,
    key: "dash",
    code: "dash",
    symbol: "DASH",
    coin: true,
    blockchain: "https://explorer.dash.org/tx/#{txid}",
    precision: undefined,
    visible: false,
    disable: undefined,
    marketing_category: undefined,
    self_transfer: undefined,
  },
  {
    id: 18,
    key: "qlc",
    code: "qlc",
    symbol: "QLC",
    coin: true,
    blockchain: "",
    precision: 9,
    visible: false,
    disable: undefined,
    marketing_category: undefined,
    self_transfer: undefined,
  },
  {
    id: 19,
    key: "neo",
    code: "neo",
    symbol: "NEO",
    coin: true,
    blockchain: "",
    precision: 9,
    visible: true,
    disable: undefined,
    marketing_category: "others",
    self_transfer: false,
  },
  {
    id: 20,
    key: "cbt",
    code: "cbt",
    symbol: "CBT",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: true,
    disable: undefined,
    marketing_category: "recommendation",
    self_transfer: true,
  },
  {
    id: 21,
    key: "hkx",
    code: "hkx",
    symbol: "HKX",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: true,
    disable: undefined,
    marketing_category: "stable_token",
    self_transfer: true,
  },
  {
    id: 22,
    key: "usx",
    code: "usx",
    symbol: "USX",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: true,
    disable: undefined,
    marketing_category: "stable_token",
    self_transfer: true,
  },
  {
    id: 23,
    key: "eos",
    code: "eos",
    symbol: "EOS",
    coin: true,
    blockchain: "https://node1.blockgenesys.com",
    precision: 4,
    visible: true,
    disable: undefined,
    marketing_category: "general_cryptocurrency",
    self_transfer: false,
  },
  {
    id: 24,
    key: "like",
    code: "like",
    symbol: "LIKE",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: true,
    disable: undefined,
    marketing_category: "others",
    self_transfer: false,
  },
  {
    id: 25,
    key: "xtp",
    code: "xtp",
    symbol: "XTP",
    coin: true,
    blockchain: "",
    precision: 8,
    visible: true,
    disable: undefined,
    marketing_category: "recommendation",
    self_transfer: true,
  },
  {
    id: 26,
    key: "cnx",
    code: "cnx",
    symbol: "CNX",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: true,
    disable: undefined,
    marketing_category: "stable_token",
    self_transfer: true,
  },
  {
    id: 27,
    key: "euro",
    code: "eur",
    symbol: "€",
    coin: false,
    blockchain: undefined,
    precision: undefined,
    visible: true,
    disable: undefined,
    marketing_category: "fiat_currency",
    self_transfer: undefined,
  },
  {
    id: 28,
    key: "eux",
    code: "eux",
    symbol: "EUX",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: true,
    disable: false,
    marketing_category: "stable_token",
    self_transfer: false,
  },
  {
    id: 29,
    key: "turkishlira",
    code: "try",
    symbol: "₺",
    coin: false,
    blockchain: undefined,
    precision: undefined,
    visible: true,
    disable: undefined,
    marketing_category: "fiat_currency",
    self_transfer: undefined,
  },
  {
    id: 30,
    key: "pcw",
    code: "pcw",
    symbol: "PCW",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "commodity_token",
    self_transfer: undefined,
  },
  {
    id: 31,
    key: "pct",
    code: "pct",
    symbol: "PCT",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: true,
    disable: false,
    marketing_category: "consumer_token",
    self_transfer: undefined,
  },
  {
    id: 32,
    key: "ssk",
    code: "ssk",
    symbol: "SSK",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: true,
    disable: false,
    marketing_category: "consumer_token",
    self_transfer: undefined,
  },
  {
    id: 33,
    key: "tbt",
    code: "tbt",
    symbol: "TBT",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: true,
    disable: false,
    marketing_category: "recommendation",
    self_transfer: true,
  },
  {
    id: 34,
    key: "usdt",
    code: "usdt",
    symbol: "USDT",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: true,
    disable: false,
    marketing_category: "general_cryptocurrency",
    self_transfer: true,
  },
  {
    id: 35,
    key: "gold",
    code: "gold",
    symbol: "GOLD",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: true,
    disable: false,
    marketing_category: "stable_token",
    self_transfer: true,
  },
  {
    id: 36,
    key: "fil",
    code: "fil",
    symbol: "FIL",
    coin: true,
    blockchain: "",
    precision: 18,
    visible: true,
    disable: false,
    marketing_category: "general_cryptocurrency",
    self_transfer: false,
  },
  {
    id: 37,
    key: "fmt1t001",
    code: "fmt1t001",
    symbol: "FMT1T001",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "mining_token",
    self_transfer: true,
  },
  {
    id: 38,
    key: "fmt1t002",
    code: "fmt1t002",
    symbol: "FMT1T002",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "mining_token",
    self_transfer: true,
  },
  {
    id: 39,
    key: "fmt1t003",
    code: "fmt1t003",
    symbol: "FMT1T003",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "mining_token",
    self_transfer: true,
  },
  {
    id: 40,
    key: "fmt1t004",
    code: "fmt1t004",
    symbol: "FMT1T004",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "mining_token",
    self_transfer: true,
  },
  {
    id: 41,
    key: "fmt1t005",
    code: "fmt1t005",
    symbol: "FMT1T005",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "mining_token",
    self_transfer: true,
  },
  {
    id: 42,
    key: "fmt1t006",
    code: "fmt1t006",
    symbol: "FMT1T006",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "mining_token",
    self_transfer: true,
  },
  {
    id: 43,
    key: "fmt1t007",
    code: "fmt1t007",
    symbol: "FMT1T007",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "mining_token",
    self_transfer: true,
  },
  {
    id: 44,
    key: "fmt1t008",
    code: "fmt1t008",
    symbol: "FMT1T008",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "mining_token",
    self_transfer: true,
  },
  {
    id: 45,
    key: "fmt1t009",
    code: "fmt1t009",
    symbol: "FMT1T009",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "mining_token",
    self_transfer: true,
  },
  {
    id: 46,
    key: "fmt1t010",
    code: "fmt1t010",
    symbol: "FMT1T010",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "mining_token",
    self_transfer: true,
  },
  {
    id: 47,
    key: "fmt2t001",
    code: "fmt2t001",
    symbol: "FMT2T001",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "mining_token",
    self_transfer: true,
  },
  {
    id: 48,
    key: "fmt2t002",
    code: "fmt2t002",
    symbol: "FMT2T002",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "mining_token",
    self_transfer: true,
  },
  {
    id: 49,
    key: "fmt2t003",
    code: "fmt2t003",
    symbol: "FMT2T003",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "mining_token",
    self_transfer: true,
  },
  {
    id: 50,
    key: "fmt2t004",
    code: "fmt2t004",
    symbol: "FMT2T004",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "mining_token",
    self_transfer: true,
  },
  {
    id: 51,
    key: "fmt2t005",
    code: "fmt2t005",
    symbol: "FMT2T005",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "mining_token",
    self_transfer: true,
  },
  {
    id: 52,
    key: "fmt2t006",
    code: "fmt2t006",
    symbol: "FMT2T006",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "mining_token",
    self_transfer: true,
  },
  {
    id: 53,
    key: "fmt2t007",
    code: "fmt2t007",
    symbol: "FMT2T007",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "mining_token",
    self_transfer: true,
  },
  {
    id: 54,
    key: "fmt2t008",
    code: "fmt2t008",
    symbol: "FMT2T008",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "mining_token",
    self_transfer: true,
  },
  {
    id: 55,
    key: "fmt2t009",
    code: "fmt2t009",
    symbol: "FMT2T009",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "mining_token",
    self_transfer: true,
  },
  {
    id: 56,
    key: "fmt2t010",
    code: "fmt2t010",
    symbol: "FMT2T010",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "mining_token",
    self_transfer: true,
  },
  {
    id: 57,
    key: "fmt3t001",
    code: "fmt3t001",
    symbol: "FMT3T001",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "mining_token",
    self_transfer: true,
  },
  {
    id: 58,
    key: "fmt3t002",
    code: "fmt3t002",
    symbol: "FMT3T002",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "mining_token",
    self_transfer: true,
  },
  {
    id: 59,
    key: "fmt3t003",
    code: "fmt3t003",
    symbol: "FMT3T003",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "mining_token",
    self_transfer: true,
  },
  {
    id: 60,
    key: "fmt3t004",
    code: "fmt3t004",
    symbol: "FMT3T004",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "mining_token",
    self_transfer: true,
  },
  {
    id: 61,
    key: "fmt3t005",
    code: "fmt3t005",
    symbol: "FMT3T005",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "mining_token",
    self_transfer: true,
  },
  {
    id: 62,
    key: "fmt3t006",
    code: "fmt3t006",
    symbol: "FMT3T006",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "mining_token",
    self_transfer: true,
  },
  {
    id: 63,
    key: "fmt3t007",
    code: "fmt3t007",
    symbol: "FMT3T007",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "mining_token",
    self_transfer: true,
  },
  {
    id: 64,
    key: "fmt3t008",
    code: "fmt3t008",
    symbol: "FMT3T008",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "mining_token",
    self_transfer: true,
  },
  {
    id: 65,
    key: "fmt3t009",
    code: "fmt3t009",
    symbol: "FMT3T009",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "mining_token",
    self_transfer: true,
  },
  {
    id: 66,
    key: "fmt3t010",
    code: "fmt3t010",
    symbol: "FMT3T010",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "mining_token",
    self_transfer: true,
  },
  {
    id: 67,
    key: "link",
    code: "link",
    symbol: "LINK",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "defi",
    self_transfer: false,
  },
  {
    id: 68,
    key: "mkr",
    code: "mkr",
    symbol: "MKR",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "defi",
    self_transfer: false,
  },
  {
    id: 69,
    key: "snx",
    code: "snx",
    symbol: "SNX",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "defi",
    self_transfer: false,
  },
  {
    id: 70,
    key: "uni",
    code: "uni",
    symbol: "UNI",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "defi",
    self_transfer: false,
  },
  {
    id: 71,
    key: "sushi",
    code: "sushi",
    symbol: "SUSHI",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "defi",
    self_transfer: false,
  },
  {
    id: 72,
    key: "crv",
    code: "crv",
    symbol: "CRV",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "defi",
    self_transfer: false,
  },
  {
    id: 73,
    key: "oneinch",
    code: "oneinch",
    symbol: "1INCH",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "defi",
    self_transfer: false,
  },
  {
    id: 74,
    key: "bal",
    code: "bal",
    symbol: "BAL",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "defi",
    self_transfer: false,
  },
  {
    id: 75,
    key: "lon",
    code: "lon",
    symbol: "LON",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "defi",
    self_transfer: false,
  },
  {
    id: 76,
    key: "yfi",
    code: "yfi",
    symbol: "YFI",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "defi",
    self_transfer: false,
  },
  {
    id: 77,
    key: "comp",
    code: "comp",
    symbol: "COMP",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "defi",
    self_transfer: false,
  },
  {
    id: 78,
    key: "aave",
    code: "aave",
    symbol: "AAVE",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "defi",
    self_transfer: false,
  },
  {
    id: 79,
    key: "usdc",
    code: "usdc",
    symbol: "USDC",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "general_cryptocurrency",
    self_transfer: false,
  },
  {
    id: 80,
    key: "busd",
    code: "busd",
    symbol: "BUSD",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "general_cryptocurrency",
    self_transfer: false,
  },
  {
    id: 81,
    key: "dai",
    code: "dai",
    symbol: "DAI",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "general_cryptocurrency",
    self_transfer: false,
  },
  {
    id: 82,
    key: "matic",
    code: "matic",
    symbol: "MATIC",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "inno",
    self_transfer: false,
  },
  {
    id: 83,
    key: "ftm",
    code: "ftm",
    symbol: "FTM",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "inno",
    self_transfer: false,
  },
  {
    id: 84,
    key: "ftt",
    code: "ftt",
    symbol: "FTT",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "inno",
    self_transfer: false,
  },
  {
    id: 85,
    key: "mana",
    code: "mana",
    symbol: "MANA",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "inno",
    self_transfer: false,
  },
  {
    id: 86,
    key: "sand",
    code: "sand",
    symbol: "SAND",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "inno",
    self_transfer: false,
  },
  {
    id: 87,
    key: "dydx",
    code: "dydx",
    symbol: "DYDX",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "inno",
    self_transfer: false,
  },
  {
    id: 88,
    key: "alice",
    code: "alice",
    symbol: "ALICE",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "inno",
    self_transfer: false,
  },
  {
    id: 89,
    key: "c98",
    code: "c98",
    symbol: "C98",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "inno",
    self_transfer: false,
  },
  {
    id: 90,
    key: "gala",
    code: "gala",
    symbol: "GALA",
    coin: true,
    blockchain: "https://etherscan.io/tx/#{txid}",
    precision: 18,
    visible: false,
    disable: false,
    marketing_category: "inno",
    self_transfer: false,
  },
];
