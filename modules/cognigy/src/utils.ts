export const convertStructuredContentToWebchat = (input => {
	switch (input.type) {
		case 'quick_replies':
			return {
				message: {
					text: input.text,
					quick_replies: createQuickReplies(input.quickReplies)
				}
			};

		case 'image':
			return {
				message: {
					attachment: {
						type: 'image',
						payload: {
							url: input.imageUrl
						}
					}
				}
			};

		case 'video':
			return {
				message: {
					attachment: {
						type: 'video',
						payload: {
							url: input.videoUrl
						}
					}
				}
			};

		case 'audio':
			return {
				message: {
					attachment: {
						type: 'audio',
						payload: {
							url: input.audioUrl
						}
					}
				}
			};

		case 'list':
			return {
				message: {
					attachment: {
						type: 'template',
						payload: {
							template_type: 'list',
							elements: createListElements(input.items),
							buttons: createButtons([input.button]),
							top_element_style: 'large'
						}
					}
				}
			};

		case 'carousel':
			return {
				message: {
					attachment: {
						type: 'template',
						payload: {
							template_type: 'generic',
							elements: createListElements(input.items)
						}
					}
				}
			};

		case 'buttons':
			return {
				message: {
					attachment: {
						type: 'template',
						payload: {
							text: input.text,
							template_type: 'button',
							buttons: createButtons(input.buttons)
						}
					}
				}
			};

		case 'text':
			return {
				message: {
					text: input.text
				}
			};
	}
});


/**
 * Helper functions
 */
const createQuickReplies = (quickReplies) => {
	const webchatQuickReplies = [];

	for (let qr of quickReplies) {
		webchatQuickReplies.push(
			{
				content_type: 'text',
				image_url: qr.imageUrl,
				payload: qr.payload,
				title: qr.title
			}
		);
	}

	return webchatQuickReplies;
};

const createListElements = (items) => {
	const webchatListElements = [];

	for (const item of items) {
		webchatListElements.push(
			{
				title: item.title,
				subtitle: item.subtitle,
				image_url: item.imageUrl,
				buttons: createButtons(item.buttons),
			}
		);
	}

	return webchatListElements;
};

const createButtons = (buttons) => {
	const webchatButtons = [];

	for (const button of buttons) {
		switch (button.type) {
			case 'web_url':
				webchatButtons.push(
					{
						type: 'web_url',
						title: button.title,
						url: button.url,
						messenger_extensions: false,
						webview_height_ratio: 'full',
					}
				);
				break;

			case 'postback':
				webchatButtons.push(
					{
						type: 'postback',
						payload: button.payload,
						title: button.title,
						url: '',
						webview_height_ratio: 'full',
						messenger_extensions: false
					}
				);
				break;

			case 'phone_number':
				webchatButtons.push(
					{
						title: button.title,
						type: 'phone_number',
						payload: button.payload,
					}
				);
				break;
		}
	}

	return webchatButtons;
};
