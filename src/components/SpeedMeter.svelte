<script lang="ts">
  import type { MeterProps, PickType, StyleProps } from '../@types'
  
  /** props */
  export let guageHeight:PickType<MeterProps, 'guageHeight'> = 200
  export let guageWidth:PickType<MeterProps, 'guageWidth'> = 200
  export let guageStart:PickType<MeterProps, 'guageStart'> = 0
  export let guageEnd:PickType<MeterProps, 'guageEnd'> = 100
  export let guageScales:PickType<MeterProps, 'guageScales'> = 10
  export let guageUnits:PickType<MeterProps, 'guageUnits'> = 'mph'
  export let guageInterval:PickType<MeterProps, 'guageInterval'> = 10
  export let currentValue:PickType<MeterProps, 'currentValue'> = 0
  export let scaleCoefficient:PickType<MeterProps, 'scaleCoefficient'> = 10
  export let guageLimit:PickType<MeterProps, 'guageLimit'> = 100

  /** constants */
  const OUTLINE_BORDER:number = 4
  const SCALE_HEIGHT:number = 2
  const GUAGE_RANGE = guageEnd - guageStart
  const GUAGE_COEFFICIENT = guageLimit / 100

  /** CSS Variables */
  const styles:StyleProps = {
    'guage-height': `${guageHeight}px`,
    'guage-width': `${guageWidth}px`,
    'scale-deg': `${GUAGE_RANGE / guageScales}deg`,
    'offset-deg': `${guageStart}deg`,
    'outline-border': `${OUTLINE_BORDER}px`,
    'scale-height': `${SCALE_HEIGHT}px`,
    'scale-origin': `${guageHeight / 2}px 0px`,
    'meter-deg': '90deg'
  }

  /** Reactive variables */
  let cssVarStyles

  $: {
    styles['meter-deg'] = `${(GUAGE_RANGE / 100) * currentValue + guageStart}deg`
    cssVarStyles = Object.entries(styles).map(([key, value]) => `--${key}:${value}`).join(';')
  }
</script>

<style>
  ol li {
    list-style-type: none;
    list-style-position: inside;
  }
  .speedMeterWrapper {
    height: var(--guage-height);
    width: var(--guage-width);
    border: solid 8px #444444;
    border-radius: 50%;
  }
  .speedMeter {
    position: absolute;
    height: var(--guage-height);
    width: var(--guage-width);
  }
  .speedMeter .outline {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: solid var(--outline-border) #ffffff;
    box-sizing: border-box;
    background: #444444;
    background: linear-gradient(180deg, #444444 0%, #000000 100%);
  }
  .speedMeter .outline ol {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }
  .speedMeter .outline ol li {
    position: absolute;
    top: 50%;
    left: 0;
    height: var(--scale-height);
    width: var(--guage-width);
    background: #ffffff;
    line-height: 1;
    transform-origin: var(--scale-origin);
    transform: rotate(calc(var(--scale-deg) * var(--guage-tick) + var(--offset-deg)));
  }
  .speedMeter .outline ol li span {
    position: relative;
    top: -0.5em;
    left: 30px;
    display: inline-block;
    font-weight: bold;
    color: #ffffff;
    transform: rotate(calc(-1 * (var(--scale-deg) * var(--guage-tick) + var(--offset-deg))));
  }
  .speedMeter .outline .needle {
    position: absolute;
    top: 50%;
    left: 0;
    height: 2px;
    width: 56%;
    background: #ff3333;
    transform-origin: var(--scale-origin);
    transform: rotate(var(--meter-deg));
  }
  .speedMeter .outline .needle::after {
    content: '';
    display: block;
    width: 20px;
    height: 20px;
    background:#333333;
    position:relative;
    top: -10px;
    left: 140px;
    border-radius: 50%;
    border: solid 1px #999999;
  }
  .speedMeter .outline .value {
    position: absolute;
    top: 60%;
    left: 0;
    width: 100%;
    font-size: 32px;
    font-weight: bold;
    text-align: center;
    color: #ffffff;
  }
  .speedMeter .outline .value span {
    display: block;
    font-size: 12px;
  }
</style>

<div class="speedMeterWrapper" style="{cssVarStyles}">
  <div class="speedMeter">
    <div class="outline">
      <ol>
        {#each Array(guageScales + 1) as _,i }
        {#if i % guageInterval === 0}
        <li style="--guage-width:5%;--guage-tick:{i};">
          <span>{i * scaleCoefficient}</span></li>
        {:else}
        <li style="--guage-width:3%;--guage-tick:{i};"></li>
        {/if}
        {/each}
      </ol>
      <aside class="needle"></aside>
      <p class="value">
        {Math.floor(currentValue * GUAGE_COEFFICIENT)}
        <span>{guageUnits}</span>
      </p>
    </div><!--outline-->
  </div><!--speedMeter-->
</div><!--speedMeterWrapper-->