import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking } from 'react-native';
import { useThemeColors } from '../../hooks/useTheme';

interface EulaModalProps {
  visible: boolean;
  onAccept: () => void;
}

export function EulaModal({ visible, onAccept }: EulaModalProps) {
  const Colors = useThemeColors();

  return (
    <Modal visible={visible} transparent={false} animationType="slide">
      <View style={[styles.root, { backgroundColor: Colors.background }]}>
        <View style={[styles.header, { borderBottomColor: Colors.border }]}>
          <Text style={[styles.title, { color: Colors.text }]}>Terms of Service & Privacy Policy</Text>
          <Text style={[styles.subtitle, { color: Colors.textSecondary }]}>
            You must read and agree before using Karaadi.
          </Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={[styles.heading, { color: Colors.text }]}>Welcome to Karaadi</Text>
          <Text style={[styles.body, { color: Colors.textSecondary }]}>
            By tapping "I Agree — Continue" you confirm that you have read, understood, and agreed to these Terms of Service and Privacy Policy.
          </Text>

          <Text style={[styles.sectionTitle, { color: Colors.text }]}>1. Zero Tolerance for Objectionable Content</Text>
          <Text style={[styles.body, { color: Colors.textSecondary }]}>
            Karaadi has a strict zero-tolerance policy for objectionable, offensive, unlawful, harmful, or abusive content and behaviour. This includes — but is not limited to — hate speech, harassment, explicit material, fraud, spam, and illegal listings. Any such content will be removed immediately and the responsible account will be permanently banned without warning.
          </Text>

          <Text style={[styles.sectionTitle, { color: Colors.text }]}>2. Zero Tolerance for Abusive Users</Text>
          <Text style={[styles.body, { color: Colors.textSecondary }]}>
            Abusive, threatening, or harassing behaviour toward other users is strictly prohibited. Users found to engage in abusive behaviour will be permanently removed from the platform. We reserve the right to report such behaviour to the relevant authorities.
          </Text>

          <Text style={[styles.sectionTitle, { color: Colors.text }]}>3. How to Report Objectionable Content</Text>
          <Text style={[styles.body, { color: Colors.textSecondary }]}>
            Every listing has a "Report this item" button at the bottom of the listing page. Tap it, choose a reason, and submit your report. Our team reviews all reports within 24 hours. Confirmed violations result in immediate content removal and account action.
          </Text>

          <Text style={[styles.sectionTitle, { color: Colors.text }]}>4. How to Block an Abusive User</Text>
          <Text style={[styles.body, { color: Colors.textSecondary }]}>
            Inside any chat conversation, tap the block icon (⊘) in the top-right corner. This immediately stops all messages from that user and removes them from your contacts. You can also report the user at the same time. Blocked users cannot contact you in any way.
          </Text>

          <Text style={[styles.sectionTitle, { color: Colors.text }]}>5. User-Generated Content</Text>
          <Text style={[styles.body, { color: Colors.textSecondary }]}>
            All listings and messages are user-generated. You are solely responsible for content you post. Karaadi reserves the right to remove any content and suspend or permanently ban users who violate these terms.
          </Text>

          <Text style={[styles.sectionTitle, { color: Colors.text }]}>6. Privacy</Text>
          <Text style={[styles.body, { color: Colors.textSecondary }]}>
            Your personal data is used only to provide and improve the Karaadi service. We do not sell your data to third parties. You can delete your account and all associated data at any time from Profile → Edit Profile.
          </Text>

          <TouchableOpacity onPress={() => Linking.openURL('https://karaadi.com/terms')} style={styles.linkRow}>
            <Text style={[styles.link, { color: Colors.primary }]}>Read full Terms of Service →</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://karaadi.com/privacy')} style={styles.linkRow}>
            <Text style={[styles.link, { color: Colors.primary }]}>Read full Privacy Policy →</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: Colors.border, backgroundColor: Colors.background }]}>
          <TouchableOpacity
            style={[styles.acceptBtn, { backgroundColor: Colors.primary }]}
            onPress={onAccept}
            activeOpacity={0.85}
          >
            <Text style={[styles.acceptText, { color: Colors.white }]}>
              I Agree — Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root:          { flex: 1 },
  header:        { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16, borderBottomWidth: 1 },
  title:         { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  subtitle:      { fontSize: 13, lineHeight: 18 },
  scroll:        { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  heading:       { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  sectionTitle:  { fontSize: 15, fontWeight: '700', marginTop: 24, marginBottom: 6 },
  body:          { fontSize: 14, lineHeight: 22 },
  linkRow:       { marginTop: 16 },
  link:          { fontSize: 14, fontWeight: '600' },
  footer:        { padding: 20, borderTopWidth: 1 },
  acceptBtn:     { borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  acceptText:    { fontSize: 16, fontWeight: '700' },
});
