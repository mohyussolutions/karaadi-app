import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPlansFromAPI } from '../../actions/categories/plan.actions';
import { createListing } from '../../actions/categories/listing.actions';
import type { ForceRefresh, NewAdState, PrefillForPaymentAction, RootState, SetBusinessIdAction, SetCategoryKeyAction, SetFeeInfoAction, SetListingTypeAction, SetSelectedPlanAction, SetStepAction, Step, SubmitListingArgs } from '../../utils/types';
import { getApiErrorMessage } from '../../lib/helpers/api/api.format';

const initialState: NewAdState = {
  step: 'type',
  listingType: null,
  categoryKey: '',
  businessId: null,
  plans: [],
  plansLoading: false,
  selectedPlan: null,
  createdId: '',
  createdTitle: '',
  createdItem: null,
  submitStatus: 'idle',
  submitError: null,
  feeId: '',
  feeAmount: 0,
};

export const fetchPlans = createAsyncThunk('newAd/fetchPlans', (force: ForceRefresh) => fetchPlansFromAPI(Boolean(force)));

export const submitListing = createAsyncThunk(
  'newAd/submit',
  async (
    { categoryKey, body, summary }: SubmitListingArgs,
    { rejectWithValue, getState },
  ) => {
    try {
      const businessId = (getState() as RootState).newAd.businessId;
      const { id, images } = await createListing(categoryKey, body, businessId);
      return {
        id,
        title: String(body.title || ''),
        summary: summary ? { ...summary, images: images ?? summary.images } : null,
      };
    } catch (err) {
      return rejectWithValue(getApiErrorMessage(err) || 'Failed to create listing. Please try again.');
    }
  },
);

const newAdSlice = createSlice({
  name: 'newAd',
  initialState,
  selectors: {
    selectNewAdBusinessId: (state) => state.businessId,
    selectNewAdCategoryKey: (state) => state.categoryKey,
    selectNewAdCreatedId: (state) => state.createdId,
    selectNewAdCreatedItem: (state) => state.createdItem,
    selectNewAdCreatedTitle: (state) => state.createdTitle,
    selectNewAdFeeAmount: (state) => state.feeAmount,
    selectNewAdFeeId: (state) => state.feeId,
    selectNewAdListingType: (state) => state.listingType,
    selectNewAdPlans: (state) => state.plans,
    selectNewAdPlansLoading: (state) => state.plansLoading,
    selectNewAdSelectedPlan: (state) => state.selectedPlan,
    selectNewAdStep: (state) => state.step,
    selectNewAdSubmitError: (state) => state.submitError,
    selectNewAdSubmitStatus: (state) => state.submitStatus,
  },
  reducers: {
    setStep(state, action: SetStepAction) {
      state.step = action.payload;
    },
    setListingType(state, action: SetListingTypeAction) {
      state.listingType = action.payload;
    },
    setCategoryKey(state, action: SetCategoryKeyAction) {
      state.categoryKey = action.payload;
    },
    setBusinessId(state, action: SetBusinessIdAction) {
      state.businessId = action.payload;
    },
    setSelectedPlan(state, action: SetSelectedPlanAction) {
      state.selectedPlan = action.payload;
    },
    setFeeInfo(state, action: SetFeeInfoAction) {
      state.feeId = action.payload.feeId;
      state.feeAmount = action.payload.feeAmount;
    },
    prefillForPayment(
      _state,
      action: PrefillForPaymentAction,
    ) {
      return {
        ...initialState,
        categoryKey: action.payload.categoryKey,
        createdId: action.payload.createdId,
        createdTitle: action.payload.createdTitle,
        createdItem: action.payload.createdItem,
        step: 'plan' as Step,
        submitStatus: 'success' as const,
      };
    },
    resetNewAd: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.plansLoading = true;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.plans = action.payload;
        state.plansLoading = false;
        const selectedKey = state.selectedPlan?.key;
        if (selectedKey) state.selectedPlan = action.payload.find((p) => p.key === selectedKey) ?? state.selectedPlan;
      })
      .addCase(fetchPlans.rejected, (state) => {
        state.plansLoading = false;
      })
      .addCase(submitListing.pending, (state) => {
        state.submitStatus = 'submitting';
        state.submitError = null;
      })
      .addCase(submitListing.fulfilled, (state, action) => {
        state.submitStatus = 'success';
        state.createdId = action.payload.id;
        state.createdTitle = action.payload.title;
        state.createdItem = action.payload.summary;
      })
      .addCase(submitListing.rejected, (state, action) => {
        state.submitStatus = 'error';
        state.submitError = action.payload as string;
      });
  },
});

export const {
  setStep, setListingType, setCategoryKey, setBusinessId, setSelectedPlan, setFeeInfo,
  prefillForPayment, resetNewAd,
} = newAdSlice.actions;

export const { selectNewAdBusinessId, selectNewAdCategoryKey, selectNewAdCreatedId, selectNewAdCreatedItem, selectNewAdCreatedTitle, selectNewAdFeeAmount, selectNewAdFeeId, selectNewAdListingType, selectNewAdPlans, selectNewAdPlansLoading, selectNewAdSelectedPlan, selectNewAdStep, selectNewAdSubmitError, selectNewAdSubmitStatus } = newAdSlice.selectors;
export default newAdSlice.reducer;
