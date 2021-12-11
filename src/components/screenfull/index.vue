<template>
  <div>
      <svg-icon @click="screenChange" icon-class="fullscreen" style="color:#fff; width: 50px; height: 20px" />
  </div>
</template>

<script>
import ScreenFull from 'screenfull'
export default {
    methods: {
        screenChange () {
            if (!ScreenFull.isEnabled) {
                this.$message.warning('当前全屏组件不可用')
                return
            }
            ScreenFull.toggle()
        }
    }
}
</script>

<style>

</style>