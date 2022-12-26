<template>
    <div class="container">
        <div class="title"> 菜 品 管 理</div>
        <div class="dish" v-for="(typeItem, typeIndex) in typeList">
            <div class="dish-type">{{ typeItem }}</div>
            <el-table :data="dishList[typeIndex]" stripe style="width: 100%" class="table">
                <el-table-column class="table-item" prop="Dname" label="菜品名">
                </el-table-column>
                <el-table-column label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="openEditorDialog('Dname', typeIndex, scope.$index)"
                            type="text" size="small">
                            编辑
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column class="table-item" prop="Dprice" label="单价">
                </el-table-column>
                <el-table-column label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="openEditorDialog('Dprice', typeIndex, scope.$index)"
                            type="text" size="small">
                            编辑
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="deleteDish(scope.$index)" type="text" size="small"
                            style="color: red;">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog class="editor-dialog" title="编辑数据" :visible.sync="dialogVisible">
            <div class="dialog-tip">正在修改：
                <div class="tip-Dname">{{ dialogData.Dname }}-</div>
                <div class="tip-fieldKey">{{ dialogfieldName }}</div>
            </div>
            <div class="dialog-change">
                <div class="change-oldData">原数据： {{ dialogOldData }}</div>
                <div class="change-newData">
                    新数据:
                    <input class="dialog-input" v-model="dialogInputData" type="text">
                </div>
            </div>
            <div class="dialog-save">
                <div class="save-button" @click="saveChange">保 存</div>
            </div>

        </el-dialog>
    </div>
</template>

<script>
import * as BUS from "@/eventBus/index.js"
import axios from "axios";
export default {
    data: function () {
        return {
            typeList: [],
            dishList: [],
            domain: BUS.DOMAIN,
            dialogVisible: false,
            dialogInputData: "", // 编辑对话框输入的数据
            dialogData: {     // 编辑对话框初始化内容
                Dname: "",
                fieldKey: "",
                oldData: "",
                typeIndex: "",
                dishIndex: ""
            }
        }
    },
    computed: {
        dialogfieldName: function () {
            return this.dialogData.fieldKey === "Dprice" ? `单价(元)` : `菜品名`
        },
        dialogOldData: function () {
            if (this.dialogData.oldData) {
                return this.dialogData.fieldKey === "Dprice" ? `${this.dialogData.oldData}(元)` : `${this.dialogData.oldData}`
            } else {
                return ""
            }

        }
    },
    methods: {
        openEditorDialog: function (fieldKey, typeIndex, dishIndex) {
            this.dialogVisible = true
            this.dialogData = {
                Dname: this.dishList[typeIndex][dishIndex].Dname,
                fieldKey,
                oldData: this.dishList[typeIndex][dishIndex][fieldKey],
                typeIndex,
                dishIndex
            }
        },
        saveChange: async function () {
            const that = this
            try {
                const res = await axios.post(`${this.domain}/DishEditor`, {
                    Dname: that.dialogData.Dname,
                    fieldKey: that.dialogData.fieldKey,
                    newData: that.dialogInputData
                })
                if (res.data.code === 0) {
                    this.$notify.success({
                        title: "修改成功"
                    })
                    // 改变页面内容
                    that.dishList[that.dialogData.typeIndex][that.dialogData.dishIndex][that.dialogData.fieldKey] = res.data.data
                    // 关闭对话框
                    that.dialogVisible = false

                } else {
                    this.$notify.error({
                        title: "修改失败",
                        error: res.data.error
                    })
                }
            } catch (error) {
                console.log("错误", error)
                this.$notify.error({
                    title: "修改失败",
                    error: error
                })
            }
        },
    },
    mounted: function () {
        const that = this
        // 获取菜品分类
        axios.get(`${this.domain}/DishTypeAll`).then(value => {
            if (value.data.code === 0) {
                that.typeList = value.data.data
            } else {
                console.log("渲染错误", value.data)
            }
        }, error => {
            console.log("渲染错误", error)
        })
        // 获取菜品详细信息
        axios.get(`${this.domain}/DishAll`).then(value => {
            if (value.data.code === 0) {
                that.dishList = value.data.data
            } else {
                console.log("渲染错误", value.data)
            }
        }, error => {
            console.log("渲染错误", error)
        })
    }
}
</script>

<style lang="scss" scoped>
.container {
    width: 100%;


    .title {
        width: 100%;
        height: 50px;
        background-color: #03A9F4;
        // color: #212121;
        color: white;
        font-size: 16px;
        font-weight: 550;
        font-family: Arial, Helvetica, sans-serif;
        line-height: 50px;
        text-align: center;
    }

    .dish {
        .dish-type {
            width: 100%;
            height: 40px;
            font-size: 15px;
            font-weight: 500;
            background-color: #BDBDBD;
            color: black;
            line-height: 40px;
            text-align: center;
        }
    }

    .editor-dialog {

        .dialog-tip {
            font-size: 17px;
            display: flex;
            height: 40px;
            width: 100%;
            line-height: 40px;

            .tip-Dname {
                margin-left: 2px;
                font-size: 18px;
                color: gray;
                font-weight: 500;
            }

            .tip-fieldKey {
                font-size: 18px;
                color: #03A9F4;
                font-weight: 500;
            }
        }

        .dialog-change {
            width: 100%;
            display: flex;
            height: 50px;
            line-height: 50px;
            font-size: 18px;

            .change-oldData {
                width: 50%;
            }

            .change-newData {
                width: 50%;

                .dialog-input {
                    font-size: 17px;
                    height: 60%;
                }
            }

        }

        .dialog-save {
            width: 100%;
            height: 50px;
            margin-top: 50px;
            display: flex;
            justify-content: space-around;

            .save-button {
                width: 200px;
                height: 50px;
                line-height: 50px;
                text-align: center;
                font-size: 18px;
                font-weight: 550;
                border-radius: 10px;
                background-color: #03A9F4;
                color: white;
            }
        }
    }
}
</style>