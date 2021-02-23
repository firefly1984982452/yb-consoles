<template>
  <div>
    <el-form :inline="true" class="search">
      <el-row>
        <el-col :span="20">

          <!-- <el-form-item label="楼层房间">
            <el-select placeholder="请选择楼宇" clearable v-model="buildSelect" size="mini" @change="changeBuild">
              <el-option :label="item.buildingName" :key="item.buildingName" v-for="item in buildingOption" :value="item.buildingId">{{item.buildingName}}</el-option>
            </el-select>
            <el-select placeholder="请选择楼层" clearable v-model="fllorSelect" size="mini" @change="changefloor">
              <el-option v-for="item in floorsOption" :label="(item+1)+'层'" :value="(item+1)" :key="item">{{(item+1)+'层'}}</el-option>
            </el-select>
            <el-select placeholder="请选择房号" clearable size="mini" v-model="roomSelect">
              <el-option :value="item.roomId" v-for="item in roomsOption" :label="item.roomName" :key="item.roomId">{{item.roomName}}</el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="单据状态" label-width="90px">
            <el-select clearable v-model="billStatus" placeholder="请选择">
              <el-option v-for="item in billStatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="长护险等级" label-width="90px">
            <el-select clearable v-model="level" placeholder="请选择">
              <el-option v-for="item in levels" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区域">
            <Area ref="areaCom" @currentArea="getArea" :area="setArea" />
          </el-form-item>
          <el-form-item label="姓名/入院编号">
            <el-input placeholder="请输入姓名/入院编号" v-model="elderName" clearable>
              <!-- <el-button slot="append" @click="querydata" icon="el-icon-search"></el-button> -->
            </el-input>
          </el-form-item>

          <el-button type="primary" icon="el-icon-search" @click="querydata">查询</el-button>
          <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
        </el-col>
        <!-- <div :span="4" @click="show3 = !show3" class="right">
          <span class="btniconfont iconfont iconjichutubiao-shaixuan" :class="show3 ? 'yellow' : 'block'">
            <span :class="show3 ? 'yellow' : 'block'" style="margin-left:8px;">高级筛选</span>
            <i :class="[ show3 ? 'el-icon-arrow-up' : 'el-icon-arrow-down', show3 ? 'yellow' : 'block']"></i>
          </span>
        </div> -->
      </el-row>

      <!-- <el-collapse-transition>
        <el-row v-show="show3" style="margin-top: 10px;">
          <el-form-item label="状态">
            <el-select v-model="roomType" clearable placeholder="请选择">
              <el-option label="待审核" value="0"></el-option>
              <el-option label="已审核" value="1"></el-option>
              <el-option label="待拉卡" value="2"></el-option>
              <el-option label="已作废" value="-1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="护理周期">
            <el-date-picker v-model="month" type="month" value-format="yyyy-MM" placeholder="选择月">
            </el-date-picker>
          </el-form-item>
        </el-row>
      </el-collapse-transition> -->
    </el-form>
    <div class="content">
      <el-row type="flex" class="pannel">
        <el-col class="left">
          <b>长护险护理周期结算</b>
          <span v-if="isOpened">
            <i class="el-icon-warning"></i>
            已对接长护险结算系统，最终结算结果以长护险结算系统返回数据为准
          </span>
        </el-col>
        <el-col class="right">
          <el-button class="button-purple" style="background-color:#2368D3;" icon="el-icon-plus" @click="addMulit">批量生成</el-button>
          <el-button type="success" icon="el-icon-plus" @click="addOneCon">单个添加</el-button>
        </el-col>
      </el-row>
      <el-table :data="data" border :header-cell-style="{background:'#F3F3F5'}" class="ub-table" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName">
        <el-table-column type="selection" width="55" :selectable="checkSelectable"></el-table-column>
        <el-table-column prop="subsidyNo" label="编号" align="center" min-width="120"></el-table-column>
        <el-table-column prop="elderName" label="姓名" align="center" min-width="120">
          <template slot-scope="scope">
            {{ scope.row.elderName }}<br/>
            <el-tag v-if="scope.row.remark">{{ scope.row.remark }}</el-tag>
            <!-- <el-tooltip v-if="scope.row.remark"  placement="top" effect="dark" trigger="hover">
              <div slot="content">
                {{ scope.row.remark }}
              </div>
              <i style="color:#409eff" class="el-icon-warning"></i>
            </el-tooltip> -->
          </template>
        </el-table-column>
        <el-table-column prop="levelName" label="长护险等级" align="center" min-width="100"></el-table-column>
        <!-- <el-table-column prop="subsidyId" label="流水号" align="center"  width="70"></el-table-column> -->
        <el-table-column label="护理周期" min-width="160" align="center">
          <template slot-scope="scope"><span>{{scope.row.intervalStart}} - {{scope.row.intervalEnd}}</span></template>
        </el-table-column>
        <!-- <el-table-column prop="levelDescription" label="护理名称" align="center" width="150"></el-table-column> -->
        <el-table-column prop="intervalDays" label="天数" align="center" min-width="80"></el-table-column>
        <el-table-column prop="subsidyPrice" label="单价(元)" align="center" min-width="80"></el-table-column>
        <el-table-column v-if="isOpened" prop="subsidyAmount" label="金额(元)" align="center" min-width="80">
          <template slot-scope="scope">
            <b v-if="scope.row.status === 3">{{ scope.row.subsidyAmount }}</b>
            <span v-else style="color:#A6B2BD">
              {{ scope.row.subsidyAmount }}(预估)
            </span>
          </template>
        </el-table-column>
        <el-table-column v-else prop="subsidyAmount" label="金额(元)" align="center" min-width="80">
          <template slot-scope="scope">
            <sapn>{{ scope.row.subsidyAmount }}</sapn>
          </template>
        </el-table-column>
        <!-- <el-table-column v-if="!isOpened" prop="cashAmount" label="现金支付(元)" align="center" width="80">
          <template slot-scope="scope">
            <b v-if="scope.row.cashAmount">{{ scope.row.cashAmount }}</b>
            <span v-else style="color:#A6B2BD">
              {{ scope.row.subsidyPrice *  scope.row.intervalDays}}(预估)
            </span>
          </template>
        </el-table-column> -->
        <el-table-column v-if="isOpened" prop="insuranceAmount" label="统筹支付(元)" align="center" min-width="100">
          <template slot-scope="scope">
            <b v-if="scope.row.status === 3">{{ scope.row.insuranceAmount }}</b>
            <span v-else style="color:#A6B2BD">
              {{ scope.row.insuranceAmount }}(预估)
            </span>
          </template>
        </el-table-column>
        <el-table-column v-else prop="insuranceAmount" label="统筹支付(元)" align="center" min-width="100">
          <template slot-scope="scope">
            <sapn>{{ scope.row.insuranceAmount }}</sapn>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" min-width="140"></el-table-column>
        <el-table-column label="状态" align="center" min-width="80">
          <template slot-scope="scope">
            <span :class="{'red':scope.row.status === 4}">
              {{scope.row.status|status}}
              <el-tooltip v-if="scope.row.status === 4&&scope.row.statusRemark" placement="top" effect="dark" trigger="hover">
                <div slot="content">
                  {{ scope.row.statusRemark }}
                </div>
                <i class="el-icon-question red"></i>
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="insuranceInfo" label="结算单号" align="center" min-width="100"></el-table-column>
        <el-table-column prop="remark" label="退款" align="center" min-width="100">
          <template slot-scope="scope">
            <!-- //退费状态：0未退费，1已退费 -->
            <span v-if="scope.row.refundStatus === 1">
              <el-tooltip placement="top" effect="dark" trigger="hover">
                <div slot="content">
                  <span v-if="scope.row.statusTime">退款时间：{{ scope.row.statusTime }}</span>
                  <span v-if="scope.row.refundInfo"><br/>退款单号：{{ scope.row.refundInfo }}</span>
                  <span v-if="scope.row.refundRemark"><br/>退款原因：{{ scope.row.refundRemark }}</span>
                </div>
                <i style="background-color:#ff9900;color:#fff;display:inline-block;width:20px;height:20px;border-radius:50%;text-align:center;line-height:20px;font-size:12px;font-style:normal;">
                  退
                </i>
              </el-tooltip>
              已退款
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="remark" label="说明" align="center" width="70"></el-table-column> -->
        <!-- <el-table-column prop="creator" label="创建人" align="center" width="80"></el-table-column> -->
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <span v-if="isOpened">
              <a v-if="scope.row.status === 0" style="color:#3E8EF7;margin-right:5px" @click="confirmData(scope.row)" href="javascript:;">审核</a>
              <a v-if="scope.row.status === 0||scope.row.status === 4" style="color:#3E8EF7;margin-right:5px" @click="repair(scope.row)" href="javascript:;">修改</a>
              <a v-if="scope.row.status ===0||scope.row.status === 1||scope.row.status === 2||scope.row.status === 4" style="color:#3E8EF7" @click="drag(scope.row)" href="javascript:;">作废</a>
            </span>
            <span v-else>
              <a v-if="scope.row.status === 2" style="color:#3E8EF7;margin-right:5px" @click="jiesuan(scope.row)" href="javascript:;">结算</a>
              <a v-if="scope.row.status === 2" style="color:#3E8EF7;margin-right:5px" @click="repair(scope.row)" href="javascript:;">修改</a>
              <a v-if="scope.row.status === 2" style="color:#3E8EF7;margin-right:5px" @click="drag(scope.row)" href="javascript:;">作废</a>
              <a v-if="scope.row.status === 3 && scope.row.refundStatus === 0" style="color:#a6b2bd;margin-right:5px" @click="tuikuan(scope.row)" href="javascript:;">退款</a>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-button v-if="isOpened" v-show="isShowReview" @click="batchReview()">批量审核</el-button>
        <el-button v-else v-show="isShowReview" @click="batchCalc()">批量结算</el-button>
        <el-button @click="batchInvalid()">批量作废</el-button>
        <!-- <el-button @click="pullCard()">批量待拉卡</el-button> -->
      </div>
      <el-pagination :page-size="pageSize" @current-change="handleChange" :current-page.sync="currentPage" layout="total, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <!-- 批量新增弹出框 -->
    <el-dialog title="批量生成" :visible.sync="dialogFormVisible" center width="30%" class="multi-dia">
      <el-row>
        支持按月批量生成，若长者本月已生成过周期数据，则自动跳过此长者。若长者长护险信息不全，则不自动生成。
      </el-row>
      <el-form label-width="100px" label-position="left">
        <el-form-item label="护理周期">
          <el-date-picker v-model="chioseMonth" type="month" placeholder="请选择" format="yyyy-MM" value-format="yyyy-MM" clearable>
          </el-date-picker>
          <!-- 月 -->
        </el-form-item>
        <el-form-item label="生成规则">
          <template>
            <p class="tip">请勾选<em style="color:red">不生成</em>护理内容的条件</p>
            <div class="reasons">
              <div class="header">
                请假
                <el-tooltip placement="top" effect="dark" trigger="hover">
                  <div style="line-height:1.5" slot="content">可以依据请假类型设置是否生成请假期间的长护险结算单<br />
                    勾选表示此类型的请假期间<em style="color:red">不生成</em>护理周期结算单
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </div>
              <div class="body">
                <el-checkbox-group v-model="reasonList">
                  <el-checkbox v-for="(item,index) in reasons" :key="index" :label="item"></el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddDate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 单个新增弹出框 -->
    <el-dialog title="单个添加" :visible.sync="dialogAddVisible" center width="30%" class="single-dia">
      <el-form label-width="100px">
        <el-form-item label="长者姓名">
          <ub-elder v-model="addInfo.elderId" :status="[0,100]" @change='item => handleSelectUser(item)' clearable></ub-elder>
        </el-form-item>
        <el-form-item v-show="addInfo.elderId" label="医保卡号">{{addInfo.insuranceNo}}</el-form-item>
        <el-form-item v-show="addInfo.elderId" label="末次评估等级">{{addInfo.insuranceLevel | filterLevel}}</el-form-item>
        <el-form-item label="护理周期">
          <el-date-picker v-model="addInfo.intervalTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" format="yyyy年MM月dd日" clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="生成规则">
          <template>
            <p class="tip">请勾选<em style="color:red">不生成</em>护理内容的条件</p>
            <div class="reasons">
              <div class="header">
                请假
                <el-tooltip placement="top" effect="dark" trigger="hover">
                  <div style="line-height:1.5" slot="content">可以依据请假类型设置是否生成请假期间的长护险结算单<br />
                    勾选表示此类型的请假期间<em style="color:red">不生成</em>护理周期结算单
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </div>
              <div class="body">
                <el-checkbox-group v-model="addInfo.reasonList">
                  <el-checkbox v-for="(item,index) in reasons" :key="index" :label="item"></el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddOne">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑长护险信息弹出框 -->
    <el-dialog title="修改护理周期" :visible.sync="dialogEditVisible" center width="30%">
      <el-form label-width="100px">
        <el-form-item label="长者姓名">{{editInfo.elderName}}</el-form-item>
        <el-form-item label="医保卡号">{{editInfo.insuranceNo}}</el-form-item>
        <el-form-item label="长护险等级">{{editInfo.levelName}}</el-form-item>
        <!-- <el-form-item label="天数"><span style="color:#2FC07A;">{{editInfo.intervalDays}}天</span></el-form-item> -->
        <!-- <el-form-item label="金额"><span style="color:#EB6969">{{editInfo.subsidyAmount}}元</span></el-form-item> -->
        <el-form-item label="护理周期">
          <el-date-picker v-model="editInfo.intervalTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" format="yyyy年MM月dd日">
          </el-date-picker>
          <!-- <div style="display:flex">
            <el-date-picker v-model="editInfo.intervalStart" type="date" placeholder="选择日期"></el-date-picker>
            <span style="padding:0 10px;">至</span>
            <el-date-picker v-model="editInfo.intervalEnd" type="date" placeholder="选择日期"></el-date-picker>
          </div> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" @click="submitEditDate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 退款弹框 -->
    <el-dialog title="退款确认" :visible.sync="tuiKuanDiaVis" center width="20%">
      <p style="color: rgb(242, 129, 79);line-height:40px">确认要对此条护理结算单进行退款吗？</p>
      <el-form label-width="75px" label-position="left">
        <el-form-item label="退款原因">
          <el-input maxlength="20" v-model="refundRemark" placeholder="请输入退款理由" show-word-limit />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tuiKuanDiaVis = false;tuiKuanReason ='';">取 消</el-button>
        <el-button type="primary" @click="handleTuiKuan">确认退款</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tenant from "@/components/_tenant";
