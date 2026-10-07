<template>
  <span class="avatar" :class="size" :style="avatarColor(name)">{{ initialsOf(name) }}</span>
</template>

<script setup>
import { avatarColor, initialsOf } from '../../utils/format.js';

defineProps({
  name: { type: String, default: '' },
  size: { type: String, default: '' }, // '' | 'sm'
});
</script>
