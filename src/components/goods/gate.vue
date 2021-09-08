<template>
    <div>
<el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品分类</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
    <el-row>
      <el-col>
          <el-button type="primary" @click="showAddDialog">添加分类</el-button>
      </el-col>
    </el-row>
    <tree-table
     :data="gateList"
     :columns="columns"
     :selection-type="false"
     show-index
     :expand-type="false"
     index-text="#"
     :show-row-hover="false"
     class="treeTable"
     >
     <template slot="isok" slot-scope="scope">
         <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen"></i>
         <i class="el-icon-error" v-else style="color:red"></i>
     </template>
     <template slot="order" slot-scope="scope">
         <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
         <el-tag v-else-if="scope.row.cat_level === 1" type="danger">二级</el-tag>
         <el-tag v-else type="warning">三级</el-tag>
     </template>
     <template slot="opt" slot-scope="scope">
         <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
         <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGate(scope.row)">删除</el-button>
     </template>
     </tree-table>
       <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
<el-dialog
  title="添加分类"
  :visible.sync="addDialogVisible"
  width="50%"
  @close="resetAddDialog"
>
<el-form :model="addGateForm" :rules="addGaterules" ref="addGateRef" label-width="100px" class="demo-ruleForm">
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="addGateForm.cat_name"></el-input>
  </el-form-item>
  <el-form-item label="父级分类">
   <el-cascader
  expand-trigger="hover" :options="parentGateList" :props="cascaderProps" v-model="selectGateKeys" @change="parentCateChanged" clearable change-on-select>
    </el-cascader>
  </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveGateInfo">确 定</el-button>
  </span>
</el-dialog>
<el-dialog
  title="修改分类"
  :visible.sync="editDialogVisible"
  width="50%"
  @close="resetEditDialog"
>
<el-form :model="editGateForm" :rules="editGaterules" ref="editGateRef"  label-width="100px">
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="editGateForm.cat_name"></el-input>
  </el-form-item>
</el-form>
<span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveEditGateInfo">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>
<script>
export default {
  data () {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      gateList: [],
      columns: [
        {
          prop: 'cat_name',
          label: '分类名称'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addDialogVisible: false,
      editDialogVisible: false,
      addGateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      editGateForm: {
        cat_id: 0,
        cat_name: ''
      },
      addGaterules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      editGaterules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      selectGateKeys: [],
      parentGateList: [],
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      total: 0
    }
  },
  created () {
    this.getGateList()
  },
  methods: {
    async getGateList () {
      const { data: res } = await this.$http.get('/categories/', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败！')
      this.gateList = res.data.result
      this.total = res.data.total
      console.log(this.gateList)
    },
    showAddDialog () {
      this.getParentGateList()
      this.addDialogVisible = true
    },
    async getParentGateList () {
      const { data: res } = await this.$http.get('/categories/', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error('获取父级商品分类失败！')
      console.log(res.data)
      this.parentGateList = res.data
      console.log(this.parentGateList)
    },
    handleSizeChange (newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getGateList()
      console.log(this.queryInfo.pageSize)
    },
    handleCurrentChange (newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getGateList()
    },
    parentCateChanged () {
      console.log(this.selectGateKeys)
      if (this.selectGateKeys.length > 0) {
        this.addGateForm.cat_pid = this.selectGateKeys[this.selectGateKeys.length - 1]
        this.addGateForm.cat_level = this.selectGateKeys.length
      } else {
        this.selectGateKeys.cat_pid = 0
        this.selectGateKeys.cat_level = 0
      }
    },
    saveGateInfo () {
      this.$refs.addGateRef.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await this.$http.post('/categories/', this.addGateForm)
        console.log(res.data)
        if (res.meta.status !== 201) return this.$message.error('添加分类失败！！')
        this.$message.success('添加分类成功！！')
        this.getGateList()
        this.addCateDialogVisible = false
      })
    },
    async showEditDialog (gateInfo) {
      this.editDialogVisible = true
      console.log(gateInfo.cat_id)
      const id = gateInfo.cat_id
      const { data: res } = await this.$http.get(`categories/${id}`)
      if (res.meta.status !== 200) return this.$message.error('获取商品分类信息失败！！')
      this.editGateForm = res.data
    },
    saveEditGateInfo () {
      this.$refs.editGateRef.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await this.$http.put(`categories/${this.editGateForm.cat_id}`, { cat_name: this.editGateForm.cat_name })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('编辑商品分类信息失败！！')
        this.$message.success('编辑商品分类信息成功！！')
        this.editDialogVisible = false
        this.getGateList()
      })
    },
    resetEditDialog () {
      this.$refs.editGateRef.resetFields()
    },
    resetAddDialog () {
      this.$refs.addGateRef.resetFields()
      this.selectGateKeys = []
    },
    async removeGate (gateInfo) {
      const id = gateInfo.cat_id
      const confirmResult = await this.$confirm('此操作将永久删除该商品分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！！')
      }
      const { data: res } = await this.$http.delete(`categories/${id}`)
      if (res.meta.status !== 200) this.$message.error('删除商品分类失败！！')
      this.$message.success('删除商品分类成功！！')
      this.getGateList()
    }
  }
}
</script>
<style lang="less" scoped>
.treeTable{
    margin-top: 15px;
}
</style>
