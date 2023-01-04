<template>
    <div class="container">
        <div class="title"> 菜 品 管 理</div>
        <div class="dish" v-for="(typeItem, typeIndex) in typeList">
            <div class="dish-type">
                <div>{{ typeItem }}</div>
                <div class="dish-add" @click="openAddDishDialog(typeIndex)">添加菜品</div>
            </div>
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
                        <el-button @click.native.prevent="openDeleteDialog(typeIndex, scope.$index)" type="text"
                            size="small" style="color: red;">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog class="addDish-dialog" title="添加菜品" :visible.sync="addDishDialogVisible">
            <div class="addDish-tip">正在添加新菜品至：
                <span>{{ addDishDialogData.Dtype }}</span> 分类中
            </div>
            <div class="addDish-editor">
                <div class="addDish-editor-item">
                    <div class="addDish-editor-item-title">菜品名：</div>
                    <input class="addDish-editor-item-input" v-model="addDishDnameInput" />
                </div>
                <div class="addDish-editor-item">
                    <div class="addDish-editor-item-title">单价(元)：</div>
                    <input class="addDish-editor-item-input" v-model="addDishDpriceInput" />
                </div>
            </div>
            <div class="addDish-change">
                <div class="addDish-change-sure" @click="saveAddDishChange">保 存</div>
                <div class="addDish-change-cancel" @click="cancelAddDishChange">取 消</div>
            </div>
        </el-dialog>
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
                <div class="save-button" @click="saveEditorChange">保 存</div>
            </div>

        </el-dialog>
        <el-dialog class="delete-dialog" title="提示" :visible.sync="deleteDialogVisible">
            <div class="delete-dialog-tip">确认要删除<span>{{ deleteDialogData.Dname }}</span>吗？
            </div>
            <div class="delete-dialog-change">
                <div class="delete-dialog-sure" @click="saveDeleteChange">确 认</div>
                <div class="delete-dialog-cancel" @click="cancelDeleteChange">取 消</div>
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
            dialogVisible: false, // 编辑对话框是否可视
            dialogInputData: "", // 编辑对话框输入的数据
            dialogData: {     // 编辑对话框初始化内容
                Dname: "",
                fieldKey: "",
                oldData: "",
                typeIndex: "",
                dishIndex: ""
            },
            deleteDialogVisible: false, // 删除对话框是否可视
            deleteDialogData: {
                Dname: "",
                typeIndex: "",
                dishIndex: ""
            },
            addDishDialogVisible: false, // 添加菜品对话框是否可视
            addDishDnameInput: "", // 新菜品的名称
            addDishDpriceInput: "", // 新菜品的单价
            addDishDialogData: {
                typeIndex: "",
                Dtype: ""
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

        },
    },
    methods: {
        /**
         * 初始化编辑对话框
         * @param {String} fieldKey 修改的字段名
         * @param {String} typeIndex typeList的索引
         * @param {String} dishIndex dishList的索引
         */
        openEditorDialog: function (fieldKey, typeIndex, dishIndex) {
            // 打开编辑对话框
            this.dialogVisible = true
            // 设置对话框数据
            this.dialogData = {
                Dname: this.dishList[typeIndex][dishIndex].Dname,
                fieldKey,
                oldData: this.dishList[typeIndex][dishIndex][fieldKey],
                typeIndex,
                dishIndex
            }
        },
        /**
         * 保存编辑对话框的更改
         */
        saveEditorChange: async function () {
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
                    that.dialogInputData = ""

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
        /**
         * 打开删除对话框
         * @param {String} typeIndex typeList索引
         * @param {String} dishIndex dishList索引
         */
        openDeleteDialog: function (typeIndex, dishIndex) {
            this.deleteDialogVisible = true
            this.deleteDialogData = {
                Dname: this.dishList[typeIndex][dishIndex].Dname,
                typeIndex,
                dishIndex
            }
        },
        /**
         * 删除对话框 确认操作
         */
        saveDeleteChange: async function () {
            try {
                const res = await axios.post(`${this.domain}/DishDelete`, {
                    Dname: this.deleteDialogData.Dname
                })
                if (res.data.code === 0) {
                    this.$notify.success({
                        title: "删除成功"
                    })
                    // 删除表中的数据
                    this.dishList[this.deleteDialogData.typeIndex].splice(this.deleteDialogData.dishIndex, 1)
                    // 关闭对话框
                    this.deleteDialogVisible = false

                }
                else {
                    this.$notify.error({
                        title: "删除失败",
                        message: res.data.error
                    })
                }
            } catch (error) {
                this.$notify.error({
                    title: "删除失败",
                    message: error
                })
            }
        },
        /**
         * 删除对话框 取消操作
         */
        cancelDeleteChange: function () {
            this.deleteDialogVisible = false
        },
        /**
         * 打开添加菜品对话框
         * @param {String} typeIndex typeList索引
         */
        openAddDishDialog: function (typeIndex) {
            console.log("测试",this.typeList[typeIndex])
            this.addDishDialogVisible = true
            this.addDishDialogData = {
                typeIndex,
                Dtype: this.typeList[typeIndex]
            }
        },
        /**
         * 添加菜品对话框 保存操作
         */
        saveAddDishChange: async function () {
            const dishObj = {
                Dtype: this.addDishDialogData.Dtype,
                Dname: this.addDishDnameInput,
                Dprice: this.addDishDpriceInput
            }
            console.log("添加的数据", dishObj)
            try {
                const res = await axios.post(`${this.domain}/DishAdd`, {dishObj})
                if (res.data.code === 0) {
                    this.$notify.success({
                        title: "添加成功"
                    })
                    // 添加新数据到表中
                    this.dishList[this.addDishDialogData.typeIndex].push(res.data.data)
                    // 关闭对话框
                    this.addDishDialogVisible = false
                }
                else {
                    this.$notify.error({
                        title: "添加失败",
                        message: res.data.error
                    })
                }
            } catch (error) {
                this.$notify.error({
                    title: "添加失败",
                    message: error
                })
            }
        },
        /**
         * 添加菜品对话框 取消操作
         */
        cancelAddDishChange: function () {
            this.addDishDialogVisible = false
        }
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
        box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    }

    .table {
        font-size: 16px;
    }

    .dish {
        .dish-type {
            position: relative;
            display: flex;
            width: 100%;
            height: 50px;
            line-height: 50px;
            text-align: center;
            justify-content: center;
            word-spacing: 10px;
            font-size: 17px;
            font-weight: 500;
            font-family: Arial, Helvetica, sans-serif;
            background-color: #BDBDBD;
            color: black;
            box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
            .dish-add {
                position: absolute;
                top: 7.5px;
                right: 15px;
                width: 90px;
                height: 35px;
                line-height: 35px;
                border-radius: 10px;
                font-family: Arial, Helvetica, sans-serif;
                background-color: white;
            }

            .dish-add:hover {
                cursor: pointer;
                box-shadow: rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.9) 0px 0px 0px 1px;
            }
        }
    }

    .addDish-dialog {
        .addDish-tip {
            width: 100%;
            height: 50px;
            line-height: 50px;
            font-size: 18px;
        }

        .addDish-tip span {
            margin-right: 6px;
            font-size: 18px;
            font-weight: 550;
            color: #03A9F4
        }

        .addDish-editor {
            width: 100%;
            display: flex;
            margin-top: 20px;

            .addDish-editor-item {
                width: 50%;
                display: flex;
                height: 40px;
                line-height: 40px;
                font-size: 18px;

                .addDish-editor-item-input {
                    margin-left: 5px;
                    font-size: 17px;
                }
            }
        }

        .addDish-change {
            display: flex;
            width: 100%;
            height: 50px;
            justify-content: center;
            margin-top: 70px;

            .addDish-change-sure {
                width: 80px;
                height: 45px;
                margin-right: 40px;
                line-height: 45px;
                border-radius: 10px;
                text-align: center;
                font-size: 16px;
                font-weight: 500;
                color: white;
                background-color: #03A9F4;
            }
            .addDish-change-sure:hover{
                cursor: pointer;
            }
            .addDish-change-cancel {

                width: 80px;
                height: 45px;
                margin-left: 40px;
                line-height: 45px;
                border-radius: 10px;
                text-align: center;
                font-size: 16px;
                font-weight: 500;
                color: black;
                background-color: #BDBDBD;
            }
            .addDish-change-cancel:hover{
                cursor: pointer;
            }
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
                background-color: hsl(199, 98%, 48%);
                color: white;
                box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
            }
        }
    }

    .delete-dialog {
        font-size: 17px;
        font-family: Arial, Helvetica, sans-serif;

        .delete-dialog-tip {
            width: 100%;
            height: 50px;
            line-height: 50px;
            font-size: 18px;
        }

        .delete-dialog-tip span {
            margin-left: 2px;
            margin-right: 2px;
            font-size: 18px;
            font-weight: 550;
            color: #03A9F4
        }

        .delete-dialog-change {
            display: flex;
            width: 100%;
            height: 50px;
            justify-content: center;

            .delete-dialog-sure {
                width: 70px;
                height: 50px;
                margin-right: 20px;
                line-height: 50px;
                border-radius: 10px;
                text-align: center;
                font-size: 16px;
                font-weight: 500;
                color: white;
                background-color: #03A9F4;
            }

            .delete-dialog-sure:hover {
                cursor: pointer;
            }

            .delete-dialog-cancel {

                width: 70px;
                height: 50px;
                margin-left: 20px;
                line-height: 50px;
                border-radius: 10px;
                text-align: center;
                font-size: 16px;
                font-weight: 500;
                color: black;
                background-color: #BDBDBD;
            }

            .delete-dialog-cancel:hover {
                cursor: pointer;
            }
        }
    }
}
</style>