<script lang="ts">
  import type { MeterProps, StyleProps } from '../index'
  
  /** PROPS */
  export let gaugeHeight: MeterProps['gaugeHeight'] = 200
  export let gaugeWidth: MeterProps['gaugeWidth'] = 200
  export let gaugeStart: MeterProps['gaugeStart'] = 0
  export let gaugeEnd: MeterProps['gaugeEnd'] = 100
  export let gaugeScales: MeterProps['gaugeScales'] = 10
  export let gaugeUnits: MeterProps['gaugeUnits'] = 'mph'
  export let gaugeInterval: MeterProps['gaugeInterval'] = 10
  export let currentValue: MeterProps['currentValue'] = 0
  export let scaleCoefficient: MeterProps['scaleCoefficient'] = 10
  export let gaugeLimit: MeterProps['gaugeLimit'] = 100
  export let redzone: MeterProps['redzone'] = 100
  export let gaugeOutlineColor: MeterProps['gaugeOutlineColor'] = '#444444'
  export let gaugeColor: MeterProps['gaugeColor'] = '#ffffff'
  export let gaugeBackgroundColor: MeterProps['gaugeBackgroundColor'] = 'linear-gradient(180deg, #444444 0%, #000000 100%)'

  /** CONSTANTS */
  const OUTLINE_BORDER: number = 4
  const SCALE_HEIGHT: number = 2
  const GAUGE_RANGE = gaugeEnd - gaugeStart
  const GAUGE_COEFFICIENT = gaugeLimit / 100
  const SCALE_ORIGIN = `${gaugeHeight / 2 - OUTLINE_BORDER / 2}px 0px`

  /** CSS Variables */
  const styles: StyleProps = {
    'gauge-height': `${gaugeHeight}px`,
    'gauge-width': `${gaugeWidth}px`,
    'scale-deg': `${GAUGE_RANGE / gaugeScales}deg`,
    'offset-deg': `${gaugeStart}deg`,
    'outline-border': `${OUTLINE_BORDER}px`,
    'scale-height': `${SCALE_HEIGHT}px`,
    'scale-origin': SCALE_ORIGIN,
    'meter-deg': '90deg',
    'gauge-outline-color': gaugeOutlineColor,
    'gauge-color': gaugeColor,
    'gauge-background-color': gaugeBackgroundColor
  }

  /** Reactive variables */
  let cssVarStyles: string

  $: {
    styles['meter-deg'] = `${(GAUGE_RANGE / 100) * currentValue + gaugeStart}deg`
    cssVarStyles = Object.entries(styles).map(([key, value]) => `--${key}:${value}`).join(';')
  }
</script>

<style>
  ol li {
    list-style-type: none;
    list-style-position: inside;
  }
  .speedMeterWrapper {
    height: var(--gauge-height);
    width: var(--gauge-width);
    border: solid 8px var(--gauge-outline-color);
    border-radius: 50%;
  }
  .speedMeter {
    position: absolute;
    height: var(--gauge-height);
    width: var(--gauge-width);
  }
  .speedMeter .outline {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: solid var(--outline-border) var(--gauge-color);
    box-sizing: border-box;
    background: var(--gauge-background-color);
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
    width: var(--scale-width);
    background: var(--scale-bg);
    line-height: 1;
    transform-origin: var(--scale-origin);
    transform: rotate(calc(var(--scale-deg) * var(--gauge-tick) + var(--offset-deg)));
  }
  .speedMeter .outline ol li span {
    position: relative;
    top: -0.5em;
    left: 30px;
    display: inline-block;
    font-weight: bold;
    color: var(--gauge-color);
    transform: rotate(calc(-1 * (var(--scale-deg) * var(--gauge-tick) + var(--offset-deg))));
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
    left: calc(var(--gauge-width) / 2 - 10px);
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
    color: var(--gauge-color);
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
        {#each Array(gaugeScales + 1) as _,i }        
        <li style="
          {i % gaugeInterval?'--scale-width:3%;':'--scale-width:5%;'}
          {i >= redzone?'--scale-bg:#ff3333;':`--scale-bg:${gaugeColor};`}
          --gauge-tick:{i};">
          {#if i % gaugeInterval === 0}<span>{i * scaleCoefficient}</span>{/if}
        </li>
        {/each}
      </ol>
      <aside class="needle"></aside>
      <p class="value">
        {Math.floor(currentValue * GAUGE_COEFFICIENT)}
        <span>{gaugeUnits}</span>
      </p>
    </div><!--outline-->
  </div><!--speedMeter-->
</div><!--speedMeterWrapper-->