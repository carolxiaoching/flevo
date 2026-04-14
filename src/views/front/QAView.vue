<script setup lang="ts">
  import { watch, ref } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const currentTab = ref<string>('常見問題');

  const qa = ref<
    Array<{
      title: string;
      icon: string;
      content: Array<{
        question: string;
        answer: string;
      }>;
    }>
  >([
    {
      title: '帳戶問題',
      icon: 'bi bi-person-fill',
      content: [
        {
          question: '如何註冊成為會員？',
          answer:
            '點擊首頁右上角的「註冊」按鈕，填寫您的個人資訊，設置帳戶名和密碼，並驗證您的電子郵件地址，即可完成註冊。',
        },
        {
          question: '忘記密碼怎麼辦？',
          answer:
            '在登錄頁面點擊「忘記密碼」，輸入您註冊時使用的電子郵件地址，我們會發送重置密碼的鏈接到您的郵箱，按照指示操作即可重置密碼。',
        },
        {
          question: '如何更改個人資料？',
          answer: '如果您需要刪除帳戶，請聯繫我們的客服團隊，我們將協助您完成帳戶刪除程序。',
        },
        {
          question: '如何刪除帳戶？',
          answer: '如果您需要刪除帳戶，請聯繫我們的客服團隊，我們將協助您完成帳戶刪除程序。',
        },
      ],
    },
    {
      title: '食譜相關',
      icon: 'bi bi-cookie',
      content: [
        {
          question: '如何記錄和保存食譜？',
          answer:
            '登錄您的帳戶後，點擊「新增食譜」按鈕，填寫食譜的標題、材料、步驟等詳細資訊，並可上傳相關圖片。填寫完成後，點擊「保存」即可將食譜儲存在您的帳戶中。',
        },
        {
          question: '如何分享食譜給他人？',
          answer:
            '在您的食譜頁面，點擊「分享」按鈕，您可以選擇將食譜公開在平台上，或者生成鏈接分享給家人和朋友。',
        },
        {
          question: '如何瀏覽其他用戶的公開食譜？',
          answer:
            '您可以使用首頁的搜索功能或瀏覽分類頁面，發掘其他用戶分享的公開食譜，並可依據評分和熱門程度進行篩選。',
        },
        {
          question: '如何與其他用戶互動？',
          answer:
            '您可以在食譜頁面留言評論，或點擊用戶的名稱查看其個人主頁，並可關注其帳戶，隨時獲取最新分享的食譜資訊。',
        },
      ],
    },
    {
      title: '其他',
      icon: 'bi bi-chat-dots-fill',
      content: [
        {
          question: '如何聯繫客服？',
          answer:
            '您可以通過網站底部的「聯繫我們」頁面找到客服聯絡方式，包括電子郵件和電話號碼，我們的客服團隊會盡快回應您的問題。',
        },
      ],
    },
  ]);

  const privacy = ref<
    Array<{
      title: string;
      content: string;
    }>
  >([
    {
      title: '資料收集',
      content: '我們會在註冊、使用服務或瀏覽網站時收集您的聯繫資訊、帳戶資訊、使用資訊和裝置資訊。',
    },
    {
      title: '資料使用',
      content: '收集的資料將用於提供和改進服務、通訊聯絡和安全保障。',
    },
    {
      title: '資料分享',
      content:
        '我們不會將您的個人資料出售或出租，僅在法律要求、保護權益或必要的第三方服務情況下分享。',
    },
    {
      title: '資料保護與存儲',
      content: '我們採取技術和管理措施保護您的個人資料，並僅保存至達成收集目的所需期間。',
    },
    {
      title: '用戶權利與Cookies',
      content:
        '您有權查閱、更正或刪除個人資料。本網站使用Cookies來提升用戶體驗，您可以通過瀏覽器設置管理。',
    },
    {
      title: '政策變更與聯絡',
      content: '本政策可能會不時更新，請定期查看。如有疑問，請聯繫客服團隊。',
    },
  ]);

  const tos = ref<
    Array<{
      title: string;
      content: string;
    }>
  >([
    {
      title: '服務內容',
      content: '本網站提供記錄、保存和分享食譜的平台，並可隨時修改或終止部分或全部服務。',
    },
    {
      title: '用戶註冊',
      content: '用戶需註冊為會員以使用完整功能，並需提供真實資料，否則可能導致帳戶被暫停或終止。',
    },
    {
      title: '用戶責任',
      content:
        '用戶對所發布的內容和互動行為負責，不得發布違法或不當內容，否則網站有權刪除內容並暫停或終止帳戶。',
    },
    {
      title: '隱私保護',
      content: '本網站依據《隱私政策》保護用戶的個人資料，具體請參閱隱私政策。',
    },
    {
      title: '知識產權',
      content: '本網站內容受知識產權法律保護，未經授權禁止使用、修改或分發。',
    },
    {
      title: '責任限制',
      content: '本網站對用戶內容不負責，且不對使用服務引起的任何損失或損害承擔責任。',
    },
  ]);

  // 監聽 route.query 的變化，動態更新選單
  watch(
    () => route.query.current,
    async newCurrent => {
      if (newCurrent && typeof newCurrent === 'string') {
        currentTab.value = newCurrent;
      }
    },
    { immediate: true }, // 初始時也會執行一次
  );
