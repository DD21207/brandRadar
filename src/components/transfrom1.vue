<template>
  <div :listData='listData'>
      <div class="list_box">
        <div class="list_box_item">
          <div class="list_box_item_header">
            graph List
          </div>
          <div class="list_box_item_content">
              <div v-for="(item,index) in graphList" class="list_box_item_content_item" v-if="item.blacklist == 0">
                <span>{{item.word}}</span>
                <div class="list_box_item_content_item_toolbox">
                  <span class="el-icon-plus" @click="addWhiteList(item,index,0)"></span>
                  <span class="el-icon-minus" @click="addBlackList(item,index,0)"></span>
                </div>
                
              </div>
          </div>
        </div>
        <div class="list_box_item">
          <div class="list_box_item_header">
            white List
          </div>
          <div class="list_box_item_content">
              <div v-for="(item,index) in whiteList" class="list_box_item_content_item">
                <span>{{item.word}}</span>
                <div class="list_box_item_content_item_toolbox">
                  <span class="el-icon-close" @click="retrunList(item,index,1)"></span>
                  <span class="el-icon-minus" @click="addBlackList(item,index,1)"></span>
                </div>    
              </div>
          </div>
        </div>
        <div class="list_box_item">
          <div class="list_box_item_header">
            black List
          </div>
          <div class="list_box_item_content">
              <div v-for="(item,index) in blackList" class="list_box_item_content_item">
                <span>{{item.word}}</span>
                <div class="list_box_item_content_item_toolbox">
                  <span class="el-icon-close" @click="retrunList(item,index,2)"></span>
                  <span class="el-icon-plus"  @click="addWhiteList(item,index,2)"></span>
                </div>
                
              </div>
          </div>
        </div>
      </div>
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
        graphList:[],
        blackList: [],
        whiteList:[],
        oldWhiteList:[],
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
          this.graphList = this.listData.graphList;
          this.blackList = this.listData.blackList;
          this.oldBlackList = this.listData.blackList;
          this.whiteList = this.listData.whiteList;
          this.oldWhiteList = this.listData.whiteList;
  　　　　},
  　　　　deep: true
  　　}
    },
    methods:{
      setList(){

      },
      addWhiteList(data,index,list){
        if(list == 0){
            this.graphList.splice(index,1);
            this.whiteList.push(data);
        }else if(list == 2){
            this.blackList.splice(index,1);
            this.whiteList.push(data);
        }
      },
      addBlackList(data,index,list){
        if(list == 0){
            this.graphList.splice(index,1);
            this.blackList.push(data);
        }else if(list == 1){
            this.whiteList.splice(index,1);
            this.blackList.push(data);
        }
      },
      retrunList(data,index,list){
        if(list == 1){
            this.whiteList.splice(index,1);
            this.graphList.push(data);
        }else if(list == 2){
            this.blackList.splice(index,1);
            this.graphList.push(data);
        }
      },
      handleChange(value, direction, movedKeys) {
        // console.log(value);
        // console.log(direction);
        // console.log(movedKeys);
      },
      saveList(){
          this.$http({
              method:'post',
              url:url.url+'/nlp/save.do',
              data:{
                "blackList": this.blackList,
                "whiteList": this.whiteList
              }
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
    }
  };
</script>

<style scoped lang="less">
@import '../assets/less/scrollBar.less';


</style>

<style type="text/css">
.list_box{
  width: 900px;
  margin: 0 auto;
  height: 440px;
}

.list_box_item{
  width: 250px;
  height:100%;
  float: left;
  margin-left:75px; 
}

.list_box_item:first-child{
  margin-left:0px; 
}

.list_box_item_header{
  width: 100%;
  height:30px;
  text-transform:Uppercase;
  background: #e91f63;
  color: white;
  font-size: 19px;
  text-align: center;
  font-weight: bold;
  line-height: 30px;
}

.list_box_item_content{
  height:calc(100% - 60px);
  margin-top: 30px;
  overflow-y: auto;
  width: 100%;
}

.list_box_item_content_item{
  width: 100%;
  height:25px;
  line-height: 25px;
  color: white;
  font-size: 16px;
  position: relative;
}

.list_box_item_content_item_toolbox{
  width: 55px;
  height:25px;
  float: right;
  right: 0px;
  line-height: 25px;
}
.list_box_item_content_item_toolbox>span{
  margin-left: 5px;
}


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