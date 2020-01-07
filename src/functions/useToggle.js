import { ref } from '@vue/composition-api'


export function useToggle() {
  const isVisible = ref(true)

  function toggleVisible() {
    isVisible.value = !isVisible.value
  }

  return {
    isVisible,
    toggleVisible,
  }
}
