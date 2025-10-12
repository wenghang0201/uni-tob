<template>
	<view class="flex flex-col w-100vw h-100vh" style="background-color: #f9f9f9;">
		<nav-bar :title="'店铺审核'"></nav-bar>

		<view class="flex flex-col justify-center items-center gap-20 p-20">
			<view class="justify-start fs-30 font-semibold" style="color: #ffa041;">
				您所提交的资料仅用于核实店铺信息，审核过后平台将不会保留照片
			</view>

			<view class="flex justify-between items-center w-690 h-111 bgc-fff rounded-20 px-20"
				style="box-shadow: 0px 4px 12px 6px rgba(0,0,0,0.03);" @click="showShopTypePopup">
				<view class="flex flex-col">
					<view class="c-333 fs-26 fw-600">选择经营类型</view>
					<view v-if="formData.shopType === '个体经营店'" class="c-999 fs-26 fw-400">运营者和代销证一致的店铺</view>
					<view v-else class="c-999 fs-26 fw-400">运营者和代销证不一致的店铺</view>
				</view>
				<view class="flex">
					<div class="c-333 fs-26 fw-400 mr-10">{{ formData.shopType }}</div>
					<u-icon name="arrow-right" />
				</view>
			</view>

			<view class="flex flex-wrap gap-20 w-full">
				<view v-for="(item, index) in filteredPhotoList" :key="index"
					class="flex flex-col items-center bgc-fff rounded-16 p-20 gap-20 overflow-hidden"
					style="box-shadow: 0px 4px 12px 6px rgba(0, 0, 0, 0.03);">
					<view class="text-center c-333 fs-26 fw-400 w-full text-hidden-1">{{ item.name }}</view>
					<view class="w-300 h-300 bgc-eee rounded-6 flex justify-center items-center"
						@click="chooseImage(item.originalIndex)">
						<template v-if="item.url">
							<image :src="item.url" mode="aspectFill" class="w-full h-full"></image>
						</template>
						<template v-else>
							<u-icon name="plus" size="40rpx" />
						</template>
					</view>
				</view>
			</view>

			<view class="w-full mt-40">
				<view class="w-690 h-78 mx-auto rounded-10 flex justify-center items-center"
					style="background: #007BE6;" @click="submitAudit">
					<view class="c-fff fs-30 fw-500">提交</view>
				</view>
			</view>
		</view>

		<u-popup :show="shopTypePopupShow" round="40rpx" mode="bottom" @close="shopTypePopupShow = false">
			<view class="w-full relative">
				<!-- 顶部标题和关闭按钮 -->
				<view class="flex justify-between items-center h-93 relative px-20">
					<u-icon name="close-circle" color="#B0B0B0" size="50rpx" class="opacity-0"></u-icon>
					<view class="text-center c-737373 fs-32 fw-500">经营类型选择</view>
					<u-icon name="close-circle" color="#B0B0B0" size="50rpx"></u-icon>
				</view>

				<!-- 分隔线 -->
				<view class="w-full h-2 bgc-f5"></view>

				<view class="flex flex-col mb-40">
					<!-- 个体经营店选项 -->
					<view class="w-full" :class="{ 'bgc-f2f2f2': formData.shopType === '个体经营店' }"
						@click="selectShopType('个体经营店')">
						<view class="flex flex-col items-center py-10">
							<view class="c-3b3b3b fs-28 fw-500">个体经营店</view>
							<view class="c-b0b0b0 fs-26 fw-400">经营者与代销者一致的店铺</view>
						</view>
						<view class="w-full h-2 bgc-f5"></view>
					</view>

					<!-- 个体转让店选项 -->
					<view class="w-full" :class="{ 'bgc-f2f2f2': formData.shopType === '个体转让店' }"
						@click="selectShopType('个体转让店')">
						<view class="flex flex-col items-center py-10">
							<view class="c-3b3b3b fs-28 fw-500">个体转让店</view>
							<view class="c-b0b0b0 fs-26 fw-400">经营者与代销者不一致的店铺</view>
						</view>
						<view class="w-full h-2 bgc-f5"></view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import cfg from '@/util/environment.js'
import { compressImage } from '@/util/image-tool.js';
import { addShopVerification } from '@/api/shop.js';

