import { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking } from 'react-native';
import { useThemeColors } from '../../hooks/useTheme';

interface EulaModalProps {
  visible: boolean;
  onAccept: () => void;
}

export function EulaModal({ visible, onAccept }: EulaModalProps) {
  const Colors = useThemeColors();
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  return (
    <Modal visible={visible} transparent={false} animationType="slide">
      <View style={[styles.root, { backgroundColor: Colors.background }]}>
        <View style={[styles.header, { borderBottomColor: Colors.border }]}>
          <Text style={[styles.title, { color: Colors.text }]}>Terms of Service & Privacy Policy</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          onScroll={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
            if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 40) {
              setScrolledToBottom(true);
            }
          }}
          scrollEventThrottle={16}
        >
          <Text style={[styles.heading, { color: Colors.text }]}>Welcome to Karaadi</Text>
          <Text style={[styles.body, { color: Colors.textSecondary }]}>
            By using Karaadi, you agree to the following terms. Please read them carefully.
          </Text>

          <Text style={[styles.sectionTitle, { color: Colors.text }]}>1. User Conduct</Text>
          <Text style={[styles.body, { color: Colors.textSecondary }]}>
            You agree not to post objectionable, offensive, unlawful, or abusive content. Karaadi has zero tolerance for such content and will remove it immediately upon report.
          </Text>

          <Text style={[styles.sectionTitle, { color: Colors.text }]}>2. User-Generated Content</Text>
          <Text style={[styles.body, { color: Colors.textSecondary }]}>
            All listings and messages are user-generated. You are solely responsible for content you post. Karaadi reserves the right to remove any content and suspend or ban users who violate these terms.
          </Text>

          <Text style={[styles.sectionTitle, { color: Colors.text }]}>3. Reporting & Blocking</Text>
          <Text style={[styles.body, { color: Colors.textSecondary }]}>
            You can report any listing or block any user at any time. Reports are reviewed within 24 hours. Offending content will be removed and the user will be ejected from the platform.
          </Text>

          <Text style={[styles.sectionTitle, { color: Colors.text }]}>4. Privacy</Text>
          <Text style={[styles.body, { color: Colors.textSecondary }]}>
            Your personal data is used only to provide and improve the Karaadi service. We do not sell your data to third parties.
          </Text>

          <Text style={[styles.sectionTitle, { color: Colors.text }]}>5. Account</Text>
          <Text style={[styles.body, { color: Colors.textSecondary }]}>
            You may delete your account at any time from Profile → Edit Profile. All your data will be permanently removed.
          </Text>

          <TouchableOpacity onPress={() => Linking.openURL('https://karaadi.ee/terms')} style={styles.linkRow}>
            <Text style={[styles.link, { color: Colors.primary }]}>Read full Terms of Service →</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://karaadi.ee/privacy')} style={styles.linkRow}>
            <Text style={[styles.link, { color: Colors.primary }]}>Read full Privacy Policy →</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: Colors.border, backgroundColor: Colors.background }]}>
          {!scrolledToBottom && (
            <Text style={[styles.scrollHint, { color: Colors.textMuted }]}>Scroll down to read and accept</Text>
          )}
          <TouchableOpacity
            style={[styles.acceptBtn, { backgroundColor: scrolledToBottom ? Colors.primary : Colors.border }]}
            onPress={scrolledToBottom ? onAccept : undefined}
            activeOpacity={scrolledToBottom ? 0.85 : 1}
          >
            <Text style={[styles.acceptText, { color: scrolledToBottom ? Colors.white : Colors.textMuted }]}>
              I Agree — Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16, borderBottomWidth: 1 },
  title: { fontSize: 20, fontWeight: '700' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  heading: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginTop: 20, marginBottom: 6 },
  body: { fontSize: 14, lineHeight: 22 },
  linkRow: { marginTop: 16 },
  link: { fontSize: 14, fontWeight: '600' },
  footer: { padding: 20, borderTopWidth: 1 },
  scrollHint: { textAlign: 'center', fontSize: 12, marginBottom: 8 },
  acceptBtn: { borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  acceptText: { fontSize: 16, fontWeight: '700' },
});
