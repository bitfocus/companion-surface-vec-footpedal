import {
	createModuleLogger,
	type DiscoveredSurfaceInfo,
	type HIDDevice,
	type OpenSurfaceResult,
	type SurfaceContext,
	type SurfacePlugin,
} from '@companion-surface/base'
import { VecFootpedalWrapper } from './instance.js'
import { createSurfaceSchema } from './surface-schema.js'
import HID from 'node-hid'

const logger = createModuleLogger('Plugin')

const VecFootpedalPlugin: SurfacePlugin<HIDDevice> = {
	init: async (): Promise<void> => {
		// Not used
	},
	destroy: async (): Promise<void> => {
		// Not used
	},

	checkSupportsHidDevice: (device: HIDDevice): DiscoveredSurfaceInfo<HIDDevice> | null => {
		if (device.vendorId !== 0x05f3 || device.productId !== 0x00ff) return null

		logger.debug(`Checked HID device: ${device.manufacturer} ${device.product}`)

		return {
			surfaceId: `vecfootpedal:${device.serialNumber}`, // Use the faked serial number
			description: `${device.manufacturer} ${device.product || 'VEC Footpedal'}`.trim(),
			pluginInfo: device,
		}
	},

	openSurface: async (
		surfaceId: string,
		pluginInfo: HIDDevice,
		context: SurfaceContext,
	): Promise<OpenSurfaceResult> => {
		const device = await HID.HIDAsync.open(pluginInfo.path)
		logger.debug(`Opening ${pluginInfo.manufacturer} ${pluginInfo.product} (${surfaceId})`)

		return {
			surface: new VecFootpedalWrapper(surfaceId, device, context),
			registerProps: {
				brightness: false,
				surfaceLayout: createSurfaceSchema(),
				pincodeMap: null,
				configFields: null,
				location: null,
			},
		}
	},
}
export default VecFootpedalPlugin
