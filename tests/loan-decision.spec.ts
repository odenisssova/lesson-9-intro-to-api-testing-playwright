import { expect, test } from '@playwright/test'
import Ajv from 'ajv'
import { StatusCodes } from 'http-status-codes'
import { LoanRequestDTO } from './dto/LoanRequestDTO'
import { loanDecisionSchema } from './dto/loan-decision-schema'

const BASE_URL = 'https://backend.tallinn-learning.ee/api/loan-calc/decision'
const ajv = new Ajv()
const validate = ajv.compile(loanDecisionSchema)
const requestHeaders = {
  api_key: '1234567890123456',
}

function checkPeriods(periods: number[], allowed: number[]) {
  expect.soft(Array.isArray(periods)).toBeTruthy()
  if (periods.length > 0) {
    for (const p of periods) {
      expect.soft(allowed.includes(p)).toBeTruthy()
    }
  }
}

test('1) Low risk (positive decision)', async ({ request }) => {
  const body = new LoanRequestDTO(8500, 500, 28, true, 800, 12)
  LoanRequestDTO.checkServerResponse(body)
  const response = await request.post(BASE_URL, {
    headers: requestHeaders,
    data: body,
  })
  expect.soft(response.status()).toBe(StatusCodes.OK)
  const json = await response.json()
  expect.soft(validate(json)).toBeTruthy()
  expect.soft(json.riskLevel).toBe('Low Risk')
  expect.soft(json.riskDecision).toBe('positive')
  checkPeriods(json.riskPeriods, [12, 18, 24, 30, 36])
})

test('2) Medium risk (positive decision)', async ({ request }) => {
  const body = new LoanRequestDTO(4500, 1000, 35, true, 1200, 9)
  LoanRequestDTO.checkServerResponse(body)
  const response = await request.post(BASE_URL, {
    headers: requestHeaders,
    data: body,
  })
  expect.soft(response.status()).toBe(StatusCodes.OK)
  const json = await response.json()
  expect.soft(validate(json)).toBeTruthy()
  expect.soft(json.riskLevel).toBe('Medium Risk')
  expect.soft(json.riskDecision).toBe('positive')
  checkPeriods(json.riskPeriods, [6, 9, 12])
})

test('3) High risk (positive decision)', async ({ request }) => {
  const body = new LoanRequestDTO(800, 200, 22, true, 2000, 6)
  LoanRequestDTO.checkServerResponse(body)
  const response = await request.post(BASE_URL, {
    headers: requestHeaders,
    data: body,
  })
  expect.soft(response.status()).toBe(StatusCodes.OK)
  const json = await response.json()
  expect.soft(validate(json)).toBeTruthy()
  expect.soft(json.riskLevel).toBe('High Risk')
  expect.soft(json.riskDecision).toBe('positive')
  checkPeriods(json.riskPeriods, [3, 6])
})

test('4) Very high risk (negative)', async ({ request }) => {
  const body = new LoanRequestDTO(500, 1800, 17, true, 2500, 6)
  const response = await request.post(BASE_URL, {
    headers: requestHeaders,
    data: body,
  })
  expect.soft(response.status()).toBe(StatusCodes.OK)
  const json = await response.json()
  expect.soft(validate(json)).toBeTruthy()
  expect.soft(json.riskLevel).toBe('Very High Risk')
  expect.soft(json.riskDecision).toBe('negative')
  checkPeriods(json.riskPeriods, [3, 6])
})

test('5) Invalid — zero income -> 400', async ({ request }) => {
  const body = new LoanRequestDTO(0, 100, 30, true, 1000, 12)
  const response = await request.post(BASE_URL, {
    headers: requestHeaders,
    data: body,
  })
  expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST)
})

test('6) Invalid — negative debt -> 400', async ({ request }) => {
  const body = new LoanRequestDTO(3000, -50, 32, true, 800, 12)
  const response = await request.post(BASE_URL, {
    headers: requestHeaders,
    data: body,
  })
  expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST)
})

test('7) Underage applicant (rule not enforced)', async ({ request }) => {
  const body = new LoanRequestDTO(100, 0, 15, true, 600, 6)
  const response = await request.post(BASE_URL, {
    headers: requestHeaders,
    data: body,
  })
  expect.soft(response.status()).toBe(StatusCodes.OK)
  const json = await response.json()
  expect.soft(validate(json)).toBeTruthy()
  expect.soft(json.riskLevel).toBe('High Risk')
  expect.soft(json.riskDecision).toBe('positive')
  checkPeriods(json.riskPeriods, [3, 6])
})

test('8) Unemployed applicant', async ({ request }) => {
  const body = new LoanRequestDTO(100, 0, 60, false, 1000, 12)
  const response = await request.post(BASE_URL, {
    headers: requestHeaders,
    data: body,
  })
  expect.soft(response.status()).toBe(StatusCodes.OK)
  const json = await response.json()
  expect.soft(validate(json)).toBeTruthy()
  expect.soft(json.riskLevel).toBe('Very High Risk')
  expect.soft(json.riskDecision).toBe('negative')
  checkPeriods(json.riskPeriods, [12, 18, 24, 30, 36])
})
