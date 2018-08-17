<template>
	<div id="div_body">
    <div class="more_box">
      <div class="box_title">
        
      </div>
      <div class="total_box">
        <div class="total_box_item"><div style="text-align: left">TOTAL:</div><div style="text-align: right">({{total}})</div></div>
        <div class="total_box_item"><div style="text-align: left">微博:</div><div style="text-align: right">({{weibo}})</div></div>
      </div>
      <div class="detail_box">
        <div class="detail_title" style="margin-top: 10px;">
          KEY WORD
        </div>
        <div class="detail_content">
          {{keyword}}
        </div>
        <div class="detail_title" >
          SOURCE URL
        </div>
        <div class="detail_content">
          <span @click="href(sourceUrl)" style="white-space:normal;display: block;word-break: break-all;">{{sourceUrl | formatUrl}}</span>
        </div>
        <div class="detail_title" >
          DATE
        </div>
        <div class="detail_content">
          {{pubTime | formatTime}}
        </div>
        <div class="detail_title" >
          CONTENT
        </div>
        <div class="detail_content">
          {{content}}
        </div>
      </div>
    </div>
    <div class="content_box">
      <div class="box_title">
        <img src="../assets/img/title.png" alt="">CONTENT LIST 
      </div>
      <div class="select_box">
        <div class="select_box_item">
          <el-input placeholder="" v-model="contentSearch" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="search('0')"></el-button>
          </el-input>
        </div>
        <span class="title_total">Total: {{contentPaging.total}}</span>    
      </div>
      <div class="list_box">
        <div class="list_box_title">
          <div class="content_span">
            CONTENT
          </div>
          <div class="date_span">
            DATE
          </div>
        </div>
        <div class="list_box_content">
          <div class="list_box_content_item" v-for="(item,index) in contentList">
            <div class="content_span" v-bind:title="item.content">
              <img src="../../static/img/nocheck.png" alt="" @click="selectList(item,index,$event,0)"><span @click="showDetail(item)">{{item.content}}</span>
            </div>
            <div class="date_span">
              {{item.pubTime | formatTime}}
            </div>
        </div>
        </div>
      </div>
      <div class="pagination_box">
        <el-pagination
          :page-count="contentPaging['page-count']"
          layout="prev, pager, next"
          @current-change="changeContent"
          @prev-click="changeContent"
          @next-click="changeContent"
          :current-page.sync="contentPaging.pageNo"
          >
        </el-pagination>
      </div>
      
    </div>
    <div class="btn_box">
      <div class="gotoLeft">
        <img src="../assets/img/left.png" alt="" @click="retrunBlack()">
      </div>
      <div class="gotoRight">
        <img src="../assets/img/right.png" alt="" @click="saveBlack()">
        
      </div>
    </div> 
    <div class="black_box">
      <div class="box_title">
          <img src="../assets/img/title.png" alt="">BLACK LIST 
      </div>
      <div class="select_box">
        <div class="select_box_item">
          <el-input placeholder="" v-model="blackSearch" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="search('1')"></el-button >
          </el-input>

        </div>
        <span class="title_total">Total: {{blackPaging.total}}</span>
      </div>
      <div class="list_box_black">
        <div class="list_box_title">
          <div class="content_span">
            CONTENT
          </div>
          <div class="date_span">
            DATE
          </div>
        </div>
        <div class="list_box_content">
          <div class="list_box_content_item" v-for="(item,index) in blackList">
            <div class="content_span" v-bind:title="item.content">
              <img src="../../static/img/nocheck.png" alt="" @click="selectList(item,index,$event,1)"><span @click="showDetail(item)">{{item.content}}</span>
            </div>
            <div class="date_span">
              {{item.pubTime | formatTime}}
            </div>
          </div>
        </div>
      </div>
      <div class="pagination_box">
        <el-pagination
          :page-count="blackPaging['page-count']"
          layout="prev, pager, next"
          @current-change="changeBlack"
          @prev-click="changeBlack"
          @next-click="changeBlack"
          :current-page.sync="blackPaging.pageNo"

          >
        </el-pagination>
      </div>

      <div class="confirm_box">
          <div class="confirm_btn" @click="confirmClick()">CONFIRM</div>
        </div>
    </div>
  </div>
</template>


<script>
import url from '../assets/js/url.js'

let id = 1000;

