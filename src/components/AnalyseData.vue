<template>
    <div class="container">
        <div class="top-sale">
            <div class="chart-title">
                菜 品 销 量
            </div>
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
            typeSaleXData: [],
            typeSaleYData: []
        }
    },
    mounted: function () {
        // 渲染 top-sale图表
        (async function (ctx) {
            try {
                const chartData = await axios.get(`${ctx.domain}/DishTypeSales`)
                if (chartData.data.code === 0) {
                    // 设置X和Y轴的数据
                    chartData.data.data.forEach(item => {
                        ctx.typeSaleXData.push(item.Dname)
                        ctx.typeSaleYData.push(item.count)
                    })
                    // 渲染数据至图表
                    var saleChart = echarts.init(document.getElementById("saleChart"))
                    var option = {
                        tooltip: {},
                        legend: {
                            data: ['销量']
                        },
                        xAxis: {
                            data: ctx.typeSaleXData
                        },
                        yAxis: {},
                        series: [
                            {
                                name: '销量',
                                type: 'bar',
                                data: ctx.typeSaleYData
                            }
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
                    title: "图表渲染失败",
                    msg: error
                })
            }
        })(this)

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