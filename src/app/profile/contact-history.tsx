import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTranslation } from '../../components/hooks/useAppTranslation';
import { useThemeColors, useThemedStyles } from '../../components/hooks/useTheme';
import { useAuthStore } from '../../store/hooks/authStore';
import { getTicketHistory, getTicketDetails, addTicketMessage } from '../../actions/core/support.actions';
import { EmptyState } from '../../components/shared';
import { LoadingSpinner } from '../../components/loading';
import { createStyles } from '../../util/styles/profile/contactHistory.styles';
import type { Ticket } from '../../util/types';

const STATUS_COLOR_KEY: Record<string, 'success' | 'primary' | 'error' | 'textMuted'> = {
  DONE: 'success',
  RESOLVED: 'success',
  IN_PROGRESS: 'primary',
  NEW: 'error',
};

export default function ContactHistoryScreen() {
  const { t } = useAppTranslation();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const { user } = useAuthStore();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const fetchHistory = useCallback(async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const data = await getTicketHistory(user.email);
      setTickets(data);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  async function toggleExpand(ticketId: number) {
    if (expandedId === ticketId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(ticketId);
    const full = await getTicketDetails(ticketId);
    if (full) {
      setTickets((prev) => prev.map((ticket) => (ticket.id === ticketId ? full : ticket)));
    }
  }

  async function handleSendMessage(ticketId: number) {
    if (!replyText.trim() || sending || !user?.email) return;
    const body = replyText.trim();
    setReplyText('');
    setSending(true);
    try {
      const ok = await addTicketMessage(ticketId, {
        body,
        senderName: user.username || 'User',
        senderEmail: user.email,
        senderRole: 'USER',
      });
      if (ok) {
        const updated = await getTicketDetails(ticketId);
        if (updated) {
          setTickets((prev) => prev.map((ticket) => (ticket.id === ticketId ? updated : ticket)));
        }
      } else {
        setReplyText(body);
      }
    } finally {
      setSending(false);
    }
  }

  function statusLabel(status: string) {
    if (status === 'DONE' || status === 'RESOLVED') return t('ticketHistory.status.done');
    if (status === 'IN_PROGRESS') return t('ticketHistory.status.inProgress');
    return status;
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.center}>
          <EmptyState icon="lock-outline" title={t('ticketHistory.loginRequired')} />
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={{ textAlign: 'center', color: Colors.primary, fontWeight: '700', marginTop: 12 }}>
              {t('auth.login.loginButton')}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {loading && tickets.length === 0 ? (
        <View style={styles.center}>
          <LoadingSpinner />
        </View>
      ) : tickets.length === 0 ? (
        <View style={styles.center}>
          <EmptyState icon="history" title={t('mine.noData')} message={t('ticketHistory.noTickets')} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {tickets.map((ticket) => {
            const isDone = ticket.status === 'DONE' || ticket.status === 'RESOLVED';
            const isExpanded = expandedId === ticket.id;
            const colorKey = STATUS_COLOR_KEY[ticket.status] || 'textMuted';
            return (
              <View key={ticket.id} style={[styles.card, isDone ? styles.cardDone : null]}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => toggleExpand(ticket.id)} style={styles.cardHeader}>
                  <View style={styles.cardHeaderTop}>
                    <View style={styles.cardTitleRow}>
                      <Text style={[styles.cardTitle, isDone ? styles.cardTitleDone : null]} numberOfLines={1}>
                        {ticket.subject}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: Colors[colorKey] }]}>
                      <Text style={styles.statusBadgeText}>{statusLabel(ticket.status)}</Text>
                    </View>
                  </View>
                  <Text style={styles.cardBodyPreview} numberOfLines={1}>{ticket.body}</Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.cardFooterId}>{t('ticketHistory.id')} #{ticket.id}</Text>
                    <View style={styles.cardFooterToggle}>
                      <MaterialCommunityIcons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={16}
                        color={Colors.primary}
                      />
                      <Text style={styles.cardFooterToggleText}>
                        {isExpanded ? t('ticketHistory.close') : t('ticketHistory.open')}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {isExpanded ? (
                  <View style={styles.expanded}>
                    {(ticket.messages || []).map((msg, index) => {
                      const isUser = msg.senderRole === 'USER';
                      return (
                        <View
                          key={msg.id ?? index}
                          style={[styles.messageBubbleRow, isUser ? styles.messageBubbleRowUser : styles.messageBubbleRowSupport]}
                        >
                          <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleSupport]}>
                            <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextSupport]}>
                              {msg.body}
                            </Text>
                          </View>
                          <Text style={styles.bubbleMeta}>
                            {isUser
                              ? index === 0
                                ? t('ticketHistory.yourOriginalRequest')
                                : t('ticketHistory.you')
                              : `${t('ticketHistory.supportTeam')} · ${msg.senderName}`}
                          </Text>
                        </View>
                      );
                    })}

                    {isDone ? (
                      <View style={styles.resolvedBanner}>
                        <Text style={styles.resolvedBannerText}>{t('ticketHistory.caseResolved')}</Text>
                      </View>
                    ) : null}

                    <View style={styles.replyRow}>
                      <TextInput
                        style={styles.replyInput}
                        placeholder={t('ticketHistory.typeMessage')}
                        placeholderTextColor={Colors.textMuted}
                        value={expandedId === ticket.id ? replyText : ''}
                        onChangeText={setReplyText}
                        onSubmitEditing={() => handleSendMessage(ticket.id)}
                      />
                      <TouchableOpacity
                        style={[styles.replySendButton, sending || !replyText.trim() ? styles.replySendButtonDisabled : null]}
                        activeOpacity={0.85}
                        disabled={sending || !replyText.trim()}
                        onPress={() => handleSendMessage(ticket.id)}
                      >
                        {sending ? (
                          <ActivityIndicator size="small" color={Colors.white} />
                        ) : (
                          <MaterialCommunityIcons name="send" size={16} color={Colors.white} />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
