<template>
    <div class="newScore" style="margin:20px;width:auto;">
        <table class="functionTable">
            <tr>
                <td class="tabelTitleStyle">测试大类内容</td>
                <td class="tabelTitleStyle">序号</td>
                <td class="tabelTitleStyle">测试小项内容</td>
                <td class="tabelTitleStyle">小项得分</td>
                <td class="tabelTitleStyle">大类得分</td>
                <td class="tabelTitleStyle">测试结果</td>
                <td class="tabelTitleStyle">使用FML量表说明</td>
            </tr>
            <tr>
                <td rowspan="7" class="testStyle ">A.自理</td>
            </tr>
            <tr>
                <td class="xuhao">1</td>
                <td>进食</td>
                <td>{{judge[0]}}分</td>
                <td rowspan="7" class="big-score">{{judgeA}}分</td>
                <td rowspan="23" style="font-size:16px;font-weight:bold;color:#F6812B;">{{judgeAll}}分</td>
                <td rowspan="23" id="xuhaoPlain">
                    <p style="font-weight:400;color:#333;">FLM量表采用了7分制（1～7分）的评分方法，主要根据患者执行某项任务所需的帮助程度给予记分，6～7分表示功能独立，1～5分表示需要帮助。</p>
                    <h6 class="testStyle">其中：</h6>
                    <ul>
                        <li>·7分为完全独立（及时地完全地完成</li>
                        <li>·6分为能独立完成，单需要辅助用具</li>
                        <li>·5分为需要人监护</li>
                        <li>·4分为少量的帮助（主观努力完成75%以上</li>
                        <li>·3分为中等度的帮助（主观努力完成50%～75%）</li>
                        <li>·2分为很大的帮助（主观努力完成25%～50%）</li>
                        <li>·1分为完全需要人帮助（主观努力完成0～25%）</li>
                    </ul>
                    <p class="testStyle">另：</p>
                    <h6 class="other-items">有括约肌控制障碍者</h6>
                    <ul>
                        <li>·5分为每月失禁≥1次</li>
                        <li>·4分为每周失禁＜1次</li>
                        <li>·3分为每周失禁>1次</li>
                        <li>·2分为有办法使失禁次数减少</li>
                        <li>·1分为每天均有失禁</li>
                    </ul>
                    <p class="other-items">步行项目检查</p>
                    <ul>
                        <li>·7分为不用助行器，至少能走50m</li>
                        <li>·6分为用助行器或轮椅，能走50m，并能越过至少30的斜坡</li>
                        <li>·5分为需要监护，所需时间较（走50m）或用助行器或轮椅能走17m</li>
                    </ul>
                    <p class="other-items">上下楼梯</p>
                    <ul>
                        <li>指一段楼梯（12～14级）</li>
                    </ul>
                    <p class="other-items">视听理解和语言表达</p>
                    <ul>
                        <li>包括对复杂和抽象信息的理解，如日常生活或时事等方面的谈话、提问或陈述。</li>
                    </ul>
                    <p class="other-items">社会交往</p>
                    <ul>
                        <li>观察患者在社会场合中与他人交往是否需要额外时间，以及是否需要帮助和帮助的时间</li>
                    </ul>
                    <p class="other-items">解决问题</p>
                    <ul>
                        <li>包括日常生活中意外事件的处理</li>
                    </ul>
                    <p class="other-items">记忆</p>
                    <ul>
                        <li>包括人物、日常生活和他人的请求等</li>
                    </ul>
                </td>
            </tr>
            <tr class="trStyle">
                <td class="xuhao">2</td>
                <td>修饰</td>
                <td>{{judge[1]}}分</td>
            </tr>
            <tr>
                <td class="xuhao">3</td>
                <td>洗澡</td>
                <td>{{judge[2]}}分</td>
            </tr>
            <tr class="trStyle">
                <td class="xuhao">4</td>
                <td>穿上衣</td>
                <td>{{judge[3]}}分</td>
            </tr>
            <tr>
                <td class="xuhao">5</td>
                <td>穿下衣</td>
                <td>{{judge[4]}}分</td>
            </tr>
            <tr class="trStyle">
                <td class="xuhao">6</td>
                <td>如厕</td>
                <td>{{judge[5]}}分</td>
            </tr>
            <tr>
                <td rowspan="3" class="testStyle trTiitle">B.括约肌控制</td>
            </tr>
            <tr>
                <td class="xuhao">7</td>
                <td>排便管理</td>
                <td>{{judge[6]}}分</td>
                <td rowspan="2" class="big-score">{{judgeB}}分</td>
            </tr>
            <tr class="trStyle">
                <td class="xuhao">8</td>
                <td>排尿管理</td>
                <td>{{judge[7]}}分</td>
            </tr>
            <tr>
                <td rowspan="4" class="testStyle">C.转移</td>
            </tr>
            <tr>
                <td class="xuhao">9</td>
                <td>床椅转移</td>
                <td>{{judge[8]}}分</td>
                <td rowspan="3" class="big-score">{{judgeC}}分</td>
            </tr>
            <tr class="trStyle">
                <td class="xuhao">10</td>
                <td>卫生间</td>
                <td>{{judge[9]}}分</td>
            </tr>
            <tr>
                <td class="xuhao">11</td>
                <td>浴池/浴室</td>
                <td>{{judge[10]}}分</td>
            </tr>
            <tr>
                <td rowspan="3" class="testStyle trTiitle">D.行进</td>
            </tr>
            <tr class="trStyle">
                <td class="xuhao">12</td>
                <td>步行/轮椅</td>
                <td>{{judge[11]}}分</td>
                <td style="background: #fff;" rowspan="2" class="big-score">{{judgeD}}分</td>
            </tr>
            <tr>
                <td class="xuhao">13</td>
                <td>上下楼梯</td>
                <td>{{judge[12]}}分</td>
            </tr>
            <tr>
                <td rowspan="3" class="testStyle trTiitle">E.交流</td>
            </tr>
            <tr class="trStyle">
                <td class="xuhao">14</td>
                <td>试听理解</td>
                <td>{{judge[13]}}分</td>
                <td style="background: #fff;" rowspan="2" class="big-score">{{judgeE}}分</td>
            </tr>
            <tr>
                <td class="xuhao">15</td>
                <td>语言表达</td>
                <td>{{judge[14]}}分</td>
            </tr>
            <tr>
                <td rowspan="4" class="testStyle trTiitle">F.社会认知</td>
            </tr>
            <tr class="trStyle">
                <td class="xuhao">16</td>
                <td>社会往来</td>
                <td>{{judge[15]}}分</td>
                <td style="background: #fff;" rowspan="3" class="big-score">{{judgeF}}分</td>
            </tr>
            <tr>
                <td class="xuhao">17</td>
                <td>解决问题</td>
                <td>{{judge[16]}}分</td>
            </tr>
            <tr class="trStyle">
                <td class="xuhao">18</td>
                <td>记忆能力</td>
                <td>{{judge[17]}}分</td>
            </tr>
        </table>
    </div>
