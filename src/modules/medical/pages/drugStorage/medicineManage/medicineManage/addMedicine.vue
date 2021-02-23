<template>
  <div>
    <el-form ref="ruleForm" :model="form" label-width="100px" :rules="rules">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="first">
          <div class="topContent1">
            <div class="back">
              <p class="bgcolor"></p>
              <p class="backTextT">基本信息</p>
            </div>
            <el-row gutter="10">
              <el-col :span="20">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="包装条码" prop="barCode">
                      <el-input v-model.trim="form.barCode" placeholder="包装条码（非监管码）" style="width:80%;" clearable></el-input>
                      <span class="unit">
                        <el-tooltip effect="light" placement="right-start">
                          <div slot="content"><img :src="barExample" height="150px" /></div>
                          <i class="el-icon-question" style="font-size:20px;"></i>
                        </el-tooltip>
                      </span>
                      </el-tooltip>
                      <span class="help-block">建议填写，可用于快速打码出入库</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="药品编码" prop="no">
                      <el-input v-model.trim="form.no" placeholder="药品编（代）码"></el-input>
                      <span class="help-block">药品编码，用于内部管理</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="药品类型" prop="type">
                      <el-radio-group v-model.trim="form.type" @change="typeChanged">
                        <el-radio v-for="item in types" :label="item" :key="item">{{item}}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item prop="source" label="是否院内药">
                      <el-radio-group v-model.trim="form.source" :disabled="form.source==1 && form.availableCount >0 || form.lockedCount >0">
                        <el-radio v-for="item in sources" :label="item.id" :key="item.id">{{item.name}}</el-radio>
                      </el-radio-group>
                      <span class="unit">
                        <el-tooltip effect="light" placement="top">
                          <div slot="content" style="width:300px;">院内药是指院内药房自有药品，可用于出入库、盘点、登记、处方开药等全部场景；<br />非院内药是指外配药或者自备药，可用于代发药品登记，处方开药等场景，但不可用于药房仓存管理。</div>
                          <i class="el-icon-question" style="font-size:20px;"></i>
                        </el-tooltip>
                      </span>
                      <span class="help-block" v-if="form.source==1 && form.availableCount >0 || form.lockedCount >0">此药品院内库存不为0，不可以修改为非院内药</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="药品通用名" prop="commonName">
                      <el-input v-model.trim="form.commonName" placeholder="请输入通用名称" @change="toPinYin()" maxlength="50" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="商品名" prop="name">
                      <el-input v-model.trim="form.name" placeholder="请输入商品名" clearable maxlength="50"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="分类" prop="category">
                      <el-select v-model.trim="form.category" placeholder="请选择" :disabled="form.type == '中草药'">
                        <el-option v-for="item in categories" :key="item" :label="item" :value="item"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="剂型" prop="doseType">
                      <el-input v-model.trim="form.doseType" placeholder="如：片剂，针剂，颗粒剂" clearable></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="包装单位" prop="packageUnit">
                      <el-select v-model.trim="form.packageUnit" placeholder="请选择">
                        <el-option v-for="item in packageUnits" :key="item" :label="item" :value="item"></el-option>
                      </el-select>
                      <span class="help-block">药品最小整体包装单位，如：盒</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="包装内含数量" prop="unitCount">
                      <el-input-number v-model.trim="form.unitCount" placeholder="请输入包装内含数量" controls-position="right" :min="1"></el-input-number>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="制剂单位" prop="useUnit">
                      <el-select v-model.trim="form.useUnit" placeholder="请选择">
                        <el-option v-for="item in useUnits" :key="item" :label="item" :value="item"></el-option>
                      </el-select>
                      <span class="help-block">药品最小制剂单位，如：片，粒，支等</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="单位剂量" prop="minCount">
                      <input class="el-input__inner" v-model.trim.trim="form.minCount" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="请输入单位剂量" />
                      <span class="help-block">最小制剂单位所含剂量，如：0.25mg。</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="" prop="minUnit" label-width="8px">
                      <el-select v-model.trim="form.minUnit" placeholder="选择剂量单位">
                        <el-option v-for="item in minUnits" :key="item" :label="item" :value="item"></el-option>
                      </el-select>
                      <span class="help-block">剂量单位同时也是此药品处方开药首选单位</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="规格" prop="standard">
                      <el-input v-model.trim="form.standard" placeholder="如：50mg*24片/盒" clearable></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="生产企业" prop="vendorName">
                      <el-input v-model.trim="form.vendorName" placeholder="请输入生产企业" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="批准文号" prop="approvalNo">
                      <el-input v-model.trim="form.approvalNo" placeholder="请输入批准文号" clearable></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>

                  <el-col :span="12">
                    <el-form-item label="有效期" prop="expiry">
                      <el-input-number v-model.trim="form.expiry" placeholder="请输入有效期" controls-position="right" :min="1" :max="999"></el-input-number>
                      <span class="unit">个月</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="助记码" prop="pinyin">
                      <el-input v-model.trim="form.pinyin" placeholder="请输入助记码" clearable maxlength="30"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="4" style="text-align:center">
                <ub-picture v-model="form.iconUrl" :description="'上传药品包装图片'"></ub-picture>
                <div>药品包装图片</div>
              </el-col>
            </el-row>
          </div>
          <!-- <div class="topContent1">
        <div class="back">
          <p class="bgcolor"></p>
          <p class="backTextT">用药方法</p>
        </div>
        <el-row>
          <el-col :span="20">
            <el-row>
              <el-col :span="12">
                <el-form-item label="给药途径" prop="useWay">
                  <el-select v-model.trim="form.useWay" placeholder="请选择">
                    <el-option v-for="item in ways" :key="item.name" :label="item.name" :value="item.name"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="使用频次" prop="useInterval">
                  <el-select v-model.trim="form.useInterval" placeholder="请选择">
                    <el-option v-for="item in rates" :key="item.name" :label="item.name" :value="item.name"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="常规单次剂量" prop="useCount">
                  <el-input v-model.trim="form.useCount" placeholder="请输入用药剂量" clearable>
                    <template slot="append" v-if="form.useUnit">{{form.useUnit}}</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <span style="display: inline-block;vertical-align: middle;margin-left: 16px;" v-if="form.useCount && form.minUnit && form.minCount">={{form.minCount * form.useCount}}{{form.minUnit}}</span>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div> -->
          <div class="topContent1">
            <div class="back">
              <p class="bgcolor"></p>
              <p class="backTextT">价格信息</p>
            </div>
            <el-row>
              <el-col :span="20">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="采购单价" prop="purchasePrice">
                      <input class="el-input__inner" v-model.trim.trim="form.purchasePrice" oninput="value=value.replace(/[^0-9.]/g,'')" placeholder="请输入采购单价" style="width:60%">
                      <span class="unit">元</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="销售单价" prop="sellingPrice">
                      <input class="el-input__inner" v-model.trim.trim="form.sellingPrice" oninput="value=value.replace(/[^0-9.]/g,'')" placeholder="请输入药品售价" style="width:60%">
                      <span class="unit">元</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
          <div class="topContent1">
            <div class="back">
              <p class="bgcolor"></p>
              <p class="backTextT">医保信息</p>
            </div>
            <el-row>
              <el-col :span="20">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="医保甲乙分类" prop="insuranceCategory">
                      <el-select v-model.trim="form.insuranceCategory" placeholder="请选择">
                        <el-option v-for="item in insuranceCategories" :key="item" :label="item" :value="item"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="自付比例" prop="expenseRate">
                      <input class="el-input__inner" v-model.trim="form.expenseRate" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="" min="0" max="100" style="width: 80%;" />
                      <span class="unit">%</span>
                      <span class="help-block">需病人自付的比例，<span style="color:#FF6600;">留空代表0%，无需自付</span></span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
          <div class="topContent1">
            <el-row>
              <div class="back">
                <p class="bgcolor"></p>
                <p class="backTextT">药房库位</p>
              </div>
              <el-col :span="20">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="安全库存" prop="minStocks">
                      <el-input-number v-model.trim="form.minStocks" placeholder="请输入安全库存" controls-position="right" :min="1" :max="99999"></el-input-number>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="存放库位" prop="location">
                      <el-input v-model.trim="form.location" placeholder="药品存放库位名称，如A01~A03"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="使用说明" name="second">
          <div class="topContent1">
            <div class="back">
              <p class="bgcolor"></p>
              <p class="backTextT">基本信息</p>
            </div>
            <el-row>
              <el-col :span="24">
                <el-form-item label="用法用量" prop="useWay">
                  <el-input type="textarea" v-model.trim="form.useWay" placeholder="" rows="8" maxlength="500" show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="适应症/功能" prop="indication">
                  <el-input type="textarea" v-model.trim="form.indication" placeholder="" rows="8" maxlength="500" show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="不良反应" prop="adr">
                  <el-input type="textarea" v-model.trim="form.adr" placeholder="" rows="8" maxlength="500" show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="禁忌" prop="taboo">
                  <el-input type="textarea" v-model.trim="form.taboo" placeholder="" rows="8" maxlength="500" show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="注意事项" prop="notes">
                  <el-input type="textarea" v-model.trim="form.notes" placeholder="" rows="8" maxlength="500" show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="说明书照片" prop="pictures">
                  <ubPictures :showDelete="true" v-model="form.pictures" :span="4" :limit="5" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        </el-tab-pane>
      </el-tabs>

    </el-form>
  </div>
