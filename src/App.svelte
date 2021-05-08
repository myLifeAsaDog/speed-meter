<script lang="ts">
  import type { MeterProps, PickType } from './index'
  import SpeedMeter from './components/SpeedMeter.svelte'

  const meterProps:MeterProps = {
    gaugeHeight: 300,
    gaugeWidth: 300,
    gaugeStart: -30,
    gaugeEnd: 210,
    gaugeScales: 27,
    gaugeUnits: 'km/h',
    gaugeInterval: 3,
    currentValue: 0,
    scaleCoefficient: 10,
    gaugeLimit: 270,
    redzone: 21,
    gaugeOutlineColor: '#444444',
    gaugeColor: '#ffffff',
    gaugeBackgroundColor: 'linear-gradient(180deg, #444444 0%, #000000 100%)'
  }

  const meterProps02:MeterProps = {
    gaugeHeight: 300,
    gaugeWidth: 300,
    gaugeStart: 30,
    gaugeEnd: 210,
    gaugeScales: 90,
    gaugeUnits: 'x1000 rpm',
    gaugeInterval: 10,
    currentValue: 0,
    scaleCoefficient: 0.1,
    gaugeLimit: 9000,
    redzone: 60,
    gaugeOutlineColor: '#cccccc',
    gaugeColor: '#555555',
    gaugeBackgroundColor: 'linear-gradient(180deg, #eeeeee 0%, #f1f1f1 100%)'
  }

  /** value changes */
  export let meterValue:PickType<MeterProps, 'currentValue'> = 0
  export let meterValue02:PickType<MeterProps, 'currentValue'> = 0

  $: {
    meterProps['currentValue'] = meterValue
    meterProps02['currentValue'] = meterValue02
  }
</script>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    border: none;
    font-family: sans-serif;
    font-size: 16px;
    background: #aaaaaa;
    padding: 40px;
  }
</style>

<main>
  <section>
    <SpeedMeter {...meterProps} />
    <label for="01">現在値(0-100固定)</label>
    <input id="01" type="range" min="0" max="100" bind:value={meterValue} />
  </section>
  <section>
    <SpeedMeter {...meterProps02} />
    <label for="02">現在値(0-100固定)</label>
    <input id="02" type="range" min="0" max="100" bind:value={meterValue02} />
  </section>
</main>