import ubElder from "@/components/elder";
var that;
export default {
  components: {
    ubElder
  },
  data() {
    return {
      show3: false,
      month: '',
      buildSelect: '',
      buildingOption: [],
      isShowReview: true, // 是否显示“批量审核”按钮
      dialogFormVisible: false,
      dialogAddVisible: false,
      dialogEditVisible: false,
      // chioseYear: '',
      chioseMonth: '',
      editInfo: {
        intervalTime:['','']
      },
      addInfo: {
        elderSearchName: '',
        elderId: '',
        elderName: '',
        insuranceLevel: '',
        insuranceNo: '',
        intervalTime: '',
        reasonList: ['住院看病']
      },
      fllorSelect: '',
      floorsOption: [],

      roomSelect: '',
      roomsOption: [],
      levels: [],
      // 状态：0待审核，1已审核，2待拉卡，3拉卡成功，4拉卡失败，-1已作废
      billStatusOptions: [
        {
          label: '待审核',
          value: 0
        },
        {
          label: '推送中',
          value: 1
        },
        {
          label: '待结算',
          value: 2
        },
        {
          label: '已结算',
          value: 3
        },
        {
          label: '推送失败',
          value: 4
        },
        {
          label: '已作废',
          value: -1
        },
      ],
      data: [],

      elderName: '',
      roomType: '',
      level: '',
      billStatus: '',
      pageSize: 10,
      pageIndex: 1,
      currentPage: 1,
      total: 0,
      multipleSelection: [],
      areaId: '',
      reasons: [],
      reasonList: ['住院看病'],
      isOpened: false,//机构是否开通了医保对接功能
      tuiKuanDiaVis:false,
      refundRemark:'',
      tuiKuanId:'',
      setArea:''
    }
  },
  beforeCreate() {
    that = this;
  },
  created() {
    this.init();
    axios.fetch('oaServer', "/org/building/list").then(res => {
      if (res.code == 200)
        this.buildingOption = res.data
    })
    let data = {
      parentNos: "长护险评估等级"
    };
    let that = this;
    axios
      .fetch("commonServer", "/dict/getItemViewsByParentNo", data)
      .then(res => {
        that.levels = res.data.map(item => {
          return {
            label: item.title,
            value: parseInt(item.itemValue)
          };
        });
      });
    console.log(that.levels)
    this.getdata();
    this.getOptionData();
  },
  methods: {
    // 判断机构是否开通了医保对接功能
    async init() {
      let data = await tenant.fetchCurrentTenant();
      let setting = tenant.getTenantSetting('medical_agent', data);
      console.log(setting);
      if (setting != null) {
        this.isOpened = true;
        // 当前机构开通了医保对接功能
      } else {
        this.isOpened = false;
        this.billStatusOptions = [
          {
            label: '待结算',
            value: 0
          },
          {
            label: '已结算',
            value: 3
          },
          {
            label: '已作废',
            value: -1
          },
        ]
      }
      console.log('机构是否开通了医保对接功能:======',this.isOpened);
    },
    // 从字典获取<长者请假事由>
    getOptionData() {
      axios
        .fetch("commonServer", "/dict/getItemViewsByParentNo", {
          parentNos: '长者请假事由'
        })
        .then(res => {
          this.reasons = res.data.map(item => {
            return item.itemValue;
          })
        });
    },
    // 区域赋值
    getArea(val) {
      console.log(val);
      this.areaId = val.value;
      let area = {text:val.text,value:val.value};
      this.setArea = area;
    },
    changeUser() {
      console.log('ee');
    },
    handleClear() {
      this.addInfo = {
        elderSearchName: '',
        elderId: '',
        elderName: '',
        insuranceLevel: '',
        insuranceNo: '',
        intervalTime: '',
        reasonList: ['住院看病']
      };
    },
    cancelEdit() {
      this.editInfo = {};
      this.dialogEditVisible = false
    },
    addMulit() {
      // this.chioseYear = '';
      this.chioseMonth = '';
      this.reasonList = ['住院看病'];
      this.dialogFormVisible = true;
    },
    addOneCon() {
      this.addInfo = Object.assign({},{
        reasonList: ['住院看病']
      })
      this.dialogAddVisible = true
    },
    getdata() {
      this.isShowReview = this.roomType == 1 ? false : true;
      axios.fetch('elderServer', "/elderSubsidyInsurance/query", {
        // buildingId: this.buildSelect,
        // floor: this.fllorSelect,
        // roomId: this.roomSelect,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        status: this.billStatus,
        level: this.level,
        areaId:this.areaId,
        // month: this.month,
        elderName: this.elderName
      }).then(res => {
        if (res.code == 200) {
          this.total = res.total;
          this.data = res.data
        }
      })
    },
    handleChange(i) {
      this.pageIndex = i;
      this.getdata();
    },
    // 确认批量新增数据
    submitAddDate() {
      if (this.chioseMonth == '') {
        return this.$message.error('请选择护理周期！');
      }
      axios.fetch('elderServer', "/elderSubsidyInsurance/batchAdd", {
        dateMonth: this.chioseMonth,
        reasonList:this.reasonList.join(',')
      }).then(res => {
        if (res.code == 200) {
          this.$message.success('操作成功');
          this.dialogFormVisible = false;
          this.reset();
        }
      })
    },
    // 确认新增一个数据
    submitAddOne() {
      if (!this.addInfo.elderId) return this.$message.warning('请选择长者');
      if (this.addInfo.insuranceLevel < 2 || this.addInfo.insuranceLevel > 6) return this.$message.warning('不符合长护险补贴要求');
      if (!this.addInfo.intervalTime || !this.addInfo.intervalTime[0] || !this.addInfo.intervalTime[1]) return this.$message.warning('请选择护理周期');
      axios.fetch('elderServer', "/elderSubsidyInsurance/add", {
        elderId: this.addInfo.elderId,
        elderName: this.addInfo.elderName,
        insuranceNo: this.addInfo.insuranceNo,
        intervalStart: this.addInfo.intervalTime[0],
        intervalEnd: this.addInfo.intervalTime[1],
        reasonList:this.addInfo.reasonList.join(','),
      }).then(res => {
        if (res.code == 200) {
          // this.total = res.total;
          // this.data = res.data;
          this.$message.success('操作成功');
          this.dialogAddVisible = false;
          this.reset();
        }
      })
    },
    // 确认更改编辑数据
    submitEditDate() {
      console.log(this.editInfo.intervalTime);
      if (this.editInfo.intervalTime && this.editInfo.intervalTime.length === 2 && this.editInfo.intervalTime[0]&& this.editInfo.intervalTime[1]) {
        let param = {
          subsidyId: this.editInfo.subsidyId,
          elderId: this.editInfo.elderId,
          elderName: this.editInfo.elderName,
          intervalStart: this.editInfo.intervalTime[0],
          intervalEnd: this.editInfo.intervalTime[1],
        }
        axios.fetch('elderServer', "/elderSubsidyInsurance/get/isOverlap", param,"form","POST",false,data=>{
          let code = data.code;
          console.log(code);
          if(code === 402 || code === 403){
            // this.$message.warning(data.message);
            let message = code === 402 ?
            "当前选择的周期内有多个等级，修改后会导致周期数据与实际等级不符，是否确认修改？":
            "当前选择的周期内有请假记录是否确认修改？";
            this.$confirm(message, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              axios.fetch('elderServer',"/elderSubsidyInsurance/update", param).then(result=>{
                this.dialogEditVisible = false;
                this.$message({
                  type: 'success',
                  message: '操作成功'
                });
                this.getdata();
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消修改'
              });          
            });
          } else {
            this.$message.error(data.message);
          }
        }).then(res => {
          if (res.code == 200) {
            axios.fetch('elderServer',"/elderSubsidyInsurance/update", param).then(result=>{
              this.dialogEditVisible = false;
              this.$message({
                type: 'success',
                message: '操作成功'
              });
              this.getdata();
            })
          }
        })
      } else {
        this.$message.warning('请选择护理周期');
      }
    },
    // 编辑时改变时间监听
    changeEditTime() {
      console.log(this.editInfo)
      axios.fetch('elderServer', "/elderSubsidyInsurance/get/amount", {
        level: this.editInfo.level,
        intervalStart: this.editInfo.intervalTime[0],
        intervalEnd: this.editInfo.intervalTime[1],
      }).then(res => {
        if (res.code == 200) {
          this.editInfo.intervalDays = res.data.intervalDays;
          this.editInfo.subsidyAmount = res.data.subsidyAmount;
          this.editInfo.cashAmount = res.data.cashAmount;
          this.editInfo.insuranceAmount = res.data.insuranceAmount;
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 添加一个数据时选择了一个用户
    handleSelectUser(item) {
      console.log(item);
      if(item){
        this.getElderData(item.elderId).then(data => {
          let elderData = Object.assign({},...data);
          this.addInfo.elderId = elderData.elderId;
          this.addInfo.elderName = elderData.elderName;
          this.addInfo.insuranceNo = elderData.insuranceNo;
          this.addInfo.insuranceLevel = elderData.insuranceLevel;
          this.$set(this.addInfo,'reasonList',['住院看病']);
        });
      } else {
        this.addInfo = {};
        this.$set(this.addInfo,'reasonList',['住院看病']);
      }
    },
    // 根据老人id获取老人信息
    getElderData(elderId){
      return new Promise((resolve, reject) => {
        axios.fetch("elderServer", "/elderInfo/all", { elderId }).then(res => {
          resolve(res.data);
        });
      })

    },
    // 编辑
    repair(val) {
      console.log(val)
      this.dialogEditVisible = true;
      this.editInfo = JSON.parse(JSON.stringify(val));
      this.$set(this.editInfo,'intervalTime',[val.intervalStart, val.intervalEnd]);
    },
    // 批量审核
    batchReview() {
      let chioseData = this.multipleSelection;
      let isShow = chioseData.findIndex(item => item.status == 1);
      let unCheck = chioseData.findIndex(item => item.status == -1);

      if (isShow !== -1) {
        this.$message.error('您选中的' + chioseData[isShow].elderName + '是已审核数据，不能重复审核，请重新选择人员！')
      } else if (unCheck !== -1) {
        this.$message.error('您选中的' + chioseData[unCheck].elderName + '是已作废数据，不能重复审核，请重新选择人员！')
      } else {
        let chioseLength = this.multipleSelection.length;
        if(chioseLength > 0){
          this.$confirm('确认审核选中的' + chioseLength + '条单据', '审核确认', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            axios.fetch('elderServer', "/elderSubsidyInsurance/batchCheck", chioseData, "json").then(res => {
              if (res.code == 200) {
                this.getdata();
                this.$message({
                  type: 'success',
                  message: '审核成功!'
                });
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消审核'
            });
          });
        } else {
          this.$message.warning('请选择需要审核的数据!');
        }

      }
    },
    // 批量作废
    batchInvalid() {
      let chioseData = this.multipleSelection;
      let chioseLength = this.multipleSelection.length;

      // let isShow = chioseData.findIndex(item => item.status == 1);
      // let unCheck = chioseData.findIndex(item => item.status == -1);

      // if (isShow !== -1) {
      //   this.$message.error('您选中的' + chioseData[isShow].elderName + '是已审核数据，不能作废，请重新选择人员！')
      // } else 
      // if (unCheck !== -1) {
      //   this.$message.error('您选中的' + chioseData[unCheck].elderName + '是已作废数据，不能作废，请重新选择人员！')
      // } else {
        if(chioseLength > 0 ){
          this.$confirm('若存在已推送至长护险管理或结算系统的数据需同时在长护险管理或结算系统内手工作废', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            axios.fetch('elderServer', "/elderSubsidyInsurance/batchInvalid", chioseData, "json").then(res => {
              if (res.code == 200) {
                this.getdata();
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消作废'
            });
          });
        } else {
          this.$message.warning('请选择需要做作废的数据');
        }
      // }
    },
    // 批量拉卡
    pullCard() {
      let chioseData = this.multipleSelection;
      let chioseLength = this.multipleSelection.length;

      let isShow = chioseData.findIndex(item => item.status == 1);
      let unCheck = chioseData.findIndex(item => item.status == -1);

      if (isShow !== -1) {
        this.$message.error('您选中的' + chioseData[isShow].elderName + '是已审核数据，不能待拉卡，请重新选择人员！')
      } else if (unCheck !== -1) {
        this.$message.error('您选中的' + chioseData[unCheck].elderName + '是已作废数据，不能待拉卡，请重新选择人员！')
      } else {
        this.$confirm('确认待拉卡' + chioseLength + '位老人的长护险记录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.fetch('elderServer', "/elderSubsidyInsurance/pullCard", chioseData, "json").then(res => {
            if (res.code == 200) {
              this.getdata();
              this.$message({
                type: 'success',
                message: '拉卡成功!'
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消作废'
          });
        });
      }
    },
    // 批量结算
    batchCalc(){
      let chioseData = this.multipleSelection;
      let chioseLength = this.multipleSelection.length;
      if(chioseLength > 0){
        this.$confirm('确认结算选中的' + chioseLength + '条单据', '结算确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.fetch('elderServer', "/elderSubsidyInsurance/batchAccount", chioseData, "json").then(res => {
            if (res.code == 200) {
              this.getdata();
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消结算'
          });
        });
      } else {
        this.$message.warning('请选择需要结算的数据!');
      }
    },
    changeBuild() {
      this.fllorSelect = [];
      this.roomSelect = ''
      this.roomsOption = []
      this.floorsOption = []
      if (this.buildSelect == '') return;

      let currentFloor = this.getBuildDetail(), temp = []
      for (let i = 0; i < currentFloor.floors; i++) temp.push(i)
      this.floorsOption = temp
    },
    getBuildDetail() {
      for (let i = 0; i < this.buildingOption.length; i++)
        if (this.buildingOption[i].buildingId == this.buildSelect)
          return this.buildingOption[i]
    },
    changefloor() {
      this.roomsOption = []
      this.roomSelect = ''
      if (this.fllorSelect == '') return;
      axios.fetch('oaServer', "/org/room/list", { buildingId: this.buildSelect, floor: this.fllorSelect, pageSize: 1000 }).then(res => {
        if (res.code == 200)
          this.roomsOption = res.data
      })
    },
    querydata() {
      this.pageIndex = 1;
      this.currentPage = 1;
      this.getdata()
    },
    reset() {
      // this.buildSelect = this.roomType = this.fllorSelect = this.roomSelect = this.elderName = this.level = this.ftype = this.month = ''
      this.setArea = this.areaId = this.elderName = this.billStatus = this.level = "";
      this.querydata();
    },
    // 选中条件设置
    checkSelectable(row) {
      return row.status !== -1 && row.status !== 3;
    },
    // 审核
    confirmData(row) {
      this.$confirm('确认后系统自动推送数据至长护险管理系统请稍后30分钟进入长护险管理系统查看', '确认审核并推送数据吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      }).then(() => {
        axios.fetch('elderServer','/elderSubsidyInsurance/batchCheck',[row],'json').then(res=>{
          this.getdata();
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消审核'
        });
      });
    },
    // 作废
    drag(row) {
      let message = '确认要作废吗？';
      if (this.isOpened) {
        if (row.status === 1 || row.status === 2) {
          message = "<p>由于系统获取推送或结算结果需要约20分钟</p><p>为了避免出错，作废前请确认本条记录是否已推送至长护险管理或结算系统</p><p style='color:rgb(242, 129, 79)'>如已推送，需同时在长护险管理或结算系统内手工作废</p>"
        }
      }
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true,
        dangerouslyUseHTMLString: true
      }).then(() => {
        axios.fetch('elderServer',"/elderSubsidyInsurance/batchInvalid",[row],'json').then(res=>{
          this.getdata();
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消作废'
        });
      });
    },
    // 退款
    tuikuan(row) {
      this.tuiKuanId = row.subsidyId;
      this.tuiKuanDiaVis = true;
      this.refundRemark = '';
    },
    handleTuiKuan(){
      axios.fetch("elderServer","/elderSubsidyInsurance/refund",{
        subsidyId:this.tuiKuanId,
        refundRemark:this.refundRemark
      }).then(res=>{
        this.$message.success('退款成功!');
        this.tuiKuanDiaVis = false;
        this.getdata();
      });
    },
    // 结算
    jiesuan(row) {
      this.$confirm('确认结算该条条单据?', '结算确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.fetch('elderServer', "/elderSubsidyInsurance/batchAccount", [row], "json").then(res => {
            if (res.code == 200) {
              this.getdata();
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消结算'
          });
        });
    },
    tableRowClassName({ row }) {
      // console.log(row);
      let className = "";
      if (row.status === -1) {
        className += " invalid";
      }
      return className;
    },
  },
  filters: {
    filterLevel: val => {
      return ['未评级', '护理一级', '护理二级', '护理三级', '护理四级', '护理五级', '护理六级', '外地', '不满60岁', '享受居家养老'][val]
    },
    feeStyle: i => i == 0 ? "先付后住(当月)" : "先住后付(上月)",
    status(val) {
      if (that.isOpened) {
        switch (val) {
          case 0:
            return "待审核"
          case 1:
            return "推送中"
          case 2:
            return "待结算"
          case 3:
            return "已结算"
          case 4:
            return "推送失败"
          case -1:
            return "已作废"
        }
      } else {
        switch (val) {
          case 0:
            return "待结算";
          case 3:
            return "已结算";
          case -1:
            return "已作废";
        }
      }
    },
    level: i => i == 0 ? '无护理' : i == 1 ? '护理一级' : i == 2 ? '护理二级' : i == 3 ? '护理三级' : i == 4 ? '护理四级' : '护理五级'
  }
}
</script>

