<template>
  <div class="login-container">
    <img class="go-chat-logo" src="../../public/assets/login-title.jpg" alt=""/>
    <div class="login-content-container">
      <n-card class="login-card" title="Just Chat ✨">
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
              <n-form-item>
                <n-checkbox>自动登录</n-checkbox>
                <n-button text tag="a" target="_blank" type="primary">
                  忘记密码
                </n-button>
              </n-form-item>
            </n-form>
            <n-button type="primary" block secondary strong @click="toLogin">
              登录
            </n-button>

            <div class="more-login-container">
              <n-divider>
                更多登录方式
              </n-divider>
              <n-flex class="more-login-btn" justify="space-around">
                <n-button text color="#e05244">
                  <template #icon>
                    <n-icon size="35" :component="WeiboIcon" />
                  </template>
                </n-button>
                <n-button text color="#00bb29">
                  <template #icon>
                    <n-icon size="35" :component="WechatIcon" />
                  </template>
                </n-button>
                <n-button text color="#498ad5">
                  <template #icon>
                    <n-icon size="35" :component="QQIcon" />
                  </template>
                </n-button>
                <n-button text color="rgb(23, 114, 246)">
                  <template #icon>
                    <n-icon size="35" :component="ZhihuIcon" />
                  </template>
                </n-button>
              </n-flex>
            </div>
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
                    <n-button text tag="a" target="_blank" type="primary" @click="getMyCode" v-if="!codeFinish">
                      获取验证码
                    </n-button>
                    <n-button text tag="a" target="_blank" type="primary" :disabled="true" v-else>
                      {{ remainingTime.seconds }} 秒后重新获取
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
            <n-button type="primary" block secondary strong @click="toRegister">
              注册
            </n-button>
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {UserOutlined as UsernameIcon, LockOutlined as PasswordIcon, WeiboOutlined as WeiboIcon, ZhihuOutlined as ZhihuIcon,
  QqOutlined as QQIcon, WechatOutlined as WechatIcon} from '@vicons/antd'
import {NumberSymbolSquare24Regular as CodeIcon} from '@vicons/fluent'
import { createDiscreteApi, type FormInst } from 'naive-ui'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router';
import { RouteEnum } from '@/enums/routeEnums.ts'
import { sendVerifyCode, register } from '@/api/register.ts'
import { login } from '@/api/login.ts'

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
      return
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
        await router.push({ name: RouteEnum.HOME });
        message.success('登录成功!')
      } else {
        message.error('账号或密码错误!')
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
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
  font-size: 12px;
  font-weight: 600;
  line-height: 30px;
  margin-left: 100px;
}

:deep(.login-card .n-card-header__main) {
  margin-left: 300px;
  padding-top: 11px;
  font-size: 16px;
  --n-title-text-color: #18a058!important;
  cursor: pointer;
}

:deep(.login-form .n-form-item .n-form-item-blank) {
  justify-content: space-between;
}

:deep(.login-form .n-input .n-input__prefix) {
  margin-right: 10px;
}

:deep(.register-form .n-input .n-input__prefix) {
  margin-right: 10px;
}

:deep(.login-form .n-input .n-input__suffix) {
  margin-top: 2px;
}

:deep(.login-form .n-input__placeholder) {
  margin-top: 1px;
}

:deep(.register-form .n-input__placeholder) {
  margin-top: 1px;
}

.more-login-container {
  margin-top: 80px;
}

:deep(.more-login-container .n-divider__title) {
  font-size: 12px;
  color: #b5b5b5;
}

.go-chat-logo {
  width: 220px;
  height: 60px;
  position: absolute;
  left: 63%;
  top: 21%;
  z-index: 1000;
}

.chat-emoji {
  position: absolute;
  left: 86.5%;
  top: 24%;
  z-index: 1000;
  color: orange;
}
</style>
