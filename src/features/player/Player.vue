<template>
  <div
    class="naive-video-player"
    ref="videoContainer"
    :class="{ playing: !params.paused }"
    @click="handleContainerClick"
  >
    <div class="video-wrapper" :class="{ long: !!isShort }">
      <div class="video-container">
        <video
          ref="videoElement"
          @progress="videoTimeUpdate"
          @timeupdate="videoTimeUpdate"
          @waiting="checkLoad"
          @canplay="checkLoad"
          @loadedmetadata="$emit('loadedMetaData', $event)"
          playsinline
          :muted="params.volume === 0"
          :poster="poster"
        />
      </div>
    </div>

    <!-- Loading Spinner -->
    <div v-if="params.loading" class="loading-overlay">
      <n-spin size="large" />
    </div>

    <!-- Player Interface -->
    <div
      class="player-interface"
      :class="{ visible: !params.overlay || params.paused }"
    >
      <!-- Top Controls -->
      <div class="top-controls">
        <slot name="top-controls" />
      </div>

      <!-- Middle Controls -->
      <div class="middle-controls" ref="midContainer">
        <!-- Large Play Button -->
        <n-button
          v-if="params.paused && !params.loading && !isMobile"
          circle
          size="large"
          class="large-play-btn"
          @click="playPause"
        >
          <template #icon>
            <n-icon size="48">
              <svg viewBox="0 0 64 64" fill="none">
                <path
                  d="M8 32V50.5787C8 56.7387 14.7573 60.6293 20.2587 57.64L28.8 52.9947M8 21.3333V13.4213C8 7.26134 14.7573 3.37067 20.2587 6.36001L54.424 24.9413C55.7048 25.6224 56.7761 26.6392 57.5232 27.8826C58.2703 29.1261 58.665 30.5494 58.665 32C58.665 33.4506 58.2703 34.8739 57.5232 36.1174C56.7761 37.3608 55.7048 38.3776 54.424 39.0587L37.3413 48.3493"
                  stroke="currentColor"
                  stroke-width="6"
                  stroke-linecap="round"
                />
              </svg>
            </n-icon>
          </template>
        </n-button>

        <!-- Mobile Controls -->
        <div v-if="isMobile" class="mobile-controls">
          <n-button circle size="large" @click="rewindBackward">
            <template #icon>
              <n-icon size="24">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.0198 2.04817C13.3222 1.8214 15.6321 2.39998 17.5557 3.68532C19.4794 4.97066 20.8978 6.88324 21.5694 9.09717C22.241 11.3111 22.1242 13.6894 21.2388 15.8269C20.3534 17.9643 18.7543 19.7286 16.714 20.8192C14.6736 21.9098 12.3182 22.2592 10.0491 21.8079C7.77999 21.3565 5.73759 20.1323 4.26989 18.3439C2.80219 16.5555 2 14.3136 2 12L0 12C-2.74181e-06 14.7763 0.962627 17.4666 2.72387 19.6127C4.48511 21.7588 6.93599 23.2278 9.65891 23.7694C12.3818 24.3111 15.2083 23.8918 17.6568 22.5831C20.1052 21.2744 22.0241 19.1572 23.0866 16.5922C24.149 14.0273 24.2892 11.1733 23.4833 8.51661C22.6774 5.85989 20.9752 3.56479 18.6668 2.02238C16.3585 0.479973 13.5867 -0.214321 10.8238 0.0578004C8.71195 0.265799 6.70517 1.02858 5 2.2532V1H3V5C3 5.55228 3.44772 6 4 6H8V4H5.99999C7.45608 2.90793 9.19066 2.22833 11.0198 2.04817ZM2 4V7H5V9H1C0.447715 9 0 8.55228 0 8V4H2ZM14.125 16C13.5466 16 13.0389 15.8586 12.6018 15.5758C12.1713 15.2865 11.8385 14.8815 11.6031 14.3609C11.3677 13.8338 11.25 13.2135 11.25 12.5C11.25 11.7929 11.3677 11.1758 11.6031 10.6488C11.8385 10.1217 12.1713 9.71671 12.6018 9.43388C13.0389 9.14463 13.5466 9 14.125 9C14.7034 9 15.2077 9.14463 15.6382 9.43388C16.0753 9.71671 16.4116 10.1217 16.6469 10.6488C16.8823 11.1758 17 11.7929 17 12.5C17 13.2135 16.8823 13.8338 16.6469 14.3609C16.4116 14.8815 16.0753 15.2865 15.6382 15.5758C15.2077 15.8586 14.7034 16 14.125 16ZM14.125 14.6501C14.5151 14.6501 14.8211 14.4637 15.043 14.0909C15.2649 13.7117 15.3759 13.1814 15.3759 12.5C15.3759 11.8186 15.2649 11.2916 15.043 10.9187C14.8211 10.5395 14.5151 10.3499 14.125 10.3499C13.7349 10.3499 13.4289 10.5395 13.207 10.9187C12.9851 11.2916 12.8741 11.8186 12.8741 12.5C12.8741 13.1814 12.9851 13.7117 13.207 14.0909C13.4289 14.4637 13.7349 14.6501 14.125 14.6501ZM8.60395 15.8554V10.7163L7 11.1405V9.81956L10.1978 9.01928V15.8554H8.60395Z"
                    fill="currentColor"
                  />
                </svg>
              </n-icon>
            </template>
          </n-button>

          <n-button circle size="large" @click="playPause">
            <template #icon>
              <n-icon size="24">
                <svg v-if="params.paused" viewBox="0 0 15 18" fill="none">
                  <path
                    d="M2.25926 17.7498C1.76543 18.0644 1.26519 18.0823 0.758519 17.8035C0.25284 17.5256 0 17.0963 0 16.5154V1.48502C0 0.904131 0.25284 0.474277 0.758519 0.195453C1.26519 -0.0824035 1.76543 -0.0640087 2.25926 0.250637L14.3333 7.76583C14.7778 8.05627 15 8.46773 15 9.00021C15 9.53268 14.7778 9.94414 14.3333 10.2346L2.25926 17.7498Z"
                    fill="white"
                  />
                </svg>
                <svg v-else viewBox="0 0 16 20" fill="none">
                  <path
                    d="M2.66667 19.3337C4.13333 19.3337 5.33333 18.1337 5.33333 16.667V3.33366C5.33333 1.86699 4.13333 0.666992 2.66667 0.666992C1.2 0.666992 0 1.86699 0 3.33366V16.667C0 18.1337 1.2 19.3337 2.66667 19.3337ZM10.6667 3.33366V16.667C10.6667 18.1337 11.8667 19.3337 13.3333 19.3337C14.8 19.3337 16 18.1337 16 16.667V3.33366C16 1.86699 14.8 0.666992 13.3333 0.666992C11.8667 0.666992 10.6667 1.86699 10.6667 3.33366Z"
                    fill="currentColor"
                  />
                </svg>
              </n-icon>
            </template>
          </n-button>

          <n-button circle size="large" @click="rewindForward">
            <template #icon>
              <n-icon size="24">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6.4443 3.68532C8.36795 2.39998 10.6778 1.8214 12.9802 2.04817C14.8093 2.22833 16.5439 2.90793 18 4H16V6H20C20.5523 6 21 5.55229 21 5V1H19V2.2532C17.2948 1.02859 15.2881 0.2658 13.1762 0.057802C10.4133 -0.214319 7.64154 0.479975 5.33316 2.02238C3.02478 3.56479 1.32262 5.85989 0.516718 8.51661C-0.289188 11.1733 -0.148981 14.0273 0.913451 16.5922C1.97588 19.1572 3.8948 21.2744 6.34325 22.5831C8.79169 23.8918 11.6182 24.3111 14.3411 23.7694C17.064 23.2278 19.5149 21.7588 21.2761 19.6127C23.0374 17.4666 24 14.7763 24 12L22 12C22 14.3136 21.1978 16.5555 19.7301 18.3439C18.2624 20.1323 16.22 21.3565 13.9509 21.8079C11.6818 22.2592 9.32641 21.9098 7.28604 20.8192C5.24567 19.7286 3.64657 17.9643 2.76121 15.8269C1.87585 13.6894 1.75901 11.3111 2.4306 9.09718C3.10219 6.88324 4.52065 4.97067 6.4443 3.68532ZM22 4V7H19V9H23C23.5523 9 24 8.55229 24 8V4H22ZM12.6018 15.5758C13.0389 15.8586 13.5466 16 14.125 16C14.7034 16 15.2078 15.8586 15.6382 15.5758C16.0753 15.2865 16.4116 14.8815 16.6469 14.3609C16.8823 13.8338 17 13.2135 17 12.5C17 11.7929 16.8823 11.1759 16.6469 10.6488C16.4116 10.1217 16.0753 9.71671 15.6382 9.43389C15.2078 9.14463 14.7034 9 14.125 9C13.5466 9 13.0389 9.14463 12.6018 9.43389C12.1713 9.71671 11.8385 10.1217 11.6031 10.6488C11.3677 11.1759 11.25 11.7929 11.25 12.5C11.25 13.2135 11.3677 13.8338 11.6031 14.3609C11.8385 14.8815 12.1713 15.2865 12.6018 15.5758ZM15.043 14.0909C14.8211 14.4637 14.5151 14.6501 14.125 14.6501C13.7349 14.6501 13.429 14.4637 13.207 14.0909C12.9851 13.7117 12.8741 13.1814 12.8741 12.5C12.8741 11.8186 12.9851 11.2916 13.207 10.9187C13.429 10.5395 13.7349 10.3499 14.125 10.3499C14.5151 10.3499 14.8211 10.5395 15.043 10.9187C15.2649 11.2916 15.3759 11.8186 15.3759 12.5C15.3759 13.1814 15.2649 13.7117 15.043 14.0909ZM8.60395 10.7163V15.8554H10.1978V9.01929L7 9.81956V11.1405L8.60395 10.7163Z"
                    fill="currentColor"
                  />
                </svg>
              </n-icon>
            </template>
          </n-button>
        </div>
      </div>

      <!-- Bottom Controls -->
      <div class="bottom-controls">
        <!-- Captions Display -->
        <div v-if="params.isCue && params.activeCue" class="captions-display">
          <n-card size="small" class="caption-card">
            {{ params.activeCue }}
          </n-card>
        </div>

        <!-- Progress Bar -->
        <div class="progress-section">
          <n-slider
            v-model:value="progressValue"
            :min="0"
            :max="params.duration"
            :step="0.1"
            :tooltip="false"
            @update:value="handleProgressChange"
            @dragstart="params.isProgressive = true"
            @dragend="params.isProgressive = false"
            class="progress-slider"
          />

          <div v-if="isMobile" class="time-display">
            <n-text
              >{{ formatTime(params.currentTime) }} /
              {{ formatTime(params.duration) }}</n-text
            >
          </div>
        </div>

        <!-- Control Buttons -->
        <div class="control-buttons">
          <!-- Left Controls -->
          <div class="left-controls">
            <slot name="prev" />

            <n-button v-if="!isMobile" circle @click="rewindBackward">
              <template #icon>
                <n-icon size="20">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.0198 2.04817C13.3222 1.8214 15.6321 2.39998 17.5557 3.68532C19.4794 4.97066 20.8978 6.88324 21.5694 9.09717C22.241 11.3111 22.1242 13.6894 21.2388 15.8269C20.3534 17.9643 18.7543 19.7286 16.714 20.8192C14.6736 21.9098 12.3182 22.2592 10.0491 21.8079C7.77999 21.3565 5.73759 20.1323 4.26989 18.3439C2.80219 16.5555 2 14.3136 2 12L0 12C-2.74181e-06 14.7763 0.962627 17.4666 2.72387 19.6127C4.48511 21.7588 6.93599 23.2278 9.65891 23.7694C12.3818 24.3111 15.2083 23.8918 17.6568 22.5831C20.1052 21.2744 22.0241 19.1572 23.0866 16.5922C24.149 14.0273 24.2892 11.1733 23.4833 8.51661C22.6774 5.85989 20.9752 3.56479 18.6668 2.02238C16.3585 0.479973 13.5867 -0.214321 10.8238 0.0578004C8.71195 0.265799 6.70517 1.02858 5 2.2532V1H3V5C3 5.55228 3.44772 6 4 6H8V4H5.99999C7.45608 2.90793 9.19066 2.22833 11.0198 2.04817ZM2 4V7H5V9H1C0.447715 9 0 8.55228 0 8V4H2ZM14.125 16C13.5466 16 13.0389 15.8586 12.6018 15.5758C12.1713 15.2865 11.8385 14.8815 11.6031 14.3609C11.3677 13.8338 11.25 13.2135 11.25 12.5C11.25 11.7929 11.3677 11.1758 11.6031 10.6488C11.8385 10.1217 12.1713 9.71671 12.6018 9.43388C13.0389 9.14463 13.5466 9 14.125 9C14.7034 9 15.2077 9.14463 15.6382 9.43388C16.0753 9.71671 16.4116 10.1217 16.6469 10.6488C16.8823 11.1758 17 11.7929 17 12.5C17 13.2135 16.8823 13.8338 16.6469 14.3609C16.4116 14.8815 16.0753 15.2865 15.6382 15.5758C15.2077 15.8586 14.7034 16 14.125 16ZM14.125 14.6501C14.5151 14.6501 14.8211 14.4637 15.043 14.0909C15.2649 13.7117 15.3759 13.1814 15.3759 12.5C15.3759 11.8186 15.2649 11.2916 15.043 10.9187C14.8211 10.5395 14.5151 10.3499 14.125 10.3499C13.7349 10.3499 13.4289 10.5395 13.207 10.9187C12.9851 11.2916 12.8741 11.8186 12.8741 12.5C12.8741 13.1814 12.9851 13.7117 13.207 14.0909C13.4289 14.4637 13.7349 14.6501 14.125 14.6501ZM8.60395 15.8554V10.7163L7 11.1405V9.81956L10.1978 9.01928V15.8554H8.60395Z"
                      fill="currentColor"
                    />
                  </svg>
                </n-icon>
              </template>
            </n-button>

            <n-button v-if="!isMobile" circle @click="playPause">
              <template #icon>
                <n-icon size="20">
                  <svg v-if="params.paused" viewBox="0 0 15 18" fill="none">
                    <path
                      d="M2.25926 17.7498C1.76543 18.0644 1.26519 18.0823 0.758519 17.8035C0.25284 17.5256 0 17.0963 0 16.5154V1.48502C0 0.904131 0.25284 0.474277 0.758519 0.195453C1.26519 -0.0824035 1.76543 -0.0640087 2.25926 0.250637L14.3333 7.76583C14.7778 8.05627 15 8.46773 15 9.00021C15 9.53268 14.7778 9.94414 14.3333 10.2346L2.25926 17.7498Z"
                      fill="white"
                    />
                  </svg>
                  <svg v-else viewBox="0 0 16 20" fill="none">
                    <path
                      d="M2.66667 19.3337C4.13333 19.3337 5.33333 18.1337 5.33333 16.667V3.33366C5.33333 1.86699 4.13333 0.666992 2.66667 0.666992C1.2 0.666992 0 1.86699 0 3.33366V16.667C0 18.1337 1.2 19.3337 2.66667 19.3337ZM10.6667 3.33366V16.667C10.6667 18.1337 11.8667 19.3337 13.3333 19.3337C14.8 19.3337 16 18.1337 16 16.667V3.33366C16 1.86699 14.8 0.666992 13.3333 0.666992C11.8667 0.666992 10.6667 1.86699 10.6667 3.33366Z"
                      fill="currentColor"
                    />
                  </svg>
                </n-icon>
              </template>
            </n-button>

            <n-button v-if="!isMobile" circle @click="rewindForward">
              <template #icon>
                <n-icon size="20">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M6.4443 3.68532C8.36795 2.39998 10.6778 1.8214 12.9802 2.04817C14.8093 2.22833 16.5439 2.90793 18 4H16V6H20C20.5523 6 21 5.55229 21 5V1H19V2.2532C17.2948 1.02859 15.2881 0.2658 13.1762 0.057802C10.4133 -0.214319 7.64154 0.479975 5.33316 2.02238C3.02478 3.56479 1.32262 5.85989 0.516718 8.51661C-0.289188 11.1733 -0.148981 14.0273 0.913451 16.5922C1.97588 19.1572 3.8948 21.2744 6.34325 22.5831C8.79169 23.8918 11.6182 24.3111 14.3411 23.7694C17.064 23.2278 19.5149 21.7588 21.2761 19.6127C23.0374 17.4666 24 14.7763 24 12L22 12C22 14.3136 21.1978 16.5555 19.7301 18.3439C18.2624 20.1323 16.22 21.3565 13.9509 21.8079C11.6818 22.2592 9.32641 21.9098 7.28604 20.8192C5.24567 19.7286 3.64657 17.9643 2.76121 15.8269C1.87585 13.6894 1.75901 11.3111 2.4306 9.09718C3.10219 6.88324 4.52065 4.97067 6.4443 3.68532ZM22 4V7H19V9H23C23.5523 9 24 8.55229 24 8V4H22ZM12.6018 15.5758C13.0389 15.8586 13.5466 16 14.125 16C14.7034 16 15.2078 15.8586 15.6382 15.5758C16.0753 15.2865 16.4116 14.8815 16.6469 14.3609C16.8823 13.8338 17 13.2135 17 12.5C17 11.7929 16.8823 11.1759 16.6469 10.6488C16.4116 10.1217 16.0753 9.71671 15.6382 9.43389C15.2078 9.14463 14.7034 9 14.125 9C13.5466 9 13.0389 9.14463 12.6018 9.43389C12.1713 9.71671 11.8385 10.1217 11.6031 10.6488C11.3677 11.1759 11.25 11.7929 11.25 12.5C11.25 13.2135 11.3677 13.8338 11.6031 14.3609C11.8385 14.8815 12.1713 15.2865 12.6018 15.5758ZM15.043 14.0909C14.8211 14.4637 14.5151 14.6501 14.125 14.6501C13.7349 14.6501 13.429 14.4637 13.207 14.0909C12.9851 13.7117 12.8741 13.1814 12.8741 12.5C12.8741 11.8186 12.9851 11.2916 13.207 10.9187C13.429 10.5395 13.7349 10.3499 14.125 10.3499C14.5151 10.3499 14.8211 10.5395 15.043 10.9187C15.2649 11.2916 15.3759 11.8186 15.3759 12.5C15.3759 13.1814 15.2649 13.7117 15.043 14.0909ZM8.60395 10.7163V15.8554H10.1978V9.01929L7 9.81956V11.1405L8.60395 10.7163Z"
                      fill="currentColor"
                    />
                  </svg>
                </n-icon>
              </template>
            </n-button>

            <slot name="next" />

            <!-- Volume Control -->
            <div v-if="!isMobile" class="volume-control">
              <n-button circle @click="toggleMute">
                <template #icon>
                  <n-icon size="18">
                    <svg
                      v-if="params.volume > 0"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M24 12C24 8.28693 22.525 4.72597 19.8995 2.10046L18.4853 3.51468C20.7357 5.76511 22 8.81736 22 12C22 15.1826 20.7357 18.2348 18.4853 20.4852L19.8995 21.8995C22.525 19.2739 24 15.713 24 12ZM11 3.99995C11 3.59549 10.7564 3.23085 10.3827 3.07607C10.009 2.92129 9.57889 3.00685 9.29289 3.29285L4.58579 7.99995H1C0.447715 7.99995 0 8.44767 0 8.99995V15C0 15.5522 0.447715 16 1 16H4.58579L9.29289 20.7071C9.57889 20.9931 10.009 21.0786 10.3827 20.9238C10.7564 20.7691 11 20.4044 11 20V3.99995ZM5.70711 9.70706L9 6.41417V17.5857L5.70711 14.2928L5.41421 14H5H2V9.99995H5H5.41421L5.70711 9.70706ZM16.0001 12C16.0001 10.4087 15.368 8.88254 14.2428 7.75732L12.8285 9.17154C13.5787 9.92168 14.0001 10.9391 14.0001 12C14.0001 13.0608 13.5787 14.0782 12.8285 14.8284L14.2428 16.2426C15.368 15.1174 16.0001 13.5913 16.0001 12ZM17.0709 4.92889C18.9462 6.80426 19.9998 9.3478 19.9998 12C19.9998 14.6521 18.9462 17.1957 17.0709 19.071L15.6567 17.6568C17.157 16.1565 17.9998 14.1217 17.9998 12C17.9998 9.87823 17.157 7.8434 15.6567 6.34311L17.0709 4.92889Z"
                        fill="currentColor"
                      />
                    </svg>
                    <svg v-else viewBox="0 0 24 24" fill="none">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M11 4.00003C11 3.59557 10.7564 3.23093 10.3827 3.07615C10.009 2.92137 9.57889 3.00692 9.29289 3.29292L4.58579 8.00003H1C0.447715 8.00003 0 8.44774 0 9.00003V15C0 15.5523 0.447715 16 1 16H4.58579L9.29289 20.7071C9.57889 20.9931 10.009 21.0787 10.3827 20.9239C10.7564 20.7691 11 20.4045 11 20V4.00003ZM5.70711 9.70714L9 6.41424V17.5858L5.70711 14.2929L5.41421 14H5H2V10H5H5.41421L5.70711 9.70714ZM15.2929 9.70714L17.5858 12L15.2929 14.2929L16.7071 15.7071L19 13.4142L21.2929 15.7071L22.7071 14.2929L20.4142 12L22.7071 9.70714L21.2929 8.29292L19 10.5858L16.7071 8.29292L15.2929 9.70714Z"
                        fill="currentColor"
                      />
                    </svg>
                  </n-icon>
                </template>
              </n-button>

              <n-slider
                v-model:value="params.volume"
                :min="0"
                :max="1"
                :step="0.01"
                :tooltip="false"
                @update:value="updateVolume"
                class="volume-slider"
              />
            </div>

            <div v-if="!isMobile" class="time-display">
              <n-text
                >{{ formatTime(params.currentTime) }} /
                {{ formatTime(params.duration) }}</n-text
              >
            </div>
          </div>

          <div class="right-controls">
            <n-dropdown
              v-if="hasSettings"
              trigger="click"
              :options="settingsOptions"
              @select="handleSettingsSelect"
              placement="top-end"
            >
              <n-button circle>
                <template #icon>
                  <n-icon size="18">
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M19.14 12.94c.04-.3.06-.61.06-.94c0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6s3.6 1.62 3.6 3.6s-1.62 3.6-3.6 3.6"
                      />
                    </svg>
                  </n-icon>
                </template>
              </n-button>
            </n-dropdown>

            <!-- Picture in Picture -->
            <n-button v-if="showIsPip" circle @click="setPictureInPicture">
              <template #icon>
                <n-icon size="18">
                  <svg viewBox="0 0 24 20" fill="none">
                    <path
                      d="M18.5455 8.88889H12C11.4 8.88889 10.9091 9.38889 10.9091 10V14.4444C10.9091 15.0556 11.4 15.5556 12 15.5556H18.5455C19.1455 15.5556 19.6364 15.0556 19.6364 14.4444V10C19.6364 9.38889 19.1455 8.88889 18.5455 8.88889ZM24 17.7778V2.2C24 0.977778 23.0182 0 21.8182 0H2.18182C0.981818 0 0 0.977778 0 2.2V17.7778C0 19 0.981818 20 2.18182 20H21.8182C23.0182 20 24 19 24 17.7778ZM20.7273 17.8H3.27273C2.67273 17.8 2.18182 17.3 2.18182 16.6889V3.3C2.18182 2.68889 2.67273 2.18889 3.27273 2.18889H20.7273C21.3273 2.18889 21.8182 2.68889 21.8182 3.3V16.6889C21.8182 17.3 21.3273 17.8 20.7273 17.8Z"
                      fill="currentColor"
                    />
                  </svg>
                </n-icon>
              </template>
            </n-button>

            <!-- Size Toggle -->
            <n-button v-if="showIsShort" circle @click="changeSize">
              <template #icon>
                <n-icon size="18">
                  <svg v-if="isShort" viewBox="0 0 80 40" fill="none">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M78.0953 3.21631V36.7836H1.90479V3.21631H78.0953ZM9.52383 8.01163H70.4762V31.9882H9.52383V8.01163Z"
                      fill="currentColor"
                    />
                  </svg>
                  <svg v-else viewBox="0 0 56 40" fill="none">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M54.6668 3.21631V36.7836H1.3335V3.21631H54.6668ZM6.66683 8.01163H49.3335V31.9882H6.66683V8.01163Z"
                      fill="currentColor"
                    />
                  </svg>
                </n-icon>
              </template>
            </n-button>

            <!-- Fullscreen -->
            <n-button v-if="showFullScreen" circle @click="handleFullScreen">
              <template #icon>
                <n-icon size="18">
                  <svg v-if="params.fullScreen" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M4.07143 19V14.9286H0V12.2143H6.78571V19H4.07143ZM12.2143 19V12.2143H19V14.9286H14.9286V19H12.2143ZM0 6.78571V4.07143H4.07143V0H6.78571V6.78571H0ZM12.2143 6.78571V0H14.9286V4.07143H19V6.78571H12.2143Z"
                      fill="currentColor"
                    />
                  </svg>
                  <svg v-else viewBox="0 0 20 20" fill="none">
                    <path
                      d="M6 1H3C2.46957 1 1.96086 1.21071 1.58579 1.58579C1.21071 1.96086 1 2.46957 1 3V6M19 6V3C19 2.46957 18.7893 1.96086 18.4142 1.58579C18.0391 1.21071 17.5304 1 17 1H14M14 19H17C17.5304 19 18.0391 18.7893 18.4142 18.4142C18.7893 18.0391 19 17.5304 19 17V14M1 14V17C1 17.5304 1.21071 18.0391 1.58579 18.4142C1.96086 18.7893 2.46957 19 3 19H6"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </n-icon>
              </template>
            </n-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Modal -->
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
} from "vue";
import {
  NButton,
  NIcon,
  NSpin,
  NSlider,
  NText,
  NCard,
  NDropdown,
} from "naive-ui";
import Hls, { type HlsConfig } from "hls.js";

