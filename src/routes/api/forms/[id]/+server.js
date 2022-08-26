import { readdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { json } from '@sveltejs/kit'
import { JSON_DATA_PATH } from '$env/static/private'

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ params: { id } }) => {
  const dir = resolve(JSON_DATA_PATH, 'forms', id)
  const filenames = await readdir(dir)
  const forms = []

  for (const filename of filenames) {
    const filepath = resolve(dir, filename)
    const jsonStr = await readFile(filepath, {
      encoding: 'utf-8'
    })

    forms.push(JSON.parse(jsonStr))
  }

  return json({
    code: 0,
    msg: `获取任务${id}的所有已提交表单成功`,
    data: forms
  })
}
