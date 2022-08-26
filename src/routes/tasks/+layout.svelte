<script>
  import TopAppBar, { Row, Title, Section } from '@smui/top-app-bar'
  import Drawer, { AppContent, Content } from '@smui/drawer'
  import List, { Item, Text, Separator } from '@smui/list'
  import IconButton from '@smui/icon-button'
  import Button, { Label } from '@smui/button'
  import Dialog, { Header, Title as DialogTitle, Content as DialogContent } from '@smui/dialog'
  import { goto } from '$app/navigation'
  import Table from './_Table.svelte'
  import Textfield from '@smui/textfield'
  import Select, { Option } from '@smui/select'
  import { trim, compact, cloneDeep } from 'lodash'
  import Checkbox from '@smui/checkbox'
  import FormField from '@smui/form-field'
  import Radio from '@smui/radio'
  import { client } from '$lib/api'

  export let data

  let title = '任务管理'
  const handleClickItem = (id, name) => {
    title = name
    goto(`/tasks/${id}`)
  }

  let open = false
  let stage = 0

  let fileInput
  let xlsx = null
  const handleChangeInput = (e) => {
    const [file] = fileInput.files
    xlsx = file
    stage++
  }

  let col = []
  const handleSelect = (e) => {
    col = e.detail.col
  }

  let label = ''
  let range = ''
  let pickedCol = []
  $: {
    pickedCol = []
    if (range === '') {
      pickedCol = col
    } else {
      const ranges = range.split(',').map(trim)
      ranges.forEach((v) => {
        const num = Number(v)
        if (isNaN(num)) {
          const reg = /^(\d+)-(\d*)$/
          if (reg.test(v)) {
            let [, begin, end] = v.match(reg)
            if (end === '') end = String(col.length)
            for (let i = Number(begin) - 1; i <= Number(end) - 1; i++) {
              pickedCol[i] = col[i]
            }
          } else {
            // TODO 自定义范围格式错误提示
            console.log('无法识别' + v)
            return
          }
        } else {
          pickedCol[num] = col[num - 1]
        }
      })

      pickedCol = compact(pickedCol)
      console.log(pickedCol)
    }
  }

  const defaultTask = {
    name: '',
    sets: [],
    searchKeys: [],
    largeUnit: '',
    smallUnit: ''
  }
  let task = cloneDeep(defaultTask)
  const handleClickAddButton = (name, options) => {
    if (name === '') return
    task.sets.push({
      name,
      options
    })
    task.sets = task.sets

    label = ''
  }
  const handleClickCancelButton = () => {
    label = ''
    range = ''
  }

  let loading = false
  const handleClickFinishButton = async () => {
    loading = true
    await client.post('/tasks', task)
    loading = false
    // TODO 提示创建任务成功
    open = false
    stage = 0
    xlsx = null
    col = []
    range = ''
    label = ''
    task = cloneDeep(defaultTask)
  }
</script>