export default {
	data() {
		return {
			photoList: [
				{ name: '店铺门头照片', url: '', fileId: '' },
				{ name: '代销证照片', url: '', fileId: '' },
				{ name: '手持代销证照片', url: '', fileId: '' },
				{ name: '本人身份证国徽面', url: '', fileId: '' },
				{ name: '本人身份证人像面', url: '', fileId: '' },
				{ name: '手持身份证照片', url: '', fileId: '' },
				{ name: '原业主身份证国徽面', url: '', fileId: '' },
				{ name: '原业主身份证人像面', url: '', fileId: '' }
			],
			formData: {
				shopType: '个体转让店'
			},
			shopTypePopupShow: false,
		}
	},
	computed: {
		// 根据店铺类型过滤照片列表
		filteredPhotoList() {
			// 如果是个体经营店，不需要上传原业主身份证照片
			const isPersonalBusiness = this.formData.shopType === '个体经营店';

			return this.photoList
				.filter(item => {
					// 个体经营店不需要原业主身份证照片
					if (isPersonalBusiness &&
						(item.name === '原业主身份证国徽面' || item.name === '原业主身份证人像面')) {
						return false;
					}
					return true;
				})
				.map(item => {
					// 保存原始索引，以便在上传时能找到正确的项
					return {
						...item,
						originalIndex: this.photoList.findIndex(p => p.name === item.name)
					};
				});
		}
	},
	methods: {
		// 选择图片并上传
		chooseImage(index) {
			uni.chooseImage({
				count: 1,
				sourceType: ['相机', '相册'], //拍照或相册
				sizeType: ['compressed'], //压缩或原图
				success: (res) => {
					uni.showLoading({
						title: '上传中...'
					});
					compressImage(res.tempFilePaths, {
						maxSize: 200,
						maxWidth: 800,
						maxHeight: 800,
						quality: 0.7
					}).then(compressedImage => {
						// 上传压缩后的图片
						console.log("compressedImage", compressedImage)
						var tempPath = compressedImage
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
								uni.hideLoading();
								if (uploadFileRes.statusCode == 200) {
									console.log("上传成功==" + JSON.stringify(uploadFileRes));
									const data = JSON.parse(uploadFileRes.data);
									this.$set(this.photoList[index], 'url', data.url);
									this.$set(this.photoList[index], 'fileId', data.id);
									uni.showToast({
										title: '上传成功',
										icon: 'success'
									});
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
						})
					});
				}
			})
		},

		// 显示店铺类型选择弹窗
		showShopTypePopup() {
			this.shopTypePopupShow = true;
		},

		// 选择店铺类型
		selectShopType(type) {
			this.formData.shopType = type;
			this.shopTypePopupShow = false;
		},

		// 验证表单
		validateForm() {
			// 检查是否所有必要的照片都已上传
			const isPersonalBusiness = this.formData.shopType === '个体经营店';

			// 根据店铺类型过滤需要验证的照片
			const photosToValidate = this.photoList.filter(item => {
				// 个体经营店不需要原业主身份证照片
				if (isPersonalBusiness &&
					(item.name === '原业主身份证国徽面' || item.name === '原业主身份证人像面')) {
					return false;
				}
				return true;
			});

			// 检查是否有未上传的照片
			const missingPhotos = photosToValidate.filter(item => !item.url);
			if (missingPhotos.length > 0) {
				uni.showToast({
					title: `请上传${missingPhotos[0].name}`,
					icon: 'none'
				});
				return false;
			}
			return true;
		},

		// 提交审核
		submitAudit() {
			if (!this.validateForm()) {
				return;
			}

			uni.showLoading({
				title: '提交中...'
			});

			// 构建提交数据
			const isPersonalBusiness = this.formData.shopType === '个体经营店';
			const businessType = isPersonalBusiness ? 1 : 2; // 1个体经营店 2个体转让店
			const ownerMatch = isPersonalBusiness ? 1 : 0; // 1一致 0不一致

			// 准备API所需的数据
			const apiData = {
				businessType: businessType,
				ownerMatch: ownerMatch
			};

			// 根据照片名称映射到API所需的字段
			this.photoList.forEach(item => {
				if (!item.url) return;

				switch (item.name) {
					case '店铺门头照片':
						apiData.storefrontPhotoUrl = item.url;
						break;
					case '代销证照片':
						apiData.agencyLicensePhotoUrl = item.url;
						break;
					case '手持代销证照片':
						apiData.holdingLicensePhotoUrl = item.url;
						break;
					case '本人身份证国徽面':
						apiData.idCardBackPhotoUrl = item.url;
						break;
					case '本人身份证人像面':
						apiData.idCardFrontPhotoUrl = item.url;
						break;
					case '原业主身份证国徽面':
						apiData.originalOwnerIdCardBackUrl = item.url;
						break;
					case '原业主身份证人像面':
						apiData.originalOwnerIdCardFrontUrl = item.url;
						break;
				}
			});

			// 调用API提交认证信息
			addShopVerification(apiData)
				.then(res => {
					uni.hideLoading();
					if (res.success) {
						uni.showToast({
							title: '提交成功',
							icon: 'success'
						});

						// 提交成功后跳转到店铺审核中页面
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/shop/inactive'
							});
						}, 1500);
					} else {
						uni.showToast({
							title: res.errorMsg || '提交失败',
							icon: 'none'
						});
					}
				})
				.catch(err => {
					uni.hideLoading();
					uni.showToast({
						title: '提交失败',
						icon: 'none'
					});
					console.error('提交审核失败', err);
				});
		}
	}
}
</script>

<style>
/* 额外声明 tailwindcss.scss 不支持的样式 */
.c-737373 {
	color: #737373;
}

.c-3b3b3b {
	color: #3b3b3b;
}

.c-b0b0b0 {
	color: #b0b0b0;
}

.bgc-f5 {
	background-color: #f5f5f5;
}

.bgc-f2f2f2 {
	background-color: #f2f2f2;
}
</style>