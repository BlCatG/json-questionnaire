import { client } from '$lib/api'

/** @type {import('./$types').LayoutLoad} */
export const load = async (e) => {
  const { data: tasks } = await client.get('/tasks')

  return {
    tasks
  }
}