// Props interface
interface Props {
  isShort?: boolean;
  url: string;
  poster?: string;
  changeTimTo?: number | null;
  disabledFirstLoad?: boolean;
  stopOnUnFocus?: boolean;
  customHls?: Hls | null;
  config?: Partial<HlsConfig>;
  showFullScreen?: boolean;
  showIsShort?: boolean;
  showIsPip?: boolean;
  canAutoPlay?: boolean;
  openSidebar?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showFullScreen: true,
  showIsShort: true,
  showIsPip: true,
});

// Emits
const emit = defineEmits([
  "exit",
  "changeVolume",
  "playing",
  "paused",
  "canPlay",
  "handleFullScreen",
  "setPip",
  "exitPip",
  "changeSize",
  "videoTimeChanged",
  "progressed",
  "beforeRemovingUrl",
  "ended",
  "started",
  "watchedTime",
  "loadedMetaData",
  "getActiveChunk",
]);

// Refs
const videoContainer = ref<HTMLDivElement>();
const midContainer = ref<HTMLDivElement>();
const videoElement = ref<HTMLVideoElement>();

// Reactive state
const params = reactive({
  loading: false,
  paused: true,
  startedTime: 0,
  currentTime: 0,
  duration: 0,
  canPlay: 0,
  startedTimeOnProgress: 0,
  endedTimeOnProgress: 0,
  beforeStartTimeOnProgress: 0,
  totalRewindTime: 0,
  totalWatchedTime: 0,
  volume: 0.5,
  fullScreen: false,
  activeLevel: -1,
  activeTrack: 0,
  audioTracks: [] as any[],
  levels: [] as any[],
  isSettings: false,
  isProgressive: false,
  volumeShowed: false,
  changingVideoTime: false,
  pausedBeforePause: false,
  overlay: false,
  secondaryActiveLevel: null as any,
  secondaryActiveTrack: null as number | null,
  activeCaption: null as number | null,
  captions: null as TextTrackList | null,
  activeCue: "",
  activeChunk: null as any,
  isCue: false,
  secondaryActiveCaption: null as number | null,
});

