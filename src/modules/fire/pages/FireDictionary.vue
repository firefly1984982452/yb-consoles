<template>
  <div class="app-container" id="" style="padding: 0 10px;">
    <el-row class="warp" v-loading="loading" id="staffTableStyle">
      <el-col class="searchTop">
        <el-form ref="searchForm" :model="searchForm" label-width="70px">
          <el-row type="flex" class="row-bg" :gutter="0">
            <el-col :span="5">
              <el-form-item label="字典名称">
                <el-input v-model="keyWord" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="searchBtns">
              <el-button v-bind:style="{'background':firstZhuTi,'color':'#fff'}" type="" @click="handleCurrentChange(1)"><i
                  class="btniconfont iconjichutubiao-chaxun"></i>查询</el-button>
            </el-col>
            <el-col :span="2" class="searchBtns">
              <el-button type="" @click="flash()"><i class="btniconfont iconjichutubiao-zhongzhi"></i>重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
      <!-- 2 -->
      <el-col style="background: rgb(255, 255, 255);border-radius: 4px;border: 1px solid rgb(220, 223, 230);padding-top: 15px;">
        <el-row class="btn-grounp-table">
          <el-col :span="14">
            <b style="color:transparent">1</b>
          </el-col>
          <el-col :span="10" style="position: relative;left: 0px;" id="">
            <el-row :gutter="10" type="flex" justify="end">
              <el-col :xl="4" :lg="5">
                <el-button class="addBtn" @click="addDict()"><i class="btniconfont iconjichutubiao-tianjia-huise"></i>添加字典</el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-table ref="multipleTable" tooltip-effect="dark" :data="tableData" border style="width:95%;position:relative;left:2%;">
          <el-table-column label="序号" min-width="50">
            <template slot-scope="scope">
              <span @click="see(scope.row)">{{scope.row.sfd_id}}</span>
            </template>
          </el-table-column>
          <el-table-column label="名称" min-width="60">
            <template slot-scope="scope">
              <span @click="see(scope.row)">{{scope.row.sfd_name | nothingFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column label="编码" min-width="60">
            <template slot-scope="scope">
              <span @click="see(scope.row)">{{scope.row.sfd_code | nothingFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column label="权重" min-width="50">
            <template slot-scope="scope">
              <span @click="see(scope.row)">{{scope.row.sfd_weight | nothingFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column label="字典值" min-width="50">
            <template slot-scope="scope">
              <el-select v-model="scope.row.sfd_sid" placeholder="请选择">
                <el-option v-for="(item, index) in scope.row.childrens" :key="item.sfd_id" :label="item.sfd_name"
                  :value="index">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100%">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑字典" placement="top-end">
                <el-button size="mini" @click="editDict(scope.row)"><i class="btniconfont iconcaozuotubiao-bianji"></i></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="添加值" placement="top-end">
                <el-button size="mini" @click="addValue(scope.row)">
                  <i class="btniconfont iconcaozuotubiao-tianjia-xuanfu"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑值" placement="top-end">
                <el-button size="mini" @click="editValue(scope.row.childrens[scope.row.sfd_sid])"><i class="btniconfont iconcaozuotubiao-chakan"></i></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
                <el-button size="mini" @click="handleDelete(scope.row)">
                  <i class="btniconfont iconcaozuotubiao-lizhi-xuanfu"></i>
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10" layout="total, prev, pager, next, jumper"
          :total="totalPage">
        </el-pagination>
      </el-col>
    </el-row>
    <el-row class="ybBanner">
      <el-dialog :title="titles[operate]" :visible.sync="dialogFormVisible">
        <el-row class="warp" v-loading="loading" id="">
          <el-col style="margin-top:20px;">
            <el-form label-width="120px" ref="dictForm" :model="dictForm" :rules="formRules">
              <el-row :gutter="20">
                <el-col :span="20">
                  <el-form-item label="名称：" prop="sfdName">
                    <el-input v-model="dictForm.sfdName" placeholder="请输入名称" :disabled="operate==3"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="20">
                  <el-form-item label="权重：" prop="sfdWeight">
                    <el-slider v-model="dictForm.sfdWeight" show-input></el-slider>
                  </el-form-item>
                </el-col>
                <el-col :span="20">
                  <el-form-item label="描述：" prop="sfdDesc">
                    <el-input type="textarea" v-model="dictForm.sfdDesc" placeholder="请输入名称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="20" v-if="operate==1">
                  <el-form-item label="状态：" prop="sfdStatus">
                    <el-checkbox v-model="dictForm.sfdStatus">删除</el-checkbox>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row style="text-align:center;margin:20px 0px 50px 0;" :gutter="10" type="flex" justify="center">
                <el-col class :xl="5" :lg="6">
                  <el-button v-bind:style="{'background':firstZhuTi,'color':'#fff'}" @click="saveDict()">保存</el-button>
                </el-col>
                <el-col class :xl="5" :lg="6">
                  <el-button @click="dialogFormVisible=false">关闭</el-button>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </el-dialog>
      <span>技术支持：有伴（上海）智能科技有限公司</span>
    </el-row>
  </div>
</template>
<script>
  import axios from "axios";
  import qs from "qs";
  import {ChineseToPinYin} from "@/common/js/pinyin.js";
  import {getShengXiao,getAstro,getAge} from "@/common/js/utils.js";

  export default {
    data() {
      return {
        loading: false,
        keyWord: '',
        operate: 0,
        titles: ["添加值", "编辑值", "添加字典", "修改字典"],
        dictForm: {
          sfdId: 0,
          sfdName: '',
          sfdDesc: '',
          sfdPid: 0,
          sfdWeight: 0,
          sfdStatus: 1
        },
        formRules: {
          sfdName: [{
            required: true,
            message: '此项必须填写',
            trigger: 'blur'
          }]
        },
        searchForm: {},
        dialogFormVisible: false
      };
    },
    computed: {
      tableData: {
        get() {
          return this.$store.getters.fireDictDatas;
        },
        set() {}
      },
      totalPage: {
        get() {
          return this.$store.getters.fireDictTotals;
        },
        set() {}
      },
      currentPage: {
        get() {
          return this.$store.getters.fireDictPages;
        },
        set() {}
      },
      firstZhuTi: {
        get() {
          return this.$store.getters.firstColors;
        },
        set() {}
      },
      secondZhuTi: {
        get() {
          return this.$store.getters.secondColors;
        },
        set() {}
      },
      thirdZhuTi: {
        get() {
          return this.$store.getters.thirdColors;
        },
        set() {}
      }
    },
    created() {},
    mounted() {
      this.flash();
      console.log(ChineseToPinYin("有伴"))
      console.log(getShengXiao("2019"))
      console.log(getAstro(2019,1,18))
      console.log(getAge("2019-1-18"))
    },
    methods: {
      /*刷新*/
      flash() {
        this.keyWord = '';
        this.handleCurrentChange(1);
      },
      /*查询第几页数据*/
      handleCurrentChange(val) {
        this.currentPage = val;
        let data = {
          keyword: this.keyWord,
          page: val,
          rows: 10
        };
        this.loading = true;
        axios
          .post("/fire/Info/querySysFireDict", qs.stringify(data))
          .then(res => {
            this.loading = false;
            if (res.data.code == "200") {
              let dataArray = res.data.data;
              dataArray.forEach(function(item) {
                if (item.childrens && item.childrens.length > 0) {
                  item.sfd_sid = 0;
                }
              });
              this.$store.commit("setFireDictPage", 1);
              this.$store.commit("setFireDictData", res.data.data);
              this.$store.commit("setFireDictTotal", res.data.total);
            } else if (res.data.code == "401") {
              this.$message({
                message: res.data.message,
                type: "warning"
              });
              this.$router.push("/login");
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch(err => {
            this.loading = false;
          });
      },
      // 增加字典
      addDict(data) {
        this.dictForm.sfdId = 0;
        this.dictForm.sfdName = '';
        this.dictForm.sfdDesc = '';
        this.dictForm.sfdPid = 0;
        this.dictForm.sfdWeight = 0;
        this.dictForm.sfdStatus = 1;
        this.operate = 2;
        this.dialogFormVisible = true;
      },
      // 编辑字典
      editDict(data) {
        this.dictForm.sfdId = data.sfd_id;
        this.dictForm.sfdName = data.sfd_name;
        this.dictForm.sfdDesc = data.sfd_desc;
        this.dictForm.sfdPid = data.sfd_pid;
        this.dictForm.sfdWeight = data.sfd_weight;
        this.operate = 3;
        this.dialogFormVisible = true;
      },
      // 增加值
      addValue(data) {
        this.dictForm.sfdId = 0;
        this.dictForm.sfdName = '';
        this.dictForm.sfdDesc = '';
        this.dictForm.sfdPid = data.sfd_id;
        this.dictForm.sfdWeight = 0;
        this.dictForm.sfdStatus = 1;
        this.operate = 0;
        this.dialogFormVisible = true;
      },
      // 编辑值
      editValue(data) {
        this.dictForm.sfdId = data.sfd_id;
        this.dictForm.sfdName = data.sfd_name;
        this.dictForm.sfdDesc = data.sfd_desc;
        this.dictForm.sfdPid = data.sfd_pid;
        this.dictForm.sfdWeight = data.sfd_weight;
        this.dictForm.sfdStatus = data.sfd_status;
        this.operate = 1;
        this.dialogFormVisible = true;
      },
      // 删除
      handleDelete(data) {
        this.$confirm('确认删除？')
          .then(_ => {
            this.loading = true;
            let params = {
              sfdId: data.sfd_id
            };
            axios
              .post("/fire/Info/deleSysFireDict", qs.stringify(params))
              .then(res => {
                this.loading = false;
                if (res.data.code == "200") {
                  let dataArray = res.data.data;
                  dataArray.forEach(function(item) {
                    if (item.childrens && item.childrens.length > 0) {
                      item.sfd_sid = 0;
                    }
                  });
                  res.data.total = 50;
                  this.$store.commit("setFireDictPage", 1);
                  this.$store.commit("setFireDictData", res.data.data);
                  this.$store.commit("setFireDictTotal", res.data.total);
                } else if (res.data.code == "401") {
                  this.$message({
                    message: res.data.message,
                    type: "warning"
                  });
                  this.$router.push("/login");
                } else {
                  this.$message.error(res.data.message);
                }
              })
              .catch(err => {
                this.loading = false;
              });
          })
          .catch(_ => {});
      },
      // 保存
      saveDict() {
        // validate检查表单的必填项
        this.$refs.dictForm.validate(valid => {
          if (valid) {
            this.loading = true;
            let params = Object.assign({}, this.dictForm);
            axios
              .post("/fire/Info/adddictionaries", qs.stringify(params))
              .then(res => {
                console.log(res);
                this.loading = false;
                if (res.data.code == "200") {
                  this.$store.commit("setFireDictData", res.data.data);
                  this.$store.commit("setFireDictTotal", res.data.total);
                  this.$message({
                    message: "配置成功",
                    type: "success"
                  });
                  this.dialogFormVisible = false;
                } else if (res.data.code == "401") {
                  this.$message({
                    message: res.data.message,
                    type: "warning"
                  });
                  this.$router.push("/login");
                } else {
                  this.$message.error(res.data.message);
                }
              });
          } else {
            this.$message({
              message: "还有必填项未填写",
              type: "error"
            });
          }
        })
      }
    },
    filters: {
      statusFilter: val => {
        if (val == 1) {
          val = "有效";
        } else if (val == 2) {
          val = "无效";
        }
        return val;
      }
    }
  };
</script>
<style scoped>
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
</style>
