

module.exports = {

    getDataFromUserToReq: (user) => {
        // user = JSON.parse(JSON.stringify(user));
        user= user.toJSON();
        let userDataReq={};

        if(user && user.type){
            userDataReq.userType = user.type;
            userDataReq.userid = user.id;
            if(user.client) {
                userDataReq.company_name = user.client.company_name;
                userDataReq.clientid = user.client.id;
                // userDataReq.clientData = JSON.parse(JSON.stringify(user))
            }
            if(user.dealer) {
                userDataReq.company_name = user.dealer.company_name;
                userDataReq.dealerid = user.dealer.id;
            }
            if(user.manager_sr) {
                userDataReq.company_name = user.manager_sr.company_name;
                userDataReq.managersrid = user.manager_sr.id;
            }
            if(user.manager_blum) {
                userDataReq.company_name = user.manager_blum.company_name;
                userDataReq.managerblumid = user.manager_blum.id;
            }
        }

        return userDataReq;
    },

    outputFormatGalleryContentForPosts: (post) => {
        //let data = JSON.parse(JSON.stringify(post));
        let data = post.toJSON();
        if (data && data.body && data.body.length) {
            data.body.map(i => {
                if(i.type === 1){
                    delete i['gallery_content'];
                }
                if(i.type === 2){
                    i.content = i.gallery_content;
                    delete i['gallery_content'];
                }
            });
        }
        return data;
    },

    inputFormatGalleryContentForPosts: (body, postId) => {
        let bodyData = [];
        if (body && body.length) {
            body.forEach(i =>{
                const post_id = postId ? {post_id: postId} : {};
                if (i.type == 2) {
                    let imgIds = i.content.map(content_obj => {return {uploaded_images_id: content_obj.id}});
                    bodyData.push({ type: i.type, posts_body_images: imgIds, ...post_id});
                } else {
                    bodyData.push({ type: i.type, content: i.content, ...post_id});
                }
            })
        }
        return bodyData;
    }




}
