import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex);

export default new vuex.Store({
    state: {
        openNavNext : false, //是否打开下一步
        submitElderServiceSuccess : false, // 提交老人服务内容是否成功【用于约定变更处成功后跳转】
        editContract: false, // 编辑老人时合同是否可编辑
        noCheckUserID: '', //离院时发现未审核的老人的ID

        /*供应商*/
        gysData: [],
        gysPage: 1,
        gysTotal: 0,
    },
    mutations: {
        /*供应商*/
        setGysData(state, data) {
            state.gysData = data
         },
        setGysPage(state, data) {
            state.gysPage = data
        },
        setGysTotal(state, data) {
            state.gysTotal = data
        },
    }
})
