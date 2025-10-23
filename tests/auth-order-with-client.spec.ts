import { expect, test } from '@playwright/test'
import { ApiClient } from '../src/ApiClient'

test('login and create order with api client', async ({ request }) => {
  const apiClient = await ApiClient.create(request)
  const orderId = await apiClient.createOrderAndReturnOrderId()
  console.log('orderId:', orderId)
})

test('get orders with api client', async ({ request }) => {
  const apiClient = await ApiClient.create(request)
  const ordersBefore = await apiClient.getOrders()
  await apiClient.createOrderAndReturnOrderId()
  const ordersAfter = await apiClient.getOrders()
  expect(ordersBefore.length < ordersAfter.length).toBeTruthy()
})

test('get and delete order with api client', async ({ request }) => {
  const apiClient = await ApiClient.create(request)
  const orderId = await apiClient.createOrderAndReturnOrderId()
  console.log('orderId:', orderId)
  const order = await apiClient.getOrderById(orderId)
  expect(order.id).toBe(orderId)
  await apiClient.deleteOrderById(orderId)
  const deleteOrder = await apiClient.getOrderById(orderId)
  console.log('orderId:', deleteOrder)
  expect(deleteOrder.id).toBeUndefined()
})
