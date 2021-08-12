<template>
    <div>
<el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
    <el-row :gutter="20">
      <el-col :span="7">
    <el-input v-model="queryInfo.query" placeholder="请输入内容"  class="input-with-select" clearable @clear="getUserList">
    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
  </el-input>
  </el-col>
      <el-col :span="4">
  <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
  </el-col>
    </el-row>
    <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
            <template slot-scope="scope">
                <el-switch v-model="scope.row.mg_state" @change="userStatechange(scope.row)"></el-switch>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUserById(scope.row.id)"></el-button>
                <el-tooltip content="角色分配" placement="top" effect="dark" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRolesDialog(scope.row)"></el-button>
                </el-tooltip>
            </template>
        </el-table-column>
    </el-table>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
<el-dialog
  title="分配角色"
  :visible.sync="setRolesVisible"
  width="50%"
  @close="setDialogRolesClosed"
>
<div>
  <p>当前的用户：{{userInfo.username}}</p>
  <p>当前的角色：{{userInfo.role_name}}</p>
  <p>分配新角色：
    <el-select v-model="selectRolesId" placeholder="请选择">
    <el-option
      v-for="item in roleList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
  </p>
</div>

  <span slot="footer" class="dialog-footer">
    <el-button @click="setRolesVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
</el-dialog>
<el-dialog
  title="添加用户"
  :visible.sync="addDialogVisible"
  width="50%"
  @close="addDialogClosed"
  >
<el-form :model="addForm" :rules="addUserRules" ref="addFormRef"  label-width="70px" >
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
    <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"></el-input>
  </el-form-item>
    <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
    <el-form-item label="手机" prop="mobile">
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>
<el-dialog
  title="修改用户信息"
  :visible.sync="editDialogVisible"
  width="50%"
  @close="editDialogClosed">
<el-form :model="editForm" :rules="editUserRules" ref="editFormRef"  label-width="70px" >
  <el-form-item label="用户名" prop="username">
    <el-input v-model="editForm.username" disabled></el-input>
  </el-form-item>
    <el-form-item label="邮箱" prop="email">
    <el-input v-model="editForm.email" ></el-input>
  </el-form-item>
    <el-form-item label="手机" prop="mobile">
    <el-input v-model="editForm.mobile" ></el-input>
  </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUser">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>
<script>
export default {
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      userList: [],
      roleList: [],
      selectRolesId: '',
      editForm: {
      },
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      setRolesVisible: false,
      userInfo: {},
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editUserRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('/users/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询用户信息失败！！')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    async getUserList () {
      const { data: res } = await this.$http.get('/users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$messager.error('获取用户信息失败')
      this.total = res.data.total
      this.userList = res.data.users
      console.log(res)
    },
    handleSizeChange (newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.getUserList()
    },
    handleCurrentChange (newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getUserList()
    },
    async userStatechange (userinfo) {
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$messager.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功！')
      console.log(res)
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    addUser () {
      this.$refs.addFormRef.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await this.$http.post('/users', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败！！')
        }
        this.$message.success('添加用户成功！！')
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    editUser () {
      this.$refs.editFormRef.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await this.$http.put('/users/' + this.editForm.id,
          { email: this.editForm.email, mobile: this.editForm.mobile }
        )
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('修改用户失败！！')
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('修改用户成功！！')
      })
    },
    async deleteUserById (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！！')
      }
      const { data: res } = await this.$http.delete('/users/' + id)
      if (res.meta.status !== 200) return this.message.error('删除用户失败！！')
      this.$message.success('删除用户成功！！')
      this.getUserList()
    },
    async showRolesDialog (userInfo) {
      this.userInfo = userInfo
      const { data: res } = await this.$http.get('/roles/')
      if (res.meta.status !== 200) return this.$message.error('获取角色失败')
      this.roleList = res.data
      this.setRolesVisible = true
    },
    async saveRoleInfo () {
      if (!this.selectRolesId) {
        return this.$message.error('请选择要分配的角色！')
      }
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectRolesId })
      if (res.meta.status !== 200) return this.$message.error('分配角色失败！')
      this.$message.success('分配角色成功！')
      this.getUserList()
      this.setRolesVisible = false
    },
    setDialogRolesClosed () {
      this.userInfo = {}
      this.selectRolesId = ''
    }
  }
}
</script>
