import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import Modal from 'bootstrap/js/dist/modal';

// Modal
export function useModal(modalRef: Ref<HTMLElement | null>) {
  const modal = ref<Modal | null>(null);

  onMounted(() => {
    if (!modalRef.value) return;

    modal.value = new Modal(modalRef.value);

    // 解決 Bootstrap Modal 關閉後焦點問題
    // https://github.com/twbs/bootstrap/issues/41005
    modalRef.value.addEventListener('hide.bs.modal', () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
  });

  const openModal = () => {
    modal.value?.show();
  };

  const hideModal = () => {
    modal.value?.hide();
  };

  return {
    modal,
    openModal,
    hideModal,
  };
}
