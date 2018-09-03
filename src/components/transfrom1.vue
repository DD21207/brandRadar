<template>
  <div :listData='listData' :crawlerID='crawlerID'>
      <div class="list_box">
        <div class="list_box_item">
          <div class="list_box_item_header">
            white List
          </div>
          <div class="select_box">
              <div class="select_box_item">
                <el-input placeholder="" v-model="whiteSearch"  class="input-with-select" clearable >
                <el-button slot="append" icon="el-icon-search" @click="sreachList(1)"></el-button>
                </el-input>
              </div>
              <span class="title_total">Total: {{whiteList.length}}</span>    
            </div>
          <div class="list_box_item_content">
            
              <div v-for="(item,index) in whiteList" class="list_box_item_content_item">
                <span>{{item.word}}</span>
                <div class="list_box_item_content_item_toolbox">
                  <span class="el-icon-close hand" @click="retrunList(item,index,1)"></span>
                  <!-- <span class="el-icon-minus hand" @click="addBlackList(item,index,1)"></span> -->
                </div>    
              </div>
          </div>
        </div>
        <div class="list_box_item">
          <div class="list_box_item_header">
            word List
          </div>
          <div class="select_box">
              <div class="select_box_item">
                <el-input placeholder="" v-model="wordSearch"  class="input-with-select" clearable >
                <el-button slot="append" icon="el-icon-search" @click="sreachList(0)"></el-button>
                </el-input>
              </div>
              <span class="title_total">Total: {{formatLength}}</span>    
            </div>
          <div class="list_box_item_content">
              <div v-for="(item,index) in graphList" class="list_box_item_content_item" v-if="item.blacklist == 0">
                <span>{{item.word}}</span>
                <div class="list_box_item_content_item_toolbox">
                  <span class="el-icon-plus hand" @click="addWhiteList(item,index,0)"></span>
                  <span class="el-icon-minus hand" @click="addBlackList(item,index,0)"></span>
                </div>
              </div>
          </div>
        </div>
        <div class="list_box_item">
          <div class="list_box_item_header">
            black List
          </div>
          <div class="select_box">
              <div class="select_box_item">
                <el-input placeholder="" v-model="blackSearch"  class="input-with-select" clearable >
                <el-button slot="append" icon="el-icon-search" @click="sreachList(2)"></el-button>
                </el-input>
              </div>
              <span class="title_total">Total: {{blackList.length}}</span>    
            </div>
          <div class="list_box_item_content">
              <div v-for="(item,index) in blackList" class="list_box_item_content_item">
                <span>{{item.word}}</span>
                <div class="list_box_item_content_item_toolbox">
                  <span class="hand" @click="retrunList(item,index,2)"><img src="../assets/img/retrun.png" alt="" height="17px" style="margin-top: -5px;"></span>
                  <!-- <span class="el-icon-plus hand"  @click="addWhiteList(item,index,2)"></span> -->
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
        
      },
      crawlerID:Number
    },
    data() {
      return {
        whiteSearch:"",
        blackSearch:"",
        wordSearch:"",
        data:[],
        graphList:[],
        blackList: [],
        whiteList:[],
        oldWhiteList:[],
        oldBlackList:[],
        oldGraphList:[]
      };
    },

    mounted: function() {
        this.$nextTick(function() {
          // this.setList();
        });
    },
    watch: {
      listData: {
          handler(newValue, oldValue) {
  // 　　　　　　if(newValue.length != oldValue.length){
  //               this.setList()
  //           }
          // var list = this.listData.graphList;
          // var list1 = this.listData.whiteList;
          // this.graphList = list;
          // this.whiteList = this.listData.whiteList;
          // this.blackList = this.listData.blackList;
          // this.oldBlackList = this.listData.blackList;
          // this.oldGraphList = list;
          // this.oldWhiteList = this.listData.whiteList;
  　　　　},
  　　　　deep: true
  　　},
      whiteSearch:function(value){
          if(value == ""){
             this.sreachList(1);
           }
      },
      wordSearch:function(value){
          if(value == ""){
            this.sreachList(0);
          }
      },
      blackSearch:function(value){
          if(value == ""){
             this.sreachList(2);
          }
      },
      crawlerID:function(){
          this.getList();
      }
    },
    computed:{
      formatLength:function(){
        var num = 0;
        $.each(this.graphList,function(index,value){
          if(value.blacklist == 0){
            num = num + 1;
          }
        })
        
        return num;
      }
    },
    methods:{
      getList(){
          this.$http({
              method:'post',
              url:url.url+'/nlp/get.do?nodeID='+this.crawlerID
          }).then(response =>{
            if(response.data.status == 0){
              var listData1 = response.data.data;
              var listData2 = listData1.whiteList;
              var listData3 = listData1.whiteList;

              this.graphList = listData1.graphList;
              this.whiteList = listData2;
              this.blackList = listData1.blackList;
              this.oldBlackList = listData1.blackList;
              this.oldGraphList = listData1.graphList;
              this.oldWhiteList = listData3;
            }else if(response.data.msg == "NEED_LOGIN"){
            alert(response.data.msg)
            this.$router.push('/login')
        }else{
                 this.$message({
            type: 'info',
            message: "No Data!"
          });
            }
          })
      },
      addWhiteList(data,index,list){
        var _this = this;
        if(list == 0){
            var array1 = [];
            $.each(_this.oldGraphList,function(gIndex,value){
                if(value.word != data.word){
                  array1.push(value);
                }
            })
            var array2 = [];
            $.each(_this.graphList,function(gIndex,value){
                if(value.word != data.word){
                  array2.push(value);
                }
            })
            this.oldGraphList = array1;
            this.graphList = array2;

            this.whiteList.push(data);
            
        }else if(list == 2){
            this.blackList.splice(index,1);
            this.whiteList.push(data);
        }
      },
      addBlackList(data,index,list){
        var _this = this;
        if(list == 0){
            var array1 = [];
            $.each(_this.oldGraphList,function(gIndex,value){
                if(value.word != data.word){
                  array1.push(value);
                }
            })
            var array2 = [];
            $.each(_this.graphList,function(gIndex,value){
                if(value.word != data.word){
                  array2.push(value);
                }
            })
            this.oldGraphList = array1;
            this.graphList = array2;
            this.blackList.push(data);
            
        }else if(list == 1){
            this.whiteList.splice(index,1);
            this.blackList.push(data);
        }
      },
      retrunList(data,index,list){
        var _this = this;
        if(list == 1){
            var array1 = [];
            $.each(_this.oldWhiteList,function(gIndex,value){
                if(value.word != data.word){
                  array1.push(value);
                }
            })

            var array2 = [];
            $.each(_this.whiteList,function(gIndex,value){
                if(value.word != data.word){
                  array2.push(value);
                }
            })
            this.oldWhiteList = array1;
            this.whiteList = array2;
            data.blacklist = 0;
            this.graphList.push(data);
        }else if(list == 2){
            var array1 = [];
            $.each(_this.oldBlackList,function(gIndex,value){
                if(value.word != data.word){
                  array1.push(value);
                }
            })
            this.oldBlackList = array1;
            var array2 = [];
            $.each(_this.blackList,function(gIndex,value){
                if(value.word != data.word){
                  array2.push(value);
                }
            })
            this.blackList = array2;
            // $.each(_this.oldBlackList,function(wIndex,value){
            //     if(value.word == data.word){
            //       _this.oldBlackList.splice(wIndex,1);
            //     }
            // })
            data.blacklist = 0;
            this.graphList.push(data);
            // this.oldGraphList.push(data);
            console.log(this.graphList);
            console.log(this.oldGraphList);
           
          
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
                "crawlerId": this.crawlerID,
                "blackList": this.oldBlackList,
                "whiteList": this.oldWhiteList
              }
          }).then(response =>{
            if(response.data.status == 0){
                this.wordSearch = "";
                this.whiteSearch = "";
                this.blackSearch = "";
                this.$message({
                  type: 'success',
                  message: "Save Successful!"
                }); 
            }else if(response.data.msg == "NEED_LOGIN"){
                alert(response.data.msg)
                this.$router.push('/login')
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
      sreachList(list){
        var _this = this;
        this.$http({
              method:'post',
              url:url.url+'/nlp/save.do',
              data:{
                "crawlerId": this.crawlerID,
                "blackList": this.oldBlackList,
                "whiteList": this.oldWhiteList
              }
          }).then(response =>{
            if(response.data.status == 0){
                this.$http({
                    method:'post',
                    url:url.url+'/nlp/get.do?nodeID='+this.crawlerID
                }).then(response =>{
                  if(response.data.status == 0){
                    var listData1 = response.data.data;
                    var listData2 = listData1.whiteList;
                    var listData3 = listData1.whiteList;

                    this.graphList = listData1.graphList;
                    this.whiteList = listData2;
                    this.blackList = listData1.blackList;
                    this.oldBlackList = listData1.blackList;
                    this.oldGraphList = listData1.graphList;
                    this.oldWhiteList = listData3;
                    switch(list)
                      {
                      case 1:
                        var arrayList=[];

                        var arrayList=[];
                        if( _this.whiteSearch == " "){
                          _this.whiteList = _this.oldWhiteList;
                        }else{
                          $.each(_this.oldWhiteList,function(index,value){
                              if(value.word.search(_this.whiteSearch) != -1){
                                 arrayList.push(value);
                              }
                          })

                           _this.whiteList = arrayList;
                        }
                        break;
                      case 2:
                        var arrayList=[];

                        if( _this.blackSearch == " "){
                          _this.blackList = _this.oldBlackList;
                        }else{
                          $.each(_this.oldBlackList,function(index,value){
                              if(value.word.search(_this.blackSearch) != -1){
                                  arrayList.push(value);
                              }
                          })

                          _this.blackList = arrayList;
                        }
                        break;
                      case 0:
                        var arrayList=[];

                        if( _this.wordSearch == " "){
                          _this.graphList = _this.oldGraphList;
                        }else{

                          $.each(_this.oldGraphList,function(index,value){

                              if(value.word.search(_this.wordSearch) != -1){
                                  arrayList.push(value);
                              }
                          })

                          _this.graphList = arrayList;

                        }
                        break;
                      }
                  }else if(response.data.msg == "NEED_LOGIN"){
                  alert(response.data.msg)
                  this.$router.push('/login')
              }else{
                       this.$message({
                  type: 'info',
                  message: "No Data!"
                });
                  }
                })
            }else if(response.data.msg == "NEED_LOGIN"){
                alert(response.data.msg)
                this.$router.push('/login')
            }else{
                 this.$message({
                  type: 'info',
                  message: "Save Failed!"
                });
            }
          })
              }
    }
  };
</script>

<style scoped lang="less">
@import '../assets/less/scrollBar.less';


</style>

<style type="text/css">


.list_box{
  width: 1000px;
  margin: 0 auto;
  height: 550px;
}

.list_box_item{
  width: 250px;
  height:100%;
  float: left;
  margin-left:110px; 
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
  /*margin-top: 30px;*/
  overflow-y: auto;
  width: 100%;
}


.list_box_item .select_box {
    width: 100%;
    height: 40px;
  }

.list_box_item .select_box_item {
      width: 150px;
      height: 22px;
      margin: 10px 0px;
      display: inline-block;
    }
.list_box_item .title_total {
      font-size: 12px;
      color: #ddd;
      display: inline-block;
      margin-left: 15px; 
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
  text-align: right;
  padding-right: 5px;
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