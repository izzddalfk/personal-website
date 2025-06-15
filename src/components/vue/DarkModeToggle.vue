<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

// Theme options: 'system', 'dark', 'light'
const currentTheme = ref('system');
const isDarkMode = ref(false);

// Function to apply the theme based on current selection
const applyTheme = () => {
    if (currentTheme.value === 'system') {
        // Use system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        isDarkMode.value = prefersDark;
        localStorage.removeItem('theme'); // Remove user preference
    } else {
        // Use explicit user choice
        isDarkMode.value = currentTheme.value === 'dark';
        localStorage.setItem('theme', currentTheme.value);
    }

    // Apply the theme to the document
    if (isDarkMode.value) {
        document.documentElement.classList.add('dark-theme');
    } else {
        document.documentElement.classList.remove('dark-theme');
    }
};

// Cycle through theme options
const cycleTheme = () => {
    if (currentTheme.value === 'system') {
        currentTheme.value = 'light';
    } else if (currentTheme.value === 'light') {
        currentTheme.value = 'dark';
    } else {
        currentTheme.value = 'system';
    }
    applyTheme();
};

// Initialize theme and set up system preference listener
onMounted(() => {
    // Check if user has saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        currentTheme.value = savedTheme;
    } else {
        currentTheme.value = 'system';
    }

    // Apply initial theme
    applyTheme();

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
        if (currentTheme.value === 'system') {
            applyTheme();
        }
    };

    // Modern approach with addEventListener
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup function
    onUnmounted(() => {
        mediaQuery.removeEventListener('change', handleChange);
    });
});

// Watch for theme changes
watch(currentTheme, applyTheme);
</script>

<template>
    <button @click="cycleTheme" class="theme-toggle" :aria-label="`Current theme: ${currentTheme}. Click to change.`"
        :title="`Current theme: ${currentTheme}`">
        <!-- System preference icon -->
        <div v-if="currentTheme === 'system'" class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
        </div>

        <!-- Sun icon for light mode -->
        <div v-else-if="currentTheme === 'light'" class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
        </div>

        <!-- Moon icon for dark mode -->
        <div v-else class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
        </div>
    </button>
</template>

<style scoped>
.theme-toggle {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text-color);
    transition: background-color 0.3s ease;
    position: relative;
}

.theme-toggle:hover {
    background-color: rgba(128, 128, 128, 0.2);
}

.icon {
    display: flex;
    align-items: center;
    justify-content: center;
}

.theme-toggle:hover .theme-name {
    opacity: 1;
}
</style>
