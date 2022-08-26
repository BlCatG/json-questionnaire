import { access, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { JSON_DATA_PATH } from '$env/static/private'

export const readTaskOrder = async () => {
  const filepath = resolve(JSON_DATA_PATH, 'tasks', '_order.json')
  await access(filepath).catch(async () => {
    await writeFile(filepath, JSON.stringify([]))
  })

  const orderStr = await readFile(filepath, {
    encoding: 'utf-8'
  })

  return JSON.parse(orderStr)
}

export const writeTaskOrder = async (order) => {
  const filepath = resolve(JSON_DATA_PATH, 'tasks', '_order.json')
  await writeFile(filepath, JSON.stringify(order))
}
