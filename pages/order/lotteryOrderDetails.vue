<template>
	<!-- 购彩订单详情列表 -->
	<view class="box"   :class="schemeDetailsShow ? 'tl-show': ''">
		<nav-bar :title="'订单详情'" :back="true" @backClick="backClick"></nav-bar>

		<view class="info">
			<view style="display: flex;justify-content: space-around;align-items: center;padding-top: 40px">
				<view>
					<p clsaa="data">{{ lotteryOrder.winPrice | formatWinPrice }}</p>
					<p class="font">中奖金额</p>
				</view>
				<view>
					<p clsaa="data">{{ lotteryOrder.state | formatState }}</p>
					<p class="font">订单状态</p>
				</view>
				<view>
					<p clsaa="data">{{ lotteryOrder.price }}元</p>
					<p class="font">投注金额</p>
				</view>
			</view>
			<view style="padding-top: 15px;"
				v-if="![0, 8].includes(Number(lotteryOrder.state)) && ['0', '1'].includes(lotteryOrder.type)">
				<u-button size="normal" shape="circle" customStyle="color:#000;width:92%;height:35px" color="#fff">
					预测奖金：<span style="color:var(--themeColor)">￥{{ lotteryOrder.minForecast.toFixed(2) }} - ￥{{ lotteryOrder.forecast.toFixed(2) }}</span>
				</u-button>
			</view>
		</view>
		<!-- 移除单一上传票据按钮 -->
		<view class="body px-20 mt-20 pb-100">
			<!-- 排列三 -->
			<arrange-three-card v-if="lotteryOrder.type == '3'" :lotteryOrder="lotteryOrder"></arrange-three-card>
			<!-- 排列五 -->
			<five-number-card v-if="lotteryOrder.type == '4'" :lotteryOrder="lotteryOrder"></five-number-card>
			<!-- 七星彩 -->
			<seven-star-card v-if="lotteryOrder.type == '5'" :lotteryOrder="lotteryOrder"></seven-star-card>
			<!-- 大乐透 -->
			<lottery-card v-if="lotteryOrder.type == '8'" :lotteryOrder="lotteryOrder"></lottery-card>
			<!-- 福彩 >9 -->
			<welfare-card v-if="lotteryOrder.type == '9' || lotteryOrder.type == '10' || lotteryOrder.type == '11' || lotteryOrder.type == '12'" :lotteryOrder="lotteryOrder"></welfare-card>
			<!-- 竞彩足球 -->
			<football-card v-if="lotteryOrder.type == '0'" :lotteryOrder="lotteryOrder"></football-card>
			<!-- 竞彩篮球 -->
			<basketball-card v-if="lotteryOrder.type == '1'" :lotteryOrder="lotteryOrder"></basketball-card>
			<!-- 北单 -->
			<north-single-card v-if="['2', '13'].includes(lotteryOrder.type)" :lotteryOrder="lotteryOrder"></north-single-card>
			<!-- 胜负彩和任选9 -->
			<victory-defeat-card v-if="['6', '7'].includes(lotteryOrder.type)" :lotteryOrder="lotteryOrder"></victory-defeat-card>
		   <view class="c-999 fs-30 w-full flex items-center justify-center my-20" @click="schemeDetailsShow=true" v-if="![0, 8].includes(Number(lotteryOrder.state)) && ['0', '1'].includes(lotteryOrder.type)">
				<view class="underline-btn"><span v-if="lotteryOrder.bonusOptimization > 0">优化</span>拆单明细</view>
			</view>

			<!-- lotteryOrder -->
			<u-popup :show="schemeDetailsShow" mode="center" :round="0" @close="schemeDetailsShow=false" :closeable="false" @touchmove.stop.prevent="()=>{}" @tap.stop="" :safe-area-inset-bottom="true" :overlay="true" :custom-style="{width: '100%', height: '100%'}">
				<view class="scheme-details-popup">
					<view class="scheme-details-header">
						<view class="close-btn" @click="schemeDetailsShow=false">
							<u-icon name="arrow-left" color="#333" size="28"></u-icon>
						</view>
						<view class="popup-title">方案详情</view>
					</view>
					<view class="scheme-details-content">
						<scheme-details :lotteryOrder="lotteryOrder"></scheme-details>
					</view>
				</view>
			</u-popup>

			<!-- 合买详情 -->
			<uni-card is-shadow class="phone" v-if="hasGroupPurchase === 1">
				<view class="group-purchase-title">
					<text class="title-text">合买详情</text>
				</view>

				<!-- 合买基本信息 -->
				<view class="group-purchase-info" v-if="jointPurchaseDetail">
					<view class="info-item">
						<text class="label">发起人：</text>
						<text class="value">{{ jointPurchaseDetail.creatorStoreRemark || jointPurchaseDetail.creatorNickname || '未知' }}</text>
					</view>
					<view class="info-item">
						<text class="label">方案金额：</text>
						<text class="value">{{ jointPurchaseDetail.totalAmount || 0 }}元</text>
					</view>
					<view class="info-item">
						<text class="label">进度：</text>
						<view class="progress-wrapper">
							<u-line-progress :percentage="jointPurchaseDetail.progress || 0" height="20"
								:show-text="false"></u-line-progress>
							<text class="progress-text">{{ jointPurchaseDetail.progress || 0 }}%</text>
						</view>
					</view>
					<view class="info-item">
						<text class="label">保底：</text>
						<text class="value">{{ jointPurchaseDetail.guaranteeAmount || 0 }}元 ({{ jointPurchaseDetail.guaranteeRatio
							|| 0
							}}%)</text>
					</view>
					<view class="info-item">
						<text class="label">状态：</text>
						<text class="value" :class="{
							'status-success': jointPurchaseDetail.status === 1,
							'status-waiting': jointPurchaseDetail.status === 0,
							'status-failed': jointPurchaseDetail.status === 2
						}">
							{{ jointPurchaseDetail.statusDesc || '未知' }}
						</text>
					</view>
					<view class="info-item">
						<text class="label">认购人数：</text>
						<text class="value">{{ jointPurchaseDetail.subscriberCount || 0 }}人</text>
					</view>
					<view class="info-item">
						<text class="label">下单时间：</text>
						<text class="value">{{ jointPurchaseDetail.createTime || '未知' }}</text>
					</view>
					<view class="info-item" v-if="jointPurchaseDetail.description">
						<text class="label">合买宣言：</text>
						<text class="value description-text">{{ jointPurchaseDetail.description }}</text>
					</view>
					<view class="info-item" v-if="jointPurchaseDetail.winStatus > 0">
						<text class="label">中奖状态：</text>
						<text class="value" :class="{ 'status-success': jointPurchaseDetail.winStatus === 2 }">
							{{ jointPurchaseDetail.winStatus === 1 ? '未中奖' : jointPurchaseDetail.winStatus === 2 ? '已中奖' : '未开奖' }}
						</text>
					</view>
					<view class="info-item" v-if="jointPurchaseDetail.winStatus === 2">
						<text class="label">中奖金额：</text>
						<text class="value status-success">{{ jointPurchaseDetail.winAmount || 0 }}元</text>
					</view>
				</view>

				<!-- 认购列表 -->
				<view class="subscription-list"
					v-if="jointPurchaseDetail && jointPurchaseDetail.subscriptionList && jointPurchaseDetail.subscriptionList.length > 0">
					<view class="list-title">认购列表</view>
					<view class="list-header">
						<text class="header-item">认购人</text>
						<text class="header-item">认购金额</text>
						<text class="header-item">认购比例</text>
						<text class="header-item">认购时间</text>
					</view>
					<view class="list-content">
						<view class="list-item" v-for="(item, index) in jointPurchaseDetail.subscriptionList" :key="index">
							<text class="item-cell">{{ item.storeRemark || item.nickname || '未知' }}</text>
							<text class="item-cell">{{ item.subscriptionAmount || 0 }}元</text>
							<text class="item-cell">{{ item.subscriptionRatio || 0 }}%</text>
							<text class="item-cell">{{ item.subscriptionTime || '未知' }}</text>
						</view>
					</view>
				</view>

				<!-- 无认购记录提示 -->
				<view class="no-data"
					v-else-if="jointPurchaseDetail && (!jointPurchaseDetail.subscriptionList || jointPurchaseDetail.subscriptionList.length === 0)">
					<u-empty mode="data" icon="/static/nodata.png" text="暂无认购记录"></u-empty>
				</view>

				<!-- 加载中提示 -->
				<view class="loading" v-else>
					<u-loading-icon text="加载中..."></u-loading-icon>
				</view>
			</uni-card>

			<uni-card v-if="[0, 1].includes(Number(lotteryOrder.type)) &&
				[3, 4].includes(Number(lotteryOrder.state)) &&
				(lotteryOrder.gd === 1 || lotteryOrder.hasGroupPurchase === 1)
				">
				<view class="flex flex-col">
					<view class="fs-28">奖金明细</view>
					<view class="flex justify-between items-center">
						<view class="fs-24 c-999">票面中奖金额</view>
						<view>￥{{ lotteryOrder.winPrice + lotteryOrder.commissionPrice }}</view>
					</view>
					<view class="flex justify-between items-center">
						<view class="fs-24 c-999">佣金</view>
						<view>{{ lotteryOrder.commissionPrice > 0 ? '-' : '' }}￥{{ lotteryOrder.commissionPrice }}</view>
					</view>
					<view class="flex justify-end items-center">
						<view class="fs-28 fw-700" style="color: red;">￥{{ lotteryOrder.winPrice }}</view>
					</view>
				</view>
			</uni-card>

			<!-- 撤单原因 -->
			<view v-if="lotteryOrder.cancelReasonType > 1" class="my-20">
				<view class="flex flex-col" style="background-color: #FFF0F0; padding: 30rpx; border-radius: 10rpx;">
					<view class="fs-28 fw-700">店主撤单原因：</view>
					<view class="fs-26 mt-30">{{ lotteryOrder.cancelReasonTypeStr }}</view>
				</view>
			</view>
			<!-- 用户取消 -->
			<view v-else-if="lotteryOrder.cancelReasonType == 1 || lotteryOrder.state == '6'" class="my-20">
				<view class="flex flex-col" style="background-color: #FFF0F0; padding: 30rpx; border-radius: 10rpx;">
					<view class="fs-28 fw-700">用户撤单原因：</view>
					<view class="fs-26 mt-30" v-if="lotteryOrder.cancelReasonType == 1">{{ lotteryOrder.cancelReasonTypeStr }}</view>
					<view class="fs-26 mt-30" v-else>{{ lotteryOrder.stateStr }}</view>
				</view>
			</view>
			
			<!-- 订单信息卡片 -->
			<view class="w-100% relative mx-auto my-20 bgc-fff rounded-10 shadow custom-card-shadow">
				<view class="p-30" style="width: 90%;">
					<!-- 标题栏 -->
					<view class="flex justify-between items-center">
						<text class="c-333 fs-34 fw-400">订单信息</text>
						<view v-if="!!this.lotteryOrder.phone || !!this.lotteryOrder.userId" class="flex items-center c-3C9CFF" @click="contactUser">
							<u-icon name="account" size="48rpx" color="#3C9CFF" class="mr-6"></u-icon>
							<text class="fs-28">联系彩民</text>
						</view>
					</view>

					<!-- 订单信息项 -->
					<view class="mt-30" style="width: 100%;">
						<!-- 用户名称 -->
						<view class="flex justify-between items-center mb-30">
							<text class="c-737373 fs-28">用户名称</text>
							<text class="c-737373 fs-28 text-right">{{ lotteryOrder.storeRemark || lotteryOrder.nickname }}</text>
						</view>

						<!-- 出票店主 -->
						<view class="flex justify-between items-center mb-30" v-if="lotteryOrder.employeeId">
							<text class="c-737373 fs-28">出票店主</text>
							<text class="c-737373 fs-28 text-right">{{ employeeInfo ? (employeeInfo.storeRemark || employeeInfo.nickname) : '加载中...' }}</text>
						</view>

						<!-- 订单编号 -->
						<view class="flex justify-between items-center mb-30">
							<text class="c-737373 fs-28">订单编号</text>
							<view class="flex items-center">
								<text class="c-737373 fs-28 text-right">{{ lotteryOrder.orderId }}</text>
								<u-icon name="file-text" size="48rpx" @click="copyOrderId" class="ml-10"></u-icon>
							</view>
						</view>

						<!-- 下单时间 -->
						<view class="flex justify-between items-center mb-30">
							<text class="c-737373 fs-28">下单时间</text>
							<text class="c-737373 fs-28 text-right">{{ lotteryOrder.createTime }}</text>
						</view>

						<!-- 出票时间 -->
						<view class="flex justify-between items-center mb-30" v-if="lotteryOrder.ticketingTime">
							<text class="c-737373 fs-28">出票时间</text>
							<text class="c-737373 fs-28 text-right">{{ lotteryOrder.ticketingTime }}</text>
						</view>

						<!-- 截止时间 -->
						<view class="flex justify-between items-center">
							<text class="c-737373 fs-28">截止时间</text>
							<text class="c-737373 fs-28 text-right">{{ lotteryOrder.acceptanceDeadline }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 新增多图选择组件 - 无论是否有票据都显示 -->
			<uni-card class="phone rounded-10" v-if="![0, 8].includes(Number(lotteryOrder.state))" is-shadow shadow="0px 0px 5px 3px rgba(0, 0, 0, 0.10)" :border="false">
				<p>
					<view class="title">彩票票据</view>
					<view class="ticket-photos">
						<!-- 显示已有票据 -->
						<view class="ticket-photo-item" v-for="(imageUrl, index) in ticketImages" :key="index"
							@click="imgListPreview(imageUrl)">
							<image :src="imageUrl" mode="aspectFill"></image>
							<view class="delete-icon" @click.stop="removeTicket(imageUrl)" v-if="(lotteryOrder.state == 7 || lotteryOrder.state == 1) && isCurrentUserEmployee">
								<u-icon name="close" color="#fff" size="20"></u-icon>
							</view>
						</view>

						<!-- 上传票据按钮 -->
						<view class="ticket-photo-item upload-button" v-if="(lotteryOrder.state == 7 || lotteryOrder.state == 1) && isCurrentUserEmployee" @click="uploadTicket()">
							<u-icon name="plus" size="30" color="#999"></u-icon>
							<view class="upload-text">上传票据</view>
						</view>

						<!-- 无票据提示 -->
						<view class="no-ticket-tip" v-else-if="ticketImages.length === 0">
							暂无票据信息
						</view>
					</view>
				</p>
			</uni-card>

			<!-- 添加取消订单按钮 -->
			<view class="flex justify-center mt-20" v-if="(lotteryOrder.state == 0) || (lotteryOrder.state == 7 && (isCurrentUserEmployee || shopOwner))">
				<view class="cancel-btn" @click="cancelOrder">
					取消订单
				</view>
			</view>
		</view>

		<!-- 移除独立的取消订单按钮 -->

		<!-- 待出票状态下显示底部固定接单按钮 -->
		<view class="w-full fixed bottom-0 left-0 flex align-center justify-center bgc-fff" v-if="lotteryOrder.state == 0">
			<view class="w-full h-100 c-fff flex align-center justify-center bg-theme-color"
				@click="acceptOrder">
				<view class="fw-600 fs-32 btn-text-center">
					确认接单
				</view>
			</view>
		</view>

		<view class="w-full h-200" v-if="lotteryOrder.state == 0"></view>
		<view class="w-200 h-200" v-if="lotteryOrder.state == 0"></view>

		<!-- 待出票状态下显示底部固定出票按钮 -->
		<view class="w-full fixed bottom-0 left-0 flex align-center justify-center bgc-fff" v-if="lotteryOrder.state == 7 && isCurrentUserEmployee">
			<view class="w-full h-100 c-fff flex align-center justify-center bg-theme-color"
				@click="showPrintConfirm">
				<view class="fw-600 fs-32 btn-text-center">
					确认出票
				</view>
			</view>
		</view>
		<view class="w-full h-200" v-if="lotteryOrder.state == 7 && isCurrentUserEmployee"></view>
		<!-- 待开奖状态下显示底部固定修改票据按钮 -->
		<view class="w-full fixed bottom-0 left-0 flex align-center justify-center bgc-fff" v-if="lotteryOrder.state == 1 && isCurrentUserEmployee">
			<view class="w-full h-100 c-fff flex align-center justify-center bg-theme-color"
				@click="doModifyVote">
				<view class="fw-600 fs-32 btn-text-center">
					修改票据
				</view>
			</view>
		</view>
		<view class="w-full h-200" v-if="lotteryOrder.state == 1 && isCurrentUserEmployee"></view>

		<!-- 待派奖状态下显示底部固定派奖按钮 -->
		<view class="w-full fixed bottom-0 left-0 flex align-center justify-center bgc-fff" v-if="lotteryOrder.state == 3">
			<view class="w-full h-100 c-fff flex align-center justify-center bg-theme-color"
				@click="paijiangConfirm">
				<view class="fw-600 fs-32 btn-text-center">
					派奖(修改金额)
				</view>
			</view>
		</view>
		<view class="w-full h-200" v-if="lotteryOrder.state == 3"></view>

		<!-- 修改佣金比例弹出框 - 移除重复的弹窗，统一使用确认出票弹窗 -->

		<!-- 确认出票弹窗 -->
		<ticket-confirm
			:show="showTicketConfirm"
			:lotteryOrder="lotteryOrder"
			:hasTickets="ticketImages.length > 0"
			@close="showTicketConfirm = false"
			@upload="closeAndUpload"
			@confirm="printTicket"
		></ticket-confirm>

		<!-- 添加撤单原因选择器组件 -->
		<cancel-reason-picker
			:show="showCancelReasonPicker"
			:reasonList="cancelReasons"
			@close="cancelReasonSelection"
			@confirm="handleReasonConfirm"
		></cancel-reason-picker>

		<!-- 添加派奖金额修改弹窗 -->
		<award-amount-edit
			:show="showAwardAmountEdit"
			:lotteryOrder="lotteryOrder"
			@close="closeAwardAmountEdit"
			@confirm="confirmAwardAmountEdit"
		></award-amount-edit>

		<!-- 发单宣言审核弹窗 -->
		<u-popup :show="showDeclarationReview" mode="center" :round="10" @close="closeDeclarationReview" :closeable="false">
			<view class="declaration-review-popup">
				<view class="popup-title">发单宣言审核</view>
				<view class="popup-content">
					<view class="user-info">
						<text class="label">用户：</text>
						<text class="value">{{ declarationData.name || '未知' }}</text>
					</view>
					<view class="declaration-content">
						<text class="label">宣言：</text>
						<text class="value">{{ declarationData.describe || '暂无宣言' }}</text>
					</view>
					<view class="warning-message">
						请严格审查发单宣言是否包含"广告、非法言论"等影响店铺质量的内容。对频繁出现违规内容的店铺，平台将进行封禁处理
					</view>
				</view>
				<view class="popup-footer">
					<view class="btn btn-reset" @click="approveDocumentDeclaration(1)">
						重置宣言
					</view>
					<view class="btn btn-approve" @click="approveDocumentDeclaration(0)">
						我已审核
					</view>
				</view>
			</view>
		</u-popup>

	</view>
</template>

<script>
import {
	getLotteryOrderById,
	actual,
	modifyVote,
	updateBallInfoBonusOdds,
	lotteryOrderList,
	getJointPurchaseDetail
} from '@/api/lotteryOrder.js'
import {
	getDeclaration,
	approveDeclaration,
} from '@/api/documentary.js'
import {
	deleteOrder,
	chupiaoOrder,
	paijiangOrder,
	getStoreUserDetail,
	getUser
} from "@/api/user.js"
import cfg from '@/util/environment.js';
import { compressImage } from '@/util/image-tool.js';
import { getUserInfo } from '@/util/auth.js';
import basketballCard from '@/components/basketball-card/basketball-card.vue'
import schemeDetails from '@/components/scheme-details/scheme-details.vue'
import victoryDefeatCard from '@/components/victory-defeat-card/victory-defeat-card.vue'
import northSingleCard from '@/components/north-single-card/north-single-card.vue'
import footballCard from '@/components/football-card/football-card.vue'
import welfareCard from '@/components/welfare-card/welfare-card.vue'
import lotteryCard from '@/components/lottery-card/lottery-card.vue'
import sevenStarCard from '@/components/seven-star-card/seven-star-card.vue'
import fiveNumberCard from '@/components/five-number-card/five-number-card.vue'
import arrangeThreeCard from '@/components/arrange-three-card/arrange-three-card.vue'
import ticketConfirm from '@/components/ticket-confirm/ticket-confirm.vue'
import cancelReasonPicker from '@/components/cancel-reason-picker/cancel-reason-picker.vue'
import awardAmountEdit from '@/components/award-amount-edit/award-amount-edit.vue'

export default {
	components: {
		basketballCard,
		schemeDetails,
		victoryDefeatCard,
		northSingleCard,
		footballCard,
		welfareCard,
		lotteryCard,
		sevenStarCard,
		fiveNumberCard,
		arrangeThreeCard,
		ticketConfirm,
		cancelReasonPicker,
		awardAmountEdit
	},
	data() {
		return {
			lotteryOrder: {
				bill: [] // 将bill初始化为数组
			},
			jointPurchaseDetail: null, // 合买详情数据
			that: this,
			showReConfirm: false,
			wantEdit: false,
			fromAction: '', // 来源动作标记
			showTicketConfirm: false, // 确认出票弹窗
			ticketImages: [], // 存储多张票据图片
			hasGroupPurchase: 0, // 是否是合买订单
			showCancelReasonPicker: false, // 控制撤单原因选择器的显示
			selectedCancelReason: null, // 存储选中的撤单原因对象
			selectedCancelReasonType: null, // 存储选中的撤单原因类型 (radio v-model)
			customCancelReasonDesc: '', // 存储自定义撤单原因描述
			employeeInfo: null, // 存储出票店主信息
			isCurrentUserEmployee: true, // 当前用户是否是出票店主
			currentUserId: '', // 当前登录用户ID
			cancelReasons: [ // 撤单原因列表 (只包含类型 11-17)
				{ type: 11, name: '订单逾期' },
				{ type: 12, name: '票数太多' },
				{ type: 13, name: '订单较多，忙不过来' },
				{ type: 14, name: '联系不到客户' },
				{ type: 15, name: '中心限制订单，无法出票' },
				{ type: 16, name: '来不及出票，赔率变化' },
				{ type: 17, name: '自定义' }
			],
			schemeDetailsShow: false,
			showAwardAmountEdit: false, // 控制派奖金额修改弹窗的显示
			editedAwardAmount: null, // 存储修改后的派奖金额
			showDeclarationReview: false, // 控制发单宣言审核弹窗的显示
			declarationData: {} // 存储发单宣言数据
		}
	},
	async onLoad(option) {
		if (option.fromAction) {
			this.fromAction = option.fromAction;
		}
		// 保存hasGroupPurchase参数，用于判断是否是合买订单
		this.hasGroupPurchase = option.hasGroupPurchase ? Number(option.hasGroupPurchase) : 0;

		// 获取当前登录用户信息
		try {
			const userInfo = await getUserInfo();
			if (userInfo) {
				this.currentUserId = userInfo.id;
				this.isShopOwner = userInfo.isAgent === '1';
				console.log('当前用户ID:', this.currentUserId);
				console.log('当前用户是否店主:', this.isShopOwner);
			}
		} catch (error) {
			console.error('获取用户信息失败:', error);
		}

		this.init(option.id);
	},
	filters: {
		formatWinPrice(data) {
			if (data == null || data == undefined || data == 0) {
				return "暂无";
			}
			return data;
		},
		//格式化状态
		formatState(data) {
			if (data == 0) {
				return "待接单";
			} else if (data == 1) {
				return "待开奖";
			} else if (data == 2) {
				return "未中奖";
			} else if (data == 3) {
				return "待派奖";
			} else if (data == 4) {
				return "已派奖";
			} else if (data == 5) {
				return "拒绝";
			} else if (data == 6) {
				return "退票";
			} else if (data == 7) {
				return "待出票";
			} else if (data == 8) {
				return "未成单";
			}
			return "未知状态";
		}
	},
	computed: {
		shopOwner() {
			return false
		}
	},
	methods: {
		goToOrderDetail(id, hasGroupPurchase) {
			uni.redirectTo({
				url: "/pages/order/lotteryOrderDetails?id=" + id + `&hasGroupPurchase=${hasGroupPurchase}` + "&fromAction=orderAccept",
				animationType: 'pop-in',
				animationDuration: 200
			})
		},
		getOrderList(){
			let that = this;
			let queryParam = {
				stateList: ["7","0"],
				pageNo: 1,
				pageSize: 10,
				sortField: 'orderDeadline',
				sortRules: 'asc'
			};
			lotteryOrderList(queryParam).then(res => {
				if (res.success) {
					if(res.voList && res.voList.length>0){
						let item = res.voList[0];
						this.goToOrderDetail(item.jointPurchaseId || item.id, item.hasGroupPurchase);
					}else{
						//跳转订单页面
						uni.reLaunch({
							url: "/pages/order/lotteryOrder"
						});
						// // 重新加载订单详情
						// this.goToOrderDetail(that.lotteryOrder.jointPurchaseId || that.lotteryOrder.id, that.lotteryOrder.hasGroupPurchase);
					}
				} else {
				}
			}).catch(err => {
				console.error(err);
			});
		},
		getWaitAwardOrderList(){
			let that = this;
			let queryParam = {
				stateList: ["3"],
				pageNo: 1,
				pageSize: 10
			};
			lotteryOrderList(queryParam).then(res => {
				if (res.success) {
					if(res.voList && res.voList.length>0){
						let item = res.voList[0];
						that.init(item.jointPurchaseId || item.id);
					}else{
						//跳转订单页面
						uni.navigateBack()
						// uni.reLaunch({
						// 	url: "/pages/order/waitAward"
						// });
					}
				} else {
				}
			}).catch(err => {
				console.error(err);
			});
		},
		// 接单方法
		acceptOrder() {
			let that = this;
			uni.showModal({
				title: '接单确认',
				content: "确认接单该订单？",
				success: function (res) {
					if (res.confirm) {
						uni.showLoading({
							title: '接单中...'
						});
						chupiaoOrder({
							'id': that.lotteryOrder.id,
							'state': "7" // 更新为新的状态值
						}).then(res => {
							uni.hideLoading();
							if (res.success) {
								uni.showToast({
									title: '接单成功！',
									icon: 'success'
								});
								setTimeout(function () {
									// 重新加载订单详情
									that.init(that.lotteryOrder.jointPurchaseId || that.lotteryOrder.id);
								}, 1000);
							} else {
								uni.showToast({
									title: res.errorMsg || '接单失败',
									icon: 'none'
								});
							}
						}).catch(() => {
						});
					}
				}
			})
		},
		confirmCommissionChange() {
			this.printTicket();
		},
		// 修改 cancelOrder 方法，触发 ActionSheet
		cancelOrder() {
			this.showCancelReasonPicker = true;
			/* 旧逻辑
			let that = this;
			uni.showModal({
				title: '撤单提醒',
				content: "是否确认取消打单",
				success: function (res) {
					if (res.confirm) {
						chupiaoOrder({
							'id': that.lotteryOrder.id,
							'state': 5
						}).then(res => {
							if (res.success) {
								uni.showToast({
									title: '操作成功！',
									icon: 'none'
								});
								setTimeout(function () {
									// location.reload()
									uni.navigateBack()
								}, 1000);
							}
						})
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			})
			*/
		},
		// 添加处理撤单原因选择的方法
		handleCancelReasonSelect(reason) {
			this.selectedCancelReason = reason;
			this.showCancelConfirm(); // 选择后显示确认弹窗
		},
		// 添加显示撤单确认弹窗的方法
		showCancelConfirm() {
			let that = this;
			let confirmContent = `确认取消订单？原因：${that.selectedCancelReason.name}`;
			// 如果是自定义原因，附加上描述
			if (that.selectedCancelReason.type === 17) {
				confirmContent += ` (${that.customCancelReasonDesc})`;
			}

			uni.showModal({
				title: '撤单确认',
				content: confirmContent, // 显示选中的原因及描述（如果自定义）
				success: function (res) {
					if (res.confirm) {
						uni.showLoading({ title: '取消中...' });

						// 准备 API 参数
						let payload = {
							id: that.lotteryOrder.id,
							state: '5',
							cancelReasonType: that.selectedCancelReason.type
						};

						// 如果是自定义原因，添加描述字段
						if (that.selectedCancelReason.type === 17) {
							payload.cancelReasonDesc = that.customCancelReasonDesc;
						}

						// 调用 chupiaoOrder API
						chupiaoOrder(payload).then(apiRes => {
							uni.hideLoading();
							if (apiRes.success) {
								uni.showToast({
									title: '订单已取消！',
									icon: 'success'
								});
								setTimeout(function () {
									that.getOrderList();
									// uni.navigateBack(); // 返回上一页
								}, 1000);
							} else {
								uni.showToast({
									title: apiRes.errorMsg || '取消失败',
									icon: 'none'
								});
							}
						}).catch(() => {
						});
					} else if (res.cancel) {
						console.log('用户点击取消确认');
						// 可以选择重置 selectedCancelReason
						// this.selectedCancelReason = null;
					}
				}
			})
		},
		uploadTicket() {
			uni.chooseImage({
				count: 9, // 更改为可选择多张图片
				sourceType: ['camera', 'album'], //拍照或相册
				sizeType: ['compressed'], //压缩
				success: (res) => {
					// this.uploadImages(res.tempFilePaths);
					compressImage(res.tempFilePaths, {
                        maxSize: 200,
                        maxWidth: 800,
                        maxHeight: 800,
                        quality: 0.7
                    }).then(compressedImage => {
                        // 上传压缩后的图片
                        console.log("compressedImage", compressedImage)
                        this.uploadImages([compressedImage]);
                    });
				}
			})
		},

		// 上传多个图片的方法
		uploadImages(tempFilePaths) {
			if (!tempFilePaths || tempFilePaths.length === 0) return;

			uni.showLoading({
				title: '上传中...'
			});

			// 处理单张图片上传，后续可扩展为批量上传
			var tempPath = tempFilePaths[0];
			uni.uploadFile({
				url: cfg.BASE_API + "/file/upload",
				filePath: tempPath,
				name: 'file',
				header: {
					'x-access-token': uni.getStorageSync("vue_authtoken"),
					'X-Sys': 1,
					'X-User': uni.getStorageSync("admin_user"),
				},
				success: (uploadFileRes) => {
					if (uploadFileRes.statusCode == 200) {
						const imageUrl = (JSON.parse(uploadFileRes.data)).url;

						// 确保bill是数组
						if (!this.lotteryOrder.bill) {
							this.lotteryOrder.bill = [];
						} else if (typeof this.lotteryOrder.bill === 'string') {
							// 如果bill是字符串，则转换为数组
							this.lotteryOrder.bill = [this.lotteryOrder.bill];
						}

						// 添加到bill数组和ticketImages数组
						this.lotteryOrder.bill.push(imageUrl);
						this.ticketImages.push(imageUrl);

						uni.hideLoading();
						uni.showToast({
							title: "上传成功",
							icon: "success"
						});

						// 如果用户来自确认出票弹窗，自动返回显示确认弹窗
						if (this.fromAction === 'ticketConfirm') {
							setTimeout(() => {
								this.showPrintConfirm();
							}, 500);
						}
					}
				},
				fail: (res) => {
					uni.hideLoading();
					console.log("上传失败==" + JSON.stringify(res));
					uni.showToast({
						title: '上传失败',
						icon: 'none'
					});
				}
			});
		},

		// 删除票据图片
		removeTicket(imageUrl) {
			uni.showModal({
				title: '提示',
				content: '确定要删除此票据图片吗？',
				success: (res) => {
					if (res.confirm) {
						// 从两个数组中移除
						// 从ticketImages数组中移除
						const indexInTicket = this.ticketImages.indexOf(imageUrl);
						if (indexInTicket > -1) {
							this.ticketImages.splice(indexInTicket, 1);
						}

						// 从bill数组中移除
						if (Array.isArray(this.lotteryOrder.bill)) {
							const indexInBill = this.lotteryOrder.bill.indexOf(imageUrl);
							if (indexInBill > -1) {
								this.lotteryOrder.bill.splice(indexInBill, 1);
							}
						}

						// 这里可以添加与后端同步的代码，暂时只做前端处理
						uni.showToast({
							title: '已删除',
							icon: 'success'
						});
					}
				}
			});
		},
		open(key) {
			if (this.schemeExpansionState.hasOwnProperty(key)) {
				this.$set(this.schemeExpansionState, key, !this.schemeExpansionState[key]);
			} else {
				// 如果 key 不存在，则添加并设置为 true (展开)
				this.$set(this.schemeExpansionState, key, true);
			}
			// 移除旧的直接修改 displayItem 的逻辑
			/*
			// 简化处理：直接修改 displayItem 的状态，这不会持久化或影响其他拆分项
			// 更好的方法是管理一个独立的展开状态对象，以 displayItem._key 作为键
			this.$set(this.displaySchemeDetails[index], "isShow", !displayItem.isShow);
			*/
		},
		imgListPreview(url) {
			uni.previewImage({
				indicator: "number",
				loop: true,
				current: url,
				urls: this.ticketImages
			})
		},

		// 处理订单数据
		processOrderData(res) {
			this.lotteryOrder = res;

			// 确保bill是数组格式
			if (!this.lotteryOrder.bill) {
				this.lotteryOrder.bill = [];
				this.ticketImages = [];
			} else if (typeof this.lotteryOrder.bill === 'string') {
				// API返回的可能是字符串，转换为数组
				if (this.lotteryOrder.bill.includes(',')) {
					// 如果字符串包含逗号，说明是多张图片
					this.lotteryOrder.bill = this.lotteryOrder.bill.split(',');
				} else {
					this.lotteryOrder.bill = [this.lotteryOrder.bill];
				}
				this.ticketImages = [...this.lotteryOrder.bill];
			} else if (Array.isArray(this.lotteryOrder.bill)) {
				this.ticketImages = [...this.lotteryOrder.bill];
			}

			// 如果有employeeId，获取店主信息并判断是否是当前用户
			if (this.lotteryOrder.employeeId) {
				// 判断当前用户是否是出票店主
				this.isCurrentUserEmployee = this.currentUserId === this.lotteryOrder.employeeId;
				console.log('是否是出票店主:', this.isCurrentUserEmployee, '当前用户ID:', this.currentUserId, '出票店主ID:', this.lotteryOrder.employeeId);

				// 获取店主详细信息
				this.fetchEmployeeInfo(this.lotteryOrder.employeeId);
			} else {
				// 如果订单没有指定出票店主，则默认允许当前用户出票
				this.isCurrentUserEmployee = true;
			}

			if (res.schemeDetails != null && res.schemeDetails != undefined && res.schemeDetails != "") {
				this.lotteryOrder.schemeDetails = JSON.parse(this.lotteryOrder.schemeDetails)
				this.lotteryOrder.schemeDetails.forEach((item) => {
					if ([0, 1, 2, 6, 7].includes(Number(this.lotteryOrder.type))) {
						item.notes = item.notes * item.number
					} else if ([3, 4, 5, 8].includes(Number(this.lotteryOrder.type))) {
						item.notes = this.lotteryOrder.times
						if ([5, 8].includes(Number(this.lotteryOrder.type))) {
							item.forecastBonus = parseFloat((item.forecastBonus / item.notes) * this
								.lotteryOrder.times).toFixed(2)
						}
					} else if ([9].includes(Number(this.lotteryOrder.type))) {
						const redBalls = item.redBallList.join()
						const blueBalls = item.blueBallList.join()
						item.content = [redBalls, blueBalls].join()
						item.notes = this.lotteryOrder.welfareInfoList.find(welfare => {
							return welfare.redBalls == redBalls && welfare.blueBalls == blueBalls
						}).times
					} else if ([10, 11, 12].includes(Number(this.lotteryOrder.type))) {
						const redBalls = item.redBallList.join()
						item.content = redBalls
						item.notes = this.lotteryOrder.welfareInfoList.find(welfare => {
							return welfare.redBalls == redBalls
						}).times
					} else {
						item.forecastBonus = parseFloat((item.forecastBonus / item.notes) * this
							.lotteryOrder.times).toFixed(2)
					}
				})
			}

			//将字符串转对象
			if (this.lotteryOrder.ballInfoList != null) {
				this.lotteryOrder.ballInfoList.map((item, idx) => {

					// item.contentJSON = JSON.parse(item.content)
					this.$set(this.lotteryOrder.ballInfoList[idx], "content", JSON.parse(item
						.content))
					//將比賽结果转换成数组，并返回
					if (item.award != null) {
						this.$set(this.lotteryOrder.ballInfoList[idx], "award", item.award.split(
							','))
					} else {
						//考虑比赛结果还没有出的话设置一个默认值，防止报错
						var moren = ["", "", "", "", ""]
						this.$set(this.lotteryOrder.ballInfoList[idx], "award", moren)
					}
					if (item.bonusOdds != null) {
						this.$set(this.lotteryOrder.ballInfoList[idx], "bonusOdds", item.bonusOdds
							.split(','))
					} else {
						//考虑比赛结果还没有出的话设置一个默认值，防止报错
						var moren = ["", "", "", "", ""]
						this.$set(this.lotteryOrder.ballInfoList[idx], "bonusOdds", moren)
					}
				})
			}
			if (this.lotteryOrder.ticketedBallInfoList != null) {
				this.lotteryOrder.ticketedBallInfoList.map((item, idx) => {

					// item.contentJSON = JSON.parse(item.content)
					this.$set(this.lotteryOrder.ticketedBallInfoList[idx], "content", JSON.parse(item
						.content))
					//將比賽结果转换成数组，并返回
					if (item.award != null) {
						this.$set(this.lotteryOrder.ticketedBallInfoList[idx], "award", item.award.split(
							','))
					} else {
						//考虑比赛结果还没有出的话设置一个默认值，防止报错
						var moren = ["", "", "", "", ""]
						this.$set(this.lotteryOrder.ticketedBallInfoList[idx], "award", moren)
					}
					if (item.bonusOdds != null) {
						this.$set(this.lotteryOrder.ticketedBallInfoList[idx], "bonusOdds", item.bonusOdds
							.split(','))
					} else {
						//考虑比赛结果还没有出的话设置一个默认值，防止报错
						var moren = ["", "", "", "", ""]
						this.$set(this.lotteryOrder.ticketedBallInfoList[idx], "bonusOdds", moren)
					}
				})
			}

			//处理超过一定高度采用滚动条
			this.$nextTick(() => {
				const makeElement = document.querySelector(".make");
				if (makeElement && makeElement.clientHeight > 500) {
					makeElement.setAttribute("class", "scheme");
				}
			})
			//处理排列3的组三和组六的字符串转数组
			if (this.lotteryOrder.type == "3") {
				this.lotteryOrder.recordList.map(item => {
					if (item.mode == "1" || item.mode == "2" || item.mode == "6") {
						item.individual = JSON.parse(item.individual).sort((a, b) => {
							return (a.num - Number(a.isGallbladder) * 100) - (b.num - Number(b.isGallbladder) * 100)
						})
					}
				})
			}
			//处理大乐透
			if (this.lotteryOrder.type == "8") {
				this.lotteryOrder.recordList.map(item => {
					item.ten = JSON.parse(item.ten).sort((a, b) => {
						return (a.num - Number(a.isGallbladder) * 100) - (b.num - Number(b.isGallbladder) * 100)
					})
					item.individual = JSON.parse(item.individual).sort((a, b) => {
						return (a.num - Number(a.isGallbladder) * 100) - (b.num - Number(b.isGallbladder) * 100)
					})
				})
			}

			// 加载完成后隐藏加载提示
			uni.hideLoading();
			console.log("this.lotteryOrder.recordList",this.lotteryOrder.recordList)
		},
		//返回事件处理
		backClick() {
			// const pages = getCurrentPages().map(item => item.route)
			// const curr = pages[pages.length-1]
			// let delta = 0;
			// for (let i=pages.length-1; i>=0; i--) {
			// 	if (pages[i] !== curr) {
			// 		break;
			// 	}
			// 	delta++;
			// }
			// console.log(delta)
			uni.navigateBack({});
			// 默认行为
			// uni.reLaunch({
			// 	url: "/pages/order/lotteryOrder"
			// });
		},
		//初始化事件
		init(id) {
			uni.showLoading();

			// 根据URL参数hasGroupPurchase判断是否是合买订单
			if (this.hasGroupPurchase === 1) {
				// 如果是合买订单，使用合买详情API获取数据
				getJointPurchaseDetail(id).then(res => {
					// 直接使用合买详情数据
					this.jointPurchaseDetail = res;

					// 如果API没有返回进度百分比，则计算进度百分比
					if (this.jointPurchaseDetail && !this.jointPurchaseDetail.progress) {
						const total = parseFloat(this.jointPurchaseDetail.totalAmount || 0);
						const current = parseFloat(this.jointPurchaseDetail.currentAmount || 0);
						if (total > 0) {
							this.jointPurchaseDetail.progress = Math.round((current / total) * 100);
						} else {
							this.jointPurchaseDetail.progress = 0;
						}
					}

					getLotteryOrderById(res.lotteryOrderIdInt).then(res => {
						this.processOrderData({
							...res,
							// 未成单、未接单 无法查看投注详情
							...([0, 8].includes(Number(res.state)) && {
								schemeDetails: null,
								// ballInfoList: []
							}) || {}
						});
					});
				}).catch(error => {
					console.error('获取合买详情失败', error);
				});
			} else {
				// 如果不是合买订单，使用普通订单API获取数据
				getLotteryOrderById(id).then(res => {
					this.lotteryOrder = res;
					this.checkFd(res);
					this.processOrderData(res);
				}).catch(error => {
					console.error('获取订单详情失败', error);
				});
			}
		},
		//判断是否是发单
		checkFd(lotteryOrder){
			console.log("检测是否是发单")
			if(lotteryOrder && lotteryOrder.fd==1){
				uni.showLoading();
				//获取发单宣言
				getDeclaration(lotteryOrder.fdh).then(res => {
					//判断发单宣言是否审核
					if(res.status==0){
						//未审核 弹出审核弹窗
						this.declarationData = res;
						this.declarationData.name = lotteryOrder.fdUname;
						this.showDeclarationReview = true;
					}
				}).catch(error => {
					console.error('获取发单宣言失败', error);
				}).finally(() => {
					uni.hideLoading();
				});
			}
		},
		approveDocumentDeclaration(type){
			//type为0审核 type为1 重置
			uni.showLoading({ title: '处理中...' });
			approveDeclaration({id:this.lotteryOrder.fdh,type:type}).then(res => {
				uni.hideLoading();
				if(res.success) {
					uni.showToast({
						title: type === 0 ? '审核成功' : '重置成功',
						icon: 'success'
					});
					this.closeDeclarationReview();
				} else {
					uni.showToast({
						title: res.errorMsg || '操作失败',
						icon: 'none'
					});
				}
			}).catch(error => {
				uni.hideLoading();
				console.error('审核发单宣言失败', error);
				uni.showToast({
					title: '操作失败',
					icon: 'none'
				});
			}).finally(() => {
				uni.hideLoading();
			});
		},
		
		// 关闭发单宣言审核弹窗
		closeDeclarationReview() {
			this.showDeclarationReview = false;
			this.declarationData = {};
		},
		
		// 重置宣言
		resetDeclaration() {
			uni.showModal({
				title: '确认重置',
				content: '确定要重置该用户的发单宣言吗？',
				success: (res) => {
					if (res.confirm) {
						this.approveDocumentDeclaration(1);
					}
				}
			});
		},
		
		// 审核通过
		approveDeclaration() {
			uni.showModal({
				title: '确认审核',
				content: '确定审核通过该发单宣言吗？',
				success: (res) => {
					if (res.confirm) {
						this.approveDocumentDeclaration(0);
					}
				}
			});
		},
		// 出票方法
		printTicket() {
			let that = this;
			// 检查是否上传了票据
			if (this.ticketImages.length === 0) {
				uni.showToast({
					title: '请先上传票据',
					icon: 'none'
				});
				return;
			}

			// 关闭弹窗
			this.showTicketConfirm = false;

			uni.showLoading({
				title: '出票中...'
			});

			// 使用完整数组而非字符串

			// 准备赔率更新数据和出票数据
			let requestData = {
				"bill": Array.isArray(this.lotteryOrder.bill) ? this.lotteryOrder.bill[0] : this.lotteryOrder.bill, // 使用第一张图作为主图
				"id": that.lotteryOrder.id,
				"billList": Array.isArray(this.lotteryOrder.bill) ? this.lotteryOrder.bill : [this.lotteryOrder.bill] // 使用完整数组
			};

			// 如果是需要更新赔率的类型，先更新赔率
			if ([0, 1].includes(Number(this.lotteryOrder.type))) { // 扩展条件
				// // 处理赔率修改数据
				// that.lotteryOrder.ballInfoList.forEach((item, index) => {
				// 	// 将修改后的content对象转回字符串
				// 	that.lotteryOrder.ballInfoList[index].content = JSON.stringify(item.content);
				// });

				// 先调用更新赔率的API
				updateBallInfoBonusOdds({
					'orderId': that.lotteryOrder.orderId,
					'ballInfoList': that.lotteryOrder.ballInfoList.map(item => ({
						...item,
						content: JSON.stringify(item.content)
					}))
				}).then(() => {
					console.log('赔率更新成功');
					// 赔率更新成功后，执行出票操作
					that.doActualPrint(requestData);
				}).catch(() => {
					setTimeout(() => {
						that.init(that.lotteryOrder.jointPurchaseId || that.lotteryOrder.id);
					}, 1000)
				});
			} else {
				// 非足彩类型，直接执行出票操作
				that.doActualPrint(requestData);
			}
		},

		// 执行出票操作
		doActualPrint(requestData) {
			let that = this;
			// 调用出票API
			actual(requestData).then(res => {
				uni.hideLoading();
				if (res.success) {
					uni.showToast({
						title: '出票成功！',
						icon: 'success'
					});
					setTimeout(function () {
						that.getOrderList();
					}, 1000);
				} else {
					uni.showToast({
						title: res.errorMsg || '出票失败',
						icon: 'none'
					});
				}
			}).catch(() => {
			});
		},
		// 执行修改票据操作
		doModifyVote() {
			let that = this;
			let requestData = {
				"bill": Array.isArray(this.lotteryOrder.bill) ? this.lotteryOrder.bill[0] : this.lotteryOrder.bill, // 使用第一张图作为主图
				"id": that.lotteryOrder.id,
				"billList": Array.isArray(this.lotteryOrder.bill) ? this.lotteryOrder.bill : [this.lotteryOrder.bill] // 使用完整数组
			};
			// 调用修改票据API
			modifyVote(requestData).then(res => {
				uni.hideLoading();
				if (res.success) {
					uni.showToast({
						title: '修改票据成功！',
						icon: 'success'
					});
				} else {
					uni.showToast({
						title: res.errorMsg || '修改票据失败',
						icon: 'none'
					});
				}
			}).catch(() => {
			});
		},
		// 福彩特有的显示开奖号码方法
		formatFcWinNumber(reward) {
			if (!reward) return '';
			const numbers = reward.split(',');
			return numbers.join(' ');
		},
		// 显示确认出票弹窗
		showPrintConfirm() {
			this.showTicketConfirm = true;
		},

		// 关闭弹窗并上传票据
		closeAndUpload() {
			this.showTicketConfirm = false;
			// 标记来源为票据确认弹窗
			this.fromAction = 'ticketConfirm';
			// 延迟一点调用上传，防止两个界面冲突
			setTimeout(() => {
				this.uploadTicket();
			}, 300);
		},
		// 修改派奖确认方法
		paijiangConfirm() {
			// 显示修改金额弹窗
			this.showAwardAmountEdit = true;
		},

		// 关闭派奖金额修改弹窗
		closeAwardAmountEdit() {
			this.showAwardAmountEdit = false;
		},

		// 确认派奖金额修改
		confirmAwardAmountEdit(data) {
			this.showAwardAmountEdit = false;
			this.editedAwardAmount = data.editedAmount;

			// 显示修改前后对比的二次确认弹窗
			let that = this;
			uni.showModal({
				title: '派奖确认',
				content: `原始中奖金额：${data.originalAmount}元\n修改后金额：${data.editedAmount}元\n\n确认派奖该订单?`,
				success: function (res) {
					if (res.confirm) {
						uni.showLoading({
							title: '派奖中...'
						});

						// 调用派奖API，传入修改后的金额
						paijiangOrder({
							'id': that.lotteryOrder.id,
							'winPrice': that.editedAwardAmount
						}).then(res => {
							uni.hideLoading();
							if (res.success) {
								uni.showToast({
									title: '派奖成功！',
									icon: 'success'
								});
								setTimeout(function () {
									// 重新加载订单详情
									that.getWaitAwardOrderList();
									// that.init(that.lotteryOrder.jointPurchaseId || that.lotteryOrder.id);
								}, 1000);
							} else {
								uni.showToast({
									title: res.errorMsg || '派奖失败',
									icon: 'none'
								});
							}
						}).catch(() => {
						});
					}
				}
			});
		},
		// 添加 Popup 取消按钮事件
		cancelReasonSelection() {
			this.showCancelReasonPicker = false;
			// 可以选择重置选项，但通常关闭即可
			// this.selectedCancelReasonType = null;
			// this.customCancelReasonDesc = '';
		},
		// 处理撤单原因选择组件的确认事件
		handleReasonConfirm(data) {
			// 关闭弹窗
			this.showCancelReasonPicker = false;

			// 保存选中的原因和描述
			this.selectedCancelReason = data.reason;
			this.customCancelReasonDesc = data.description;

			// 显示最终确认弹窗
			this.showCancelConfirm();
		},
		copyOrderId() {
			uni.setClipboardData({
				data: this.lotteryOrder.orderId,
				success: () => {
					uni.showToast({
						title: '复制成功',
						icon: 'success'
					});
				}
			});
		},

		// 联系彩民方法
		contactUser() {
			// 如果有用户手机号，则直接拨打电话
			if (this.lotteryOrder.phone) {
				this.makePhoneCall(this.lotteryOrder.phone);
			}
			// 如果没有手机号但有用户ID，则通过API获取手机号
			else if (this.lotteryOrder.userId) {
				uni.showLoading({
					title: '获取联系方式...'
				});

				getStoreUserDetail(this.lotteryOrder.userId).then(res => {
					uni.hideLoading();
					this.makePhoneCall(res.phone);
				})
			} else {
				uni.showToast({
					title: '暂无联系方式',
					icon: 'none'
				});
			}
		},

		// 拨打电话的公共方法
		makePhoneCall(phoneNumber) {
			uni.makePhoneCall({
				phoneNumber: phoneNumber,
				fail: () => {
					uni.showToast({
						title: '拨打电话失败',
						icon: 'none'
					});
				}
			});
		},

		// 获取店主信息
		fetchEmployeeInfo(employeeId) {
			if (!employeeId) return;

			getStoreUserDetail(employeeId).then(res => {
				if (res) {
					this.employeeInfo = res;
				}
			}).catch(err => {
				console.error('获取店主信息失败', err);
			});
		},
	},
	// 添加 computed 块
	computed: {
		displaySchemeDetails() {
			if (!this.lotteryOrder || !Array.isArray(this.lotteryOrder.schemeDetails) || !this.lotteryOrder.type) {
				return [];
			}

			const lotteryType = parseInt(this.lotteryOrder.type, 10);
			let maxMultiplier = 50; // 默认值

			// 根据彩票类型确定最大倍数
			if ([9, 10, 12, 0, 1, 2].includes(lotteryType)) {
				maxMultiplier = 50;
			} else if (lotteryType === 11) {
				maxMultiplier = 15;
			} else if ([3, 4, 5, 8, 6, 7].includes(lotteryType)) {
				maxMultiplier = 99;
			}
			console.log("maxMultiplier", maxMultiplier)
			// console.log(`Lottery Type: ${lotteryType}, Max Multiplier: ${maxMultiplier}`);

			const processedDetails = [];
			this.lotteryOrder.schemeDetails.forEach((originalItem, originalIndex) => {
				const notes = parseInt(originalItem.notes, 10) || 0;
				if (notes <= 0) return;

				const originalForecastBonus = parseFloat(originalItem.forecastBonus) || 0;
				const bonusPerNote = notes > 0 ? originalForecastBonus / notes : 0;

				// 使用确定的 maxMultiplier 进行比较
				if (notes <= maxMultiplier) {
					processedDetails.push({
						...originalItem,
						displayMultiplier: notes,
						displayTicketCount: 1,
						forecastBonus: (bonusPerNote * notes).toFixed(2),
						_key: `${originalIndex}-0`
					});
				} else {
					// 使用 maxMultiplier 计算拆分
					const fullTickets = Math.floor(notes / maxMultiplier);
					const remainingMultiplier = notes % maxMultiplier;

					// 添加合并后的 maxMultiplier 倍条目
					if (fullTickets > 0) {
						processedDetails.push({
							...originalItem,
							displayMultiplier: maxMultiplier, // 显示最大倍数
							displayTicketCount: fullTickets,
							forecastBonus: (bonusPerNote * maxMultiplier * fullTickets).toFixed(2), // 计算对应奖金
							_key: `${originalIndex}-g`
						});
					}

					// 添加剩余倍数条目（如果存在）
					if (remainingMultiplier > 0) {
						processedDetails.push({
							...originalItem,
							displayMultiplier: remainingMultiplier,
							displayTicketCount: 1,
							forecastBonus: (bonusPerNote * remainingMultiplier).toFixed(2),
							_key: `${originalIndex}-r`
						});
					}
				}
			});
			return processedDetails;
		}
	}
}
</script>

<style scoped lang="scss">
page {
	background-color: rgb(250, 250, 250);
}

.tl-show{
	overflow: hidden;
	position: fixed;
	height: 100%;
	width: 100%;
}

.box {
	padding-bottom: 0px;

	.info {
		padding-bottom: 20rpx;
		background: var(--themeColor);
		color: #ffffff;
		display: flex;
		flex-direction: column;
		border-bottom-left-radius: 16rpx;
		border-bottom-right-radius: 16rpx;

		view {
			text-align: center;

			.font {
				font-size: 28rpx;
			}

			p {
				padding-bottom: 14rpx;
				font-size: 38rpx;
			}
		}
	}

	.body {
		.uni-card {
			margin: 0px !important;
			padding: 0px !important;
		}

		.title {
			color: #737373;
			font-size: 28rpx;
		}

		.tip {
			margin-top: 20rpx;

			view {
				margin-top: 20rpx;
			}
		}

		.phone {
			margin-top: 20rpx !important;
			height: 100%;
		}
	}
}

.popup-btn {
	flex: 1;
	text-align: center;
	padding: 12px 0;
	font-size: 16px;
}

.confirm-btn {
	color: #3A7AE3;
	font-weight: 500;
}

.warn-btn {
	color: #f56c6c;
	font-weight: 500;
}

.ticket-details {
	margin-bottom: 30px;
}

.odds-input {
	display: inline-block;
	width: 80rpx;
	padding: 0;
	margin: 0;
	font-size: 24rpx;
}

.popup-pagination {
	margin-top: 20rpx;
}

.pagination-btn {
	padding: 10rpx;
	margin: 0 20rpx;
	cursor: pointer;
}

.pagination-text {
	font-size: 28rpx;
	color: #666;
}

.disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.ticket-photos {
	display: flex;
	flex-wrap: wrap;
	margin-top: 20rpx;
}

.ticket-photo-item {
	width: 200rpx;
	height: 200rpx;
	margin: 10rpx;
	position: relative;
	border-radius: 8rpx;
	overflow: hidden;

	image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.delete-icon {
		position: absolute;
		top: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.5);
		width: 40rpx;
		height: 40rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-bottom-left-radius: 8rpx;
	}
}

