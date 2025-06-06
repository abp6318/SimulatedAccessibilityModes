function toggleButtonOutlineById(buttonId) {
  const btn = document.getElementById(buttonId);
  if (btn) {
    btn.classList.toggle('active-toggle');
  }
}

async function toggleOverlay(id, styleObj) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (id, styleObj) => {
      let existing = document.getElementById(id);
      if (existing) {
        existing.remove();
      } else {
        const div = document.createElement('div');
        div.id = id;
        Object.entries(styleObj).forEach(([key, value]) => {
          div.style[key] = value;
        });
        document.body.appendChild(div);

        // Force a reflow
        void div.offsetHeight;

        // Re-apply styles to ensure they're rendered
        Object.entries(styleObj).forEach(([key, value]) => {
          div.style[key] = value;
        });
      }
    },
    args: [id, styleObj],
  });
}

document.getElementById('toggleBlur').addEventListener('click', () => {
  toggleOverlay('__a11y-blur-overlay__', {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    zIndex: '999999',
    backdropFilter: 'blur(2.5px)',
    webkitBackdropFilter: 'blur(2.5px)',
  });
  toggleButtonOutlineById('toggleBlur');
});

document.getElementById('toggleTunnelVision').addEventListener('click', () => {
  toggleOverlay('__a11y-tunnel-vision-overlay__', {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    zIndex: '999997',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    maskImage: 'radial-gradient(circle at center, transparent 80px, black 120px)',
    WebkitMaskImage: 'radial-gradient(circle at center, transparent 80px, black 120px)',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskPosition: 'center',
    WebkitMaskPosition: 'center',
    maskSize: 'cover',
    WebkitMaskSize: 'cover',
  });
  toggleButtonOutlineById('toggleTunnelVision');
});

document.getElementById('toggleLowContrast').addEventListener('click', () => {
  toggleOverlay('__a11y-low-contrast-overlay__', {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    zIndex: '999996',
    backdropFilter: 'contrast(40%) brightness(110%)',
    WebkitBackdropFilter: 'contrast(40%) brightness(110%)'
  });
  toggleButtonOutlineById('toggleLowContrast');
});

document.getElementById('toggleKeyboardOnly').addEventListener('click', () => {
  toggleOverlay('__a11y-keyboard-only-overlay__', {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    cursor: 'not-allowed',
    pointerEvents: 'all',
    zIndex: '1000001',
    backgroundColor: 'transparent',
  });
  toggleButtonOutlineById('toggleKeyboardOnly');
});

// document.getElementById('toggleMotionSensitivity').addEventListener('click', () => {
//   toggleOverlay('__a11y-motion-sensitivity-overlay__', {
//     position: 'fixed',
//     top: '0',
//     left: '0',
//     width: '100vw',
//     height: '100vh',
//     zIndex: '999996',
//     pointerEvents: 'none',
//     backgroundColor: 'transparent'
//   });

//   // Also inject a <style> tag into the page to disable motion
//   chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
//     chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       func: () => {
//         const existing = document.getElementById('__a11y-reduce-motion-style__');
//         if (existing) {
//           existing.remove();
//         } else {
//           const style = document.createElement('style');
//           style.id = '__a11y-reduce-motion-style__';
//           style.textContent = `
//             * {
//               animation: none !important;
//               transition: none !important;
//               scroll-behavior: auto !important;
//             }
//           `;
//           document.head.appendChild(style);
//         }
//       }
//     });
//   });
// });

document.getElementById('togglePartialVision').addEventListener('click', () => {
  const overlayId = '__a11y-partial-vision-overlay__';

  chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (id) => {
        const existing = document.getElementById(id);
        if (existing) {
          existing.remove();
          return;
        }

        const overlay = document.createElement('div');
        overlay.id = id;
        overlay.style.position = 'fixed';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '999995';
        overlay.style.background = 'transparent';

        for (let i = 0; i < 6 + Math.random() * 10; i++) {
          const patch = document.createElement('div');
          patch.style.position = 'absolute';
          patch.style.width = `${150 + Math.random() * 60}px`;
          patch.style.height = `${150 + Math.random() * 60}px`;
          patch.style.background = 'black';
          patch.style.borderRadius = '50%';
          patch.style.opacity = '0.9';
          patch.style.left = `${Math.random() * 90}vw`;
          patch.style.top = `${Math.random() * 90}vh`;
          overlay.appendChild(patch);
        }

        document.body.appendChild(overlay);
      },
      args: [overlayId]
    });
  });
  toggleButtonOutlineById('togglePartialVision');
});

// document.getElementById('toggleCognitiveLoad').addEventListener('click', () => {
//   const overlayId = '__a11y-cognitive-load__';

//   chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
//     chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       func: (id) => {
//         const existing = document.getElementById(id);
//         if (existing) {
//           existing.remove();
//           document.getElementById('__a11y-cognitive-style__')?.remove();
//           return;
//         }

//         // Add style override
//         const style = document.createElement('style');
//         style.id = '__a11y-cognitive-style__';
//         style.textContent = `
//           @font-face {
//             font-family: 'OpenDyslexic';
//             src: url('https://cdn.jsdelivr.net/gh/antijingoist/open-dyslexic/alt/OpenDyslexic-Regular.otf') format('opentype');
//           }

//           body, * {
//             font-family: 'OpenDyslexic', Arial, sans-serif !important;
//             letter-spacing: 0.5px !important;
//             line-height: 1.5 !important;
//           }