// Variables
let hls: Hls | null = null;
let startTime = 0;
let endTime = 0;
let onFirstPlay = ref(false);
let timeout_of_progress: ReturnType<typeof setTimeout>;
let time_out_of_overlay: ReturnType<typeof setTimeout>;

// Computed
const isMobile = computed(() => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
});

const progressValue = computed({
  get: () => params.currentTime,
  set: (value: number) => {
    if (videoElement.value) {
      videoElement.value.currentTime = value;
      params.currentTime = value;
    }
  },
});

const hasSettings = computed(() => {
  return (
    params.audioTracks.length > 0 ||
    params.levels.length > 0 ||
    (params.captions && params.captions.length > 0)
  );
});

// Methods
const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return "0:00";

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const settingsOptions = computed(() => {
  const options: any[] = [];

  // Video Quality submenu
  if (params.levels.length > 0) {
    const qualityOptions = [
      {
        key: "quality-auto",
        label: "Auto",
        props: {
          onClick: () => setLevel(-1),
        },
      },
      ...params.levels.map((level, index) => ({
        key: `quality-${index}`,
        label: `${level.height}p`,
        props: {
          onClick: () => setLevel(index),
        },
      })),
    ];

    options.push({
      key: "quality",
      label: "Video Quality",
      children: qualityOptions,
    });
  }

  // Audio Track submenu
  if (params.audioTracks.length > 1) {
    const audioOptions = params.audioTracks.map((track, index) => ({
      key: `audio-${index}`,
      label: track.name || `Track ${index + 1}`,
      props: {
        onClick: () => setTrack(index),
      },
    }));

    options.push({
      key: "audio",
      label: "Audio Track",
      children: audioOptions,
    });
  }

  // Captions submenu
  if (params.captions && params.captions.length > 0) {
    const captionOptions = [
      {
        key: "caption-off",
        label: "Off",
        props: {
          onClick: () => setCap(-1),
        },
      },
      ...Array.from(params.captions).map((caption, index) => ({
        key: `caption-${index}`,
        label: caption.label || caption.language || `Caption ${index + 1}`,
        props: {
          onClick: () => setCap(index),
        },
      })),
    ];

    options.push({
      key: "captions",
      label: "Captions",
      children: captionOptions,
    });
  }

  return options;
});

