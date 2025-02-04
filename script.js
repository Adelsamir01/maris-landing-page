document.addEventListener('DOMContentLoaded', () => {
    const joinButton = document.getElementById('joinButton');
    
    joinButton.addEventListener('click', () => {
        // Track button click
        gtag('event', 'click', {
            'event_category': 'engagement',
            'event_label': 'join_button'
        });

        // Detect mobile device
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (!isMobile) {
            // Track non-mobile attempts
            gtag('event', 'access_attempt', {
                'event_category': 'device_type',
                'event_label': 'desktop'
            });
            alert('من فضلك استخدم الموبايل عشان تقدر تنضم معانا');
            return;
        }
        
        // Detect iOS vs Android
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        
        // Track device type for successful attempts
        gtag('event', 'access_success', {
            'event_category': 'device_type',
            'event_label': isIOS ? 'ios' : 'android'
        });
        
        // Replace these URLs with your actual Telegram group links
        const iosGroupLink = 'https://t.me/+gRN1Vcmbr0tiZTU0';
        const androidGroupLink = 'https://t.me/+f1_PxBSvRMZiMzE0';
        
        // Track telegram redirect
        gtag('event', 'telegram_redirect', {
            'event_category': 'conversion',
            'event_label': isIOS ? 'ios_group' : 'android_group'
        });
        
        // Redirect based on device type
        window.location.href = isIOS ? iosGroupLink : androidGroupLink;
    });
}); 