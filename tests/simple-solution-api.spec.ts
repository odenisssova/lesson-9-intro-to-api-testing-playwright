import { expect, test } from '@playwright/test'

import { StatusCodes } from 'http-status-codes'

const BASE_URL = 'https://backend.tallinn-learning.ee/test-orders'
const requestHeaders = {
  api_key: '1234567890123456',
}

// GET
test('get order with correct id should receive code 200', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/1`) // .get(BASE_URL + '/1')
  expect(response.status()).toBe(StatusCodes.OK)
  console.log('GET response status:', response.status())
})

test('get order with incorrect id should receive code 400', async ({ request }) => {
  const responseOrderId0 = await request.get(`${BASE_URL}/0`)
  const responseOrderId11 = await request.get(`${BASE_URL}/11`)
  const responseOrderIdNull = await request.get(`${BASE_URL}/null`)
  const responseOrderIdTest = await request.get(`${BASE_URL}/test`)

  expect(responseOrderId0.status()).toBe(StatusCodes.BAD_REQUEST)
  expect(responseOrderId11.status()).toBe(StatusCodes.BAD_REQUEST)
  expect(responseOrderIdNull.status()).toBe(StatusCodes.BAD_REQUEST)
  expect(responseOrderIdTest.status()).toBe(StatusCodes.BAD_REQUEST)
})

// PUT
test('put order with incorrect id should receive code 200', async ({ request }) => {
  const updateOrder = {
    status: 'OPEN',
    courierId: 2,
    customerName: 'Olga',
    customerPhone: '+37255511122',
    comment: 'Order updated successfully',
    id: 1,
  }

  const response = await request.put(`${BASE_URL}/2`, {
    headers: requestHeaders,
    data: updateOrder,
  })
  expect(response.status()).toBe(StatusCodes.OK)
  console.log('PUT response status:', response.status())
})
//DELETE
test('delete existing order should receive code 204', async ({ request }) => {
  const response = await request.delete(`${BASE_URL}/2`, {
    headers: requestHeaders,
  })
  expect(response.status()).toBe(StatusCodes.NO_CONTENT)
  console.log('DELETE response status:', response.status())
})
