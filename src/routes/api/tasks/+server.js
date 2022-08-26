import { access, mkdir, writeFile, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { json } from '@sveltejs/kit'
import { JSON_DATA_PATH } from '$env/static/private'
import cryptoRandomString from 'crypto-random-string'
import { readTaskOrder, writeTaskOrder } from '../tools'

export const GET = async () => {
  const dirpath = resolve(JSON_DATA_PATH, 'tasks')
  const order = await readTaskOrder()

  const data = []
  for (const filename of order) {
    const filepath = resolve(dirpath, `${filename}.json`)
    const jsonStr = await readFile(filepath, {
      encoding: 'utf-8'
    })
    data.push({
      id: filename,
      name: JSON.parse(jsonStr).name
    })
  }

  return json({
    code: 0,
    msg: '获取所有任务ID和名称成功',
    data
  })
}

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ request }) => {
  const body = await request.json()
  const dir = resolve(JSON_DATA_PATH, './tasks')

  await access(dir).catch(() => {
    mkdir(dir)
  })

  const filename = cryptoRandomString({ length: 5, type: 'url-safe' })
  let filepath = resolve(dir, `${filename}.json`)
  while (true) {
    try {
      await access(filepath)
      filepath = resolve(dir, `${filename}.json`)
    } catch {
      break
    }
  }

  await writeFile(filepath, JSON.stringify(body))

  const order = await readTaskOrder()
  order.push(filename)
  await writeTaskOrder(order)

  return json({
    code: 0,
    msg: '创建任务成功'
  })
}
