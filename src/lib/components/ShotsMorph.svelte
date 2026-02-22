<script lang="ts">
  import { type Snippet } from "svelte";
  import { fade } from "svelte/transition";

  interface Props {
    open: boolean;
    mini: Snippet;
    expand: Snippet;
    miniWidth?: string;
    miniHeight?: string;
    expandWidth?: string;
    expandHeight?: string;
    class?: string;
  }

  let {
    open = $bindable(false),
    mini,
    expand,
    miniWidth = "96px",
    miniHeight = "36px",
    expandWidth = "700px",
    expandHeight = "800px",
    class: className = "",
  }: Props = $props();

  let status = $state<"idle" | "expanding" | "open" | "shrinking">("idle");
  let showExpand = $state(false);
  let triggerRect = $state<DOMRect | null>(null);
  let wrapperEl = $state<HTMLElement>();

  $effect(() => {
    if (open && status === "idle") {
      if (wrapperEl) triggerRect = wrapperEl.getBoundingClientRect();
      status = "expanding";
      const timer = setTimeout(() => {
        status = "open";
        showExpand = true;
      }, 650); // Matches animation duration
      return () => clearTimeout(timer);
    } else if (!open && status === "open") {
      status = "shrinking";
      showExpand = false;
      const timer = setTimeout(() => {
        status = "idle";
        triggerRect = null;
      }, 650);
      return () => clearTimeout(timer);
    }
  });

  function handleOpen() {
    if (!open) open = true;
  }

  function handleClose() {
    open = false;
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpen();
    }
  };

  let startX = $derived(triggerRect ? triggerRect.left : 0);
  let startY = $derived(triggerRect ? triggerRect.top : 0);
  let startW = $derived(triggerRect ? triggerRect.width : 0);
  let startH = $derived(triggerRect ? triggerRect.height : 0);
</script>

<div
  bind:this={wrapperEl}
  class="shots-morph-wrapper {className}"
  style:width={miniWidth}
  style:height={miniHeight}
>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="morph-container status-{status}"
    style:--start-x="{startX}px"
    style:--start-y="{startY}px"
    style:--start-w="{startW}px"
    style:--start-h="{startH}px"
    style:--expand-w={expandWidth}
    style:--expand-h={expandHeight}
    onclick={status === "idle" ? handleOpen : undefined}
    onkeydown={status === "idle" ? handleKeyDown : undefined}
    role={status === "idle" ? "button" : undefined}
    tabindex={status === "idle" ? 0 : -1}
  >
    <div class="content-viewport">
      {#if !showExpand}
        <div class="view-mini" class:is-exiting={status !== "idle"}>
          {@render mini()}
        </div>
      {:else}
        <div
          class="view-expand"
          class:is-entering={status === "expanding" || status === "open"}
        >
          {@render expand()}
        </div>
      {/if}
    </div>
  </div>
</div>

{#if open}
  <div
    class="backdrop"
    transition:fade={{ duration: 200 }}
    onclick={handleClose}
  ></div>
{/if}

<style>
  .shots-morph-wrapper {
    position: relative;
    display: inline-block;
  }

  .morph-container {
    background: #09090b;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 32px;
    z-index: 10;
    overflow: hidden;
    box-sizing: border-box;
  }

  /* States */
  .status-idle {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .status-idle:hover {
    transform: scale(1.02);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .status-expanding {
    position: fixed;
    z-index: 1000;
    animation: expansion-origin 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .status-open {
    position: fixed;
    top: 50%;
    left: 50%;
    width: var(--expand-w);
    height: var(--expand-h);
    transform: translate(-50%, -50%);
    box-shadow: 0 64px 128px -32px rgba(0, 0, 0, 1);
    z-index: 1000;
    border-radius: 40px;
  }

  .status-shrinking {
    position: fixed;
    z-index: 1000;
    animation: shrink-origin 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes expansion-origin {
    from {
      top: var(--start-y);
      left: var(--start-x);
      width: var(--start-w);
      height: var(--start-h);
      transform: translate(0, 0);
      border-radius: 32px;
    }
    to {
      top: 50%;
      left: 50%;
      width: var(--expand-w);
      height: var(--expand-h);
      transform: translate(-50%, -50%);
      border-radius: 40px;
    }
  }

  @keyframes shrink-origin {
    from {
      top: 50%;
      left: 50%;
      width: var(--expand-w);
      height: var(--expand-h);
      transform: translate(-50%, -50%);
      border-radius: 40px;
    }
    to {
      top: var(--start-y);
      left: var(--start-x);
      width: var(--start-w);
      height: var(--start-h);
      transform: translate(0, 0);
      border-radius: 32px;
    }
  }

  .content-viewport {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .view-mini,
  .view-expand {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .view-mini:not(.is-exiting) {
    animation: content-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .view-mini.is-exiting {
    opacity: 0;
    filter: blur(8px);
    transform: scale(0.9);
  }

  .view-expand.is-entering {
    animation: content-reveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes content-reveal {
    from {
      opacity: 0;
      filter: blur(10px);
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      filter: blur(0px);
      transform: scale(1);
    }
  }

  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(12px);
    z-index: 500;
  }

  :global(.h6) {
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  :global(.h2) {
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.025em;
  }
</style>
