/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
import React, { useEffect, useState, useCallback, createContext, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import Joyride from 'react-joyride';
import { useLocation } from 'react-router-dom';
import FullScreenIntro from 'src/components/walkthrough/FullScreenIntro';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales } from 'src/locales';
import { paths } from '../paths';

const WalkthroughContext = createContext();
export const useWalkthrough = () => useContext(WalkthroughContext);

export const WalkthroughProvider = ({ children }) => {
  const { t } = useLocales();
  const { user } = useAuthContext();
  console.log(user);
  const steps = useMemo(() => {
    const baseSteps = [
      {
        target: 'body',
        placement: 'center',
        title: t('walkthrough.steps.introTitle'),
        content: t('walkthrough.steps.introContent'),
        disableBeacon: true,
      },
      {
        target: '[data-tour="step-dashboard-nav"]',
        content: t('walkthrough.steps.dashboard'),
        disableBeacon: true,
      },
    ];

    // Conditionally include "doc-type" step
    if (user?.role === 'super_admin') {
      baseSteps.push({
        target: '[data-tour="step-doc-type-nav"]',
        content: t('walkthrough.steps.docType'),
        disableBeacon: true,
      });
    }

    // Always add the final step
    baseSteps.push({
      target: '[data-tour="step-documents-nav"]',
      content: t('walkthrough.steps.documents'),
      disableBeacon: true,
    });

    return baseSteps;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [canShowStep, setCanShowStep] = useState(false);
  const location = useLocation();

  // Start walkthrough only when not on login screen
  useEffect(() => {
    const done = localStorage.getItem('walkthrough_done');

    // Prevent walkthrough on login screen
    const excludedPaths = [
      paths.auth.jwt.login,
      paths.auth.jwt.register,
      paths.auth.jwt.forgotPassword,
      paths.auth.jwt.forgotPasswordOtpVerification,
      paths.auth.jwt.loginOtpVerification,
      paths.auth.jwt.registerOtpVerification,
    ];
    if (excludedPaths.includes(location.pathname)) return;

    if (!done) {
      const firstStepSelector = steps[0].target;

      const waitForElement = () => {
        const el = document.querySelector(firstStepSelector);
        if (el) {
          setStepIndex(0);
          setCanShowStep(true);
          setRun(true);
        } else {
          setTimeout(waitForElement, 300);
        }
      };

      waitForElement();
    }
  }, [location.pathname, steps]);

  // Handle Joyride step progression
  const handleJoyrideCallback = useCallback(
    (data) => {
      const { status, index, action, type } = data;

      const isLastStep = index === steps.length - 1 && (action === 'next' || type === 'step:after');
      if (isLastStep) {
        localStorage.setItem('walkthrough_done', 'true');
        setRun(false);
        return;
      }

      if (status === 'skipped' || status === 'finished') {
        localStorage.setItem('walkthrough_done', 'true');
        setRun(false);
        return;
      }

      // Step navigation
      if (type === 'step:after' || action === 'next') {
        setTimeout(() => setStepIndex(index + 1), 0);
      } else if (action === 'prev') {
        setTimeout(() => setStepIndex(index - 1), 0);
      }
    },
    [steps.length]
  );

  // Handle custom behavior for "Documents" step
  useEffect(() => {
    const currentStep = steps[stepIndex];

    if (currentStep?.target === '[data-tour="step-documents-nav"]') {
      let retries = 0;

      const waitForElement = () => {
        const el = document.querySelector(currentStep.target);
        if (el) {
          const handleClick = () => {
            el.removeEventListener('click', handleClick);
            setStepIndex((prev) => prev + 1);
          };

          el.addEventListener('click', handleClick);
          return () => el.removeEventListener('click', handleClick);
        }

        if (retries < 10) {
          retries++;
          setTimeout(waitForElement, 300);
        } else {
          console.warn('Could not find Documents element');
        }
      };

      waitForElement();
    }
  }, [stepIndex, steps]);

  // Provide method to restart walkthrough
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
      {/* Render custom component only at first step */}
      {run && canShowStep && stepIndex === 0 && (
        <FullScreenIntro
          onStart={() => {
            setStepIndex(1); // Move to next step
          }}
        />
      )}

      {/* Joyride starts from step 1 after intro */}
      {run && canShowStep && stepIndex > 0 && steps[stepIndex] && (
        <Joyride
          key={`${stepIndex}-${run}-${canShowStep}`}
          steps={steps}
          run={run}
          stepIndex={stepIndex}
          callback={handleJoyrideCallback}
          continuous
          scrollToFirstStep
          showSkipButton
          showProgress={false}
          disableOverlayClose
          disableScrolling={false}
          styles={{
            options: {
              zIndex: 13000,
              primaryColor: '#014D4E',
              arrowColor: '#fff',
            },
            buttonBack: {
              display: 'none',
            },
          }}
          locale={{
            back: t('walkthrough.buttons.back'),
            last: t('walkthrough.buttons.last'),
            next: t('walkthrough.buttons.next'),
            skip: t('walkthrough.buttons.skip'),
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
