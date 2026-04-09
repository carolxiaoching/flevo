import { onMounted, onUnmounted } from 'vue';
import Modal from 'bootstrap/js/dist/modal';
import type { Ref } from 'vue';

// Modal
export function useModal(modalRef: Ref<HTMLElement | null>) {
  let modal: Modal | null = null;

  // 解決 Bootstrap Modal 關閉後焦點問題
  // https://github.com/twbs/bootstrap/issues/41005
  const handleHide = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  onMounted(() => {
    if (modalRef.value) {
      modal = new Modal(modalRef.value);
      modalRef.value.addEventListener('hide.bs.modal', handleHide);
    }
  });

  onUnmounted(() => {
    if (modal) {
      modalRef.value?.removeEventListener('hide.bs.modal', handleHide);
      modal?.dispose();
      modal = null;
    }
  });

  const openModal = () => {
    modal?.show();
  };

  const hideModal = () => {
    modal?.hide();
  };

  return {
    openModal,
    hideModal,
  };
}
