import { app } from "../server"; // Ensure this path matches your actual server file location
import { Sequelize } from "sequelize";
import "dotenv/config";

const WAREHOUSE_DATABASE_URL = process.env.WAREHOUSE_DATABASE_URL as string;
const warehouseDB = new Sequelize(WAREHOUSE_DATABASE_URL, { logging: false });

app.get("/events", async (req, res) => {
  try {
    let { begin, end, beginId, endId, limit } = req.query;

    // Convert string query parameters to numbers, ensuring 'limit' does not exceed 100
    let _limit = Math.min(Number(limit) || 100, 100),
      _beginId: number,
      _endId: number,
      _begin: number,
      _end: number;

    // Dynamically adjust 'beginId' and 'endId' based on the provided parameters
    if (beginId && !endId) {
      _beginId = Number(beginId);
      _endId = _beginId + _limit - 1;
    } else if (!beginId && endId) {
      _endId = Number(endId);
      _beginId = _endId - _limit + 1;
    }

    let conditions = [];
    if (_beginId && _endId) {
      conditions.push(`id BETWEEN ${_beginId} AND ${_endId}`);
    } else if (begin) {
      // Assuming 'occurred_at' is in UNIX timestamp format
      _begin = Number(begin);
      conditions.push(`occurred_at >= ${_begin}`);
    } else if (end) {
      _end = Number(end);
      conditions.push(`occurred_at <= ${_end}`);
    }

    const whereClause =
      conditions.length > 0 ? conditions.join(" AND ") : "1=1";
    const query = `SELECT * FROM accounting_events WHERE ${whereClause} ORDER BY id LIMIT ${_limit};`;

    const [results, metadata] = await warehouseDB.query(query);
    res.json(results);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
