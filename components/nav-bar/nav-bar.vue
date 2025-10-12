<template>
	<!-- 头部导航栏 -->
	<view>
		<!-- 支付宝会出现二个导航栏所以这里直接去掉 -->
		<!-- #ifndef MP-ALIPAY-->
		<cmd-nav-bar ref="cmdNavBar" :left-text="leftText" @leftText="leftTextClick" :right-text="rightText"
			@rightText="rightTextClick" @iconOne="leftIconClick" :back="back" :title="title" font-color="#fff"
			background-color="var(--themeColor)">
		</cmd-nav-bar>
		<!-- #endif -->
		<!-- 添加占位元素，防止内容被遮挡 -->
		<view v-if="fixed" :style="{ height: `${navBarHeight}px` }"></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			navBarHeight: 0,
		}
	},
	props: {
		title: String,
		back: {
			type: Boolean,
			default: false
		},
		leftText: {
			type: String,
			default: ""
		},
		rightText: {
			type: String,
			default: ""
		},
		fixed: {
			type: Boolean,
			default: true
		}
	},
	mounted() {
		this.$nextTick(() => {
			const query = uni.createSelectorQuery().in(this);
			query.select('.cmd-nav-bar-fixed').boundingClientRect((rect) => {
				this.navBarHeight = rect.height;
				console.log('子元素的高度:', rect.height); // 获取更新后的高度
			}).exec();
		})
	},
	methods: {
		leftTextClick() {
			this.$emit('leftTextClick');
		},
		rightTextClick() {
			this.$emit('rightTextClick');
		},
		leftIconClick() {
			// 发送backClick事件
			this.$emit('backClick');
			// 如果没有外部监听器处理，则执行默认返回行为
			if (!this.$listeners || !this.$listeners.backClick) {
				uni.navigateBack();
			}
		}
	}
}
</script>