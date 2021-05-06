const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
sharp.cache(false);
const {slugify} = require('transliteration');
slugify.config({ lowercase: true, separator: '-' });


module.exports = {

    asyncResizeImage: async (imagePath, width, height, fit) => {
        try {
            let buffer;
            let opacity = path.basename(imagePath).split('.').pop().toLowerCase() === 'png' ? 0 : 1;
            let { info } = await sharp(imagePath).toBuffer({ resolveWithObject: true });

            if (fit === 'contain' && (width > info.width && height > info.height)) {
                const leftRight = (width - info.width) / 2;
                const topBottom = (height - info.height) / 2;
                buffer = await sharp(imagePath)
                    .extend({
                        top: Math.floor(topBottom),
                        bottom: Math.ceil(topBottom),
                        left: Math.floor(leftRight),
                        right: Math.ceil(leftRight),
                        background: { r: 255, g: 255, b: 255, alpha: opacity }
                    })
                    .toBuffer();
            } else {
                buffer = await sharp(imagePath)
                    .resize({
                        width: width,
                        height: height,
                        fit: fit,
                        background: { r: 255, g: 255, b: 255, alpha: opacity }
                    })
                    .toBuffer();
            }
            return sharp(buffer).toFile(imagePath);
            /*if (!width && height > info.height){
                buffer = await sharp(imagePath)
                    .extend({
                        top: Math.floor(topBottom),
                        bottom: Math.ceil(topBottom),
                        background: { r: 255, g: 255, b: 255, alpha: opacity }
                    })
                    .toBuffer();
            }else if (!height && width > info.width){
                buffer = await sharp(imagePath)
                    .extend({
                        left: Math.floor(leftRight),
                        right: Math.ceil(leftRight),
                        background: { r: 255, g: 255, b: 255, alpha: opacity }
                    })
                    .toBuffer();
            } else if (width > info.width && height > info.height) {
                buffer = await sharp(imagePath)
                    .extend({
                        top: Math.floor(topBottom),
                        bottom: Math.ceil(topBottom),
                        left: Math.floor(leftRight),
                        right: Math.ceil(leftRight),
                        background: { r: 255, g: 255, b: 255, alpha: opacity }
                    })
                    .toBuffer();
            } else if (width > info.width || height > info.height) {
                buffer = await sharp(imagePath)
                    .resize({
                        width: width,
                        height: height,
                        fit: 'contain',
                        background: { r: 255, g: 255, b: 255, alpha: opacity }
                    })
                    .toBuffer();
            } else {
                buffer = await sharp(imagePath)
                    .resize({
                        width: width,
                        height: height,
                        fit: 'cover'
                    })
                    .toBuffer();
            }*/


        } catch (e) {
            let err = new Error(e.message);
            throw err;
        }
    },

    makeValidFileName: (fileName, fileExt, path) => {
        try {
            // to lowercase, replace space to '-', transliteration
            let newFileName = slugify(fileName);
            // replace more '---' to '-'
            while (newFileName.includes('--')) {
                newFileName = newFileName.replace(/--/g, "-")
            }
            // autoincrement the same name
            let counter = 1;
            while (fs.existsSync(path + `${newFileName}.${fileExt}`)) {
                const lastIndex = newFileName.lastIndexOf('_');
                let lastNumber;
                let nameWithoutNumber;
                if(lastIndex !== -1){
                    nameWithoutNumber = newFileName.slice(0, lastIndex);
                    lastNumber = newFileName.slice(lastIndex+1, newFileName.length);
                }
                if( lastNumber && /^\d+$/.test(lastNumber)){
                    newFileName = nameWithoutNumber + '_' + ( parseInt(lastNumber) + 1 ).toString();
                }else{
                    newFileName = newFileName+ `_${counter}`;
                }
                counter = counter + 1;
            }

            return newFileName;
        } catch (e) {
            let err = new Error(e.message);
            throw err;
        }
    },

    /*asyncResizeImage: async (imagePath, width, height, isMobile) => {
        try {
            let resizeImagePath;
            if(isMobile) {
                const filename = 'mobile-' + path.basename(imagePath);
                resizeImagePath = path.join('uploads','images', filename);
            }
            else{
                const filename = 'full-' + path.basename(imagePath);
                resizeImagePath = path.join('uploads','images', filename);
            }
            await sharp(imagePath)
                .resize({ width: width, height: height })
                .toFile(resizeImagePath);
            return path.join('/', resizeImagePath);
        } catch (e) {
            let err = new Error(e.message);
            throw err;
        }
    },*/

}
