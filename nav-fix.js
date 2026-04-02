/**
 * ============================================================
 *  NAV-FIX.JS — Smart Navigation Stack for Mobile eCommerce
 *  Drop this AFTER all other scripts (final-system.js etc.)
 * ============================================================
 *
 *  SOLVES:
 *    PDP → Back → goes to Categories ❌
 *  FIXES TO:
 *    PDP  → Back → same Shop (subcategory)  ✅
 *    Shop → Back → Categories               ✅
 *
 *  COMPATIBLE WITH:
 *    - Existing navigate() / _navigateCore() system
 *    - final-system.js patches (_pdpGoBack, _pdpReturnState,
 *      _pdpBackTo, _v7SmartBackDone, _v7GenderHooked, etc.)
 *    - openSubcatProducts() gender-filter hook
 *    - openProductPage() YMLA / COD hook
 *
 *  DOES NOT:
 *    - Re-wrap already wrapped functions (guard flags used)
 *    - Duplicate event listeners
 *    - Break existing admin/auth patches
 *
 *  NEW GLOBALS EXPOSED:
 *    window.NavStack            — singleton stack manager
 *    window.openSubcategory()   — open subcat + push state
 *    window.openProduct()       — open PDP + push state
 *    window.handleBackFromPDP() — back: PDP → Shop (same subcat)
 *    window.handleBackFromShop()— back: Shop → Categories
 *    window.goBack()            — universal back (checks stack)
 * ============================================================
 */

