<template>
        <el-dropdown @command="changeLanguage">
            <div>
                <svg-icon icon-class="language" style="color:#fff;font-size:20px" />
            </div>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :disabled="this.$i18n.locale === 'zh'" command="zh">中文</el-dropdown-item>
                <el-dropdown-item :disabled="this.$i18n.locale === 'en'" command="en">en</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
</template>

<script>
import Cookie from 'js-cookie'
export default {
  name: '',
  components: {},
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
      changeLanguage (type) {
          Cookie.set('language', type)
          this.$i18n.locale = type
      }
  }
}
</script>

<style scoped lang = "less">

</style>
