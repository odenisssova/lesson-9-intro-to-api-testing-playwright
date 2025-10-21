import { expect } from '@playwright/test'

export class LoanRequestDTO {
  income: number
  debt: number
  age: number
  employed: boolean
  loanAmount: number
  loanPeriod: number

  constructor(
    income: number,
    debt: number,
    age: number,
    employed: boolean,
    loanAmount: number,
    loanPeriod: number,
  ) {
    this.income = income
    this.debt = debt
    this.age = age
    this.employed = employed
    this.loanAmount = loanAmount
    this.loanPeriod = loanPeriod
  }

  static async checkServerResponse(loanData: LoanRequestDTO): Promise<void> {
    expect.soft(loanData.income).toBeGreaterThan(0)
    expect.soft(loanData.debt).toBeGreaterThanOrEqual(0)
    expect.soft(loanData.age).toBeGreaterThan(16)
    expect.soft(typeof loanData.employed).toBe('boolean')
    expect.soft(loanData.loanAmount).toBeGreaterThan(0)
    expect.soft(loanData.loanPeriod).toBeGreaterThan(0)
  }
}
