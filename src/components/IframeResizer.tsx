import { useEffect } from 'react';

const IframeResizer = () => {
  useEffect(() => {
    let lastHeight = 0;
    
    // Function to send height to parent window
    const sendHeight = () => {
      // Get the actual content height (not infinite scrollHeight)
      const body = document.body;
      const html = document.documentElement;
      
      // Get the actual rendered height
      const height = Math.max(
        body.offsetHeight,
        body.scrollHeight,
        html.clientHeight,
        html.offsetHeight
      );
      
      // Only send if height changed and is reasonable
      if (window.parent !== window && height !== lastHeight && height > 0 && height < 6000) {
        lastHeight = height;
        window.parent.postMessage(
          {
            type: 'resize-iframe',
            height: height
          },
          '*'
        );
      }
    };

    // Send height after content loads
    setTimeout(sendHeight, 100);
    
    // Send height on window resize
    window.addEventListener('resize', sendHeight);
    
    // Watch for form changes (but not too often)
    let resizeTimeout: NodeJS.Timeout;
    const observer = new MutationObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(sendHeight, 200);
    });

    // Observe the body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });

    // Cleanup
    return () => {
      window.removeEventListener('resize', sendHeight);
      observer.disconnect();
      clearTimeout(resizeTimeout);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default IframeResizer;