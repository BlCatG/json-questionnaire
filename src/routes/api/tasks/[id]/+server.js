import { json } from '@sveltejs/kit'
import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'
import { JSON_DATA_PATH } from '$env/static/private'

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ params: { id } }) => {
  const filepath = resolve(JSON_DATA_PATH, './tasks', `${id}.json`)
  const jsonStr = await readFile(filepath, {
    encoding: 'utf-8'
  })

  return json({
    code: 0,
    msg: `获取任务${id}成功`,
    data: JSON.parse(jsonStr)
  })
}
