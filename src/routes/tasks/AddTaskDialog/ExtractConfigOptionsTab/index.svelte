<script>
  import { createEventDispatcher } from 'svelte'
  import Textfield from '@smui/textfield'
  import XlsxTable from './XlsxTable.svelte'
  import { compact, trim } from 'lodash'

  export let xlsxFile

  const dispatch = createEventDispatcher()

  let rowsRange = ''
  let colsRange = ''

  // TODO 当前
  let selectedColNums = []
  $: {
    selectedColNums = []

    const ranges = colsRange.split(',').map(trim),
      hash = []

    ranges.forEach((v) => {
      const num = Number(v)
      if (isNaN(num)) {
        // 横线格式, 例如: '1-3, 4-6'
        const lineFormatReg = /^(\d+)-(\d*)$/
        if (lineFormatReg.test(v)) {
          let [, begin, end] = v.match(lineFormatReg)

          // 例如: '1-'表示从第1行开始, 直到最后一行
          // TODO 解决无法获取行数的问题
          if (end === '') end = String(col.length)

          for (let i = Number(begin) - 1; i <= Number(end) - 1; i++) {
            hash[i] = i
          }
        } else {
          // TODO 范围格式错误提示
          console.log('无法识别 ' + v)
          return
        }
      } else {
        // 单个模式, 例如: '1, 2'
        hash[num] = num
      }
    })

    selectedColNums = compact(hash)
    console.log(selectedColNums)
  }
</script>

<div class="table-container">
  <XlsxTable {xlsxFile} on:select={(e) => dispatch('data-update', { ...e.detail })} />
  <div class="inputs-container">
    <Textfield variant="filled" bind:value={rowsRange} label="已选择行范围" />
    <Textfield variant="filled" bind:value={colsRange} label="已选取列范围" />
  </div>
</div>

<style lang="scss">
  .table-container {
    display: flex;
  }

  .inputs-container {
    display: flex;
    flex-direction: column;
  }
</style>
