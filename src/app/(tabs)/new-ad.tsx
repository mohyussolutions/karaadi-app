import { useEffect, useCallback } from "react";
import { View, Alert, BackHandler } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { useThemedStyles } from "../../hooks/app/useTheme";
import { createStyles } from "../../utils/styles/tabs/newAdTab.styles";
import { LoadingSpinner } from "../../components/loading";
import { useAuthStore } from "../../store/hooks/useAuthStore";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchPlans, resetNewAd, selectNewAdBusinessId, selectNewAdCategoryKey, selectNewAdCreatedId, selectNewAdCreatedTitle, selectNewAdListingType, selectNewAdPlans, selectNewAdPlansLoading, selectNewAdSelectedPlan, selectNewAdStep, selectNewAdSubmitStatus, setCategoryKey, setListingType, setSelectedPlan } from "../../store/slices/newAdSlice";
import { useNewAdStepNavigation } from "../../hooks/listings/useNewAd";
import { useNewAdFlowTracking } from "../../hooks/listings/useNewAd";
import { CheckoutBar } from "../../components/features/subscription/components/checkout";
import { StepType, StepCategory, StepPlan, StepSummary, StepPayment, CATEGORY_FORMS } from "../../components/management/create/new-ad";

import type { ListingType, StepItem } from "../../utils/types";
import { MAIN_CATEGORIES, ROUTES, STEP_INDEX } from "../../actions/constants";

export default function NewAdScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuthStore();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(ROUTES.login);
    }
  }, [authLoading, user]);

  const step = useAppSelector(selectNewAdStep);
  const listingType = useAppSelector(selectNewAdListingType);
  const categoryKey = useAppSelector(selectNewAdCategoryKey);
  const businessId = useAppSelector(selectNewAdBusinessId);
  const plans = useAppSelector(selectNewAdPlans);
  const plansLoading = useAppSelector(selectNewAdPlansLoading);
  const selectedPlan = useAppSelector(selectNewAdSelectedPlan);
  const createdId = useAppSelector(selectNewAdCreatedId);
  const createdTitle = useAppSelector(selectNewAdCreatedTitle);

  useEffect(() => {
    if (step === "plan" && plans.length === 0) {
      dispatch(fetchPlans());
    }
  }, [step]);

  const goToStep = useNewAdStepNavigation();
  useNewAdFlowTracking(step, categoryKey);

  const submitStatus = useAppSelector(selectNewAdSubmitStatus);
  useFocusEffect(
    useCallback(() => {
      return () => {
        if (submitStatus === "success") dispatch(resetNewAd());
      };
    }, [submitStatus]),
  );

  const leaveCheckout = useCallback(() => {
    Alert.alert(t("postAd.leaveCheckoutTitle"), t("postAd.leaveCheckoutBody"), [
      { text: t("auth.common.cancel"), style: "cancel" },
      {
        text: t("postAd.leaveCheckoutConfirm"),
        onPress: () => {
          dispatch(resetNewAd());
          router.replace(ROUTES.myAds);
        },
      },
    ]);
  }, [dispatch, router, t]);

  const goBack = useCallback((): boolean => {
    switch (step) {
      case "category": goToStep("type"); return true;
      case "form": goToStep("category"); return true;
      case "plan": leaveCheckout(); return true;
      case "summary": goToStep("plan"); return true;
      case "payment": goToStep("summary"); return true;
      default: return false;
    }
  }, [step, goToStep, leaveCheckout]);

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", goBack);
      return () => sub.remove();
    }, [goBack]),
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
              router.push(ROUTES.businessCreate);
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
          onBack={goBack}
        />
      )}

      {step === "form" && CATEGORY_FORMS[categoryKey] && (() => {
        const CategoryForm = CATEGORY_FORMS[categoryKey];
        return (
          <CategoryForm
            listingType={listingType}
            onSuccess={() => {
              if (businessId) {
                dispatch(resetNewAd());
                Alert.alert(
                  t("postAd.businessPostedTitle"),
                  t("postAd.businessPostedMessage"),
                  [{ text: t("auth.common.ok"), onPress: () => router.replace(ROUTES.profileBusinesses) }],
                );
              } else {
                goToStep("plan");
              }
            }}
            onBack={goBack}
          />
        );
      })()}

      {step === "plan" && (
        <StepPlan
          plans={plans}
          loading={plansLoading}
          selected={selectedPlan}
          onSelect={(plan) => dispatch(setSelectedPlan(plan))}
          onNext={() => goToStep("summary")}
          onBack={goBack}
        />
      )}

      {step === "summary" && selectedPlan && (
        <StepSummary
          plan={selectedPlan}
          categoryName={categoryMeta?.name}
          onNext={() => goToStep("payment")}
          onBack={goBack}
        />
      )}

      {step === "payment" && selectedPlan && (
        <StepPayment
          plan={selectedPlan}
          listingId={createdId}
          listingTitle={createdTitle}
          categoryKey={categoryKey}
          onBack={goBack}
        />
      )}
    </View>
  );
}
