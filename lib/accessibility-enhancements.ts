/**
 * Accessibility enhancements to address Google Lighthouse feedback
 * - Buttons without accessible names
 * - Insufficient color contrast
 * - Links that rely only on color to be distinguishable
 */

// Button accessibility enhancements
export const enhanceButtonAccessibility = {
  /**
   * Ensures buttons have accessible names
   * Apply this to icon-only buttons or buttons without visible text
   */
  addAccessibleName: (element: HTMLButtonElement, name: string) => {
    if (!element.textContent?.trim()) {
      // If button has no text content, add aria-label
      element.setAttribute('aria-label', name);
    }
  },
  
  /**
   * Adds a visually hidden label for screen readers while maintaining visual design
   * Useful for icon buttons that should have a text label for screen readers
   */
  addHiddenLabel: (element: HTMLButtonElement, label: string) => {
    // Check if button already has an accessible name
    if (!element.getAttribute('aria-label') && !element.textContent?.trim()) {
      // Create a span with sr-only class
      const srLabel = document.createElement('span');
      srLabel.className = 'sr-only';
      srLabel.textContent = label;
      
      // Add the span to the button
      element.appendChild(srLabel);
    }
  },

  /**
   * Checks if a button has an accessible name
   * Returns true if the button has text content, aria-label, or aria-labelledby
   */
  hasAccessibleName: (element: HTMLButtonElement): boolean => {
    return !!(element.textContent?.trim() || 
              element.getAttribute('aria-label') || 
              element.getAttribute('aria-labelledby'));
  },

  /**
   * Enhances select trigger buttons to ensure they have accessible names
   * Specifically targets the buttons identified in accessibility reports
   */
  enhanceSelectTriggers: () => {
    const selectTriggerSelectors = [
      'button.flex.items-center.justify-between.whitespace-nowrap.border.bg-transparent',
      '[role="combobox"]',
      '.select-trigger'
    ];

    selectTriggerSelectors.forEach(selector => {
      const triggers = document.querySelectorAll(selector);
      triggers.forEach(trigger => {
        if (trigger instanceof HTMLElement && !enhanceButtonAccessibility.hasAccessibleName(trigger as HTMLButtonElement)) {
          // Try to determine a meaningful label from context
          const nearestLabel = trigger.closest('label');
          const nearestLabeledElement = trigger.closest('[aria-labelledby]');
          
          if (nearestLabel && nearestLabel.textContent) {
            trigger.setAttribute('aria-label', `${nearestLabel.textContent.trim()} select`);
          } else if (nearestLabeledElement) {
            const labelId = nearestLabeledElement.getAttribute('aria-labelledby');
            if (labelId) {
              const labelElement = document.getElementById(labelId);
              if (labelElement && labelElement.textContent) {
                trigger.setAttribute('aria-label', `${labelElement.textContent.trim()} select`);
              } else {
                trigger.setAttribute('aria-label', 'Select option');
              }
            }
          } else {
            trigger.setAttribute('aria-label', 'Select option');
          }
        }
      });
    });
  }
};

// Color contrast enhancements
export const enhanceColorContrast = {
  /**
   * CSS custom properties with improved contrast ratios
   * These can be applied to override the default theme colors
   */
  highContrastColors: {
    // Light mode - improved contrast ratios
    light: {
      // Primary colors with improved contrast (4.5:1 minimum)
      '--primary': '0 0% 0%', // Black for maximum contrast
      '--primary-foreground': '0 0% 100%', // White text on black
      
      // Secondary colors with improved contrast
      '--secondary': '0 0% 85%', // Lighter gray background
      '--secondary-foreground': '0 0% 0%', // Black text on light gray
      
      // Muted colors with improved contrast
      '--muted': '0 0% 90%',
      '--muted-foreground': '0 0% 20%', // Darker text for better contrast
      
      // Link colors with improved contrast
      '--link': '210 100% 30%', // Darker blue for better contrast
      '--link-hover': '210 100% 20%', // Even darker on hover
    },
    
    // Dark mode - improved contrast ratios
    dark: {
      // Primary colors with improved contrast (4.5:1 minimum)
      '--primary': '0 0% 100%', // White for maximum contrast
      '--primary-foreground': '0 0% 0%', // Black text on white
      
      // Secondary colors with improved contrast
      '--secondary': '0 0% 20%', // Darker gray background
      '--secondary-foreground': '0 0% 100%', // White text on dark gray
      
      // Muted colors with improved contrast
      '--muted': '0 0% 15%',
      '--muted-foreground': '0 0% 90%', // Lighter text for better contrast
      
      // Link colors with improved contrast
      '--link': '210 100% 70%', // Lighter blue for better contrast
      '--link-hover': '210 100% 80%', // Even lighter on hover
    }
  },
  
  /**
   * Apply high contrast colors to the document
   * This can be toggled by users who need higher contrast
   */
  applyHighContrast: (isDarkMode: boolean = false) => {
    const colors = isDarkMode 
      ? enhanceColorContrast.highContrastColors.dark 
      : enhanceColorContrast.highContrastColors.light;
    
    // Apply colors to root element
    const root = document.documentElement;
    Object.entries(colors).forEach(([property, value]) => {
      root.style.setProperty(property, value as string);
    });
  }
};

