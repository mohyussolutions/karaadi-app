import { useEffect, useState, useMemo } from 'react';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTranslation } from '../../../../hooks/useAppTranslation';
import { getBusinessById, getMyBusinesses } from '../../../../actions/core/business.actions';
import { getImageUrl } from '../../../../util/helpers';
import { CheckoutBar } from '../../../../components/features/subscription/components/checklist';
import { BIZ_STEPS } from '../../../../navigation/config/navConfig';
import type { StepItem } from '../../../../util/types';
import type { BusinessPlan, BusinessApplyFormState, Business } from '../../../../util/types/business.types';
import { LoadingSpinner } from '../../../../components/loading';
import { useAuthStore } from '../../../../store/hooks/authStore';
import { useAppDispatch } from '../../../../store/store';
import { setListingType, setStep, setCategoryKey, setBusinessId } from '../../../../store/slices/newAdSlice';
import { useThemedStyles } from '../../../../hooks/useTheme';
import { createStyles } from '../../../../util/styles/business/businessCreate.styles';
import { type BusinessScreen, nextScreenAfterApproval } from '../business.helpers';
import { ApplyStep } from './ApplyStep';
import { ApprovalStep } from './ApprovalStep';
import { CategoriesStep } from './CategoriesStep';
import { PlanStep } from './PlanStep';
import { PostStep } from './PostStep';

const EMPTY: BusinessApplyFormState = {
  name: '', orgNumber: '', email: '', phone: '',
  contactName: '', website: '', address: '', description: '',
};

const CHECKUP_INDEX: Record<BusinessScreen, number> = {
  plan: 0, apply: 1, approval: 2, categories: 3, post: 4,
};

export default function BusinessCreateScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useAppTranslation();
  const { id: editId } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!editId;
  const { user, loading: authLoading } = useAuthStore();

  const s = useThemedStyles(createStyles);

  const [screen, setScreen] = useState<BusinessScreen>('apply');
  const [business, setBusinessRecord] = useState<Business | null>(null);
  const [chosenPlan, setChosenPlan] = useState<BusinessPlan | null>(null);

  const [initialValues, setInitialValues] = useState<BusinessApplyFormState | null>(null);
  const [initialLogo, setInitialLogo] = useState<string | undefined>(undefined);
  const [loadingBiz, setLoadingBiz] = useState(true);

  const bizSteps: StepItem[] = useMemo(
    () => BIZ_STEPS.map((step) => ({ key: step.key, label: t(step.labelKey) })),
    [t],
  );

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/(auth)/login');
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (!user) return;
    if (isEditing && editId) {
      getBusinessById(editId)
        .then((data) => {
          setBusinessRecord(data);
          setInitialValues({
            name: data.name || '',
            orgNumber: data.orgNumber || '',
            email: data.email || '',
            phone: data.phone || '',
            contactName: data.contactName || '',
            website: data.website || '',
            address: data.address || '',
            description: data.description || '',
          });
          if (data.logo) setInitialLogo(getImageUrl(data.logo) || data.logo);

          if (data.status === 'active' && data.isVerified) {
            setScreen(nextScreenAfterApproval(data));
          }
        })
        .catch(() => Alert.alert(t('auth.common.error'), t('mine.businesses.loadError')))
        .finally(() => setLoadingBiz(false));
      return;
    }

    getMyBusinesses()
      .then((list) => {
        const existing = list[0];
        if (existing) {
          setBusinessRecord(existing);
          if (existing.status === 'active' && existing.isVerified) {
            setScreen(nextScreenAfterApproval(existing));
          } else {
            setScreen('approval');
          }
        } else {
          setScreen('plan');
        }
      })
      .catch(() => {})
      .finally(() => setLoadingBiz(false));
  }, [editId, user]);

  if (!user || loadingBiz) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <CheckoutBar steps={bizSteps} currentIndex={CHECKUP_INDEX[screen]} />

      {screen === 'plan' && (
        <PlanStep
          business={business}
          onSelected={(result) => {
            if (!business) {
              setChosenPlan(result as BusinessPlan);
              setScreen('apply');
              return;
            }
            setBusinessRecord(result);
            setScreen('post');
          }}
        />
      )}

      {screen === 'apply' && (
        <ApplyStep
          key={editId || 'new'}
          initialValues={initialValues || EMPTY}
          initialLogo={initialLogo}
          isEditing={isEditing}
          editId={editId}
          accountEmail={user.email}
          plan={chosenPlan}
          onSuccess={(biz) => {
            if (isEditing) { router.back(); return; }
            setBusinessRecord(biz);
            setScreen('approval');
          }}
          onCancel={() => router.back()}
        />
      )}

      {screen === 'approval' && business && (
        <ApprovalStep
          business={business}
          onApproved={(biz) => {
            setBusinessRecord(biz);
            setScreen(nextScreenAfterApproval(biz));
          }}
        />
      )}

      {screen === 'categories' && business && (
        <CategoriesStep
          business={business}
          onSaved={(biz) => {
            setBusinessRecord(biz);
            setScreen(!biz.planId ? 'plan' : 'post');
          }}
        />
      )}

      {screen === 'post' && business && (
        <PostStep
          business={business}
          onSelectCategory={(category) => {
            dispatch(setListingType('public'));
            dispatch(setCategoryKey(category));
            dispatch(setBusinessId(business._id || business.id || null));
            dispatch(setStep('form'));
            router.replace('/(tabs)/new-ad');
          }}
        />
      )}
    </SafeAreaView>
  );
}
