<script>
  import { createEventDispatcher, tick, onDestroy } from 'svelte'
  import Textfield from '@smui/textfield'
  import ExcelJS from 'exceljs'
  import { cloneDeep } from 'lodash'

  const dispatch = createEventDispatcher()

  const loadWorkbook = async (xlsxFile) => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(xlsxFile)

    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        const workbook = new ExcelJS.Workbook()

        // 从 buffer 加载
        await workbook.xlsx.load(e.target.result)
        resolve(workbook)
      }
    })
  }

  class Cell {
    constructor(value, selectedX, selectedY, rowNum, colNum) {
      this.value = value
      this.selectedX = selectedX
      this.selectedY = selectedY
      this.rowNum = rowNum
      this.colNum = colNum
    }
  }
  class TableData {
    constructor(workbook, worksheetNum) {
      if (arguments.length === 0) {
        this.rows = [[], []]
        return
      }
      const worksheet = workbook.getWorksheet(worksheetNum)

      // 实际下标从1开始
      this.rowCount = worksheet.rowCount + 1
      this.colCount = worksheet.columnCount + 1

      // this.rows: Cell[][]
      this.rows = new Array(this.rowCount)
        .fill(null)
        .map(() => new Array(this.colCount).fill(null).map(() => new Cell()))
      worksheet.eachRow((row, rowNum) => {
        this.rows[rowNum] = row.values.map(
          (v, cellIndex) => new Cell(v, false, rowNum, cellIndex + 1)
        )
      })
    }

    getRow(rowNum) {
      return this.rows[rowNum]
    }
    getCol(colNum) {
      const ret = []

      for (let i = 1; i < this.rows.length; i++) {
        ret.push(this.rows[i][colNum])
      }

      return ret
    }
    getCell(rowNum, colNum) {
      return this.rows[rowNum][colNum]
    }

    eachRow(rowNum, cb) {
      const rows = this.rows

      for (let i = 1; i < rows[rowNum].length; i++) {
        const ret = cb(rowNum[i], i)
        if (ret === void 0) continue
        rowNum[i] = ret
      }

      rows[rowNum].forEach(cb)
    }
    eachCol(colNum, cb) {
      const rows = this.rows

      for (let i = 1; i < rows.length; i++) {
        const row = this.rows[i]
        const ret = cb(row[colNum], i)
        if (ret === void 0) continue
        row[colNum] = ret
      }
    }
    eachCell(cb) {
      const rows = this.rows

      for (let i = 1; i < rows.length; i++) {
        for (let j = 1; j < rows.length; j++) {
          cb(rows[i][j], i, j)
        }
      }
    }
    compact() {
      let ret = cloneDeep(this.rows)
      for (let i = 0; i < ret.length; i++) {
        ret[i] = ret[i].filter((cell) => cell !== void 0 && cell.selectedX && cell.selectedY)
      }
      ret = ret.filter((row) => row.length > 0)
      return ret
    }
  }
  let rows = new TableData()
  $: rowsView = rows.rows

  // init
  export let xlsxFile
  loadWorkbook(xlsxFile).then((workbook) => {
    // TODO 支持选择不同worksheet
    rows = new TableData(workbook, 1)
  })

  // TODO 抽成可复用逻辑
  // 功能同useMemo
  let colNamesView = [],
    cache = rowsView
  $: if (cache !== rowsView) {
    colNamesView = new Array(rowsView.length).fill(null).map((_, i) => ({
      name: '',
      colNum: i
    }))
    cache = rowsView
  }

  $: colNames = colNamesView.filter((v) => v.name !== '')

  let isCtrl = false,
    isShift = false
  const addGlobalEventListener = (type, listener) => {
    document.addEventListener(type, listener)
    return () => {
      document.removeEventListener(type, listener)
    }
  }
  const listenerRemovers = ['keyup', 'keydown'].map((type) =>
    addGlobalEventListener(type, (e) => {
      // TODO 解决按shift的默认选中行为, e.preventDefault()无效
      isCtrl = e.ctrlKey
      isShift = e.shiftKey
    })
  )
  onDestroy(() => {
    listenerRemovers.forEach((remove) => remove())
  })

  const dispatchSelect = () => {
    dispatch('select', {
      selectedRows: rows.compact(),
      colNames
    })
  }
  let lastBoundaries = {
    rowNum: 0,
    colNum: 0
  }
  const setLastBoundaries = (rowNum = lastBoundaries.rowNum, colNum = lastBoundaries.colNum) => {
    lastBoundaries.rowNum = rowNum
    lastBoundaries.colNum = colNum
  }
  // 单击列首
  const handleClickColHeader = async (colNum) => {
    if (!isCtrl && !isShift) {
      await selectOneCol(colNum)
    } else if (isCtrl && !isShift) {
      await selectMultiCols(colNum)
    } else if (isShift) {
      await selectContinuousCols(colNum)
    }
  }
  // 单击行首
  const handleClickRowHeader = async (rowNum) => {
    if (!isCtrl && !isShift) {
      await selectOneRow(rowNum)
    } else if (isCtrl && !isShift) {
      await selectMultiRows(rowNum)
    } else if (isShift) {
      selectContinuousRows(rowNum)
    }
  }
  // 单击只选中一整列
  const selectOneCol = async (colNum) => {
    rows.eachCell((cell) => {
      if (cell === void 0) return
      cell.selectedX = false
      cell.selectedY = false
    })
    rows.eachCol(colNum, (cell, rowNum) => {
      if (cell === void 0) return
      cell.selectedY = true
    })

    setLastBoundaries(0, colNum)
    rows = rows
    dispatchSelect()
  }
  // 单击只选中一整行
  const selectOneRow = async (rowNum) => {
    rows.eachCell((cell) => {
      if (cell === void 0) return
      cell.selectedX = false
      cell.selectedY = false
    })
    rows.eachRow(rowNum, (cell) => {
      if (cell === void 0) return
      cell.selectedX = true
    })

    setLastBoundaries(rowNum, 0)
    rows = rows
    dispatchSelect()
  }
  // Ctrl+单击来选中多列
  const selectMultiCols = async (colNum) => {
    rows.eachCol(colNum, (cell, rowNum) => {
      if (cell === void 0) return
      cell.selectedY = !cell.selectedY
    })

    setLastBoundaries(void 0, colNum)
    rows = rows
    dispatchSelect()
  }
  // Ctrl+单击来选中多行
  const selectMultiRows = async (rowNum) => {
    rows.eachRow(rowNum, (cell, colNum) => {
      if (cell === void 0) return
      cell.selectedX = !cell.selectedX
    })

    setLastBoundaries(rowNum, void 0)
    rows = rows
    dispatchSelect()
  }

  // Shift+单击来选中连续多列
  const selectContinuousCols = async (colNum) => {
    rows.eachCell((cell) => {
      if (cell === void 0) return
      cell.selectedY = false
    })
    const [begin, end] = [lastBoundaries.colNum, colNum].sort()
    for (let i = begin; i <= end; i++) {
      rows.eachCol(i, (cell, rowNum) => {
        if (cell === void 0) return
        cell.selectedY = true
      })
    }

    rows = rows
    dispatchSelect()
  }
  // Shift+单击来选中连续多行
  const selectContinuousRows = async (rowNum) => {
    rows.eachCell((cell) => {
      if (cell === void 0) return
      cell.selectedX = false
    })
    const [begin, end] = [lastBoundaries.rowNum, rowNum].sort()
    for (let i = begin; i <= end; i++) {
      rows.eachRow(i, (cell, colNum) => {
        if (cell === void 0) return
        cell.selectedX = true
      })
    }

    rows = rows
    dispatchSelect()
  }

  // number to letter, 如: 1 -> A
  const number2Letter = (n) => {
    let ret = ''
    while (n > 0) {
      const r = n % 26,
        lCharCode = r === 0 ? 26 : r
      ret = String.fromCharCode(64 + lCharCode) + ret
      n = ~~((n - lCharCode) / 26)
    }
    return ret
  }

  // TODO 同步已选择行/列
  export let selectedColNums

  // TODO 检查所有列都已被自定义命名
</script>

<table>
  <tbody>
    <tr>
      {#each rowsView[0] as _, i}
        {#if i === 0}
          <td>_</td>
        {:else}
          <Textfield variant="filled" bind:value={colNamesView[i].name} />
          <td data-header on:click={() => handleClickColHeader(i)}>{number2Letter(i)}</td>
        {/if}
      {/each}
    </tr>

    {#each rowsView.slice(1) as row, i}
      <tr>
        {#each row as cell}
          {#if cell}
            <!-- TODO 应用富文本信息, 如加粗, 斜体 -->
            <td data-selected={cell.selectedX || cell.selectedY}>{cell.value}</td>
          {:else}
            <td data-header on:click={() => handleClickRowHeader(i + 1)}>{i + 1}</td>
          {/if}
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<style lang="scss">
  table {
    display: inline-block;
    overflow: auto;
  }

  td[data-header] {
    cursor: pointer;
  }

  td[data-selected='true'] {
    background-color: yellow;
  }
</style>
