import { Injectable } from "@nestjs/common";
import { Sequelize } from "sequelize";

import "dotenv/config";

const WAREHOUSE_DATABASE_URL = process.env.WAREHOUSE_DATABASE_URL as string;
const warehouseDB = new Sequelize(WAREHOUSE_DATABASE_URL, { logging: false });

export interface TideBitEventDto {
  id: number;
  eventCode: string;
  type: string;
  details: string;
  occurredAt: number;
  createdAt: number;
}

@Injectable()
export class AppService {
  private readonly DEFAULT_LIMIT = 100;
  async listEvents(query: {
    begin?: number;
    end?: number;
    beginId?: number;
    endId?: number;
    limit?: number;
  }): Promise<TideBitEventDto[]> {
    let events: TideBitEventDto[] = [];
    try {
      let { begin, end, beginId, endId, limit } = query;
      let _limit = Math.min(Number(limit) || 100, 100),
        _beginId: number,
        _endId: number,
        _begin: number,
        _end: number;
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
      const queryString = `SELECT * FROM accounting_events WHERE ${whereClause} ORDER BY id LIMIT ${_limit};`;
      const [results, metadata] = await warehouseDB.query(queryString);
      events = results
        ? results.map((result: any) => ({
            id: result.id,
            occurredAt: result.occurred_at,
            type: result.type,
            amount: result.amount,
            eventCode: result.event_code, // Added 'eventCode' property
            details: result.details,
            occurred_at: result.occurred_at,
            createdAt: result.created_at, // Added 'createdAt' property
          }))
        : [];
    } catch (error) {
      console.error("Error fetching events:", error);
    }
    return events;
  }
}
