<script>
  import TopAppBar, { Row, Title, Section } from '@smui/top-app-bar'
  import Drawer, { AppContent, Content } from '@smui/drawer'
  import List, { Item, Text } from '@smui/list'
  import Button, { Label } from '@smui/button'
  import { goto } from '$app/navigation'
  import AddTaskDialog from './AddTaskDialog/index.svelte'

  export let data

  let title = '任务管理'
  const handleClickItem = (id, name) => {
    title = name
    goto(`/tasks/${id}`)
  }

  let open = false
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

  <AddTaskDialog bind:open />
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
</style>
