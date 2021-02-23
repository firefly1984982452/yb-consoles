<template>
  <div>
    <el-form :inline="true" class="search">
      <el-row type="flex">
			<el-button  class="back-btn" @click="back()">返回</el-button>
        <el-col :span="12">
          <el-form-item label="老人姓名">
            <!-- <el-autocomplete
              class="inline-input"
              v-model="state1"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              @select="handleSelect"
              @input="changePeople(state1)"
              clearable
            ></el-autocomplete> -->
            <ub-elder v-model="elderId" @change='item => test(item)' :status="status" clearable></ub-elder>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12" class="right">
          <el-button
            class="button-yellow"
            icon="iconfont iconjichutubiao-biangengjilu"
            @click="changeRecord()"
            ><span style="margin-left:5px">变更记录</span></el-button
          >
        </el-col> -->
      </el-row>
    </el-form>
    <div class="content">
      <el-form label-width="100px">
        <table
          cellspacing="0"
          border="1"
          class="ub-table"
          :class="exchange == true ? 'table exchangeTable' : 'table'"
        >
          <tr>
            <td>变更事项</td>
            <td>变更前</td>
            <td>变更后</td>
          </tr>
          <tr>
            <td>房间床位</td>
            <td>
              <el-form-item label="房间床位" style="text-align:left;">{{
                roomBedData.lastDescription
              }}</el-form-item>
              <el-form-item label="托管费" style="text-align:left;"
                >{{ roomBedData.lastFee
                }}<span v-if="edit === true">元/月</span></el-form-item
              >
              <el-form-item label="计费日期" style="text-align:left;">{{
                roomBedData.lastStart
              }}</el-form-item>
            </td>
            <td>
              <!-- 如果不需要调换床位 -->
              <el-form-item
                label="房间床位"
                :style="{ width: exchange == true ? '50%' : '' }"
              >
                <el-row style="display:flex">
                  <el-col :span="10" style="margin-right:5px;">
                    <el-cascader
                      v-model="buildingFloor"
                      :props="{ checkStrictly: false }"
                      clearable
                      placeholder="楼层"
                      @change="changeBuilding"
                      :options="buildingOption"
                      change-on-select
                      :disabled="edit == false"
                    ></el-cascader>
                  </el-col>
                  <el-col :span="6" style="margin-right:5px;">
                    <el-select
                      v-model="roomId"
                      placeholder="房间"
                      @change="changeRoom"
                      :disabled="edit == false"
                      clearable
                    >
                      <el-option
                        v-for="item in roomOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="6">
                    <el-select
                      v-model="bedId"
                      placeholder="床位"
                      @change="changeBed"
                      :disabled="edit == false"
                      clearable
                    >
                      <el-option
                        v-for="item in bedOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        :disabled="item.disabled"
                      ></el-option>
                    </el-select>
                  </el-col>
                  <el-col v-if="edit" :span="2">
                    <el-tooltip class="item" effect="dark" content="复制房间床位" placement="right" style="cursor:pointer">
							        <!-- <el-button size="mini" @click="print(scope.row)" icon="el-icon-printer"></el-button> -->
                      <i class="iconfont iconjichutubiao-tonghujidizhi" @click="copyRoom" style="display: inline-block;"></i>
						        </el-tooltip>
                  </el-col>
                </el-row>
              </el-form-item>
              <!-- 如果需要与别人调换床位 -->
              <el-row>
                <el-col :span="12" v-if="exchange == true">
                  <el-form-item
                    :label="roomBedData.elderName"
                    class="elderData"
                    >{{ roomBedData.lastDescription }}</el-form-item
                  >
                  <el-form-item label="托管费">
                    <el-row>
                      <el-col :span="16" style="margin-right:5px;">
                        <el-input
                          v-model="roomBedData.lastFeeNew"
                          placeholder="请输入托管费"
                          clearable
                        ></el-input>
                      </el-col>
                      <el-col :span="5" class="unit"><span>元/月</span></el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item label="计费日期">
                    <el-row>
                      <el-col :span="16" style="margin-right:5px;">
                        <el-date-picker
                          v-model="roomBedData.lastStartNew"
                          type="date"
                          placeholder="请选择计费日期"
                          format="yyyy年MM月dd日"
                          value-format="yyyy-MM-dd"
                          clearable
                        ></el-date-picker>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
                <!-- 如果需要调换时是第二个人 -->
                <el-col
                  :span="12"
                  v-if="exchange == true"
                  :style="{ width: exchange == true ? '' : '100%' }"
                >
                  <el-form-item
                    :label="exchangeData.elderName"
                    class="elderData"
                    v-if="exchange == true"
                    >{{ exchangeData.lastDescription }}</el-form-item
                  >
                  <el-form-item label="托管费">
                    <el-row>
                      <el-col :span="16" style="margin-right:5px;">
                        <el-input
                          v-model="exchangeData.currentFeeNew"
                          placeholder="请输入托管费"
                          :disabled="edit == false"
                          clearable
                        ></el-input>
                      </el-col>
                      <el-col :span="5" class="unit"><span>元/月</span></el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item label="计费日期">
                    <el-row>
                      <el-col :span="16" style="margin-right:5px;">
                        <el-date-picker
                          v-model="exchangeData.currentStartNew"
                          type="date"
                          placeholder="请选择计费日期"
                          format="yyyy年MM月dd日"
                          value-format="yyyy-MM-dd"
                          :disabled="edit == false"
                          clearable
                        ></el-date-picker>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
                <!-- 如果不需要调换是直接显示 -->
                <el-col
                  :span="12"
                  v-else
                  :style="{ width: exchange == true ? '' : '100%' }"
                >
                  <el-form-item
                    :label="exchangeData.elderName"
                    class="elderData"
                    v-if="exchange == true"
                    >{{ exchangeData.lastDescription }}</el-form-item
                  >
                  <el-form-item label="托管费">
                    <el-row>
                      <el-col :span="16" style="margin-right:5px;">
                        <el-input
                          v-model="roomBedData.currentFee"
                          placeholder="请输入托管费"
                          :disabled="edit == false"
                          clearable
                        ></el-input>
                      </el-col>
                      <el-col :span="5" class="unit"><span>元/月</span></el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item label="计费日期">
                    <el-row>
                      <el-col :span="16" style="margin-right:5px;">
                        <el-date-picker
                          v-model="roomBedData.currentStart"
                          type="date"
                          placeholder="请选择计费日期"
                          format="yyyy年MM月dd日"
                          value-format="yyyy-MM-dd"
                          :disabled="edit == false"
                          clearable
                        ></el-date-picker>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
              </el-row>
            </td>
          </tr>
          <tr>
            <td>照护等级</td>
            <td>
              <el-form-item label="护理等级" style="text-align:left;">{{
                nurseData.lastDescription
              }}</el-form-item>
              <el-form-item label="护理费" style="text-align:left;"
                >{{ nurseData.lastFee
                }}<span v-if="edit === true">元/月</span></el-form-item
              >
              <el-form-item label="计费日期" style="text-align:left;">{{
                nurseData.lastStart
              }}</el-form-item>
            </td>
            <td :class="exchange == true ? 'exchangeStyle' : ''">
              <el-form-item label="护理等级">
                <el-row>
                  <el-col :span="16" style="margin-right:5px;">
                    <el-select
                      v-model="nurseData.currentValue"
                      placeholder="请选择护理等级"
                      :disabled="edit == false"
                      clearable
                      @clear="handleClear"
                    >
                      <el-option
                        v-for="item in levelOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="护理费">
                <el-row>
                  <el-col :span="16" style="margin-right:5px;">
                    <el-input
                      v-model="nurseData.currentFee"
                      placeholder="请输入护理费"
                      :disabled="edit == false"
                      clearable
                    ></el-input>
                  </el-col>
                  <el-col :span="5" class="unit">
                    <span>元/月</span>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="计费日期">
                <el-row>
                  <el-col :span="16" style="margin-right:5px;">
                    <el-date-picker
                      v-model="nurseData.currentStart"
                      type="date"
                      placeholder="请选择计费日期"
                      format="yyyy年MM月dd日"
                      value-format="yyyy-MM-dd"
                      :disabled="edit == false"
                      clearable
                    ></el-date-picker>
                  </el-col>
                </el-row>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>外出约定</td>
            <td>
              <el-form-item label="是否同意外出" class="agree">{{
                outAgreeData.lastDescription
              }}</el-form-item>
              <!-- <el-form-item label="" class="agree" v-if="edit===true">
								家属及老人承担外出期间发生意外或突发事件的全部责任
							</el-form-item> -->
            </td>
            <td>
              <!-- <el-form-item label="" class="agree">
								是否同意外出
							</el-form-item> -->
              <el-form-item label="是否同意外出" class="agree">
                <el-radio-group
                  v-model="outAgreeData.currentValue"
                  :disabled="edit == false"
                >
                  <el-radio
                    v-for="(item, index) in radiosOutAgreeList"
                    :key="index"
                    :label="item.label"
                    >{{ item.value }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>发药约定</td>
            <td>
              <el-form-item label="是否同意发药" class="agree">{{
                medicineAgree.lastDescription
              }}</el-form-item>
              <el-form-item label="" class="agree" v-if="edit === true">
                委托院方为老人外出就医配药按医嘱发放
              </el-form-item>
            </td>
            <td>
              <el-form-item label="是否同意发药" class="agree">
                <el-radio-group
                  style="width:100%"
                  v-model="medicineAgree.currentValue"
                  :disabled="edit == false"
                >
                  <el-radio
                    style="width:30%"
                    v-for="(item, index) in radios"
                    :key="index"
                    :label="item.label"
                    >{{ item.value }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <el-form-item label="" class="agree">
                委托院方为老人外出就医配药按医嘱发放
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>特殊防护</td>
            <td>
              <el-form-item label="安全风险" class="agree">{{
                specialProtect.lastRisk
              }}</el-form-item>
              <el-form-item label="安全措施" class="agree">{{
                specialProtect.lastProtected
              }}</el-form-item>
            </td>
            <td class="specialProtect">
              <el-form-item label="安全风险" class="agree">
                <el-radio-group v-model="securityRisk" @change="noRisk">
                  <el-radio
                    style="width:30%"
                    v-for="(item, index) in risks"
                    :key="index"
                    :label="item"
                    >{{ item }}</el-radio
                  >
                </el-radio-group>
                <el-input
                  v-model="otherRisk"
                  class="input_width"
                  :disabled="securityRisk != '其他'"
                ></el-input>
              </el-form-item>
              <el-form-item label="安全措施" class="agree">
                <el-checkbox-group
                  v-model="securityProtected"
                  :disabled="securityRisk === '无'"
                >
                  <el-checkbox
                    v-for="(item, index) in measures"
                    :key="index"
                    :label="item"
                    >{{ item }}</el-checkbox
                  >
                </el-checkbox-group>
                <el-input
                  v-model="otherProtected"
                  class="input_width"
                  :disabled="securityProtected.includes('其他') == false"
                ></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>

        <div class="buttons" v-if="edit === true">
          <el-button type="primary" @click="change()">变更</el-button>
          <el-button @click="cancel()">取消</el-button>
        </div>
      </el-form>
    </div>
    <!-- 变更确认 -->
    <el-dialog
      center
      title="变更确认"
      :visible.sync="dialogChangeVisible"
      id="changeDialog"
      width="800px"
    >
      <el-form label-width="100px">
        <h4>{{ roomBedData.currentDescription }} {{ elderName }}</h4>
        <table
          cellspacing="0"
          border="1"
          style="width: 100%;border:1px solid #DCDFE6;"
        >
          <tr>
            <td>变更事项</td>
            <td>变更前</td>
            <td>变更后</td>
          </tr>
          <tr>
            <td>房间床位</td>
            <td>
              <el-form-item label="房间床位">
                <span>{{ roomBedData.lastDescription }}</span>
              </el-form-item>
              <el-form-item label="托管费">
                <span>{{ roomBedData.lastFee }}</span
                >元/月
              </el-form-item>
              <el-form-item label="计费日期">
                <span>{{ roomBedData.lastStart }}</span>
              </el-form-item>
            </td>
            <!-- 如果调换了床位 -->
            <td v-if="exchange == true">
              <el-form-item label="房间床位">
                <span>{{ roomBedData.lastDescription }}</span>
              </el-form-item>
              <el-form-item label="托管费">
                <span v-if="roomBedData.lastFeeNew == 0" style="color:#f00;">{{
                  roomBedData.lastFeeNew
                }}</span>
                <span v-else>{{ roomBedData.lastFeeNew }}</span>
                <span v-if="roomBedData.lastFeeNew">元/月</span>
              </el-form-item>
              <el-form-item label="计费日期">
                <span>{{ roomBedData.lastStartNew }}</span>
              </el-form-item>
            </td>
            <!-- 如果选择了空床 -->
            <td v-else>
              <el-form-item label="房间床位">
                <span>{{ roomBedData.currentDescription }}</span>
              </el-form-item>
              <!-- <el-form-item label="房间床位" v-else>
                <span>{{ roomBedData.lastDescription }}</span>
              </el-form-item> -->
              <el-form-item label="托管费">
                <span v-if="roomBedData.currentFee == 0" style="color:#f00;">{{
                  roomBedData.currentFee
                }}</span>
                <span v-else>{{ roomBedData.currentFee }}</span>
                <span v-if="roomBedData.currentFee">元/月</span>
              </el-form-item>
              <el-form-item label="计费日期">
                <span>{{ roomBedData.currentStart }}</span>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>照护等级</td>
            <td>
              <el-form-item label="护理等级">{{
                nurseData.lastDescription
              }}</el-form-item>
              <el-form-item label="护理费"
                >{{ nurseData.lastFee }}元/月</el-form-item
              >
              <el-form-item label="计费日期">{{
                nurseData.lastStart
              }}</el-form-item>
            </td>
            <td>
              <el-form-item label="护理等级">{{
                nurseData.currentDescription
              }}</el-form-item>
              <el-form-item label="护理费" v-if="nurseData.currentFee == 0"
                ><span style="color:#f00;">{{ nurseData.currentFee }}</span
                ><span v-if="nurseData.currentFee">元/月</span></el-form-item
              >
              <el-form-item label="护理费" v-else
                ><span>{{ nurseData.currentFee }}</span
                ><span v-if="nurseData.currentFee">元/月</span></el-form-item
              >
              <el-form-item label="计费日期">{{
                nurseData.currentStart
              }}</el-form-item>
            </td>
          </tr>
          <tr>
            <td>外出约定</td>
            <td
              :style="{
                color: outAgreeData.lastValue === 1 ? '#2FC07A' : '#EB6969'
              }"
            >
              <span v-if="outAgreeData.lastValue != null"
                >{{ outAgreeData.lastDescription }}外出</span
              >
            </td>
            <td
              :style="{
                color: outAgreeData.currentValue === 1 ? '#2FC07A' : '#EB6969'
              }"
            >
              <span v-if="outAgreeData.currentValue != null"
                >{{ outAgreeData.currentDescription }}外出</span
              >
            </td>
          </tr>
          <tr>
            <td>发药约定</td>
            <td
              :style="{
                color: medicineAgree.lastValue === 1 ? '#2FC07A' : '#EB6969'
              }"
            >
              <span v-if="medicineAgree.lastValue != null"
                >{{ medicineAgree.lastDescription }}发药</span
              >
            </td>
            <td
              :style="{
                color: medicineAgree.currentValue === 1 ? '#2FC07A' : '#EB6969'
              }"
            >
              <span v-if="medicineAgree.currentValue != null"
                >{{ medicineAgree.currentDescription }}发药</span
              >
            </td>
          </tr>
          <tr>
            <td>特殊防护</td>
            <td>
              <el-form-item label="安全风险" class="agree">{{
                specialProtect.lastRisk
              }}</el-form-item>
              <el-form-item label="安全措施" class="agree">{{
                specialProtect.lastProtected
              }}</el-form-item>
            </td>
            <td>
              <el-form-item label="安全风险" class="agree">{{
                specialProtect.currentRisk
              }}</el-form-item>
              <el-form-item label="安全措施" class="agree">{{
                specialProtect.currentProtected
              }}</el-form-item>
            </td>
          </tr>
        </table>

        <div class="buttons">
          <el-button type="primary" @click="confirm()">确定</el-button>
          <el-button @click="modify()">修改</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import qs from "qs";
