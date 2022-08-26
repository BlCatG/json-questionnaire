<script>
  import ExcelJS from 'exceljs'
  import { onMount } from 'svelte'
  import { createEventDispatcher } from 'svelte'

  export let xlsx

  const dispatch = createEventDispatcher()

  let worksheet
  let rows = []
  let show = false
  onMount(async () => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(xlsx)

    reader.onload = async () => {
      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.load(reader.result)
      worksheet = workbook.getWorksheet(1)
      worksheet.eachRow((row, rowNumber) => {
        rows[rowNumber] = row.values.map((v) => ({
          value: v,
          dataSelected: false
        }))
      })
      show = true
    }
  })

  const handleClickColHeader = (colNumber) => {
    // see https://svelte.dev/tutorial/updating-arrays-and-objects

    const col = []

    rows = rows.map((row) => {
      row.forEach((cell) => {
        cell.dataSelected = false
      })
      col.push(row[colNumber].value)
      row[colNumber].dataSelected = true
      return row
    })
    dispatch('select', {
      col
    })
  }

  const n2l = (n) => {
    let ret = ''
    while (n > 0) {
      const r = n % 26,
        lCharCode = r === 0 ? 26 : r
      ret = String.fromCharCode(64 + lCharCode) + ret
      n = ~~((n - lCharCode) / 26)
    }
    return ret
  }
</script>

{#if show}
  <table>
    <tbody>
      <tr>
        {#each rows[1] as _, i}
          {#if i === 0}
            <td>_</td>
          {:else}
            <td data-header on:click={() => handleClickColHeader(i)}>{n2l(i)}</td>
          {/if}
        {/each}
      </tr>

      <tr>
        {#each rows[1] as cell}
          {#if cell}
            <td data-selected={cell.dataSelected}>
              <b>{cell.value}</b>
            </td>
          {:else}
            <td>1</td>
          {/if}
        {/each}
      </tr>

      {#each rows.slice(2) as row, i}
        <tr>
          {#each row as cell}
            {#if cell}
              <td data-selected={cell.dataSelected}>{cell.value}</td>
            {:else}
              <td>{i + 2}</td>
            {/if}
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

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
