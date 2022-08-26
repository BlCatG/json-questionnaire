import { access, mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { json } from '@sveltejs/kit'
import { JSON_DATA_PATH } from '$env/static/private'

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ request }) => {
  const body = await request.json()
  const dir = resolve(JSON_DATA_PATH, 'forms', body.id)
  await access(dir).catch(() => {
    mkdir(dir)
  })

  const filepath = resolve(dir, `${body.realName}.json`)
  await writeFile(filepath, JSON.stringify(body))

  return json({
    code: 0,
    msg: '提交表单成功'
  })
}
