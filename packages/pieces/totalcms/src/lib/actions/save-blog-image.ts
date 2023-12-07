import { createAction, Property } from "@activepieces/pieces-framework";
import { saveBlogImage } from "../api";
import { cmsAuth } from "../auth";

export const saveBlogImageAction = createAction({
	name        : 'saveBlogImage',
	auth        : cmsAuth,
	displayName : 'Save Blog Post Image',
	description : 'Save image to Total CMS blog post',
	props       : {
		slug: Property.ShortText({
			displayName : 'CMS ID',
			description : 'The CMS ID of the content to save',
			required    : true,
		}),
		permalink: Property.ShortText({
			displayName : 'Permalink',
			description : 'The permalink of the blog post to save',
			required    : true,
		}),
		image: Property.File({
			displayName : 'Image',
			description : 'The image to save',
			required    : true,
		}),
		alt: Property.ShortText({
			displayName : 'Alt Text',
			description : 'The alt text for the image',
			required    : true,
		}),
	},
	async run(context) {
		const slug = context.propsValue.slug;
		const image = {
			filename : context.propsValue.image.filename,
			base64   : context.propsValue.image.base64,
		}
		return await saveBlogImage(context.auth, slug, image, {
			alt       : context.propsValue.alt,
			permalink : context.propsValue.permalink,
		});
	},
});