// Event handler
const handleSettingsSelect = (key: string) => {
  console.log("Settings selected:", key);
};

const launchVideo = async () => {
  if (!videoElement.value) return;

  params.loading = true;

  if (Hls.isSupported()) {
    if (props.customHls) {
      hls = props.customHls;
    } else {
      hls = new Hls({
        debug: false,
        lowLatencyMode: true,
        enableWorker: false,
        maxBufferSize: 10 * 1000 * 1000,
        startLevel: 0,
        autoStartLoad: !props.disabledFirstLoad,
        ...props.config,
      });
    }

    if (hls) {
      hls.attachMedia(videoElement.value);
      hls.loadSource(props.url);

      if (props.canAutoPlay) {
        videoElement.value.play();
      }

      setupHlsEvents();
    }
  } else if (videoElement.value.canPlayType("application/vnd.apple.mpegurl")) {
    videoElement.value.src = props.url;
  } else {
    videoElement.value.src = props.url;
  }

  params.loading = false;
};

const setupHlsEvents = () => {
  if (!hls) return;

  hls.on(Hls.Events.MANIFEST_PARSED, () => {
    if (hls?.audioTracks) {
      params.audioTracks = hls.audioTracks;
    }

    if (hls?.levels) {
      params.levels = [...hls.levels].sort((a, b) => b.height - a.height);
    }

    if (videoElement.value) {
      params.captions = videoElement.value.textTracks;
    }
  });

  hls.on(Hls.Events.AUDIO_TRACK_SWITCHED, () => {
    if (hls) {
      params.activeTrack = hls.audioTrack;
    }
  });

  hls.on(Hls.Events.FRAG_CHANGED, (_, data) => {
    params.activeChunk = data.frag;
    emit("getActiveChunk", params);
  });
};

