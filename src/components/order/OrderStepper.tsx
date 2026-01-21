import { clsx } from 'clsx';
import { ORDER_STEPS } from '../../lib/constants';
import type { OrderStep } from '../../types/order';

interface OrderStepperProps {
  currentStep: OrderStep;
}

export default function OrderStepper({ currentStep }: OrderStepperProps) {
  const getCurrentStepIndex = () => {
    return ORDER_STEPS.findIndex((step) => step.id === currentStep);
  };

  const currentIndex = getCurrentStepIndex();

  return (
    <nav aria-label="Order progress" className="mb-8">
      <ol className="flex items-center justify-center gap-2 md:gap-4">
        {ORDER_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <li key={step.id} className="flex items-center">
              {/* Step indicator */}
              <div className="flex items-center gap-2">
                <span
                  className={clsx(
                    'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors',
                    isCompleted && 'bg-accent text-white',
                    isCurrent && 'bg-primary text-white',
                    isUpcoming && 'bg-gray-200 text-gray-500'
                  )}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    step.number
                  )}
                </span>
                <span
                  className={clsx(
                    'text-sm font-medium hidden sm:inline',
                    isCurrent ? 'text-primary' : 'text-gray-500'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < ORDER_STEPS.length - 1 && (
                <div
                  className={clsx(
                    'w-8 md:w-12 h-0.5 mx-2',
                    index < currentIndex ? 'bg-accent' : 'bg-gray-200'
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
