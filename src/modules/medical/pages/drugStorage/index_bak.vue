<template>
    <div class="yz-desktop">
        <div class="top">
            <div class="left">
                <div v-for="(item, i) in tabs" :key="i" :class="{ cur: iscur == i }" @click="tabChange(item.name,i)">
                    <span>{{ item.text }}</span>
                </div>
            </div>
        </div>
        <div class="content">
            <!-- <component v-bind:is="tabView"></component> -->
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive">
                </router-view>
            </keep-alive>

            <router-view v-if="!$route.meta.keepAlive">
                <router-view />
            </router-view>
        </div>
    </div>
</template>

<script type="text/javascript">
export default {
    name: "rules",
    filters: {},
    created() {
        console.log(location.pathname);
        let data = window.location.pathname;
        switch (data) {
            case "/medical/drugStorage/storeCheck":
                this.tabView = "page1";
                this.iscur = 0;
                break;
            case "/medical/drugStorage/purchaseStore":
            case "/medical/drugStorage/purchaseDetail":
            case "/medical/drugStorage/addPurchaseDan":
                this.tabView = "page2";
                this.iscur = 1;
                break;
            case "/medical/drugStorage/unInstoreList":
            case "/medical/drugStorage/unInstoreDetail":
                this.tabView = "page3";
                this.iscur = 2;
                break;
            case "/medical/drugStorage/medicine":
            case "/medical/drugStorage/addMedicine":
                this.tabView = "page4";
                this.iscur = 3;
                break;
            case "/medical/drugStorage/warehouse":
            case "/medical/drugStorage/kuWeiList":
            case "/medical/drugStorage/addStore":
                this.tabView = "page5";
                this.iscur = 4;
                break;
            case "/medical/drugStorage/supplierList":
            case "/medical/drugStorage/addSupplier":
            case "/medical/drugStorage/editSupplier":
                this.tabView = "page6";
                this.iscur = 5;
                break;

            default:
                break;
        }
    },
    data() {
        return {
            tabView: "page1",
            iscur: 0,
            tabs: [
                {
                    text: "库存查询",
                    name: "page1"
                },
                {
                    text: "采购入库",
                    name: "page2"
                },
                // {
                //     text: "药品出库",
                //     name: "page3"
                // },
                {
                    text: "药品管理",
                    name: "page4"
                },
                // {
                //     text: "仓库管理",
                //     name: "page5"
                // },
                {
                    text: "供应商",
                    name: "page6"
                }
            ]
        };
    },
    methods: {
        tabChange: function(tab, index) {
            this.iscur = index;
            let url = "/medical/drugStorage/";
            switch (tab) {
                case "page1":
                    url += "storeCheck";
                    break;
                case "page2":
                    url += "purchaseStore";
                    break;
                case "page3":
                    url += "unInstoreList";
                    break;
                case "page4":
                    url += "medicine";
                    break;
                case "page5":
                    url += "warehouse";
                    break;
                case "page6":
                    url += "supplierList";
                    break;

                default:
                    break;
            }
            this.$router.push({ path: url });
        }
    }
};
</script>

<style lang="less" scoped>
.yz-desktop {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    .top {
        position: fixed;
        width: 100%;
        top: 60px;
        z-index: 1;
        padding: 15px 20px 15px 20px;
        box-sizing: border-box;
        background-color: #fff;
        display: flex;
        height: 70px;
        .left {
            display: flex;
            flex: 1;
            div:hover {
                background-color: rgba(0, 0, 0, 0.04);
            }
            div {
                box-sizing: border-box;
                cursor: pointer;
                width: 95px;
                height: 40px;
                text-align: center;
                line-height: 40px;
                font-size: 16px;
                border-radius: 4px;
                margin-right: 20px;
                position: relative;
                .iconfont {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    display: inline-block;
                    width: 16px;
                    line-height: 40px;
                }
                span {
                }
            }
            div.cur {
                background-color: #4687e1;
                color: rgba(255, 255, 255, 1);
            }
        }
    }
    .content {
        margin-top: 70px;
        flex: 1;
        box-sizing: border-box;
        height: 100%;
        width: 100%;
        padding: 12px;
    }
}
</style>
