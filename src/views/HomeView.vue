<template>
  <div class="container" >
    <div class="header">
      点 餐 管 理 系 统
    </div>
    <div class="body">
      <div class="body-left" v-sticky="{ top: 0, isVertical: false }">
        <div class="nav-item" :class="{ 'active': activeNav === '1' ? true : false }"
          @click="toChildPage('order', $event)" id="1">
          <i class="el-icon-s-order"></i>
          <span class="nav-item-text">订 单</span>
        </div>
        <div class="nav-item" :class="{ 'active': activeNav === '2' ? true : false }"
          @click="toChildPage('analyse', $event)" id="2">
          <i class="el-icon-s-data"></i>
          <span class="nav-item-text">统 计</span>
        </div>
        <div class="nav-item" :class="{ 'active': activeNav === '3' ? true : false }"
          @click="toChildPage('manage', $event)" id="3">
          <i class="el-icon-s-tools"></i>
          <span class="nav-item-text">管 理</span>
        </div>
      </div>
      <div class="body-right" ref="homePage">
        <router-view>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src



export default {
  name: 'HomeView',
  data: function () {
    return {
      activeNav: "1",
    }
  },
  methods: {
    toChildPage: function (path, e) {
      this.$router.push(`/home/${path}`)
      this.activeNav = e.target.id
    },
    showActiveNav(id) {
      const el = document.getElementById("nav1")
      // console.log(el)
    }
  },
  mounted: function () {
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;

  .header {
    width: 100%;
    height: 50px;
    background-color: #1976D2;
    line-height: 50px;
    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
    color: white;
    font-weight: 550;
  }

  .body {
    width: 100%;
    height: calc(100% - 50px);
    background-color: white;
    display: flex;

    .body-left {
      width: 200px;
      height: 100%;
      background-color: whitesmoke;

      // position: fixed;
      // left: 0;
      // top:50px;
      .nav-item {
        width: 100%;
        height: 70px;
        font-size: 18px;
        // background-color: #BDBDBD;
        text-align: center;
        line-height: 70px;
        color: #212121;
        font-family: Arial, Helvetica, sans-serif;

        i {
          font-size: 20px;
        }

        .nav-item-text {
          margin-left: 10px;
        }
      }

      .active {
        background-color: #BDBDBD;
        box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
      }

      .nav-item:hover {
        cursor: pointer;
        background-color: #BDBDBD;
        box-shadow: 2px 2px 2px 2px gray;
      }
    }

    .body-right {
      width: calc(100% - 200px);
      height: 100%;
      position: absolute;
      left: 200px;

    }
  }

}
</style>
