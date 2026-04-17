<p align="center">
  <img src="https://res.cloudinary.com/dtgnh1wcu/image/upload/v1776346389/logo_egeulo.svg" alt="logo" width="100">
</p>

<h1 align="center">燃味廚房</h1>

<p align="center">
  <a href="https://carolxiaoching.github.io/flevo/#/">前台 Demo</a>
  ·
  <a href="https://carolxiaoching.github.io/flevo/#/admin-signin">後台 Demo</a>
  ·
  <a href="https://github.com/carolxiaoching/msc-backend">後端 Repo</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/vue_3-brightgreen?style=for-the-badge&logo=vuedotjs&logoColor=white&color=4FC08D">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white&color=3178c6">
  <img src="https://img.shields.io/badge/bootstrap_5-brightgreen?style=for-the-badge&logo=bootstrap&logoColor=white&color=7952B3">
  <img src="https://img.shields.io/badge/vite-brightgreen?style=for-the-badge&logo=vite&logoColor=white&color=646CFF">
</p>

<br>

![cover](https://res.cloudinary.com/dtgnh1wcu/image/upload/flevo_readmeBgCover_cieaet.png)

<p align="center">
  「燃味廚房」是一個為想記錄料理過程與靈感的人打造的分享平台，<br>
  透過分類、標籤與收藏功能，讓使用者可以更方便地管理與探索喜愛的食譜，<br>
  且網站支援 RWD 響應式設計，無論是手機、平板還是電腦，都能擁有良好的瀏覽體驗
</p>

<br>

## 功能總覽

**前台**

- 食譜建立與編輯（分類、標籤、營養資訊、公開 / 私人）
- 多條件搜尋與排序（關鍵字、分類、標籤、收藏數）
- 收藏食譜、會員個人頁面
- 會員設定（個人資料、頭像、密碼）
- 忘記密碼 Email 驗證流程

**後台**

- 儀表板（數據統計與視覺化圖表）
- 食譜、會員、分類、標籤、圖片的 CRUD 管理

## 技術亮點

- **拖曳排序**：Vue-Draggable 實作食材與步驟的拖曳調整
- **效能優化**：WebP 圖片格式 + Lazy Load
- **表單驗證**：Vee-Validate 統一管理所有表單
- **視覺化圖表**：Vue3-Apexcharts 呈現後台數據趨勢
- **響應式設計**：RWD 支援手機、平板、電腦

## 技術棧

| 分類       | 技術                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| 前端框架   | [Vue 3](https://vuejs.org/)、[Vite](https://vitejs.dev/)                                                                 |
| 程式語言   | [TypeScript](https://www.typescriptlang.org/)                                                                            |
| UI         | [Bootstrap 5](https://getbootstrap.com/)、[Bootstrap Icons](https://icons.getbootstrap.com/)                             |
| 狀態管理   | [Pinia](https://pinia.vuejs.org/)                                                                                        |
| API 請求   | [Axios](https://axios-http.com/)                                                                                         |
| 表單驗證   | [Vee-Validate](https://vee-validate.logaretm.com/)                                                                       |
| 排序拖曳   | [Vue-Draggable](https://github.com/SortableJS/Vue.Draggable)                                                             |
| 圖片優化   | [vue-lazyload](https://www.npmjs.com/package/vue-lazyload)                                                               |
| 輪播       | [Swiper](https://swiperjs.com/)                                                                                          |
| 加載動畫   | [Vue-Loading-Overlay](https://github.com/ankurk91/vue-loading-overlay)                                                   |
| 視覺化圖表 | [Apexcharts](https://www.npmjs.com/package/apexcharts)、[Vue3-Apexcharts](https://www.npmjs.com/package/vue3-apexcharts) |
| 格式工具   | [Prettier](https://prettier.io/)、[ESLint](https://eslint.org/)                                                          |
| 部署       | [gh-pages](https://github.com/tschaub/gh-pages)                                                                          |

## 快速開始

```bash
git clone https://github.com/carolxiaoching/flevo-frontend.git
cd flevo-frontend
npm install
npm run dev
```

## 頁面截圖

### 前台

| 首頁                                                                                      | 食譜列表                                                                                                                   |
| ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| ![首頁](https://res.cloudinary.com/dtgnh1wcu/image/upload/flevo_readmeBgCover_cieaet.png) | ![食譜列表](https://res.cloudinary.com/dtgnh1wcu/image/upload/v1776383158/%E9%A3%9F%E8%AD%9C%E5%88%97%E8%A1%A8_wjulh5.png) |

| 食譜詳細頁                                                                                                                   | 編輯食譜                                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| ![食譜詳細頁](https://res.cloudinary.com/dtgnh1wcu/image/upload/v1776383157/%E5%96%AE%E4%B8%80%E9%A3%9F%E8%AD%9C_hujsdj.png) | ![編輯食譜](https://res.cloudinary.com/dtgnh1wcu/image/upload/v1776383157/%E7%B7%A8%E8%BC%AF%E9%A3%9F%E8%AD%9C_pfcrft.png) |

| 會員頁面                                                                                                                   | 會員設定                                                                                                 |
| -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| ![會員頁面](https://res.cloudinary.com/dtgnh1wcu/image/upload/v1776383156/%E5%80%8B%E4%BA%BA%E9%A0%81%E9%9D%A2_wrkuwg.png) | ![會員設定](https://res.cloudinary.com/dtgnh1wcu/image/upload/v1776383156/%E8%A8%AD%E5%AE%9A_whmsyj.png) |

| 登入 / 註冊                                                                            | 忘記密碼                                                                                |
| -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| ![登入註冊](https://res.cloudinary.com/dtgnh1wcu/image/upload/flover_login_xdwuhp.png) | ![忘記密碼](https://res.cloudinary.com/dtgnh1wcu/image/upload/flover_forget_bck3lo.png) |

### 後台

| 儀表板                                                                                                                   | 食譜管理                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| ![儀表板](https://res.cloudinary.com/dtgnh1wcu/image/upload/v1776382009/%E5%BE%8C%E5%8F%B0%E9%A6%96%E9%A0%81_jehchq.png) | ![食譜管理](https://res.cloudinary.com/dtgnh1wcu/image/upload/v1776382009/%E9%A3%9F%E8%AD%9C%E7%AE%A1%E7%90%86_s9tlxb.png) |

| 會員管理                                                                                                                   | 會員編輯                                                                                   |
| -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| ![會員管理](https://res.cloudinary.com/dtgnh1wcu/image/upload/v1776382010/%E6%9C%83%E5%93%A1%E7%AE%A1%E7%90%86_btrztg.png) | ![會員編輯](https://res.cloudinary.com/dtgnh1wcu/image/upload/v1776382250/66_1_sncxik.png) |

| 分類管理                                                                                                                   | 圖片管理                                                                                                                   |
| -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| ![分類管理](https://res.cloudinary.com/dtgnh1wcu/image/upload/v1776382009/%E5%88%86%E9%A1%9E%E7%AE%A1%E7%90%86_d3zdiy.png) | ![圖片管理](https://res.cloudinary.com/dtgnh1wcu/image/upload/v1776382010/%E5%9C%96%E7%89%87%E7%AE%A1%E7%90%86_i1budk.png) |
