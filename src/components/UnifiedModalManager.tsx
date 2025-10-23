import React from 'react';
import { useModal } from '@/contexts/ModalContext';
import { useAuth } from '@/hooks/useAuth';
import { LoginModal } from './LoginModal';
import { SavePostSignupPopup } from './SavePostSignupPopup';
import { PremiumPlanModal } from './PremiumPlanModal';
import { PricingModal } from './PricingModal';
import { ClaimTrialPostDialog } from './ClaimTrialPostDialog';

/**
 * UnifiedModalManager - Central modal management to prevent conflicts
 * 
 * This component:
 * - Ensures only one modal is open at a time
 * - Prevents auth conflicts between different modal types
 * - Provides consistent modal behavior across the app
 * - Eliminates overlapping modal issues
 */
export function UnifiedModalManager() {
  const { currentModal, closeModal, openModal } = useModal();
  const { user } = useAuth();

  // Don't render anything if no modal is active
  if (!currentModal.type) {
    return null;
  }

  const { type, props = {}, defaultTab } = currentModal;

  console.log('🎭 Rendering unified modal:', type, 'with props:', props);

  switch (type) {
    case 'login':
    case 'signup':
      return (
        <LoginModal
          isOpen={true}
          onClose={closeModal}
          defaultTab={defaultTab || (type === 'signup' ? 'signup' : 'login')}
          onAuthSuccess={(user) => {
            console.log('🎯 Unified auth success:', user?.email);
            props.onAuthSuccess?.(user);
            closeModal();
          }}
          {...props}
        />
      );

    case 'savePost':
      return (
        <SavePostSignupPopup
          isOpen={true}
          onClose={closeModal}
          onSignupSuccess={(user) => {
            console.log('🎯 Unified save post success:', user?.email);
            props.onSignupSuccess?.(user);
            closeModal();
          }}
          {...props}
        />
      );

    case 'premium':
      // If user is not authenticated, render the login modal first and re-open premium after auth
      if (!user) {
        return (
          <LoginModal
            isOpen={true}
            onClose={closeModal}
            defaultTab={'login'}
            onAuthSuccess={(authUser) => {
              console.log('🎯 User authenticated, reopening premium modal for:', authUser?.email);
              // Small delay to ensure auth state is updated in useAuth hook before reopening premium modal
              setTimeout(() => {
                console.log('🎯 Reopening premium modal after brief delay');
                openModal('premium', props);
              }, 100);
            }}
          />
        );
      }

      return (
        <PremiumPlanModal
          isOpen={true}
          onClose={closeModal}
          onSuccess={() => {
            console.log('🎯 Unified premium success');
            props.onSuccess?.();
            closeModal();
          }}
          triggerSource={props.triggerSource || 'manual'}
          {...props}
        />
      );

    case 'pricing':
      return (
        <PricingModal
          isOpen={true}
          onClose={closeModal}
          onSuccess={() => {
            console.log('🎯 Unified pricing success');
            props.onSuccess?.();
            closeModal();
          }}
          {...props}
        />
      );

    case 'claim':
      return (
        <ClaimTrialPostDialog
          isOpen={true}
          onClose={closeModal}
          onSuccess={(user) => {
            console.log('🎯 Unified claim success:', user?.email);
            props.onSuccess?.(user);
            closeModal();
          }}
          {...props}
        />
      );

    default:
      console.warn('🎭 Unknown modal type:', type);
      return null;
  }
}
