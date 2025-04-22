/**
 * Accessibility utilities and configurations for the SAID application
 */

// Focus management utilities
export const manageFocus = {
  /**
   * Trap focus within a specific element (for modals, dialogs, etc.)
   */
  trapFocus: (element: HTMLElement) => {
    // Get all focusable elements
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    // Set initial focus
    firstElement?.focus();
    
    // Handle keyboard navigation
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
      
      // Allow escape key to close modal/dialog
      if (e.key === 'Escape') {
        // Dispatch a custom event that can be listened for
        element.dispatchEvent(new CustomEvent('accessibilityEscape'));
      }
    });
  },
  
  /**
   * Return focus to a trigger element after closing a modal/dialog
   */
  returnFocus: (triggerElement: HTMLElement) => {
    triggerElement?.focus();
  }
};

// Announcement utility for screen readers
export const announceToScreenReader = (message: string) => {
  // Create or use an existing live region
  let announcer = document.getElementById('sr-announcer');
  
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'sr-announcer';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.classList.add('sr-only'); // Visually hidden
    document.body.appendChild(announcer);
  }
  
  // Set the message
  announcer.textContent = message;
  
  // Clear after a delay
  setTimeout(() => {
    announcer.textContent = '';
  }, 3000);
};

// Skip to content link handler
export const setupSkipToContent = () => {
  const skipLink = document.getElementById('skip-to-content');
  const mainContent = document.getElementById('main-content');
  
  if (skipLink && mainContent) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
      // Remove tabindex after focus to avoid issues with normal navigation
      setTimeout(() => mainContent.removeAttribute('tabindex'), 1000);
    });
  }
};

// CSS classes for visually hidden elements (screen reader only)
export const srOnlyClass = 'sr-only';

// Add to globals.css:
// .sr-only {
//   position: absolute;
//   width: 1px;
//   height: 1px;
//   padding: 0;
//   margin: -1px;
//   overflow: hidden;
//   clip: rect(0, 0, 0, 0);
//   white-space: nowrap;
//   border-width: 0;
// }

// Focus visible utility
export const focusVisibleClass = 'focus-visible';

// ARIA attributes helper
export const ariaAttributes = {
  required: { 'aria-required': 'true' },
  invalid: { 'aria-invalid': 'true' },
  describedBy: (id: string) => ({ 'aria-describedby': id }),
  labelledBy: (id: string) => ({ 'aria-labelledby': id }),
  expanded: (isExpanded: boolean) => ({ 'aria-expanded': isExpanded ? 'true' : 'false' }),
  selected: (isSelected: boolean) => ({ 'aria-selected': isSelected ? 'true' : 'false' }),
  checked: (isChecked: boolean) => ({ 'aria-checked': isChecked ? 'true' : 'false' }),
  hidden: (isHidden: boolean) => ({ 'aria-hidden': isHidden ? 'true' : 'false' }),
};