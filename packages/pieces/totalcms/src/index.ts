
import { createPiece } from "@activepieces/pieces-framework";
import { cmsAuth } from "./lib/auth";

import { getContentAction } from "./lib/actions/get-content";
import { getBlogPostAction } from "./lib/actions/get-blog-post";
import { saveTextAction } from "./lib/actions/save-text";
import { saveDateAction } from "./lib/actions/save-date";
import { saveToggleAction } from "./lib/actions/save-toggle";
import { saveVideoAction } from "./lib/actions/save-video";
import { saveBlogPostAction } from "./lib/actions/save-blog-post";
import { saveImageAction } from "./lib/actions/save-image";
import { saveBlogImageAction } from "./lib/actions/save-blog-image";
import { saveGalleryAction } from "./lib/actions/save-gallery";
import { saveBlogGalleryAction } from "./lib/actions/save-blog-gallery";

import { newBlogPost } from "./lib/triggers/new-blog-post";

export const totalcms = createPiece({
  displayName             : "Totalcms",
  auth                    : cmsAuth,
  minimumSupportedRelease : '0.9.0',
  logoUrl                 : "https://sandbox.joeworkman.net/totalcms.png",
  authors                 : ["joeworkman"],
  actions                 : [
	getContentAction,
	getBlogPostAction,
	saveBlogPostAction,
	saveBlogGalleryAction,
	saveBlogImageAction,
	saveDateAction,
	saveGalleryAction,
	saveImageAction,
	saveTextAction,
	saveToggleAction,
	saveVideoAction,
  ],
  triggers: [
	newBlogPost,
  ],
});