const videoTimeUpdate = () => {
  if (!videoElement.value || videoElement.value.duration <= 0) return;

  params.loading = false;
  params.currentTime = videoElement.value.currentTime;
  params.duration = videoElement.value.duration;

  if (!videoElement.value.paused) {
    const currentTime = new Date().getTime();
    params.totalWatchedTime += (currentTime - startTime) / 1000;
    startTime = currentTime;
  }

  // Update buffered progress
  if (videoElement.value.buffered && videoElement.value.buffered.length) {
    for (let i = 0; i < videoElement.value.buffered.length; i++) {
      if (
        videoElement.value.buffered.start(
          videoElement.value.buffered.length - 1 - i
        ) < videoElement.value.currentTime
      ) {
        params.canPlay =
          videoElement.value.buffered.end(
            videoElement.value.buffered.length - 1 - i
          ) / videoElement.value.duration;
        break;
      }
    }
    emit("canPlay", params.canPlay);
  }

  if (videoElement.value.readyState !== 4) {
    checkLoad();
  }

  emit("videoTimeChanged", params);
};

const checkLoad = () => {
  if (timeout_of_progress) clearTimeout(timeout_of_progress);
  timeout_of_progress = setTimeout(() => {
    if (videoElement.value) {
      params.loading = videoElement.value.readyState < 3;
    }
  }, 10);
};

