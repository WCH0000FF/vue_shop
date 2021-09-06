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
   <el-tabs v-model="activeName" @tab-click="handleTabClick">
    <el-tab-pane label="动态参数" name="many" :disabled="isBtnDisabled">
        <el-button type="primary" size="mini" @click="addParams" :disabled="isBtnDisabled">添加参数</el-button>
        <el-table
            :data="manyTableData"
            border
            stripe
            max-height = "330"
           >
            <el-table-column  type="expand" >
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleClose(index,scope.row)">{{item}}</el-tag>
                 <el-input
  class="input-new-tag"
  v-if="scope.row.inputVisible"
  v-model="scope.row.inputValue"
  ref="saveTagInput"
  size="small"
  @keyup.enter.native="handleInputConfirm(scope.row)"
  @blur="handleInputConfirm(scope.row)"
>
</el-input>
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column  type="index"></el-table-column>
            <el-table-column
                prop="attr_name"
                label="参数名称"
              >
            </el-table-column>
            <el-table-column label="操作" width="300px">
              <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editParams(scope.row)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
        </el-table>
    </el-tab-pane>
    <el-tab-pane label="静态属性" name="only" :disabled="isBtnDisabled">
      <el-button type="primary" size="mini"  @click="addParams" :disabled="isBtnDisabled">添加属性</el-button>
      <el-table
            :data="onlyTableData"
            border
            stripe
            max-height = "330"
           >
            <el-table-column  type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleClose(index,scope.row)">{{item}}</el-tag>
                 <el-input
  class="input-new-tag"
  v-if="scope.row.inputVisible"
  v-model="scope.row.inputValue"
  ref="saveTagInput"
  size="small"
  @keyup.enter.native="handleInputConfirm(scope.row)"
  @blur="handleInputConfirm(scope.row)"
>
</el-input>
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column  type="index"></el-table-column>
            <el-table-column
                prop="attr_name"
                label="属性名称"
              >
            </el-table-column>
            <el-table-column label="操作" width="300px">
              <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editParams(scope.row)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
        </el-table>
    </el-tab-pane>
  </el-tabs>
</el-card>
<!-- 添加对话框 -->
<el-dialog
  :title="'添加'+ titleText"
  :visible.sync="addDialogVisible"
  width="50%"
  @close="addDialogClosed">
<el-form :model="addParamsForm" :rules="addParamsRules" ref="addRuleForm"  label-width="100px">
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="addParamsForm.attr_name"></el-input>
  </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParamData">确 定</el-button>
  </span>
</el-dialog>
<!-- 修改对话框 -->
<el-dialog
  :title="'修改'+titleText"
  :visible.sync="editDialogVisible"
  width="50%"
  @close="editDialogClosed"
  >
  <el-form :model="editParamsForm" :rules="editParamsRules" ref="editRuleForm"  label-width="100px">
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="editParamsForm.attr_name"></el-input>
  </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParamData">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>
<script>
export default {
  data () {
    return {
      cateList: [],
      selectedCateKeys: [],
      manyTableData: [],
      onlyTableData: [],
      addParamsForm: {
        attr_name: ''
      },
      editParamsForm: {
        attr_name: ''
      },
      addParamsRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      editParamsRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      addDialogVisible: false,
      editDialogVisible: false,
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      activeName: 'many'
    }
  },
  computed: {
    isBtnDisabled () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      } else {
        return false
      }
    },
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      } else {
        return null
      }
    },
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
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
    },
    handleChange () {
      this.getParamsData()
    },
    handleTabClick () {
      this.getParamsData()
    },
    async getParamsData () {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return this.$message.warning('请选择第三级分类')
      }
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName }
      })
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      if (res.meta.status !== 200) return this.$$message.error('获取参数列表失败！！')
      if (this.activeName === 'many') {
        this.manyTableData = res.data
        console.log(this.manyTableData)
      } else {
        this.onlyTableData = res.data
        console.log(this.onlyTableData)
      }
    },
    addParams () {
      this.addDialogVisible = true
    },
    addParamData () {
      this.$refs.addRuleForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addParamsForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) return this.$message.error('添加动态参数失败！！')
        this.$message.success('添加动态参数成功！！')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    addDialogClosed () {
      this.$refs.addRuleForm.resetFields()
    },
    editParams (param) {
      this.editParamsForm = param
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editRuleForm.resetFields()
    },
    editParamData () {
      this.$refs.editRuleForm.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`,
          { attr_name: this.editParamsForm.attr_name, attr_sel: this.activeName }
        )
        if (res.meta.status !== 200) return this.$message.error('修改参数失败！！')
        console.log(res)
        this.$message.success('修改参数成功！！')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    async removeParams (attrId) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消！！')
      }
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`)
      if (res.meta.status !== 200) return this.$message.error('删除参数失败！！')
      this.$message.success('删除参数成功！！')
      this.getParamsData()
    },
    handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false
        row.inputValue = ''
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      this.saveAttrVals(row)
    },
    showInput (row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async saveAttrVals (row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(',')
        })
      if (res.meta.status !== 200) return this.$message.error('修改参数项失败！！')
      this.$message.success('修改参数项成功！！')
      row.inputVisible = false
      row.inputValue = ''
    },
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  }
}
</script>
<style lang="less" scoped>
.cat_opt{
    margin: 15px 0;
}
.el-tag{
  margin: 10px;
}
.input-new-tag{
  width: 120px
}
</style>