</template>
<script>
import pinyin from "@/utils/pinyin";
import ubPicture from "@/components/picture";
import ubPictures from "@/components/pictures";

export default {
  components: { ubPicture, ubPictures },
  props: ["id"],
  data() {
    return {
      barExample: require("../../../../../../assets/images/bar-example.png"),
      activeName: "first",
      form: { type: "", packageUni: "", category: "", useUnit: "", pinyin: "" },
      show4: false,
      showMore1: false,
      showMore2: false,
      pinyin: "",
      ways: null,
      rates: null,
      categories: [],
      packageUnits: null,
      useUnits: null,
      minUnits: null,
      types: ["西药", "中成药", "中草药"],
      sources: [
        { id: 1, name: "是" },
        { id: 2, name: "否" },
      ],
      insuranceCategories: ["甲", "乙", "丙"],
      zanshiHead: "",
      havePic: 0,
      userPic: "",
      rules: {
        commonName: [
          {
            required: true,
            message: "请输入通用名称",
            trigger: ["blur", "change"],
          },
        ],
        category: [
          {
            required: true,
            message: "请选择分类",
            trigger: ["blur", "change"],
          },
        ],
        standard: [
          {
            required: true,
            message: "请输入规格",
            trigger: ["blur", "change"],
          },
        ],
        packageUnit: [
          {
            required: true,
            message: "请输入包装单位",
            trigger: ["blur", "change"],
          },
        ],
        useUnit: [
          {
            required: true,
            message: "请输入用药单位",
            trigger: ["blur", "change"],
          },
        ],
        purchasePrice: [
          {
            required: true,
            message: "请输入采购单价",
            trigger: ["blur", "change"],
          },
        ],
        sellingPrice: [
          {
            required: true,
            message: "请输入售价",
            trigger: ["blur", "change"],
          },
        ],
        type: [
          {
            required: true,
            message: "请选择类型",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  created() {
    axios
      .fetch(
        "medicalServer",
        "/api/advice/excute/medicine-units",
        null,
        null,
        "get"
      )
      .then((res) => {
        let resData = res.data;
        this.packageUnits = resData.packageUnits;
        this.useUnits = resData.useUnits;
        this.minUnits = resData.minUnits;
      });

    axios
      .fetch("medicalServer", "/api/advice/options", null, null, "get")
      .then((res) => {
        let resData = res.data;
        this.ways = resData.ways;
        this.rates = resData.rates;
      });

    axios
      .fetch("medicalServer", "/api/medicine/categories", null, null, "get")
      .then((res) => {
        this.categories = res.data;
      });
    this.form = { type: "西药", source: 1 };
    if (this.id && this.id !== "") {
      this.init();
    }
  },
  methods: {
    toPinYin() {
      let value = pinyin.getFullChars(this.form.commonName);
      if (value.length > 30) {
        value = value.substring(0, 30);
      }
      this.$set(this.form, "pinyin", value);
    },
    typeChanged() {
      if (this.form.type == "中草药") {
        this.$set(this.form, "packageUnit", "克");
        this.$set(this.form, "category", "未分类");
        this.$set(this.form, "useUnit", "克");
      }
    },
    init() {
      axios
        .fetch("medicalServer", "/api/medicine/" + this.id, null, null, "get")
        .then((res) => {
          this.form = res.data;
        });
    },

    moreInfo(index) {
      this.showMore1 = !this.showMore1;
      this.show4 = !this.show4;
    },
    changepic() {
      this.havePic = 1;
      let that = this;
      var reads = new FileReader();
      var f = document.getElementById("file").files[0];
      reads.readAsDataURL(f);
      reads.onload = function (e) {
        that.form.iconFile = this.result;
        document.querySelector(".img10").src = that.form.iconFile;
        that.zanshiHead = 1;
      };
      this.showDash = 0;
      this.userPic = f;
    },
    dataURLtoBlob(dataurl) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = new ArrayBuffer(bstr.length),
        u8arr = new Uint8Array(n);
      for (var i = 0; i < bstr.length; i++) {
        u8arr[i] = bstr.charCodeAt(i);
      }
      return new Blob([n], {
        type: mime,
      });
    },
    submitForm() {
      var params = {};
      if (this.form.iconFile && this.form.iconFile != "") {
        if (this.form.iconFile.indexOf("base64") > 0) {
          this.userPic = this.dataURLtoBlob(this.form.iconFile);
          params.iconFile = this.userPic;
        }
      }
      params = Object.assign(params, this.form);
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) {
          this.$message.warning("请先完善药品信息！");
          return true;
        } else {
          axios
            .fetch("medicalServer", "/api/medicine", params, "json")
            .then((res) => {
              this.$message.success("保存成功");
              this.$emit("saved");
            });
        }
      });
    },
  },
};
</script>
<style scoped>
.back {
  height: 40px;
  background: rgba(251, 251, 252, 1);
  border-radius: 5px 5px 0px 0px;
  border-bottom: 1px solid rgba(221, 221, 221, 1);
  padding: 10px 0 0 20px;
  margin-bottom: 30px;
}

.bgcolor {
  width: 6px;
  height: 25px;
  background: rgba(243, 105, 105, 1);
  border-radius: 3px;
  float: left;
  margin-right: 10px;
}
.unit {
  margin-left: 8px;
}
</style>