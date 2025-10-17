import { create } from "zustand";

interface WizardState {
    currentStep: number;
    nextStep: () => void;
    prevStep: () => void;
    goToStep: (step: number) => void;
}

export const useWizardStore = create<WizardState>((set) => ({
    currentStep: 0,
    nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
    prevStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
    goToStep: (step) => set({ currentStep: step }),
}));
