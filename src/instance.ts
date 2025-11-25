import {
	CardGenerator,
	HostCapabilities,
	SurfaceDrawProps,
	SurfaceContext,
	SurfaceInstance,
	createModuleLogger,
	ModuleLogger,
} from '@companion-surface/base'
import type { HIDAsync } from 'node-hid'

export class VecFootpedalWrapper implements SurfaceInstance {
	readonly #logger: ModuleLogger

	readonly #device: HIDAsync

	readonly #surfaceId: string
	readonly #context: SurfaceContext

	public get surfaceId(): string {
		return this.#surfaceId
	}
	public get productName(): string {
		return 'VEC Footpedal'
	}

	public constructor(surfaceId: string, device: HIDAsync, context: SurfaceContext) {
		this.#logger = createModuleLogger(`Instance/${surfaceId}`)
		this.#device = device
		this.#surfaceId = surfaceId
		this.#context = context

		this.#device.on('error', (error) => {
			this.#logger.error(error)
			this.#context.disconnect(error)
		})

		const buttonState: boolean[] = new Array(3).fill(false)
		const buttonMasks = [0x0001, 0x0002, 0x0004]

		this.#device.on('data', (data: Buffer) => {
			if (data.length !== 2) return

			const buttonsRaw = data.readUint16LE()

			// Treat buttons a little differently. Need to do button up and button down events
			buttonMasks.forEach((mask, index) => {
				const button = buttonsRaw & mask
				if (button && !buttonState[index]) {
					this.#context.keyDownById(index + '')
				} else if (!button && buttonState[index]) {
					this.#context.keyUpById(index + '')
				}
				buttonState[index] = button > 0
			})
		})
	}

	async init(): Promise<void> {
		// Nothing to do
	}
	async close(): Promise<void> {
		this.#device.close().catch(() => null)
	}

	updateCapabilities(_capabilities: HostCapabilities): void {
		// Not used
	}

	async ready(): Promise<void> {
		// Nothing to do
	}

	async setBrightness(_percent: number): Promise<void> {
		// Not used
	}
	async blank(): Promise<void> {
		// Not used
	}
	async draw(_signal: AbortSignal, _drawProps: SurfaceDrawProps): Promise<void> {
		// Not used
	}
	async showStatus(_signal: AbortSignal, _cardGenerator: CardGenerator): Promise<void> {
		// Not used
	}
}
