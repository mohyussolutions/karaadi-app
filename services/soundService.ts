import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import { store } from '../store';

let player: AudioPlayer | null = null;

function getPlayer(): AudioPlayer {
  if (!player) {
    player = createAudioPlayer(require('../assets/sounds/notification.wav'));
  }
  return player;
}

export function isSoundEnabled(): boolean {
  return store.getState().notificationSettings.soundEnabled;
}

export function playNotificationSound(): void {
  if (!isSoundEnabled()) return;
  try {
    const p = getPlayer();
    p.seekTo(0);
    p.play();
  } catch {}
}
