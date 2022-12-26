<template>
    <div class="container">
        <div class="header">
            点 餐 管 理 系 统
        </div>
        <div class="register" :class="{ 'input': isFocus }">
            <div class="register-title">注 册</div>
            <CusInput class="username" v-model="username" type="text" custom="outline" placeholder="用户名" clearable
                prefix-icon="el-icon-user" @focus="inputFocus" @blur="inputBlur"></CusInput>
            <CusInput class="cphone" v-model="Cphone" type="text" custom="outline" placeholder="联系电话" clearable
                prefix-icon="el-icon-user" style="margin-top:10px" @focus="inputFocus" @blur="inputBlur"></CusInput>
            <CusInput class="password" v-model="password" type="text" custom="outline" placeholder="密码" clearable
                prefix-icon="el-icon-lock" style="margin-top:10px" @focus="inputFocus" @blur="inputBlur"></CusInput>
            <CusInput class="repassword" v-model="rePassword" type="text" custom="outline" placeholder="确认密码" clearable
                prefix-icon="el-icon-lock" style="margin-top:10px" @focus="inputFocus" @blur="inputBlur"></CusInput>

            <div class="register-button" @click="register">
                注册
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import CusInput from "@/components/CusInput.vue"
import * as BUS from "@/eventBus/index.js"
export default {
    components: {
        CusInput
    },
    data: function () {
        return {
            isFocus: false,
            username: '',
            password: '',
            rePassword: '',
            Cphone: "",
            domain: BUS.DOMAIN
        }
    },
    methods: {

        login: async function () {
            console.log(this.username, this.password)
            if (this.username === "" || this.password === "") {
                this.$notify.error({
                    title: "登录失败",
                    message: "用户名/密码不能为空"
                })
            } else {
                try {
                    const res = await axios.post(`${this.domain}/login`,
                        {
                            "Cname": this.username,
                            "Cpwd": this.password
                        })
                    if (res) {
                        if (res.data.code === 0) {
                            console.log(res.data.msg)
                            this.$router.push("/home")
                            // 保存用户名
                            BUS.Cname = this.username
                        }
                        else {
                            console.log(res.data.msg)
                            this.$notify.error({
                                title: "登录失败",
                                message: res.data.error
                            })
                        }
                    }
                } catch (error) {
                    this.$notify.error({
                        title: "登录失败",
                        message: error
                    })
                }
            }
        },
        register: async function () {
            const that = this
            if (this.password === this.rePassword) {
                try {
                    const res = await axios.post(`${this.domain}/register`, {
                        Cname: this.username,
                        Cpwd: this.rePassword,
                        Cphone: this.Cphone
                    })
                    if (res.data.code === 0) {
                        alert("注册成功,3秒后将自动登录")
                        setTimeout(() => {
                            // this.$router.push("/home")
                            that.login()
                        }, 3 * 1000);
                    } else {
                        alert(`注册失败
                        ⚠${res.data.error}`)
                    }
                } catch (error) {
                    alert(`注册失败
                        ⚠${error}`)
                }
            } else {
                alert(`注册失败
                ⚠两次输入密码不一致`)
            }
        },
        inputFocus: function () {
            const login = document.getElementsByClassName("register")
            login[0].classList.add('input')

        },
        inputBlur: function () {
            this.isFocus = false
            const login = document.getElementsByClassName("register")
            login[0].classList.remove("input")
        },
    },
    mounted: function () {

    }
}
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;

    .header {
        width: 100%;
        height: 50px;
        background-color: #1976D2;
        position: absolute;
        top: 0;
        line-height: 50px;
        text-align: center;
        font-family: Arial, Helvetica, sans-serif;
        color: white;
        font-weight: 550;
    }

    .register {
        width: 400px;
        height: 300px;
        background-color: whitesmoke;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-width: 315px;

        .register-title {
            color: #03A9F4;
            font-size: 20px;
            font-family: Arial, Helvetica, sans-serif;
            font-weight: 550;
            margin-bottom: 10px;
        }

        .register-button {
            margin-top: 10px;
            width: 230px;
            height: 35px;
            line-height: 35px;
            text-align: center;
            background-color: #03A9F4;
            border-radius: 5px;
            color: white;
        }

        .register-button:hover {
            cursor: pointer;
        }
    }

    .input {
        position: absolute;
        top: 0;
        z-index: 999;
    }
}
</style>