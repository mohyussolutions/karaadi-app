import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LoadingSpinner } from "../../components/loading";
import BottomTabBar from "../../components/layout/BottomTabBar";
import { useThemeColors, useThemedStyles } from "../../hooks/useTheme";
import { SOCIAL_LINK_BUILDERS, placeholderAvatar } from "../../constants";
import { BUSINESS_TYPE_ICON, BUSINESS_TYPE_LABEL } from "../../util/types";
import { useBusinessDetail } from "../../hooks/useBusinessDetail";
import { SOCIAL_ICONS, type SocialIcons } from "../../util/icons/icons";
import { createStyles } from "../../util/styles/business/businessDetail.styles";
import { createTabletPortraitStyles } from "../../util/styles/listing/tabletSplit.styles";
import { useResponsive } from "../../hooks/useResponsive";

export default function BusinessDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { business, loading } = useBusinessDetail(id);
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const tabletPortrait = useThemedStyles(createTabletPortraitStyles);
  const { isTablet } = useResponsive();

  function openLink(type: string, value: string) {
    const map: Record<string, string> = {
      phone: `tel:${value}`,
      whatsapp: SOCIAL_LINK_BUILDERS.whatsapp(value),
      facebook: SOCIAL_LINK_BUILDERS.facebook(value),
      instagram: SOCIAL_LINK_BUILDERS.instagram(value),
      website: SOCIAL_LINK_BUILDERS.website(value),
      email: `mailto:${value}`,
    };
    const url = map[type] || value;
    Linking.openURL(url).catch(() => {});
  }

  if (loading) return <LoadingSpinner fullScreen />;
  if (!business) {
    return (
      <View style={s.errorWrap}>
        <MaterialCommunityIcons
          name="office-building-outline"
          size={52}
          color={Colors.textMuted}
        />
        <Text style={s.errorTitle}>Business not found</Text>
        <TouchableOpacity style={s.errorBack} onPress={() => router.back()}>
          <Text style={s.errorBackText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const socialFields: (keyof SocialIcons)[] = [
    "phone",
    "whatsapp",
    "facebook",
    "instagram",
    "tiktok",
    "website",
    "email",
  ];
  const socialLinks = socialFields.filter((f) => business[f]);

  return (
    <View style={s.safe}>
      <SafeAreaView style={s.flexFull} edges={[]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={isTablet ? tabletPortrait.scrollContent : undefined}
      >
      <View style={isTablet ? tabletPortrait.inner : undefined}>
        <View style={s.hero}>
          <Image
            source={{
              uri:
                business.images?.[0] ||
                placeholderAvatar(120, "2563eb", "B"),
            }}
            style={s.logo}
          />
          <View style={s.nameRow}>
            <Text style={s.name}>{business.name}</Text>
            {business.isVerified && (
              <MaterialCommunityIcons
                name="check-decagram"
                size={18}
                color={Colors.primary}
              />
            )}
          </View>
          <View style={s.typeBadge}>
            <MaterialCommunityIcons
              name={
                (BUSINESS_TYPE_ICON[business.categories?.[0]] ||
                  "office-building-outline") as any
              }
              size={13}
              color={Colors.primary}
            />
            <Text style={s.typeText}>
              {BUSINESS_TYPE_LABEL[business.categories?.[0]] || "Business"}
            </Text>
          </View>
          {business.address && (
            <View style={s.locRow}>
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={14}
                color={Colors.textMuted}
              />
              <Text style={s.locText}>{business.address}</Text>
            </View>
          )}
        </View>

        {business.categories?.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Categories</Text>
            <View style={s.categoryGrid}>
              {business.categories.map((cat: string) => (
                <View key={cat} style={s.categoryItem}>
                  <MaterialCommunityIcons
                    name={(BUSINESS_TYPE_ICON[cat] || "office-building-outline") as any}
                    size={16}
                    color={Colors.primary}
                  />
                  <Text style={s.categoryLabel} numberOfLines={1}>
                    {BUSINESS_TYPE_LABEL[cat] || cat}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {business.images?.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Photos</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.photoRow}
            >
              {business.images.map((uri: string, i: number) => (
                <Image key={i} source={{ uri }} style={s.photo} />
              ))}
            </ScrollView>
          </View>
        )}

        {business.description ? (
          <View style={s.section}>
            <Text style={s.sectionTitle}>About</Text>
            <Text style={s.desc}>{business.description}</Text>
          </View>
        ) : null}

        {socialLinks.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Contact</Text>
            <View style={s.socialGrid}>
              {socialLinks.map((field) => (
                <TouchableOpacity
                  key={field}
                  style={s.socialBtn}
                  onPress={() => openLink(field, business[field])}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons
                    name={SOCIAL_ICONS[field] as any}
                    size={20}
                    color={Colors.primary}
                  />
                  <Text style={s.socialLabel}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={s.bottomSpacer} />
      </View>
      </ScrollView>
      </SafeAreaView>
      <BottomTabBar />
    </View>
  );
}

