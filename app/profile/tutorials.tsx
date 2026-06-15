import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { VideoSource } from 'expo-video';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import VideoPopupModal from '../../components/modals/VideoPopupModal';
import { createStyles } from '../../util/styles/profile/tutorials.styles';

const VIDEO_SOURCE: VideoSource = require('../../assets/videos/karaadi-trim.mp4');

const TUTORIALS: { id: string; titleKey: string; source: VideoSource }[] = [
  { id: '1', titleKey: 'tutorials.video1', source: VIDEO_SOURCE },
  { id: '2', titleKey: 'tutorials.video2', source: VIDEO_SOURCE },
  { id: '3', titleKey: 'tutorials.video3', source: VIDEO_SOURCE },
];

export default function TutorialsScreen() {
  const { t } = useAppTranslation();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const [activeSource, setActiveSource] = useState<VideoSource | null>(null);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={TUTORIALS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>{t('tutorials.title')}</Text>
            <Text style={styles.subtitle}>{t('tutorials.subtitle')}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => setActiveSource(item.source)}
            activeOpacity={0.85}
          >
            <View style={styles.iconBg}>
              <MaterialCommunityIcons name="play-circle" size={24} color={Colors.primary} />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{t(item.titleKey)}</Text>
              <Text style={styles.cardHint}>{t('tutorials.play')}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      />

      <VideoPopupModal
        visible={!!activeSource}
        onClose={() => setActiveSource(null)}
        source={activeSource ?? VIDEO_SOURCE}
      />
    </SafeAreaView>
  );
}
