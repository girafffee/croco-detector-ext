chrome.runtime.onMessage.addListener((msg, sender) => {
    // First, validate the message's structure.
    if ((msg.from === 'content') && (msg.subject === 'showPageAction')) {
      // Enable the page-action for the requesting tab.
      	chrome.runtime.sendMessage({
        	from: 'background',
			subject: 'test',
        	data: sender.tab.id
      	});
    }
  });
