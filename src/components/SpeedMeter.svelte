<script lang="ts">
  import type { MeterProps, PickType, StyleProps } from '../@types'
  
  /** props */
  export let height:PickType<MeterProps, 'height'> = 200
  export let width:PickType<MeterProps, 'width'> = 200
  export let start:PickType<MeterProps, 'start'> = 0
  export let end:PickType<MeterProps, 'end'> = 100
  export let scales:PickType<MeterProps, 'scales'> = 10

  /** constants */
  const outlineBorder:number = 4;
  const scaleHeight:number = 2; 

  const range = end - start

  export let meterValue:number = 0

  $: {
    styles['meter-deg'] = `${(range / 100) * meterValue + start}deg`
  }

  /** CSS Variables */
  const styles:StyleProps = {
    'height': `${height}px`,
    'width': `${width}px`,
    'scale-deg': `${range / scales}deg`,
    'offset-deg': `${start}deg`,
    'outline-border': `${outlineBorder}px`,
    'scale-height': `${scaleHeight}px`,
    'scale-origin': `${height / 2}px 0px`,
    'meter-deg': '90deg'
	};
	
	$:cssVarStyles = Object.entries(styles).map(([key, value]) => `--${key}:${value}`).join(';');
</script>

<style>
  ol li {
    list-style-type: none;
    list-style-position: inside;
  }
  .speedMeterWrapper {
    height: var(--height);
    width: var(--width);
    border: solid 8px #444444;
    border-radius: 50%;
  }
  .speedMeter {
    position: absolute;
    height: var(--height);
    width: var(--width);
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
        {#each Array(scales + 1) as _,i }
        {#if i % 3 === 0}
        <li style="--guage-width:5%;--guage-tick:{i};">
          <span>{i * 10}</span></li>
        {:else}
        <li style="--guage-width:3%;--guage-tick:{i};"></li>
        {/if}
        {/each}
      </ol>
      <aside class="needle"></aside>
      <p class="value">
        {Math.floor(meterValue * 2.7)}
        <span>km/h</span>
      </p>
    </div><!--outline-->
  </div><!--speedMeter-->
</div><!--speedMeterWrapper-->
<input type="range" min="0" max="100" bind:value={meterValue} />
