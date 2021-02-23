<template>
  <div class="app-container createOuts" id="createOut">
    <el-row :gutter="0" >
      <!--//:rules="rules"-->
      <el-form :model="form" label-width="120px" :rules="rules">
        <el-col :span="24" style="width: 93.7%;margin-left: 3%;">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <el-row>
                <el-col :span="1" class="backBtns">
                  <el-button @click="backList()">返回</el-button>
                </el-col>
                <el-col :xl="5" :lg="6">
                  <span>
                    <!--新增巡查分类-->
                  </span>
                </el-col>
              </el-row>
            </div>
            <div id="familyData">
              <el-row :gutter="20">
                <el-row>
                  <el-col :xl="5" :lg="6">
                    <el-form-item label="计划分类" prop="scheduleType">
                      <el-select
                        v-model="form.scheduleType"
                        placeholder="请选择"
                        @click.native="change($event)"
                      >
                        <el-option
                          v-for="item in option3"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="5" :lg="6">
                    <el-form-item label="计划名称" prop="scheduleName">
                      <el-input
                        v-model="form.scheduleName"
                        placeholder="请输入"
                        clearable
                        @input="change($event)"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :xl="5" :lg="6">
                    <el-form-item label="开始时间" prop="startDate">
                      <el-date-picker
                        v-model="form.startDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期"
                        :picker-options="start_Date"
                        @click.native="change($event)"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>

                  <el-col :xl="5" :lg="6">
                    <el-form-item label="结束时间" prop="endDate">
                      <el-date-picker
                        v-model="form.endDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期"
                        :picker-options="end_Date"
                        @click.native="change($event)"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :xl="5" :lg="6">
                    <el-form-item label="周期" prop="durationType">
                      <el-select
                        v-model="form.durationType"
                        placeholder="请选择"
                        @click.native="change($event)"
                      >
                        <el-option
                          v-for="item in durationOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="5" :lg="6">
                    <el-form-item label="次数" prop="interval">
                      <el-input
                        v-model="form.interval"
                        placeholder="请输入次数"
                        clearable
                        @input="change($event)"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-form>
    </el-row>
    <el-row>
      <p
        v-if="form.scheduleType==1||form.scheduleType==2"
        style="font-weight: bolder;margin: 15px 3%;"
      >添加巡查点位</p>
    </el-row>
    <!-- 设备巡查 -->
    <div v-if="form.scheduleType==1">
      <div
        class="box-card"
        style="background: #fff;width: 93.6%;margin:10px 0 60px 3%;box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);border-radius: 2px;padding-bottom:20px"
      >
        <el-row>
          <p style="margin: 10px 20px;">已添加点位：{{addTableData.length}}个,设备总数{{totonum}}个</p>
          <table id="dwtable">
            <tr class="thead" v-if="addTableData.length!==0">
              <td class="thxh">序号</td>
              <td>名称</td>
              <td>编号</td>
              <td>位置</td>
              <td>操作</td>
            </tr>

            <tbody v-for="(item,index) in addTableData" :key="index">
              <tr>
                <td class="dwxh">{{index+1}}</td>
                <td>
                  <div class="dwmc">
                    <span :class="{'dwxlic':true,'dwzk':item.zjdzk!==false}" @click="dwzk(index)">
                      <i
                        class="iconfont iconjichutubiao-xiangyoujiantou"
                        v-if="item.children.length!=0"
                      ></i>
                    </span>
                    {{item.equipmentName | nothingFilter}}
                  </div>
                </td>
                <td>
                  <div class="dwbh">{{item.deviceNo | nothingFilter}}</div>
                </td>
                <td>
                  <div class="dwwz">
                    {{item.buildingName}}{{item.floorName}}
                    <span v-if="item.floorName">楼</span>
                    {{item.installPosition}}
                  </div>
                </td>
                <td>
                  <div class="dwcz">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="上移"
                      placement="top-end"
                      v-if="index!=0"
                    >
                      <el-button size="mini" class="lookta" @click="toUp(index)">
                        <i class="iconfont iconcaozuotubiao-shangyi-zhengchang"></i>
                      </el-button>
                    </el-tooltip>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="下移"
                      placement="top-end"
                      v-if="index!=(addTableData.length-1)"
                    >
                      <el-button size="mini" class="lookta" @click="toDown(index)">
                        <i class="iconfont iconcaozuotubiao-xiayi-zhengchang"></i>
                      </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
                      <el-button size="mini" class="lookta" @click="deleteRow(item)">
                        <i class="iconfont iconcaozuotubiao-shanchu-xuanfu"></i>
                      </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="添加子点位" placement="top-end">
                      <el-button size="mini" class="lookta" @click="tjzdwbtn(item)">
                        <i class="iconfont icontubiaocaozuotubiaozengjiadianwei"></i>
                      </el-button>
                    </el-tooltip>
                  </div>
                </td>
              </tr>
              <!-- 子节点部分 -->
              <tr
                v-if="item.zjdzk==true"
                v-for="(item2,index2) in item.children"
                :key="index2"
                id="dwchild"
              >
                <td class="dwxh"></td>
                <td>
                  <div class="dwmc">
                    <span class="dwxlic"></span>
                    {{item2.equipmentName | nothingFilter}}
                  </div>
                </td>
                <td>
                  <div class="dwbh">{{item2.deviceNo | nothingFilter}}</div>
                </td>
                <td>
                  <div class="dwwz">
                    {{item2.buildingName}}{{item2.floorName}}
                    <span v-if="item2.floorName">楼</span>
                    {{item2.installPosition}}
                  </div>
                </td>
                <td>
                  <div class="dwcz">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="上移"
                      placement="top-end"
                      v-if="index2 !=0"
                    >
                      <el-button size="mini" class="lookta" @click="zjdydtoUp(index,index2)">
                        <i class="iconfont iconcaozuotubiao-shangyi-zhengchang"></i>
                      </el-button>
                    </el-tooltip>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="下移"
                      placement="top-end"
                      v-if="index2 !=(item.children.length-1)"
                    >
                      <el-button size="mini" class="lookta" @click="zjdydtoDown(index,index2)">
                        <i class="iconfont iconcaozuotubiao-xiayi-zhengchang"></i>
                      </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
                      <el-button size="mini" class="lookta" @click="zjdydelete(index,index2)">
                        <i class="iconfont iconcaozuotubiao-shanchu-xuanfu"></i>
                      </el-button>
                    </el-tooltip>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </el-row>
        <el-row style="margin-top:20px" v-if="form.scheduleType==1">
          <el-form ref="searchForm" :model="searchForm">
            <el-col :xl="3" :lg="3">
              <el-form-item label="位置" label-width="60px">
                <el-select
                  v-model="searchForm.buildingName"
                  placeholder="楼宇"
                  clearable
                  @change="changeBuilding(searchForm.buildingName)"
                >
                  <el-option
                    v-for="item in buildOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xl="2" :lg="3" style="margin-left: -50px">
              <el-form-item label label-width="55px">
                <el-select
                  v-model="searchForm.floorName"
                  placeholder="楼层"
                  clearable
                  @change="changeFloor"
                >
                  <el-option
                    v-for="item in floorOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xl="2" :lg="3" style="margin-left: -50px">
              <el-form-item label label-width="55px">
                <el-select
                  v-model="searchForm.roomName"
                  placeholder="房间"
                  @change="change"
                  clearable
                >
                  <el-option
                    v-for="item in roomNameOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xl="3" :lg="3" style="margin-left: -50px">
              <el-form-item label label-width="55px">
                <el-select
                  v-model="searchForm.installPosition"
                  placeholder="四级地址"
                  @change="change"
                  clearable
                >
                  <el-option
                    v-for="item in installPositionOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xl="3" :lg="4" style="margin-left: -10px">
              <el-form-item label label-width="20px">
                <el-input
                  v-model="form.installPosition2"
                  @change="change"
                  placeholder="请输入"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl="3" :lg="4">
              <el-form-item label="分类" label-width="50px">
                <el-select
                  v-model="searchForm.category "
                  placeholder="系统分类"
                  clearable
                  @change="handleEquiementOptions"
                >
                  <el-option
                    v-for="item in systemOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xl="3" :lg="4" style="margin-left: -30px">
              <el-form-item label label-width="40px">
                <el-select
                  v-model="searchForm.equipmentType"
                  placeholder="设备分类"
                  clearable
                  @change="change"
                >
                  <el-option
                    v-for="(item,index) in equiementOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xl="2" :lg="2" style="margin: 0 0 0 18px;width: 100px;">
              <el-button @click="handleCurrentChange2(1)" v-bind:style="{'background':'#2368D3','color':'#fff'}">
                <i
                  style="font-size: 12px;margin-right: 5px;"
                  class="iconfont iconjichutubiao-chaxun"
                ></i>查询
              </el-button>
            </el-col>
          </el-form>
        </el-row>
        <el-row style="position:relative">
          <el-table
            ref="multipleTable"
            tooltip-effect="dark"
            :data="tableData"
            @selection-change="handleSelectionChange"
            border
            style="width:1200px!important;left: 1%!important;-webkit-transform: translateX(0%) !important;margin-bottom: 20px;"
          >
            <el-table-column type="selection" min-width="60"></el-table-column>
            <el-table-column label="系统分类" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.category==0">火灾报警系统</span>
                <span v-if="scope.row.category==1">消防灭火系统</span>
                <span v-if="scope.row.category==2">应急疏散系统</span>
                <span v-if="scope.row.category==100">智能健康</span>
              </template>
            </el-table-column>
            <el-table-column label="设备分类" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.equipmentType==1">感温探测器</span>
                <span v-if="scope.row.equipmentType==2">光电感烟探测器</span>
                <span v-if="scope.row.equipmentType==3">可燃气体探测器</span>
                <span v-if="scope.row.equipmentType==4">手动报警按钮</span>
                <span v-if="scope.row.equipmentType==5">水流指示器</span>
                <span v-if="scope.row.equipmentType==6">消火栓按钮</span>
                <span v-if="scope.row.equipmentType==7">压力开关</span>
                <span v-if="scope.row.equipmentType==8">声光报警器</span>
                <span v-if="scope.row.equipmentType==9">喷淋泵</span>
                <span v-if="scope.row.equipmentType==10">消防水泵</span>
                <span v-if="scope.row.equipmentType==11">信号蝶阀</span>
                <span v-if="scope.row.equipmentType==12">水压探测器</span>
                <span v-if="scope.row.equipmentType==13">消防栓</span>
                <span v-if="scope.row.equipmentType==14">灭火器</span>
                <span v-if="scope.row.equipmentType==15">消防门磁</span>
                <span v-if="scope.row.equipmentType==16">应急灯</span>
              </template>
            </el-table-column>
            <el-table-column label="名称" min-width="100">
              <template slot-scope="scope">{{scope.row.equipmentName}}</template>
            </el-table-column>
            <el-table-column label="设备编号" min-width="100">
              <template slot-scope="scope">{{scope.row.deviceNo}}</template>
            </el-table-column>
            <el-table-column label="位置" min-width="140">
              <template slot-scope="scope">
                <span v-if="scope.row.floorName">{{scope.row.floorName}}楼</span>
                {{scope.row.installPosition}}
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row>
          <el-pagination
            @current-change="handleCurrentChange2"
            :current-page.sync="searchForm.pageIndex"
            :page-size="5"
            layout="total, prev, pager, next, jumper"
            :total="totalPage"
          ></el-pagination>

        </el-row>
        <div style="width:90px;margin:0px 0 0px 20px">
          <el-button @click="addDianwei" style="background: #6CBC6C;color: #fff;">添加主点位</el-button>
        </div>
      </div>
    </div>
    <!-- 楼层巡查 -->
    <el-row v-if="form.scheduleType==2" class="warp" id="staffTableStyle">
      <el-col>
        <div
          id="box-card"
          class="box-card"
          style="background: #fff;width: 93.6%;margin-left: 3%;height:360px;margin-top:10px;box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);border-radius: 2px;"
        >
          <div class="searchBox">
            <el-form ref="searchForm2" :model="searchForm2">
              <el-form-item class="serchTab">
                <el-select
                  v-model="searchForm2.buildingName"
                  placeholder="楼宇"
                  clearable
                  @change="changeBuilding2"
                >
                  <el-option
                    v-for="item in buildOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="serchTab">
                <el-select
                  v-model="searchForm2.floorName"
                  placeholder="楼层"
                  clearable
                  @change="changeFloor2"
                >
                  <el-option
                    v-for="item in floorOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="serchTab">
                <el-select
                  v-model="searchForm2.roomName"
                  placeholder="三级地址"
                  clearable
                  @change="changeRoom2"
                >
                  <el-option
                    v-for="item in roomNameOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="serchTab">
                <el-select
                  v-model="searchForm2.installPosition"
                  placeholder="四级地址"
                  clearable
                  @change="changePosition2"
                >
                  <el-option
                    v-for="item in installPositionOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <!-- <el-transfer
            filterable
            :titles="['巡查点位', '已添加巡查点位']"
            filter-placeholder="请输入位置关键字"
            @change="handleChangeData"
            v-model="value1"
            :data="transferData"
          ></el-transfer>-->
          <el-transfer
            id="trans"
            filterable
            :titles="['巡查点位', '已添加巡查点位']"
            @change="handleChangeData"
            v-model="value1"
            :data="transferData"
          ></el-transfer>
        </div>
      </el-col>
    </el-row>
    <el-row v-if="form.scheduleType==2">
      <!-- v-if="form.sl_reason==0" -->
      <p style="margin-left: 3%;font-weight: bolder;margin-top: 10px;">添加巡查内容</p>
    </el-row>
    <el-row v-if="form.scheduleType==2" class="warp" id="staffTableStyle">
      <el-col>
        <div>
          <div
            class="box-card"
            style="background: #fff;width: 93.6%;margin:10px 0 60px 3%;box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);border-radius: 2px;padding:10px 0"
          >
            <table class="tableXunCha">
              <tr>
                <td>序号</td>
                <td>巡查内容</td>
                <td>操作</td>
              </tr>
              <tr v-for="(item,index) in contents" :key="index">
                <td>{{index+1}}</td>
                <td>
                  <el-form ref="item.content" :model="item.content" style="height:40px">
                    <el-form-item label>
                      <el-input
                        v-model="contents[index].contentInfo"
                        placeholder="请输入巡查内容"
                        clearable
                      ></el-input>
                    </el-form-item>
                  </el-form>
                </td>
                <td>
                  <i
                    @click="addContent"
                    style="cursor: pointer;margin-right:10px"
                    class="iconfont iconcaozuotubiao-tianjia-zhengchang"
                  ></i>
                  <i
                    @click="delContent(index)"
                    v-if="index != 0"
                    style="cursor: pointer;"
                    class="iconfont iconcaozuotubiao-shanchu-xuanfu"
                  ></i>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="tijiao" v-if="form.scheduleType!=2">
      <el-row :gutter="40">
        <el-col :lg="4" :xl="5">
          <el-button
            style="width: 45%"
            type="success"
            plain
            @click="sendData()"
            v-bind:style="{'background':firstZhuTi}"
          >提交</el-button>
        </el-col>
        <el-col :lg="4" :xl="5">
          <el-button style="width: 45%" @click="backList()">取消</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="tijiao" v-if="form.scheduleType==2">
      <el-row :gutter="40">
        <el-col :lg="4" :xl="5">
          <el-button
            style="width: 45%"
            type="success"
            plain
            @click="sendData2()"
            v-bind:style="{'background':firstZhuTi}"
          >提交</el-button>
        </el-col>
        <el-col :lg="4" :xl="5">
          <el-button style="width: 45%" @click="backList()">取消</el-button>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      title="添加子设备"
      :visible.sync="tjdwdia"
      width="65%"
      :before-close="handleClose"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <el-row style="margin-top:20px">
        <el-form ref="zdwsearchForm" :model="zdwsearchForm">
          <el-col :xl="4" :lg="3">
            <el-form-item label="位置" label-width="60px">
              <el-select
                v-model="zdwsearchForm.buildingName"
                placeholder="楼宇"
                clearable
                @change="zdwchangeBuilding(zdwsearchForm.buildingName)"
              >
                <el-option
                  v-for="item in buildOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="3" :lg="3" style="margin-left: -50px">
            <el-form-item label label-width="55px">
              <el-select
                v-model="zdwsearchForm.floorName"
                placeholder="楼层"
                clearable
                @change="zdwchangeFloor"
              >
                <el-option
                  v-for="item in zdwfloorOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="3" :lg="3" style="margin-left: -50px">
            <el-form-item label label-width="55px">
              <el-select
                v-model="zdwsearchForm.roomName"
                @change="change()"
                placeholder="三级地址"
                clearable
              >
                <el-option
                  v-for="item in zdwroomNameOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="4" :lg="3" style="margin-left: -50px">
            <el-form-item label label-width="55px">
              <el-select v-model="zdwsearchForm.installPosition" placeholder="四级地址" clearable>
                <el-option
                  v-for="item in installPositionOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="3" :lg="3" style="margin-left: -10px">
            <el-form-item label label-width="20px">
              <el-input v-model="zdwsearchForm.installPosition2" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="4" :lg="3">
            <el-form-item label="分类" label-width="50px">
              <el-select
                v-model="zdwsearchForm.category "
                placeholder="系统分类"
                clearable
                @change="zdwhandleEquiementOptions"
              >
                <el-option
                  v-for="item in systemOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="4" :lg="3" style="margin-left: -30px">
            <el-form-item label label-width="40px">
              <el-select v-model="zdwsearchForm.equipmentType" placeholder="设备分类" clearable>
                <el-option
                  v-for="item in zdwequiementOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="2" :lg="2" style="margin: 0 0 0 18px;width: 100px;">
            <el-button @click="zdwhandleCurrentChange2(1)" v-bind:style="{'background':'#2368D3','color':'#fff'}">
              <i style="font-size: 12px;margin-right: 5px;" class="iconfont iconjichutubiao-chaxun"></i>查询
            </el-button>
          </el-col>
        </el-form>
      </el-row>
      <el-row>
        <el-table
          ref="zdwmultipleTable"
          tooltip-effect="dark"
          :data="zdwtable"
          @selection-change="zdwhandleSelectionChange"
          :row-key="getRowKeys"
          border
          style="width:1100px!important;left: 1%!important;-webkit-transform: translateX(0%) !important;margin-bottom: 20px;">
          <el-table-column type="selection" min-width="60"></el-table-column>
          <el-table-column label="系统分类" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.category==0">火灾报警系统</span>
              <span v-if="scope.row.category==1">消防灭火系统</span>
              <span v-if="scope.row.category==2">应急疏散系统</span>
              <span v-if="scope.row.category==100">智能健康</span>
            </template>
          </el-table-column>
          <el-table-column label="设备分类" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.equipmentType==1">感温探测器</span>
              <span v-if="scope.row.equipmentType==2">光电感烟探测器</span>
              <span v-if="scope.row.equipmentType==3">可燃气体探测器</span>
              <span v-if="scope.row.equipmentType==4">手动报警按钮</span>
              <span v-if="scope.row.equipmentType==5">水流指示器</span>
              <span v-if="scope.row.equipmentType==6">消火栓按钮</span>
              <span v-if="scope.row.equipmentType==7">压力开关</span>
              <span v-if="scope.row.equipmentType==8">声光报警器</span>
              <span v-if="scope.row.equipmentType==9">喷淋泵</span>
              <span v-if="scope.row.equipmentType==10">消防水泵</span>
              <span v-if="scope.row.equipmentType==11">信号蝶阀</span>
              <span v-if="scope.row.equipmentType==12">水压探测器</span>
              <span v-if="scope.row.equipmentType==13">消防栓</span>
              <span v-if="scope.row.equipmentType==14">灭火器</span>
              <span v-if="scope.row.equipmentType==15">消防门磁</span>
              <span v-if="scope.row.equipmentType==16">应急灯</span>
            </template>
          </el-table-column>
          <el-table-column label="名称" min-width="100">
            <template slot-scope="scope">{{scope.row.equipmentName | nothingFilter}}</template>
          </el-table-column>
          <el-table-column label="设备编号" min-width="100">
            <template slot-scope="scope">{{scope.row.deviceNo | nothingFilter}}</template>
          </el-table-column>
          <el-table-column label="位置" min-width="140">
            <template slot-scope="scope">
              <span v-if="scope.row.floorName">{{scope.row.floorName}}楼</span>
              {{scope.row.installPosition}}
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
          <el-pagination
            @current-change="zdwhandleCurrentChange2"
            :current-page.sync="zdwsearchForm.pageIndex"
            :page-size="5"
            layout="total, prev, pager, next, jumper"
            :total="zdwtotalPage"></el-pagination>
      </el-row>
      <span slot="footer" class="dialog-footer" id="zdwdigfoot">
        <el-button style="background: #6CBC6C;color: #fff;" @click="tjzsbbtn">添加子设备</el-button>
        <el-button @click="handleClose">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      getRowKeys(row) {
        return row.deviceId;
      },
      allInstallPositionLocal:[],
      filterarr: [],
      totonum: 0,
      fjdid: [], //主设备id
      zjdidarr: [],
      totalPage:0,
      zdwtotalPage: 0,
      zdwfloorOptions: [],
      zdwroomNameOptions: [],
      zdwalreadyData: [],
      tjdwdia: false,
      zdwequiementOptions: [],
      zdwtable: [],
      contents: [
        {
          contentInfo: ""
        }
      ],
      end_Date: {},
      transferData: [],
      value1: [],
      dialogFormVisible: false,
      title: "选择巡查人员",
      checkedFalse: "",
      option3: [
        {
          value: 1,
          label: "设备巡查"
        },
        {
          value: 2,
          label: "楼层巡查"
        }
      ],
      // 0按小时，1按天，2按周，3按月，4按季，5按年，6按双周，7按半个月
      durationOptions:[{
          value: 0,
          label: "按小时"
      },{
          value: 1,
          label: "按天"
      },{
          value: 2,
          label: "按周"
      },{
          value: 3,
          label: "按月"
      },{
          value: 4,
          label: "按季"
      },{
          value: 5,
          label: "按年"
      },{
          value: 6,
          label: "按双周"
      },{
          value: 7,
          label: "按半个月"
      }],
      systemOptions: [
        {
          value: 0,
          label: "火灾报警系统"
        },
        {
          value: 1,
          label: "消防灭火系统"
        },
        {
          value: 2,
          label: "应急疏散系统"
        }
      ],
      equiementOptions: [],
      buildOptions: [],
      floorOptions: [],
      installPositionOptions: [],
      roomNameOptions: [],
      alreadyData: [],
      addTableData: [],
      dictForm: {
        sfdWeight: "",
        sfdName: ""
      },
      diName: "",
      diTime: "",
      diInstall: "",
      diWarrantyTime: "",
      diManufactor: "",
      diPhone: "",
      diModel: "",
      option4: [],
      option1: [],
      userId: "",
      sign: "",
      st: "222",
      itemData: [],
      option: [],
      form: {
        scheduleType: ""
      },
      searchForm: {
        pageIndex: 1,
        pageSize: 5
      },
      zdwsearchForm: {
        pageIndex: 1,
        pageSize: 5
      },
      searchForm2: {
        buildingName: "",
        floorName: "",
        roomName: "",
        installPosition: ""
      },
      buildingName: "",
      roomName: "",
      rightData: [],
      bindingArr: [
        {
          sl_reason: "",
          sl_reason: "",
          sl_reason: ""
        }
      ],
      start_Date: {
        //时间限制
        disabledDate: time => {
          if (this.form.endDate) {
            return (
              time.getTime() < Date.now() || time.getTime() > this.form.endDate
            );
          }
          return time.getTime() < Date.now();
        }
      },
      end_Date: {
        disabledDate: time => {
          return (
            time.getTime() < Date.now() || time.getTime() < this.form.startDate
          );
        }
      },
      rules: {
        scheduleType: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        scheduleName: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        startDate: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        endDate: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        interval: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        durationType: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ]
      }
    };
  },
  watch: {
    addTableData: {
      handler: function(val, oldVal) {
        let tempary = [];
        let totoarr = [];
        // let zjdarray = [];
        tempary = val;
        for (let i = 0; i < tempary.length; i++) {
          totoarr.push(tempary[i]);
          if (tempary[i].children) {
            if (tempary[i].children.length != 0) {
              for (let m = 0; m < tempary[i].children.length; m++) {
                totoarr.push(tempary[i].children[m]);
              }
            }
          }
        }
        this.totonum = totoarr.length;
        this.filterarr = totoarr.map(function(item, index) {
          return item.deviceId;
        });
        this.$forceUpdate();
      },
      deep: true
    }
  },
  created() {
    this.allData();
    this.form.scheduleType = this.$route.query.scheduleType;

    let scheduleId = this.$route.query.scheduleId;
    if (this.form.scheduleType == 1) {
      let data = {
        scheduleId: scheduleId
      };
      axios.fetch('fireServer', "/patrol/schedule/get/device/schedule",data).then(res => {
          this.loading = false;
          if (res.code == 200) {
            this.form = res.data[0];

            this.addTableData = res.data[0].patrolPositions.map(v => {
              return {
                equipmentName: v.deviceName,
                deviceNo: v.uid,
                installPosition: v.roomName,
                buildingName: v.buildingName,
                floorName: v.floorName,
                deviceId: v.deviceId,
                bedName: "",
                groupId: v.groupId
              };
            });
            let tempary = this.addTableData;
            let fjdarray = [];
            let zjdarray = [];
            for (var i = 0; i < tempary.length; i++) {
              if (tempary[i].groupId == tempary[i].deviceId) {
                tempary[i].node = "fjd";
                tempary[i].zjdzk = true;
                tempary[i].children = [];
                fjdarray.push(tempary[i]);
              } else {
                tempary[i].node = "zjd";
                zjdarray.push(tempary[i]);
              }
            }
            for (var m = 0; m < fjdarray.length; m++) {
              for (var n = 0; n < zjdarray.length; n++) {
                if (fjdarray[m].groupId == zjdarray[n].groupId) {
                  fjdarray[m].children.push(zjdarray[n]);
                }
              }
            }
            this.addTableData = fjdarray;
            this.zjdidarr = zjdarray;
          } else if (res.code == "401") {
            this.$message({
              message: res.message,
              type: "warning"
            });
            this.$router.push("/login");
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(err => {
          this.loading = false;
        });
    }
    if (this.form.scheduleType == 2) {
      setTimeout(()=>{
        this.searchForm2.buildingName = 1;
        this.changeBuilding2();
      },300);
      let data3 = {
        buildName: this.searchForm2.buildingName,
        floor: this.searchForm2.floorName,
        roomName: "",
        type: 'all'
      };
      this.researchDianWei(data3);
      let scheduleId = this.$route.query.scheduleId;
      let data = {
        scheduleId: scheduleId
      };
      axios.fetch('fireServer', "/patrol/schedule/get/build/schedule",data).then(res => {
        this.loading = false;
        if (res.code == 200) {
          this.form = res.data[0];
          this.contents = res.data[0].contents;
          for (var j = 0; j < this.form.patrolPositions.length; j++) {
            this.value1.push(
              this.form.patrolPositions[j].floorName +
                "-" +
                this.form.patrolPositions[j].roomName
            );
          }
        } else if (res.code == "401") {
          this.$message({
            message: res.message,
            type: "warning"
          });
          this.$router.push("/login");
        } else {
          this.$message.error(res.message);
        }
      })
      .catch(err => {
        this.loading = false;
      });
    }
  },
  methods: {
    dwzk(index) {
      this.addTableData[index].zjdzk = !this.addTableData[index].zjdzk;
      this.$forceUpdate();
    },
    // 添加子设备点击按钮
    tjzsbbtn() {
      if (this.zdwalreadyData.length == 0) {
        return this.$message.error('请至少选择一个子点位！')
      }
      let fjdnum;
      let zjdedarr = [];
      let result = [];
      for (var i = 0; i < this.zdwalreadyData.length; i++) {
        if (Array.isArray(this.zdwalreadyData[i])) {
          result = result.concat(this.zdwalreadyData[i]);
        }
      }
      if (result.length == 0) {
        return this.$message.error('请至少选择一个子点位！')
      }
      this.zdwalreadyData = result
      console.log(this.addTableData,this.zdwalreadyData)
      this.addTableData.forEach((item, index) => {
        if (item.deviceNo === this.fjdid) {
          fjdnum = index;
        }
      });
      let groupId = this.addTableData[fjdnum].deviceId;
      zjdedarr = this.addTableData[fjdnum].children;
      console.log(this.addTableData)
      this.addTableData.map(val => {
        this.zdwalreadyData = this.zdwalreadyData.filter(v=> v.deviceId !== val.deviceId);
        val.children.map(vv => {
          this.zdwalreadyData = this.zdwalreadyData.filter(v=> v.deviceId !== vv.deviceId);
        })
      })
      this.zdwalreadyData = this.zdwalreadyData.map(v => {
        return {
          buildingName: v.buildingName,
          installPosition: v.installPosition,
          equipmentName: v.equipmentName,
          deviceNo: v.deviceNo,
          floorName: v.floorName,
          category: v.category,
          deviceId: v.deviceId,
          equipmentType: v.equipmentType,
          groupId: groupId,
          node: "zjd"
        };
      });
      this.addTableData[fjdnum].children = [
        ...zjdedarr,
        ...this.zdwalreadyData
      ];
      this.zjdidarr = [...this.zjdidarr, ...this.zdwalreadyData];
      this.handleClose();
      this.glarr();
      this.$forceUpdate();
    },
    handleClose() {
      this.tjdwdia = false;
      this.zdwtotalPage = 0;
      this.zdwtable = [];
      this.zdwalreadyData = [];
      this.zdwsearchForm = {
        pageIndex: 1,
        pageSize: 5
      };
    },
    tjzdwbtn(value) {
      this.fjdid = value.deviceNo;
      this.zdwtotalPage = 0;
      this.zdwtable = [];
      this.zdwalreadyData = [];
      this.zdwsearchForm = {
        pageIndex: 1,
        pageSize: 5
      };
      this.tjdwdia = true;
    },
    backList() {
      this.$router.back(-1);
    },
    //楼宇
    async allData() {
      await axios.fetch('oaServer', "/org/building/list", {}).then(res => {
          this.loading = false;
          if (res.code == 200) {
            this.buildOptions = res.data.map(v => {
              return {
                label: v.buildingName,
                value: v.buildingId,
                floors: v.floors
              };
            });
          } else if (res.code == "401") {
            this.$message({
              message: res.message,
              type: "warning"
            });
            this.$router.push("/login");
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 添加子设备楼层
    zdwchangeBuilding(val) {
        this.zdwfloorOptions = [];
      //				console.log(val)
      //				this.searchForm.floorName = ''
      //				this.searchForm.roomName = ''
      //				this.searchForm.installPosition = ''
      if (val == null || val == "") {
        this.zdwsearchForm.floorName = "";
        this.zdwsearchForm.roomName = "";
        this.zdwsearchForm.installPosition = "";
        this.zdwinstallPositionOptions = [];
        return;
      }
      let floors = this.buildOptions.filter(
        v => v.value == this.zdwsearchForm.buildingName
      )[0].floors;
      for(var i = 1 ; i <= Number(floors) ; i ++ ) {
        let sub = {};
        sub.value = i;
        sub.label = i + "层";
        this.zdwfloorOptions.push(sub);
      }
    },
    //楼层
    changeBuilding(val) {
      if (val == null || val == "") {
        this.searchForm.floorName = "";
        this.searchForm.roomName = "";
        this.searchForm.installPosition = "";
        this.floorOptions = [];
        this.roomNameOptions = [];
        this.installPositionOptions = [];
        return;
      }
      let buildingName = this.buildOptions.filter(
        v => v.value == this.searchForm.buildingName
      )[0].label;
      let floors = this.buildOptions.filter(
        v => v.value == this.searchForm.buildingName
      )[0].floors;
      let data = {
        buildingName: buildingName
      };
      for(var i = 1 ; i <= Number(floors) ; i ++ ) {
        let sub = {};
        sub.value = i;
        sub.label = i + "层";
        this.floorOptions.push(sub);
      }
    },
    glarr() {
      let tempary = [];
      let totoarr = [];
      tempary = this.addTableData;
      for (let i = 0; i < tempary.length; i++) {
        totoarr.push(tempary[i]);
        if (tempary[i].children) {
          if (tempary[i].children.length != 0) {
            for (let m = 0; m < tempary[i].children.length; m++) {
              totoarr.push(tempary[i].children[m]);
            }
          }
        }
      }
      this.totonum = totoarr.length;
      this.filterarr = totoarr.map(function(item, index) {
        return item.deviceId;
      });
      this.$forceUpdate();
    },
    //添加子设备的楼层切换功能
    zdwchangeFloor() {
      let data = {
        floor: this.zdwsearchForm.floorName,
        enable: 1
      };
      this.zdwroomNameOptions = [];
      this.zdwsearchForm.roomName = "";
      axios.fetch('fireServer', "/org/room/room/name",data).then(res => {
        this.loading = false;
        if (res.code == 200) {
          this.zdwroomNameOptions = res.data.map(v => {
            return {
              label: v.roomName,
              value: v.defineId
            };
          });
          this.$forceUpdate();
          // console.log(this.roomNameOptions)
        } else if (res.code == "401") {
          this.$message({
            message: res.message,
            type: "warning"
          });
          this.$router.push("/login");
        } else {
          this.$message.error(res.message);
        }
      }).catch(err => {
        this.loading = false;
      });
      this.getInstallPostion(this.zdwsearchForm.floorName);
    },
    // 获取设备
    getInstallPostion(floorName){
      let data2 = {
          floor:floorName,
          enable:2,
        }
      axios.fetch('fireServer', "/org/room/room/name",data2).then(res => {
        this.loading = false;
        if(res.code == 200) {
          this.installPositionOptions = res.data.map(v=>{
            return{
              label:v.roomName,
              value:v.defineId
            }
          })
        } else if(res.code == "401") {
          this.$message({
            message: res.message,
            type: "warning"
          });
          this.$router.push("/login");
        } else {
          this.$message.error(res.message);
        }
      }).catch(err => {
        this.loading = false;
      });
    },
    changeFloor() {
      //				this.searchForm.roomName = ''
      //				this.searchForm.installPosition = ''
      console.log(this.searchForm)
      let data = {
        floor: this.searchForm.floorName,
        buildingId: this.searchForm.buildingName,
        pageSize:1000
      };
      this.roomNameOptions = [];
      this.searchForm.roomName = "";

      axios.fetch('oaServer', "/org/room/list",data).then(res => {
        this.loading = false;
        if (res.code == 200) {
          this.roomNameOptions = res.data.map(v => {
            return {
              label: v.roomName,
              value: v.defineId
            };
          });
          this.$forceUpdate();
        } else if (res.code == "401") {
          this.$message({
            message: res.message,
            type: "warning"
          });
          this.$router.push("/login");
        } else {
          this.$message.error(res.message);
        }
      })
      .catch(err => {
        this.loading = false;
      });
      this.getInstallPostion(this.searchForm.floorName);
      this.$forceUpdate();
    },
    //楼层巡查 楼层
    changeBuilding2() {
      console.log(this.buildOptions,this.searchForm2)
      if (
        this.searchForm2.buildingName == null ||
        this.searchForm2.buildingName == ""
      ) {
        this.searchForm2.floorName = "";
        this.searchForm2.roomName = "";
        this.searchForm2.installPosition = "";
        this.floorOptions = [];
        this.roomNameOptions = [];
        this.installPositionOptions = [];
        return;
      }
      this.buildingName = this.buildOptions.filter(
        v => v.value == this.searchForm2.buildingName
      )[0].label;
      let floors = this.buildOptions.filter(
        v => v.value == this.searchForm2.buildingName
      )[0].floors;
      for(var i = 1 ; i <= Number(floors) ; i ++ ) {
        let sub = {};
        sub.value = i;
        sub.label = i + "层";
        this.floorOptions.push(sub);
      }
    },

    //楼层巡查  房间
    changeFloor2() {
      let data = {
        floor: this.searchForm2.floorName,
        enable: 1
      };
      this.searchForm2.roomName = "";
      axios.fetch('fireServer', "/org/room/room/name",data).then(res => {
          this.loading = false;
          if (res.code == 200) {
            this.roomNameOptions = res.data.map(v => {
              return {
                label: v.roomName,
                value: v.defineId
              };
            });
          } else if (res.code == "401") {
            this.$message({
              message: res.message,
              type: "warning"
            });
            this.$router.push("/login");
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(err => {
          this.loading = false;
        });

      this.getInstallPostion(this.searchForm2.floorName);

      let data3 = {
        buildName: this.buildingName,
        floor: this.searchForm2.floorName,
        roomName: ""
      };

      this.researchDianWei(data3);
    },
    changeRoom2() {
      console.log(this.roomNameOptions,'??',this.searchForm2.roomName)
      if(this.searchForm2.roomName == '') {
        this.changeFloor2();
      } else {
        this.roomName = this.roomNameOptions.filter(
          v => v.value == this.searchForm2.roomName
        )[0].label;
        let data3 = {
          buildName: this.buildingName,
          floor: this.searchForm2.floorName,
          roomName: this.roomNameOptions.filter(
            v => v.value == this.searchForm2.roomName
          )[0].label
        };
        this.researchDianWei(data3);
        this.$forceUpdate();
      }
    },
    changePosition2() {
      if (this.searchForm2.installPosition == '') {
        this.changeRoom2();
      } else {
        this.roomName = this.installPositionOptions.filter(
          v => v.value == this.searchForm2.installPosition
        )[0].label;
        let data3 = {
          buildName: this.buildingName,
          floor: this.searchForm2.floorName,
          roomName: this.installPositionOptions.filter(
            v => v.value == this.searchForm2.installPosition
          )[0].label
        };
        this.researchDianWei(data3);
        this.$forceUpdate();
      }
    },
    zdwhandleEquiementOptions() {
      if (
        this.zdwsearchForm.category == null ||
        (this.zdwsearchForm.category == "" && this.zdwsearchForm.category != 0)
      ) {
        this.zdwsearchForm.equipmentType = "";
        this.zdwequiementOptions = [];
        return;
      }
      let data = {
        category: this.zdwsearchForm.category
      };
      axios.fetch('fireServer', "/equipment/getEquipmentTypes",data).then(res => {
          this.loading = false;
          if (res.code == 200) {
            this.zdwequiementOptions = res.data.map(v => {
              return {
                label: v.equipmentName,
                value: v.equipmentType
              };
            });
            this.$forceUpdate();
          } else if (res.code == "401") {
            this.$message({
              message: res.message,
              type: "warning"
            });
            this.$router.push("/login");
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    handleEquiementOptions() {
      console.log(this.searchForm.category,this.searchForm.category == null || (this.searchForm.category == "" && this.searchForm.category != 0))
      if ( this.searchForm.category == null || (this.searchForm.category == "" && this.searchForm.category != 0) ) {
        this.searchForm.equipmentType = "";
        this.equiementOptions = [];
        return;
      }
      let data = {
        category: this.searchForm.category
      };
      axios.fetch('fireServer', "/equipment/getEquipmentTypes",data).then(res => {
        this.loading = false;
        if (res.code == 200) {
          this.equiementOptions = res.data.map(v => {
            return {
              label: v.equipmentName,
              value: v.equipmentType
            };
          });
          this.$forceUpdate();
        } else if (res.code == "401") {
          this.$message({
            message: res.message,
            type: "warning"
          });
          this.$router.push("/login");
        } else {
          this.$message.error(res.message);
        }
      })
      .catch(err => {
        this.loading = false;
      });
    },
    zdwresearch() {
      let temparr = this.filterarr;
      if (
        this.zdwsearchForm.buildingName == null ||
        this.zdwsearchForm.buildingName == ""
      ) {
        var data = {
          dates: temparr,
          buildingName: "",
          floorName: "",
          roomName: "",
          installPosition: "",
          installPosition2: this.zdwsearchForm.installPosition2,
          category: this.zdwsearchForm.category,
          equipmentType: this.zdwsearchForm.equipmentType,
          pageIndex: this.zdwsearchForm.pageIndex,
          pageSize: this.zdwsearchForm.pageSize,
          dates: ""
        };
      } else {
        var data = {
          dates: temparr,
          buildingName:
            this.zdwsearchForm.buildingName == undefined ||
            this.zdwsearchForm.buildingName == null ||
            this.zdwsearchForm.buildingName == ""
              ? ""
              : this.buildOptions.filter(
                  v => v.value == this.zdwsearchForm.buildingName
                )[0].label,

          floorName: this.zdwsearchForm.floorName,
          roomName:
            this.zdwsearchForm.roomName == undefined ||
            this.zdwsearchForm.roomName == null ||
            this.zdwsearchForm.roomName == ""
              ? ""
              : this.zdwroomNameOptions.filter(
                  v => v.value == this.zdwsearchForm.roomName
                )[0].label,
          installPosition:
            this.zdwsearchForm.installPosition == undefined ||
            this.zdwsearchForm.installPosition == null ||
            this.zdwsearchForm.installPosition == ""
              ? ""
              : this.installPositionOptions.filter(
                  v => v.value == this.zdwsearchForm.installPosition
                )[0].label,
          installPosition2: this.zdwsearchForm.installPosition2,
          category: this.zdwsearchForm.category,
          equipmentType: this.zdwsearchForm.equipmentType,
          pageIndex: this.zdwsearchForm.pageIndex,
          pageSize: this.zdwsearchForm.pageSize
        };
      }

      axios.fetch('fireServer', "/equipment/getPetrolScheduleDevicesPager",data).then(res => {
          this.loading = false;
          if (res.code == 200) {
            this.zdwtable = res.data;
            this.zdwtotalPage = res.total;
            this.$forceUpdate();
          } else if (res.code == "401") {
            this.$message({
              message: res.message,
              type: "warning"
            });
            this.$router.push("/login");
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    change() {
      this.$forceUpdate();
    },
    research() {
      console.log(this.searchForm.installPosition)
      let zdwarr = this.zjdidarr.map(function(item, index) {
        return item.deviceId;
      });
      let fdwarr = this.addTableData.map(function(item, index) {
        return item.deviceId;
      });
      let temparr = [...zdwarr, ...fdwarr];
      if (
        this.searchForm.buildingName == null ||
        this.searchForm.buildingName == ""
      ) {
        var data = {
          dates: temparr,
          buildingName: "",
          floorName: "",
          roomName: "",
          installPosition: "",
          installPosition2: this.searchForm.installPosition2,
          category: this.searchForm.category,
          equipmentType: this.searchForm.equipmentType,
          pageIndex: this.searchForm.pageIndex,
          pageSize: this.searchForm.pageSize
        };
      } else {
        var data = {
          dates: zdwarr,
          buildingName:
            this.searchForm.buildingName == undefined ||
            this.searchForm.buildingName == null ||
            this.searchForm.buildingName == ""
              ? ""
              : this.buildOptions.filter(
                  v => v.value == this.searchForm.buildingName
                )[0].label,
          floorName: this.searchForm.floorName,
          roomName:
            this.searchForm.roomName == undefined ||
            this.searchForm.roomName == null ||
            this.searchForm.roomName == ""
              ? ""
              : this.roomNameOptions.filter(
                  v => v.value == this.searchForm.roomName
                )[0].label,
          installPosition:
            this.searchForm.installPosition == undefined ||
            this.searchForm.installPosition == null ||
            this.searchForm.installPosition == ""
              ? ""
              : this.installPositionOptions.filter(
                  v => v.value == this.searchForm.installPosition
                )[0].label,
          installPosition2: this.searchForm.installPosition2,
          category: this.searchForm.category,
          equipmentType: this.searchForm.equipmentType,
          pageIndex: this.searchForm.pageIndex,
          pageSize: this.searchForm.pageSize
        };
      }

      axios.fetch('fireServer', "/equipment/getPetrolDevicesPager",data).then(res => {
          this.loading = false;
          if (res.code == 200) {
            this.tableData = res.data;
            this.totalPage = res.total;
            this.$forceUpdate();
          } else if (res.code == "401") {
            this.$message({
              message: res.message,
              type: "warning"
            });
            this.$router.push("/login");
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    zdwhandleCurrentChange2(val) {
      this.zdwsearchForm.pageIndex = val;
      this.zdwresearch();
    },
    handleCurrentChange2(val) {
      this.searchForm.pageIndex = val;
      this.research();
    },
    zdwhandleSelectionChange(val) {
      let num = this.zdwsearchForm.pageIndex;
      this.zdwalreadyData[num] = val;
      this.$forceUpdate();
      // this.zdwalreadyData = [...this.zdwalreadyData, ...val];
      // this.zdwalreadyData = [...new Set(this.zdwalreadyData)]
    },
    //选择药品添加的change事件
    handleSelectionChange(val) {
      console.log(val)
      val.forEach(function(item, index) {
        item.node = "fjd";
        item.zjdzk = true;
        item.children = [];
      });
      let num = this.searchForm.pageIndex - 1;
      let temparr = this.alreadyData;
      temparr[num] = val;
      this.alreadyData = temparr;
    },
    //添加点位
    addDianwei() {
      console.log(this.tableData,this.addTableData,this.alreadyData,this.alreadyData.length)
      if(this.alreadyData.length == 0) {
        return this.$message.error('请至少选择一个主点位！');
      }
      // if(this.alreadyData)
      // this.addTableData = [];
      let temparr = [];
      for (var i = 0; i < this.alreadyData.length; i++) {
        if (this.alreadyData[i] == undefined) {
          this.alreadyData.splice(i, 1);
          i = i - 1;
        }
      }
      for (let m = 0; m < this.alreadyData.length; m++) {
        for (let n = 0; n < this.alreadyData[m].length; n++) {
          temparr.push(this.alreadyData[m][n]);
        }
      }
      this.alreadyData = temparr;
      this.addTableData = [...this.addTableData, ...this.alreadyData];
      //解决重复添加药品的问题
      var obj = {};
      this.addTableData = this.addTableData.reduce(function(item, next) {
        obj[next.deviceNo]
          ? ""
          : (obj[next.deviceNo] = true && item.push(next));
        return item;
      }, []);
      this.$refs.multipleTable.clearSelection()
      this.glarr();
      this.handleCurrentChange2(1);
      this.$forceUpdate();
      // this.addTableData = this.alreadyData
    },
    deleteRow(value) {
      let fjdnum;
      let num2;
      let num3;
      if (value.node == "zjd") {
        this.addTableData.forEach((item, index) => {
          if (item.deviceId === value.groupId) {
            fjdnum = index;
          }
        });
        this.addTableData[fjdnum].children.forEach((item, index) => {
          if (item.deviceId === value.groupId) {
            num2 = index;
          }
        });
        this.addTableData[fjdnum].children.splice(num2, 1);
      } else {
        this.addTableData.forEach((item, index) => {
          if (item.deviceId === value.deviceId) {
            num3 = index;
          }
        });
        this.addTableData.splice(num3, 1);
        // this.alreadyData = this.alreadyData.filter(
        //   v => v.deviceNo != value.deviceNo
        // );
      }
      this.glarr();
      this.$forceUpdate();
      // this.totalNum = this.alreadyMedicineData.length
    },
    zjdydelete(index, index2) {
      this.addTableData[index].children.splice(index2, 1);
      this.glarr();
      this.$forceUpdate();
    },
    //上移
    toUp(index) {
      if (index > 0) {
        let upData = this.addTableData[index - 1];
        this.addTableData.splice(index - 1, 1);
        this.addTableData.splice(index, 0, upData);
      }
      this.$forceUpdate();
    },
    //下移
    toDown(index) {
      if (index + 1 < this.addTableData.length) {
        let downData = this.addTableData[index + 1];
        this.addTableData.splice(index + 1, 1);
        this.addTableData.splice(index, 0, downData);
      }
      this.$forceUpdate();
    },
    zjdydtoUp(index, index2) {
      // if (index2 > 0) {
      let upData = this.addTableData[index].children[index2 - 1];
      this.addTableData[index].children.splice(index2 - 1, 1);
      this.addTableData[index].children.splice(index2, 0, upData);
      // }
      this.$forceUpdate();
    },
    zjdydtoDown(index, index2) {
      // if (index2 + 1 < this.addTableData[index].children.length) {
      let downData = this.addTableData[index].children[index2 + 1];
      this.addTableData[index].children.splice(index2 + 1, 1);
      this.addTableData[index].children.splice(index2, 0, downData);
      // }
      this.$forceUpdate();
    },
    addContent() {
      this.contents.push({
        contentInfo: ""
      });
    },
    delContent(index) {
      this.contents.splice(index, 1);
    },
    sendData() {
      this.addTableData.forEach((item, index) => {
        if (item.children) {
          this.addTableData = [...this.addTableData, ...item.children];
        }
      });

      for (let i = 0; i < this.addTableData.length; i++) {
        this.addTableData[i].children = "";
      }

      if (this.form.scheduleType == "" || this.form.scheduleType == null) {
        this.$message.error("请选择计划分类");

        return;
      }
      if (this.form.scheduleName == "" || this.form.scheduleName == null) {
        this.$message.error("请输入计划名称");

        return;
      }
      if (this.form.startDate == "" || this.form.startDate == null) {
        this.$message.error("请选择开始时间");

        return;
      }
      if (this.form.endDate == "" || this.form.endDate == null) {
        this.$message.error("请选择结束时间");

        return;
      }
      if (this.addTableData.length < 0) {
        this.$message.error("请添加点位");

        return;
      }
      var beginDate = this.form.startDate || '';
      var endDate = this.form.endDate || '';
      var d1 = new Date(beginDate.replace(/\-/g, "/"));
      var d2 = new Date(endDate.replace(/\-/g, "/"));
      if (beginDate != "" && endDate != "" && d1 > d2) {
        this.$message.error("开始时间不能大于结束时间");
        this.$forceUpdate();
        return;
      }
      if (this.form.durationType === "" || this.form.durationType == null) {
        this.$message.error("请选择周期");
        this.$forceUpdate();
        return;
      }
      if (this.form.interval == "" || this.form.interval == null) {
        this.$message.error("请选择频次");
        this.$forceUpdate();
        return;
      }
      if (this.addTableData.length == 0) {
        this.$message.error("巡查点位不能为空！");
        this.$forceUpdate();
        return;
      }
      var scheduleType = this.$route.query.scheduleType;
      var scheduleId = this.$route.query.scheduleId;

      if (scheduleType && scheduleType == 1) {
        let localtions = this.addTableData.map(v => {
          return {
            deviceId: v.deviceId,
            buildName: v.buildingName,
            floorName: v.floorName,
            roomName: v.installPosition,
            bedName: "",
            groupId: v.groupId ? v.groupId : v.deviceId
          };
        });

        let data = {
          scheduleType: this.form.scheduleType,
          scheduleName: this.form.scheduleName,
          startDate: this.form.startDate,
          endDate: this.form.endDate,
          durationType: this.form.durationType,
          interval: this.form.interval,
          handlerName: "",
          localtions: localtions,
          contents: [],
          scheduleId: scheduleId
        };

      axios.fetch('fireServer', "/patrol/schedule/update",data,'json').then(res => {
            this.loading = false;

            if (res.code == 200) {

              this.$router.push({
                path: "/fire/xunCha/xunChaPlan"
              });
            } else if (res.code == "401") {
              this.$message({
                message: res.message,
                type: "warning"
              });
              this.$router.push("/login");
            } else {
              this.$message.error(res.message);
            }
          })
          .catch(err => {
            this.loading = false;
          });
      } else {
        let localtions = this.addTableData.map(v => {
          return {
            deviceId: v.deviceId,
            buildName: v.buildingName,
            floorName: v.floorName,
            roomName: v.installPosition,
            roomName: v.installPosition,
            bedName: "",
            groupId: v.groupId ? v.groupId : v.deviceId
          };
        });

        let data = {
          scheduleType: this.form.scheduleType,
          scheduleName: this.form.scheduleName,
          startDate: this.form.startDate,
          endDate: this.form.endDate,
          durationType: this.form.durationType,
          interval: this.form.interval,
          handlerName: "",
          localtions: localtions,
          contents: []
        };

      axios.fetch('fireServer', "/patrol/schedule/add",data,'json').then(res => {
            this.loading = false;
            if (res.code == 200) {
              this.$message.success('添加成功');
              this.$router.push({
                path: "/fire/xunCha/xunChaPlan"
              });
            } else if (res.code == "401") {
              this.$message({
                message: res.message,
                type: "warning"
              });
              this.$router.push("/login");
            } else {
              this.$message.error(res.message);
            }
          })
          .catch(err => {
            this.loading = false;
          });
      }
    },
    sendDatabbbb() {},

    sendData2() {
      if (this.form.scheduleType == "" || this.form.scheduleType == null) {
        this.$message.error("请选择计划分类");
        this.$forceUpdate();
        return;
      }
      if (this.form.scheduleName == "" || this.form.scheduleName == null) {
        this.$message.error("请输入计划名称");
        this.$forceUpdate();
        return;
      }
      if (this.form.startDate == "" || this.form.startDate == null) {
        this.$message.error("请选择开始时间");
        this.$forceUpdate();
        return;
      }
      if (this.form.endDate == "" || this.form.endDate == null) {
        this.$message.error("请选择结束时间");
        this.$forceUpdate();
        return;
      }
      if (this.form.durationType === "" || this.form.durationType == null) {
        this.$message.error("请选择周期");
        this.$forceUpdate();
        return;
      }
      if (this.form.interval == "" || this.form.interval == null) {
        this.$message.error("请选择频次");
        this.$forceUpdate();
        return;
      }
      if (this.value1.length == 0) {
        this.$message.error("巡查点位不能为空");
        this.$forceUpdate();
        return;
      }
      var emptyNum = 0;
      for (var i = 0; i < this.contents.length; i++) {
        if (this.contents[i]["contentInfo"] === "") {
          this.$message.error("第" + (i + 1) + "项" + "巡查内容不能为空");
          this.$forceUpdate();
          return;
        }
      }
      var scheduleType = this.$route.query.scheduleType;
      var scheduleId = this.$route.query.scheduleId;
      if (scheduleType && scheduleType == 2) {
        //编辑的时候右边的值
        let rightData2 = [];
        console.log(this.transferData,this.rightData,this.value1)
        for (var i = 0; i < this.allInstallPositionLocal.length; i++) {
          for (var j = 0; j < this.value1.length; j++) {
            if (this.value1[j] == this.allInstallPositionLocal[i].key) {
              rightData2.push(this.allInstallPositionLocal[i]);
            }
          }
        }
        console.log(rightData2)
        let editDataRepeat = [...rightData2, ...this.rightData]; //编辑的时候右边的值和再次勾选左边的值得和

        //解决重复数据
        var obj = {};
        let editData = editDataRepeat.reduce(function(item, next) {
          obj[next.label] ? "" : (obj[next.label] = true && item.push(next));
          return item;
        }, []);

        let dataLocation = [];
        for (var i = 0; i < editData.length; i++) {
          dataLocation.push(editData[i].label.split("-")); //['大华福利院','1','1201']
        }

        let localtions = dataLocation.map(v => {
          return {
            deviceId: 0,
            buildName: v[0],
            floorName: v[1],
            roomName: v[2],
            bedName: ""
          };
        });
        let data = {
          scheduleType: this.form.scheduleType,
          scheduleName: this.form.scheduleName,
          startDate: this.form.startDate,
          endDate: this.form.endDate,
          durationType: this.form.durationType,
          interval: this.form.interval,
          handlerName: "",
          localtions: localtions,
          contents: this.contents,
          scheduleId: scheduleId
        };
      axios.fetch('fireServer', "/patrol/schedule/update",data,'json').then(res => {
            this.loading = false;
            if (res.code == 200) {
              this.$router.push({
                path: "/fire/xunCha/xunChaPlan"
              });
            } else if (res.code == "401") {
              this.$message({
                message: res.message,
                type: "warning"
              });
              this.$router.push("/login");
            } else {
              this.$message.error(res.message);
            }
          })
          .catch(err => {
            this.loading = false;
          });
      } else {
        let dataLocation = [];
        for (var i = 0; i < this.rightData.length; i++) {
          dataLocation.push(this.rightData[i].label.split("-"));
        }

        let localtions = dataLocation.map(v => {
          return {
            deviceId: 0,
            buildName: v[0],
            floorName: v[1],
            roomName: v[2],
            bedName: ""
          };
        });
        console.log(localtions);
        let data = {
          scheduleType: this.form.scheduleType,
          scheduleName: this.form.scheduleName,
          startDate: this.form.startDate,
          endDate: this.form.endDate,
          durationType: this.form.durationType,
          interval: this.form.interval,
          handlerName: "",
          localtions: localtions,
          contents: this.contents
        };
      axios.fetch('fireServer', "/patrol/schedule/add",data,'json').then(res => {
            this.loading = false;
            if (res.code == 200) {
              this.$message.success('添加成功');
              this.$router.push({
                path: "/fire/xunCha/xunChaPlan"
              });
            } else if (res.code == "401") {
              this.$message({
                message: res.message,
                type: "warning"
              });
              this.$router.push("/login");
            } else {
              this.$message.error(res.message);
            }
          })
          .catch(err => {
            this.loading = false;
          });
      }
    },
    handleChangeData(value, direction, movedKeys) {
      for (var i = 0; i < value.length; i++) {
        for (var j = 0; j < this.transferData.length; j++) {
          if (value[i] == this.transferData[j].key) {
            this.rightData.push({
              label: this.transferData[j].label,
              value: i
            });
          }
        }
      }

      var obj = {};
      this.rightData = this.rightData.reduce(function(item, next) {
        obj[next.label] ? "" : (obj[next.label] = true && item.push(next));
        return item;
      }, []);
    },
    //楼层巡查
    researchDianWei(data3) {
      console.log(data3.type)
      axios.fetch('fireServer', "/org/room/get",data3).then(res => {
          this.loading = false;
          if (res.code == 200) {
            this.transferData = res.data.map((v, i) => {
              return {
                label: v.buildingName + "-" + v.floorName + "-" + v.roomName,
                key: v.floorName + "-" + v.roomName
              };
            });
            if(data3.type == 'all') {
              this.allInstallPositionLocal = JSON.parse(JSON.stringify(this.transferData));
            }
          } else if (res.code == "401") {
            this.$message({
              message: res.message,
              type: "warning"
            });
            this.$router.push("/login");
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(err => {
          this.loading = false;
        });
    }
  }
};
</script>

<style scoped>
.el-textarea__inner {
  height: 130px;
}

.checkFalse {
  width: 100%;
  text-align: left;
  height: 40px;
  border-bottom: 1px solid #eeeeee;
  line-height: 40px;
  margin-right: 0%;
}

.checkFalseLast {
  width: 100%;
  text-align: left;
  height: 40px;
  border-bottom: none;
  line-height: 40px;
  margin-right: 0%;
}

.checkFalse:nth-last-child {
  border-bottom: none;
}

.el-transfer__buttons {
  width: 38px;
}

.el-transfer-panel__body {
  /* height: 245px; */
  /* background-color: red; */
  margin-top: 65px;
}

#createOut .el-transfer-panel {
  width: 380px;
  margin: 10px;
  height: 340px;
}

#createOut .el-button + .el-button {
  margin-left: 0;
  /* background: #F5F7FA; */
}

#createOut .el-transfer-panel__filter .el-input__inner {
  border-radius: 4px;
  width: 96%;
  margin-left: -30px;
  height: 40px;
}

.searchBox {
  position: absolute;
  z-index: 1;
  top: 65px;
  left: 70px;
  width: auto;
  height: 40px;
}

.serchTab {
  width: 130px;
  float: left;
  margin-left: 3px;
}

#createOut .box-card .el-card__header {
  line-height: 48px !important;
}

.tableXunCha {
  margin: 20px;
}

.tableXunCha tr td {
  font-size: 14px;
  padding: 14px 10px;
  border: 1px solid #dcdfe6;
  min-width: 80px;
  text-align: center;
}

.tableXunCha tr:first-child {
  background: #f3f3f3;
  font-size: 16px;
  font-weight: bolder;
}

.tableXunCha tr td:nth-child(2) {
  width: 712px;
}

.tableXunCha tr td:nth-child(1) {
  width: 133px;
}

.tableXunCha tr td:nth-child(3) {
  width: 113px;
}

#createOut #zdwpage .el-pagination {
  position: static;
  width: 50%;
}
#createOut .el-checkbox-group .el-transfer-panel__list .is-filterable label {
  width: 100% !important;
}

#createOut .box-card .item {
  margin-bottom: 0px;
}

#createOut .el-table {
  position: static !important;
  transform: translateX(0%) !important;
  width: 720px !important;
  margin-left: 20px;
  float: left;
}
#zdwdigfoot .el-button {
  width: 10%;
}

#dwtable {
  margin-left: 20px;
}

#dwtable .thead td {
  font-weight: 600;
  height: 48px;
  text-align: center;
  background: rgba(248, 248, 248, 1);
}
#dwtable .thxh,
#dwtable .dwxh {
  width: 67px;
}
#dwtable td {
  width: 250px;
  height: 48px;
  border: 1px solid rgba(220, 223, 230, 1);
}
#dwtable th {
  text-align: center;
  background: rgba(243, 243, 243, 1);
}
#dwtable td {
  background: #fff;
}
#dwtable .dwxh,
#dwtable .dwbh {
  text-align: center;
}
#dwtable .dwmc,
#dwtable .dwwz,
#dwtable .dwcz {
  width: 200px;
  padding-left: 20px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -webkit-text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}
.dwmc .dwxlic {
  display: inline-block;
  width: 15px;
}
.dwzk {
  transform: rotate(90deg);
  margin-top: -3px;
}
#dwchild td {
  background: rgba(248, 248, 248, 1);
}
#trans {
  width: 100%;
}
#trans >>> .el-transfer-panel {
  width: 650px;
}
#trans >>> .el-button {
  margin-left: 0px;
}
#trans >>> .el-input__inner {
  width: 95%;
}
#trans >>> .el-transfer-panel__filter {
  width: 85%;
}
.tijiao{
  width: 50%;
  margin: 10px 0 0 50px;
}
</style>