const playPause = () => {
  if (!videoElement.value) return;

  if (params.overlay) {
    params.overlay = false;
    handleOverlay();
  } else {
    handleOverlay();

    if (videoElement.value.paused) {
      videoElement.value.play();
    } else {
      videoElement.value.pause();
    }

    if (hls && !hls.config.autoStartLoad) {
      hls.startLoad();
    }

    if (!onFirstPlay.value && !videoElement.value.paused) {
      onFirstPlay.value = true;
      params.startedTime = videoElement.value.currentTime;
      emit("started", params);
    }
  }
};

const rewindBackward = () => {
  if (!videoElement.value) return;

  params.isProgressive = true;
  const newTime = Math.max(0, videoElement.value.currentTime - 10);
  videoElement.value.currentTime = newTime;
  params.currentTime = newTime;

  setTimeout(() => {
    params.isProgressive = false;
  }, 200);
};

const rewindForward = () => {
  if (!videoElement.value) return;

  params.isProgressive = true;
  const newTime = Math.min(
    videoElement.value.duration,
    videoElement.value.currentTime + 10
  );
  videoElement.value.currentTime = newTime;
  params.currentTime = newTime;

  setTimeout(() => {
    params.isProgressive = false;
  }, 200);
};

const handleProgressChange = (value: number) => {
  if (!videoElement.value) return;

  params.isProgressive = true;
  videoElement.value.currentTime = value;
  params.currentTime = value;

  setTimeout(() => {
    params.isProgressive = false;
  }, 100);
};

