<template>
  <div>
    <div ref="watermark1" style="height:500px">
      这是水印区域一
    </div>
    <button @click="handleWatermarkAdd1">添加水印区域一水印</button>
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
			watermark1Instance = new AddPageWatermark({}, watermark1.value)
			console.log(watermark1Instance)
			watermark1Instance.set('aaaa')
		}
		const handleWatermarkDelete1 = () => {
			watermark1Instance.unbind && watermark1Instance.unbind()
		}
    return{
      watermark1,
      handleWatermarkAdd1,
      handleWatermarkDelete1
    }
	}
	export default defineComponent({
		name: 'App',
		setup() {
      const {
        watermark1,
				handleWatermarkAdd1,
				handleWatermarkDelete1,
      } = useWatermark()

			return {
				watermark1,
				handleWatermarkAdd1,
				handleWatermarkDelete1,
			}
		},
	})
</script>
