(function() {
    // 1. Identify where this script is loaded from to know the host URL
    var currentScript = document.currentScript;
    if (!currentScript) {
        console.error("Nexio: Cannot determine script origin.");
        return;
    }

    var scriptUrl = new URL(currentScript.src);
    var baseUrl = scriptUrl.origin;
    var publicKey = scriptUrl.searchParams.get('key');

    // Or check window.nexioConfig as a fallback
    if (!publicKey && window.nexioConfig && window.nexioConfig.key) {
        publicKey = window.nexioConfig.key;
    }

    if (!publicKey) {
        console.error("Nexio: Public key is missing. Please provide '?key=...' in the script src.");
        return;
    }

    // 2. Create the iFrame container
    var iframe = document.createElement('iframe');
    iframe.src = baseUrl + '/widget/' + publicKey + '?origin=' + encodeURIComponent(window.location.origin);
    
    // Style it to float at the bottom right. We will let the React widget inside the iframe expand/collapse.
    // At rest, it will be just a small pill. Expanded, it will be a chat box.
    // We will make the iframe large enough to host the chat box, but the React app will have a transparent background.
    // Wait, if it has a transparent background, the iframe will block clicks underneath it if it's too large.
    // To solve this, we can set iframe's initial size small, and listen to postMessage from the iframe to resize it dynamically!

    iframe.style.position = 'fixed';
    iframe.style.bottom = '20px';
    iframe.style.right = '20px';
    iframe.style.width = '350px';
    iframe.style.height = '100px'; // Initial resting state (just the pill)
    iframe.style.border = 'none';
    iframe.style.zIndex = '2147483647';
    iframe.style.background = 'transparent';
    iframe.style.colorScheme = 'normal';
    iframe.style.borderRadius = '32px';
    iframe.style.transition = 'height 0.3s cubic-bezier(0.16, 1, 0.3, 1), width 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
    iframe.title = "Nexio Chat Widget";

    document.body.appendChild(iframe);

    // 3. Listen for resize events from the React Widget
    window.addEventListener('message', function(event) {
        // Only trust messages from our baseUrl
        if (event.origin !== baseUrl) return;

        try {
            var data = JSON.parse(event.data);
            if (data.type === 'NEXIO_WIDGET_RESIZE') {
                iframe.style.height = data.height + 'px';
                iframe.style.width = data.width + 'px';
                
                // If expanded, drop the border radius slightly for a standard chatbox look, otherwise pill shape
                if (data.expanded) {
                    iframe.style.borderRadius = '24px';
                } else {
                    iframe.style.borderRadius = '32px';
                }
            }
        } catch {
            // Ignore non-json messages
        }
    });

})();