import ubElder from "@/components/elder";
export default {
  data() {
    return {
      status:[100],
      loading: false,
      state1: "",
      elderData: [],
      input: "",
      elderId: "",
      elderName: "",
      edit: false,
      exchange: false, //是否有交换床位
      exchangeElderName: "",
      buildingOption: [],
      roomOption: [],
      bedOption: [],
      buildingFloor: [],
      levelOption: [],
      roomBedData: {},
      nurseData: {},
      outAgreeData: {},
      medicineAgree: {},
      specialProtect: {},
      exchangeData: {},
      saveData: [], //变更后数据
      buildingName: "", //变更后楼宇
      roomId: "", //变更后房间Id
      roomName: "", //变更后房间名
      bedId: "", //变更后房间Id
      bedName: "", //变更后房间名
      securityRisk: "",
      securityProtected: [],
      otherRisk: "",
      otherProtected: "",
      risks: ["无", "摔跤骨折或造成意外甚至生命危险", "其他"],
      measures: ["保护袋", "手套", "安睡宝", "其他"],
      radios: [
        {
          value: "不同意",
          label: 0
        },
        {
          value: "同意",
          label: 1
        }
      ],
      radiosOutAgreeList: [
        {
          value: "不同意（老人不能自主决定离院外出）",
          label: 0
        },
        {
          value: "同意 （家属及老人承担外出期间发生意外或突发事件的全部责任）",
          label: 1
        }
      ],
      dialogChangeVisible: false,
      elderIdInfo: {},
      lastBuildId:'',
      lastBuildName:'',
      lastFloor:'',
      lastRoomId:'',
      lastRoomName:'',
      lastBedId:'',
      lastBedName:'',
      // radio: 1
    };
  },
  watch: { 
    elderId(value){
      if(value){
        let data = {
          elderId: value,
          isCurrent: 1
        };
        let that = this;
        axios.fetch("elderServer", "/elderChange/list", data).then(res => {
          let resData = res.data;
          this.edit = true;
          this.elderName = res.data[0].elderName;
          this.lastBuildId = res.data[0].buildingId;
          this.lastBuildName = res.data[0].buildingName;
          this.lastFloor = res.data[0].floor;
          this.lastRoomId = res.data[0].roomId;
          this.lastRoomName = res.data[0].roomName;
          this.lastBedId = res.data[0].bedId;
          this.lastBedName = res.data[0].bedName;
          this.assembleSelectData(resData);
        });
      } else {
        this.roomBedData = {};
        this.nurseData = {};
        this.outAgreeData = {};
        this.medicineAgree = {};
        this.specialProtect = {};
        this.exchangeData = {};
        this.edit = false;
        this.buildingFloor = [];
        this.roomId = "";
        this.bedId = "";
        this.securityRisk = "";
        this.securityProtected = [];
        this.exchange = false;
        this.exchangeData = {};
      }
    },
    securityRisk(newValue, oldValue) {
      // console.log(newValue);
      if(newValue.includes('无')){
        this.securityProtected = [];
        this.otherRisk = '';
      }
      if(!newValue.includes('其他')){
        this.otherRisk = '';
      }
    },
    securityProtected(val){
      if(!val.includes('其他')){
        this.otherProtected = '';
      }
    }
  },
  components: {ubElder},
  created() {
    this.loadAll();
    this.initBuilding();
    this.initLevelOption("院方护理等级");
  },
  methods: {
    test(item){
      console.log(item);
      this.elderId = item.elderId;
      this.elderIdInfo = Object.assign({},this.elderIdInfo,item);
      this.roomOption = [];
      this.bedOption = [];
      this.buildingId = '';
      this.buildingName = '';
      this.floor = '';
      this.buildingFloor = [];
      this.roomId = '';
      this.roomName = '';
      this.bedId = '';
      this.bedName = '';
      this.roomBedData.currentDescription = '';
    },
    // verify  验证是否为undefined或null或''
    verify(param) {
      return param !== undefined && param !== null && param !== '';
    },
    //浅拷贝
    shallowCopy(obj) {
      var newobj = {};
      for (var attr in obj) {
        newobj[attr] = obj[attr];
      }
      return newobj;
    },
    //初始化护理等级
    initLevelOption(parentNos) {
      let data = {
        parentNos: parentNos
      };
      let that = this;
      axios
        .fetch("commonServer", "/dict/getItemViewsByParentNo", data)
        .then(res => {
          that.levelOption = res.data.map(item => {
            return {
              label: item.title,
              value: parseInt(item.itemValue)
            };
          });
        });
    },
    //楼宇 楼层 房间 床位控件
    initBuilding() {
      let that = this;
      axios.fetch("oaServer", "/org/building/list").then(res => {
        let opt = [];
        let building = res.data;
        building.forEach(item => {
          let subOpt = {};
          subOpt.value = item.buildingId;
          subOpt.label = item.buildingName;
          let floor = parseInt(item.floors);
          if (typeof floor == "number") {
            let children = [];
            for (let i = 0; i < floor; i++) {
              let sub = {};
              sub.value = i + 1;
              sub.label = i + 1 + "层";
              children.push(sub);
            }
            subOpt.children = children;
          }
          opt.push(subOpt);
        });
        that.buildingOption = opt;
      });
    },
    changeBuilding(value) {
      console.log(value);
      this.roomId = "";
      this.roomName = "";
      this.roomOption = [];
      this.bedOption = [];
      this.bedId = "";
      this.bedName = "";
      this.roomBedData.currentValue = "";
      this.roomBedData.currentDescription = "";
      this.exchange = false;
      this.exchangeData = {};
      for (var i = 0; i < this.buildingOption.length; i++) {
        if (value[0] == this.buildingOption[i].value) {
          this.buildingName = this.buildingOption[i].label;
        }
      }
      let data = {
        buildingId: value[0],
        floor: value[1],
        pageSize: 1000
      };
      axios.fetch("oaServer", "/org/room/list", data).then(res => {
        this.roomOption = res.data.map(item => {
          return {
            label: item.roomName,
            value: item.roomId
          };
        });
      });
    },
    changeRoom(id) {
      this.bedOption = [];
      this.bedId = "";
      this.bedName = "";
      this.roomBedData.currentValue = "";
      this.roomBedData.currentDescription = "";
      this.exchange = false;
      this.exchangeData = {};
      for (var i = 0; i < this.roomOption.length; i++) {
        if (id == this.roomOption[i].value) {
          this.roomName = this.roomOption[i].label;
        }
      }
      let that = this;
      let data = {
        roomId: id
      };
      axios.fetch("oaServer", "/org/bed/list", data).then(res => {
        that.bedOption = res.data.map(item => {
          let disabledOption = false;
          let lastDescription =
            that.buildingName + "-" + that.roomName + "-" + item.bedName;
          if (lastDescription == that.roomBedData.lastDescription) {
            disabledOption = true;
          }
          let statusName = ["未知", "空闲", "预定", "入住", "占有"][
            item.status
          ];
          return {
            label: item.bedName + statusName,
            value: item.bedId,
            disabled: disabledOption
          };
        });
      });
    },
    changeBed(id) {
      this.roomBedData.currentValue = "";
      this.roomBedData.currentDescription = "";
      this.exchange = false;
      this.exchangeData = {};
      this.roomBedData.currentValue = id;
      for (var i = 0; i < this.bedOption.length; i++) {
        if (id == this.bedOption[i].value) {
          const stauts = this.bedOption[i].label.slice(this.bedOption[i].label.length-2)
          console.log(stauts,'===========');
          
          if(stauts !== "空闲" ){
            let data = {
              bedId: id
            };
            axios.fetch("elderServer", "/elderChange/bed", data).then(res => {
              // console.log(res.data);
              // console.log(this.elderId);
              if (res.data && res.data.exchangeElderId != null && res.data.exchangeElderId !== this.elderId) {
                this.exchange = true;
                let resData = res.data;
                this.assembleExchangeData(resData);
              }
            });
          }
          
          this.bedName = this.bedOption[i].label.slice(0,this.bedOption[i].label.length-2);
          this.roomBedData.currentDescription =
            this.buildingName + "-" + this.roomName + "-" + this.bedName;
        }
      }
    },
    assembleExchangeData(resData) {
      let lastDescription =
        resData.exchangeBuildingName +
        "-" +
        "-" +
        resData.exchangeRoomName +
        "-" +
        resData.exchangeBedName;
      this.exchangeData = {
        elderId: resData.exchangeElderId,
        elderName: resData.exchangeElderName,
        category: 1,
        operateType: 0,
        lastValue: resData.exchangeBedId,
        lastDescription: lastDescription,
        lastFee: resData.exchangeBedFee,
        lastStart: resData.exchangeBedDate,
        currentValue: this.roomBedData.lastValue,
        currentDescription: this.roomBedData.lastDescription,
        currentFee: this.roomBedData.lastFee,
        currentStart: this.roomBedData.lastStart,
        isCurrent: true
      };
    },
    //联想输入法的相关函数
    querySearch(queryString, cb) {
      this.elderData = [];
      if (queryString !== "") {
        this.loading = true;
        let data = {
          status: 100,
          elderName: queryString
        };
        axios.fetch("elderServer", "/elderInfo/all", data).then(res => {
          this.loading = false;
          if (res.data.length == 0) {
            return this.$message.error("搜索不到用户");
          }
          for (let i = 0; i < res.data.length; i++) {
            let elderOptionItem = {
              value: res.data[i].elderName + " " + res.data[i].roomName,
              elderId: res.data[i].elderId
            };
            this.elderData.push(elderOptionItem);
          }
        });
      }
      var elderData = this.elderData;
      // var results = queryString ? elderData.filter(this.createFilter(queryString)) : elderData;
      // 调用 callback 返回建议列表的数据
      cb(elderData);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    loadAll() {
      let data = {
        status: 100
      };
      axios.fetch("elderServer", "/elderInfo/all", data).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          let elderDataItem = {
            value:
              res.data[i].elderName +
              " " +
              res.data[i].roomName +
              "-" +
              res.data[i].bedName,
            elderId: res.data[i].elderId
          };
          this.elderData.push(elderDataItem);
        }
      });
    },
    handleSelect(item) {
      this.elderName = item.value.split(" ")[0];
      this.elderId = item.elderId;
      let data = {
        elderId: item.elderId,
        isCurrent: 1
      };
      let that = this;
      axios.fetch("elderServer", "/elderChange/list", data).then(res => {
        let resData = res.data;
        this.edit = true;
        this.assembleSelectData(resData);
      });
    },
    //组装选中老人后的数据
    assembleSelectData(resData) {
      resData.map(item => {
        item.lastValue = item.currentValue;
        item.lastDescription = item.currentDescription;
        item.lastFee = item.currentFee;
        item.lastStart =
          item.currentStart == null ? "" : item.currentStart.split(" ")[0];
        item.currentValue = null;
        item.currentDescription = null;
        item.currentFee = null;
        item.currentStart = null;
        item.operateType = 0;
        item.isCurrent = true;
        let keys = [
          "changeId",
          "remark",
          "creator",
          "createTime",
          "updateTime"
        ];
        item = this.delObjKeys(item, keys);
      });
      this.roomBedData = resData.filter(item => {
        return (
          (item.category === 0 || item.category === 1) && item.isCurrent == true
        );
      })[0];
      this.nurseData = resData.filter(item => {
        return item.category === 2 && item.isCurrent == true;
      })[0];
      this.outAgreeData = resData.filter(item => {
        return item.category === 3 && item.isCurrent == true;
      })[0];
      this.medicineAgree = resData.filter(item => {
        return item.category === 4 && item.isCurrent == true;
      })[0];
      this.specialProtect = resData.filter(item => {
        return item.category === 6 && item.isCurrent == true;
      })[0];
      //处理特殊防护的数据
      let arr = this.specialProtect.lastDescription.split(",");
      this.specialProtect.lastRisk = arr[0];
      this.specialProtect.lastProtected = arr
        .splice(1, arr.length - 1)
        .join(",");
      //直接把值带过去
      this.outAgreeData.currentValue = this.outAgreeData.lastValue;
      this.medicineAgree.currentValue = this.medicineAgree.lastValue;
    },
    //删除一个对象中的多个属性
    delObjKeys(obj, keys) {
      keys.map(function(key) {
        delete obj[key];
      });
      return obj;
    },
    //组装特殊防护需要保存的数据
    assembleSpecialData() {
      let securityRisk =
        this.securityRisk === "其他" ? this.otherRisk : this.securityRisk;
      let securityProtected = [].concat(this.securityProtected);
      let protectedIndex = securityProtected.findIndex(
        value => value == "其他"
      );
      if (protectedIndex !== -1) {
        securityProtected.splice(protectedIndex, 1, this.otherProtected);
      }
      securityProtected =
        securityProtected.length > 0 ? securityProtected.join(",") : "";
      let data = {
        securityRisk: securityRisk,
        securityProtected: securityProtected
      };
      return data;
    },
    // 改变老人或清除当前老人信息
    changePeople(val) {
      if (val.length == 0) {
        this.roomBedData = {};
        this.nurseData = {};
        this.outAgreeData = {};
        this.medicineAgree = {};
        this.specialProtect = {};
        this.exchangeData = {};
        this.edit = false;
        this.buildingFloor = [];
        this.roomId = "";
        this.bedId = "";
        this.securityRisk = "";
        this.securityProtected = [];
        this.exchange = false;
        this.exchangeData = {};
      }
    },
    //弹出变更弹框
    change() {
      // if (!this.roomId) {
      //   this.$message.error("请选择房间床位");
      //   return;
      // }
      // 床位信息 全空或者全填
      /**
       * 1.只要一个有值 其他任意一个为空都要提醒
       * 
       */
      // 需要换房间
      if (this.exchange == true) {
        if ( this.verify(this.roomId) || 
        this.verify(this.bedId) || 
        this.buildingFloor.length>0 || 
        this.verify(this.roomBedData.lastFeeNew) || 
        this.verify(this.exchangeData.currentFeeNew) || 
        this.verify(this.roomBedData.lastStartNew) || 
        this.verify(this.exchangeData.currentStartNew) ) {
          if (
            !this.verify(this.roomBedData.lastFeeNew) ||
            !this.verify(this.exchangeData.currentFeeNew)
          ) {
            this.$message.error("请输入托管费");
            return;
          }
          if (
            this.roomBedData.lastStartNew == undefined ||
            this.exchangeData.currentStartNew == undefined
          ) {
            this.$message.error("请选择计费日期");
            return;
          }
        }
      } else {
        // console.log(this.verify(this.roomId),this.bedId,this.buildingFloor,this.verify(this.roomBedData.currentFee),this.verify(this.roomBedData.currentStart));
        console.log(this.verify(this.bedId));
        // 不需要换房间
        if(this.verify(this.roomId) || this.buildingFloor.length>0 || this.verify(this.bedId) || this.verify(this.roomBedData.currentFee) || this.verify(this.roomBedData.currentStart)){
          if (!this.verify(this.bedId)){
            this.$message.error("请选择房间床位");
            return;
          }
          if (!this.verify(this.roomBedData.currentFee)) {
            this.$message.error("请输入托管费");
            return;
          }  
          if (!this.verify(this.roomBedData.currentStart)) {
            this.$message.error("请选择计费日期");
            return;
          }
        }
      }
      // 照护等级 全空或者全填
      if (
        this.verify(this.nurseData.currentValue) ||
        this.verify(this.nurseData.currentValue) ||
        this.verify(this.nurseData.currentValue)
      ) {
        if(!this.verify(this.nurseData.currentValue)){
          this.$message.error("请选择护理等级");
          return;
        } else if (!this.verify(this.nurseData.currentFee)) {
          this.$message.error("请输入护理费");
          return;
        } else if (!this.verify(this.nurseData.currentStart)) {
          this.$message.error("请选择计费日期");
          return;
        }
      } 
      // 特殊防护 全空或者全填
      if( this.verify(this.securityRisk)){
        if (!this.verify(this.securityRisk)) {
            this.$message.error("请选择安全风险");
            return;
          } else if (this.securityRisk == "其他" && !this.verify(this.otherRisk)) {
            this.$message.error("请补充完整其他安全风险");
            return;
          } else if (this.securityRisk !== "无") {
            if (this.securityProtected.includes("其他")) {
              if (!this.otherProtected) {
                this.$message.error("请补充完整安全措施");
                return;
              }
            } else if (
              !this.verify(this.securityProtected) ||
              this.securityProtected.length == 0
            ) {
              this.$message.error("请选择安全措施");
              return;
            }
          }
      }
      
      
      if (this.nurseData.currentValue) {
        //提取照护评估的currentDescription
        this.levelOption.map(item => {
          if (item.value == this.nurseData.currentValue)
            this.nurseData.currentDescription = item.label;
        });
      }
      if (this.outAgreeData.currentValue != null) {
        //提取约定外出的currentDescription
        this.radios.map(item => {
          if (item.label == this.outAgreeData.currentValue)
            this.outAgreeData.currentDescription = item.value;
        });
      }
      if (this.medicineAgree.currentValue != null) {
        //提取约定发药的currentDescription
        this.radios.map(item => {
          if (item.label == this.medicineAgree.currentValue)
            this.medicineAgree.currentDescription = item.value;
        });
      }
      if (this.securityRisk != "") {
        //提取特殊防护的currentDescription
        let data = this.assembleSpecialData();
        this.specialProtect.currentRisk = data.securityRisk;
        this.specialProtect.currentProtected = data.securityProtected;
        if(data.securityProtected){
          this.specialProtect.currentDescription =
            data.securityRisk + "," + data.securityProtected;
        } else {
          this.specialProtect.currentDescription = data.securityRisk;
        }
      }
      this.dialogChangeVisible = true;
      console.log(this.dialogChangeVisible);
    },
    //取消变更
    cancel() {
      // var that = this;
      // Object.keys(that.afterData).forEach(key => that.afterData[key] = "");
      // this.edit = true;
      this.elderId = "";
      this.changePeople(this.state1);
    },
    //组装需要保存的数据
    assembleSaveData() {
      console.log(
        "start",
        this.roomBedData,
        this.nurseData,
        this.outAgreeData,
        this.medicineAgree,
        this.exchangeData
      );
      let saveData = [];
      if (
        this.roomBedData.currentValue !== null &&
        this.roomBedData.currentValue.length !== 0
      ){
        this.roomBedData.operatorSign = null;
        this.roomBedData.guarantorSign = null;
        this.roomBedData.currentEnd = null;
        saveData.push(this.roomBedData);
      }
      if (
        this.nurseData.currentValue !== null &&
        this.nurseData.currentValue.length !== 0
      ) {

        this.nurseData.currentEnd = null;
        saveData.push(this.nurseData);
      }
      if (
        this.outAgreeData.currentValue !== null &&
        this.outAgreeData.currentValue.length !== 0 &&
        this.outAgreeData.currentValue != this.outAgreeData.lastValue
      )
        saveData.push(this.outAgreeData);
      if (
        this.medicineAgree.currentValue !== null &&
        this.medicineAgree.currentValue.length !== 0 &&
        this.medicineAgree.currentValue != this.medicineAgree.lastValue
      )
        saveData.push(this.medicineAgree);
      if (
        this.exchangeData.currentValue !== undefined &&
        this.exchangeData.currentValue.length !== 0
      ) {
        this.roomBedData.category = 1;
        saveData.push(this.exchangeData);
      } else {
        this.roomBedData.category = 0;
      }
      if (
        this.specialProtect.currentDescription !== null &&
        this.specialProtect.currentDescription.length !== 0
      ) {
        let keys = [
          "lastRisk",
          "lastProtected",
          "currentRisk",
          "currentProtected"
        ];
        this.specialProtect = this.delObjKeys(this.specialProtect, keys);
        this.specialProtect.currentValue = 0;
        this.specialProtect.currentFee = 0;
        saveData.push(this.specialProtect);
      }
      if (this.exchange == true) {
        saveData[0].currentFee = saveData[0].lastFeeNew;
        saveData[0].currentStart = saveData[0].lastStartNew;
        saveData[1].currentFee = this.exchangeData.currentFeeNew;
        saveData[1].currentStart = this.exchangeData.currentStartNew;
      }
      return saveData;
    },
    //弹框的确认和取消
    confirm() {
      this.saveData = this.assembleSaveData();
      let that = this;
      axios
        .fetch("elderServer", "/elderChange/edit", this.saveData, "json")
        .then(res => {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          this.dialogChangeVisible = false;
          // setTimeout(() => {this.$router.go(0);}, 1000);//手动刷新页面
          if (this.nurseData.currentDescription) {
            this.$router.push({
              path: "/elder/changeService",
              query: {
                change: true,
                elderId: this.elderId,
                nursingLevel: this.nurseData.currentValue,
                type: "submitElderService"
              }
            });
          }
        });
    },
    modify() {
      this.dialogChangeVisible = false;
    },
    handleClear(){
      this.nurseData.currentDescription = '';
    },
    //变更记录
    changeRecord() {
      this.$router.push({
        path: "/elder/changeList"
      });
    },
			back(){
				// this.$store.state.submitElderServiceSuccess = false;
				this.$router.push({
					path: "/elder/change"
				});
      },
      copyRoom(){
        this.buildingId = this.lastBuildId;
        this.buildingName = this.lastBuildName;
        this.floor = this.lastFloor;
        this.buildingFloor = [this.buildingId,this.floor];
        this.changeBuilding(this.buildingFloor);
        this.roomId = this.lastRoomId;
        this.roomName = this.lastRoomName;
        this.changeRoom(this.roomId);
        this.bedId = this.lastBedId;
        this.bedName = this.lastBedName;
        this.changeBed(this.bedId);
        this.roomBedData.currentDescription =
            this.buildingName + "-" + this.roomName + "-" + this.bedName;
      }
  }
};
</script>
<style scoped>
.input_width {
  width: 16em;
}
.specialProtect >>> .el-radio-group .el-radio:first-child {
  margin-top: 12px;
}
.specialProtect >>> .el-radio-group .el-radio:last-child {
  display: block;
  line-height: 40px;
}
.specialProtect >>> .el-checkbox-group .el-checkbox:last-child {
  display: block;
  line-height: 20px;
}
.specialProtect >>> .el-form-item:nth-child(1) .el-input {
  position: absolute;
  left: 5em;
  top: 3em;
}
.specialProtect >>> .el-form-item:nth-child(2) .el-input {
  position: absolute;
  left: 5em;
  top: 2.5em;
}
.buttons {
  text-align: center;
  padding: 20px;
}
.table {
  width: 100%;
  border: 1px solid #dcdfe6;
}
#userList .el-pagination {
  margin-top: 20px;
  float: right;
  position: relative;
  right: 130px;
}
#userList .el-pagination__editor.el-input {
  width: 50px;
}
#staffTableStyle {
  background: transparent;
  width: 95%;
  transform: translateX(-50%);
  position: relative;
  left: 50%;
}
#longNurseRisk >>> .el-radio {
  margin-bottom: 15px;
  width: 8em;
}
#editDialog >>> .el-form-item,
#newDialog >>> .el-form-item {
  margin-bottom: 0;
}
#editDialog >>> .el-form-item__content,
#newDialog >>> .el-form-item__content {
  color: #333;
  font-weight: 500;
}
.grade_style >>> .el-form-item__label {
  position: relative;
  top: -12px;
}
.dialog_btn_group {
  text-align: center;
  margin: 30px 0;
}
.dialog_btn_group >>> .el-form-item__content {
  margin-left: 10em !important;
}