//           .__a11y-random-blur__ {
//             filter: blur(1.5px);
//             transition: filter 0.5s ease;
//           }
//         `;
//         document.head.appendChild(style);

//         // Overlay + blur effect on random paragraphs
//         const overlay = document.createElement('div');
//         overlay.id = id;
//         overlay.style.position = 'fixed';
//         overlay.style.top = '0';
//         overlay.style.left = '0';
//         overlay.style.width = '100vw';
//         overlay.style.height = '100vh';
//         overlay.style.pointerEvents = 'none';
//         overlay.style.zIndex = '999994';
//         overlay.style.background = 'transparent';

//         const allPs = document.querySelectorAll('div');
//         allPs.forEach(p => {
//           if (Math.random() > 0.5) {
//             p.classList.add('__a11y-random-blur__');
//             setTimeout(() => {
//               p.classList.remove('__a11y-random-blur__');
//             }, 4000 + Math.random() * 2000);
//           }
//         });

//         document.body.appendChild(overlay);
//       },
//       args: [overlayId]
//     });
//   });
// });

document.getElementById('toggleShakyCursor').addEventListener('click', () => {
  const overlayId = '__a11y-shaky-cursor__';

  chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (id) => {
        if (document.getElementById(id)) {
          clearInterval(window.__a11yShakyInterval__);
          document.getElementById(id).remove();
          return;
        }

        const overlay = document.createElement('div');
        overlay.id = id;
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '999993';
        overlay.style.backgroundColor = 'transparent';
        overlay.style.cursor = 'none';
        document.body.appendChild(overlay);

        let cursor = document.createElement('div');
        cursor.style.position = 'fixed';
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.background = 'rgba(0,0,0,0.5)';
        cursor.style.borderRadius = '50%';
        cursor.style.pointerEvents = 'none';
        cursor.style.zIndex = '999994';
        cursor.style.transition = 'top 0.05s, left 0.05s';
        document.body.appendChild(cursor);

        window.__a11yShakyInterval__ = setInterval(() => {
          document.addEventListener('mousemove', (e) => {
            const x = e.clientX + (Math.random() * 25 - 5);
            const y = e.clientY + (Math.random() * 25 - 5);
            cursor.style.left = `${x}px`;
            cursor.style.top = `${y}px`;
          }, { once: true });
        }, 60);
      },
      args: [overlayId]
    });
  });
  toggleButtonOutlineById('toggleShakyCursor');
});

// document.getElementById('colorBlindnessType').addEventListener('change', (event) => {
//   const filterMap = {
//     protanopia: 'url(#protanopia)',
//     deuteranopia: 'url(#deuteranopia)',
//     tritanopia: 'url(#tritanopia)',
//     achromatopsia: 'grayscale(100%)'
//   };

//   const selected = event.target.value;
//   const overlayId = '__a11y-colorblindness-overlay__';

//   chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
//     chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       func: (filterKey, id) => {
//         let overlay = document.getElementById(id);
//         if (overlay) {
//           overlay.remove();
//         }
//         if (!filterKey) return;

//         overlay = document.createElement('div');
//         overlay.id = id;
//         overlay.style.position = 'fixed';
//         overlay.style.top = 0;
//         overlay.style.left = 0;
//         overlay.style.width = '100vw';
//         overlay.style.height = '100vh';
//         overlay.style.pointerEvents = 'none';
//         overlay.style.zIndex = '999999';

//         if (filterKey === 'grayscale(100%)') {
//           overlay.style.backdropFilter = filterKey;
//         } else {
//           // Insert SVG filters into document if not present
//           if (!document.getElementById('a11y-colorblindness-filters')) {
//             const svgNS = 'http://www.w3.org/2000/svg';
//             const svg = document.createElementNS(svgNS, 'svg');
//             svg.setAttribute('style', 'position: absolute; width: 0; height: 0;');
//             svg.id = 'a11y-colorblindness-filters';
//             svg.innerHTML = `
//               <filter id="protanopia" color-interpolation-filters="sRGB">
//                 <feColorMatrix type="matrix" values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0"/>
//               </filter>
//               <filter id="deuteranopia" color-interpolation-filters="sRGB">
//                 <feColorMatrix type="matrix" values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0"/>
//               </filter>
//               <filter id="tritanopia" color-interpolation-filters="sRGB">
//                 <feColorMatrix type="matrix" values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0"/>
//               </filter>
//             `;
//             document.body.appendChild(svg);
//           }
//           overlay.style.filter = filterKey;
//         }

//         document.body.appendChild(overlay);
//       },
//       args: [filterMap[selected], overlayId]
//     });
//   });
// });

document.getElementById('toggleNoVision').addEventListener('click', () => {
  toggleOverlay('__a11y-no-vision-overlay__', {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'black',
    opacity: '1',
    zIndex: '999999',
    pointerEvents: 'none'  // Allows mouse/keyboard events to pass through
  });
  toggleButtonOutlineById('toggleNoVision');
});

let isZoomed = false;

document.getElementById('toggleZoom').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
    const newZoom = isZoomed ? 1.0 : 2.0;

    chrome.tabs.setZoom(tab.id, newZoom, () => {
      if (chrome.runtime.lastError) {
        alert('Zoom could not be changed: ' + chrome.runtime.lastError.message);
      } else {
        isZoomed = !isZoomed;
      }
    });
  });
  toggleButtonOutlineById('toggleZoom');
});


