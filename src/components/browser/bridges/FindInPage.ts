export const FIND_IN_PAGE_SCRIPT = (searchText: string) => {
  const escapedText = searchText.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return `
(function() {
  if (!window._keychainFindInPage) {
    window._keychainFindInPage = {
      currentIndex: -1,
      matches: [],
      searchText: '',
      highlightClass: '_keychain-find-highlight',
      activeClass: '_keychain-find-active',
    };
  }

  const findState = window._keychainFindInPage;
  
  function removeHighlights() {
    const highlights = document.querySelectorAll('.' + findState.highlightClass);
    highlights.forEach(el => {
      const parent = el.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(el.textContent || ''), el);
        parent.normalize();
      }
    });
    findState.matches = [];
    findState.currentIndex = -1;
  }

  function isElementVisible(element) {
    if (!element) return false;
    
    const style = window.getComputedStyle(element);
    
    // Check if element is hidden via CSS
    if (style.display === 'none' || 
        style.visibility === 'hidden' || 
        style.opacity === '0') {
      return false;
    }
    
    // Check if element has zero dimensions
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      return false;
    }
    
    return true;
  }

  function highlightMatches(text) {
    removeHighlights();
    
    if (!text || text.trim().length === 0) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          name: 'FIND_IN_PAGE_COUNT',
          count: 0,
          current: 0
        }));
      }
      return;
    }

    findState.searchText = text;
    const escapeRegex = /[.*+?^\\$\\{\\}\\(\\)|\\[\\]\\\\]/g;
    const searchRegex = new RegExp(text.replace(escapeRegex, '\\\\$&'), 'gi');
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );

    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      if (node.textContent && searchRegex.test(node.textContent)) {
        // Check if the parent element is visible
        let parent = node.parentElement;
        while (parent && parent !== document.body) {
          if (!isElementVisible(parent)) {
            parent = null;
            break;
          }
          parent = parent.parentElement;
        }
        if (parent !== null) {
          textNodes.push(node);
        }
      }
    }

    textNodes.forEach(textNode => {
      const parent = textNode.parentNode;
      if (!parent) return;

      const text = textNode.textContent || '';
      const parts = text.split(searchRegex);
      const matches = text.match(searchRegex) || [];

      if (matches.length > 0) {
        const fragment = document.createDocumentFragment();
        let matchIndex = 0;

        parts.forEach((part, index) => {
          if (part) {
            fragment.appendChild(document.createTextNode(part));
          }
          if (index < parts.length - 1 && matches[matchIndex]) {
            const highlight = document.createElement('mark');
            highlight.className = findState.highlightClass;
            highlight.textContent = matches[matchIndex];
            highlight.style.backgroundColor = '#ffeb3b';
            highlight.style.color = '#000';
            highlight.style.padding = '2px 0';
            fragment.appendChild(highlight);
            findState.matches.push(highlight);
            matchIndex++;
          }
        });

        parent.replaceChild(fragment, textNode);
      }
    });

    if (findState.matches.length > 0) {
      findState.currentIndex = 0;
      scrollToMatch(0);
    }
    
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        name: 'FIND_IN_PAGE_COUNT',
        count: findState.matches.length,
        current: findState.matches.length > 0 ? 1 : 0
      }));
    }
  }

  function scrollToMatch(index) {
    if (index < 0 || index >= findState.matches.length) {
      return;
    }

    // Remove active class from all matches
    findState.matches.forEach(match => {
      match.classList.remove(findState.activeClass);
      match.style.backgroundColor = '#ffeb3b';
    });

    // Add active class to current match
    const currentMatch = findState.matches[index];
    if (currentMatch) {
      currentMatch.classList.add(findState.activeClass);
      currentMatch.style.backgroundColor = '#ff9800';
      currentMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
      findState.currentIndex = index;
      
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          name: 'FIND_IN_PAGE_COUNT',
          count: findState.matches.length,
          current: index + 1
        }));
      }
    }
  }

  function findNext() {
    if (findState.matches.length === 0) return;
    const nextIndex = (findState.currentIndex + 1) % findState.matches.length;
    scrollToMatch(nextIndex);
  }

  function findPrevious() {
    if (findState.matches.length === 0) return;
    const prevIndex = findState.currentIndex <= 0 
      ? findState.matches.length - 1 
      : findState.currentIndex - 1;
    scrollToMatch(prevIndex);
  }

  // Expose functions globally
  window._keychainFindInPage.highlightMatches = highlightMatches;
  window._keychainFindInPage.findNext = findNext;
  window._keychainFindInPage.findPrevious = findPrevious;
  window._keychainFindInPage.removeHighlights = removeHighlights;

  // Execute search
  highlightMatches('${escapedText}');

  true;
})();
`;
};

export const FIND_IN_PAGE_NEXT = `
(function() {
  if (window._keychainFindInPage && window._keychainFindInPage.findNext) {
    window._keychainFindInPage.findNext();
  }
  true;
})();
`;

export const FIND_IN_PAGE_PREVIOUS = `
(function() {
  if (window._keychainFindInPage && window._keychainFindInPage.findPrevious) {
    window._keychainFindInPage.findPrevious();
  }
  true;
})();
`;

export const FIND_IN_PAGE_CLEAR = `
(function() {
  if (window._keychainFindInPage && window._keychainFindInPage.removeHighlights) {
    window._keychainFindInPage.removeHighlights();
  }
  true;
})();
`;

// Script to handle SPA navigation by hooking into history API
export const FIND_IN_PAGE_SPA_CLEANUP = `
(function() {
  function clearFindInPage() {
    if (window._keychainFindInPage && window._keychainFindInPage.removeHighlights) {
      window._keychainFindInPage.removeHighlights();
    }
    // Notify React Native that navigation occurred
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        name: 'FIND_IN_PAGE_NAVIGATION'
      }));
    }
  }
  
  // Clear Find in Page on initial load
  clearFindInPage();
  
  // Hook into history API to detect SPA navigation
  if (typeof window !== 'undefined' && window.history) {
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    
    window.history.pushState = function() {
      clearFindInPage();
      return originalPushState.apply(window.history, arguments);
    };
    
    window.history.replaceState = function() {
      clearFindInPage();
      return originalReplaceState.apply(window.history, arguments);
    };
    
    // Listen to popstate events (back/forward navigation)
    window.addEventListener('popstate', function() {
      clearFindInPage();
    });
  }
  
  true;
})();
`;