.upload-button {
	border: 1px dashed #ddd;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background-color: #f8f8f8;

	.upload-text {
		font-size: 24rpx;
		color: #999;
		margin-top: 10rpx;
	}
}

.no-ticket-tip {
	width: 100%;
	height: 200rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #979797;
	font-size: 28rpx;
	background-color: #F8F8F8;
	border-radius: 5rpx;
}

.scheme {
	margin-top: 30px;
	overflow: auto;
	height: 1000rpx;
	overflow-x: hidden;
}

.commission-popup {
	width: 650rpx;
	max-height: 80vh;
	background-color: #fff;
	border-radius: 16rpx;
}

.popup-scroll-content {
	flex: 1;
	max-height: calc(80vh - 160rpx);
	overflow-y: auto;
}

.cancel-reason-scroll {
	height: 400rpx;
	max-height: 60vh;
	overflow-y: auto;
}

.popup-footer {
	padding: 20rpx 0;
	border-top: 1px solid #eee;
	margin-top: 20rpx;
}

/* 合买详情样式 */
.group-purchase-title {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
	padding-bottom: 10rpx;
	border-bottom: 1px solid #f0f0f0;
}

.title-text {
	font-size: 28rpx;
}

.group-purchase-info {
	margin-bottom: 30rpx;
}

