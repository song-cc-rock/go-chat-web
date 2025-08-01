<template>
  <div class="login-container">
    <div class="login-card-container">
      <n-card class="login-card">
        <div class="login-header">
          <h2>Just Chat <span>✨</span></h2>
        </div>
        <n-tabs default-value="signin" size="large" justify-content="space-evenly">
          <n-tab-pane name="signin" tab="登录">
            <n-form :show-label="false" class="login-form" ref="formRef" :model="loginForm" :rules="rules">
              <n-form-item path="account">
                <n-input placeholder="手机号或邮箱" v-model:value="loginForm.account">
                  <template #prefix>
                    <n-icon size="20" :component="UsernameIcon" />
                  </template>
                </n-input>
              </n-form-item>
              <n-form-item path="password">
                <n-input type="password" placeholder="密码" show-password-on="click" v-model:value="loginForm.password">
                  <template #prefix>
                    <n-icon size="20" :component="PasswordIcon" />
                  </template>
                </n-input>
              </n-form-item>
              <n-form-item class="login-options">
                <n-checkbox>自动登录</n-checkbox>
                <n-button text tag="a" target="_blank" type="primary">
                  忘记密码
                </n-button>
              </n-form-item>
            </n-form>
            <n-button type="primary" block strong @click="toLogin">
              登录
            </n-button>
<!-- 
            <div class="more-login-container">
              <n-divider class="modern-divider">其他登录方式</n-divider>
              <div class="social-login-row">
                <n-button text circle @click="redirectAuthUrl('github')" class="social-btn">
                  <template #icon>
                    <n-icon size="28" :component="GithubIcon" />
                  </template>
                </n-button>
                <n-button text circle @click="redirectAuthUrl('wechat')" class="social-btn">
                  <template #icon>
                    <n-icon size="28" :component="WechatIcon" />
                  </template>
                </n-button>
                <n-button text circle class="social-btn">
                  <template #icon>
                    <n-icon size="28" :component="QQIcon" />
                  </template>
                </n-button>
                <n-button text circle class="social-btn">
                  <template #icon>
                    <n-icon size="28" :component="ZhihuIcon" />
                  </template>
                </n-button>
              </div>
            </div> -->
          </n-tab-pane>
          <n-tab-pane name="signup" tab="注册">
            <n-form :show-label="false" class="register-form" :model="registerForm" ref="registerRef" :rules="registerRules">
              <n-form-item path="account">
                <n-input placeholder="手机号或邮箱" v-model:value="registerForm.account">
                  <template #prefix>
                    <n-icon size="20" :component="UsernameIcon" />
                  </template>
                </n-input>
              </n-form-item>
              <n-form-item path="code">
                <n-input placeholder="验证码" v-model:value="registerForm.code">
                  <template #prefix>
                    <n-icon size="20" :component="CodeIcon" />
                  </template>
                  <template #suffix>
                    <n-button text type="primary" @click="getMyCode" v-if="!codeFinish">
                      获取验证码
                    </n-button>
                    <n-button text type="primary" :disabled="true" v-else>
                      {{ remainingTime.seconds }}s
                    </n-button>
                  </template>
                </n-input>
              </n-form-item>
              <n-form-item path="password">
                <n-input type="password" placeholder="初始密码" show-password-on="click" v-model:value="registerForm.password">
                  <template #prefix>
                    <n-icon size="20" :component="PasswordIcon" />
                  </template>
                </n-input>
              </n-form-item>
            </n-form>
            <n-button type="primary" block strong @click="toRegister">
              注册
            </n-button>
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {UserOutlined as UsernameIcon, LockOutlined as PasswordIcon, GithubOutlined as GithubIcon, ZhihuOutlined as ZhihuIcon,
  QqOutlined as QQIcon, WechatOutlined as WechatIcon} from '@vicons/antd'