export default {
  	name: 'home',
  	data () {
      return {
        contentSearch:"",
        blackSearch:"",
        crawlerID:"",
        parentID:"",
        contentList:[],
        blackList:[],
        total:"",
        weibo:"",
        keyword:"",
        pubTime:"",
        sourceUrl:"",
        content:"",
        contentSelect:[],
        blackSelect:[],
        "page-size":100,
        contentPaging:{
          pageNo:1,
          "page-count":1,
          total:0
        },
        blackPaging:{
          pageNo:1,
          "page-count":1,
          total:0
        }
      }
  	},
  	components: {
      
  	},
  	filters: {
      formatTime(value){
        var time = value.split(" ")[0];
        return time;
      },
      formatUrl(value){
        return encodeURI(value)
      }

  	},
  	mounted: function() {
  	    this.$nextTick(function() {
  	      this.load();
  	    });

  	},
    watch:{
       
    },
    methods:{
        queryContent(){
          this.$http({
              method:'post',
              url:url.url+'/content/query.do',
              data:{
                "keyword":this.contentSearch,  
                "blacklist": 0,
                "crawlerId":this.crawlerID,
                "pageInfo": 
                  {
                      "pageNum": this.contentPaging.pageNo,   
                      "pageSize": "100",   
                      "orderBy": ""   
                  }
              }
          }).then(response =>{
            if(response.data.status == 0){
                this.contentList = response.data.data.list;
                this.contentPaging.total = response.data.data.total;
                this.contentPaging.pageNo = response.data.data.pageNum;
                this.contentPaging['page-count'] = response.data.data.pages;
                console.log(this.contentPaging['page-count'])
            }else{
                 this.$message({
                  type: 'info',
                  message: 'Query Failed!'
                });
            }
          })
        },
        queryBlack(){
          this.$http({
              method:'post',
              url:url.url+'/content/query.do',
              data:{
                "keyword":this.blackSearch,  
                "blacklist": 1,
                "crawlerId":this.crawlerID,
                "pageInfo": 
                  {
                      "pageNum": this.blackPaging.pageNo,   
                      "pageSize": "100",   
                      "orderBy": ""   
                  }
              }
          }).then(response =>{
            if(response.data.status == 0){
                this.blackList = response.data.data.list;
                this.blackPaging.total = response.data.data.total;
                this.blackPaging.pageNo = response.data.data.pageNum;
                this.blackPaging['page-count'] = response.data.data.pages;
            }else{
                this.$message({
                  type: 'info',
                  message: 'Query Failed!'
                });
            }
          })
        },
	      load(){
            this.crawlerID = this.$route.query.crawlerID;
            this.parentID = this.$route.query.parentID
            
            this.queryContent();
            this.queryBlack();
          

          this.$http({
              method:'get',
              url:url.url+'/content/total.do?crawlerId='+this.crawlerID,
          }).then(response =>{
            if(response.data.status == 0){
                this.total = response.data.data.total;
                this.weibo = response.data.data.weibo;

            }else{
                this.$message({
                  type: 'info',
                  message: 'Query Failed!'
                });
            }
          })
           
       },
       showDetail(data){
          this.content = data.content;
          this.pubTime = data.pubTime;
          this.keyword = data.keyword;
          this.sourceUrl = data.sourceUrl;
       },
       href(url){
        window.open(url)
       },
       selectList(item,index,event,status){
        var dom = event.target;
        if(status == 0){
          var isTrue = this.foreachArray(this.contentSelect,item.id);
          if(isTrue == true){
            dom.setAttribute("src","./static/img/nocheck.png")
          }else if(isTrue == false){
             dom.setAttribute("src","./static/img/checked.png");
             this.contentSelect.push(item.id);
          }
        }else if(status == 1){
          var isTrue = this.foreachArray(this.blackSelect,item.id);
          if(isTrue == true){
            dom.setAttribute("src","./static/img/nocheck.png")
          }else if(isTrue == false){
             dom.setAttribute("src","./static/img/checked.png");
             this.blackSelect.push(item.id);
          }
        }
          
       },
       foreachArray(arr,id){
          var isHas = arr.indexOf(id);
          if( isHas == -1){
            return false;
          }else{
             arr.splice(isHas,1);
              return true;
          }
       },

       saveBlack(){
        this.$http({
              method:'post',
              url:url.url+'/content/blacklist.do',
              data:{
                "operation":"in",  
                "ids": this.contentSelect
              }
          }).then(response =>{
            if(response.data.status == 0){
                this.contentList.splice(0,this.contentList.length);
                this.blackList.splice(0,this.blackList.length);
                this.queryContent();
                this.queryBlack();

            }else{
                this.$message({
                  type: 'info',
                  message: 'Operation Failed!'
                });
            }
          })
       },
       retrunBlack(){
        this.$http({
              method:'post',
              url:url.url+'/content/blacklist.do',
              data:{
                "operation":"out",  
                "ids": this.blackSelect
              }
          }).then(response =>{
            if(response.data.status == 0){
                this.contentList.splice(0,this.contentList.length);
                this.blackList.splice(0,this.blackList.length);
                this.queryContent();
                this.queryBlack();

            }else{
                this.$message({
                  type: 'info',
                  message: 'Operation Failed!'
                });
            }
          })
       },
       search(status){
          if(status == 0){
            this.queryContent();
                
          }else if(status == 1){
            this.queryBlack();
          }

       },
       confirmClick(){
          this.$router.push({path:'/home',query:{ID:this.parentID}})
       },
       changeContent(val){
          this.contentPaging.pageNo = val;
          this.queryContent();
       },
       changeBlack(val){
          this.blackPaging.pageNo = val;
          this.queryBlack()
       }
       

    },
}
</script>

<style scoped lang="less">
@import '../assets/less/content.less';
@import '../assets/less/scrollBar.less';


</style>