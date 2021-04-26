<script lang="ts">
	import type { MeterProps, PickType } from './@types'
	import SpeedMeter from './components/SpeedMeter.svelte'

	const meterProps: MeterProps = {
		height: 300,
		width: 300,
		start: -30,
		end: 210,
		scales: 27,
		unitsLabel: 'km/h',
		guageInterval: 3,
		currentValue: 0,
	}

	/** value changes */
	export let meterValue:PickType<MeterProps, 'currentValue'> = 0

	$: {
		meterProps['currentValue'] = meterValue
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
	<SpeedMeter {...meterProps} />

	<section>
		<label for="01">現在値(0-100固定)</label>
		<input id="01" type="range" min="0" max="100" bind:value={meterValue}>
	</section>
</main>