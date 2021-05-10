<script lang="ts">
  import type { MeterProps, PickType } from './index'
  import SpeedMeter from './components/SpeedMeter.svelte'

  const meterProps_01:MeterProps = {
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

  const meterProps_02:MeterProps = {
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
    gaugeBackgroundColor: '#f1f1f1'
  }

  /** Formatting Options */
  const reducer = (
    accumulator:{ name:string, value:string }[], 
    currentValue:string[], 
    index:number) => { 
    accumulator[index] = { name: currentValue[0], value: currentValue[1] };
    return accumulator;
  } 

  const meterOptions_01 = Object.entries(meterProps_01).reduce(reducer ,[]);
  const meterOptions_02 = Object.entries(meterProps_02).reduce(reducer ,[]);

  /** value changes */
  export let meterValue_01:PickType<MeterProps, 'currentValue'> = 0
  export let meterValue_02:PickType<MeterProps, 'currentValue'> = 0

  $: {
    meterProps_01['currentValue'] = meterValue_01
    meterProps_02['currentValue'] = meterValue_02
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
  section {
    display: flex;
    margin: 40px 0;
  }
  table th {
    padding: 0 8px;
    font-weight: normal;
    text-align: right;
  }
  table td {
    padding: 0 8px;
  }
</style>

<main>
  <section>
    <div>
      <SpeedMeter {...meterProps_01} />
      <label for="01">現在値(0-100固定)</label>
      <input id="01" type="range" min="0" max="100" bind:value={meterValue_01} />
    </div>
    <table>
      {#each meterOptions_01 as option}
      <tr>
        <th>{option.name}</th>
        <td>{option.value}</td>
      </tr>
      {/each}
    </table>
  </section>
  <section>
    <div>
      <SpeedMeter {...meterProps_02} />
      <label for="02">現在値(0-100固定)</label>
      <input id="02" type="range" min="0" max="100" bind:value={meterValue_02} />
    </div>
    <table>
      {#each meterOptions_02 as option}
      <tr>
        <th>{option.name}</th>
        <td>{option.value}</td>
      </tr>
      {/each}
    </table>
  </section>
</main>