<template>
    <span ref="wordRef" class="tooltip-word" @click="handleInteraction" @mouseenter="!isMobile && showTooltip()"
        @mouseleave="!isMobile && handleMouseLeave()">
        <slot></slot>
        <Teleport to="body" v-if="isVisible">
            <div class="tooltip-content" :class="tooltipPositionClass" :style="popoverStyle" ref="tooltipRef"
                @mouseenter="!isMobile && handlePopoverMouseEnter()"
                @mouseleave="!isMobile && handlePopoverMouseLeave()">
                <div v-html="content"></div>
                <button v-if="isMobile" class="close-button" @click.stop="closeTooltip">×</button>
            </div>
        </Teleport>
    </span>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue';

const props = defineProps({
    content: {
        type: String,
        required: true
    }
});

const wordRef = ref(null);
const tooltipRef = ref(null);
const isVisible = ref(false);
const isMobile = ref(false);
const position = ref({ top: 0, left: 0 });
const tooltipPosition = ref('top'); // top, bottom, left, right

const tooltipPositionClass = computed(() => {
    return `tooltip-${tooltipPosition.value}`;
});

const popoverStyle = computed(() => {
    return {
        top: `${position.value.top}px`,
        left: `${position.value.left}px`
    };
});

const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768;
};

const showTooltip = () => {
    isMouseOverWord.value = true;
    isVisible.value = true;
    nextTick(() => {
        updatePosition();
    });
};

const updatePosition = () => {
    if (!wordRef.value || !tooltipRef.value) return;

    const wordRect = wordRef.value.getBoundingClientRect();
    const tooltipRect = tooltipRef.value.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate available space in different directions
    const spaceAbove = wordRect.top;
    const spaceBelow = viewportHeight - wordRect.bottom;
    const spaceLeft = wordRect.left;
    const spaceRight = viewportWidth - wordRect.right;

    // Decide the best position
    if (spaceAbove >= tooltipRect.height && spaceAbove >= spaceBelow) {
        // Posisi di atas
        tooltipPosition.value = 'top';
        position.value = {
            top: wordRect.top - tooltipRect.height - 10,
            left: Math.min(
                Math.max(10, wordRect.left + (wordRect.width / 2) - (tooltipRect.width / 2)),
                viewportWidth - tooltipRect.width - 10
            )
        };
    } else if (spaceBelow >= tooltipRect.height) {
        // Posisi di bawah
        tooltipPosition.value = 'bottom';
        position.value = {
            top: wordRect.bottom + 10,
            left: Math.min(
                Math.max(10, wordRect.left + (wordRect.width / 2) - (tooltipRect.width / 2)),
                viewportWidth - tooltipRect.width - 10
            )
        };
    } else if (spaceRight >= tooltipRect.width) {
        // Posisi di kanan
        tooltipPosition.value = 'right';
        position.value = {
            top: Math.min(
                Math.max(10, wordRect.top + (wordRect.height / 2) - (tooltipRect.height / 2)),
                viewportHeight - tooltipRect.height - 10
            ),
            left: wordRect.right + 10
        };
    } else {
        // Posisi di kiri
        tooltipPosition.value = 'left';
        position.value = {
            top: Math.min(
                Math.max(10, wordRect.top + (wordRect.height / 2) - (tooltipRect.height / 2)),
                viewportHeight - tooltipRect.height - 10
            ),
            left: wordRect.left - tooltipRect.width - 10
        };
    }
};

const closeTooltip = () => {
    isVisible.value = false;
};

// Track mouse over state to prevent closing when hovering between word and tooltip
const isMouseOverWord = ref(false);
const isMouseOverTooltip = ref(false);

const handleMouseLeave = () => {
    isMouseOverWord.value = false;
    // Delay hiding to check if mouse moved to tooltip
    setTimeout(() => {
        if (!isMouseOverTooltip.value && !isMouseOverWord.value) {
            isVisible.value = false;
        }
    }, 50);
};

const handlePopoverMouseEnter = () => {
    isMouseOverTooltip.value = true;
};

const handlePopoverMouseLeave = () => {
    isMouseOverTooltip.value = false;
    // Delay hiding to check if mouse moved back to word
    setTimeout(() => {
        if (!isMouseOverTooltip.value && !isMouseOverWord.value) {
            isVisible.value = false;
        }
    }, 50);
};

const handleInteraction = (e) => {
    if (isMobile.value) {
        e.preventDefault();
        isVisible.value = !isVisible.value;
        if (isVisible.value) {
            nextTick(() => {
                updatePosition();
                // Setup close when clicking outside
                setTimeout(() => {
                    document.addEventListener('click', handleOutsideClick);
                }, 10);
            });
        }
    }
};

const handleOutsideClick = (e) => {
    // Jika klik diluar tooltip dan diluar kata trigger
    if (tooltipRef.value && wordRef.value) {
        if (!tooltipRef.value.contains(e.target) && !wordRef.value.contains(e.target)) {
            isVisible.value = false;
            document.removeEventListener('click', handleOutsideClick);
        }
    }
};

onMounted(() => {
    checkMobile();
    window.addEventListener('resize', () => {
        checkMobile();
        if (isVisible.value) {
            nextTick(() => updatePosition());
        }
    });
    window.addEventListener('scroll', () => {
        if (isVisible.value) {
            updatePosition();
        }
    });
});

onUnmounted(() => {
    window.removeEventListener('resize', checkMobile);
    window.removeEventListener('scroll', updatePosition);
    document.removeEventListener('click', handleOutsideClick);
});
</script>

<style scoped>
.tooltip-word {
    position: relative;
    text-decoration: underline dotted;
    cursor: pointer;
    color: #0066cc;
}

.tooltip-content {
    position: fixed;
    background-color: #333;
    color: #fff;
    padding: 8px 12px;
    border-radius: 4px;
    z-index: 100;
    min-width: 200px;
    max-width: 300px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    white-space: normal;
    pointer-events: auto;
}

/* Arrow styles for different positions */
.tooltip-top::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
}

.tooltip-bottom::after {
    content: '';
    position: absolute;
    top: -10px;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent #333 transparent;
}

.tooltip-left::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -10px;
    margin-top: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent transparent #333;
}

.tooltip-right::after {
    content: '';
    position: absolute;
    top: 50%;
    left: -10px;
    margin-top: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent #333 transparent transparent;
}

.close-button {
    position: absolute;
    top: 2px;
    right: 2px;
    background: transparent;
    border: none;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.close-button:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
    .tooltip-content {
        width: 200px;
        padding-right: 25px;
        /* Beri ruang untuk tombol close */
    }
}
</style>