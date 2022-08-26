import { client } from '$lib/api'

/** @type {import('./$types').PageLoad} */
export const load = async ({ params }) => {
  const { id } = params

  return {
    task: (await client.get(`/tasks/${id}`)).data,
    data: (await client.get(`/forms/${id}`)).data
  }
}
