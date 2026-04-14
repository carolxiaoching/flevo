<script setup lang="ts">
  import { ref } from 'vue';
  import { useFormErrors } from 'vee-validate';
  import draggable from 'vuedraggable';
  import type { RecipeFormData } from '@/types/front/recipe';

  const tempRecipe = defineModel<RecipeFormData>({ required: true });
  const stepErrorMsg = ref<string>('');
  const errors = useFormErrors();

  function removeStep(delType: 'delId' | 'delIndex', index: number) {
    const { steps } = tempRecipe.value;
    if (steps.length > 1) {
      const targetIndex =
        delType === 'delId' ? steps.findIndex(step => step.stepOrder === index) : index;
      if (targetIndex !== -1) steps.splice(targetIndex, 1);
      if (steps.length <= 10) stepErrorMsg.value = '';
    }
  }

  function addStep() {
    if (tempRecipe.value.steps.length > 9) {
      stepErrorMsg.value = '步驟最多只能 10 個';
      return;
    }
    tempRecipe.value.steps.push({ stepContent: '' });
  }
</script>

<template>
  <!-- 步驟 -->
  <div class="mb-16 p-14 p-md-16 bg-white rounded shadow-sm">
    <h2 class="title mb-11">
      <span class="titleIcon bg-secondary-subtle">
        <i class="bi bi-diagram-3"></i>
      </span>
      <span> 步驟 </span>
      <span class="text-danger fs-6">(必填) </span>
    </h2>
    <draggable
      tag="ul"
      :list="tempRecipe.steps"
      class="mb-16 p-0 list-unstyled"
      handle=".handleBtn"
      item-key="id"
      animation="200"
      ghost-class="bg-light"
    >
      <template #item="{ element, index }">
        <li class="mb-11">
          <div class="d-flex align-items-center">
            <label class="form-label mb-0 me-auto h5">STEP {{ index + 1 }}</label>
            <a
              href="#"
              class="d-block me-8 link-danger fs-4"
              v-if="element.stepOrder"
              @click.prevent="removeStep('delId', index)"
            >
              <i class="bi bi-trash"></i>
            </a>
            <a
              href="#"
              class="d-block me-8 link-danger fs-4"
              v-else
              @click.prevent="removeStep('delIndex', index)"
            >
              <i class="bi bi-trash"></i>
            </a>
            <a href="#" class="handleBtn d-block link-muted fs-4">
              <i class="bi bi-list"></i>
            </a>
          </div>
          <VField
            as="textarea"
            rows="3"
            placeholder="請輸入步驟內容"
            class="form-control"
            :name="`steps[${index}].stepContent`"
            :class="{ 'is-invalid': errors[`steps[${index}].stepContent`] }"
            v-model="element.stepContent"
            rules="min:1|max:100|required"
            required
          />
          <p class="text-danger">
            <small v-if="errors[`steps[${index}].stepContent`]">
              步驟內容為必填，且需小於 100 個字元
            </small>
          </p>
        </li>
      </template>
    </draggable>

    <div class="alert alert-danger mb-16" role="alert" v-if="stepErrorMsg">
      {{ stepErrorMsg }}
    </div>

    <div class="text-center">
      <button type="button" class="btn btn-outline-primary px-21" @click="addStep">新增步驟</button>
    </div>
  </div>

  <!-- 小撇步 -->
  <div class="mb-16 p-16 bg-white rounded shadow-sm">
    <h2 class="title mb-11">
      <span class="titleIcon bg-secondary-subtle">
        <i class="bi bi-journal-text"></i>
      </span>
      <span> 小撇步 </span>
      <span class="text-muted fs-6">(選填) </span>
    </h2>
    <VField
      as="textarea"
      rows="3"
      placeholder="請輸入小撇步"
      class="form-control"
      name="小撇步"
      :class="{ 'is-invalid': errors['小撇步'] }"
      v-model="tempRecipe.note"
      rules="max:100"
    />
    <ErrorMessage name="小撇步" class="invalid-feedback" />
  </div>
</template>
