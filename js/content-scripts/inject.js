(() => {
    console.log("It's works!");
    if ( typeof JetSmartFilterSettings !== "undefinded" )
        console.log( JetSmartFilterSettings );
    
    if ( typeof jetReviewPublicConfig !== "undefinded" )
        console.log( jetReviewPublicConfig );

    console.log(document.querySelectorAll('script[src*="jet-popup"]'));
})();