<script lang="ts">
	import type { MeterProps } from './@types'
	import SpeedMeter from './components/SpeedMeter.svelte'

	const meterProps: MeterProps = {
		height: 300,
		width: 300,
		start: -30,
		end: 210,
		scales: 27
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
</main>