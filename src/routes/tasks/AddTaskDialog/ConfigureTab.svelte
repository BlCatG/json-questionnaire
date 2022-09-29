<script>
  import Textfield from '@smui/textfield'
  import FormField from '@smui/form-field'
  import Checkbox from '@smui/checkbox'
  import Radio from '@smui/radio'
  import { INPUTS, INPUT_TYPE } from './const'

  export let selectedRows
  export let colNames
  export let conf
</script>

<div style="display: flex; flex-direction: column">
  <Textfield variant="filled" bind:value={conf.name} label="任务名" />

  <div style="display: flex">
    {#each INPUTS as input}
      <div style="display: flex">
        <span>{input.name}</span>
        {#each colNames as colName}
          <FormField>
            {#if input.type === INPUT_TYPE.RADIO}
              <Radio bind:group={conf[input.key]} value={colName.colNum} />
            {:else if input.type === INPUT_TYPE.CHECKBOX}
              <Checkbox bind:group={conf[input.key]} value={colName.colNum} />
            {/if}
            <span slot="label">{colName.name}</span>
          </FormField>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style lang="scss"></style>