(function () {
  'use strict';

  /* ── Guard: only init once ── */
  if (window._navFixDone) return;
  window._navFixDone = true;

  /* ============================================================
     1.  NAV STACK
     A lightweight array-based stack that mirrors mobile back-stack.
     Each entry: { view, cat, sub, scrollY, meta }
  ============================================================ */
  const NavStack = (function () {
    const STORAGE_KEY = 'ok_nav_stack';
    let _stack = [];

    /** Persist current stack to sessionStorage (survives soft reloads) */
    function _save() {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(_stack.slice(-10)));
      } catch (_) {}
    }

    /** Restore stack from sessionStorage on page load */
    function _restore() {
      try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (raw) _stack = JSON.parse(raw);
      } catch (_) {
        _stack = [];
      }
    }

    _restore();

    return {
      /**
       * Push a new entry onto the stack.
       * @param {Object} entry { view, cat, sub, scrollY, meta }
       */
      push(entry) {
        _stack.push({
          view:    entry.view    || 'home',
          cat:     entry.cat    || null,
          sub:     entry.sub    || null,
          scrollY: entry.scrollY != null ? entry.scrollY : 0,
          meta:    entry.meta   || {},
        });
        _save();
      },

      /** Pop and return the top entry (current page). */
      pop() {
        const e = _stack.pop();
        _save();
        return e || null;
      },

      /** Peek at top without removing. */
      peek() {
        return _stack.length ? _stack[_stack.length - 1] : null;
      },

      /** Peek at the entry BELOW the top (the "previous" page). */
      peekPrev() {
        return _stack.length >= 2 ? _stack[_stack.length - 2] : null;
      },

      /** Number of entries on stack. */
      get size() { return _stack.length; },

      /** Reset the stack (e.g. on home navigate). */
      clear() { _stack = []; _save(); },

      /** Replace top entry (e.g. update scrollY without pushing new entry). */
      replaceTop(entry) {
        if (!_stack.length) { this.push(entry); return; }
        Object.assign(_stack[_stack.length - 1], entry);
        _save();
      },

      /** Debug helper */
      dump() { return JSON.parse(JSON.stringify(_stack)); },
    };
  })();

  /* Expose globally */
  window.NavStack = NavStack;


  /* ============================================================
     2.  SCROLL POSITION HELPERS
  ============================================================ */

  /** Save current scroll position into the top stack entry. */
  function _saveScrollTop() {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    NavStack.replaceTop({ scrollY: y });
  }

  /** Restore scroll position from a stack entry after a short delay. */
  function _restoreScroll(entry, delay = 150) {
    if (!entry) return;
    setTimeout(() => {
      window.scrollTo({ top: entry.scrollY || 0, behavior: 'instant' });
    }, delay);
  }


  /* ============================================================
     3.  STATE SYNC HELPERS
     These read existing state variables set by final-system.js
     and also keep them in sync with NavStack.
  ============================================================ */

  /** Read "current shop state" from all known variables. */
  function _currentShopState() {
    return {
      cat: window._currentCatFilter
        || window.currentCategoryFilter
        || window.lastSubCatCat
        || null,
      sub: window._currentSubFilter
        || window.currentSubFilter
        || window.lastSubCat
        || null,
    };
  }

  /** Sync legacy variables from a stack entry. */
  function _syncLegacyState(entry) {
    if (!entry) return;
    if (entry.cat != null) {
      window.currentCategoryFilter  = entry.cat;
      window._currentCatFilter      = entry.cat;
      window.lastSubCatCat          = entry.cat;
    }
    if (entry.sub != null) {
      window.currentSubFilter       = entry.sub;
      window._currentSubFilter      = entry.sub;
      window.lastSubCat             = entry.sub;
    }
    /* Also keep _pdpReturnState in sync so existing _pdpGoBack works */
    window._pdpReturnState = {
      view:  entry.view || 'home',
      cat:   entry.cat  || null,
      sub:   entry.sub  || null,
    };
    window._pdpBackTo = {
      view:   entry.view   || 'home',
      cat:    entry.cat    || null,
      sub:    entry.sub    || null,
      subCat: entry.cat    || null,
    };
  }


  /* ============================================================
     4.  PUBLIC API FUNCTIONS
  ============================================================ */

  /**
   * openSubcategory(category, subcategory)
   * Use instead of bare openSubcatProducts() when you want the
   * navigation stack to track the entry.
   *
   * @param {string} category   e.g. "Women"
   * @param {string} subcategory e.g. "Kurtis"
   */
  window.openSubcategory = function (category, subcategory) {
    /* Save scroll of whatever page we're leaving */
    _saveScrollTop();

    /* Push current view so Shop→Back can return here */
    const prevView = window.currentView || 'home';
    if (prevView !== 'shop') {
      NavStack.push({ view: prevView, cat: null, sub: null, scrollY: window.scrollY || 0 });
    }

    /* Push the shop entry we're entering */
    NavStack.push({ view: 'shop', cat: category, sub: subcategory, scrollY: 0 });

    /* Update all legacy state vars */
    window.lastSubCat              = subcategory;
    window.lastSubCatCat           = category;
    window._currentCatFilter       = category;
    window._currentSubFilter       = subcategory;
    window.currentCategoryFilter   = category;
    window.currentSubFilter        = subcategory;

    /* Call the real function */
    if (typeof window.openSubcatProducts === 'function') {
      window.openSubcatProducts(category, subcategory);
    } else {
      console.warn('[NavFix] openSubcatProducts not found yet, retrying...');
      const iv = setInterval(() => {
        if (typeof window.openSubcatProducts === 'function') {
          clearInterval(iv);
          window.openSubcatProducts(category, subcategory);
        }
      }, 200);
    }
  };


  /**
   * openProduct(productId, isGold?)
   * Use instead of bare openProductPage() to track PDP entry.
   *
   * @param {number|string} productId
   * @param {boolean}       isGold
   */
  window.openProduct = function (productId, isGold) {
    /* Save scroll of current shop page */
    _saveScrollTop();

    const shopState = _currentShopState();
    const currentView = window.currentView || 'home';

    /* Push current state so PDP→Back can return here */
    NavStack.push({
      view:    currentView,
      cat:     shopState.cat,
      sub:     shopState.sub,
      scrollY: window.scrollY || 0,
    });

    /* Also sync legacy vars used by existing back handlers */
    window._pdpReturnState = {
      view: currentView,
      cat:  shopState.cat,
      sub:  shopState.sub,
    };
    window._pdpBackTo = {
      view:   currentView,
      cat:    shopState.cat,
      sub:    shopState.sub,
      subCat: shopState.cat,
    };
    window._pdpPreviousView = currentView;

    /* Call the real function */
    if (typeof window.openProductPage === 'function') {
      window.openProductPage(productId, isGold);
    } else if (typeof window.navigate === 'function') {
      window.navigate('product', productId);
    }
  };


  /**
   * handleBackFromPDP()
   * Back button pressed on Product Detail Page.
   * Returns to the SAME shop/subcategory the user came from,
   * with scroll position restored.
   */
  window.handleBackFromPDP = function () {
    /* Remove the PDP entry (current top) if it's on the stack */
    const top = NavStack.peek();
    if (top && top.view === 'product') NavStack.pop();

    /* Now the previous entry is where we should go */
    const prev = NavStack.peek();

    if (!prev) {
      /* Empty stack fallback */
      if (typeof window.navigate === 'function') window.navigate('home');
      return;
    }

    if (prev.view === 'shop' && (prev.cat || prev.sub)) {
      /* Return to the exact subcategory */
      _syncLegacyState(prev);
      if (typeof window.openSubcatProducts === 'function') {
        /* Show shop view first, then re-render products */
        document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
        const shopEl = document.getElementById('view-shop');
        if (shopEl) shopEl.classList.remove('hidden');
        window.currentView = 'shop';

        if (typeof window.updateBottomNav === 'function') window.updateBottomNav();

        /* Re-open subcategory */
        window.openSubcatProducts(prev.cat, prev.sub);

        /* Restore scroll after render */
        _restoreScroll(prev, 300);
      } else {
        /* Fallback: just navigate to shop */
        if (typeof window.navigate === 'function') window.navigate('shop');
      }
      return;
    }

    if (prev.view === 'electronics') {
      if (typeof window._openElectronics === 'function') {
        window._openElectronics();
      } else if (typeof window.navigate === 'function') {
        window.navigate('electronics');
      }
      _restoreScroll(prev, 200);
      return;
    }

    if (prev.view === 'categories') {
      if (typeof window._openCategories === 'function') {
        window._openCategories();
      } else if (typeof window.navigate === 'function') {
        window.navigate('shop'); /* categories opens as overlay */
      }
      _restoreScroll(prev, 200);
      return;
    }

    /* Generic fallback: navigate to whatever view */
    if (typeof window.navigate === 'function') {
      window.navigate(prev.view || 'home');
    }
    _restoreScroll(prev, 200);
  };


  /**
   * handleBackFromShop()
   * Back button pressed on Shop/Subcategory product list.
   * Returns to Categories (or wherever the user came from).
   */
  window.handleBackFromShop = function () {
    /* Remove the shop entry */
    const top = NavStack.peek();
    if (top && top.view === 'shop') NavStack.pop();

    const prev = NavStack.peek();

    if (!prev || prev.view === 'home') {
      if (typeof window.navigate === 'function') window.navigate('home');
      return;
    }

    if (prev.view === 'categories') {
      if (typeof window._openCategories === 'function') {
        window._openCategories();
      } else if (typeof window.navigate === 'function') {
        window.navigate('shop');
      }
      _restoreScroll(prev, 200);
      return;
    }

    if (typeof window.navigate === 'function') {
      window.navigate(prev.view || 'home');
    }
    _restoreScroll(prev, 200);
  };


  /**
   * goBack()
   * Universal back function — detects current view and delegates.
   * Wire this to your Android hardware back button if needed.
   */
  window.goBack = function () {
    const currentView = window.currentView || 'home';

    if (currentView === 'product') {
      window.handleBackFromPDP();
      return;
    }

    if (currentView === 'shop') {
      window.handleBackFromShop();
      return;
    }

    /* For all other views: pop stack and go to prev */
    const top = NavStack.peek();
    if (top && top.view === currentView) NavStack.pop();

    const prev = NavStack.peek();
    if (prev && prev.view && prev.view !== currentView) {
      if (typeof window.navigate === 'function') window.navigate(prev.view);
    } else {
      if (typeof window.navigate === 'function') window.navigate('home');
    }
  };


  /* ============================================================
     5.  HOOK navigate() — track view changes into NavStack
         Guards prevent double-wrapping.
  ============================================================ */
  function _hookNavigate() {
    if (window._navFixNavHooked) return;
    if (typeof window.navigate !== 'function') return;
    window._navFixNavHooked = true;

    const _orig = window.navigate;
    window.navigate = function (view, ...args) {
      const prev = window.currentView || 'home';

      /* When navigating home: clear stack */
      if (view === 'home') {
        NavStack.clear();
        NavStack.push({ view: 'home', scrollY: 0 });
      }

      /* When opening a product: save state */
      if (view === 'product') {
        _saveScrollTop();
        const shopState = _currentShopState();
        NavStack.push({
          view:    prev,
          cat:     shopState.cat,
          sub:     shopState.sub,
          scrollY: window.scrollY || 0,
        });
        /* Also set legacy vars */
        window._pdpPreviousView = prev;
        window._pdpReturnState  = { view: prev, cat: shopState.cat, sub: shopState.sub };
        window._pdpBackTo       = { view: prev, cat: shopState.cat, sub: shopState.sub, subCat: shopState.cat };
      }

      /* When navigating to shop (without subcat) */
      if (view === 'shop' && prev !== 'shop') {
        _saveScrollTop();
        if (!NavStack.peek() || NavStack.peek().view !== 'shop') {
          NavStack.push({ view: 'shop', cat: null, sub: null, scrollY: 0 });
        }
      }

      /* When navigating away from shop (not to product): pop shop entry */
      if (prev === 'shop' && view !== 'product' && view !== 'shop') {
        const top = NavStack.peek();
        if (top && top.view === 'shop') NavStack.pop();
      }

      return _orig(view, ...args);
    };
  }


  /* ============================================================
     6.  HOOK openSubcatProducts() — push subcat to NavStack
         (runs AFTER _v7GenderHooked so we wrap the already-wrapped fn)
  ============================================================ */
  function _hookSubcat() {
    if (window._navFixSubcatHooked) return;
    if (typeof window.openSubcatProducts !== 'function') return;
    window._navFixSubcatHooked = true;

    const _origSub = window.openSubcatProducts;
    window.openSubcatProducts = function (cat, sub) {
      const prev = window.currentView || 'home';

      /* Save scroll of current page */
      _saveScrollTop();

      /* Push previous page entry (so Shop→Back can go back) */
      if (prev !== 'shop') {
        const topView = NavStack.peek() ? NavStack.peek().view : null;
        if (topView !== prev) {
          NavStack.push({ view: prev, cat: null, sub: null, scrollY: window.scrollY || 0 });
        }
      }

      /* Push/update shop entry */
      const topOfStack = NavStack.peek();
      if (topOfStack && topOfStack.view === 'shop') {
        /* Update existing shop entry with new cat/sub */
        NavStack.replaceTop({ view: 'shop', cat: cat || null, sub: sub || null, scrollY: 0 });
      } else {
        NavStack.push({ view: 'shop', cat: cat || null, sub: sub || null, scrollY: 0 });
      }

      /* Call original */
      return _origSub(cat, sub);
    };
  }


  /* ============================================================
     7.  HOOK openProductPage() — push PDP to NavStack
         (runs AFTER _v7PDPHooked)
  ============================================================ */
  function _hookPDP() {
    if (window._navFixPDPHooked) return;
    if (typeof window.openProductPage !== 'function') return;
    window._navFixPDPHooked = true;

    const _origPP = window.openProductPage;
    window.openProductPage = async function (id, isGold) {
      const shopState  = _currentShopState();
      const currentView = window.currentView || 'home';

      /* Save current scroll before leaving */
      _saveScrollTop();

      /* Update top entry with latest scrollY, then push product entry */
      NavStack.replaceTop({ scrollY: window.scrollY || 0 });
      NavStack.push({ view: 'product', cat: shopState.cat, sub: shopState.sub, scrollY: 0, meta: { id, isGold } });

      /* Sync all legacy state vars */
      window._pdpPreviousView = currentView;
      window._pdpReturnState  = { view: currentView, cat: shopState.cat, sub: shopState.sub };
      window._pdpBackTo       = { view: currentView, cat: shopState.cat, sub: shopState.sub, subCat: shopState.cat };

      return _origPP(id, isGold);
    };
  }


  /* ============================================================
     8.  PATCH THE EXISTING HTML BACK BUTTON IN PDP
         index.html has:
           <button onclick="navigate(window._pdpPreviousView||'home')">Back</button>
         We upgrade it to use handleBackFromPDP() instead.
  ============================================================ */
  function _patchHTMLBackBtn() {
    /* Patch static HTML back button */
    const productView = document.getElementById('view-product');
    if (!productView) return;

    /* Find the button by its onclick pattern */
    const btns = productView.querySelectorAll('button');
    btns.forEach(btn => {
      const oc = btn.getAttribute('onclick') || '';
      if (
        oc.includes('_pdpPreviousView') ||
        oc.includes("navigate('home')") ||
        oc.includes("navigate('shop')")
      ) {
        if (btn.dataset.navFixPatched) return; /* Don't double-patch */
        btn.dataset.navFixPatched = '1';
        btn.removeAttribute('onclick');
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          window.handleBackFromPDP();
        });
      }
    });

    /* Also patch the ok-pdp-back-btn injected by final-system.js */
    const injectedBtn = document.getElementById('ok-pdp-back-btn');
    if (injectedBtn && !injectedBtn.dataset.navFixPatched) {
      injectedBtn.dataset.navFixPatched = '1';
      injectedBtn.removeAttribute('onclick');
      injectedBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        window.handleBackFromPDP();
      });
    }
  }

  /* Watch for PDP becoming visible and re-patch back buttons */
  function _watchPDPVisibility() {
    const observer = new MutationObserver(() => {
      const pdp = document.getElementById('view-product');
      if (!pdp) return;
      const isVisible =
        !pdp.classList.contains('hidden') &&
        pdp.style.display !== 'none';
      if (isVisible) {
        setTimeout(_patchHTMLBackBtn, 200);
        setTimeout(_patchHTMLBackBtn, 600); /* 2nd pass for dynamic inject */
      }
    });
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    });
  }


  /* ============================================================
     9.  _pdpGoBack OVERRIDE
         final-system.js defines window._pdpGoBack.
         We override it so it uses our handleBackFromPDP().
         This fixes the case where final-system.js injects
         ok-pdp-back-btn with onclick="_pdpGoBack()"
  ============================================================ */
  function _overridePdpGoBack() {
    window._pdpGoBack = function () {
      window.handleBackFromPDP();
    };
    /* Also override _pdpSmartBack if it exists */
    window._pdpSmartBack = function () {
      window.handleBackFromPDP();
    };
  }


  /* ============================================================
     10.  INIT — wait for navigate + openSubcatProducts to be ready
  ============================================================ */
  function _init() {
    _hookNavigate();
    _hookSubcat();
    _hookPDP();
    _overridePdpGoBack();
    _watchPDPVisibility();
    _patchHTMLBackBtn(); /* patch any already-visible back buttons */

    /* Initialize stack with home if empty */
    if (NavStack.size === 0) {
      NavStack.push({ view: 'home', scrollY: 0 });
    }

    console.log(
      '%c✅ NavFix: Stack-based navigation active — PDP→Back→Shop✅ Shop→Back→Categories✅',
      'background:#0f172a;color:#34d399;font-weight:900;font-size:11px;padding:4px 12px;border-radius:6px;'
    );
  }

  /* Poll until navigate() is available (it's set up dynamically) */
  function _waitAndInit() {
    if (typeof window.navigate === 'function') {
      /* Wait extra 300ms so all final-system.js patches apply first */
      setTimeout(_init, 300);
    } else {
      const iv = setInterval(() => {
        if (typeof window.navigate === 'function') {
          clearInterval(iv);
          setTimeout(_init, 300);
        }
      }, 150);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _waitAndInit);
  } else {
    _waitAndInit();
  }

  /* ============================================================
     11.  EDGE CASES
  ============================================================ */

  /* 11a. Direct PDP open (e.g. shared link or page refresh on PDP)
     If page loads directly on view-product with no stack history,
     build a synthetic fallback state. */
  window.addEventListener('load', () => {
    setTimeout(() => {
      const curView = window.currentView || '';
      if (curView === 'product' && NavStack.size <= 1) {
        /* Push a "shop" fallback so Back goes somewhere sensible */
        const shopState = _currentShopState();
        if (shopState.cat || shopState.sub) {
          NavStack.push({ view: 'shop', cat: shopState.cat, sub: shopState.sub, scrollY: 0 });
        } else {
          NavStack.push({ view: 'home', scrollY: 0 });
        }
        NavStack.push({ view: 'product', scrollY: 0 });
      }
    }, 1200);
  });

  /* 11b. Hardware/browser back button (Android PWA / browser) */
  window.addEventListener('popstate', (e) => {
    e.preventDefault();
    window.goBack();
  });

  /* 11c. Re-hook after openSubcatProducts is defined late */
  const _subcatPoller = setInterval(() => {
    if (typeof window.openSubcatProducts === 'function') {
      clearInterval(_subcatPoller);
      _hookSubcat();
    }
  }, 300);

  /* 11d. Re-hook after openProductPage is defined late */
  const _pdpPoller = setInterval(() => {
    if (typeof window.openProductPage === 'function') {
      clearInterval(_pdpPoller);
      _hookPDP();
      _overridePdpGoBack();
    }
  }, 300);

})();
