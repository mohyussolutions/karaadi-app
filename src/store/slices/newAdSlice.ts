import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { fetchPlansFromAPI } from '../../api/categories/plan.actions';
import { createListing } from '../../api/categories/listing.actions';
import type { ListingType, Step, Plan, CreatedItemSummary, NewAdState } from '../../util/types/new-ad.types';

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

export const fetchPlans = createAsyncThunk('newAd/fetchPlans', () => fetchPlansFromAPI());

export const submitListing = createAsyncThunk(
  'newAd/submit',
  async (
    { categoryKey, body, summary }: { categoryKey: string; body: Record<string, any>; summary?: CreatedItemSummary },
    { rejectWithValue, getState },
  ) => {
    try {
      const businessId = (getState() as { newAd: NewAdState }).newAd.businessId;
      const { id, images } = await createListing(categoryKey, body, businessId);
      return {
        id,
        title: String(body.title || ''),
        summary: summary ? { ...summary, images: images ?? summary.images } : null,
      };
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || 'Failed to create listing. Please try again.',
      );
    }
  },
);

const newAdSlice = createSlice({
  name: 'newAd',
  initialState,
  reducers: {
    setStep(state, action: PayloadAction<Step>) {
      state.step = action.payload;
    },
    setListingType(state, action: PayloadAction<ListingType>) {
      state.listingType = action.payload;
    },
    setCategoryKey(state, action: PayloadAction<string>) {
      state.categoryKey = action.payload;
    },
    setBusinessId(state, action: PayloadAction<string | null>) {
      state.businessId = action.payload;
    },
    setSelectedPlan(state, action: PayloadAction<Plan | null>) {
      state.selectedPlan = action.payload;
    },
    setFeeInfo(state, action: PayloadAction<{ feeId: string; feeAmount: number }>) {
      state.feeId = action.payload.feeId;
      state.feeAmount = action.payload.feeAmount;
    },
    prefillForPayment(
      _state,
      action: PayloadAction<{
        categoryKey: string;
        createdId: string;
        createdTitle: string;
        createdItem: CreatedItemSummary;
      }>,
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

export default newAdSlice.reducer;
