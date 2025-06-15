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

    // Adjust gradient based on theme - use CSS variables
    return {
        backgroundImage: `
      linear-gradient(rgba(var(--bg-overlay-light), 0.8), rgba(var(--bg-overlay-light), 0.95)),
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
    background-color: var(--background);
    padding-top: 1rem;
    padding-bottom: 1rem;
}

/* Style with background image */
.blog-post-item[style*="background-image"] {
    padding-bottom: 1rem;
    padding-top: 3rem;
    background-size: cover;
    background-position: center;
    position: relative;
}

/* Add blur effect to background images */
.blog-post-item[style*="background-image"]::before {
    content: "";
    position: absolute;
    inset: 0;
    backdrop-filter: blur(2px);
    pointer-events: none;
}

/* Add noise texture overlay */
.blog-post-item[style*="background-image"]::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E");
    opacity: 0.15;
    mix-blend-mode: overlay;
}

.blog-post-content {
    position: relative;
    z-index: 10;
    width: 100%;
}

.blog-post-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    font-family: 'Courier Prime', Courier, monospace;
    color: var(--heading-color);
}

.blog-post-description {
    margin-bottom: 1rem;
    opacity: 0.9;
    font-size: 1rem;
    line-height: 1.5;
    color: var(--text-color);
}

.blog-post-date {
    display: block;
    font-size: 0.75rem;
    opacity: 0.7;
    margin-top: -0.5rem;
    color: var(--text-color);
}

/* Hover effect */
.blog-post-item:hover {
    box-shadow: var(--box-shadow);
}
</style>