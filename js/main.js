$(function() {
    mHeritageGoService.getPhotos({offset:100, limit: 5})
        .then(photos => {
            console.log(photos);
            let content_center = $('#feed-main');
            let content_post = $('#feed-section');
            $(photos).each(function () {
                mHeritageGoService.getPhoto(this)
                    .then(photo => {
                        console.log(photo);
                        let new_content = content_post.first().clone();
                        new_content.find('#photo-title').text(photo['title'][0]['content']);
                        new_content.find('#photo-location').text(photo['area_name']);
                        new_content.find('#photo-time').text(photo['creation_time'].substring(0,4));
                        new_content.find('#photo-image').attr("src", "http:" + photo['image_url'] + "?size=medium");
                        new_content.find('#photo-like').text(photo['like_count']);
                        new_content.find('#photo-comment').text(photo['comment_count']);
                        new_content.find('#photo-view').text(photo['view_count']);
                        new_content.removeAttr('hidden');
                        content_center.append(new_content)
                    })
                    .catch(error => {
                        console.log(error);
                    });
            });
        })
        .catch(error => {
            console.log(error);
        });
  });
