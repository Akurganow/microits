'use server'
import { createClient } from '@vercel/edge-config'
import * as process from 'process'

export type FFPhase = 'development' | 'canary' | 'production'

export type FeatureFlags = Record<string, FFPhase | undefined>

export type FeatureFlagsPhases = {
	development: string[]
	canary: string[]
}

export async function getFeatureFlagsPhaseUsers() {
	console.log('process.env.EDGE_CONFIG', process.env.EDGE_CONFIG)
	const config = createClient(process.env.EDGE_CONFIG!)
	console.log('config', config)

	return await config.get<FeatureFlagsPhases>('featureFlagsUsers')
}

export async function getFeatureFlag(name: string) {
	const config = createClient(process.env.FEATURE_FLAGS!)

	return await config.get<FeatureFlags>(name)
}

export async function getAllFeatureFlags() {
	const config = createClient(process.env.FEATURE_FLAGS!)

	return await config.getAll<FeatureFlags>()
}

