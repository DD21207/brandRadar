<template>
  <div :listData='listData'>
    <el-transfer 
    filterable
    filter-placeholder="请输入关键词" 
    v-model="blackList" 
    :data="data" 
    :props="{
      key: 'word',
      label: 'word'
    }"
    :titles="['GRAPHLIST', 'BLACKLIST']"
    @change="handleChange"
    ></el-transfer>
  </div>
</template>

<script>
import url from '../assets/js/url.js'

  export default {
    name:"transfrom",
    props: {
      listData: {
        
      }
    },
    data() {
      return {
        data:[],
        blackList: [],
        oldBlackList:[]
      };
    },
    mounted: function() {
        this.$nextTick(function() {
          this.setList();
        });
    },
    watch: {
      listData: {
          handler(newValue, oldValue) {
  // 　　　　　　if(newValue.length != oldValue.length){
  //               this.setList()
  //           }
          this.data = this.listData.graphList;
          this.blackList = this.listData.blackList;
          this.oldBlackList = this.listData.blackList;
  　　　　},
  　　　　deep: true
  　　}
    },
    methods:{
      setList(){

      },
      handleChange(value, direction, movedKeys) {
        // console.log(value);
        // console.log(direction);
        // console.log(movedKeys);
      },
      saveList(){
        if(this.oldBlackList.length != 0){
          var arr1 = this.func(this.blackList,this.oldBlackList); //黑名单新增
          var arr2 = this.func(this.oldBlackList,this.blackList); //黑名单删除
          var jsonArr1 = this.getAjaxData(arr1,1);
          var jsonArr2 = this.getAjaxData(arr2,0);
          var dataArr = jsonArr1.concat(jsonArr2);
          var ajaxData = {};
          ajaxData.nlpDataList = dataArr;
          this.$http({
              method:'post',
              url:url.url+'/nlp/save.do',
              data:ajaxData
          }).then(response =>{
            if(response.data.status == 0){
                this.$message({
                  type: 'success',
                  message: "Save Successful!"
                }); 
            }else{
                 this.$message({
                  type: 'info',
                  message: "Save Failed!"
                });
            }
          })
        }else if(this.oldBlackList.length == 0){
          var jsonArr1 = this.getAjaxData(this.blackList,1);
          var dataArr = jsonArr1;
          var ajaxData = {};
          ajaxData.nlpDataList = dataArr;
          this.$http({
              method:'post',
              url:url.url+'/nlp/save.do',
              data:ajaxData
          }).then(response =>{
            if(response.data.status == 0){
                this.$message({
                  type: 'success',
                  message: "Save Successful!"
                });
              
            }else{
                 this.$message({
                  type: 'info',
                  message: "Save Failed!"
                });
            }
          })
        }
        
        
      },
      func(arr1,arr2){
          var arr = [];
          var bool = false;
          for(var i=0;i<arr1.length;i++){
              for(var j=0;j<arr2.length;j++){
              //进行优化遇到相同直接跳出循环 同时支持对象比对
                  if(JSON.stringify(arr1[i])===JSON.stringify(arr2[j])){
                      bool = false;
                      break;
                  }else{
                      bool=i;
                  }
              }
              if(bool!==false)arr.push(arr1[bool]);
          }
          return arr;
      },
      getAjaxData(arr,num){
        var jsonArr = [];
        
        var _this = this;

        for(var i=0;i<arr.length;i++){
              for(var j=0;j<_this.data.length;j++){
              //进行优化遇到相同直接跳出循环 同时支持对象比对
                  if(arr[i] == _this.data[j].word){
                      var data = {};
                      data.crawlerId = _this.data[j].crawler_id;
                      data.word = _this.data[j].word;
                      data.frequency = _this.data[j].frequency;
                      data.blacklist = num;
                      jsonArr.push(data);
                                          
                  }
              }
               
          }         
        return jsonArr;
        
      }
    }
  };
</script>
<style type="text/css">
.el-transfer-panel{
  background: rgba(29, 29, 29, 0.9);
  color: white;
  font-family: "Roboto", sans-serif !important;
  border-color: #fff;
}
.el-transfer-panel .el-transfer-panel__header{
  background: #e91f63;
}
.el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label {
    font-size: 16px;
    color: #fff;
    font-weight: 400;
}
.el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label span {
    position: absolute;
    right: 15px;
    color: #fff;
    font-size: 12px;
    font-weight: 400;
}
.el-transfer-panel__item.el-checkbox {
    color: #fff;
}
.el-checkbox__input.is-checked+.el-checkbox__label {
    color: #e91f63;
}
.checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #e91f63;
    border-color: #e91f63;
}
.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
     background-color: #e91f63;
    border-color: #e91f63;
}
.el-transfer__button{
  background-color: #e91f63;
    border-color: #e91f63;
}
.el-transfer__button:hover{
   background-color: #e91f63;
    border-color: #e91f63;
  color: white;
}
</style>