// Link accessibility enhancements
export const enhanceLinkAccessibility = {
  /**
   * Ensures links are distinguishable by more than just color
   * Adds underlines to all links by default
   */
  makeLinksDistinguishable: () => {
    // Add CSS to ensure links are underlined
    const style = document.createElement('style');
    style.textContent = `
      a:not(.no-underline) {
        text-decoration: underline;
      }
      
      /* Ensure focus states are visible */
      a:focus-visible {
        outline: 2px solid var(--ring);
        outline-offset: 2px;
      }
    `;
    document.head.appendChild(style);
  },
  
  /**
   * Add visual indicators to links beyond just color
   * @param element The link element to enhance
   */
  enhanceLinkElement: (element: HTMLAnchorElement) => {
    // Add underline if not already present
    if (getComputedStyle(element).textDecoration.indexOf('underline') === -1) {
      element.style.textDecoration = 'underline';
    }
    
    // Ensure proper focus states
    element.classList.add('focus-visible');
  }
};

// Initialize accessibility enhancements
export const initAccessibilityEnhancements = () => {
  // Only run in browser environment
  if (typeof window === 'undefined') return;
  
  // Apply link distinguishability
  enhanceLinkAccessibility.makeLinksDistinguishable();
  
  // Enhance select triggers to ensure they have accessible names
  enhanceButtonAccessibility.enhanceSelectTriggers();
  
  // Apply high contrast colors to elements with insufficient contrast
  const applyContrastFixes = () => {
    // Target specific elements with contrast issues mentioned in the error report
    const lowContrastSelectors = [
      '.border-\\[\\#939597\\]',
      '.focus\\:border-\\[\\#0055A2\\]',
      '.focus\\:ring-\\[\\#0055A2\\]'
    ];
    
    lowContrastSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (element instanceof HTMLElement) {
          // Improve border contrast
          if (element.classList.contains('border-\[#939597\]')) {
            element.style.borderColor = '#6b6b6b'; // Darker border for better contrast
          }
          
          // Ensure focus states have sufficient contrast
          if (element.matches(':focus')) {
            element.style.borderColor = '#003366'; // Darker blue for better contrast
            element.style.outlineColor = '#003366'; // Darker blue for better contrast
          }
          
          // Check for focus classes with escaped selectors
          if (element.classList.contains('focus:border-\[#0055A2\]')) {
            element.style.borderColor = '#003366'; // Darker blue for better contrast
          }
          
          if (element.classList.contains('focus:ring-\[#0055A2\]')) {
            element.style.outlineColor = '#003366'; // Darker blue for better contrast
          }
        }
      });
    });
  };
  
  // Apply contrast fixes
  applyContrastFixes();
  
  // Find all buttons without accessible names and enhance them
  document.querySelectorAll('button').forEach(button => {
    const hasText = button.textContent?.trim();
    const hasAriaLabel = button.hasAttribute('aria-label');
    const hasAriaLabelledBy = button.hasAttribute('aria-labelledby');
    
    if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
      // Try to infer a name from icon or context
      const iconElement = button.querySelector('svg');
      if (iconElement) {
        const iconName = iconElement.getAttribute('data-icon') || 'button';
        enhanceButtonAccessibility.addAccessibleName(button, `${iconName} button`);
      } else {
        enhanceButtonAccessibility.addAccessibleName(button, 'Button');
      }
    }
  });
};