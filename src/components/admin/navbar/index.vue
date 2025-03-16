<template>
  <div class="admin-nav">
    <el-menu 
      :router="true" 
      :default-active="$route.path" 
      class="side-menu"
      active-text-color="#fff"
    >
      <el-menu-item 
        index="/admin/product/" 
        class="menu-item"
      >
        <template #title>
          <el-icon class="menu-icon"><Goods /></el-icon>
          <span class="menu-text">商品管理</span>
        </template>
      </el-menu-item>

      <el-menu-item 
        index="/admin/order/" 
        class="menu-item"
      >
        <template #title>
          <el-icon class="menu-icon"><Notebook /></el-icon>
          <span class="menu-text">订单管理</span>
        </template>
      </el-menu-item>

      <el-menu-item 
        index="/admin/user/" 
        class="menu-item"
      >
        <template #title>
          <el-icon class="menu-icon"><Avatar /></el-icon>
          <span class="menu-text">用户管理</span>
        </template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style lang="scss" scoped>
.admin-nav {
  height: 100%;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border-right: 1px solid rgba(229, 231, 235, 0.5);
  
  .side-menu {
    border-right: none;
    background: transparent;
    
    .menu-item {
      height: 56px;
      margin: 8px 12px;
      border-radius: 8px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      
      &:hover {
        background: rgba(76, 175, 80, 0.08) !important;
        
        .menu-icon {
          color: #4caf50;
        }
        
        .menu-text {
          color: #1b5e20;
          font-weight: 500;
        }
      }
      
      &.is-active {
        background: linear-gradient(45deg, #4caf50, #81c784) !important;
        box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
        
        .menu-icon,
        .menu-text {
          color: #fff;
        }
      }
    }
    
    .menu-icon {
      width: 20px;
      height: 20px;
      margin-right: 12px;
      color: #666;
      transition: color 0.3s;
    }
    
    .menu-text {
      font-size: 14px;
      color: #606266;
      letter-spacing: 0.5px;
      transition: all 0.3s;
    }
  }
}

@media (max-width: 768px) {
  .admin-nav {
    width: 100% !important;
    
    .menu-text {
      font-size: 13px;
    }
    
    .menu-item {
      margin: 4px 8px;
      height: 48px;
    }
  }
}
</style>