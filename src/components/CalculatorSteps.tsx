interface CalculatorStepsProps {
  currentStep: number;
}

const totalSteps = 3;

export const CalculatorSteps = ({ currentStep }: CalculatorStepsProps) => (
  <section className="info-section" aria-label="Calculator progress">
    <h2 id="calculator-steps-heading">How this calculator works</h2>
    <div
      role="progressbar"
      aria-label="Calculator step progress"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      className="steps-progress"
    >
      Step {currentStep} of {totalSteps}
    </div>
    <ol className="steps-list" aria-labelledby="calculator-steps-heading">
      <li aria-current={currentStep === 1 ? 'step' : undefined}>
        <strong>Step 1:</strong> Enter the first day of your last menstrual period (LMP).
      </li>
      <li aria-current={currentStep === 2 ? 'step' : undefined}>
        <strong>Step 2:</strong> Confirm your cycle length and optionally use a preset.
      </li>
      <li aria-current={currentStep === 3 ? 'step' : undefined}>
        <strong>Step 3:</strong> Review your entries and calculate your estimate.
      </li>
    </ol>
  </section>
);
