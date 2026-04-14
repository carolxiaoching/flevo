<template>
  <footer class="py-16 bg-light text-muted">
    <ul
      class="container list-unstyled d-flex flex-column flex-lg-row align-items-center align-items-lg-start mb-11 mb-lg-16"
    >
      <li class="me-lg-17 mb-11 text-center mb-lg-0 text-lg-start">
        <router-link to="/" class="d-block">
          <img src="../../assets/images/logo.svg" alt="logo" class="mw-100" />
        </router-link>
      </li>

      <li class="me-lg-17 mb-11 text-center mb-lg-0 text-lg-start">
        <h5 class="mb-11 text-center text-lg-start text-dark h6">關於</h5>
        <ul class="list-unstyled mb-0">
          <li>
            <router-link to="/about" class="footerLink d-block mb-4"> 關於燃味 </router-link>
          </li>
          <li>
            <router-link
              :to="{ name: 'qa', query: { current: '服務條款' } }"
              class="footerLink d-block mb-4"
            >
              服務條款
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name: 'qa', query: { current: '隱私權政策' } }"
              class="footerLink d-block mb-4"
            >
              隱私權政策
            </router-link>
          </li>
        </ul>
      </li>
      <li class="me-lg-17 mb-11 text-center mb-lg-0 text-lg-start">
        <h5 class="mb-11 text-center text-lg-start text-dark h6">支援</h5>
        <ul class="list-unstyled mb-0">
          <li>
            <router-link
              :to="{ name: 'qa', query: { current: '常見問題' } }"
              class="footerLink d-block mb-4"
            >
              常見問題
            </router-link>
          </li>
          <li>
            <router-link to="/recipes" class="footerLink d-block mb-4"> 靈感食譜 </router-link>
          </li>

          <li>
            <router-link to="/contact" class="footerLink d-block mb-4"> 燃味信箱 </router-link>
          </li>
        </ul>
      </li>
      <li class="ms-lg-auto mb-11 text-center mb-lg-0 text-lg-start">
        <h5 class="mb-11 text-center text-lg-start text-dark h6">追蹤燃味</h5>
        <div class="d-flex">
          <a href="#" class="socialMediaLink d-inline-block me-4 px-6 py-1 rounded-3 fs-3">
            <i class="bi bi-line"></i>
          </a>
          <a href="#" class="socialMediaLink d-inline-block me-4 px-6 py-1 rounded-3 fs-3">
            <i class="bi bi-facebook"></i>
          </a>
          <a href="#" class="socialMediaLink d-inline-block me-4 px-6 py-1 rounded-3 fs-3">
            <i class="bi bi-instagram"></i>
          </a>
          <a href="#" class="socialMediaLink d-inline-block me-4 px-6 py-1 rounded-3 fs-3">
            <i class="bi bi-twitter-x"></i>
          </a>
        </div>
      </li>
    </ul>
    <div class="px-4 text-center">Copyright © 燃味廚房 flevo 2026 All right reserved.</div>
  </footer>
</template>
