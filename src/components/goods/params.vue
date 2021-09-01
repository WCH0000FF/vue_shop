<template>
    <div>
<el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>分类参数</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
  <el-alert
    title="注意：只允许为第三级分类设置相关参数！"
    type="warning"
    show-icon>
  </el-alert>
  <el-row class="cat_opt">
      <el-col>
          <span>选择商品分类：</span>
<el-cascader
    v-model="selectedCateKeys"
    :options="cateList"
    :props="cateProps"
    @change="handleChange"
    clearable
    style = "width: 300px"
    >
    </el-cascader>
      </el-col>
  </el-row>
   <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="动态参数" name="many">
        <el-button type="primary" size="mini">添加参数</el-button>
        <el-table
            :data="data"
            style="width: 100%">
            <el-table-column
                prop="prop"
                label="label"
                width="width">
            </el-table-column>
        </el-table>
    </el-tab-pane>
    <el-tab-pane label="静态属性" name="only"></el-tab-pane>
  </el-tabs>
</el-card>
    </div>
</template>
<script>
export default {
  data () {
    return {
      cateList: [],
      selectedCateKeys: [],
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      activeName: 'many'
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取商品分类信息失败！！')
      this.cateList = res.data
      console.log(this.cateList)
    }
  }
}
</script>
<style lang="less" scoped>
.cat_opt{
    margin: 15px 0;
}
</style>
