<template>
  <view>
    <block v-if="content">
      <!-- 动态遍历所有投注类型 -->
      <template v-for="(oddsList, oddsType) in content">
        <view v-if="isValidOddsList(oddsList)" :key="oddsType">
          <view v-for="(item, index) in oddsList" :key="oddsType + '-' + index" class="bet-item"
            :style="[
              oddsType === 'notLetOddsList' && item.describe == award[0] ? { color: 'red' } : {},
              oddsType === 'letOddsList' && item.describe == award[1] ? { color: 'red' } : {},
              oddsType === 'goalOddsList' && item.describe == award[2] ? { color: 'red' } : {},
              oddsType === 'halfWholeOddsList' && item.describe == award[3] ? { color: 'red' } : {},
              oddsType === 'scoreOddsList' && item.describe == award[4] ? { color: 'red' } : {},
            ]"
          >
            <view>{{ getPrefixByType(oddsType) }}{{ item.describe }}</view>
            <view class="odds">({{ item.odds }})</view>
          </view>
        </view>
      </template>
    </block>
  </view>
</template>

<script>
export default {
  name: 'ball-content',
  props: {
    content: {
      type: Object,
      default: () => ({})
    },
    award: {
      type: Array,
      default: () => ({})
    }
  },
  created() {
    console.log('ball-content', this.content, this.award);
  },
  methods: {
    // 判断是否为有效的赔率列表
    isValidOddsList(oddsList) {
      return Array.isArray(oddsList) && oddsList.length > 0;
    },
    // 根据投注类型获取前缀
    getPrefixByType(type) {
      const prefixMap = {
        'notLetOddsList': '', // 胜平负
        'letOddsList': '让', // 让球胜平负
        'scoreOddsList': '', // 比分
        'goalOddsList': '总进球:', // 总进球
        'halfWholeOddsList': '半全场:', // 半全场
        // 可以根据需要添加更多类型


        // 篮球
        'winNegativeOddsList': '',
        'cedePointsOddsList': '',
        'sizeOddsList': '',
        'differenceOddsList': '',
        'halfFullCourtOddsList': ''
      };


      return prefixMap[type] || '';
    }
  }
}
</script>

<style>
.bet-item {
  margin-bottom: 4rpx;
}

.odds {
  color: #999;
  font-size: 24rpx;
}
</style>