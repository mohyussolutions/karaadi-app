import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import { useSecuritySettings } from '../../../hooks/useSecuritySettings';
import { createStyles } from '../../../util/styles/settings/security.styles';

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function deviceIcon(device?: string | null): string {
  if (!device) return 'monitor-outline';
  if (/iPhone|Android/i.test(device)) return 'cellphone';
  if (/iPad/i.test(device)) return 'tablet';
  return 'monitor-outline';
}

export default function SecuritySettings() {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    user, clearAuth, sessions, history, loading, loggingOut,
    removeSession, confirmLogoutAll, deleteHistoryEntry, clearAllHistory,
  } = useSecuritySettings();

  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  if (!user) return null;

  if (loading) {
    return (
      <SafeAreaView style={s.safe} edges={['bottom']}>
        <ActivityIndicator style={s.loadingIndicator} color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 84 }]} showsVerticalScrollIndicator={false}>

        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>{t('mine.security.activeSessions')}</Text>
          <View style={s.headerBtns}>
            <TouchableOpacity
              style={s.outlineBtn}
              onPress={async () => { await clearAuth(); router.replace('/(auth)/login'); }}
            >
              <Text style={s.outlineBtnText}>{t('mine.security.signOut')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.dangerBtn, (loggingOut || sessions.length === 0) && s.btnDisabled]}
              onPress={confirmLogoutAll}
              disabled={loggingOut || sessions.length === 0}
            >
              <Text style={s.dangerBtnText}>{loggingOut ? t('mine.security.signingOut') : t('mine.security.signOutAll')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={s.card}>
          {sessions.length === 0 ? (
            <Text style={s.emptyText}>{t('mine.security.noActiveSessions')}</Text>
          ) : (
            sessions.map((session, i) => (
              <View key={session.id} style={[s.row, i < sessions.length - 1 && s.rowDivider]}>
                <View style={s.iconWrap}>
                  <MaterialCommunityIcons name={deviceIcon(session.device) as any} size={20} color={Colors.primary} />
                </View>
                <View style={s.flexFull}>
                  <Text style={s.rowTitle} numberOfLines={1}>
                    {session.device || t('mine.security.unknownDevice')}
                    {session.browser ? ` · ${session.browser}` : ''}
                  </Text>
                  {session.active
                    ? <Text style={s.activeTag}>{t('mine.security.activeNow')}</Text>
                    : session.lastActive
                    ? <Text style={s.rowMeta}>{fmtDate(session.lastActive)}</Text>
                    : null}
                </View>
                <TouchableOpacity onPress={() => removeSession(session.id)} hitSlop={8}>
                  <Text style={s.removeText}>{t('mine.security.remove')}</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <View style={[s.sectionRow, s.sectionRowSpaced]}>
          <View>
            <Text style={s.sectionTitle}>{t('mine.security.recentActivity')}</Text>
            <Text style={s.sectionSub}>{t('mine.security.last20Logins')}</Text>
          </View>
          {history.length > 0 && (
            <TouchableOpacity style={s.dangerBtn} onPress={clearAllHistory}>
              <Text style={s.dangerBtnText}>{t('mine.security.clearAll')}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={s.card}>
          {history.length === 0 ? (
            <Text style={s.emptyText}>
              {t('mine.security.noHistory')}
            </Text>
          ) : (
            history.map((entry, i) => (
              <View key={entry.id} style={[s.row, i < history.length - 1 && s.rowDivider]}>
                <View style={s.iconWrap}>
                  <MaterialCommunityIcons name={deviceIcon(entry.device) as any} size={20} color={Colors.gray400} />
                </View>
                <View style={s.flexFull}>
                  <Text style={s.rowTitle} numberOfLines={1}>
                    {entry.device || t('mine.security.unknown')}
                    {entry.browser ? ` · ${entry.browser}` : ''}
                  </Text>
                  <View style={s.metaRow}>
                    {entry.ipAddress && (
                      <Text style={s.rowMeta}>
                        <MaterialCommunityIcons name="web" size={10} color={Colors.textMuted} /> {entry.ipAddress}
                      </Text>
                    )}
                    <Text style={s.rowMeta}>{fmtDate(entry.loggedAt)}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => deleteHistoryEntry(entry.id)} hitSlop={8}>
                  <MaterialCommunityIcons name="trash-can-outline" size={18} color={Colors.gray400} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <View style={s.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}
