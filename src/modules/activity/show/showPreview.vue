<template>
  <div>
    <div id="notice-container">
      <div id="notice-main">
        <div class="article-content">
          <div>
            <span class="title">
              {{form.title}}
            </span>
          </div>
          <div class="tool-bar">
            <span>{{dateformt(form.createTime)}}</span>
          </div>
          <div v-html="form.content">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  props: {
    value: {
      type: Number,
      default() {
        return null;
      },
    },
  },
  data() {
    let that = this;
    return {
      loading: false,
      form: {},
    };
  },

  components: {},
  computed: {
    ...mapGetters(["tenant"]),
    id: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  watch: {},
  filters: {},
  mounted() {},
  created() {
    this.init();
  },
  methods: {
    init() {
      axios
        .fetch(
          "activityServer",
          "/api/project/show/" + this.id,
          null,
          null,
          "get"
        )
        .then((res) => {
          this.form = res.data;
        });
    },
    dateformt(data) {
      if (data) {
        return (
          data.substr(0, 4) +
          "年" +
          data.substr(5, 2) +
          "月" +
          data.substr(8, 2) +
          "日"
        );
      }
    },
  },
};
</script>
<style scoped>
.title {
  color: rgb(55, 71, 79);
  display: inline-block;
  font-family: "Arial Negreta", "Arial Normal", Arial, sans-serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: normal;
  line-height: 28px;
  text-align: center;
  width: 100%;
  text-rendering: optimizeLegibility;
  text-transform: none;
  word-wrap: break-word;
}

.article-content {
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  width: 960px;
  min-height: 650px;
  word-wrap: break-word;
  overflow: hidden;
}
.article-content img {
  width: 100%;
}
.tool-bar {
  margin: 16px 0px;
  padding-bottom: 16px;
  border-bottom: 1px dashed #d5d5d5;
  text-align: center;
}
.tool-bar span {
  margin-right: 20px;
}

#notice-container {
  margin: 0px auto;
  height: 100%;
  display: flex;
  /* padding-bottom: 16px;
  padding-top: 16px; */
  justify-content: center;
}
#notice-aside {
  min-height: 300px;
  width: 220px;
  margin-left: 16px;
  display: flex;
  border-radius: 8px;
  padding: 16px;
}
#notice-main {
  width: 960px;
  display: flex;
  border-radius: 8px;
}
.aside-title {
  padding: 8px 0px 8px 0px;
}
.aside-title span:nth-child(1) {
  border-left: 4px solid rgba(166, 178, 189, 1);
  margin-right: 5px;
}
.aside-title span:nth-child(2) {
  font-weight: 600;
}
.aside-content p {
  height: 8px;
  margin-top: 0px;
}
img {
  border: 0;
  display: inherit;
}
</style>