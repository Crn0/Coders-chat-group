export const memberRank = (user) => () => {
    if(user.admin) return 'THE FOOL';
    if(user.member) return 'Major Arcana';

    return 'Minor Arcana'
  };

export const postCount = (posts) => () => {
    if(posts.secretMessages?.length > 0) {

      return posts.messages.length + posts.secretMessages.length;
    }

    return posts.messages.length
  };