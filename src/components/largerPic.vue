<template>
	<div class="bigImg">
		<button type="button" aria-label="Close" class="el-dialog__headerbtn" @click="closePic()"><i class="el-dialog__close el-icon el-icon-close"></i></button>
		<div class="centPic">
			<img :src="whichpic" alt="" id="viewImg"/>
			<div class="controlPic clearfix">
				<ul>
					<li>
						<i class="btniconfont iconjichutubiao-fangdatupian" @click="fd()"></i>
					</li>
					<li>
						<i class="btniconfont iconchutubiao-suoxiaotupian" @click="sx()"></i>
					</li>
					<li>
						<i class="btniconfont iconjichutubiao-shijichicunxianshi" @click="qp()"></i>
					</li>
					<li>
						<i class="btniconfont iconjichutubiao-xiangzuoxuanzhuan" @click="xzn()"></i>
					</li>
					<li>
						<i class="btniconfont iconjichutubiao-xiangyouxuanzhuan" @click="xzs()"></i>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				faSize:1,
				deg:0,
			};
		},
		computed: {
		    whichpic: {
				get() {
					return this.$store.getters.lgwhichpics;
				},
				set() {}
			},
		},
		methods: {
  			closePic(){
  				this.$store.commit("setLargePic", 0);
  			},
  			fd(){
  				if(this.faSize >= 2){
  					return
  				}
  				let box = document.getElementById('viewImg')
			  	this.faSize += .3
			  	box.style.transform = `rotate(${this.deg}deg) scale(${this.faSize})`
  			},
  			sx(){
  				if(this.faSize < .5){
  					return
  				}
  				let box = document.getElementById('viewImg')
			  	this.faSize -= .3
			  	box.style.transform = `rotate(${this.deg}deg) scale(${this.faSize})`
  			},
  			qp(){
  				let box = document.getElementById('viewImg')
  				this.faSize = 1;
  				this.deg = 0;
  				box.style.transform = `rotate(${this.deg}deg) scale(${this.faSize})`
  			},
  			xzn(){
  				let box = document.getElementById('viewImg')
  				this.deg += 90;
  				box.style.transform = `rotate(${this.deg}deg) scale(${this.faSize})`
  			},
  			xzs(){
  				let box = document.getElementById('viewImg')
  				this.deg -= 90;
  				box.style.transform = `rotate(${this.deg}deg) scale(${this.faSize})`
  			},
		}
	};
</script>

<style>
	.bigImg{
		position: fixed;
	    top: 0;
	    left: 0;
	    width: 100%;
	    height: 100%;
	    background: rgba(0,0,0,0.8);
	    z-index: 2;
	    color: #333;
	}
	.bigImg button{
		width: 30px;
	}
	.bigImg button i{		
		font-size: 40px;
	}
	.centPic{
		width: 40.5%;
	    position: absolute;
	    left: 50%;
	    top: 50%;
	    -webkit-transform: translate(-50%,-50%);
	    transform: translate(-50%,-50%);
	}
	.centPic img{width:100%;}
	.controlPic{
		width: 40%;
	    position: absolute;
	    left: 50%;
	    -webkit-transform: translateX(-50%);
	    transform: translateX(-50%);
	    height: 46px;
	    color: #fff;
	    line-height: 46px;
	    background: rgba(0,0,0,.8);
	    bottom: 14vh;
	    z-index: 2;
	    border-radius: 30px;
	}
	.controlPic ul li{
		float: left;
		width: 20%;
		text-align: center;
	}
	.controlPic i{
		font-size:22px;
		cursor: pointer;
	}
	.controlPic i:hover{
		color: #ddd;
	}
</style>