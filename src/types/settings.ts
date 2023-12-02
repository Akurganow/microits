export interface SettingsState {
    showUnsorted: boolean;
    openAI: {
        apiKey: string;
        userId: string; // nanoid
    };
}

export type SettingsKey = keyof SettingsState
export type SettingsValue<T extends SettingsKey> = SettingsState[T]