const updateVolume = () => {
  if (!videoElement.value) return;

  videoElement.value.volume = params.volume;
  emit("changeVolume", params);
};

const toggleMute = () => {
  params.volume = params.volume > 0 ? 0 : 0.5;
  updateVolume();
};

const setLevel = (index: number) => {
  if (!hls) return;

  if (index === -1) {
    params.activeLevel = -1;
    hls.currentLevel = -1;
    hls.capLevelToPlayerSize = true;
  } else {
    const level = params.levels[index];
    const selectedIndex = hls.levels.findIndex(
      (l) => l.height === level.height
    );
    params.activeLevel = index;
    hls.currentLevel = selectedIndex;
  }
};

const setTrack = (index: number) => {
  if (!hls) return;

  hls.audioTrack = index;
  params.activeTrack = index;
};

const setCap = (index: number) => {
  params.activeCaption = index;

  if (!hls) return;

  if (index !== -1) {
    hls.subtitleTrack = index;
    params.isCue = true;
    getMediaText(index);
  } else {
    params.isCue = false;
  }
};

const getMediaText = (value: number) => {
  if (!params.captions) return;

  const track = params.captions[value] as TextTrack;
  params.activeCue = "";

  track.oncuechange = () => {
    params.activeCue = "";
    if (track.activeCues && track.activeCues.length > 0) {
      const cue = track.activeCues[0] as VTTCue;
      params.activeCue = cue.text;
    }
  };
};

const setPictureInPicture = () => {
  if (!videoElement.value) return;

  if (document.pictureInPictureElement) {
    document.exitPictureInPicture();
  } else if ("requestPictureInPicture" in videoElement.value) {
    videoElement.value.requestPictureInPicture();
  }

  emit("setPip");
};

const handleFullScreen = () => {
  params.fullScreen = !params.fullScreen;

  if (params.fullScreen) {
    if (videoContainer.value?.requestFullscreen) {
      videoContainer.value.requestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  emit("handleFullScreen", params);
};

const changeSize = () => {
  emit("changeSize", !props.isShort);
};

const updateValues = () => {
  if (params.secondaryActiveLevel !== null) {
    setLevel(params.secondaryActiveLevel);
    params.secondaryActiveLevel = null;
  }

  if (params.secondaryActiveTrack !== null) {
    setTrack(params.secondaryActiveTrack);
    params.secondaryActiveTrack = null;
  }

  if (params.secondaryActiveCaption !== null) {
    setCap(params.secondaryActiveCaption);
    params.secondaryActiveCaption = null;
  }

  params.isSettings = false;
};

const handleOverlay = () => {
  if (time_out_of_overlay) clearTimeout(time_out_of_overlay);
  params.overlay = false;

  time_out_of_overlay = setTimeout(() => {
    if (params.isProgressive || params.volumeShowed || params.isSettings)
      return;
    if (videoElement.value && videoElement.value.paused) return;
    params.overlay = true;
  }, 2000);
};

const handleContainerClick = (event: Event) => {
  const target = event.target as HTMLElement;

  const isControlElement =
    target.closest(".n-button") ||
    target.closest(".n-slider") ||
    target.closest(".n-dropdown");

  if (!isControlElement) {
    if (params.overlay) {
      // Controls ko'rinib turgan bo'lsa - yashirish
      params.overlay = false;
      handleOverlay();
    } else {
      // Controls yashirin bo'lsa - play/pause
      playPause();
    }
  }
};

// Event handlers
const setupEventListeners = () => {
  if (!videoElement.value) return;

  videoElement.value.addEventListener("play", () => {
    params.paused = false;
    startTime = new Date().getTime();
    emit("playing", params);
  });

  videoElement.value.addEventListener("pause", () => {
    params.paused = true;
    params.overlay = false;
    endTime = new Date().getTime();
    params.totalWatchedTime += (endTime - startTime) / 1000;
    emit("paused", params);
  });

  videoElement.value.addEventListener("ended", () => {
    emit("ended", params);
    if (videoElement.value) {
      videoElement.value.currentTime = 0;
    }
  });

  videoElement.value.addEventListener("leavepictureinpicture", () => {
    emit("exitPip");
  });

  // Keyboard controls
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!videoContainer.value?.contains(document.activeElement)) return;

    switch (event.code) {
      case "Space":
        event.preventDefault();
        playPause();
        break;
      case "ArrowRight":
        event.preventDefault();
        rewindForward();
        break;
      case "ArrowLeft":
        event.preventDefault();
        rewindBackward();
        break;
      case "ArrowUp":
        event.preventDefault();
        params.volume = Math.min(1, params.volume + 0.1);
        updateVolume();
        break;
      case "ArrowDown":
        event.preventDefault();
        params.volume = Math.max(0, params.volume - 0.1);
        updateVolume();
        break;
      case "KeyF":
        event.preventDefault();
        handleFullScreen();
        break;
      case "KeyM":
        event.preventDefault();
        toggleMute();
        break;
    }
  };

  document.addEventListener("keydown", handleKeyDown);

  // Mouse/touch events for overlay
  if (isMobile.value) {
    videoContainer.value?.addEventListener("touchmove", handleOverlay);
  } else {
    videoContainer.value?.addEventListener("mousemove", handleOverlay);
  }

  // Focus events
  videoContainer.value?.addEventListener("click", () => {
    videoContainer.value?.focus();
  });

  // Cleanup function
  return () => {
    document.removeEventListener("keydown", handleKeyDown);
    if (videoContainer.value) {
      if (isMobile.value) {
        videoContainer.value.removeEventListener("touchmove", handleOverlay);
      } else {
        videoContainer.value.removeEventListener("mousemove", handleOverlay);
      }
    }
  };
};

