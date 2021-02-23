<template>
  <div>
    <el-form :inline="true" class="search" :model="searchData">
      <el-form-item label="自增ID">
        <el-input type="number" :maxlength="11" clearable v-model="searchData.statId" placeholder="请输入自增ID"></el-input>
      </el-form-item>
      <el-form-item label="组名">
        <el-input clearable v-model="searchData.group" placeholder="请输入组名"></el-input>
      </el-form-item>
      <el-form-item label="分类名">
        <el-input clearable v-model="searchData.category" placeholder="请输入分类名"></el-input>
      </el-form-item>
      <el-form-item label="数据分类">
        <el-input clearable v-model="searchData.dataType" placeholder="请输入数据分类"></el-input>
      </el-form-item>
      <el-form-item label="数据名称">
        <el-input clearable v-model="searchData.title" placeholder="请输入数据名称"></el-input>
      </el-form-item>
      <el-form-item label="是否有效">
        <el-select clearable v-model="searchData.enabled" placeholder="请选择">
          <el-option value="1" label="有效"></el-option>
          <el-option value="0" label="无效"></el-option>
        </el-select>
      </el-form-item>
      <el-button @click="search" type="primary" icon="el-icon-search">查询</el-button>
      <el-button @click="reset" icon="el-icon-refresh-right">重置</el-button>
    </el-form>
    <div class="content">
      <el-row type="flex" class="pannel">
        <el-col></el-col>
        <el-col class="right">
          <el-button type="success" icon="el-icon-plus" @click="editItem({enabled:true,dispIndex:0})">添加项目</el-button>
        </el-col>
      </el-row>
      <el-table class="ub-table" :data="listData" stripe border>
        <el-table-column prop="statId" label="自增ID" width="100"></el-table-column>
        <el-table-column prop="group" label="组名"></el-table-column>
        <el-table-column prop="category" label="分类名"></el-table-column>
        <el-table-column prop="dataType" label="数据分类"></el-table-column>
        <el-table-column prop="title" label="数据名称"></el-table-column>
        <el-table-column label="统计区间">
          <template slot-scope="scope">
            {{ statTypeTitle(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column label="排程">
          <template slot-scope="scope">
            {{ scheduleTypeTitle(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column prop="dispIndex" label="显示顺序"></el-table-column>
        <el-table-column prop="enabled" label="是否有效" :formatter="status"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
        <!-- <el-table-column prop="remark" label="备注"></el-table-column> -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button @click="editItem(scope.row)" icon="iconfont iconcaozuotubiao-bianji" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="排程" placement="top">
              <el-button @click="scheduledItem(scope.row)" icon="el-icon-odometer" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="运行" placement="top">
              <el-button @click="runItem(scope.row)" icon="el-icon-video-play" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button @click="removeItem(scope.row)" icon="el-icon-delete-solid" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="changePage" :total="dataCount" :current-page="searchData.pageIndex" :page-size="searchData.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
    </div>
    <el-dialog :title="editTitle" :visible.sync="editVisible" width="500px" center top="20vh" modal="true">
      <el-form :model="currentItem" :label-position="left" status-icon ref="itemForm" label-width="80px">
        <el-form-item label="组名" prop="group" :show-message="false" required>
          <el-input clearable v-model.trim="currentItem.group" maxlength="20" show-word-limit type="text" placeholder="组名"></el-input>
        </el-form-item>
        <el-form-item label="分类名" prop="category" :show-message="false" required>
          <el-input clearable v-model.trim="currentItem.category" maxlength="20" show-word-limit type="text" placeholder="分类名"></el-input>
        </el-form-item>
        <el-form-item label="数据分类" prop="dataType" :show-message="false" required>
          <el-input clearable v-model.trim="currentItem.dataType" maxlength="20" show-word-limit type="text" placeholder="数据分类"></el-input>
        </el-form-item>
        <el-form-item label="数据名称" prop="title" :show-message="false" required>
          <el-input clearable v-model.trim="currentItem.title" maxlength="20" show-word-limit type="text" placeholder="数据名称"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="16">
            <el-form-item label="显示顺序" prop="dispIndex" :show-message="false" required>
              <el-input-number v-model="currentItem.dispIndex" step-strictly label="显示顺序"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否有效" prop="enabled" :show-message="false" required>
              <el-switch v-model="currentItem.enabled" :active-value="true" :inactive-value="false"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark" :show-message="false">
          <el-input clearable autosize v-model.trim="currentItem.remark" maxlength="50" show-word-limit type="textarea" placeholder="备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="editForm()">确 定</el-button>
        <el-button @click="editVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="scheduleTitle" :visible.sync="scheduleVisible" width="800px" center top="15vh" modal="true">
      <el-form :model="scheduleItem" :label-position="left" status-icon ref="scheduleForm" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="统计方式" prop="statType" :show-message="false" required>
              <el-select clearable v-model="scheduleItem.statType" placeholder="请选择" @change="statTypeChange">
                <el-option :value="0" label="运行时统计"></el-option>
                <el-option :value="1" label="按自然分钟"></el-option>
                <el-option :value="2" label="按自然小时"></el-option>
                <el-option :value="3" label="按自然天"></el-option>
                <el-option :value="4" label="按自然月"></el-option>
                <el-option :value="11" label="按分钟"></el-option>
                <el-option :value="12" label="按小时"></el-option>
                <el-option :value="13" label="按天"></el-option>
                <el-option :value="14" label="按月"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="统计区间" prop="statInterval" :show-message="false" required>
              <el-input-number v-model="scheduleItem.statInterval" :disabled="scheduleItem.statType == 0" :min="0" step-strictly label="统计区间"></el-input-number>
              <span>{{ scheduleItem.statType | statTypeFilter }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="运行方式" prop="scheduleType" :show-message="false" required>
              <el-select clearable v-model="scheduleItem.scheduleType" placeholder="请选择" @change="scheduleTypeChange">
                <el-option :value="0" label="手动运行"></el-option>
                <el-option :value="1" label="按自然分钟"></el-option>
                <el-option :value="2" label="按自然小时"></el-option>
                <el-option :value="3" label="按自然天"></el-option>
                <el-option :value="4" label="按自然月"></el-option>
                <el-option :value="11" label="按分钟"></el-option>
                <el-option :value="12" label="按小时"></el-option>
                <el-option :value="13" label="按天"></el-option>
                <el-option :value="14" label="按月"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运行间隔" prop="scheduleInterval" :show-message="false" required>
              <el-input-number v-model="scheduleItem.scheduleInterval" :disabled="scheduleItem.scheduleType == 0" :min="0" step-strictly label="运行间隔"></el-input-number>
              <span>{{ scheduleItem.scheduleType | statTypeFilter }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="数据重设" prop="resetType" :show-message="false" required>
              <el-select clearable v-model="scheduleItem.resetType" placeholder="请选择">
                <el-option :value="0" label="不重设"></el-option>
                <el-option :value="1" label="删除当期数据"></el-option>
                <el-option :value="2" label="删除数据"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数值格式" prop="issueFormat" :show-message="false">
              <el-input clearable v-model.trim="scheduleItem.issueFormat" maxlength="30" show-word-limit type="text" placeholder="形如：yyyyMMddHHmm"></el-input>
            </el-form-item>
            <!-- <el-form-item label="运行类型" prop="runType" :show-message="false" v-show="false" required>
              <el-select clearable v-model="scheduleItem.runType" placeholder="请选择">
                <el-option :value="0" label="统计并计算下次时间"></el-option>
                <el-option :value="1" label="仅统计一次"></el-option>
              </el-select>
            </el-form-item> -->
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="优先级" prop="priority" :show-message="false" required>
              <el-input-number v-model="scheduleItem.priority" step-strictly label="优先级"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否有效" prop="enabled" :show-message="false" required>
              <el-switch v-model="scheduleItem.enabled" :active-value="true" :inactive-value="false"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="初始SQL" prop="initSql" :show-message="false" required>
          <el-input clearable v-model="scheduleItem.initSql" show-word-limit :rows="1" type="textarea" placeholder="初始SQL"></el-input>
        </el-form-item>
        <el-form-item label="统计SQL" prop="statSql" :show-message="false" required>
          <el-input clearable v-model="scheduleItem.statSql" show-word-limit :rows="8" type="textarea" placeholder="统计SQL"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="统计开始" prop="lastTime" :show-message="false">
              <el-date-picker :disabled="!lastTimeChecked" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" v-model="scheduleItem.lastTime" type="datetime" placeholder="请选择"></el-date-picker>
              <el-checkbox v-model="lastTimeChecked"></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark" :show-message="false">
              <el-input clearable autosize v-model.trim="scheduleItem.remark" maxlength="50" show-word-limit type="textarea" placeholder="备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">统计截止时间：{{ scheduleItem.nextTime }}</el-col>
          <el-col :span="12">最后运行时间：{{ scheduleItem.lastRuntime }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="12">最后更新时间：{{ scheduleItem.updateTime }}</el-col>
          <el-col :span="12">下次运行时间：{{ scheduleItem.nextRuntime }}</el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="scheduledForm()">确 定</el-button>
        <el-button @click="scheduleVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
import { axios } from "youban-utils";
import utilsTable from "@/utils/table";

const getStatTypeName = value => {
  if(value == 1 || value == 11) {
    return "分钟"
  } else if(value == 2 || value == 12) {
    return "小时"
  } else if(value == 3 || value == 13) {
    return "天"
  } else if(value == 4 || value == 14) {
    return "月"
  } else {
    return ""
  }
}

export default {
  data() {
    return {
      listData: [],
      dataCount: 0,
      currentItem: {},
      editVisible: false,
      editTitle: '',
      searchData: {
        pageSize: 10,
        pageIndex: 1
      },
      scheduleVisible: false,
      scheduleTitle: '',
      scheduleItem: {},
      lastTimeChecked: false,
    };
  },
  created() {
    let employeeId = parseInt(this.$route.query.employeeId);
    if(employeeId) {
      this.searchData.employeeId = employeeId;
    }
    this.fetchData();
  },
  filters : {
    statTypeFilter(value) {
      return getStatTypeName(value);
    }
  },
  methods: {
    ...utilsTable,
    search() {
      this.changePage(1);
    },
    changePage(value) {
      this.searchData.pageIndex = value;
      this.fetchData();
    },
    reset() {
      this.searchData = {
        pageSize: 10,
        pageIndex: 1
      };
      this.changePage(1);
    },
    fetchData() {
      let that = this;
      axios.fetch("statServer", "/stats/queryItems", this.searchData).then(res => {
        that.listData = res.data;
        that.dataCount = res.total;
      });
    },
    editItem(item) {
      this.editVisible = true;
      let form = this.$refs["itemForm"];
      if(form) {
        form.resetFields();
      }
      this.currentItem = _.clone(item);
      this.editTitle = item.statId ? "编辑统计项目" : "新增统计项目";
    },
    editForm() {
      let that = this;
      this.$refs["itemForm"].validate(valid => {
        if (!valid) {
          return false;
        }
        let item = that.currentItem;
        axios.fetch("statServer", item.statId ? "/stats/updateItem" : "/stats/createItem", item).then(res => {
          this.editVisible = false;
          that.$message.success("操作成功");
          that.fetchData();
        });
      });
    },
    removeItem(item) {
      let that = this;
      this.$confirm("请确认是否删除此统计项目，一经删除将无法恢复！！！").then(() => {
        axios.fetch("statServer", "/stats/removeItem", { statId: item.statId }).then(res => {
          that.$message.success("删除成功");
          that.fetchData();
        });
      }).catch(() => {});
    },
    runItem(item) {
      let that = this;
      this.$confirm("请确认是否立即运行此项统计？").then(() => {
        axios.fetch("statServer", "/stats/runSchedule", { statId: item.statId }).then(res => {
          that.$message.success("指令已发送成功，后台正在统计，请稍后刷新结果。");
        });        
      }).catch(() => {});
    },
    scheduledItem(item) {
      this.scheduleTitle = item.dataType + "-" + item.title;
      axios.fetch("statServer", "/stats/getSchedule", { statId: item.statId }).then(res => {
        this.scheduleItem = res.data;
        this.lastTimeChecked = false;
        this.scheduleVisible = true;
      });
    },
    scheduledForm() {
      let that = this;
      this.$refs["scheduleForm"].validate(valid => {
        if (!valid) {
          return false;
        }
        let item = that.scheduleItem;
        if(item.statType != 0 && item.statInterval == 0) {
          that.$message.error("统计区间不能为0");
          return false;
        }
        if(item.scheduleType != 0 && item.scheduleInterval == 0) {
          that.$message.error("运行间隔不能为0");
          return false;
        }
        if(!that.lastTimeChecked) {
          item.lastTime = null;
        }
        axios.fetch("statServer", "/stats/updateSchedule", item).then(res => {
          this.scheduleVisible = false;
          that.$message.success("操作成功");
          that.fetchData();
        });
      });
    },
    statTypeTitle(item) {
      let typeName = getStatTypeName(item.statType);
      if(!typeName) {
        return "-";
      }
      let interval = item.statInterval;
      return interval + typeName;
    },
    scheduleTypeTitle(item) {
      let typeName = getStatTypeName(item.scheduleType);
      if(!typeName) {
        return "手动";
      }
      let interval = item.scheduleInterval;
      if(interval == 1) {
        return "每" + typeName;
      } else {
        return "每" + interval + typeName;
      }
    },
    statTypeChange(value) {
      if(value == 0) {
        this.scheduleItem.statInterval = 0;
      }
    },
    scheduleTypeChange(value) {
      if(value == 0) {
        this.scheduleItem.scheduleInterval = 0;
      }
    }
  },
};
</script>