import {NumberSymbolSquare24Regular as CodeIcon} from '@vicons/fluent'
import { createDiscreteApi, type FormInst } from 'naive-ui'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router';
import { RouteEnum } from '@/enums/routeEnums.ts'
import { sendVerifyCode, register } from '@/api/register.ts'
import { login } from '@/api/login.ts'
import { getAuthUrl } from '@/api/auth.ts'
import { getBaseAuthByType } from '@/constants/auth.ts'
import { getUserProfile } from '@/api/user.ts'
import { setAuthUser } from '@/utils/auth.ts'

const router = useRouter()
const formRef = ref<FormInst | null>(null)
const registerRef = ref<FormInst | null>(null)
const loginForm = ref({ account: '', password: '' })
const registerForm = ref({account: '', code: '', password: ''})
const rules = {
  account: [{ required: true, message: '请输入手机号或邮箱' }],
  password: [{ required: true, message: '请输入密码' }]
}
const registerRules = {
  account: [{ required: true, message: '请输入手机号或邮箱' }],
  code: [{ required: true, message: '请输入验证码' }],
  password: [{ required: true, message: '请输入密码' }]
}
const totalTime = 60
const { message } = createDiscreteApi(["message"])
const codeFinish = ref<boolean>(false)

const remainingTime = reactive ({
  seconds: totalTime
})
// countdown timer
let timer : number | undefined;

const getMyCode = async () => {
  if (!codeFinish.value) {
    if (!registerForm.value.account) {
        message.error('请填写手机或邮箱!');
        return;
      }
    
    await sendVerifyCode(registerForm.value.account);
    message.success('验证码已发送，请注意查收!');
    codeFinish.value = true;
    remainingTime.seconds = totalTime;
  }
  timer = setInterval(() => {
    if (remainingTime.seconds > 1) {
      remainingTime.seconds--;
    } else {
      codeFinish.value = false;
      clearInterval(timer);
    }
  }, 1000);
}

const toRegister = () => {
  registerRef.value?.validate(async (errors) => {
    if (!errors) {
      const user = {
        mail: registerForm.value.account,
        code: registerForm.value.code,
        password: registerForm.value.password
      }
      await register(user)
      message.success('注册成功, 请登录!');
    }
  })
}

const toLogin = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const loginUser = {
        mail: loginForm.value.account,
        password: loginForm.value.password
      }
      const token = await login(loginUser)
      if (token) {
        localStorage.setItem("token", token)
        // 新增：登录成功后立即获取用户信息
        const user = await getUserProfile();
        if (user) {
          setAuthUser(user);
        }
        await router.push({ name: RouteEnum.HOME });
        message.success('登录成功!')
      } else {
        message.error('账号或密码错误!')
      }
    }
  })
}

const redirectAuthUrl = async (authType: string) => {
  const redirectParam = await getAuthUrl(authType)
  window.location.href = getBaseAuthByType(authType) + redirectParam
}
</script>

<style scoped>
.login-container {
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  padding-right: 10vw;
}

.login-container::before {
  content: '';
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  background: linear-gradient(135deg, #a8ff78 0%, #1aad19 100%);
  filter: blur(25px);
  z-index: -1;
}

.login-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(255, 119, 198, 0.3) 0%, transparent 50%);
  z-index: -1;
}

.login-card-container {
  width: 420px;
}

.login-card {
  border-radius: 20px;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1), 0 8px 32px rgba(31, 38, 135, 0.1);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  min-height: 420px;
  display: flex;
  flex-direction: column;
}

.login-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 28px;
}

.go-chat-logo {
  width: 60px;
  height: 60px;
  margin-right: 20px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 30px;
  font-weight: 700;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.3px;
}

