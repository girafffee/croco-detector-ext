
document.addEventListener("DOMContentLoaded", function(event) {
    const script = document.createElement('script');
    script.setAttribute("type", "module");
    script.setAttribute("src", chrome.extension.getURL('content/detector.js'));
    console.log(chrome.extension.getURL('content/detector.js'));

    document.querySelector('body').appendChild(script);
});


