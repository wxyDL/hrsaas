<template>
  <div>
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :file-list="fileList"
      :class="{disabled: fileComputed }"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <!-- 进度条 -->
    <el-progress
      v-if="showProgress"
      :percentage="percentage"
      style="width: 180px"
    />
    <!-- 预览图片的对话框 -->
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img :src="imageUrl" alt="" style="width: 100%">
    </el-dialog>
  </div>
</template>

<script>
// 引入腾讯云的cos对象
import COS from 'cos-js-sdk-v5'
// 实例化COS对象
const cos = new COS({
  SecretId: 'AKID5zd18yYrtd7KIzPZS4PUIq65oGRL3Wid',
  SecretKey: 'g5D4fz3q22nJZaMr7F7j6D5h38yYswmM'
})
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      // 图片预览的地址
      fileList: [],
      // 对话框的显示与隐藏
      showDialog: false,
      // 要预览的图片地址
      imageUrl: '',
      // 图片上传中的uid
      currentFileUid: null,
      // 进度条的百分比
      percentage: 0,
      // 进度条的显示与隐藏
      showProgress: false
    }
  },
  computed: {
    // 控制上传按钮
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 图片预览
    preview(file) {
      this.imageUrl = file.url
      this.showDialog = true
    },
    // 删除图片
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    // 添加图片状态改变时的
    changeFile(file, fileList) {
      this.fileList = fileList.map(item => item)
    },
    // 上传图片之前
    beforeUpload(file) {
      // 定义上传的图片格式
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      // 定义上传图片的大小
      const picSize = 5 * 1024 * 1024
      if (!types.some(item => item === file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      if (file.size > picSize) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      // 确定当前上传的图片的文件了
      this.currentFileUid = file.uid
      // 显示进度条
      this.showProgress = true
      return true
    },
    // 自定义上传图片的方式
    upload(params) {
      if (params.file) {
        // cos上传文件
        cos.putObject({
          // 存储桶的名称
          Bucket: 'xumoxiaosheng-1304424657',
          // 存储桶所在的地域
          Region: 'ap-guangzhou',
          // 存储在桶里的对象键
          Key: params.file.name,
          // 上传的模式类型
          StorageClass: 'STANDARD',
          // 上传的文件对象
          Body: params.file,
          // 进度回调响应对象
          onProgress: (progressData) => {
            this.percentage = progressData.percent * 100
          }
        }, (err, data) => {
          console.log(err || data)
          // 判断上传图片是否成功
          if (!err && data.statusCode === 200) {
            this.fileList = this.fileList.map(item => {
              // 判断之前的图片的uid是不是等于刚刚的图片的uid
              if (item.uid === this.currentFileUid) {
                return { url: 'http://' + data.Location, upload: true }
              }
              return item
            })
            setTimeout(() => {
              // 关闭进度条
              this.showProgress = false
              // 重置进度条的百分比
              this.percentage = 0
            }, 1000)
          }
        })
      }
    }
  }
}
</script>

<style lang = "scss">
.disabled .el-upload--picture-card {
  display: none
}
</style>
