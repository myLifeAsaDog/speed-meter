<script lang="ts">
	import type { MeterProps, PickType } from './@types'
	import SpeedMeter from './components/SpeedMeter.svelte'

	const meterProps:MeterProps = {
		guageHeight: 300,
		guageWidth: 300,
		guageStart: -30,
		guageEnd: 210,
		guageScales: 27,
		guageUnits: 'km/h',
		guageInterval: 3,
		currentValue: 0,
		scaleCoefficient: 10,
		guageLimit: 270,
		redzone: 21
	}

	const meterProps02:MeterProps = {
		guageHeight: 340,
		guageWidth: 340,
		guageStart: 30,
		guageEnd: 210,
		guageScales: 90,
		guageUnits: 'x1000 rpm',
		guageInterval: 10,
		currentValue: 0,
		scaleCoefficient: 0.1,
		guageLimit: 9000,
		redzone: 60
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