.info-item {
	display: flex;
	margin-bottom: 20rpx;
	align-items: center;
}

.label {
	color: #666;
	width: 160rpx;
	font-size: 28rpx;
}

.value {
	color: #333;
	font-size: 28rpx;
}

.progress-wrapper {
	flex: 1;
	display: flex;
	align-items: center;
}

.progress-text {
	margin-left: 20rpx;
	font-size: 28rpx;
	color: #2979ff;
}

.status-success {
	color: #19be6b;
}

.status-waiting {
	color: #ff9900;
}

.status-failed {
	color: #fa3534;
}

.subscription-list {
	margin-top: 30rpx;
}

.list-title {
	font-size: 30rpx;
	font-weight: bold;
	margin-bottom: 20rpx;
}

.list-header {
	display: flex;
	background-color: #f5f5f5;
	padding: 20rpx 0;
	border-radius: 8rpx;
}

.header-item {
	flex: 1;
	text-align: center;
	font-size: 28rpx;
	color: #666;
}

.list-content {
	margin-top: 10rpx;
}

.list-item {
	display: flex;
	padding: 20rpx 0;
	border-bottom: 1px solid #f0f0f0;
}

.item-cell {
	flex: 1;
	text-align: center;
	font-size: 28rpx;
	color: #333;
}

