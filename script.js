document.addEventListener('DOMContentLoaded', () => {
    const joinButton = document.getElementById('joinButton');
    
    joinButton.addEventListener('click', () => {
        // Detect mobile device
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (!isMobile) {
            alert('من فضلك استخدم هاتفك المحمول للانضمام');
            return;
        }
        
        // Detect iOS vs Android
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        
        // Replace these URLs with your actual Telegram group links
        const iosGroupLink = 'https://t.me/+gRN1Vcmbr0tiZTU0';
        const androidGroupLink = 'https://t.me/+f1_PxBSvRMZiMzE0';
        
        // Redirect based on device type
        window.location.href = isIOS ? iosGroupLink : androidGroupLink;
    });
}); 