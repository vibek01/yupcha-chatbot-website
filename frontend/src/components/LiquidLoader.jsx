import { createEffect, onCleanup } from 'solid-js';

const LiquidLoader = () => {
  return (
    <div class="liquid-loader">
      <div class="wave-container">
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
      </div>
      <div class="text">Generating your tweet...</div>
    </div>
  );
};

export default LiquidLoader;