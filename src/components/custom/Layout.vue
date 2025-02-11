<template>
  <div>
    <Header></Header>
    <Main></Main>
    <Footer></Footer>
  </div>
</template>

<script setup>
import Header from './header/index.vue'
import Main from './main/index.vue'
import Footer from './footer/index.vue'
</script>

<style scoped>
.header {
  /*position: absolute;*/
  line-height: 50px;
  background-color: #cdd5d2;
  /*top: 0;*/
  /*left: 0;*/
  /*right: 0;*/
  /*overflow-y: auto;*/
}

.main {
  top: 50px;
  bottom: 50px;
  left: 0;
  right: 0;
  overflow-y: auto;
}

.footer1 {
  line-height: 50px;
  background-color: #f5baba;
  bottom: 0;
  left: 0;
  right: 0;
}
.footer {
  text-align: center;
  padding-top: 20px;
  padding-bottom: 10px;
  background-color: #046931;
  color: #120e10;
  letter-spacing: 2px;
  border-top-width: 2px;
}
</style>
