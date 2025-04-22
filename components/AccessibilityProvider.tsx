"use client";

import { useEffect } from 'react';
import { initAccessibilityEnhancements, enhanceColorContrast } from '@/lib/accessibility-enhancements';

/**
 * Client component that initializes accessibility enhancements
 * This ensures our accessibility fixes are applied when the app loads
 */
export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize accessibility enhancements
    initAccessibilityEnhancements();
    
    // Find all buttons without accessible names and add them
    // This includes both icon buttons and buttons with specific class patterns from the error report
    const buttonSelectors = [
      'button[class*="icon"]',
      // Break complex selector into simpler parts
      'button.flex.items-center.justify-between.whitespace-nowrap.border.bg-transparent',
      'button.flex.cursor-default.items-center.justify-center',
      // Additional selectors for buttons that need accessibility improvements
      '.border-\\[\\#939597\\]', // Properly escaped selector for querySelectorAll
      '[role="combobox"]',
      '.select-trigger'
    ];
    
    // Apply contrast enhancements to elements with insufficient contrast
    const applyContrastEnhancements = () => {
      // Apply high contrast colors to elements with insufficient contrast
      document.documentElement.style.setProperty('--primary', enhanceColorContrast.highContrastColors.light['--primary']);
      document.documentElement.style.setProperty('--primary-foreground', enhanceColorContrast.highContrastColors.light['--primary-foreground']);
      
      // Target specific elements with contrast issues
      const lowContrastElements = document.querySelectorAll('.border-\\[\\#939597\\], .text-\\[\\#939597\\]'); // Properly escaped selectors for querySelectorAll
      lowContrastElements.forEach(element => {
        if (element instanceof HTMLElement) {
          element.style.borderColor = '#6b6b6b'; // Darker border for better contrast
          element.style.color = '#000000'; // Black text for maximum contrast
        }
      });
    };
    
    // Process buttons to ensure they have accessible names
    const processButtonAccessibility = () => {
      buttonSelectors.forEach(selector => {
        const buttons = document.querySelectorAll(selector);
        buttons.forEach(button => {
          const hasText = button.textContent?.trim();
          const hasAriaLabel = button.hasAttribute('aria-label');
          const hasAriaLabelledBy = button.hasAttribute('aria-labelledby');
          
          if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
            // Try to infer a name from icon, context, or parent element
            const iconElement = button.querySelector('svg');
            const parentWithLabel = button.closest('[aria-label]');
            const nearestLabel = button.closest('label');
            const nearestText = button.closest('[data-value]');
            
            if (iconElement) {
              const iconName = iconElement.getAttribute('data-icon') || 'button';
              button.setAttribute('aria-label', `${iconName} button`);
            } else if (parentWithLabel) {
              const parentLabel = parentWithLabel.getAttribute('aria-label');
              button.setAttribute('aria-label', `${parentLabel} button`);
            } else if (nearestLabel) {
              const labelText = nearestLabel.textContent?.trim();
              if (labelText) {
                button.setAttribute('aria-label', `${labelText} button`);
              } else {
                button.setAttribute('aria-label', 'Select option');
              }
            } else if (nearestText) {
              const valueText = nearestText.getAttribute('data-value');
              if (valueText) {
                button.setAttribute('aria-label', `Select ${valueText}`);
              } else {
                button.setAttribute('aria-label', 'Select option');
              }
            } else {
              // For select buttons, use a more descriptive label
              if (button.classList.contains('whitespace-nowrap') && 
                  button.classList.contains('border') && 
                  button.classList.contains('bg-transparent')) {
                button.setAttribute('aria-label', 'Select option');
              } else {
                button.setAttribute('aria-label', 'Button');
              }
            }
          }
        });
      });
    };
    
    // Run the accessibility enhancements
    processButtonAccessibility();
    applyContrastEnhancements();
    
    // Set up a mutation observer to handle dynamically added content
    const observer = new MutationObserver((mutations) => {
      processButtonAccessibility();
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, []);
//   }, []);

  return <>{children}</>;
}