<template>

<el-container class="home_container">
  <el-header class="home_header">
      <div>
          <img src="../assets/heima.png" />
          <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginOut">退出</el-button>
      </el-header>
  <el-container>
    <el-aside :width="isCollapse ? '64px': '200px'" class="home_aside">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
      background-color="#47525d"
      text-color="#fff"
      active-text-color="#409EFF"
      unique-opened
      :collapse='isCollapse'
      :collapse-transition='false'
      router
      :default-active='activePath'
      >
      <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
        <template slot="title">
          <i :class="iconsObj[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
        <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
          <template>
          <i class="el-icon-menu"></i>
          <span>{{subItem.authName}}</span>
        </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <el-main class="home_main">
        <router-view></router-view>
    </el-main>
  </el-container>
</el-container>

</template>
<script>
export default {
  created () {
    this.getMenusList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data () {
    return {
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  methods: {
    loginOut () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenusList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(this.menulist)
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style lang="less" scoped>
.home_container{
    height: 100%;
}
.home_header{
    padding-left: 0;
    background-color: #3d464d;
    display: flex;
    justify-content:space-between;
    align-items: center;
    color: #fff;
    > div{
display: flex;
align-items: center;
span{
    margin-left:15px;
}
    }
}
.home_aside{
    background-color: #47525d;
    .el-menu{
        border-right: none;
    }
    .toggle-button{
        text-align: center;
        font-size: 10px;
        line-height: 24px;
        color:#fff;
        background-color: #686c79;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
}
.home_main{
    background-color: #f0f0f0;
}
.iconfont{
    margin-right: 10px;
}
</style>
