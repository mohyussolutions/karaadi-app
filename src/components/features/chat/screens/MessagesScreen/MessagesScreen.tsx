import { useCallback, useEffect } from 'react';
import {
  View, Text, FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '../../../../shared';
import { LoadingSpinner } from '../../../../loading';
import { useThemedStyles } from '../../../../../hooks/useTheme';
import { useResponsive } from '../../../../../hooks/useResponsive';
import { useChatsData } from '../../../../../hooks/useChatsData';
import { useGroupedChats } from '../../../../../hooks/useGroupedChats';
import { useAppSelector } from '../../../../../store/store';
import { createStyles } from '../../../../../util/styles/tabs/messagesTab.styles';
import type { GroupedChat } from '../../../../../util/types';
import { ConvoItem } from './ConvoItem';
import { ROUTES } from '../../../../../constants';

export default function MessagesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, chats, loaded } = useChatsData();
  const authLoading = useAppSelector((s) => s.auth.loading);
  const { isTablet } = useResponsive();
  const styles = useThemedStyles(createStyles);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/(auth)/login');
    }
  }, [authLoading, user]);

  const groupedChats = useGroupedChats(chats, user);

  const handleItemPress = useCallback((item: GroupedChat) => {
    const other = item.senderId === user?.id ? item.receiver : item.sender;
    router.push({
      pathname: ROUTES.chat,
      params: {
        chatId: item.allIds.join(','),
        userId: other?.id,
        username: other?.username || t('messages.unknownSender'),
      },
    });
  }, [router, user, t]);

  const renderItem = useCallback(({ item }: { item: GroupedChat }) => (
    <ConvoItem item={item} currentUserId={user!.id} onPress={handleItemPress} />
  ), [user, handleItemPress]);

  if (!user) return <LoadingSpinner fullScreen />;

  if (!loaded) {
    return (
      <SafeAreaView style={styles.safe} edges={[]}>
        <View style={[styles.header, isTablet && styles.tabletHeader]}>
          <Text style={styles.title}>{t('messages.title')}</Text>
        </View>
        <View style={styles.center}>
          <LoadingSpinner />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <View style={[styles.header, isTablet && styles.tabletHeader]}><Text style={styles.title}>{t('messages.title')}</Text></View>
      <FlatList overScrollMode="never"
        style={isTablet && styles.tabletList}
        data={groupedChats}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        initialNumToRender={15}
        maxToRenderPerBatch={15}
        windowSize={10}
        contentContainerStyle={groupedChats.length === 0 ? styles.listFlex : styles.listPadded}
        ListEmptyComponent={
          <EmptyState icon="message-off-outline" title={t('messages.noConversationsTitle')} message={t('messages.noConversationsMessage')} />
        }
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}
