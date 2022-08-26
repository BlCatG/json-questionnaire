<script>
  import DataTable, { Head, Body, Row, Cell } from '@smui/data-table'
  import Button, { Label } from '@smui/button'
  import ExcelJS from 'exceljs'

  export let data

  const { task, data: taskData } = data

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
  }

  const handleClickOutputButton = async () => {
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet()

    const row = ['真实姓名', '药名', '大单位', '小单位']
    sheet.addRow(row)

    taskData.forEach(({ form, realName }) => {
      form.forEach(({ index, largeCount, smallCount }) => {
        const name = options[index][task.searchKeys[0]]
        const large = '' + largeCount + options[index][task.largeUnit]
        const small = '' + smallCount + options[index][task.smallUnit]

        const row = [realName, name, large, small]
        sheet.addRow(row)
      })
    })

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `${task.name}.xlsx`
    document.documentElement.appendChild(a)
    a.click()
    document.documentElement.removeChild(a)
  }
</script>

<div>
  <DataTable table$aria-label="form表单 list">
    <Head>
      <Row>
        <Cell>真实姓名</Cell>
        <Cell>已统计药品</Cell>
      </Row>
    </Head>
    <Body>
      {#each taskData as v}
        <Row>
          <Cell>{v.realName}</Cell>
          <Cell>{v.form.length}</Cell>
        </Row>
      {/each}
    </Body>
  </DataTable>

  <Button on:click={handleClickOutputButton}>
    <Label>输出成xlxs文件</Label>
  </Button>
</div>
