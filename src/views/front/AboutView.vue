<script setup lang="ts">
  import { ref } from 'vue';
  import aboutBornImg from '@/assets/images/about-born.webp';
  import aboutVisionImg from '@/assets/images/about-vision.webp';

  const timeline = ref<
    Array<{
      year: number;
      events: Array<{
        month: number;
        description: string;
      }>;
    }>
  >([
    {
      year: 2024,
      events: [{ month: 12, description: '品牌誕生，確立「燃味廚房」網站的名稱及理念。' }],
    },
    {
      year: 2025,
      events: [
        { month: 1, description: '網站正式上線，開放會員註冊，並提供訪客模式瀏覽功能。' },
        {
          month: 5,
          description: '網站上線後迅速獲得料理愛好者的支持，首月累積超過1,000位會員。',
        },
        {
          month: 8,
          description: '獲得「最佳新創美食平台獎」，被評為年度最具創意的美食分享平台。',
        },
      ],
    },
    {
      year: 2026,
      events: [
        {
          month: 2,
          description: '被列入「年度最佳社群平台」推薦榜單，並榮獲「優質用戶體驗設計獎。」',
        },
        {
          month: 8,
          description:
            '與知名美食媒體合作，推出「家傳味道系列」，鼓勵更多人分享家族傳承的料理故事。',
        },
      ],
    },
  ]);
</script>

<template>
  <div class="row align-items-center">
    <div class="col-12 py-8">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/">首頁</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">燃味故事</li>
        </ol>
      </nav>
    </div>

    <div class="d-none d-xl-block col-5 mb-16">
      <img v-lazy="aboutBornImg" class="w-100 h-100 rounded-2 object-fit-cover" />
    </div>
    <div class="col-12 col-xl-7 mb-16">
      <div class="aboutBorn backgroundCover h-100 p-8 p-md-14 p-xl-0 rounded-2">
        <div class="aboutMask p-14 p-md-16 rounded-2">
          <h2 class="mb-11 h3 text-center">燃味廚房 (FLEVO) 的誕生</h2>
          <p class="textLs mb-11 text-muted">
            我們發現每道厲害的私房菜背後，都藏著一段故事，因此打造了一個像「燃料庫」一樣的分享平台，讓大家的靈感互通，把做菜這件事變得更有趣、更有溫度
          </p>
          <p class="textLs text-muted">
            名字「FLEVO」是 Flavor (滋味) 加 Fuel
            (燃/能量)，我們相信料理不只能填飽肚子，更是熱情燃燒出的靈魂燃料，點燃每個人對生活的熱誠，讓幸福在這裡持續升溫。
          </p>
        </div>
      </div>
    </div>

    <div class="col-12 col-xl-7 mb-16 mb-md-18">
      <div class="aboutVision backgroundCover h-100 p-8 p-md-14 p-xl-0 rounded-2">
        <div class="aboutMask p-14 p-md-16 rounded-2">
          <h2 class="mb-11 h3 text-center">我們的願景</h2>
          <p class="textLs mb-11 text-muted">
            「燃味廚房」致力於成為每個人的靈感燃料站，不只是分享食譜，更要讓每一份獨門滋味，都能點燃另一座廚房的爐火，讓料理的熱情在各個家戶間傳遞，串聯成最溫暖的美味地圖。
          </p>
          <p class="textLs text-muted">
            期望每個人都能在這裡找到專屬的靈魂燃料，把下廚變成一場充滿能量的創作，讓「燃味」成為日常生活中最幸福的化學反應！
          </p>
        </div>
      </div>
    </div>

    <div class="d-none d-xl-block col-5 mb-18">
      <img v-lazy="aboutVisionImg" class="w-100 h-100 rounded-2 object-fit-cover" />
    </div>

    <div class="col-12 mb-16">
      <h2 class="title justify-content-lg-start mb-11">
        <span class="titleIcon bg-secondary-subtle">
          <i class="bi bi-people-fill"></i>
        </span>
        <span> 大記事 </span>
      </h2>

      <div class="timeline mx-auto">
        <ul class="timelineList list-unstyled position-relative py-8">
          <li
            class="timelineItem d-flex align-items-center"
            v-for="(yearData, timelineIndex) in timeline"
            :key="`timeline${timelineIndex}`"
          >
            <div
              class="timelineYear mb-8 mb-lg-0 bg-secondary rounded-4 text-center text-white fw-bold"
            >
              {{ yearData.year }}
            </div>
            <div class="timelineContent">
              <div
                class="timelineEvent p-11 bg-white rounded shadow-sm"
                v-for="(event, eventIndex) in yearData.events"
                :key="`event${eventIndex}`"
              >
                <h4 class="mb-8 text-center h5">{{ yearData.year }}年{{ event.month }}月</h4>
                <p class="text-muted">{{ event.description }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
