import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const getInitialTheme = () => {
    if (!browser) return 'wait';
    try {
        return localStorage.getItem('primary-theme') || 'zinc';
    } catch (e) {
        return 'zinc';
    }
};

export const primaryTheme = writable(getInitialTheme());
