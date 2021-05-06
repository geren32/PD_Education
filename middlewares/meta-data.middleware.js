const { models } = require('../sequelize-orm');
const postService = require('../services/post.service');

module.exports = async (req, res, next) => {
    let metaString = '';
    let url = req.url;

    const metaData = await postService.getMetaDataBySlagOrUrl(url, null);

    if (metaData && metaData.meta_title) {
        metaString = metaString + `<title>${metaData.meta_title}</title>\n`
    }
    if (metaData && metaData.meta_desc) {
        metaString = metaString + `<meta name="description" content="${metaData.meta_desc}">\n`
    }
    if (metaData && metaData.meta_keys) {
        metaString = metaString + `<meta name="keywords" content="${metaData.meta_keys}">\n`
    }
    if(metaData && metaData.meta_canonical) {
        metaString = metaString + `<link rel="canonical" href="${metaData.meta_canonical}"/>\n`
    }
    req.body.metaData = metaString;

    return next();
}
