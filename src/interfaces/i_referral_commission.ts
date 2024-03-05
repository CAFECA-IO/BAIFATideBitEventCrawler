export interface ReferralCommision {
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
  