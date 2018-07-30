<template>
	<div id="div_body">
      <div class="bg_img">
        <img src="../assets/img/home.png" alt="" width="100%" height="100%" v-if="treeShow == false">
        <img src="../assets/img/home1.png" alt="" width="100%" height="100%" v-if="treeShow == true">

      </div>
      <div class="main_wapper">
        <!-- 侧边栏 -->
        <div class="main_sidebar">  
          <!-- logo -->
          <header class="main_sidebar_header">
            <div class="C_logo">
              <img src="../assets/img/20180716_16.png" alt="" width="80%">
              <br>
              <img src="../assets/img/btn.png" alt="" height="22px" style="margin-top: 30px;" @click="showTree">
            </div>
          </header>
          <!-- button组 -->
         <!--  <div class="o-folders-content">
            <button class="bt-folders-option is-active" >Corpus</button>
          </div> -->
          <nav class="main-sidebar__tree" v-show="treeShow">
            <!-- <div id="root" class="tree-item-link" @click="isChecked" :class="{ 'is-checked': select }">
              <div class="tree-item-link__label">
                  <svg class="icon tree-item__label__icon" aria-hidden="true" >
                    <use xlink:href="#icon-folder"></use>
                  </svg>
                  <span class="tree-item-link__text">Publicis - DTI</span>
              </div>
            </div> -->
            <div class="tree-item-group">
              <el-tree
                :data="treeData"
                node-key="ID"
                ref="tree"
                :default-expanded-keys="[1]"
                highlight-current
                accordion
                @node-click="treeNodeClick"
                :expand-on-click-node="true"
                :props="defaultProps"
                :render-content="renderContent">
              </el-tree>
            </div>
            <div class="add_btn_box" @click="showTreeNode">
              <i class="el-icon-plus"></i> ADD NEW ELEMENT
            </div>
          </nav>
         
        </div>
        <!-- 列表页 -->
        <div class="main_content">
          <header class="main-content__header">
              <div>
                  <a href="javascript:;;" class="main-content__header-login" @click="logout">Welcome<span id="pushUserName">, {{username}}</span><span id="logout_btn"> x </span></a>
              </div>
          </header>
          <div class="main-content-guide">
            <span v-for="item in nodeSelected">
                <span></span>
            </span>
          </div>
          <div class="main-content-wrapper" v-show="tableShow"> 
            <div class="main-content__objects">
             <!--  <div class="main-content-wrapper-header">
                <div class="c-breadcrumb">
                  
                </div>
                <div class="folder-actions">
                    <button class="btn-add--new-element" @click="showTreeNode">Add new element<i class="el-icon-circle-plus-outline" style="margin-left: 5px;"></i></button>
                </div>
              </div> -->
              <div class="wrapper-tree-item-content">
                <tableTamplate :tableData="tableData" > </tableTamplate>
              </div>
            </div>
          </div>

        </div>
      </div><!--主体-->
      <el-dialog
        title="Add a new element"
        :visible.sync="elementVisible"
        width="550px"
        >
        <div class="create_box">
          <div class="create_box_header">
            <div class="create_box_header_box">
              <div class="create_box_header_option_box">
                <span class="create_box_header_option">
                 <i class="iconfont icon-folder" ></i>
                </span>
                <p>FOLDER</p>
              </div>
              <div class="create_box_header_option_box" @click="hrefAdmin">
                <span class="create_box_header_option" style="background: #d6dfe6">
                 <i class="el-icon-star-off" ></i>
                </span>
                <p>CORPUS</p>
              </div>
            </div>
          </div>
          <div class="create_box_content">
            <div class="create_box_content_input_box">
              <input type="text" name="folderName" placeholder="NEW FOLDER/CORPUS NAME" v-model="folderName">
              
            </div>
            <div class="create_element_btn" @click="appendTreeNode">
                Create
              </div>
          </div>
        </div>
      </el-dialog>
  </div>
</template>


<script>
import jstree from 'jstree'
import tableTamplate from '../components/table.vue'
import url from '../assets/js/url.js'

let id = 1000;

