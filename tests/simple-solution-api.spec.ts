import { expect, test } from '@playwright/test'
import Ajv from 'ajv'
import { StatusCodes } from 'http-status-codes'
import { OrderDTO } from './dto/OrderDTO'

import { orderSchema } from './dto/order-schema'

const BASE_URL = 'https://backend.tallinn-learning.ee/test-orders'

const ajv = new Ajv()
const validate = ajv.compile(orderSchema)

const requestHeaders = {
  api_key: '1234567890123456',
}

// GET
test('get order with correct id should receive code 200', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/1`) // .get(BASE_URL + '/1')
  expect(response.status()).toBe(StatusCodes.OK)
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
})
//DELETE
test('delete existing order should receive code 204', async ({ request }) => {
  const response = await request.delete(`${BASE_URL}/2`, {
    headers: requestHeaders,
  })
  expect(response.status()).toBe(StatusCodes.NO_CONTENT)
})

//test('post order with correct data should receive code 200', async ({ request }) => {
//   const requestBody = OrderDTO.createOrderWithRandomData()
//   const response = await request.post(BASE_URL, {
//     data: requestBody,
//   })
//
//   const responseData: OrderDTO = await response.json()
//   const valid = validate(responseData)
//   expect.soft(valid).toBeTruthy()
//   expect.soft(response.status()).toBe(StatusCodes.OK)
//   OrderDTO.checkServerResponse(responseData)
// })