.no-data {
	padding: 40rpx 0;
	text-align: center;
}

.loading {
	padding: 40rpx 0;
	text-align: center;
}

.uni-body {
	width: 100%;
	color: #909399;
	display: flex;
	justify-content: space-between;
	align-items: center;

	text {
		color: #909399;
	}

	.value-container {
		display: flex;
		align-items: center;

		.copy-icon {
			margin-left: 0rpx;
		}
	}
}

/* 使用 Tailwind CSS 替代了这些自定义样式 */

.underline-btn {
	color: var(--blue1);
	font-size: 30rpx;
	text-decoration: underline;
	cursor: pointer;
}

.cancel-btn {
	background-color: #ff4d4f;
	color: #ffffff;
	font-size: 32rpx;
	padding: 20rpx 60rpx;
	border-radius: 60rpx;
	text-align: center;
	font-weight: 500;
}

/* 方案详情全屏弹窗样式 */
.scheme-details-popup {
	width: 100%;
	height: 100vh;
	display: flex;
	flex-direction: column;
	background-color: #fff;
}

.scheme-details-header {
	display: flex;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1px solid #eee;
	position: relative;
}

.close-btn {
	position: absolute;
	left: 30rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1;
}

.popup-title {
	flex: 1;
	text-align: center;
	font-size: 32rpx;
	font-weight: 500;
}

