<template>
	<div class="table_div" :tableData='tableData'>
	  <el-table
	    :data="data"
	    style="width: 100%">
	    <el-table-column
	      label="NAME">
	      <template slot-scope="scope">
	        <i class="el-icon-time" v-if="crawler(scope.row)"></i>
	        <i class="el-icon-error" v-if="error(scope.row)"></i>
	        <i class="el-icon-document" v-if="file(scope.row)"></i>
	        <i class="iconfont icon-folder" v-if="folder(scope.row)"></i>
	        <span style="margin-left: 5px" @click="tableClick(scope.row)" >{{ scope.row.name }}</span>
	        <span @click="editAlert(scope)"><i class="el-icon-edit-outline"></i> </span>
	        <span @click="deleteAlert(scope)"><i class="el-icon-minus"></i></span>
	      </template>
	    </el-table-column>
	    <el-table-column  label="TASK" align="center" width="260">
	    	<template slot-scope="scope" style="text-align: center;">
		        <span class="span_btn" v-bind:class="{ 'crawlerSuccess': scope.row.enable}" @click="showChart(scope.row)" @mouseover="cursorBTN(scope.row,$event)">Word Cloud</span>	      	
		        <span class="span_btn" v-bind:class="{ 'crawlerSuccess': scope.row.enable}" @click="showList(scope.row)" @mouseover="cursorBTN(scope.row,$event)">B/W List</span>
		        <span class="span_btn" v-bind:class="{ 'crawlerSuccess': scope.row.enable}" @mouseover="cursorBTN(scope.row,$event)" @click="exportList(scope.row)">Export</span>
		         <span class="span_btn" v-bind:class="{ 'crawlerSuccess': scope.row.enable}" @mouseover="cursorBTN(scope.row,$event)" @click="gotoContent(scope.row)">Content List</span>
		         <span class="span_btn" v-bind:class="{ 'crawlerSuccess': scope.row.enable}" @mouseover="cursorBTN(scope.row,$event)" @click="wordCut(scope.row)">Word Cut</span>   	
		 	</template>
	    </el-table-column>
	    <el-table-column
	      label="No. of Content"
	      align="center"
	     >
	      <template slot-scope="scope">
	         <i class="el-icon-time" v-if="scope.row.enable == false"></i>
	         <span  v-if="scope.row.enable == true">{{scope.row.total}}</span>
	      </template>
	    </el-table-column>
	    <el-table-column
	      label="DATE ADDED"
	      align="center"
	     >
	      <template slot-scope="scope">
	        {{scope.row.createTime}}
	      </template>
	    </el-table-column>
	    <el-table-column
	      label="DATE MODIFIED"
	      align="center"
	     >
	      <template slot-scope="scope">
	        {{scope.row.updateTime}}
	      </template>
	    </el-table-column>
	    <!-- <el-table-column
	      label="EDIT"
	      width="80"
	      align="center"
	     >
	      <template slot-scope="scope">
	        <span @click="editAlert(scope)"><i class="el-icon-edit-outline"></i> </span>
	      </template>
	    </el-table-column>
	    <el-table-column
	      label="DELETE"
	      width="80"
	      align="center"
	     >
	      <template slot-scope="scope">
	        <span @click="deleteAlert(scope)"><i class="el-icon-minus"></i></span>
	      </template>
	    </el-table-column> -->
	  </el-table>
	  <el-dialog
	  title="Word Cloud"
	  :visible.sync="chartVisible"
	  width="50%"
	  class="chartBox"
	  >
	  <wordCloud :chartData="chartData"></wordCloud>
	  <!-- <span slot="footer" class="dialog-footer">
	    <el-button @click="chartVisible = false">取 消</el-button>
	    <el-button class="btn_bg" @click="chartVisible = false">确 定</el-button>
	  </span> -->
	</el-dialog>
	 <el-dialog
	  title="List"
	  :visible.sync="listVisible"
	  width="90%"
	  >
	  <transfrom1 ref="transfrom"  :listData="listData1" :crawlerID="crawlerID"></transfrom1>
	  <span slot="footer" class="dialog-footer">
	    <el-button @click="listVisible = false">Cancel</el-button>
	    <el-button type="danger" @click="saveList">Save</el-button>
	  </span>
	</el-dialog>

  	</div>
</template>

<script>
import wordCloud from './wordCloud.vue'
// import transfrom from './transfrom.vue'
import transfrom1 from './transfrom1.vue'

