<template>
  <div>
    <el-form :inline="true" class="search" :model="searchData">
      <el-form-item label="">
        <el-select v-model="searchData.buildingId" placeholder="楼宇" clearable>
          <el-option v-for="item in buildingData" :key="item.buildingId" :label="item.buildingName" :value="item.buildingId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="楼层">
        <el-input-number v-model="searchData.floor" placeholder="楼层" :min="1" clearable></el-input-number>
      </el-form-item>
      <el-form-item label="">
        <ub-dictionary group="房间类型" v-model="searchData.roomType" placeholder="房间类型" clearable></ub-dictionary>
      </el-form-item>
      <el-form-item label="">
        <ub-dictionary group="房间朝向" v-model="searchData.direction" placeholder="房间朝向" clearable></ub-dictionary>
      </el-form-item>
      <el-form-item label="">
        <el-select v-model="searchData.areaId" placeholder="区域" clearable>
          <el-option v-for="item in areaData" :key="item.areaId" :label="item.areaName" :value="item.areaId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-input v-model="searchData.roomName" placeholder="房间名称" clearable></el-input>
      </el-form-item>
      <el-button @click="search" type="primary" icon="el-icon-search">查询</el-button>
      <el-button @click="reset" icon="el-icon-refresh-right">重置</el-button>
    </el-form>
    <div class="content">
      <el-row type="flex" class="pannel">
        <el-col></el-col>
        <el-col class="right">
          <el-button type="success" icon="el-icon-plus" @click="editItem({})">添加房间</el-button>
        </el-col>
      </el-row>
      <el-table :data="listData" border class="ub-table">
        <el-table-column prop="roomId" label="房间ID" width="80"></el-table-column>
        <el-table-column prop="roomName" label="房间名称"></el-table-column>
        <el-table-column prop="buildingName" label="楼宇"></el-table-column>
        <el-table-column prop="area" label="区域"></el-table-column>
        <el-table-column prop="floor" label="楼层"></el-table-column>
        <el-table-column prop="roomType" label="房间类型"></el-table-column>
        <el-table-column prop="direction" label="房间朝向"></el-table-column>
        <el-table-column prop="beds" label="床位数"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
        <el-table-column prop="syncStatus" label="是否同步" min-width="40">
            <template slot-scope="scope"> 
                <el-switch
                    v-model="scope.row.syncStatus"
                    :active-value="1"
                    :inactive-value="0"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="handleStatusChange(scope.row)"
                    >
                </el-switch>
            </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button @click="editItem(scope.row)" icon="iconfont iconcaozuotubiao-bianji" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button @click="removeItem(scope.row)" icon="el-icon-delete-solid" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="changePage" :total="dataCount" :current-page="searchData.pageIndex" :page-size="searchData.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
      <el-dialog :title="editTitle" :visible.sync="editVisible" width="500px" center top="20vh" modal="true">
        <el-form :model="currentItem" :label-position="left" status-icon ref="itemForm" label-width="80px">
          <el-form-item label="房间名称" prop="roomName" :show-message="false" required>
            <el-input clearable v-model.trim="currentItem.roomName" maxlength="10" show-word-limit type="text" placeholder="房间名称"></el-input>
          </el-form-item>
          <el-form-item label="所属楼宇" prop="buildingId" :show-message="false" required>
            <el-select v-model="currentItem.buildingId" placeholder="请选择所属楼宇">
              <el-option v-for="item in buildingData" :key="item.buildingId" :label="item.buildingName" :value="item.buildingId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属区域" prop="areaId" :show-message="false" required>
            <el-select v-model="currentItem.areaId" placeholder="请选择所属区域">
              <el-option v-for="item in areaData" :key="item.areaId" :label="item.areaName" :value="item.areaId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所在楼层" prop="floor" :show-message="false" required>
            <el-input-number v-model="currentItem.floor" :min="1" :max="100" label="楼层数"></el-input-number>
          </el-form-item>
          <el-form-item label="床位数" prop="beds" :show-message="false" required>
            <el-input-number v-model="currentItem.beds" :min="1" :max="10" label="楼层数"></el-input-number>
          </el-form-item>
          <el-form-item label="房间类型" prop="roomType" :show-message="false" required>
            <ub-dictionary group="房间类型" v-model="currentItem.roomType"></ub-dictionary>
          </el-form-item>
          <el-form-item label="房间朝向" prop="direction" :show-message="false" required>
            <ub-dictionary group="房间朝向" v-model="currentItem.direction"></ub-dictionary>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button type="primary" @click="editForm()">确 定</el-button>
          <el-button @click="editVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { axios } from "youban-utils";