</template>

<script>
	import axios from "axios";
	export default {
        props: ["elderId"],
		data() {
			return {
                judge: [],
                judgeA: 0,
				judgeB: 0,
				judgeC: 0,
				judgeD: 0,
				judgeE: 0,
                judgeF: 0,
                judgeAll: 0,
                smallCategory: ["进食","修饰","洗澡","穿上衣","穿下衣","如厕","排便管理","排尿管理",
                "床椅转移","卫生间","浴池浴室","步行/轮椅","上下楼梯","视听理解","语言表达","社会往来",
                "解决问题","记忆能力"]
			}
        },
        created(){
            this.infoInit();
        },
		methods:{
            infoInit(){
                let data = {
                    elderId: this.elderId
                };
                axios
				.fetch('elderServer', "/elderNursing/all", data)
				.then(res => {
					if(res.data)  this.initAssemble(res.data);
				})
            },
            //组装初始化的数据
            initAssemble(data){
                let array = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                for(let i=0; i<this.smallCategory.length; i++){
                    for(let j=0; j<data.length; j++){
                        if(data[j].itemType==="功能性评估"){
                            if(this.smallCategory[i]===data[j].itemName){
                                array[i] = data[j].itemValue;
                            }
                        }
                    }
                }
                this.judge = array;
                this.judgeA = parseInt(this.judge[0]) + parseInt(this.judge[1]) + parseInt(this.judge[2]) +
                parseInt(this.judge[3]) + parseInt(this.judge[4]) + parseInt(this.judge[5]);
                this.judgeB = parseInt(this.judge[6]) + parseInt(this.judge[7]);
                this.judgeC = parseInt(this.judge[8]) + parseInt(this.judge[9]) + parseInt(this.judge[10]);
                this.judgeD = parseInt(this.judge[11]) + parseInt(this.judge[12]);
                this.judgeE = parseInt(this.judge[13]) + parseInt(this.judge[14]);
                this.judgeF = parseInt(this.judge[15]) + parseInt(this.judge[16]) + parseInt(this.judge[17]);
                this.judgeAll = parseInt(this.judgeA) + parseInt(this.judgeB) + parseInt(this.judgeC) +
                parseInt(this.judgeD) + parseInt(this.judgeE) + parseInt(this.judgeF);
            }
        }
    }
</script>

<style scoped>
    .tabelTitleStyle{
		color: #666666;
		font-size: 16px;
		background: #F3F3F3;
	}
	.trStyle{
		background: #F8F8F8;
    }
    .testStyle {
		color: #333;
		font-weight: bold;
    }
    .big-score {
        color: #333;
        font-size: 14px;
        font-weight: bolder;
    }
    .other-items {
        font-size: 16px;
        color: #666;
        font-weight: bolder;
    }
    .newScore table {
        width: 100%;
        color: #666;
        font-size: 16px;
    }
    .newScore table>tr:first-child>td:first-child {
        width: 10%;
    }
    .newScore table>tr:first-child>td:nth-child(2) {
        width: 5%;
    }
    .newScore table>tr:first-child>td:nth-child(3) {
        width: 10%;
    }
    .newScore table>tr:first-child>td:nth-child(4) {
        width: 12%;
    }
    .newScore table>tr:first-child>td:nth-child(5) {
        width: 13%;
    }
    .newScore table>tr:first-child>td:nth-child(6) {
        width: 15%;
    }
    .newScore table>tr:first-child>td:nth-child(7) {
        width: 30%;
    }
    .newScore table>tr>td {
        height: 55px;
        line-height: 55px;
        text-align: center;
        border: 1px solid #dcdfe6;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        padding: 0 20px;
    }
    .newScore table {
        width: 100%;
        color: #666;
        font-size: 16px;
    }
    #xuhaoPlain {
        line-height: 25px;
        text-align: left;
    }
    #xuhaoPlain h6, #xuhaoPlain p {
        margin: 10px 0;
        padding: 0;
    }
    #xuhaoPlain ul li {
        text-align: left;
        color: #999;
        font-size: 14px;
    }
</style>