export default {
  	name: 'home',
  	data () {
  	    const data = [{
          id: 1,
          label: 'Publicis - DTI',
            children: [{
                id: 2,
                label: '一级 1',
                children: [{
                  id: 11,
                  label: '二级 1-1',
                  children: [{
                    id: 9,
                    label: '三级 1-1-1'
                  }, {
                    id: 10,
                    label: '三级 1-1-2'
                  }]
                }]
              }, {
                id: 3,
                label: '一级 2',
                children: [{
                  id: 5,
                  label: '二级 2-1'
                }, {
                  id: 6,
                  label: '二级 2-2'
                }]
              }, {
                id: 4,
                label: '一级 3',
                children: [{
                  id: 7,
                  label: '二级 3-1'
                }, {
                  id: 8,
                  label: '二级 3-2'
                }]

          }]
        }];
      return {
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        username:'',
        select:true,
        tableData:[],
        elementVisible:false,
        isLogin:false,
        folderName:"",
        treeShow:true,
        tableShow:true,
        nodeSelected:["test"]
      }
  	},
  	components: {
      tableTamplate
  	},
  	filters: {
  	},
  	mounted: function() {
  	    this.$nextTick(function() {
  	      this.load();
  	    });

  	},
    watch:{
       
    },
    methods:{
	     load(){

            this.treeData.splice(0,this.treeData.length);
            this.$http({
                method:'post',
                url:url.url+'/user/get_user_info.do'
            }).then(response =>{
              if(response.data.status == 0){
                this.username = response.data.data.username;
                this.$http({
                    method:'post',
                    url:url.url+'/crawler_tree/on_load.do'
                }).then(response =>{
                  if(response.data.status == 0){
                    this.treeData.push(response.data.data.tree);
                    this.tableData = response.data.data.list;
                  }else{
                      alert(response.data.msg)
                      // this.$router.push('/login')
                  }
                })
              }else{
                  alert("Please Login!")
                  this.$router.push('/login')
              }
            })
       },
       append(data) {
        const newChild = { id: id++, label: 'testtest', children: [] };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      },
      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },
       renderContent(h, { node, data, store }) {
        return (
          <span class="custom-tree-node">
            <svg class="icon custom-tree-node-icon" aria-hidden="true"  >
                    <use xlinkHref="#icon-folder"></use>
                  </svg>
            <span>{node.label}</span>
          </span>);
      },
      treeNodeClick(node, data, store){
        this.$http({
            method:'post',
            url:url.url+'/crawler_tree/get_node_list.do?nodeID='+node.ID
        }).then(response =>{
          if(response.data.status == 0){
            this.tableShow = true;
            this.tableData = response.data.data.list;
          }else{
              alert(response.data.msg)
              // this.$router.push('/login')
          }
        })
      },
      tableNodeClick(data){
        this.$http({
            method:'post',
            url:url.url+'/crawler_tree/get_node_list.do?nodeID='+data.parentID
        }).then(response =>{
          if(response.data.status == 0){
            this.tableShow = true;
            this.tableData = response.data.data.list;
          }else{
              alert(response.data.msg)
              // this.$router.push('/login')
          }
        })
      },
      showTreeNode(){
        this.elementVisible = true;
      },
      appendTreeNode(){
        var node = this.$refs.tree.getCurrentNode()
        if(node){
          this.$http({
              method:'post',
              url:url.url+'/crawler_tree/add_folder.do?parentID='+node.ID+'&folderName='+this.folderName
          }).then(response =>{
            if(response.data.status == 0){
              this.elementVisible = false;
              this.tableData = this.treeData.splice(0,this.treeData.length);
              this.$http({
                  method:'post',
                  url:url.url+'/crawler_tree/on_load.do'
              }).then(response =>{
                if(response.data.status == 0){
                  this.treeData.push(response.data.data.tree);
                  this.tableData = response.data.data.list;
                }else{
                    alert(response.data.msg)
                    // this.$router.push('/login')
                }
              })
            }else{
                alert(response.data.msg)
                // this.$router.push('/login')
            }
          })
        }else{
          alert("No parent node selected!!!");
          this.elementVisible = false;
        }
      },
      hrefAdmin(){
        var node = this.$refs.tree.getCurrentNode();
        if(node){
          this.$router.push({path:'/Admin',query: { parentId: node.ID}})
        }else{
          alert("No parent node selected!!!");
          this.elementVisible = false;
        }
      },
      logout(){
        this.$http({
            method:'post',
            url:'http://ec2-52-83-199-126.cn-northwest-1.compute.amazonaws.com.cn:8080/dtiusercenter/logout.do',
        }).then(response =>{
          if(response.data.status == 0){
              this.$router.push('/')
      
          }
        })
      },
      showTree(){
        // this.treeShow = !this.treeShow;
        // if(this.treeShow == false){

        //   this.tableShow = false;
        // }
      }

    },
}
</script>

<style scoped lang="less">
@import '../assets/less/home.less';
@import '../assets/less/scrollBar.less';


</style>