.scheme-details-content {
	flex: 1;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
}

/* 表格内容样式 */
.bet-content-cell {
	white-space: normal !important;
	word-wrap: break-word;
	overflow-wrap: break-word;
	vertical-align: middle !important;
	padding-top: 10rpx !important;
	padding-bottom: 10rpx !important;
}

.bet-content-cell .flex {
	flex-wrap: wrap;
}

/* 自定义阴影效果 */
.custom-card-shadow {
	box-shadow: 0px 0px 5px 3px rgba(0,0,0,0.10);
}

/* 蓝色文本颜色 */
.c-3C9CFF {
	color: #3C9CFF;
}

/* 主题背景色 */
.bg-theme-color {
	background-color: var(--themeColor);
}

/* 按钮文本垂直居中 */
.btn-text-center {
	vertical-align: middle;
	line-height: 100rpx;
}

/* 发单宣言审核弹窗样式 */
.declaration-review-popup {
	width: 600rpx;
	background-color: #fff;
	border-radius: 20rpx;
	overflow: hidden;
}

.popup-title {
	font-size: 32rpx;
	font-weight: bold;
	text-align: center;
	padding: 30rpx;
	border-bottom: 1rpx solid #eee;
	color: #333;
}

.popup-content {
	padding: 30rpx;
}

.user-info, .declaration-content {
	display: flex;
	margin-bottom: 20rpx;
	align-items: flex-start;
}

.label {
	color: #666;
	font-size: 28rpx;
	width: 120rpx;
	flex-shrink: 0;
}

.value {
	color: #333;
	font-size: 28rpx;
	flex: 1;
	word-break: break-all;
}

.warning-message {
	background-color: #fff2f0;
	border: 1rpx solid #ffccc7;
	border-radius: 8rpx;
	padding: 20rpx;
	margin-top: 20rpx;
	color: #ff4d4f;
	font-size: 26rpx;
	line-height: 1.5;
}

.popup-footer {
	display: flex;
	border-top: 1rpx solid #eee;
}

.btn {
	flex: 1;
	height: 100rpx;
	line-height: 100rpx;
	text-align: center;
	font-size: 30rpx;
	cursor: pointer;
	transition: background-color 0.3s;
}

.btn-reset {
	background-color: #fff;
	color: #ff4d4f;
	border-right: 1rpx solid #eee;
	
	&:active {
		background-color: #fff2f0;
	}
}

.btn-approve {
	background-color: #fff;
	color: #1890ff;
	
	&:active {
		background-color: #f0f8ff;
	}
}
</style>