<template>
	<div id="login_div">
    <div class="o-layout--login">

        <div class="c-logo--bf"><img src="../assets/img/login.png" alt="" width="100%" height="100%"></div>

        <div class="o-layout__item">

            <div id="loginForm">
              <input type="text" id="formLoginEmail" name="email" placeholder="User" value="" class="c-form__input--round ic-user">
              <input type="password" id="formLoginPsswd" name="passwd" placeholder="Password" value="" class="c-form__input--round ic-lock" @keyup.enter="login" >
              <button class="c-form__button--round" id="testBT" @click="login">Get Started</button>
            </div>

            <div id="loginFormError" class="msg-error" style="display: none;">Wrong user name or password!</div>

        </div>

    </div>
  </div>
</template>


<script>
import url from '../assets/js/url.js'

export default {
  	name: 'home',
  	data () {
  	    return {
  	    }
  	},
  	components: {

  	},
  	filters: {
  	},
  	mounted: function() {
  	    // this.$nextTick(function() {
  	    //   this.load();
  	    // });
  	},
    watch:{
       
    },
    methods:{
	     login(){ 
          var username = document.getElementById('formLoginEmail').value;
          var password = document.getElementById('formLoginPsswd').value;
         
            this.$http({
                method:'post',
                url:'http://ec2-52-83-199-126.cn-northwest-1.compute.amazonaws.com.cn:8080/dtiusercenter/login.do',
                data:{
                  "username":username,
                  "password":password,
                  "project":"Social Crawler"//这个在这个项目就写死就好
                }
            }).then(response =>{
              if(response.data.status == 0){
                this.$router.push('/home')
              }else{
                 document.getElementById("loginFormError").style.display="block";
              }
            })
           
       }
    },
}
</script>

<style scoped lang="less">
@import '../assets/less/login.less';

</style>