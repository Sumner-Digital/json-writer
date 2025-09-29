import { useEffect } from 'react';

const IframeResizer = () => {
  useEffect(() => {
    // Function to send height to parent window
    const sendHeight = () => {
      const height = document.documentElement.scrollHeight;
      // Send message to parent window
      if (window.parent !== window) {
        window.parent.postMessage(
          {
            type: 'resize-iframe',
            height: height
          },
          '*' // In production, you might want to specify the exact domain for security
        );
      }
    };

    // Send height on load
    sendHeight();

    // Send height on window resize
    window.addEventListener('resize', sendHeight);

    // Watch for content changes using MutationObserver
    const observer = new MutationObserver(() => {
      sendHeight();
    });

    // Start observing the document body for changes
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true
    });

    // Send height periodically as backup (every 500ms)
    const interval = setInterval(sendHeight, 500);

    // Cleanup
    return () => {
      window.removeEventListener('resize', sendHeight);
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default IframeResizer;