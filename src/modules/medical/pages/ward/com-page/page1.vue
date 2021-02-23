
<template>
<div>
  <div class="header">
    <div class="building-box" 
      :class="currentBuilding == item ? 'default' : ''" 
      v-for="item in 3" 
      :key="item"
      @mouseover="setDefault(item)"
      @mouseleave="cancelDefault(item)"
      @click="clickBuilding(item)"
      >
      <i class="default" v-if="item == currentDefaultBuilding">默认</i>
      <i class="set" v-if="item == setDefaultIndexShow && item !== currentDefaultBuilding" @click.stop="setDefaultIndex(item)">设为默认</i>
      <p>{{item}}号楼</p>
    </div>
  </div>
  <div class="root1" v-for="data in 3" :key="data" v-show="currentBuilding == data">
    <SlickList :lockToContainerEdges="true" axis="y" lockAxis="y" v-model="items" class="SortableList" @input="getChangeLists">
      <SlickItem v-for="(item, index) in items" class="SortableItem" :index="index" :key="index">
        <i v-if="index == 0">默认</i>
        <p class="floor-name">{{ item.name }}</p>
        <div class="root2">
          <SlickList :lockToContainerEdges="true" class="list" axis="x" lockAxis="x" v-model="item.itemArr">
            <SlickItem class="list-item" v-for="(i, index2) in item.itemArr" :index="index2" :key="index2">
              <i v-if="index2 == 0">启始</i>
              <p>{{ i }}</p>
              <i v-if="index2 == item.itemArr.length-1">结束</i>
            </SlickItem>
          </SlickList>
        </div>
      </SlickItem>
    </SlickList>
  </div>
</div>
</template>
 
<script>
import { SlickList, SlickItem } from 'vue-slicksort'
export default {
  name: 'Example',
  components: {
    SlickItem,
    SlickList
  },
  data () {
    return {
      currentBuilding: 2, // 当前点击的楼栋
      setDefaultIndexShow: 0, // 当前在哪号楼hover
      currentDefaultBuilding: 1, // 当前默认是几号楼
      flag: true,
      items: [
        {
          name: '一楼',
          itemArr: ['1101', '1102', '1103', '1102', '1103', '1102', '1103', '1102', '1103', '1102', '1103', '1102', '1103', '1102', '1103', '1102', '1103']
        },
        {
          name: '二楼',
          itemArr: ['1101', '1102', '1103']
        },
        {
          name: '三楼',
          itemArr: ['1101', '1102', '1103', '1102', '1103']
        }
      ]
    }
  },
  methods: {
    getChangeList (val) {
      console.log(val, 'val')
    },
    getChangeLists (vals) {
      console.log(vals, 'vals')
    },
    // 鼠标移入
    setDefault(index) {
      this.setDefaultIndexShow = index
    },
    // 鼠标移出
    cancelDefault(index) {
      this.setDefaultIndexShow = 0;
    },
    // 设为默认
    setDefaultIndex(index) {
      this.currentDefaultBuilding = index;
    },
    // 切换楼栋
    clickBuilding(index) {
      this.currentBuilding = index;
    }
  }
}
</script>

<style lang="less" scoped>
div{
  box-sizing: border-box;
}
.header {
  display: flex;
  margin: 0 0 10px 0;
  .building-box {
    width: 150px;
    height: 36px;
    text-align: center;
    line-height: 36px;
    font-size: 18px;
    color: #333300;
    border-radius: 4px;
    margin: 0 20px 0 0;
    position: relative;
    i{
      position: absolute;
      top: 2px;
      left: 3px;
      font-style: normal;
      background-color: #35449A;
      font-size: 10px;
      color: #FFFFFF;
      text-align: center;
      line-height: 16px;
    }
    .default {
      width: 24px;
      height: 16px;
    }
    .set {
      transform: scale(.85);
      height: 18px;
      color: #3F51B5;
      background-color: #fff;
      border-radius: 2px;
      border: 1px solid #3F51B5;

    }
  }
  .building-box:hover{
    border: 1px solid #EEEEEE;
  }
  .building-box.default {
    background-color: #3F51B5;
    color: #fff;
  }
}

</style>

<style  scoped>
.root1 {
  width: 100%;
  display: flex;
  height: 100%;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.floor-name {
  font-size: 16px;
  color: rgba(0,0,0,0.65);
  text-align: left;
}
.root2 {
  display: flex;
  height: 100%;
}
.stylizedHelper {
  background: blue;
  color: #fff
}
.SortableList {
  display: flex;
  flex-direction: column;
}
.SortableItem {
  display: flex;
  flex-direction: column;
  align-items: left;
  border: 1px solid rgba(0,0,0,0.04);
  box-shadow: 0 2px 6px 0 rgba(0,0,0,0.04);
  border-radius: 4px;
  margin: 0 0 20px;
  padding: 10px 20px 2px;
  position: relative;
}
.SortableItem>i {
  font-style: normal;
  position: absolute;
  right: 20px;
  top: 10px;
  background-color: #ccc;
  color:#fff;
  width: 40px;
  height: 24px;
  text-align: center;
  line-height: 24px;
  border-radius: 2px;
  font-size: 14px;
}
.list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 126px;
  height: 88px;
  background: #FFFFFF;
  border: 1px solid #EEEEEE;
  margin: 0 18px 18px 0;
  position: relative;
}
.list-item i {
  font-style: normal;
  background-color: #CCCCCC;
  font-size: 12px;
  color: #FFFFFF;
  text-align: center;
  line-height: 16px;
}
.list-item i:nth-child(1) {
  position: absolute;
  top: 2px;
  left: 2px;

}
.list-item i:nth-child(2) {
  position: absolute;
  right: 2px;
  bottom: 2px;
}
</style>