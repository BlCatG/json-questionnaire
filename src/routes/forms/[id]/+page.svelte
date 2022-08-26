<script>
  import Textfield from '@smui/textfield'
  import Button, { Label } from '@smui/button'
  import { onMount } from 'svelte'
  import { client } from '$lib/api'
  import Select, { Option } from '@smui/select'

  export let data

  let largeCount = 0
  let smallCount = 0
  let task = {
    name: '名字',
    sets: [],
    searchKeys: [],
    largeUnit: '盒',
    smallUnit: '剂'
  }

  onMount(async () => {
    const res = await client.get(`/tasks/${data.id}`)
    task = res.data
  })

  let options = []
  $: {
    options = []
    task.sets.forEach(({ options: _options, name }) => {
      _options.forEach((option, index) => {
        options[index] = {
          ...(options[index] || {}),
          ...{
            index,
            [name]: option
          }
        }
      })
    })
    console.log(options)
  }

  let index = -1

  let form = []
  const handleClickAddButton = (index) => {
    form.push({
      index,
      largeCount,
      smallCount
    })
    form = form
    largeCount = 0
    smallCount = 0
  }

  const handleClickSubmitButton = async () => {
    await client.post('/forms', {
      id: data.id,
      realName,
      form
    })

    alert('提交成功')
  }

  let realName = ''
</script>

<div style="display: flex; flex-direction: column">
  <Textfield variant="outlined" bind:value={realName} label="真实姓名" />
  <span>{task.name}</span>
  <div>搜索框</div>
  <Select bind:value={index}>
    <Option value="-1" />
    {#each options as option, index}
      <Option value={index}>{option[task.searchKeys[0]]}</Option>
    {/each}
  </Select>
  <span>已选药名: {options[index] && options[index][task.searchKeys[0]]}</span>
  <div style="diaplay: flex">
    <Textfield variant="outlined" type="number" bind:value={largeCount} />
    <span>{options[index] && options[index][task.largeUnit]}</span>
    <Textfield variant="outlined" type="number" bind:value={smallCount} />
    <span>{options[index] && options[index][task.smallUnit]}</span>
  </div>
  <div style="diaplay: flex">
    <Button>
      <Label>取消</Label>
    </Button>
    <Button on:click={() => handleClickAddButton(index)}>
      <Label>添加</Label>
    </Button>
  </div>
  <span>已添加药品数量: {form.length}</span>
  <Button on:click={handleClickSubmitButton}>
    <Label>提交</Label>
  </Button>
</div>

<style lang="scss"></style>