// Watchers
watch(
  () => props.url,
  (newUrl, oldUrl) => {
    if (newUrl !== oldUrl) {
      if (hls) {
        hls.destroy();
        hls = null;
      }
      emit("beforeRemovingUrl", params);
      emit("watchedTime", params);
      emit("exit", params);

      setTimeout(() => {
        launchVideo();
        updateVolume();
      }, 1000);
    }
  }
);

watch(
  () => params.volume,
  () => {
    updateVolume();
  }
);

watch(
  () => props.changeTimTo,
  (newTime) => {
    if (newTime && videoElement.value) {
      videoElement.value.currentTime = newTime;
    }
  }
);

// Lifecycle
onMounted(() => {
  launchVideo();
  updateVolume();
  const cleanup = setupEventListeners();

  // Set focus
  if (videoContainer.value) {
    videoContainer.value.tabIndex = 0;
    videoContainer.value.focus();
  }

  // Cleanup on unmount
  onBeforeUnmount(() => {
    if (cleanup) cleanup();
    if (hls) {
      hls.destroy();
      hls = null;
    }
    emit("exit", params);
    emit("watchedTime", params);
  });
});

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    emit("exit", params);
  });
}
</script>

<style scoped>
.naive-video-player {
  position: relative;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  outline: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.naive-video-player:focus {
  outline: 2px solid #18a058;
  outline-offset: 2px;
}

.video-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
}

.video-wrapper.long {
  width: 75%;
  margin: 0 auto;
  border-radius: 0;
}

.video-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}

.loading-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.player-interface {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.7) 0%,
    transparent 20%,
    transparent 80%,
    rgba(0, 0, 0, 0.7) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  color: white;
}

.player-interface.visible {
  opacity: 1;
  pointer-events: all;
}

.playing .player-interface {
  opacity: 0;
}

.playing .player-interface.visible {
  opacity: 1;
}

.top-controls {
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.middle-controls {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.large-play-btn {
  width: 80px !important;
  height: 80px !important;
  background: rgba(255, 255, 255, 0.2) !important;
  border: 2px solid rgba(255, 255, 255, 0.5) !important;
  backdrop-filter: blur(10px);
}

.mobile-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  max-width: 300px;
}

.mobile-controls .n-button {
  background: rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  backdrop-filter: blur(10px);
}

.bottom-controls {
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.captions-display {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}

.caption-card {
  background: rgba(0, 0, 0, 0.8) !important;
  border: none !important;
  max-width: 80%;
}

.progress-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-slider {
  --n-fill-color: #18a058 !important;
  --n-fill-color-hover: #36ad6a !important;
}

.control-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-controls,
.right-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-slider {
  width: 80px;
  --n-fill-color: #18a058 !important;
  --n-fill-color-hover: #36ad6a !important;
}

.time-display {
  min-width: 100px;
  text-align: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}

.n-button {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  transition: all 0.2s ease;
}

.n-button:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
  transform: scale(1.05);
}

.settings-modal {
  --n-color: #1a1a1a !important;
  --n-text-color: white !important;
}

.quality-options,
.track-options,
.caption-options {
  margin-top: 8px;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .bottom-controls {
    padding: 12px 16px;
  }

  .left-controls,
  .right-controls {
    gap: 4px;
  }

  .volume-control {
    display: none;
  }

  .time-display {
    font-size: 12px;
    min-width: auto;
  }

  .mobile-controls {
    width: 60%;
  }
}

/* Focus styles */
.n-button:focus {
  outline: 2px solid #18a058;
  outline-offset: 2px;
}

.progress-slider:focus {
  outline: 2px solid #18a058;
  outline-offset: 2px;
}

/* Custom scrollbar for settings modal */
.n-modal ::-webkit-scrollbar {
  width: 6px;
}

.n-modal ::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.n-modal ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.n-modal ::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