<div class="layout">
  <Drawer>
    <Content class="content">
      <h1>任务列表</h1>

      <Button class="button" variant="raised" on:click={() => (open = true)}>
        <Label>添加任务</Label>
      </Button>

      <List>
        {#each data.tasks as { id, name }}
          <Item on:click={() => handleClickItem(id, name)}>
            <Text>{name}</Text>
          </Item>
        {/each}
      </List>
    </Content>
  </Drawer>

  <AppContent class="app-content">
    <div class="mdc-elevation--z4">
      <TopAppBar class="top-app-bar " variant="static">
        <Row>
          <Section>
            <!-- <IconButton class="material-icons" aria-label="Open the menu">menu_open</IconButton> -->
            <Title>{title}</Title>
          </Section>
        </Row>
      </TopAppBar>
    </div>

    <div style="overflow: auto">
      <slot />
    </div>
  </AppContent>

  <Dialog
    bind:open
    fullscreen
    aria-labelledby="fullscreen-title"
    aria-describedby="fullscreen-content"
  >
    <Header style="justify-content: space-between">
      {#if stage === 0}
        <IconButton class="material-icons" style="color: red" on:click={() => (open = false)}>
          close
        </IconButton>
      {:else}
        <IconButton class="material-icons" on:click={() => stage--}>navigate_before</IconButton>
      {/if}

      <DialogTitle id="fullscreen-title">{stage === 0 ? '添加任务' : '确认任务'}</DialogTitle>

      {#if stage < 2}
        <IconButton
          class="material-icons"
          style="color: green"
          on:click={() => stage++}
          disabled={task.sets.length < 1}
        >
          navigate_next
        </IconButton>
      {:else}
        <IconButton class="material-icons" style="color: green" on:click={handleClickFinishButton}>
          done
        </IconButton>
      {/if}
    </Header>

    <DialogContent id="fullscreen-content">
      {#if stage === 0}
        <div class="file-container">
          <IconButton class="add-button material-icons" on:click={() => fileInput.click()}>
            add
          </IconButton>
          <span>请选择<code>.xlsx</code>文件</span>

          <input
            type="file"
            style="display: none"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            bind:this={fileInput}
            on:change={handleChangeInput}
          />
        </div>
      {:else if stage === 1}
        <div class="table-container">
          <Table bind:xlsx on:select={handleSelect} />
          <div class="input-container">
            <Textfield variant="filled" bind:value={range} label="自定义范围(请保持范围一致)" />
            <Textfield variant="filled" bind:value={label} label="字段名" />
            <span>预览选中项</span>
            <span>
              已选[{pickedCol[0] || ''}...{pickedCol[pickedCol.length - 1] || ''}], 共{pickedCol.length}个
            </span>
            <List style="height: 100px; overflow: auto" dense nonInteractive>
              {#each pickedCol as v}
                <Item><Text>{v}</Text></Item>
              {:else}
                <span>空</span>
              {/each}
            </List>
            <div style="display: flex">
              <Button on:click={handleClickCancelButton}>
                <Label>取消</Label>
              </Button>
              <Button on:click={() => handleClickAddButton(label, pickedCol)}>
                <Label>添加</Label>
              </Button>
            </div>
          </div>
        </div>
      {:else}
        <div style="display: flex; flex-direction: column">
          <Textfield variant="filled" bind:value={task.name} label="任务名称" />

          <div style="display: flex">
            <span>哪些选中项可以被搜索到?</span>
            {#each task.sets as { name }}
              <FormField>
                <Checkbox bind:group={task.searchKeys} value={name} />
                <span slot="label">{name}</span>
              </FormField>
            {/each}
          </div>

          <div style="display: flex">
            <span>请选择大单位</span>
            {#each task.sets as { name }}
              <FormField>
                <Radio bind:group={task.largeUnit} value={name} />
                <span slot="label">{name}</span>
              </FormField>
            {/each}
          </div>
          <div style="display: flex">
            <span>请选择小单位</span>
            {#each task.sets as { name }}
              <FormField>
                <Radio bind:group={task.smallUnit} value={name} />
                <span slot="label">{name}</span>
              </FormField>
            {/each}
          </div>
        </div>
      {/if}
    </DialogContent>
  </Dialog>
</div>

<style lang="scss">
  /*
    The @use rule loads mixins, functions, and variables from other Sass stylesheets, and combines CSS from multiple stylesheets together.
    see https://sass-lang.com/documentation/at-rules/use
  */
  @use '@material/elevation/mdc-elevation';

  .layout {
    display: flex;
    height: 100vh;
  }

  // see CSS Modules
  :global(.app-content) {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  :global(.content) {
    display: flex;
    flex-direction: column;
  }

  :global(.button) {
    align-self: center;
    width: 90%;
  }

  :global(.add-button) {
    height: 200px;
    width: 200px;
    font-size: 32px;
    background-color: #f5f5f5;

    /*
      这里踩了一个坑,
      举个例子, 32px的border-radius在scale后实际上并不是32px
      因为, border-radius的原理就是用给出的半径确定一个椭圆，椭圆与边框相切，椭圆与边框相切的两点之间的椭圆部分作为边框圆角
      即在scale的过程中, 可以认为辅助椭圆也在变大变小
      而SMUI实现的ripple, 对::before伪元素和::after伪元素用到了scale
      所以直接设置border-radius为固定px并不能满足我的需求
    */
    $radius: 10% !important;
    border-radius: $radius;
    @each $e in '::before', '::after' {
      > :global(*#{$e}) {
        box-sizing: border-box;
        border-radius: $radius;
      }
    }
  }

  .file-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    span {
      position: absolute;
      top: 75%;
    }
  }

  .table-container {
    display: flex;
  }

  .input-container {
    display: flex;
    flex-direction: column;
  }
</style>
