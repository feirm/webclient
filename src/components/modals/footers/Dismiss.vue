<template>
  <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
    <button
      @click.prevent="$emit('close')"
      type="button"
      class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-500 text-base font-medium text-white hover:bg-orange-400 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
    >
      Dismiss
    </button>
  </div>
</template>
