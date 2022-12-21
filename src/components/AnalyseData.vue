<template>
    <div class="container">
        <div class="top-sale">
            <div class="chart-title">菜 品 销 量</div>
            <div id="saleChart"></div>
        </div>
        <div class="seven-count">
            <div class="chart-title">近 七 日 营 业 额</div>
            <div id="countChart"></div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import * as echarts from 'echarts';
import * as BUS from "@/eventBus/index.js"
export default {
    name: "AnalyseData",
    data: function () {
        return {
            domain: BUS.DOMAIN,
            typeSale_X_Data: [],
            typeSale_Y_Data: [],
            sumCount_X_Data: [],
            sumCount_Y_Data: [],
        }
    },
    methods: {
        initCountChart: function () {
            (async function (ctx) {
                try {
                    const chartData = await axios.get(`${ctx.domain}/ordersumcount`)
                    if (chartData.data.code === 0) {
                        chartData.data.data.forEach(item => {
                            ctx.sumCount_X_Data.push(item.Odate)
                            ctx.sumCount_Y_Data.push(item.sum)
                        })
                        var countChart = echarts.init(document.getElementById("countChart"))
                        var option = {
                            xAxis: {
                                type: 'category',
                                data: ctx.sumCount_X_Data,
                                name: "日期",
                                axisLabel: {
                                    align: "center"
                                }
                            },
                            yAxis: {
                                type: 'value',
                                name: "营业额(元)",
                                axisLabel: {
                                    align: 'center'
                                }
                            },
                            series: [
                                {
                                    data: ctx.sumCount_Y_Data,
                                    type: 'line',
                                    itemStyle : { normal: {label : {show: true}}}
                                }
                            ]
                        };
                        countChart.setOption(option)
                    } else {
                        ctx.$notify.error({
                            title: chartDate.data.msg,
                            msg: chartDate.data.error
                        })
                    }
                } catch (error) {
                    ctx.$notify.error({
                        title: "图表②渲染失败",
                        msg: error
                    })
                }
            })(this)
        },
        initSaleChart: function () {
            (async function (ctx) {
                try {
                    const chartData = await axios.get(`${ctx.domain}/DishTypeSales`)
                    if (chartData.data.code === 0) {
                        // 设置X和Y轴的数据
                        chartData.data.data.forEach(item => {
                            ctx.typeSale_X_Data.push(item.Dname)
                            ctx.typeSale_Y_Data.push(item.count)
                        })
                        // 渲染数据至图表
                        var saleChart = echarts.init(document.getElementById("saleChart"))
                        var option = {
                            tooltip: {},
                            legend: {
                                data: ['销量']
                            },
                            xAxis: {
                                data: ctx.typeSale_X_Data
                            },
                            yAxis: {},
                            series: [
                                {
                                    name: '销量',
                                    type: 'bar',
                                    data: ctx.typeSale_Y_Data,
                                    
                                },
                            ]
                        };
                        saleChart.setOption(option)
                    }
                    else {
                        ctx.$notify.error({
                            title: chartData.data.msg,
                            msg: chartData.data.error
                        })
                    }
                } catch (error) {
                    ctx.$notify.error({
                        title: "图表①渲染失败",
                        msg: error
                    })
                }
            })(this)
        }
    },
    mounted: function () {
        // 渲染 top-sale 条形图表
        this.initSaleChart()
        // 渲染 sevent-count 折线图表
        this.initCountChart()
    }
}
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    background-color: white;

    .chart-title {
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

    .top-sale {

        #saleChart {
            width: 100%;
            height: 300px;
        }
    }

    .seven-count {

        #countChart {
            width: 100%;
            height: 250px;
        }
    }

}
</style>