import url from '../assets/js/url.js'


  export default {
  	props: {
	    tableData: {
	      
	    }
  	},
    data() {
      return {
      	data:this.tableData,
        chartVisible:false,
        listVisible:false,
        chartData:[],
        listData:{},
        listData1:{},
        crawlerID:0
      }
    },
    components:{
    	wordCloud,
    	transfrom1
    },
    filters:{
    },
    watch: {
      tableData: {
　　　　handler(newValue, oldValue) {
	               this.data = this.tableData;
// 　　　　　　if(newValue.length != oldValue.length){
//               this.data = this.tableData;
//           }
　　　　},
　　　　deep: true
　　}
    },

    methods: {
	    handleEdit(index, row) {
	        console.log(index, row);
	    },
	    handleDelete(index, row) {
	        console.log(index, row);
	    },
	    error(data){
	      	if(data.crawlerStatus != "crawling" && data.crawlerStatus != "success" && data.crawlerStatus != null){
	      		return true;
	      	}else{
	      		return false;
	      	}
	    },
	    crawler(data){
	      	if(data.crawlerID !=null && data.crawlerStatus == "crawling"){
	      		return true;
	      	}else{
	      		return false;
	      	}
	    },
	    folder(data){
	    	if(data.crawlerID == null){
	    		return true;
	    	}else{
	    		return false;
	    	}
	    },
	    file(data){
	    	if(data.crawlerID !=null && data.crawlerStatus == "success"){
	    		return true;
	    	}else{
	    		return false;
	    	}
	    },
	    editAlert(data) {
	        this.$prompt('Please enter a new name', 'Tips', {
	          confirmButtonText: 'Confirm',
	          cancelButtonText: 'Cancel',
	        }).then(({ value }) => {
	        	console.log(data.row)
	          this.$http({
                    method:'post',
                    url:url.url+'/crawler_tree/update_node.do?nodeID='+data.row.ID+'&folderName='+value
                }).then(response =>{
                  if(response.data.status == 0){
                     this.$message({
			            type: 'success',
			            message: 'success!'
			          });
                     this.$parent.tableNodeClick(data.row);
                     // this.$emit('load',true);
                  }else{
                       this.$message({
			            type: 'info',
			            message: response.data.data
			          });
                  }
                })

	        }).catch(() => {
	          this.$message({
	            type: 'info',
	            message: 'Cancel the input!'
	          });       
	        });
	    },
	    deleteAlert(data) {
	        this.$confirm('This will permanently delete the folder/file. Do you want to continue?', 'Tips', {
	          confirmButtonText: 'Confirm',
	          cancelButtonText: 'Cancel',
	          type: 'warning'
	        }).then(() => {
	        	this.$http({
                    method:'post',
                    url:url.url+'/crawler_tree/delete_node.do?nodeID='+data.row.ID
                }).then(response =>{
                  if(response.data.status == 0){
                     this.$message({
			            type: 'success',
			            message: 'Delete successful!'
			          });
                     this.$parent.tableNodeClick(data.row);
                     // this.$emit('load',true);
                  }else{
                       this.$message({
			            type: 'info',
			            message: response.data.data
			          });
                  }
                })
	        }).catch(() => {
	          this.$message({
	            type: 'info',
	            message: 'Undelete!'
	          });          
	        });
	    },
	    showChart(data){
	    	this.chartData.splice(0,this.chartData.length);
	    	if(data.crawlerID !=null && data.crawlerStatus == "success"){
	    		this.chartVisible = true;
	    		this.$http({
                    method:'post',
                    url:url.url+'/nlp/get_word_cloud.do?nodeID='+data.crawlerID
                }).then(response =>{
                  if(response.data.status == 0){
                  	if(response.data.data.length == 0){
                  		this.$message({
				            type: 'info',
				            message: "No Data!"
				        });
                  	}else{
                  		// console.log(response.data)
                  		this.chartData = response.data.data;
                  	}
                    
                  }else{
                       this.$message({
			            type: 'info',
			            message: "No Data!"
			          });
                  }
                })
	    	}
	    	
	    },
	    showList(data){
	    	if(data.crawlerID !=null && data.crawlerStatus == "success"){
	    		this.listVisible = true;
	    		this.$http({
                    method:'post',
                    url:url.url+'/nlp/get.do?nodeID='+data.crawlerID
                }).then(response =>{
                  if(response.data.status == 0){
                  	this.listData1 = response.data.data;
                  	console.log(data.crawlerID)
                    this.crawlerID = data.crawlerID;
                  }else{
                       this.$message({
			            type: 'info',
			            message: "No Data!"
			          });
                  }
                })

             //    this.$http({
             //        method:'get',
             //        url:'../../static/data/blackList.json'
             //    }).then(response =>{
             //      if(response.data.status == 0){
             //      	this.listData1 = response.data.data;
                    
             //      }else{
             //           this.$message({
			          //   type: 'info',
			          //   message: "No Data!"
			          // });
             //      }
             //    })
	    	}
	    },
	    saveList(){
	    	this.listVisible = false;
	    	this.$refs.transfrom.saveList();
	    },
	    exportList(data){
	    	if(data.crawlerID !=null && data.crawlerStatus == "success"){
	    	this.$http({
                method:'post',
                url:url.url+'/user/get_user_info.do'
            }).then(response =>{
              if(response.data.status == 0){
                window.location.href = url.url+'/nlp/export.do?crawlerId='+data.crawlerID;
              }else{
                  alert("Please Login!")
                  this.$router.push('/login')
              }
            })
            }	
	    },
	    tableClick(data){
	    	if(data.crawlerID == null){
	    	this.$parent.tableData.splice(0,this.$parent.treeData.length);
        	this.$parent.nodeSelected.splice(0,this.$parent.nodeSelected.length);
	    	this.$http({
	            method:'post',
	            url:url.url+'/crawler_tree/get_node_list.do?nodeID='+data.ID
	        }).then(response =>{
	          if(response.data.status == 0){
	            this.$parent.tableData = response.data.data.list;
            	this.$parent.nodeSelected = response.data.data.path;
	          }else{
	              alert(response.data.msg)
	              // this.$router.push('/login')
	          }
	        })
	    	}
	    },
	    renderHeader(createElement, { column, _self }){
	    	let label = column.label;
	    	return createElement("span",[
			    createElement("span",label),
			    createElement("i",{
			      "class":{
			        "el-icon-warning":true,
			        "warn":true
			      }
			    }),
			  ])
	    },
	    cursorBTN(data,$event){
	    	if(data.crawlerID !=null && data.crawlerStatus == "success"){
	    		$event.currentTarget.style.cursor = "pointer"
	    	}else{
	    		$event.currentTarget.style.cursor = "not-allowed"
	    	}
	    },
	    gotoContent(data){
	    	this.$router.push({path:"/contentList",query:{crawlerID:data.crawlerID,parentID:data.parentID}})
	    },
	    wordCut(data){
	    	console.log(data)
	    	this.$http({
	            method:'get',
	            url:url.url+'/mission/startWordCut.do?crawlerId='+data.crawlerID
	        }).then(response =>{
	        })
	    }
	}
  }
