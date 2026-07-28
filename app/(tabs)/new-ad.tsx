import { useEffect, useCallback } from "react";
import { View, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { useThemedStyles } from "../../hooks/useTheme";
import { createStyles } from "../../util/styles/tabs/newAd.styles";
import { LoadingSpinner } from "../../components/loading";
import { useAuthStore } from "../../store/authStore";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  setListingType,
  setCategoryKey,
  setSelectedPlan,
  resetNewAd,
  fetchPlans,
} from "../../store/slices/newAdSlice";
import { useNewAdStepNavigation } from "../../hooks/useNewAdStepNavigation";
import { CheckoutBar } from "../../features/subscription/components/checklist";
import { StepType } from "../../features/new-ad/components/StepType";
import { StepCategory } from "../../features/new-ad/components/StepCategory";
import { StepForm } from "../../features/new-ad/components/forms";
import { StepPlan } from "../../features/new-ad/components/StepPlan";
import { StepSummary, StepPayment } from "../../features/subscription/components/payment";

import type { ListingType, Step, StepItem } from "../../util/types/new-ad.types";
import { MAIN_CATEGORIES } from "../../config/navigation/categories";

const STEP_INDEX: Record<Step, number> = {
  login: 0,
  type: 0,
  category: 1,
  form: 2,
  plan: 3,
  summary: 4,
  payment: 5,
};

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

  const goToStep = useNewAdStepNavigation();

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
      <CheckoutBar steps={adSteps} currentIndex={STEP_INDEX[step]} />

      {step === "type" && (
        <StepType
          onSelect={(type: ListingType) => {
            if (type === "public") {
              router.push("/profile/business-create");
              return;
            }
            dispatch(setListingType(type));
            goToStep("category");
          }}
        />
      )}

      {step === "category" && (
        <StepCategory
          selected={categoryKey}
          onSelect={(key) => dispatch(setCategoryKey(key))}
          onNext={() => goToStep("form")}
          onBack={() => goToStep("type")}
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
              goToStep("plan");
            }
          }}
          onBack={() => goToStep("category")}
        />
      )}

      {step === "plan" && (
        <StepPlan
          plans={plans}
          loading={plansLoading}
          selected={selectedPlan}
          onSelect={(plan) => dispatch(setSelectedPlan(plan))}
          onNext={() => goToStep("summary")}
          onBack={() => goToStep("form")}
        />
      )}

      {step === "summary" && selectedPlan && (
        <StepSummary
          plan={selectedPlan}
          categoryName={categoryMeta?.name}
          onNext={() => goToStep("payment")}
          onBack={() => goToStep("plan")}
        />
      )}

      {step === "payment" && selectedPlan && (
        <StepPayment
          plan={selectedPlan}
          listingId={createdId}
          listingTitle={createdTitle}
          categoryKey={categoryKey}
          onBack={() => goToStep("summary")}
        />
      )}
    </View>
  );
}
