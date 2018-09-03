<template>
	<div id="div_body">
		<div class="o-grid">
            <div class="o-grid-cell admin-title">
                <img src="../assets/img/20180716_16.png" alt="" width="280px">
            </div>
            <div class="o-grid-cell--rev">
                <a href="javascript:;;" class="admin-link-bfapp" @click="gotoHome">Back to Home</a>
                <span class="admin-link-sep">|</span>
                <a href="javascript:;;;" class="main-content__header-login" @click="logout">Logout x</a>
            </div>
        </div>
        <div class="content_div">
        	<div class="content_header">
        		<div class="o-grid-cell">
        			<a class="admin-section-link is-active" href="javascript:;;" id="bf-create">Create a new corpus</a>
        		</div>
        	</div>
        	<div class="content_main">
        		<div>
                    <div>
                        <label>Name:</label>
                        <el-input v-model="campaignName" placeholder="Enter name here" name="campaign"></el-input>
                    </div>
                    <div style="margin-top: 30px;">
                        <label >Website:</label><br>
                        <el-select v-model="websiteSelect" multiple  placeholder="Select" filterable>
                        <el-option
                          v-for="item in websiteData"
                          :key="item.name"
                          :label="item.name"
                          :value="item.fullname">
                        </el-option>
                      </el-select>
                    </div>
                    <div style="margin-top: 30px;">
                        <label >City:</label><br>
                        <el-select v-model="citySelect" multiple  placeholder="Select" filterable>
                        <el-option
                          v-for="item in cityData"
                          :key="item.name"
                          :label="item.name"
                          :value="item.name">
                        </el-option>
                      </el-select>
                    </div>
                </div>
                <div>
                    <div>
                        <label >Start Date:</label><br>
                        <el-date-picker
                          v-model="startDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="Start Date">
                        </el-date-picker>
                    </div>
                    <div style="margin-top: 30px;">
                        <label>End Date:</label><br>
                        <el-date-picker
                          v-model="endDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="End Date">
                        </el-date-picker>
                    </div>
                </div>
        	</div>
            <div class="content_main2"> 
                <label>Keyword Query:</label><br>
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4}"
                  placeholder="Keywords"
                  v-model="keywords">
                </el-input>
            </div>
            <div class="tips_box">
              <p>please note that keywords format only accept:</p>
              <p>A</p>
              <p>A or B or C</p>
              <p>A and B and C</p>
              <p>(A or B) and C</p>
              <p>A and (B or C)</p>
              <p>(A or B) and (C or D)</p>
            </div>
            <div class="btn_div">
                <div class="VALIDATE_btn" @click="validate">
                    Submit
                </div>
            </div>

        </div>
	</div>
</template>


<script>
import url from '../assets/js/url.js'

export default {
	name:'admin',
	data(){
		return {
            campaignName:"",
            startDate:"",
            endDate:"",
            websiteData:[],
            websiteSelect:"",
            cityData:[],
            citySelect:"",
            keywords:""
		}
	},
	mounted(){
		this.$nextTick(function(){
			this.load()
		});
	},
	methods:{
		load(){
          this.$http({
              method:'get',
              url:url.url+'/mission/optionList.do',
              headers: {
                  'Content-type': 'application/json'
              },
              // data:this.selectData1,
          }).then(response =>{
            if(  typeof(response.data) == "string"){
               var data = $.parseJSON( response.data );
            }
              var data = response.data;
              this.websiteData =data.data.website;
              this.cityData = data.data.city;
              console.log(data)
          })

          // this.$http({
          //     method:'get',
          //     url:url.url+'/json/optionList.json',
          //     // data:this.selectData1,
          // }).then(response =>{
          //     this.cityData = response.data.data.city;
          // })

          
		},  
    validate(){
      var _this = this;
      var keywords = _this.keywords;
      keywords = keywords.replace(/[\r\n]/g, " ");
      console.log(keywords)
      var demo = /^[a-zA-Z0-9 \u4e00-\u9fa5]*(?:[(][a-zA-Z0-9 \u4e00-\u9fa5]*[)][a-zA-Z0-9 \u4e00-\u9fa5]*[(][a-zA-Z0-9 \u4e00-\u9fa5]*[)]){0,1}[a-zA-Z0-9 \u4e00-\u9fa5]*$/;
      var test1 = demo.test(keywords);

      if(test1 == true){

          var ajaxData = {};
          ajaxData.parentId = _this.$route.query.parentId;
          ajaxData.campaignName = _this.campaignName;
          ajaxData.filter = {};
          ajaxData.filter.startDate = _this.startDate;
          ajaxData.filter.endDate = _this.endDate;
          ajaxData.filter.keywords = keywords;
          if(_this.websiteSelect.length !=0){
            ajaxData.filter.website = _this.websiteSelect.join(";");
          }else{
            var arr1 = [];
            $.each(_this.websiteData,function(index,value){
              arr1.push(value.fullname)
            })
            ajaxData.filter.website = arr1.join(";");
          }   
          ajaxData.filter.city = _this.citySelect.join(";");

          _this.$http({
                method:'post',
                url:url.url+'/mission/add.do',
                data:ajaxData
            }).then(response =>{
              if(response.data.status == 0){
                  _this.$message({
                    type: 'success',
                    message: "Save Successful!"
                  });
                  _this.$router.push({path:'/home',query:{ID:_this.$route.query.parentId}})
          
              }else if(response.data.msg == "NEED_LOGIN"){
                  alert(response.data.msg)
                  this.$router.push('/login')
              }else{
                   _this.$message({
                    type: 'info',
                    message: "Save Failed!"
                  });
              }
            })
      }else{
        this.$message({
                type: 'info',
                message: "Invalid keyword query format."
              });
      }
      
    },
    logout(){
      this.$http({
          method:'post',
          url:'http://ec2-52-83-199-126.cn-northwest-1.compute.amazonaws.com.cn:8080/dtiusercenter/logout.do',
      }).then(response =>{
        if(response.data.status == 0){
            this.$router.push('/')
    
        }else if(response.data.msg == "NEED_LOGIN"){
              alert(response.data.msg)
              this.$router.push('/login')
          }
      })
    },
    gotoHome(){
      this.$router.push('/home');
    }
	}

}	
</script>

<style scoped lang="less">
@import '../assets/less/admin.less';
@import '../assets/less/scrollBar.less';


</style>