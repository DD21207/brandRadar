<template>
  <div ref="mychart" style="height:350px;"></div>
</template>
<script>
  import echarts from 'echarts';
  import { extend, isNull } from 'underscore';
  import 'echarts-wordcloud';

  export default {
    name: 'Echarts',
    props: {
      chartData: {
        type:Array
      },
      // chartType: {
      //   type: String,
      //   require: false,
      // },
    },
    data() {
      return {
        myChart: {},
        opt: {
          title: false,
          tooltip: {
            show: true,
          },
          toolbox: {
            show: false,
          },
          grid: {
            left: '1%',
            right: '1%',
            top: '3%',
            bottom: '3%',
            containLabel: true,
          },
          series:[{
            name: '',
            type: 'wordCloud',
            width: '90%',
            height: '90%',
            // size: ['9%', '99%'],
            sizeRange: [15, 66],
            // textRotation: [0, 45, 90, -45],
            rotationRange: [-45, 90],
            // shape: 'circle',
            gridSize: 10,
            textStyle: {
              normal: {
                color: () => {
                  const color = `rgb(${[
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255),
                  ]})`;
                  return color;
                },
              },
              emphasis: {
                shadowBlur: 10,
                shadowColor: '#333',
              },
            },
            data: ""
          }],
        },
      };
    },
    methods: {
      setEchart() {

        if (isNull(this.chartData)) {
          this.myChart.showLoading();
          return;
        } else if (this.chartData === 'nodata') {
          this.myChart.hideLoading();
          return;
        }

        if (!this.chartData) {
          this.myChart.showLoading();
          return;
        } 
        this.myChart.hideLoading();
        this.opt.series[0].data = this.chartData;
        this.myChart.setOption(extend({}, this.opt));
        this.myChart.resize();
      },
      handleWindowResize() {
        this.myChart.resize();
      },
    },
    watch: {
      chartData: {
　　　　handler(newValue, oldValue) {
　　　　　　if(newValue.length != oldValue.length){
              this.setEchart()
          }
　　　　},
　　　　deep: true
　　}
    },
    mounted() {
      const dom = this.$refs.mychart;
      this.myChart = echarts.init(dom);
      this.setEchart();
      window.addEventListener('resize', this.handleWindowResize);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.handleWindowResize);
    },
  };
</script>
