(function () {
    let wp_ver = document.querySelector('meta[name="generator"]');
    if ( ! wp_ver ) {
        return false;
    }
    console.log(chrome.extension.getBackgroundPage());
})()


