<template>
  <div>
    <el-form :inline="true" class="search" :model="searchData">
      <el-form-item label>
        <ub-building v-model="searchData.buildingId" placeholder="楼宇" clearable></ub-building>
      </el-form-item>
      <el-form-item label>
        <el-input-number v-model="searchData.floor" placeholder="楼层" :min="1" clearable></el-input-number>
      </el-form-item>
      <el-form-item label>
        <el-input v-model="searchData.roomName" placeholder="房间名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <ub-dictionary group="床位状态" ref="bedStatus" v-model="searchData.status" placeholder="床位状态" clearable></ub-dictionary>
      </el-form-item>
      <el-button @click="search" type="primary" icon="el-icon-search">查询</el-button>
      <el-button @click="reset" icon="el-icon-refresh-right">重置</el-button>
    </el-form>
    <div class="content">
      <el-row type="flex" class="pannel">
        <el-col class="right">
          <el-button type="success" icon="el-icon-plus" @click="editItem({status:1,statusDisabled:true})">添加床位</el-button>
          <el-button icon="el-icon-document-copy" class="button-purple" @click="datasync()">同步数据</el-button>
        </el-col>
      </el-row>
      <el-table :data="dataList" border class="ub-table">
        <el-table-column prop="buildingName" label="楼宇"></el-table-column>
        <el-table-column prop="area" label="区域"></el-table-column>
        <el-table-column prop="floor" label="楼层"></el-table-column>
        <el-table-column prop="roomName" label="房间"></el-table-column>
        <el-table-column prop="roomType" label="房型"></el-table-column>
        <el-table-column prop="direction" label="朝向"></el-table-column>
        <el-table-column prop="bedName" label="床位编号"></el-table-column>
        <el-table-column prop="status" :formatter="status" label="状态"></el-table-column>
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
          <el-form-item label="床位编号" prop="bedName" :show-message="false" required>
            <el-input clearable v-model.trim="currentItem.bedName" maxlength="10" show-word-limit type="text" placeholder="床位编号"></el-input>
          </el-form-item>
          <el-form-item label="所在楼宇" prop="buildingId" :show-message="false" required>
            <ub-building ref="buildingInfo" v-model="currentItem.buildingId" placeholder="所在楼宇" clearable></ub-building>
          </el-form-item>
          <el-form-item label="所在楼层" prop="floor" :show-message="false" required>
            <ub-floor v-model="currentItem.floor" placeholder="所在楼层" clearable></ub-floor>
          </el-form-item>
          <el-form-item label="所在房间" prop="roomId" :show-message="false" required>
            <ub-room ref="buildingRoom" v-model="currentItem.roomId" placeholder="所在房间" clearable></ub-room>
          </el-form-item>
          <el-form-item label="床位状态" prop="status" :show-message="false" required>
            <ub-dictionary :disabled="currentItem.statusDisabled" group="床位状态" v-model="currentItem.status" placeholder="床位状态" clearable></ub-dictionary>
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
import axios from "axios";
import ubBuilding from "@/components/building";
import ubFloor from "@/components/floor";
import ubRoom from "@/components/room";
import ubDictionary from "@/components/dictionary";

export default {
  components: { ubBuilding, ubFloor, ubRoom, ubDictionary },
  data() {
    return {
      dataList: [],
      dataCount: 0,
      currentItem: {},
      editVisible: false,
      editTitle: '',
      searchData: {
        buildingId: null,
        floor: undefined,
        roomName: null,
        status: null,
        pageSize: 10,
        pageIndex: 1,
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    search() {
      this.changePage(1);
    },
    reset() {
      this.searchData.buildingId = null;
      this.searchData.floor = undefined;
      this.searchData.roomName = null;
      this.searchData.status = null;
      this.changePage(1);
    },
    changePage(value) {
      this.searchData.pageIndex = value;
      this.fetchData();
    },
    status(row, column, value, index) {
      let items = this.$refs['bedStatus'].options;
      if(!items) {
        return '';
      }
      let item = items.find(x => x.itemValue == value)
      return item ? item.title : '';
    },
    fetchData() {
      axios.fetch("oaServer", "/org/bed/list", this.searchData).then((res) => {
        this.dataCount = res.total;
        this.dataList = res.data;
      });
    },
    editItem(item) {
      this.editVisible = true;
      let form = this.$refs["itemForm"];
      if(form) {
        form.resetFields();
      }
      this.currentItem = _.clone(item);
      if(this.currentItem.status == 0) {
        this.currentItem.status = "0";
      }
      console.log(item.statusDisabled)
      this.currentItem.statusDisabled = item.statusDisabled == undefined ? true : item.statusDisabled;
      this.editTitle = item.bedId ? "编辑床位信息" : "新增床位"; 
    },
    editForm() {
      let that = this;
      this.$refs["itemForm"].validate(valid => {
        if (!valid) {
          return false;
        }
        let item = that.currentItem;
        // 楼宇
        let building = that.$refs['buildingInfo'].options.find(x => x.buildingId == item.buildingId);
        if(!building) {
          that.$message.error("未找到所属楼宇！");
          return;
        }
        item.buildingName = building.buildingName;
        // 房间
        let room = that.$refs['buildingRoom'].options.find(x => x.roomId == item.roomId);
        if(!room) {
          that.$message.error("未找到所属房间！");
          return;
        }
        item.roomName = room.roomName;
        item.bedFee = 0;
        axios.fetch("oaServer", "/org/bed/submit", item).then(res => {
          if(item.bedId){
            this.editVisible = false;
          }
          this.$nextTick(()=>{
            this.$refs["itemForm"].resetFields();
            this.currentItem = {
              statusDisabled: true,
              status: 1
            };
          })
          that.$message.success("操作成功");
          that.fetchData();
        });
      });
    },
    removeItem(item) {
      let that = this;
      this.$confirm("确认删除吗？").then(() => {
        axios.fetch("oaServer", "/org/bed/delete", { bedId: item.bedId }).then(res => {
          that.$message.success("删除成功");
          that.fetchData();
        });
      }).catch(() => {});
    },
    datasync() {
      this.$axios.fetch("datasyncServer", "/district/cityData").then((res) => {
        if (res.code == 200) {
          this.$message.success(res.data);
        } else {
          this.$message.error(res.message);
        }
      });
      this.$axios.fetch("datasyncServer", "/district/bed").then((res) => {
        if (res.code == 200) {
          this.$message.success(res.data);
          this.fetchData();
        }
      });
    },
    // 切换区网同步
    handleStatusChange(data){
        axios.fetch('oaServer','/org/bed/editSync',{
            bedId:data.bedId,
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