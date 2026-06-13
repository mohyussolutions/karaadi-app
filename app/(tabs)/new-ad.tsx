import React, { useEffect, useCallback } from "react";
import { View, Text, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { useThemedStyles } from "../../hooks/useTheme";
import { createStyles } from "../../utils/styles/tabs/newAd.styles";
import { LoadingSpinner } from "../../components/loading";
import { getImageUrl } from "../../utils/helpers";
import { useAuthStore } from "../../store/authStore";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  setStep,
  setListingType,
  setCategoryKey,
  setSelectedPlan,
  resetNewAd,
  fetchPlans,
} from "../../store/slices/newAdSlice";
import { CheckoutBar } from "../../components/checklist";
import { StepType } from "../../features/new-ad/components/StepType";
import { StepCategory } from "../../features/new-ad/components/StepCategory";
import { StepForm } from "../../features/new-ad/components/forms";
import { StepPlan } from "../../features/new-ad/components/StepPlan";
import { StepSummary, StepPayment } from "../../components/payment";

import type { ListingType, Step, StepItem } from "../../utils/types/new-ad.types";
import { MAIN_CATEGORIES } from "../../navigation/main";
import { placeholderAvatar } from "../../constants";

const STEP_INDEX: Record<Step, number> = {
  login: 0,
  type: 0,
  category: 1,
  form: 2,
  plan: 3,
  summary: 4,
  payment: 5,
};

const AVATAR = placeholderAvatar(80, '2563eb', 'Me');

export default function NewAdScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuthStore();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/(auth)/login");
    }
  }, [authLoading, user]);

  const step = useAppSelector((s) => s.newAd.step);
  const listingType = useAppSelector((s) => s.newAd.listingType);
  const categoryKey = useAppSelector((s) => s.newAd.categoryKey);
  const businessId = useAppSelector((s) => s.newAd.businessId);
  const plans = useAppSelector((s) => s.newAd.plans);
  const plansLoading = useAppSelector((s) => s.newAd.plansLoading);
  const selectedPlan = useAppSelector((s) => s.newAd.selectedPlan);
  const createdId = useAppSelector((s) => s.newAd.createdId);
  const createdTitle = useAppSelector((s) => s.newAd.createdTitle);

  useEffect(() => {
    if (step === "plan" && plans.length === 0) {
      dispatch(fetchPlans());
    }
  }, [step]);

  const submitStatus = useAppSelector((s) => s.newAd.submitStatus);
  useFocusEffect(
    useCallback(() => {
      return () => {
        if (submitStatus === "success") dispatch(resetNewAd());
      };
    }, [submitStatus]),
  );

  const categoryMeta = MAIN_CATEGORIES.find((c) => c.key === categoryKey);
  const AD_STEPS: StepItem[] = [
    { key: "type", label: t("postAd.steps.type") },
    { key: "category", label: t("postAd.steps.category") },
    { key: "form", label: t("postAd.steps.details") },
    { key: "plan", label: t("postAd.steps.plan") },
    { key: "summary", label: t("postAd.steps.summary") },
    { key: "payment", label: t("postAd.steps.payment") },
  ];
  const adSteps = businessId
    ? AD_STEPS.filter((st) => st.key !== "plan" && st.key !== "summary" && st.key !== "payment")
    : AD_STEPS;

  const s = useThemedStyles(createStyles);

  if (!user) return <LoadingSpinner fullScreen />;

  return (
    <View style={s.safe}>
      <View style={s.header}>
        <Image source={{ uri: getImageUrl(user.profileImage) || AVATAR }} style={s.avatar} />
        <Text style={s.headerTitle}>{t("nav.newAd")}</Text>
      </View>
      <CheckoutBar steps={adSteps} currentIndex={STEP_INDEX[step]} />

      {step === "type" && (
        <StepType
          onSelect={(type: ListingType) => {
            if (type === "public") {
              router.push("/profile/business-create");
              return;
            }
            dispatch(setListingType(type));
            dispatch(setStep("category"));
          }}
        />
      )}

      {step === "category" && (
        <StepCategory
          selected={categoryKey}
          onSelect={(key) => dispatch(setCategoryKey(key))}
          onNext={() => dispatch(setStep("form"))}
          onBack={() => dispatch(setStep("type"))}
        />
      )}

      {step === "form" && (
        <StepForm
          categoryKey={categoryKey}
          listingType={listingType}
          onSuccess={() => {
            if (businessId) {
              dispatch(resetNewAd());
              Alert.alert(
                t("postAd.businessPostedTitle"),
                t("postAd.businessPostedMessage"),
                [{ text: t("auth.common.ok"), onPress: () => router.replace("/profile/businesses") }],
              );
            } else {
              dispatch(setStep("plan"));
            }
          }}
          onBack={() => dispatch(setStep("category"))}
        />
      )}

      {step === "plan" && (
        <StepPlan
          plans={plans}
          loading={plansLoading}
          selected={selectedPlan}
          onSelect={(plan) => dispatch(setSelectedPlan(plan))}
          onNext={() => dispatch(setStep("summary"))}
          onBack={() => dispatch(setStep("form"))}
        />
      )}

      {step === "summary" && selectedPlan && (
        <StepSummary
          plan={selectedPlan}
          categoryName={categoryMeta?.name}
          onNext={() => dispatch(setStep("payment"))}
          onBack={() => dispatch(setStep("plan"))}
        />
      )}

      {step === "payment" && selectedPlan && (
        <StepPayment
          plan={selectedPlan}
          listingId={createdId}
          listingTitle={createdTitle}
          categoryKey={categoryKey}
          onBack={() => dispatch(setStep("summary"))}
        />
      )}
    </View>
  );
}