</script>

<template>
  <div class="row py-17">
    <div class="col-12 col-xl-3">
      <h5 class="sidebarTitle">選單</h5>
      <ul class="sidebarList">
        <li>
          <a
            href="#"
            class="sidebarLink"
            :class="{ active: currentTab == '常見問題' }"
            @click.prevent="currentTab = '常見問題'"
          >
            常見問題
          </a>
        </li>
        <li>
          <a
            href="#"
            class="sidebarLink"
            :class="{ active: currentTab == '隱私權政策' }"
            @click.prevent="currentTab = '隱私權政策'"
          >
            隱私權政策
          </a>
        </li>
        <li>
          <a
            href="#"
            class="sidebarLink"
            :class="{ active: currentTab == '服務條款' }"
            @click.prevent="currentTab = '服務條款'"
          >
            服務條款
          </a>
        </li>
      </ul>
    </div>
    <div class="col-12 col-xl-9">
      <div v-if="currentTab == '常見問題'" class="px-14 px-md-18 py-16 bg-white shadow-sm rounded">
        <h1 class="mb-11 text-center h2">常見問題</h1>

        <ul class="mb-16 list-unstyled" v-for="(item, index) in qa" :key="`qa${index}`">
          <li>
            <h2 class="title justify-content-start mb-11">
              <span class="titleIcon bg-secondary-subtle">
                <i :class="item.icon"></i>
              </span>
              <span> {{ item.title }} </span>
            </h2>
          </li>
          <li
            class="mb-8"
            v-for="(contentItem, contentIndex) in item.content"
            :key="`content${contentIndex}`"
          >
            <h3 class="mb-6 h6">Q：{{ contentItem.question }}</h3>
            <p>A：{{ contentItem.answer }}</p>
          </li>
        </ul>
      </div>
      <div
        v-if="currentTab == '隱私權政策'"
        class="px-14 px-md-18 py-16 bg-white shadow-sm rounded"
      >
        <h1 class="mb-11 text-center h2">隱私權政策</h1>

        <ul class="list-unstyled">
          <li class="mb-11" v-for="(item, index) in privacy" :key="`privacy${index}`">
            <h3 class="mb-6 h6">{{ index + 1 }}. {{ item.title }}</h3>
            <p>{{ item.content }}</p>
          </li>
        </ul>
      </div>
      <div v-if="currentTab == '服務條款'" class="px-14 px-md-18 py-16 bg-white shadow-sm rounded">
        <h1 class="mb-11 text-center h2">服務條款</h1>

        <ul class="list-unstyled">
          <li class="mb-11" v-for="(item, index) in tos" :key="`tos${index}`">
            <h3 class="mb-6 h6">{{ index + 1 }}. {{ item.title }}</h3>
            <p>{{ item.content }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
