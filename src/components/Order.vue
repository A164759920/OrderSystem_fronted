<template>
    <div class="container">
        <el-table :data="tableData" stripe style="width: 100%" class="table">
            <el-table-column type="expand" class="table-item" width="40">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="table-expand">
                        <div class="table-expand-title">
                            <div class="title-item">菜品</div>
                            <div class="title-item">单价</div>
                            <div class="title-item">数量</div>
                        </div>
                        <div class="table-expand-data" v-for="(item, index) in props.row.ORDER_DETAILs">
                            <div class="data-item">{{ item.Dname }}</div>
                            <div class="data-item">{{ item.Dprice }}</div>
                            <div class="data-item">{{ item.Dcount }}</div>
                        </div>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column class="table-item" prop="Odate" label="日期" width="180">
            </el-table-column>
            <el-table-column class="table-item" prop="Ono" label="订单编号" width="180">
            </el-table-column>
            <el-table-column class="table-item" prop="Cname" label="顾客名称">
            </el-table-column>
            <el-table-column class="table-item" prop="Ototal" label="总价(元)" width="100">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="small">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import AxiosRequest from "../utils/http/index"
// import axios from 'axios';
import * as BUS from "../eventBus/index.js"
export default {
    name: "Order",
    data: function () {
        return {
            domain: BUS.DOMAIN,
            tableData: []
        }
    },
    mounted: function () {
        (async function (ctx) {
            try {
                const dishData = await AxiosRequest.get(`${ctx.domain}/orderall`)
                if (dishData.data.code === 0) {
                    console.log(dishData.data)
                    ctx.tableData = dishData.data.data
                } else {
                    ctx.$notify.error({
                        title: "系统错误",
                        message: this.tableData.msg
                    })
                }
            } catch (error) {
                ctx.$notify.error({
                    title: "系统错误",
                    message: error
                })
            }
        })(this)
    },
    methods: {
        deleteRow: async function (index, rows) {
            try {
                const res = await AxiosRequest.post(`${this.domain}/OrderDelete`, {
                    Ono: this.tableData[index].Ono
                })
                if (res.data.code === 0) {
                    this.$notify.success({
                        title: "成功",
                        message: `订单:${this.tableData[index].Ono} 删除成功`
                    })
                    // 删除订单在表中的数据
                    rows.splice(index, 1);
                } else {
                    this.$notify.error({
                        title: `订单:${this.tableData[index].Ono} 删除成功`,
                        message: res.data.error
                    })
                }
            } catch (error) {
                this.$notify.error({
                    title: `订单:${this.tableData[index].Ono} 删除成功`,
                    message: error
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    width: 100%;

    .table-expand {
        padding-left: 20px;

        .table-expand-title {
            display: flex;
            margin-bottom: 10px;

            .title-item {
                color: #909399;
                font-size: 16px;
                font-weight: 550;
                width: 150px;
                font-family: Arial, Helvetica, sans-serif;
                text-align: center;
            }
        }

        .table-expand-data {
            display: flex;

            .data-item {
                width: 150px;
                font-family: Arial, Helvetica, sans-serif;
                text-align: center;
                font-size: 14px;
                margin-bottom: 5px;
            }
        }
    }
}
</style>