<style lang="less" scoped>
/deep/ table {
  thead {
    tr:nth-child(2) {
      display: none;
    }
  }
  .red {
    color: red;
  }
  tr.invalid {
    td {
      color: #a6b2bd !important;
    }
  }
}
/deep/.el-form-item {
  margin-bottom: 0;
}
/deep/ .el-input-group__append {
  padding: 0;
  width: 40px;
  text-align: center;
  .el-button {
    min-width: 40px;
    width: 100%;
    padding: 10px;
    i {
      display: inline-block;
      width: 100%;
      height: 100%;
    }
  }
}
.yellow {
  color: rgb(242, 129, 79);
}
.block {
  color: #222222;
}
.content {
  /deep/ .pannel {
    .left {
      display: flex;
      align-items: center;
      span {
        padding-left: 15px;
        color: #999;
        font-size: 14px;
        i {
          color: rgb(242, 129, 79);
        }
      }
    }
  }
}
/deep/.el-dialog {
  border-radius: 10px;
}
.multi-dia,
.single-dia {
  /deep/.el-dialog {
    // border-radius: 10px;
    .el-row {
      padding: 8px 5px;
      margin-bottom: 15px;
      background-color: #eee;
      color: #999;
      border-radius: 5px;
    }
    .el-form {
      .reasons {
        border: 1px solid rgba(242, 242, 242, 1);
        border-radius: 5px;
        .header {
          height: 44px;
          font-size: 18px;
          font-weight: 500;
          background-color: rgba(242, 242, 242, 1);
          padding-left: 10px;
        }
        .body {
          padding: 15px 10px;
        }
      }
    }
  }
}
</style>