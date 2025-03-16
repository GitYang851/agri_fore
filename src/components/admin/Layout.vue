<template>
  <div class="admin-layout">
    <Header class="layout-header"/>
    <div class="layout-container">
      <Navbar class="layout-nav"/>
      <Main class="layout-main"/>
    </div>
  </div>
</template>

<script setup>
import Header from './header/index.vue'
import Navbar from './navbar/index.vue'
import Main from './main/index.vue'
</script>

<style scoped lang="scss">
.admin-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.layout-header {
  flex: 0 0 64px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  z-index: 1000;
}

.layout-container {
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
}

.layout-nav {
  flex: 0 0 240px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border-right: 1px solid #e5e7eb;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-y: auto;
  
  &:hover {
    &::-webkit-scrollbar-thumb {
      background-color: rgba(76, 175, 80, 0.5);
    }
  }
}

.layout-main {
  flex: 1;
  padding: 24px;
  background-color: #ffffff;
  overflow-y: auto;
  transition: all 0.3s;

  /* 自定义滚动条 */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(76, 175, 80, 0.3);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(245, 247, 250, 0.8);
  }
}

@media (max-width: 768px) {
  .layout-nav {
    position: fixed;
    z-index: 1000;
    left: -240px;
    top: 64px;
    bottom: 0;
    transition: transform 0.3s;
    
    &.mobile-active {
      transform: translateX(240px);
    }
  }

  .layout-main {
    padding: 16px;
  }
}
</style>