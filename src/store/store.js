import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state:{
		selectedData:{}
	},
	mutations:{
		setData(state,data){
			state.selectedData = data;
			window.sessionStorage.setItem('selected',JSON.stringify(data)); 
		}
	}
})
