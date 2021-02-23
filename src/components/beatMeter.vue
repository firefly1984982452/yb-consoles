<template>
	<div class="metter">
		<div v-bind:class="{'metHigh':capWhat==0,'metHighs':capWhat==1||capWhat==2}">
			<h4>{{captaType}}拍照</h4>
			<div class="metContainer imgContainer">
				<el-row>
					<el-col :span="12" style="position: relative;left: 0;">
						<div id="views" style="position: absolute;z-index: 1;">                    		
	                    	<OBJECT id="CamSDKOCX" standby="正在调用高拍仪。。。" width="400" height="300" classid="clsid:556DBC8A-FE4A-4DA7-A82E-3926C8D4AC41" style="position: relative;top:10px;z-index: 1;">
	                    		<param name="wmode" value="opaque">
	                    	</OBJECT>
	                    </div>
					</el-col>
					<el-col :span="12" class="preView" style="position: relative;left: 480px;top:10px">
						<div v-bind:class="{'caijian':capWhat==0,'caijians':capWhat==1||capWhat==2}">							
							<img id="imgPreviews" :src="viewPic" border="1" width="400" height="300"/> 
						</div>
					</el-col>
				</el-row>
			</div>
			<div class="metContainer" style="margin-top: 25px;">
				<el-row>
					<el-col :span="12" style="position: relative;left: 0;">
						<div id="views" style="position: absolute;z-index: 1;height: 30px;border: none;">                    		
	                    	<span>请确保{{captaType}}在红色线框内</span>
	                    </div>
					</el-col>
					<el-col :span="12" class="preView" style="position: relative;left: 480px;top:10px">
						<div v-bind:class="{'caijian':capWhat==0,'caijians':capWhat==1||capWhat==2}" style="height: 30px;border: none;position: relative;top:-10px;">							
							<span>预览</span> 
						</div>
					</el-col>
				</el-row>
			</div>
			<div class="metContainer" style="margin: 50px 0 45px 0;">
				<el-row type="flex" class="row-bg" justify="center">
					<el-col :span="20">
						<el-row :gutter="30"  type="flex" justify="center">
							<el-col :span="5"><el-button type="warning" @click="flash64()">刷新</el-button></el-col>
							<el-col :span="5"><el-button type="success" @click="CaptureBase64()">拍照</el-button></el-col>
							<el-col :span="5"><el-button type="primary" plain  @click="cancelMeter(1)">完成</el-button></el-col>
							<el-col :span="5"><el-button plain  @click="cancelMeter(0)">取消</el-button></el-col>
						</el-row>
					</el-col>
				</el-row>
			</div>
			<div class="metContainer" style="position: absolute;">
				<el-row>
					<el-col>
						<input style="width:100%;visibility: hidden;" type = "text" name="path" id="path" value="C:\temp" @change="SetSaveFolder()">
					</el-col>
				</el-row>
				<el-row>
					<el-col>
						<select style = "width:90;visibility: hidden;" name = "fivar ype" id = "fivar ype" onchange = "">
							<option value=".jpg">jpg</option>
							<option value=".bmp">bmp</option>
							<option value=".png">png</option>
							<option value=".tif">tif</option>
							<option value=".ico">ico</option>
							<option value=".pdf">pdf</option>
						</select>
					</el-col>
					<el-col>
						<select name="MediaType" id = "MediaType" style = "visibility: hidden;"></select>
						<select name="Resolution" id = "Resolution"  style = "visibility: hidden;"></select>
					</el-col>
					<el-col style = "visibility: hidden;">
						<input type = "checkbox" name = "CurCrop" id = "CurCrop"/>
						左：<input style = "width:40;" type = "text" name = "leftValue" id = "leftValue"/>
						上：<input style = "width:40;" type = "text" name = "topValue" id = "topValue"/>
						右：<input style = "width:40;" type = "text" name = "rightValue" id = "rightValue"/>
						下：<input style = "width:40;" type = "text" name = "bottomValue" id = "bottomValue"/>
						&nbsp&nbsp<input type = "button" value = "设置手裁框">
					</el-col>
				</el-row>
			</div>
		</div>
	</div>
</template>
<script>
import axios from "axios";
import qs from "qs";

