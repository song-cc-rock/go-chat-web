<template>
  <div class="login-container">
    <div class="login-content-container">
      <n-card title="欢迎使用Go-Chat" class="login-card">
        <n-tabs default-value="signin" size="large" justify-content="space-evenly">
          <n-tab-pane name="signin" tab="登录">
            <n-form :show-label="false">
              <n-form-item>
                <n-input placeholder="手机号或邮箱">
                  <template #prefix>
                    <n-icon :component="UsernameIcon" />
                  </template>
                </n-input>
              </n-form-item>
              <n-form-item>
                <n-input type="password" placeholder="密码">
                  <template #prefix>
                    <n-icon :component="PasswordIcon" />
                  </template>
                </n-input>
              </n-form-item>
            </n-form>
            <n-button type="primary" block secondary strong>
              登录
            </n-button>
          </n-tab-pane>
          <n-tab-pane name="signup" tab="注册">
            <n-form :show-label="false">
              <n-form-item>
                <n-input placeholder="手机号或邮箱">
                  <template #prefix>
                    <n-icon :component="UsernameIcon" />
                  </template>
                </n-input>
              </n-form-item>
              <n-form-item>
                <n-input type="password" placeholder="密码">
                  <template #prefix>
                    <n-icon :component="PasswordIcon" />
                  </template>
                </n-input>
              </n-form-item>
              <n-form-item>
                <n-input type="password" placeholder="重复密码">
                  <template #prefix>
                    <n-icon :component="PasswordIcon" />
                  </template>
                </n-input>
              </n-form-item>
            </n-form>
            <n-button type="primary" block secondary strong>
              注册
            </n-button>
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {UserOutlined as UsernameIcon, LockOutlined as PasswordIcon} from '@vicons/antd'
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100%;
  background-color: whitesmoke;
}

.login-content-container {
  position: absolute;
  left: 62%;
  top: 20%;
  width: 444px;
  height: 550px;
}

:deep(.login-card) {
  width: 100%;
  height: 100%;
  border: 1px solid #dee0e3;
  border-radius: 12px;
}

.login-card .n-card-header {
  font-size: 22px;
  font-weight: 600;
  line-height: 30px;
  color: #1f2329;
}
</style>