/* 新的样式 */
.button-yellow {
  background-color: #f49b31;
}
table td {
  text-align: center;
  color: #666666;
  font-size: 16px;
}
table tr:first-child {
  background-color: #f3f3f3;
  color: #555555;
  font-weight: 600;
  font-size: 16px;
}
table td:first-child {
  width: 16%;
}
table td:nth-child(2) {
  width: 42%;
}
table td:nth-child(2),
table td:nth-child(3) {
  padding: 1% 8%;
}
.exchangeTable td:nth-child(2) {
  width: 30%;
}
.exchangeTable td:nth-child(2),
.exchangeTable td:nth-child(3) {
  padding: 1% 2%;
}
.agree {
  margin-bottom: 0;
}
.agree .el-radio:nth-child(1) {
  margin: 10px 0 20px 0;
}
.agree >>> .el-form-item__content {
  text-align: left;
  color: #999;
  font-size: 14px;
}
.unit {
  text-align: left;
  margin-left: 8px;
}
#changeDialog h4 {
  margin-bottom: 15px;
  font-size: 16px;
  color: #333;
}
#changeDialog >>> .el-dialog__body {
  padding: 20px;
}
#changeDialog table td:nth-child(2),
#changeDialog table td:nth-child(3) {
  padding: 2% 1%;
}
#changeDialog >>> .el-form-item {
  margin-bottom: 0;
}
#changeDialog >>> .el-form-item__content {
  text-align: left;
  font-size: 15px;
  color: #333;
}
/* 交换床位的表格样式 */
.elderData >>> .el-form-item__label {
  width: 100px;
  font-size: 18px;
  color: #333333;
  font-weight: bold;
}
.elderData >>> .el-form-item__content {
  text-align: left;
}
.exchangeStyle .el-form-item {
  width: 50%;
}
.el-select,
.el-date-editor {
  width: 100%;
}
</style>
