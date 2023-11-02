export interface SettingsState {
    showUnsorted: boolean;
}

export type SettingsKey = keyof SettingsState
export type SettingsValue<T extends SettingsKey> = SettingsState[T]