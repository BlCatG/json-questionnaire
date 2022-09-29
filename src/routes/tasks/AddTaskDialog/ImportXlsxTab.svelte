<script>
  import IconButton from '@smui/icon-button'
  import { createEventDispatcher } from 'svelte'

  let fileInput

  const dispatch = createEventDispatcher()

  let added = false,
    fileName = ''
  const handleChangeInput = (e) => {
    const [file] = e.target.files
    if (file === void 0) return
    dispatch('load', { file })
    added = true
    fileName = file.name
  }
</script>

<div class="file-container">
  {#if added}
    <IconButton
      class="material-icons add-button"
      style="color: green"
      on:click={() => fileInput.click()}>check</IconButton
    >
    <span class="tip">已添加<code>{fileName}</code></span>
  {:else}
    <IconButton class="material-icons add-button" on:click={() => fileInput.click()}>add</IconButton
    >
    <span class="tip">请选择<code>.xlsx</code>文件</span>
  {/if}

  <input
    type="file"
    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    style="display: none"
    bind:this={fileInput}
    on:change={handleChangeInput}
  />
</div>

<style lang="scss">
  .file-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .tip {
    position: absolute;
    top: 75%;
  }

  :global(.add-button) {
    height: 200px;
    width: 200px;
    font-size: 32px;
    background-color: #f5f5f5;

    /*
      这里踩了一个坑, 简单来讲就是32px的border-radius在scale后实际上并不是32px
      因为, border-radius的原理就是用给出的半径确定一个椭圆，椭圆与边框相切，椭圆与边框相切的两点之间的椭圆部分作为边框圆角
      而在scale的过程中, 可以认为辅助椭圆也在变大变小
      在这里, SMUI实现的ripple, 对::before伪元素和::after伪元素用到了scale
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
</style>
