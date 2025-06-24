/* eslint-disable consistent-return */
import React, {
  useEffect,
  useState,
  useCallback,
  createContext,
  useContext,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import Joyride from 'react-joyride';
import { useLocation } from 'react-router-dom';

const WalkthroughContext = createContext();
export const useWalkthrough = () => useContext(WalkthroughContext);

// Define steps (remove `route`)
const steps = [
  {
    target: '[data-tour="step-dashboard-nav"]',
    content: 'Click to visit your Dashboard.',
  },
  {
    target: '[data-tour="step-doc-type-nav"]',
    content: 'Now click on Document Type to continue.',
  },
  {
    target: '[data-tour="step-documents-nav"]',
    content: 'These are your Documents.',
  },
];

export const WalkthroughProvider = ({ children }) => {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [canShowStep, setCanShowStep] = useState(false);
  const location = useLocation();

  // Start walkthrough if not done
  useEffect(() => {
    const done = localStorage.getItem('walkthrough_done');
    if (!done) {
      setRun(true);
    }
  }, []);

  // Wait for the current step's target element to exist
  useEffect(() => {
    if (!run || !steps[stepIndex]) return;

    const targetSelector = steps[stepIndex].target;
    const checkTarget = () => !!document.querySelector(targetSelector);

    const waitForElement = () => {
      if (checkTarget()) {
        setCanShowStep(true);
      } else {
        const retry = setTimeout(waitForElement, 300);
        return () => clearTimeout(retry);
      }
    };

    setCanShowStep(false);
    const cleanup = waitForElement();
    return cleanup;
  }, [stepIndex, location.pathname, run]);

  // Handle Joyride callbacks
  const handleJoyrideCallback = useCallback((data) => {
    const { status, index, action, type } = data;

    if (['finished', 'skipped'].includes(status) || action === 'close') {
      localStorage.setItem('walkthrough_done', 'true');
      setRun(false);
      return;
    }

    if (action === 'next') {
      console.log('Next clicked at step index:', index);
      console.log('Step data:', steps[index]);
    }

    if (type === 'step:after' || action === 'next') {
      setTimeout(() => setStepIndex(index + 1), 0);
    } else if (action === 'prev') {
      setTimeout(() => setStepIndex(index - 1), 0);
    }
  }, []);

  useEffect(() => {
    const currentStep = steps[stepIndex];

    if (currentStep?.target === '[data-tour="step-documents-nav"]') {
      let retries = 0;

      const waitForElement = () => {
        const el = document.querySelector(currentStep.target);
        if (el) {
          console.log('✅ Found Documents element');

          const handleClick = () => {
            console.log('✅ User clicked Documents');
            el.removeEventListener('click', handleClick);

            // Optional: navigate
            // navigate('/documents');

            setStepIndex((prev) => prev + 1);
          };

          el.addEventListener('click', handleClick);

          // Clean up
          return () => el.removeEventListener('click', handleClick);
        } if (retries < 10) {
          // eslint-disable-next-line no-plusplus
          retries++;
          setTimeout(waitForElement, 300); // retry again
        } else {
          console.warn('❌ Could not find Documents element');
        }
      };

      waitForElement();
    }
  }, [stepIndex]);




  // Memoized context value
  const contextValue = useMemo(
    () => ({
      startWalkthrough: () => {
        localStorage.removeItem('walkthrough_done');
        setStepIndex(0);
        setRun(true);
      },
    }),
    []
  );

  return (
    <WalkthroughContext.Provider value={contextValue}>
      {run && canShowStep && steps[stepIndex] && (
        <Joyride
          key={stepIndex}
          steps={steps}
          run={run}
          debug
          stepIndex={stepIndex}
          callback={handleJoyrideCallback}
          continuous
          scrollToFirstStep
          showSkipButton
          showProgress
          disableOverlayClose
          disableScrolling={false}
          styles={{
            options: {
              zIndex: 13000,
            },
          }}
        />
      )}
      {children}
    </WalkthroughContext.Provider>
  );
};

WalkthroughProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