</script>
<style type="text/css">
@import '../assets/less/iconfont.css'

.table_div{
	width: 100%;
	height: 100%;
    border-color: transparent;

}

.el-table, .el-table__expanded-cell {
     background-color: transparent; 
     font-size: 14px;
     border-color: transparent;
}

.el-table th, .el-table tr {
    background-color: transparent;
    border-color: transparent;
}
.el-table th{
	color: white;
	font-size: 15px;
	font-weight: bold;
}

.el-table td, .el-table th.is-leaf {
    border-bottom: 1px solid transparent;
}
.el-table tr{
	color: #ffffff;
}
.el-table tr:hover>td{
 	background: transparent !important;
 	color: #fff;
  	border-radius: 5px;
  	cursor: pointer;
}
.span_btn{
	margin-left: 6px;
	display: block;
	float: left;
	border-color: transparent;
	color: grey;
	padding: 3px 10px;
	font-size: 12px;
}

.crawlerSuccess{
	border-bottom:2px solid #ff346a;
	color: white;
}
.el-dialog__header,.el-dialog__body,.el-dialog__footer{
	background: #191919;
}
.el-dialog__header{
	text-align: center;
	font-size: 16px;
	font-weight: bold;
}
.el-dialog__header{
	border-bottom: 1px solid #f1f1f1;
}

.el-dialog__body{
	padding-top: 20px;
	padding-bottom: 20px;

}

.el-dialog__header>span,.el-dialog__header i{
	color: white;
}



.el-dialog__header{
	border-bottom: 1px solid #f1f1f1;
}

.el-dialog__header>span,.el-dialog__header i{
	color: white;
}

.warn{
	margin-left: 5px;
}

.el-table::before {
    left: 0;
    bottom: 0;
    width: 100%;
     height: 0px; 
}
.el-button--danger{
	background: #e91f63;
	border-color: #e91f63;
	color: white;
}

</style>