h2 span {
  background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-form .n-form-item,
.register-form .n-form-item {
  margin-bottom: 20px;
}

.login-form .n-input,
.register-form .n-input {
  --n-height: 52px;
  --n-padding: 0 18px;
  --n-font-size: 15px;
  --n-border-radius: 14px;
  --n-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --n-font-weight: 400;
  --n-letter-spacing: 0.2px;
}

.login-form .n-input::placeholder,
.register-form .n-input::placeholder {
  color: rgba(0, 0, 0, 0.5);
  font-weight: 400;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 14px;
  font-weight: 500;
}

.login-options .n-checkbox {
  --n-font-size: 14px;
  --n-font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
}

.login-options .n-button {
  --n-font-size: 14px;
  --n-font-weight: 500;
  color: #007AFF;
}

.more-login-container {
  margin-top: 20px;
  margin-bottom: 0;
}

.modern-divider {
  --n-color: rgba(0, 0, 0, 0.15);
  --n-text-color: rgba(0, 0, 0, 0.45);
  --n-font-size: 9px;
  --n-font-weight: 500;
  --n-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --n-letter-spacing: 1px;
  margin-bottom: 12px;
}

.modern-divider .n-divider__text {
  background: rgba(255, 255, 255, 0.9);
  padding: 0 12px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  border-radius: 10px;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.social-login-row {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 6px;
}

.social-btn {
  width: 36px !important;
  height: 36px !important;
  border-radius: 10px !important;
  background: rgba(255, 255, 255, 0.6) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(8px) !important;
  -webkit-backdrop-filter: blur(8px) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative !important;
  overflow: hidden !important;
}

.social-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.social-btn:hover {
  transform: translateY(-1px) scale(1.03) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
  background: rgba(255, 255, 255, 0.75) !important;
}

.social-btn:hover::before {
  opacity: 1;
}

.social-btn:active {
  transform: translateY(0px) scale(1.01) !important;
  transition: all 0.1s ease !important;
}

.social-btn .n-icon {
  transition: all 0.3s ease;
  color: rgba(0, 0, 0, 0.5);
}

.social-btn:hover .n-icon {
  transform: scale(1.05);
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.08));
  color: rgba(0, 0, 0, 0.7);
}

:deep(.n-tabs) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

:deep(.n-tabs .n-tabs-nav) {
  --n-tabs-bar-color: var(--n-primary-color);
  margin-bottom: 24px;
}

:deep(.n-tabs .n-tabs-tab-pad) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

:deep(.n-tabs .n-tab-pane) {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 280px;
}

:deep(.n-tabs .n-tab) {
  --n-font-size: 15px;
  --n-font-weight: 600;
  --n-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --n-letter-spacing: 0.2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

:deep(.n-tabs .n-tab:hover) {
  transform: translateY(-1px);
  color: #007AFF;
}

:deep(.n-tabs .n-tab--active) {
  color: #007AFF;
  font-weight: 700;
}

:deep(.n-tabs .n-tab--active::after) {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
  border-radius: 2px;
}

:deep(.n-divider) {
  --n-color: rgba(255, 255, 255, 0.3);
  --n-text-color: rgba(255, 255, 255, 0.7);
  --n-font-size: 13px;
  --n-font-weight: 500;
  --n-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

:deep(.n-divider__text) {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 0 14px;
  border-radius: 16px;
}

:deep(.n-input) {
  --n-border-radius: 14px;
  --n-border-hover: 1px solid rgba(0, 122, 255, 0.3);
  --n-border-focus: 1px solid rgba(0, 122, 255, 0.5);
  --n-box-shadow-focus: 0 0 0 3px rgba(0, 122, 255, 0.1);
  --n-background-color: rgba(255, 255, 255, 0.9);
  --n-background-color-hover: rgba(255, 255, 255, 0.95);
  --n-background-color-focus: rgba(255, 255, 255, 1);
}

:deep(.n-button) {
  --n-border-radius: 14px;
  --n-height: 52px;
  --n-font-size: 15px;
  --n-font-weight: 600;
  --n-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --n-letter-spacing: 0.3px;
}

:deep(.n-button--primary-type) {
  --n-color: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
  --n-color-hover: linear-gradient(135deg, #0056CC 0%, #4A4AC8 100%);
  --n-color-pressed: linear-gradient(135deg, #004499 0%, #3A3AB8 100%);
  --n-border: none;
  --n-box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
  --n-box-shadow-hover: 0 6px 20px rgba(0, 122, 255, 0.4);
}
</style>
