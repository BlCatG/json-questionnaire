<script>
  import Dialog, { Header, Title, Content } from '@smui/dialog'
  import IconButton from '@smui/icon-button'
  import ImportXlsxTab from './ImportXlsxTab.svelte'
  import ExtractConfigOptionsTab from './ExtractConfigOptionsTab/index.svelte'
  import ConfigureTab from './ConfigureTab.svelte'
  import { STATUS_ADD_TASK, STATUS_ADD_TASK_TO_KEY, STATUS_ADD_TASK_TO_CHS } from './const'
  import { client } from '$lib/api'
  import { cloneDeep } from 'lodash'

  export let open
  let stage = 0

  let xlsxFile = null
  const handleLoad = (e) => {
    xlsxFile = e.detail.file
  }

  const defaultTask = {
    conf: {
      // 与const.js里的INPUTS保持一致
      name: '',
      medicineName: 0,
      largeUnit: 0,
      smallUnit: 0,
      searchKeys: []
    },
    data: {
      selectedRows: [],
      colNames: []
    }
  }
  let task = cloneDeep(defaultTask)
  const handleDataUpdate = (e) => {
    task.data.selectedRows = e.detail.selectedRows
    task.data.colNames = e.detail.colNames
  }

  const handleClickDoneButton = async () => {
    await client.post('/tasks', task)

    // TODO 提示创建任务成功
    open = false
    stage = STATUS_ADD_TASK.IMPORT_XLSX
    xlsxFile = null
    task = cloneDeep(defaultTask)
  }
</script>

<Dialog bind:open fullscreen>
  <Header>
    {#if stage <= STATUS_ADD_TASK.IMPORT_XLSX}
      <IconButton class="material-icons" style="color: red" on:click={() => (open = false)}>
        close
      </IconButton>
    {:else}
      <IconButton class="material-icons" on:click={() => stage--}>navigate_before</IconButton>
    {/if}

    <Title>添加任务 / {STATUS_ADD_TASK_TO_CHS[STATUS_ADD_TASK_TO_KEY[stage]]}</Title>

    {#if stage < STATUS_ADD_TASK.PREVIEW}
      <IconButton class="material-icons" style="color: green" on:click={() => stage++}>
        navigate_next
      </IconButton>
    {:else}
      <IconButton class="material-icons" style="color: green" on:click={handleClickDoneButton}>
        done
      </IconButton>
    {/if}
  </Header>

  <Content>
    {#if stage === STATUS_ADD_TASK.IMPORT_XLSX}
      <ImportXlsxTab on:load={handleLoad} />
    {:else if stage === STATUS_ADD_TASK.EXTRACT_CONFIG_OPTIONS}
      <ExtractConfigOptionsTab {xlsxFile} on:data-update={handleDataUpdate} />
    {:else if stage === STATUS_ADD_TASK.CONFIG}
      <ConfigureTab
        conf={task.conf}
        selectedRows={task.data.selectedRows}
        bind:colNames={task.data.colNames}
      />
    {/if}
  </Content>
</Dialog>
