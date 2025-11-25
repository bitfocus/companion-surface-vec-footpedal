import type { SurfaceSchemaLayoutDefinition } from '@companion-surface/base'

export function createSurfaceSchema(): SurfaceSchemaLayoutDefinition {
	const surfaceLayout: SurfaceSchemaLayoutDefinition = {
		stylePresets: {
			default: {
				// No feedback for anything
			},
		},
		controls: {},
	}

	for (let x = 0; x < 3; x++) {
		surfaceLayout.controls[x + ''] = {
			row: 0,
			column: x,
		}
	}

	return surfaceLayout
}
