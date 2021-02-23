<template>
    <div>
        <FirstServer ref="FirstServer" :elderId="elderId"></FirstServer>
        <el-card class="box-card none_shadow">
            <!-- <div class="buttons" style="text-align:center;">
                <el-button type="primary" @click="save">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </div> -->
        </el-card>
    </div>
</template>

<script>
    import axios from "axios";
    import FirstServer from '@/modules/elder/pages/checkIn/editComponents/firstServer-xyw';
	export default {
        components: {FirstServer},
		data() {
			return {
                elderId: ""
			}
        },
        created(){
            
        },
        watch : {
            '$store.state.submitElderServiceSuccess'(val) {
                if (val) {
                    this.$router.push({
                        path: "/elder/changeList"
                    })
                }
            }
        },
		methods:{
            save(){
                this.$refs.FirstServer.childAction1();
            },
            cancel(){
                this.$router.push({
					path: "/elder/change"
				});
            }
      	}
    }
</script>

<style scoped>
    .none_shadow {
        position: relative;
        top: -2px;
        box-shadow: none;
        border-top: #fff;
    }
</style>