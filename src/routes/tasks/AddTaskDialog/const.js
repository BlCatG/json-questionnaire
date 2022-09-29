export const STATUS_ADD_TASK = {
  IMPORT_XLSX: 0,
  EXTRACT_CONFIG_OPTIONS: 1,
  CONFIG: 2,
  PREVIEW: 3
}

export const STATUS_ADD_TASK_TO_KEY = Reflect.ownKeys(STATUS_ADD_TASK).reduce(
  (prev, curr, index) => ({
    ...prev,
    [index]: curr
  }),
  {}
)

export const STATUS_ADD_TASK_TO_CHS = {
  IMPORT_XLSX: '导入XLSX文件',
  EXTRACT_CONFIG_OPTIONS: '提取配置选项',
  CONFIG: '配置',
  PREVIEW: '预览'
}

export const INPUT_TYPE = {
  RADIO: 0,
  CHECKBOX: 1
}

export const INPUTS = [
  {
    name: '药名',
    key: 'medicineName',
    type: INPUT_TYPE.RADIO
  },
  {
    name: '大单位',
    key: 'largeUnit',
    type: INPUT_TYPE.RADIO
  },
  {
    name: '小单位',
    key: 'smallUnit',
    type: INPUT_TYPE.RADIO
  },
  {
    name: '搜索关键词',
    key: 'searchKeys',
    type: INPUT_TYPE.CHECKBOX
  }
]