import utilsTable from "@/utils/table";
import ubDictionary from "@/components/dictionary";

export default {
  components: { ubDictionary },
  data() {
    return {
      listData: [],
      currentItem: {},
      editVisible: false,
      editTitle: '',
      buildingData: [],
      areaData: [],
      searchData: {
        roomName: null,
        buildingId: null,
        floor: undefined,
        roomType: null,
        direction: null,
        areaId: null,
        pageSize: 10,
        pageIndex: 1
      },
      dataCount: 0,
    };
  },
  created() {
    //ubDictionary.init(this);
    this.fetchData();
    this.fetchBuildingData();
    this.fetchAreaData();
  },
  methods: {
    ...utilsTable,
    fetchData: function () {
      let that = this;
      axios.fetch("oaServer", "/org/room/list", this.searchData).then((res) => {
        this.dataCount = res.total;
        that.listData = res.data;
      });
    },
    search() {
      this.changePage(1);
    },
    reset() {
        this.searchData.roomName = null;
        this.searchData.buildingId = null;
        this.searchData.floor = undefined;
        this.searchData.roomType = null;
        this.searchData.direction = null;
        this.searchData.areaId = null;
        this.changePage(1);
    },
    changePage(value) {
      this.searchData.pageIndex = value;
      this.fetchData();
    },
    fetchBuildingData: function () {
      let that = this;
      axios.fetch("oaServer", "/org/building/list", {}).then(res => {
        that.buildingData = res.data;
      });
    },
    fetchAreaData: function () {
      let that = this;
      axios.fetch("oaServer", "/org/area/list", {}).then(res => {
        that.areaData = res.data;
      });
    },
    editItem(item) {
      this.editVisible = true;
      let form = this.$refs["itemForm"];
      if(form) {
        form.resetFields();
      }
      this.currentItem = _.clone(item);
      this.editTitle = item.roomId ? "编辑房间信息" : "新增房间"; 
    },
    editForm() {
      let that = this;
      this.$refs["itemForm"].validate(valid => {
        if (!valid) {
          return false;
        }
        let item = that.currentItem;
        // 楼宇
        let building = that.buildingData.find(x => x.buildingId == item.buildingId);
        if(!building) {
          that.$message.error("未找到所属楼宇！");
          return;
        }
        item.buildingName = building.buildingName;
        if(item.floor > building.floors) {
          that.$message.error("所属楼层高于所属楼宇的最高楼层！");
          return;
        }
        // 区域
        let area = that.areaData.find(x => x.areaId == item.areaId);
        if(!area) {
          that.$message.error("未找到所属区域！");
          return;
        }
        item.area = area.areaName;
        // 房间类型和床位数匹配
        let roomType = item.roomType;
        if(roomType == '双人间' && item.beds != 2
          || roomType == '三人间' && item.beds != 3
          || roomType == '四人间' && item.beds != 4
          || roomType == '五人间' && item.beds != 5
          || roomType == '六人间' && item.beds != 6
          || roomType == '多人间' && item.beds <= 6
        ) {
          that.$message.error("房间类型和床位数不匹配！");
          return;
        }
        axios.fetch("oaServer", "/org/room/submit", item).then(res => {
          if(item.roomId){
            this.editVisible = false;
          }
          this.$nextTick(()=>{
            this.$refs["itemForm"].resetFields();
            this.currentItem = {};
          })
          that.$message.success("操作成功");
          that.fetchData();
        });
      });
    },
    removeItem(item) {
      let that = this;
      this.$confirm("确认删除吗？").then(() => {
        axios.fetch("oaServer", "/org/room/delete", { roomId: item.roomId }).then(res => {
          that.$message.success("删除成功");
          that.fetchData();
        });
      }).catch(() => {});
    },
    // 切换区网同步
    handleStatusChange(data){
        axios.fetch('oaServer','/org/room/editSync',{
            roomId:data.roomId,
            syncStatus:data.syncStatus,
        },'json').then(res=>{
            this.$message.success('操作成功!')
        })
    }
  },
};
</script>

<style lang="less" scoped>
/deep/.el-input__inner {
    height: 40px;
}
</style>