export default {
    data() {
      	return {
      		actionUrl: this.globalURL.httpUrl + "/sev/SerEnter/upload",
      		optionss:['USB Camera','Document Scanner'],
      		xx:0,
      		viewPic:"",
      		userPic:"",
      		pic:[],
      		captaType:"",
      	};
    },
    mounted(){
//		if(this.haveInitState == 1){
//			setTimeout(this.StartVideo,200);
//		}else{    		
//			this.InitCamOCX();
//		}
		this.UnInitCamOCX();
		
    },
    created() {
    	if(this.meterType == "USB Camera"){
    		this.captaType = "人脸"
    	}else{
    		this.captaType = "文件"
    	}
    },
    computed: {
		meterStr: {
			get() {
				return this.$store.getters.meterStrs;
			},
			set() {}
		},
		form:{
			get() {
				return this.$store.getters.staffDataCreates;
			},
			set() {}
		},
		form3:{
			get() {
				return this.$store.getters.familyDatas;
			},
			set() {}
		},
		meterType:{
			get() {
				return this.$store.getters.staffTypes;
			},
			set() {}
		},
		dataTypeList:{
			get() {
				return this.$store.getters.dataTypes;
			},
			set() {}
		},
		imgIndex:{
			get() {
				return this.$store.getters.imgIndexs;
			},
			set() {}
		},
		capWhat:{
			get() {
				return this.$store.getters.captureWhats;
			},
			set() {}
		},
		haveInitState:{
			get() {
				return this.$store.getters.haveInits;
			},
			set() {}
		}
	},
  	methods: {
		ZoomIN(){var  CamSDKOCX = document.getElementById('CamSDKOCX');CamSDKOCX.ZoomIn();},
		Zoomout(){var  CamSDKOCX = document.getElementById('CamSDKOCX');CamSDKOCX.Zoomout();},
		OriginalPreview(){var  CamSDKOCX = document.getElementById('CamSDKOCX');CamSDKOCX.OriginalPreview();},
		OptimalPreview(){var  CamSDKOCX = document.getElementById('CamSDKOCX');CamSDKOCX.OptimalPreview();},
		SetImageCusCropRect(){
//			debugger
			var  CamSDKOCX = document.getElementById('CamSDKOCX');
			var  leftValue = document.getElementById('leftValue');
			var  topValue = document.getElementById('topValue');
			var  rightValue = document.getElementById('rightValue');
			var  bottomValue = document.getElementById('bottomValue');
			if(this.capWhat == 0){
				CamSDKOCX.SetImageCusCropRect(20,0,80,100)//左上右下拍人
			}else if(this.capWhat == 1){				
				CamSDKOCX.SetImageCusCropRect(35,40,63,63)//拍身份证
			}else if(this.capWhat == 2){				
				CamSDKOCX.SetImageCusCropRect(0,0,100,100)//拍身份证
			}
		},
		flash64(){
			this.InitCamOCX();
		},
		ChangeDevice(val){
//			debugger
//			this.InitCamOCX();
			if(val=="USB Camera"){
				this.xx = 1;
			}else{
				this.xx = 0;
			}
			var  CamSDKOCX = document.getElementById('CamSDKOCX');
//			CamSDKOCX.CloseDev();
			var obj = document.getElementById("DeviceList");
//			debugger
			if(this.xx >= 0){
				CamSDKOCX.openDev(this.xx,0,2592,1944);
				var  MediaType = document.getElementById('MediaType');
				var  Resolution = document.getElementById('Resolution');
//				debugger
				this.AddMediaType(MediaType);
				this.AddResolution2Comb(Resolution);
			}
		},
//		更新分辨率列表
		AddResolution2Comb(list){
//			clean(list);
			var  CamSDKOCX = document.getElementById('CamSDKOCX');
			var total = CamSDKOCX.GetResolutionCount();
			for(var i = 0 ; i < total ; i++ )
			{   
				var width = CamSDKOCX.GetResolutionWidth(i);
				var height = CamSDKOCX.GetResolutionHeight(i); 
				var resolution = width+" x "+height;
				list.options.add(new Option(resolution));
				//list.options[i].text=resolution;
		    }
		    list.options[0].selected = true;
		},
//		更新媒体类型列表
		AddMediaType(list){
//			clean(list);
			var  CamSDKOCX = document.getElementById('CamSDKOCX');
			var total = CamSDKOCX.GetMediaTypeCount();
			for(var j = 0 ; j < total ; j++ )
			{   
				var mediatypeName = CamSDKOCX.GetMediaTypeName(j);
				list.options.add(new Option(mediatypeName));
				//list.options[j].text=mediatypeName ;
		    }
		    list.options[0].selected = true;
		},
		InitCamOCX(){
//			debugger
			var  CamSDKOCX = document.getElementById('CamSDKOCX');
			var  ret = CamSDKOCX.InitCameraLib();
			if(ret){
				if(ret == 263){
//					alert("ocx初始化成功，但是没有授权");
				}else{
					alert("OCX初始化失败，错误号：" + ret);
					return;
				}
			}
			setTimeout(this.StartVideo,200);
			this.$store.commit("setHaveInit", 1);//员工的创建	
		},
		UnInitCamOCX(){
			var CamSDKOCX = document.getElementById('CamSDKOCX');
			CamSDKOCX.UnInitCameraLib();
			this.InitCamOCX();
		},
		AddDevice(){
//			debugger
			var  CamSDKOCX = document.getElementById('CamSDKOCX');
	    	var  mainDevCount = 0;
	    	var  total = CamSDKOCX.GetDevCount();
			for(var  i = 0 ; i < total ; i++ ){
		    	var  devtype = CamSDKOCX.GetDevType(i);
		    	var  DevEle = CamSDKOCX.GetDevName(i);
		    	mainDevCount++;
			}
		},
		/*打开摄像头*/
		StartVideo() {
//			debugger
			this.AddDevice();
//			this.ChangeDevice("Document Scanner");
			console.log(this.meterType)
			setTimeout(this.ChangeDevice(this.meterType),200);
			this.SetImageCusCropRect();
		},
		/*拍照*/
		Capture(){
//			debugger
//			this.InitCamOCX();
			var  CamSDKOCX = document.getElementById('CamSDKOCX');
			var  fileext = document.getElementById("fivar ype").value;
			var  strFolder = document.getElementById("path").value;
			var  myDate = new Date();
			var  myName = "Image_"+myDate.getFullYear()+(myDate.getMonth()+1)+myDate.getDate()+"_"+myDate.getHours()+myDate.getMinutes()+myDate.getSeconds()+myDate.getMilliseconds();
			var  newFile = strFolder + "\\" + myName + fileext ;
			var  files = CamSDKOCX.CaptureImage(newFile);
			return newFile;
		},
		CaptureBase64(obj){
//			debugger
			let that = this;
			var  CamSDKOCX = document.getElementById('CamSDKOCX');
			let  files = that.Capture();
			files = files.split(";"); 
			for (var i=0;i<files.length;i++ ){
				var strBase64 = CamSDKOCX.EncodeBase64(files[i]);
				that.showImageBase64(strBase64);	
			} 
		},
		showImageBase64(strBase64){
//			debugger
			this.viewPic = "data:image/jpeg;base64," + strBase64;
			this.viewPic = this.viewPic.replace(/\r\n/g,"");
			this.userPic = this.dataURLtoBlob(this.viewPic);
		},
		SetSaveFolder(){
			var saveFolder = document.getElementById("saveFolder");
			saveFolder.href = path.value;
		},
    	dataURLtoBlob(dataurl) {
		    var arr = dataurl.split(','),
		    mime = arr[0].match(/:(.*?);/)[1],
		    bstr = atob(arr[1]),
		    n = new ArrayBuffer(bstr.length),
		    u8arr = new Uint8Array(n);
		    for(var i = 0; i < bstr.length; i++) { 
		 		u8arr[i] = bstr.charCodeAt(i); 
		 	}
		    return new Blob([n], {
		        type: mime
		    });
		},
		saveImage(){
	        this.loading = true;
	        let that = this;
	        var params = new FormData();
	        params.append("file", this.userPic);
	        that.$ajax({
	          method: "post",
	          url: that.actionUrl,
	          data: params,
	          async: true,
	          cache: false,
	          contentType: false,
	          processData: false,
	          dataType: "json"
	        })
		    .then(function(response) {
		    if (response.data.code == 200) {
			    that.$message({
			        message: "保存成功",
			        type: "success"
			    });
		    } else if (response.data.code == "401") {
		        that.$message({
			        message: res.data.message,
			        type: "warning"
			    });
		        that.$router.push("/login");
		    } else {
		        that.$message.error({
		            message: response.data.message
		        });
		    }
		    	that.loading = false;
		    })
		    .catch(function(error) {
		    	that.$message.error(error);
		    	that.loading = false;
		    });
		},
		cancelMeter(num){
//			0取消,1完成
//			debugger	
			if(this.viewPic!=""){
				if(num==1){	
					if(this.dataTypeList == "list"){
						this.loading = true;
						let that = this;
        				var params = new FormData();
        				params.append("file", this.dataURLtoBlob(this.viewPic));
						this.$ajax({
					        method: "post",
					        url: this.actionUrl,
					        data: params,
				          	async: true,
					        cache: false,
					        contentType: false,
					         processData: false,
					        dataType: "json"
					    }).then(function(response) {
				            if (response.data.code == 200) {
				              that.$message({
				                message: "提交成功",
				                type: "success"
				              });
				              that.form3[that.imgIndex][that.meterStr] = response.data.url;
				              that.$store.commit("setFamilyData", that.form3);//员工的创建	
				              /*反初始化*/
//							  that.UnInitCamOCX();
				              that.$store.commit("setMeter", 0);
				            } else if (response.data.code == "401") {
				              that.$message({
				                message: response.data.message,
				                type: "warning"
				              });
				              that.$router.push("/login");
				            } else {
				              that.$message.error({
				                message: response.data.message
				              });
				            }
				            that.loading = false;
				          })
				          .catch(function(error) {
				            that.$message.error(error);
				            that.loading = false;
				        });
						CamSDKOCX.CloseDev();
					}else{
						
						this.form[this.meterStr] = this.viewPic;
						this.$store.commit("setStaffDataCreate", this.form);//员工的创建	
						/*反初始化*/
//						this.UnInitCamOCX();
						this.$store.commit("setMeter", 0);
						CamSDKOCX.CloseDev();
					}
				}else{
					CamSDKOCX.CloseDev();
					/*反初始化*/
//					this.UnInitCamOCX();
					this.$store.commit("setMeter", 0);
				}
			}else{
				/*反初始化*/
//				this.UnInitCamOCX();
				this.$store.commit("setMeter", 0);
				CamSDKOCX.CloseDev();
			}
			
		},
  	}
};
</script>

<style>
</style>