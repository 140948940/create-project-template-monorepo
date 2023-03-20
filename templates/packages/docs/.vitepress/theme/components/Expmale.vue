<template>
  <div>
    <div ref="watermark1" style="height:500px;position:relative;">这是水印区域一</div>
    <button style="margin-right:30px;" @click="handleWatermarkAdd1">添加水印区域一水印</button>
    <button @click="handleWatermarkDelete1">删除水印区域一水印</button>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import AddPageWatermark from '${template---name}'
  const useWatermark = () => {
    const watermark1 = ref(null)
    let watermark1Instance: AddPageWatermark
    const handleWatermarkAdd1 = () => {
      watermark1Instance = new AddPageWatermark({
        canFillStyle:'red'
      }, watermark1.value)
      watermark1Instance.set('水印一')
    }
    const handleWatermarkDelete1 = () => {
      watermark1Instance.unbind && watermark1Instance.unbind()
    }
    return {
      watermark1,
      handleWatermarkAdd1,
      handleWatermarkDelete1,
    }
  }
  export default defineComponent({
    name: 'Expmale',
    setup() {
      const { watermark1, handleWatermarkAdd1, handleWatermarkDelete1 } =
        useWatermark()
      return {
        watermark1,
        handleWatermarkAdd1,
        handleWatermarkDelete1,
      }
    },
  })
</script>