<template>
    <article class="blog-post-item" :style="backgroundImageStyle">
        <div class="blog-post-content">
            <h2 class="blog-post-title">{{ post.data.title }}</h2>
            <p class="blog-post-description">{{ post.data.description || post.data.excerpt }}</p>
            <time class="blog-post-date">
                <slot name="date"></slot>
            </time>
        </div>
    </article>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    post: {
        type: Object,
        required: true
    },
    imageUrl: {
        type: String,
        default: ''
    }
});

const backgroundImageStyle = computed(() => {
    const imageUrl = props.imageUrl || '';

    if (!imageUrl) return {};

    return {
        backgroundImage: `
      linear-gradient(rgba(255, 255, 255, 0.675), rgba(255, 255, 255, 1.0)),
      url(${imageUrl})
    `,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    };
});
</script>

<style>
@reference "../../styles/global.css";

.blog-post-item {
    @apply relative flex items-end rounded-xl px-8 mb-6 overflow-hidden;
    @apply border border-stone-400/70 shadow transition-all duration-300 ease-in-out;
}

/* Default background if no image */
.blog-post-item:not([style*="background-image"]) {
    @apply bg-white py-4;
}

/* Style with background image */
.blog-post-item[style*="background-image"] {
    @apply pb-4 pt-12 bg-cover bg-center relative;
}

/* Add blur effect to background images */
.blog-post-item[style*="background-image"]::before {
    content: "";
    @apply absolute inset-0 backdrop-blur-sm pointer-events-none;
}

/* Add noise texture overlay */
.blog-post-item[style*="background-image"]::after {
    content: "";
    @apply absolute inset-0 pointer-events-none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E");
    @apply opacity-15;
    mix-blend-mode: overlay;
}

.blog-post-content {
    @apply relative z-10 w-full;
}

.blog-post-title {
    @apply text-2xl font-bold mb-2;
    font-family: 'Courier Prime', Courier, monospace;
}

.blog-post-description {
    @apply mb-4 opacity-90 text-base leading-relaxed;
}

.blog-post-date {
    @apply block text-xs opacity-70 -mt-2;
}

/* Hover effect */
.blog-post-item:hover {
    @apply shadow-lg;
}
</style>