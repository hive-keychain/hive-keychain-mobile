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
        textNodes.push(node);
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
